/* ============================================================
 * services/threads/autopost.js — 규칙대로 미리 만들어 걸어둔다
 *
 * 발행 시각에 글을 만들지 않는다. 만드는 데 20~45초가 걸리고,
 * 그때 OpenAI 가 한 번 튕기면 그 자리를 통째로 놓친다.
 * 그래서 **앞으로 일주일치를 미리 만들어 Zernio 에 예약을 걸어둔다.**
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

/* 앞으로 며칠치를 미리 채울지.
 *
 * ⚠️ 예전엔 36시간이었다. 그러면 요일 판에 이틀치만 뜬다 —
 *    일곱 요일을 다 잡아뒀는데 「왜 월요일만 보이냐」가 된다.
 *    일주일치를 늘 채워두면, 하루가 지날 때마다 그 다음 날 자리가
 *    저절로 하나 붙어 **손을 안 대도 일주일이 늘 차 있다.** */
const LOOKAHEAD_DAYS = 7;
const LOOKAHEAD_H = LOOKAHEAD_DAYS * 24;   // 예전 이름을 쓰던 곳이 있어 남겨둔다
/* 한 번에 몇 자리까지. 요금이 한꺼번에 나가면 안 된다.
   일주일치 일곱 자리를 처음 채울 땐 5분씩 세 바퀴면 다 찬다.
   그 뒤로는 하루에 하나씩만 새로 생긴다. */
const PER_TICK = 3;

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
 * 시각이 지났는데 아직 안 올라간 원고를 **다음 차례로 민다.**
 *
 * 안 밀면 「올라갈 글」에 어제 자리가 그대로 남아 영영 안 나간다.
 * 시각이 지났다고 글을 버리는 것도 아깝다 — 자리만 옮겨준다.
 *
 * 예약(scheduled)까지 걸린 글은 건드리지 않는다. Zernio 가 이미 들고 있어서
 * 여기서 시각만 바꾸면 화면과 실제가 어긋난다.
 *
 * 반환 옮긴 개수
 */
async function rollForward(rule) {
  const now = new Date();
  const { rows } = await pool.query(
    `SELECT id, slot_at FROM th_posts
      WHERE user_id = $1 AND rule_id = $2
        AND status = 'draft' AND slot_at IS NOT NULL AND slot_at < $3
      ORDER BY slot_at`,
    [rule.userId, rule.id, now.toISOString()]
  );
  if (!rows.length) return 0;

  let moved = 0;
  for (const r of rows) {
    const slot = rules.slotOf(rule, r.slot_at);
    /* 규칙에서 그 자리를 없앤 경우다. 자리가 없으니 밀 곳도 없다. */
    if (!slot) continue;

    const at = rules.nextSlotTime(slot, now);
    const sendAt = rules.jitter(at, rule.jitterMin, rule.id + at.toISOString());
    /* 그 자리에 이미 다른 글이 있으면 밀지 않는다. 두 개가 겹친다. */
    if (await taken(rule.userId, rule.id, sendAt)) continue;

    await store.updatePost(rule.userId, r.id, { slotAt: sendAt.toISOString() });
    moved++;
  }
  return moved;
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

  /* 지난 자리에 남은 원고부터 다음 차례로 민다.
     이걸 먼저 해야 「빈 자리」가 제대로 계산된다 — 안 그러면 민 자리에
     새 글을 또 만들어 두 개가 겹친다. */
  let moved = 0;
  try {
    moved = await rollForward(rule);
  } catch (e) {
    console.error('[스레드] 지난 자리 밀기 실패:', e.message);
  }

  /* upcoming() 은 슬롯마다 「다음 한 번」만 준다.
     일주일을 채우려면 되풀이되는 것까지 펴야 한다. */
  const slots = rules.plan(rule, LOOKAHEAD_DAYS);
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

  return { made, errors, moved };
}

/** 켜져 있는 규칙을 전부 훑는다 */
async function tick() {
  const list = await rules.active();
  const out = { rules: 0, made: 0, moved: 0, errors: [] };
  for (const rule of list) {
    out.rules++;
    try {
      const r = await runRule(rule);
      out.made += r.made.length;
      out.moved += r.moved || 0;
      r.errors.forEach((e) => out.errors.push((rule.name || rule.id) + ': ' + e));
    } catch (e) {
      out.errors.push((rule.name || rule.id) + ': ' + e.message);
    }
  }
  return out;
}

module.exports = { tick, runRule, rollForward, LOOKAHEAD_DAYS, LOOKAHEAD_H, PER_TICK };
