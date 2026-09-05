/* ============================================================
 * services/threads/autopost.js — 규칙대로 미리 만들어 걸어둔다
 *
 * 발행 시각에 글을 만들지 않는다. 만드는 데 20~45초가 걸리고,
 * 그때 OpenAI 가 한 번 튕기면 그 자리를 통째로 놓친다.
 * 그래서 **앞으로 36시간치를 미리 만들어 Zernio 에 예약을 걸어둔다.**
 * 걸어두면 우리 서버가 꺼져 있어도 시간이 되면 Zernio 가 올린다.
 *
 * 같은 자리에 두 번 만들지 않는 것이 제일 중요하다.
 * th_posts(user_id, rule_id, slot_at) 에 유니크 색인을 걸어두고,
 * 넣기 전에도 한 번 본다. 색인은 최후의 방어선이다.
 * ============================================================ */

const { pool } = require('../../db');
const store = require('./store');
const rules = require('./rules');
const forms = require('./forms');
const pipeline = require('./pipeline');
const topicsLib = require('./topics');
const publish = require('./publish');

const LOOKAHEAD_H = 36;      // 앞으로 몇 시간치를 미리 채울지
const PER_TICK = 3;          // 한 번에 몇 자리까지. 요금이 한꺼번에 나가면 안 된다

/**
 * 이 자리에 이미 글이 있나.
 *
 * ⚠️ **저장할 때 쓴 시각과 같은 값으로 찾아야 한다.**
 *    예전엔 정한 시각(08:10)으로 찾고 어긋낸 시각(08:16)으로 저장했다.
 *    그래서 영영 못 찾고 5분마다 같은 자리를 다시 만들었다 —
 *    OpenAI 요금은 나가고 저장은 유니크 색인에 막혀 실패한다.
 *    항상 sendAt(실제 나갈 시각)으로 넘긴다.
 */
async function taken(userId, ruleId, at) {
  const { rows } = await pool.query(
    'SELECT 1 FROM th_posts WHERE user_id = $1 AND rule_id = $2 AND slot_at = $3',
    [userId, ruleId, at.toISOString()]
  );
  return rows.length > 0;
}

/**
 * 이번 차례에 쓸 주제. 규칙에 적어둔 것을 돌려 쓰고, 비었으면 반응 터진 소재에서.
 *
 * ⚠️ 틀이 주제를 정해버리는 경우가 있다.
 *    「오늘의 운세」에 키워드 「역마살」을 주면 프롬프트에
 *    「주제: 역마살」과 「이번 글은 오늘의 운세」가 같이 들어가 서로 싸운다.
 *    실제로 운세를 고르고 키워드를 적었더니 일간별 정보글이 나왔다.
 *    이런 틀은 키워드를 무시하고 자기 주제를 쓴다.
 */
const FIXED_TOPIC = {
  daily: '오늘의 운세',
  intro: '무료사주 인사',
};

function pickTopic(rule, n, form) {
  const fixed = form && FIXED_TOPIC[form.id];
  if (fixed) return fixed;

  const list = (rule.topics || []).filter(Boolean);
  if (list.length) return list[Math.abs(n) % list.length];
  const hot = topicsLib.HOT.map((h) => h.topic);
  return hot[Math.abs(n) % hot.length];
}

/**
 * 규칙 하나를 훑어 빈 자리를 채운다.
 * 반환 { made, errors }
 */
async function runRule(rule) {
  const made = [];
  const errors = [];

  if (!rule.openaiKey) {
    return { made, errors: ['OpenAI 키가 없습니다'] };
  }

  const settings = await store.getSettings(rule.userId);
  const hasIntro = !!(settings.intro &&
    (settings.intro.name || settings.intro.career || settings.intro.sample));
  const pickable = forms.clean(rule.forms, { hasIntro });

  const slots = rules.upcoming(rule, LOOKAHEAD_H);
  let cursor = rule.cursor || 0;

  for (const s of slots) {
    if (made.length >= PER_TICK) break;
    if (await taken(rule.userId, rule.id, s.sendAt)) continue;

    /* 슬롯이 틀을 콕 집어뒀으면 그것을 쓴다 — 「토 아침은 운세」처럼.
       안 집었으면 고른 것들을 돌려 쓴다. */
    const form = (s.slot.form && forms.byId(s.slot.form)) || forms.next(pickable, cursor);
    const topic = pickTopic(rule, cursor, form);

    try {
      /* 한 자리에 글 하나만 만든다. 여러 개 만들어 고르는 건 사람이 할 때 이야기다. */
      const out = await pipeline.generate(rule.userId, rule.openaiKey, topic, 1, {
        form,
        /* 지금이 아니라 이 글이 올라갈 시각. 「오늘의 운세」가 이걸 보고 날짜를 적는다. */
        at: s.sendAt,
        /* 이 규칙이 댓글을 받기로 했는지. 슬롯이 「댓글 유도형」이면 그건 당연히 받는다. */
        askComments: rule.askComments === 'yes' ? true
          : rule.askComments === 'no' ? false : null,
        auto: true,
      });
      const post = (out.posts || [])[0];
      if (!post) { errors.push(rules.slotLabel(s.slot) + ': 글이 비었습니다'); continue; }

      const ids = await store.insertPosts(rule.userId, [{
        /* 틀이 주제를 정한 경우엔 모델이 고쳐 보낸 주제를 쓰지 않는다.
           「오늘의 운세」가 「일간별 성격」으로 둔갑해 저장되던 일이 있었다. */
        topic: FIXED_TOPIC[form.id] || out.topic || topic,
        situation: out.situation || '',
        hooks: post.hooks,
        postType: post.postType,
        form: 'single',
        parts: post.parts,
        replyText: post.replyText || '',
        numbered: !!post.numbered,
        cta: post.cta,
        status: 'draft',
        auto: true,
        ruleId: rule.id,
        slotAt: s.sendAt.toISOString(),
      }]);
      await store.markHooksUsed(rule.userId, post.hooks);

      /* 「바로 예약」 규칙이면 그 자리에서 Zernio 에 걸어둔다.
         걸어두면 우리 서버가 꺼져 있어도 시간이 되면 올라간다.
         못 걸어도 글은 남는다 — 원고로 두고 사람이 보고 판단하면 된다. */
      if (rule.mode === 'publish') {
        try {
          const saved = await store.getPost(rule.userId, ids[0]);
          await publish.scheduleAt(rule.userId, saved, s.sendAt, { auto: true });
        } catch (e) {
          errors.push(rules.slotLabel(s.slot) + ': 예약 실패 — ' + e.message);
        }
      }

      made.push({ id: ids[0], at: s.sendAt, form: form.id, topic });
      cursor++;
    } catch (e) {
      errors.push(rules.slotLabel(s.slot) + ': ' + e.message);
      /* 한 자리가 실패했다고 나머지까지 붙잡지 않는다.
         다만 키가 틀렸거나 잔액이 없으면 계속 실패하므로 여기서 멈춘다. */
      if (e.code === 'NO_KEY' || e.code === 'API_401' || e.code === 'API_429') break;
    }
  }

  await rules.save(rule.userId, rule.id, {
    cursor,
    lastRunAt: new Date().toISOString(),
    lastError: errors.length ? errors[0] : '',
  });

  return { made, errors };
}

/** 켜져 있는 규칙을 전부 훑는다 */
async function tick() {
  const list = await rules.active();
  const out = { rules: 0, made: 0, errors: [] };
  for (const rule of list) {
    out.rules++;
    try {
      const r = await runRule(rule);
      out.made += r.made.length;
      r.errors.forEach((e) => out.errors.push((rule.name || rule.id) + ': ' + e));
    } catch (e) {
      out.errors.push((rule.name || rule.id) + ': ' + e.message);
    }
  }
  return out;
}

module.exports = { tick, runRule, LOOKAHEAD_H, PER_TICK };
