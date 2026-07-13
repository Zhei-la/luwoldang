/**
 * birth.js — 저장된 생년월일/시간 문자열을 만세력 계산용으로 정규화
 * leads.js 와 chat.js 가 함께 쓴다. (복붙해두면 나중에 갈라진다)
 */

function normalizeBirth(b) {
  if (!b) return null;
  const p = String(b).split('-').map((x) => x.trim());
  if (p.length !== 3) return b;
  return `${p[0]}-${String(p[1]).padStart(2, '0')}-${String(p[2]).padStart(2, '0')}`;
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

module.exports = { normalizeBirth, parseHour };
