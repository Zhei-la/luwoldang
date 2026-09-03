/* 궁합 리포트의 상대방 사주
 *
 * 신청자 한 줄(leads)에 붙어 있는 partner_* 칸으로 상대방 명식을 만든다.
 * 리포트를 만들 때와 화면에 그릴 때 두 군데서 똑같이 필요해서 여기로 뺐다.
 *
 * 만세력 계산 자체는 건드리지 않는다. calcSaju 를 부르기만 한다.
 */

const { calcSaju } = require('./manseryeok');
const { normalizeBirth, parseHour } = require('./birth');

/* 상대방 사주를 보는 리포트인가 */
const PAIR_TYPES = ['연인궁합', '재회운'];
function isPair(type) {
  return PAIR_TYPES.indexOf(String(type || '')) > -1;
}

/**
 * @param {object} row  leads 한 줄 (partner_* 칸이 있어야 한다)
 * @param {object} opts { useLocalSolarTime }
 * @returns {{client:object, saju:object}|null}  못 만들면 null
 */
function build(row, opts) {
  if (!row || !row.partner_birth) return null;
  const o = opts || {};
  const cal = row.partner_calendar || '양력';
  try {
    const saju = calcSaju({
      birthDate: normalizeBirth(row.partner_birth),
      birthTime: parseHour(row.partner_hour),
      calendar: cal === '윤달' ? '음력' : cal,
      isLeapMonth: cal === '윤달',
      region: row.partner_region || '서울특별시',
      useLocalSolarTime: o.useLocalSolarTime !== false,
      gender: row.partner_gender,
    });
    return {
      client: {
        name: row.partner_name || '상대방',
        gender: row.partner_gender,
        birthDate: normalizeBirth(row.partner_birth),
        birthTime: parseHour(row.partner_hour),
        calendar: cal,
        region: row.partner_region || '서울특별시',
      },
      saju,
    };
  } catch (e) {
    /* 상대방 생년월일이 잘못돼 있어도 본인 리포트는 나가야 한다 */
    console.error('[궁합] 상대방 사주 계산 실패 — 상대방 표는 건너뜁니다:', e.message);
    return null;
  }
}

/* 리포트를 만들 때 쓰는 모양 (services/ai.js 가 받는 partner 와 같다) */
function forReport(row, opts) {
  const p = build(row, opts);
  if (!p) return { partner: null, partnerSaju: null };
  return { partner: p.client, partnerSaju: p.saju };
}

module.exports = { build, forReport, isPair, PAIR_TYPES };
