/* ============================================================
 * msiteQuota.js — 만세력 신청란의 「하루 N명」 자리 안내
 *
 * 손님이 만세력을 보고 신청하려 할 때
 *   · 오늘 몇 자리 남았는지
 *   · 5천원 깎인 금액이 얼마인지
 * 를 보여준다. 자리가 다 차면 다음날 순번으로 받거나 신청을 막는다.
 *
 * 자리는 「오늘 이 만세력 링크로 들어온 신청자 수」로 자동으로 센다.
 * 교육생이 매일 손으로 고칠 필요가 없고, 자정이 지나면 다시 채워진다.
 * ============================================================ */

/** 설정 기본값 — 아무것도 안 건드린 교육생은 이 값으로 돈다 */
const DEFAULTS = {
  on: false,        // 꺼둔 상태로 시작한다. 켜는 건 교육생이 정한다
  cap: 5,           // 하루 정원
  seed: 0,          // 미리 채운 것으로 칠 인원 (희소성 조절용)
  discount: 5000,   // 정원 안에 들면 깎아주는 금액
  full: 'next',     // 다 찼을 때 — 'next' 다음날 순번 / 'block' 신청 막기
};

const clampInt = (v, lo, hi, dflt) => {
  const n = parseInt(String(v == null ? '' : v).replace(/[^0-9-]/g, ''), 10);
  if (!Number.isFinite(n)) return dflt;
  return Math.min(hi, Math.max(lo, n));
};

/** 저장된 설정을 안전한 모양으로 정리한다 */
function clean(raw) {
  let o = raw;
  if (typeof o === 'string') { try { o = JSON.parse(o); } catch (e) { o = null; } }
  if (!o || typeof o !== 'object') o = {};
  return {
    on: o.on === true || o.on === 'on' || o.on === '1',
    cap: clampInt(o.cap, 1, 99, DEFAULTS.cap),
    seed: clampInt(o.seed, 0, 98, DEFAULTS.seed),
    discount: clampInt(o.discount, 0, 1000000, DEFAULTS.discount),
    full: o.full === 'block' ? 'block' : 'next',
  };
}

/** 오늘 0시 (한국 시간) — 자정이 지나면 자리가 다시 찬다 */
function todayStartKST() {
  const now = new Date(Date.now() + 9 * 3600 * 1000);
  const y = now.getUTCFullYear(), m = now.getUTCMonth(), d = now.getUTCDate();
  // 한국 0시 = UTC 전날 15시
  return new Date(Date.UTC(y, m, d, 0, 0, 0) - 9 * 3600 * 1000);
}

/**
 * 오늘 이 교육생의 만세력 링크로 들어온 신청자 수
 * (DB 가 잠깐 말썽이어도 신청은 막지 않는다 — 0 으로 본다)
 */
async function todayCount(pool, teacherId) {
  try {
    const { rows } = await pool.query(
      `SELECT COUNT(*)::int AS n FROM leads
        WHERE teacher_id = $1 AND source = '만세력' AND created_at >= $2`,
      [teacherId, todayStartKST()]
    );
    return (rows[0] && rows[0].n) || 0;
  } catch (e) {
    console.error('[만세력] 오늘 신청자 수를 못 셌습니다:', e.message);
    return 0;
  }
}

/**
 * 지금 상태를 계산한다.
 * @returns {{on, cap, left, taken, full, mode, discount}}
 */
function stateOf(cfg, taken) {
  const c = clean(cfg);
  if (!c.on) return { on: false, cap: c.cap, taken: 0, left: c.cap, full: false, mode: c.full, discount: 0 };
  const used = Math.max(0, Number(taken) || 0) + c.seed;
  const left = Math.max(0, c.cap - used);
  return {
    on: true,
    cap: c.cap,
    taken: used,
    left,
    full: left <= 0,
    mode: c.full,
    discount: c.discount,
  };
}

/** 설정 + 오늘 집계를 한 번에 */
async function load(pool, teacher) {
  const cfg = clean(teacher && teacher.msite_limit);
  if (!cfg.on) return stateOf(cfg, 0);
  const taken = await todayCount(pool, teacher.id);
  return stateOf(cfg, taken);
}

/** 상품 이름에서 금액만 — '정밀 풀이 (25,000원)' → 25000 */
function priceOf(product) {
  const m = String(product || '').match(/([\d,]{3,})\s*원/);
  if (!m) return null;
  const n = parseInt(m[1].replace(/,/g, ''), 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

const won = (n) => Number(n).toLocaleString('ko-KR');

/**
 * 상품마다 할인 전·후 금액을 계산한다.
 * 자리가 남아 있을 때만 깎아준다. 0원 밑으로는 안 내려간다.
 */
function priceList(products, st) {
  const give = !!(st && st.on && !st.full && st.discount > 0);
  return (products || []).map((name) => {
    const raw = priceOf(name);
    if (raw == null) return { name, raw: null, price: null, sale: false };
    const price = give ? Math.max(0, raw - st.discount) : raw;
    return { name, raw, price, sale: give && price < raw };
  });
}

/** 손님에게 보여줄 안내 문구 */
function notice(st) {
  if (!st || !st.on) return null;
  if (!st.full) {
    return {
      head: `하루 ${st.cap}명만 받습니다`,
      left: `오늘 ${st.left}자리 남았습니다`,
      sale: st.discount > 0 ? `지금 신청하시면 ${won(st.discount)}원 깎아드립니다` : '',
      order: '먼저 입금하신 순서로 진행됩니다.',
    };
  }
  if (st.mode === 'block') {
    return {
      head: `오늘 ${st.cap}자리가 모두 찼습니다`,
      left: '내일 0시에 다시 열립니다',
      sale: '',
      order: '오늘은 신청을 받지 않습니다. 내일 다시 찾아주세요.',
      blocked: true,
    };
  }
  return {
    head: `오늘 ${st.cap}자리가 모두 찼습니다`,
    left: '지금 신청하시면 내일 순번으로 접수됩니다',
    sale: '',
    order: '입금하신 순서대로 진행되며, 순번은 따로 알려드립니다.',
    next: true,
  };
}

module.exports = { DEFAULTS, clean, load, stateOf, todayCount, priceList, priceOf, notice, won };
