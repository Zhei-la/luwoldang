/* ============================================================
 * manseCalc.js — cb_saju 명리 계산 엔진 연결부
 *
 * 새 엔진(services/cbEngine.js)은 원래 독립 프로그램이라 입력 형식이 다르다.
 * 루월당이 쓰는 내담자 정보({ birthDate, birthTime, calendar, gender, region })를
 * 엔진 형식으로 바꿔주는 게 이 파일의 역할이다.
 *
 * ⚠️ 진태양시(지역시) 보정 주의
 *   루월당도 보정하고 엔진도 correctionMinutes로 보정한다.
 *   둘 다 먹이면 두 번 보정돼서 시주가 틀린다.
 *   그래서 여기서는 **루월당의 localTimeCorrection 을 그대로 재사용**해
 *   엔진에 한 번만 넘긴다. 두 엔진의 시주가 항상 같아진다.
 *
 * 엔진이 돌려주는 것:
 *   text      — LLM(ChatGPT 등)에 그대로 붙여넣는 명식 텍스트
 *   pdfHtml   — 사람이 읽는 표 (흰 배경). PDF 만세력 장에 쓴다
 *   colorHtml — 오행 색 타일 표. 화면/이미지 캡처용
 * ============================================================ */

const engine = require('./cbEngine');
const { REGIONS, searchRegions } = require('./cbRegions');
const { localTimeCorrection } = require('./manseryeok');

const 명식표상세 = engine['명식표상세'];
const 궁합분석 = engine['궁합분석'];

const pad = (n) => String(n).padStart(2, '0');

/** '여'/'여성'/'female' → 'female', 나머지는 'male' */
function toGender(g) {
  return /여|female|f/i.test(String(g || '')) ? 'female' : 'male';
}

/**
 * 루월당 내담자 정보 → 엔진 입력
 * @param {object} c { birthDate:'YYYY-MM-DD', birthTime:'HH:MM'|null,
 *                     calendar:'양력'|'음력', isLeapMonth, gender, region,
 *                     useLocalSolarTime }
 */
function toEngineInput(c) {
  const parts = String(c.birthDate || '').split('-').map(Number);
  const y = parts[0], mo = parts[1], d = parts[2];

  let hour = 0, minute = 0, hourUnknown = true;
  if (c.birthTime && /^\d{1,2}:\d{2}$/.test(c.birthTime)) {
    const tp = String(c.birthTime).split(':').map(Number);
    hour = tp[0]; minute = tp[1]; hourUnknown = false;
  }

  const isLunar = c.calendar === '음력';

  /* 진태양시 — 시간을 아는 경우에만, 루월당과 똑같은 값으로 한 번만 보정한다.
   * 시간을 모르면 시주를 안 쓰므로 보정 자체가 의미 없다. */
  let correctionMinutes = 0;
  const useLocal = c.useLocalSolarTime !== false;
  if (!hourUnknown && useLocal && c.region) {
    correctionMinutes = localTimeCorrection(c.region, `${y}-${pad(mo)}-${pad(d)}`);
  }

  return {
    year: y, month: mo, day: d, hour, minute,
    isLunar, isLeapMonth: !!c.isLeapMonth,
    gender: toGender(c.gender),
    hourUnknown,
    correctionMinutes,
    birthRegionLabel: c.region || '',
  };
}

/**
 * 개인 명식 생성
 * @returns {{ text:string, pdfHtml:string, colorHtml:string, raw:object }}
 */
function buildMyeongsik(client, opts) {
  const o = opts || {};
  return 명식표상세(
    toEngineInput(client),
    o.jasi === 'split' ? 'splitJasi' : 'jasi',
    '',
    {
      name: client.name || '',
      concern: o.concern || '',
      세운년수: o.세운년수 || 5,
      월운개월수: o.월운개월수 || 12,
    }
  );
}

/** 궁합(두 사람) 명식 */
function buildGunghap(a, b, opts) {
  const o = opts || {};
  return 궁합분석(
    { info: toEngineInput(a), name: a.name || '본인' },
    { info: toEngineInput(b), name: b.name || '상대방' },
    o.relationType || '연인',
    o.jasi === 'split' ? 'splitJasi' : 'jasi',
    '',
    { concern: o.concern || '' }
  );
}

module.exports = {
  buildMyeongsik,
  buildGunghap,
  toEngineInput,
  REGIONS,
  searchRegions,
};
