/* ============================================================
 * services/threads/autopost.js — 규칙대로 미리 만들어 걸어둔다
 *
 * 발행 시각에 글을 만들지 않는다. 만드는 데 20~45초가 걸리고,
 * 그때 OpenAI 가 한 번 튕기면 그 자리를 통째로 놓친다.
 * 그래서 **앞으로 며칠치를 미리 만들어 Zernio 에 예약을 걸어둔다.**
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

/* 앞으로 며칠치를 미리 채울지. 값은 rules.js 한 곳에서 정한다.
 *
 * ⚠️ 예전엔 36시간이었다. 그러면 요일 판에 이틀치도 안 뜬다 —
 *    요일을 다 잡아뒀는데 「왜 오늘 것만 보이냐」가 된다.
 *    며칠치를 늘 채워두면, 하루가 지날 때마다 그 다음 날 자리가
 *    저절로 하나 붙어 **손을 안 대도 그만큼이 늘 차 있다.** */
const LOOKAHEAD_DAYS = rules.LOOKAHEAD_DAYS;
const LOOKAHEAD_H = LOOKAHEAD_DAYS * 24;   // 예전 이름을 쓰던 곳이 있어 남겨둔다
/* 한 번에 몇 자리까지. 요금이 한꺼번에 나가면 안 된다.
   처음 채울 땐 5분에 세 자리씩 차고, 그 뒤로는 하루에 하나씩만
   새로 생긴다. */
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

/* 날짜가 글 안에 박히는 주제. 다른 날로 밀면 틀린 날짜가 나간다. */
const DATED_TOPIC = { '오늘의 운세': true };

/**
 * 최근에 어떤 주제로 썼는지. 같은 주제가 되풀이되지 않게 하려고 본다.
 *
 * 규칙을 가리지 않고 그 사람 전체를 본다 — 계정이 달라도 같은 주제가
 * 연달아 나가면 읽는 쪽에서는 똑같아 보인다.
 */
async function recentTopics(userId, howMany) {
  const { rows } = await pool.query(
    `SELECT DISTINCT topic FROM th_posts
      WHERE user_id = $1 AND topic <> ''
      ORDER BY topic
      LIMIT 200`,
    [userId]
  );
  /* 최근 것부터 세려면 시간순이 필요하다. 위는 중복만 걷어낸 것이고,
     실제로 최근 몇 개를 쓸지는 아래에서 다시 시간순으로 뽑는다. */
  const { rows: last } = await pool.query(
    `SELECT topic FROM th_posts
      WHERE user_id = $1 AND topic <> ''
      ORDER BY COALESCE(slot_at, created_at) DESC
      LIMIT $2`,
    [userId, Math.max(1, Math.min(60, Number(howMany) || 20))]
  );
  const seen = {};
  last.forEach((r) => { seen[r.topic] = true; });
  return Object.keys(seen).length ? seen : (rows.length ? {} : {});
}

/**
 * 이번 차례에 쓸 주제.
 *
 * ⚠️ 키워드를 비워두면 예전엔 **인기 소재 여덟 개만** 차례로 돌았다.
 *    여덟 번이면 한 바퀴라 같은 주제가 금세 되풀이됐다.
 *    이제 소재 전부에서 고르되, **최근에 쓴 것은 빼고** 아무거나 뽑는다.
 *    인기 소재는 여러 번 넣어 조금 더 자주 걸리게 한다.
 */
function pickTopic(rule, n, form, recent) {
  const fixed = form && FIXED_TOPIC[form.id];
  if (fixed) return fixed;

  /* 적어둔 키워드가 있으면 그것을 차례대로. 순서를 정해둔 것은 지킨다. */
  const list = (rule.topics || []).filter(Boolean);
  if (list.length) return list[Math.abs(n) % list.length];

  const used = recent || {};
  const hot = topicsLib.HOT.map((h) => h.topic);
  /* 틀이 정하는 주제는 아무거나 뽑는 데서 뺀다 — 틀을 골라야 나오는 것이다 */
  const skip = {};
  Object.keys(FIXED_TOPIC).forEach((k) => { skip[FIXED_TOPIC[k]] = true; });

  const pool = [];
  topicsLib.ALL.forEach((t) => {
    if (skip[t]) return;
    pool.push(t);
    /* 반응이 터졌던 소재는 세 번 넣어 조금 더 자주 걸리게 한다 */
    if (hot.indexOf(t) >= 0) { pool.push(t); pool.push(t); }
  });

  const fresh = pool.filter((t) => !used[t]);
  const from = fresh.length ? fresh : pool;
  if (!from.length) return hot[0] || '일간별 성격';
  return from[Math.floor(Math.random() * from.length)];
}

/* 한 바퀴에 몇 개까지 걸어볼지. Zernio 만 부르니 요금은 안 나가지만,
   실패하는 글이 많으면 한 바퀴가 길어진다. */
const CATCH_UP = 5;

/**
 * 이미 만들어둔 원고를 예약에 걸어준다.
 *
 * ⚠️ 예약은 **글을 새로 만들 때만** 걸었다. 그래서 이런 일이 생겼다 —
 *      ① 「원고로만 두기」로 돌려 글이 쌓인다
 *      ② 「바로 예약까지」로 바꾼다
 *      ③ 쌓인 글은 taken() 에 걸려 다시 안 만들어진다
 *      ④ 그래서 **영영 예약되지 않는다**
 *    화면에는 「다음 확인 때 예약합니다」라고 떠 있는데 거짓말이었다.
 *    지침에 걸려 예약을 놓친 글도 마찬가지로 그대로 남았다.
 *
 * 반환 { done, errors }
 */
async function catchUp(rule) {
  if (rule.mode !== 'publish') return { done: 0, errors: [] };

  const { rows } = await pool.query(
    `SELECT id FROM th_posts
      WHERE user_id = $1 AND rule_id = $2
        AND status = 'draft' AND slot_at IS NOT NULL AND slot_at > NOW()
      ORDER BY slot_at
      LIMIT $3`,
    [rule.userId, rule.id, CATCH_UP]
  );
  if (!rows.length) return { done: 0, errors: [] };

  let done = 0;
  const errors = [];
  for (const r of rows) {
    try {
      const saved = await store.getPost(rule.userId, r.id);
      if (!saved || !saved.slotAt) continue;
      await publish.scheduleAt(rule.userId, saved, new Date(saved.slotAt), {
        auto: true, accountId: rule.accountId || undefined,
      });
      done++;
    } catch (e) {
      /* 지침에 걸린 글은 다음 바퀴에도 또 걸린다. 첫 번째 것만 알린다 —
         같은 말을 다섯 줄 쌓아봐야 읽는 데 방해만 된다. */
      if (!errors.length) errors.push('이미 만든 글 예약 실패 — ' + e.message);
    }
  }
  return { done, errors };
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
    `SELECT id, slot_at, topic FROM th_posts
      WHERE user_id = $1 AND rule_id = $2
        AND status = 'draft' AND slot_at IS NOT NULL AND slot_at < $3
      ORDER BY slot_at`,
    [rule.userId, rule.id, now.toISOString()]
  );
  if (!rows.length) return 0;

  /* 앞으로 비어 있는 자리를 미리 훑어둔다.
     ⚠️ 예전엔 「그 요일의 다음 번」 한 자리만 봤다. 일주일치를 미리
        채우게 되면서 그 자리는 늘 차 있다 — 그래서 아무것도 못 밀었다.
        빈 자리를 앞에서부터 찾아야 한다. */
  const free = [];
  for (const x of rules.plan(rule, LOOKAHEAD_DAYS)) {
    if (!(await taken(rule.userId, rule.id, x.sendAt))) free.push(x.sendAt);
  }

  let moved = 0;
  for (const r of rows) {
    /* ⚠️ 날짜가 글 안에 박힌 것은 밀면 안 된다.
          「오늘은 계미일입니다」로 쓴 월요일 운세를 토요일로 옮기면
          날짜가 틀린 글이 나간다. 그런 글은 지난 자리에 그대로 두고,
          요일 판에서 「안 올림」으로 보이게 한다. */
    if (DATED_TOPIC[r.topic]) continue;

    const slot = rules.slotOf(rule, r.slot_at);
    /* 규칙에서 그 자리를 없앤 경우다. 자리가 없으니 밀 곳도 없다. */
    if (!slot) continue;

    const sendAt = free.shift();
    if (!sendAt) break;                    // 일주일이 다 찼다. 다음에 민다.

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

  /* 이미 만들어둔 원고부터 걸어준다.
     ⚠️ OpenAI 키 검사보다 **위**에 있어야 한다 — 예약을 거는 데는
        키가 필요 없다. 키가 없다고 쌓인 원고까지 못 나가면 안 된다. */
  let caught = 0;
  try {
    const up = await catchUp(rule);
    caught = up.done;
    up.errors.forEach((x) => errors.push(x));
  } catch (e) {
    console.error('[스레드] 이미 만든 글 예약 실패:', e.message);
  }

  if (!rule.openaiKey) {
    return { made, errors: errors.concat(['OpenAI 키가 없습니다']), caught };
  }

  /* 이 규칙이 어느 계정으로 나가는지. 말투·인사글·운세 틀이 계정마다 다르다. */
  const settings = await store.getSettings(rule.userId, rule.accountId || undefined);
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

  /* 키워드를 안 적어두셨으면 소재를 아무거나 뽑는다.
     그때 최근에 쓴 것이 또 나오지 않게 한 번만 읽어둔다. */
  let recent = {};
  try {
    recent = await recentTopics(rule.userId, 20);
  } catch (e) {
    console.error('[스레드] 최근 주제 읽기 실패:', e.message);
  }

  for (const s of slots) {
    if (made.length >= PER_TICK) break;
    if (await taken(rule.userId, rule.id, s.sendAt)) continue;

    /* 슬롯이 틀을 콕 집어뒀으면 그것을 쓴다 — 「토 아침은 운세」처럼.
       안 집었으면 고른 것들을 돌려 쓴다. */
    const form = (s.slot.form && forms.byId(s.slot.form)) || forms.next(pickable, cursor);
    const topic = pickTopic(rule, cursor, form, recent);

    try {
      /* 한 자리에 글 하나만 만든다. 여러 개 만들어 고르는 건 사람이 할 때 이야기다. */
      const out = await pipeline.generate(rule.userId, rule.openaiKey, topic, 1, {
        form,
        /* 이 규칙의 계정 몫 설정으로 만든다 */
        accountId: rule.accountId || undefined,
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
          await publish.scheduleAt(rule.userId, saved, s.sendAt, {
            auto: true, accountId: rule.accountId || undefined,
          });
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

  return { made, errors, moved, caught };
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

module.exports = { tick, runRule, rollForward, catchUp, pickTopic, recentTopics,
  LOOKAHEAD_DAYS, LOOKAHEAD_H, PER_TICK };
