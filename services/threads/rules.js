/* ============================================================
 * services/threads/rules.js — 자동 발행 규칙
 *
 * 「무슨 요일 몇 시에, 어떤 키워드로, 어떤 모양의 글을」 을 담는다.
 *
 * ⚠️ 왜 요일마다 시각을 따로 두는가
 *    매일 같은 시각에 글이 올라가면 사람이 아니라 기계로 잡힌다.
 *    노출이 줄고, 심하면 계정이 정지된다. 그래서 슬롯을 요일+시각으로
 *    잡게 하고, 거기에 다시 ±몇 분을 흔들어 붙인다.
 *    흔드는 폭은 규칙마다 정한다 (jitterMin).
 *
 * 시각은 전부 한국 시각으로 적는다. 서버는 UTC 로 돈다.
 * ============================================================ */

const crypto = require('crypto');
const { pool } = require('../../db');
const forms = require('./forms');

const TZ_OFFSET_MS = 9 * 60 * 60 * 1000;
const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

/* 며칠치를 미리 만들어 둘지. **한 곳에서만 정한다** —
   숫자와 안내 문구가 따로 놀면 「3일이라더니 왜 이틀만 있냐」가 된다.
   화면 문구도 이 값을 받아서 쓴다. */
const LOOKAHEAD_DAYS = 3;
const MAX_SLOTS = 21;      // 하루 세 번 × 이레. 그 이상은 광고 계정이 된다
const MAX_RULES = 10;

function newId() {
  return crypto.randomBytes(5).toString('hex');
}

/* ── 읽고 쓰기 ────────────────────────────────────── */

function rowToRule(r) {
  return {
    id: r.id,
    name: r.name || '',
    enabled: !!r.enabled,
    /* 어느 계정으로 나갈지. 계정을 두세 개 돌리면 규칙마다 달라야 한다. */
    accountId: r.account_id == null ? null : Number(r.account_id),
    slots: r.slots || [],
    jitterMin: r.jitter_min == null ? 7 : Number(r.jitter_min),
    topics: r.topics || [],
    forms: r.forms || [],
    mode: r.mode || 'draft',
    askComments: r.ask_comments || '',
    cursor: Number(r.cursor) || 0,
    lastRunAt: r.last_run_at ? new Date(r.last_run_at).toISOString() : null,
    lastError: r.last_error || '',
  };
}

async function list(userId) {
  const { rows } = await pool.query(
    'SELECT * FROM th_rules WHERE user_id = $1 ORDER BY created_at',
    [userId]
  );
  return rows.map(rowToRule);
}

async function get(userId, id) {
  const { rows } = await pool.query(
    'SELECT * FROM th_rules WHERE user_id = $1 AND id = $2', [userId, id]
  );
  return rows[0] ? rowToRule(rows[0]) : null;
}

/** 켜져 있고 슬롯이 있는 규칙만 (스케줄러가 본다) */
async function active() {
  const { rows } = await pool.query(
    `SELECT r.*, u.openai_key
       FROM th_rules r JOIN users u ON u.id = r.user_id
      WHERE r.enabled = TRUE AND jsonb_array_length(r.slots) > 0`
  );
  return rows.map((r) => Object.assign(rowToRule(r), {
    userId: r.user_id,
    openaiKey: r.openai_key || '',
  }));
}

/** 값을 다듬는다. 화면에서 막아도 여기서 한 번 더 조인다. */
function clean(patch, opts) {
  const o = opts || {};
  const out = {};

  if (typeof patch.name === 'string') out.name = patch.name.trim().slice(0, 40);
  if (typeof patch.enabled === 'boolean') out.enabled = patch.enabled;

  if (Array.isArray(patch.slots)) {
    const seen = new Set();
    out.slots = patch.slots
      .map((s) => {
        const one = {
          day: Math.max(0, Math.min(6, Number(s && s.day))),
          time: hhmm(s && s.time),
        };
        /* 이 자리는 이 틀로 — 「토 아침은 운세」처럼 못 박을 수 있다.
           안 정하면 규칙에서 고른 틀들을 돌려 쓴다. */
        const f = forms.byId(s && s.form);
        if (f && !(f.needsIntro && !o.hasIntro)) one.form = f.id;
        return one;
      })
      .filter((s) => Number.isFinite(s.day) && s.time)
      .filter((s) => {
        const k = s.day + ' ' + s.time;
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      })
      .sort((a, b) => (a.day - b.day) || a.time.localeCompare(b.time))
      .slice(0, MAX_SLOTS);
  }

  if (patch.jitterMin != null) {
    out.jitterMin = Math.max(0, Math.min(30, Number(patch.jitterMin) || 0));
  }
  if (Array.isArray(patch.topics)) {
    out.topics = patch.topics
      .map((t) => String(t == null ? '' : t).trim().slice(0, 60))
      .filter(Boolean).slice(0, 30);
  }
  if (Array.isArray(patch.forms)) {
    out.forms = forms.clean(patch.forms, { hasIntro: !!o.hasIntro });
  }
  if (patch.mode === 'publish' || patch.mode === 'draft') out.mode = patch.mode;
  /* 계정을 골라 담는다. 0·빈 값이면 「지금 고른 계정」을 쓴다는 뜻이다. */
  if (patch.accountId !== undefined) {
    const n = Number(patch.accountId);
    out.accountId = n > 0 ? n : null;
  }
  /* 'yes' 댓글 받기 · 'no' 조르지 않기 · '' 글마다 알아서 */
  if (['yes', 'no', ''].indexOf(patch.askComments) >= 0) out.askComments = patch.askComments;

  return out;
}

const COLS = {
  name: 'name', enabled: 'enabled', slots: 'slots', jitterMin: 'jitter_min',
  topics: 'topics', forms: 'forms', mode: 'mode', cursor: 'cursor',
  askComments: 'ask_comments', accountId: 'account_id',
  lastRunAt: 'last_run_at', lastError: 'last_error',
};
const JSON_COLS = new Set(['slots', 'topics', 'forms']);

async function save(userId, id, patch) {
  const rid = id || newId();
  if (!id) {
    const { rows } = await pool.query(
      'SELECT COUNT(*)::int AS n FROM th_rules WHERE user_id = $1', [userId]
    );
    if (rows[0].n >= MAX_RULES) {
      const e = new Error('규칙은 ' + MAX_RULES + '개까지 만들 수 있습니다.');
      e.code = 'TOO_MANY';
      throw e;
    }
    await pool.query('INSERT INTO th_rules (id, user_id) VALUES ($1, $2)', [rid, userId]);
  }

  const sets = [];
  const args = [userId, rid];
  Object.keys(patch || {}).forEach((k) => {
    const col = COLS[k];
    if (!col) return;
    args.push(JSON_COLS.has(col) ? JSON.stringify(patch[k]) : patch[k]);
    sets.push(col + ' = $' + args.length);
  });
  if (sets.length) {
    await pool.query(
      'UPDATE th_rules SET ' + sets.join(', ') + ' WHERE user_id = $1 AND id = $2', args
    );
  }
  return get(userId, rid);
}

async function remove(userId, id) {
  await pool.query('DELETE FROM th_rules WHERE user_id = $1 AND id = $2', [userId, id]);
}

/* ── 시각 계산 ────────────────────────────────────── */

/** '8:5' 도 '08:05' 로 받아준다. 못 읽으면 빈 문자열. */
function hhmm(v) {
  const m = String(v == null ? '' : v).match(/^(\d{1,2})\s*:\s*(\d{1,2})$/);
  if (!m) return '';
  const h = Number(m[1]);
  const mi = Number(m[2]);
  if (h < 0 || h > 23 || mi < 0 || mi > 59) return '';
  return String(h).padStart(2, '0') + ':' + String(mi).padStart(2, '0');
}

/** 한국 시각 기준의 요일·시·분 */
function kstParts(date) {
  const k = new Date(date.getTime() + TZ_OFFSET_MS);
  return { day: k.getUTCDay(), h: k.getUTCHours(), m: k.getUTCMinutes() };
}

/**
 * from 이후로 이 슬롯이 처음 오는 시각(UTC Date).
 * 슬롯은 한국 시각으로 적혀 있다.
 */
function nextSlotTime(slot, from) {
  const k = new Date(from.getTime() + TZ_OFFSET_MS);
  const [h, mi] = slot.time.split(':').map(Number);

  let ahead = (slot.day - k.getUTCDay() + 7) % 7;
  const target = new Date(Date.UTC(
    k.getUTCFullYear(), k.getUTCMonth(), k.getUTCDate() + ahead, h, mi, 0, 0
  ));
  /* 오늘인데 이미 지났으면 다음 주 같은 요일 */
  if (target.getTime() <= k.getTime()) target.setUTCDate(target.getUTCDate() + 7);
  return new Date(target.getTime() - TZ_OFFSET_MS);
}

/**
 * 지금부터 hours 시간 안에 오는 슬롯들을 이른 순으로.
 * 흔들기(jitter)까지 얹어서 돌려준다 — 같은 시각에 딱딱 떨어지면 기계로 보인다.
 */
function upcoming(rule, hours, from) {
  const now = from || new Date();
  const until = now.getTime() + (hours || 36) * 3600 * 1000;

  return (rule.slots || [])
    .map((s) => {
      const at = nextSlotTime(s, now);
      return { slot: s, at, key: at.toISOString() };
    })
    .filter((x) => x.at.getTime() <= until)
    .map((x) => Object.assign(x, { sendAt: jitter(x.at, rule.jitterMin, rule.id + x.key) }))
    .sort((a, b) => a.at - b.at);
}

/**
 * 앞으로 며칠간 이 규칙이 잡아둔 자리를 **모두** 펼친다.
 *
 * upcoming() 은 슬롯마다 「다음 한 번」만 준다. 요일 판에는 이번 주와
 * 다음 주가 같이 보여야 하니, 같은 슬롯이 주마다 되풀이되는 것까지 펴야 한다.
 */
function plan(rule, days, from) {
  const now = from || new Date();
  const until = now.getTime() + (days || 14) * 24 * 3600 * 1000;
  const out = [];

  (rule.slots || []).forEach((s) => {
    let at = nextSlotTime(s, now);
    while (at.getTime() <= until) {
      const key = at.toISOString();
      out.push({
        slot: s,
        at,
        key,
        sendAt: jitter(at, rule.jitterMin, rule.id + key),
      });
      at = new Date(at.getTime() + 7 * 24 * 3600 * 1000);
    }
  });
  return out.sort((a, b) => a.at - b.at);
}

/**
 * 정한 시각에서 ± 몇 분 흔든다.
 * 무작위로 하면 볼 때마다 값이 바뀌어 「몇 시에 올라가나」를 알 수 없다.
 * 규칙과 시각으로 씨앗을 만들어 **같은 자리는 늘 같은 값**이 나오게 한다.
 */
function jitter(at, minutes, seed) {
  const span = Math.max(0, Number(minutes) || 0);
  if (!span) return at;
  const h = crypto.createHash('sha1').update(String(seed)).digest();
  const off = (h[0] / 255) * span * 2 - span;      // -span ~ +span
  return new Date(at.getTime() + Math.round(off) * 60 * 1000);
}

/**
 * 이 시각이 이 규칙의 어느 슬롯이었는지 되찾는다.
 *
 * 저장된 시각은 어긋내기(jitter)가 얹힌 값이라 슬롯 시각과 딱 맞지 않는다.
 * 요일이 같고 시각이 어긋내기 폭 안이면 그 슬롯으로 본다.
 */
function slotOf(rule, at) {
  const k = kstParts(new Date(at));
  const span = Math.max(0, Number(rule.jitterMin) || 0) + 1;
  const mins = k.h * 60 + k.m;

  return (rule.slots || []).find((s) => {
    if (s.day !== k.day) return false;
    const [h, mi] = s.time.split(':').map(Number);
    return Math.abs(mins - (h * 60 + mi)) <= span;
  }) || null;
}

/** 화면에 「월 08:10」 처럼 */
function slotLabel(slot) {
  const f = slot.form ? forms.byId(slot.form) : null;
  return DAY_NAMES[slot.day] + ' ' + slot.time + (f ? ' · ' + f.label : '');
}

/**
 * 이 규칙이 지금 도는지, 안 돈다면 왜인지 한 줄로.
 *
 * 「저장했는데 아무것도 안 올라간다」가 제일 답답하다. 로그를 볼 수 없으니
 * 화면에서 바로 보여야 한다.
 *
 * ctx = { hasKey, allowPublish, hasAccount, filled }
 *   filled — 앞으로 며칠 안에 이미 채워둔 자리 개수
 */
function diagnose(rule, ctx) {
  const c = ctx || {};
  const soon = plan(rule, LOOKAHEAD_DAYS).length;

  if (!rule.enabled) return { ok: false, why: '꺼져 있습니다. 위 「켜기」를 체크해주세요.' };
  if (!(rule.slots || []).length) return { ok: false, why: '올릴 자리가 없습니다. 요일과 시각을 더해주세요.' };
  if (!c.hasKey) {
    return { ok: false, why: 'OpenAI 키가 없습니다. 「무료사주 · API 설정」에서 등록해주세요.' };
  }
  if (rule.mode === 'publish' && !c.hasAccount) {
    /* 규칙이 계정을 집어뒀는데 그 계정이 사라진 경우다.
       「계정이 없습니다」만 보면 등록해둔 게 있는데 왜 그러나 싶다. */
    if (rule.accountId) {
      return {
        ok: false,
        why: '이 규칙이 쓰던 계정이 없어졌습니다. 아래 「어느 계정으로」에서 다시 골라주세요.',
      };
    }
    return { ok: false, why: '올릴 스레드 계정이 없습니다. 설정에서 등록하거나 「원고로만 두기」로 바꿔주세요.' };
  }
  if (rule.mode === 'publish' && !c.allowPublish) {
    return { ok: false, why: '올리기가 잠겨 있습니다. 설정에서 「스레드에 올리기 허용」을 켜주세요.' };
  }
  if (!soon) {
    return { ok: true, why: '앞으로 ' + LOOKAHEAD_DAYS + '일 안에 올릴 자리가 없습니다. 그 자리가 다가오면 만듭니다.' };
  }
  if (c.filled >= soon) {
    return { ok: true, why: LOOKAHEAD_DAYS + '일치를 이미 다 만들어뒀습니다. 아래 요일 판에서 확인하세요.' };
  }
  /* 계정을 집어둔 규칙은 어디로 나가는지 같이 보여준다.
     계정이 두세 개면 「이건 어느 계정이지」가 늘 헷갈린다. */
  const where = rule.accountId && c.accountName ? ' @' + c.accountName + ' 으로 나갑니다.' : '';
  return {
    ok: true,
    why: '다음 확인 때 ' + (soon - c.filled) + '개를 만듭니다. (5분마다 돕니다)' + where,
  };
}

/**
 * 같은 시각에 몰려 있는지 본다.
 * 매일 같은 시각이면 기계로 잡힌다 — 저장은 시켜주되 화면에 경고를 띄운다.
 */
function sameTimeWarning(slots) {
  const list = (slots || []).map((s) => s.time);
  if (list.length < 3) return '';
  const counts = {};
  list.forEach((t) => { counts[t] = (counts[t] || 0) + 1; });
  const worst = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
  if (counts[worst] >= 3) {
    return counts[worst] + '개가 모두 ' + worst + ' 입니다. ' +
      '매일 같은 시각에 올라가면 기계로 잡혀 노출이 줄고 심하면 계정이 멈춥니다. ' +
      '요일마다 시각을 다르게 잡아주세요.';
  }
  return '';
}

module.exports = {
  list, get, active, save, remove, clean,
  upcoming, plan, nextSlotTime, slotLabel, sameTimeWarning, kstParts, hhmm, jitter, slotOf, diagnose,
  DAY_NAMES, MAX_SLOTS, MAX_RULES, LOOKAHEAD_DAYS,
};
