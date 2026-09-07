/* 상담 응대 — 찾아주고, 내 기준으로 채워준다
 *
 * API 를 쓰지 않는다. 답은 이미 다 적혀 있고 여기서는 찾아서 채우기만 한다.
 * 상담 문구는 왜 그렇게 답하는지까지 정해져 있어서, AI 가 새로 지어내면 사고가 난다.
 *
 * 채워 넣는 값(제작 기간·추가 질문 횟수·환불 기준)은 사람마다 다르다.
 * 안 정해뒀으면 ○○ 로 남긴다. 지어낸 숫자가 그대로 손님에게 나가면 그게 사고다.
 */

const { SITUATIONS, CATS, DANGER, PREVENT } = require('./data');
const { calcSaju, localTimeCorrection } = require('../manseryeok');
const { normalizeBirth, parseHour, isBirthOk } = require('../birth');

/* ── 내 기준 ────────────────────────────────────────────
   users.counsel 에 들어 있는 값. 없으면 ○○ 로 둔다. */
const BLANK = '○○';

function settingsOf(user) {
  const c = (user && user.counsel) || {};
  return {
    concept: c.concept === 'A' ? 'A' : (c.concept === 'B' ? 'B' : ''),
    days: String(c.days || '').trim(),
    times: String(c.times || '').trim(),
    refund: String(c.refund || '').trim(),
  };
}

/* 「3」 → 「3일」, 「3일」 → 「3일」, 빈 값 → 「○○일」 */
function withUnit(v, unit) {
  const s = String(v == null ? '' : v).trim();
  if (!s) return BLANK + unit;
  return /[가-힣]$/.test(s) ? s : s + unit;
}

function fill(text, st, name) {
  return String(text == null ? '' : text)
    .split('{이름}').join(name || '○○')
    .split('{기간}').join(withUnit(st.days, '일'))
    .split('{횟수}').join(withUnit(st.times, '회'))
    .split('{환불}').join(st.refund || '제작 전 전액 환불 / 제작 후 환불 불가 / 정보 오류 시 무료 재제작');
}

/* 이 문구에 아직 안 채운 칸이 남았나 */
function missing(sit, st) {
  const need = sit.need || [];
  const out = [];
  if (need.indexOf('기간') > -1 && !st.days) out.push('제작 기간');
  if (need.indexOf('횟수') > -1 && !st.times) out.push('추가 질문 횟수');
  if (need.indexOf('환불') > -1 && !st.refund) out.push('환불 기준');
  return out;
}

/* ── 찾기 ───────────────────────────────────────────────
   손님이 던진 말을 그대로 붙여넣어도 걸려야 한다.
   상담 중에는 정확히 칠 시간이 없다. 한 글자만 쳐도 나오게 한다. */
function norm(x) { return String(x || '').toLowerCase().replace(/\s+/g, ''); }

function score(sit, k) {
  const names = [sit.t].concat(sit.alt || []);
  let best = -1;
  for (const n of names) {
    const v = norm(n);
    if (!v) continue;
    if (v === k) return 100;
    if (v.indexOf(k) === 0) best = Math.max(best, 80);
    else if (v.indexOf(k) > -1) best = Math.max(best, 60);
    /* 손님 말을 통째로 붙여넣는 경우 — 친 글 안에 열쇠말이 들어 있다 */
    else if (k.length >= 2 && k.indexOf(v) > -1) best = Math.max(best, 70);
  }
  if (best < 0 && norm(sit.when).indexOf(k) > -1) best = 30;
  if (best < 0) {
    for (const s of (sit.says || [])) {
      if (norm(s.text).indexOf(k) > -1) { best = 20; break; }
    }
  }
  return best;
}

function search(q) {
  const k = norm(q);
  if (!k) return SITUATIONS.slice();
  return SITUATIONS
    .map((s) => ({ s, v: score(s, k) }))
    .filter((o) => o.v >= 0)
    .sort((a, b) => b.v - a.v || a.s.t.length - b.s.t.length)
    .map((o) => o.s);
}

/* ── 위험 신호 ──────────────────────────────────────────
   찾아보게 두면 안 된다. 걸리면 다른 답을 덮고 맨 위에 뜬다. */
function isDanger(q) {
  const k = norm(q);
  if (k.length < 2) return false;
  return DANGER.words.some((w) => k.indexOf(norm(w)) > -1);
}

/* ── 「다른 데랑 왜 달라요」 계산기 ──────────────────────
 *
 * 이 질문에 제일 세게 먹히는 답은 설명이 아니라 숫자다.
 * 이 손님의 생년월일시로 실제로 두 번 계산해서, 지역시 보정을 켰을 때와
 * 껐을 때 시주가 갈리는지 보여준다. 갈리면 그게 「다른 이유」 그 자체다.
 *
 * 갈리지 않으면 그것도 말해줘야 한다. 안 갈리는데 계산 탓을 하면 거짓말이 된다.
 */
function gapCheck(o) {
  const birth = normalizeBirth(o && o.birth);
  if (!isBirthOk(birth)) {
    return { ok: false, error: '생년월일을 읽지 못했습니다. 1992-12-11 처럼 적어주세요.' };
  }
  const hour = parseHour(o.hour);
  if (!hour) {
    return { ok: false, error: '태어난 시각이 있어야 계산 차이를 볼 수 있습니다.' };
  }
  const cal = o.calendar || '양력';
  const region = o.region || '서울특별시';
  const base = {
    birthDate: birth, birthTime: hour,
    calendar: cal === '윤달' ? '음력' : cal,
    isLeapMonth: cal === '윤달',
    region, gender: o.gender || null,
  };

  let on, off;
  try {
    on = calcSaju(Object.assign({}, base, { useLocalSolarTime: true }));
    off = calcSaju(Object.assign({}, base, { useLocalSolarTime: false }));
  } catch (e) {
    console.error('[상담응대] 보정 비교 실패:', e.message);
    return { ok: false, error: '이 날짜로는 사주를 낼 수 없습니다. 생년월일을 다시 확인해주세요.' };
  }

  const mins = localTimeCorrection(region, birth);
  const hOn = (on.pillarsKo && on.pillarsKo.hour) || '';
  const hOff = (off.pillarsKo && off.pillarsKo.hour) || '';
  const changed = !!hOn && !!hOff && hOn !== hOff;

  return {
    ok: true, changed, mins, region,
    hourOn: hOn, hourOff: hOff,
    dayOn: (on.pillarsKo && on.pillarsKo.day) || '',
    /* 손님에게 그대로 보낼 말. 갈리느냐 아니냐로 문장이 완전히 다르다. */
    say: changed
      ? `{이름}님 경우가 딱 그 경우예요.

태어나신 시각이 시가 바뀌는 경계에 걸려 있어서
계산 방식에 따라 시주가 달라집니다.

${region} 기준으로 ${Math.abs(mins)}분을 보정하면 ${hOn},
보정하지 않으면 ${hOff}가 됩니다.

저는 실제 태양 위치에 맞춰 보정해서 ${hOn}으로 봤어요.
그래서 다른 곳과 풀이가 갈릴 수 있습니다.`
      : `{이름}님 경우는 계산 차이 때문은 아니에요.

${region} 기준으로 ${Math.abs(mins)}분 보정이 들어가는데,
보정을 넣어도 빼도 시주가 ${hOn}으로 같습니다.
경계에 걸린 시각이 아니라서요.

그러면 남는 이유는 두 가지예요.
무엇을 중심으로 봤느냐, 그리고 어느 시기를 봤느냐입니다.`,
  };
}

module.exports = {
  SITUATIONS, CATS, DANGER, PREVENT,
  search, isDanger, settingsOf, fill, missing, gapCheck, BLANK,
};
