/**
 * birth.js — 저장된 생년월일/시간 문자열을 만세력 계산용으로 정규화
 * leads.js 와 chat.js 가 함께 쓴다. (복붙해두면 나중에 갈라진다)
 */

/**
 * 생년월일 문자열 → 'YYYY-MM-DD'
 *
 * 사람이 손으로 적는 칸이라 형식이 제각각으로 들어온다.
 * 예전에는 '-' 로 쓴 것만 읽어서, '1990.01.29' 같은 걸 넣으면
 * 그대로 통과시켰다가 계산기에서 NaN 이 되어 터졌다.
 * (궁합 상대방 칸에서 실제로 이 일이 났다 — 표가 통째로 빠졌는데
 *  왜 빠졌는지 알 길이 없었다)
 *
 *  '1990-01-29' '1990.1.29' '1990/1/29' '19900129' '1990년 1월 29일'
 *  → 전부 '1990-01-29'
 *
 * 못 읽으면 받은 값을 그대로 돌려준다. 부르는 쪽에서 판단하게 둔다.
 */
function normalizeBirth(b) {
  if (!b) return null;
  const s = String(b).trim();

  /* 숫자 여덟 자리 — 19900129 */
  const packed = s.replace(/\D/g, '');
  if (/^\d{8}$/.test(s) || (packed.length === 8 && /^[\d\s.\-/년월일]+$/.test(s))) {
    const y = packed.slice(0, 4), m = packed.slice(4, 6), d = packed.slice(6, 8);
    if (ok(y, m, d)) return `${y}-${m}-${d}`;
  }

  /* 무엇으로 나눠 적었든 숫자 세 덩이면 읽는다 */
  const p = s.split(/[^\d]+/).filter(Boolean);
  if (p.length === 3 && p[0].length === 4) {
    const y = p[0], m = String(p[1]).padStart(2, '0'), d = String(p[2]).padStart(2, '0');
    if (ok(y, m, d)) return `${y}-${m}-${d}`;
  }

  return s;

  function ok(y, m, d) {
    const Y = Number(y), M = Number(m), D = Number(d);
    return Y >= 1900 && Y <= 2100 && M >= 1 && M <= 12 && D >= 1 && D <= 31;
  }
}

/* 계산기에 넣어도 되는 날짜인가.
   모양만 보면 '1990-13-01' 같은 것이 통과하므로 값도 함께 본다. */
function isBirthOk(b) {
  const s = String(normalizeBirth(b) || '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split('-').map(Number);
  return y >= 1900 && y <= 2100 && m >= 1 && m <= 12 && d >= 1 && d <= 31;
}
/**
 * 저장된 시간 문자열 → 사주 계산용 'HH:MM'
 *
 *  '11:00'                  → '11:00'   (실제 시각 그대로)
 *  '사시 巳 09:30~11:29'     → '10:30'   (구간 중앙값)
 *  '모름 / 선택 안함'         → null
 */
function parseHour(h) {
  if (!h) return null;
  const str = String(h).trim();
  if (/모름|선택 안함/.test(str)) return null;

  // 1) 실제 시각만 저장된 경우 ('11:00') → 그대로 사용
  if (/^\d{1,2}:\d{2}$/.test(str)) {
    const [hh, mm] = str.split(':').map(Number);
    return String(hh).padStart(2, '0') + ':' + String(mm).padStart(2, '0');
  }

  // 2) 시간 구간 ('사시 巳 09:30~11:29') → 구간 중앙값
  const range = str.match(/(\d{1,2}):(\d{2})\s*[~-]\s*(\d{1,2}):(\d{2})/);
  if (range) {
    const start = Number(range[1]) * 60 + Number(range[2]);
    let end = Number(range[3]) * 60 + Number(range[4]);
    if (end < start) end += 24 * 60;           // 자시(23:30~01:29) 자정 넘김
    const mid = Math.round((start + end) / 2) % (24 * 60);
    return String(Math.floor(mid / 60)).padStart(2, '0') + ':' + String(mid % 60).padStart(2, '0');
  }

  // 3) 시각 하나만 발견되면 그대로
  const one = str.match(/(\d{1,2}):(\d{2})/);
  if (one) {
    return String(Number(one[1])).padStart(2, '0') + ':' + one[2];
  }
  return null;
}

module.exports = { normalizeBirth, parseHour, isBirthOk };
