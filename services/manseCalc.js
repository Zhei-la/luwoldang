/* ============================================================
 * manseCalc.js — cb_saju 명리 계산 엔진 연결부
 *
 * 새 엔진(services/cbEngine.js)은 원래 독립 프로그램이라 입력 형식이 다르다.
 * 루월당이 쓰는 내담자 정보({ birthDate, birthTime, calendar, gender, region })를
 * 엔진 형식으로 바꿔주는 게 이 파일의 역할이다.
 *
 * ⚠️ 진태양시(지역시)·서머타임·127.5도 표준시
 *   엔진(cbEngine.js)이 날짜를 보고 서머타임(-60분)과 127.5도 표준시 시기를 스스로 반영한다.
 *   그래서 엔진에는 **135도 기준 지역 보정분(regionMinutes135)** 과 지역 이름만 넘긴다.
 *   여기서 서머타임을 빼거나 127.5도로 옮겨 넘기면 두 번 보정돼 시주가 틀린다.
 *   (예전 엔진은 서머타임을 몰라 여기서 -60분을 얹었다. 엔진이 바뀌어 그 처리를 뺐다)
 *
 * 엔진이 돌려주는 것:
 *   text      — LLM(ChatGPT 등)에 그대로 붙여넣는 명식 텍스트
 *   pdfHtml   — 사람이 읽는 표 (흰 배경). PDF 만세력 장에 쓴다
 *   colorHtml — 오행 색 타일 표. 화면/이미지 캡처용
 * ============================================================ */

const engine = require('./cbEngine');
const { REGIONS, searchRegions } = require('./cbRegions');
const { localTimeCorrection, regionMinutes135, isDST } = require('./manseryeok');
/* npm 패키지 manseryeok (위의 ./manseryeok.js 와 다른 것) — 엔진이 음력을 양력으로 바꿀 때 쓰는 함수 */
const { lunarToSolar } = require('manseryeok');

const 명식표상세 = engine['명식표상세'];
const 궁합분석 = engine['궁합분석'];

const pad = (n) => String(n).padStart(2, '0');

/** '여'/'여성'/'female'/'F' → 'female', 나머지는 'male'
 *  ⚠️ calcSaju(manseryeok.js)의 genderOf 와 같은 규칙이어야 대운 방향이 두 계산에서 같다 */
function toGender(g) {
  return /여|female|^f$/i.test(String(g || '').trim()) ? 'female' : 'male';
}

/**
 * 루월당 내담자 정보 → 엔진 입력
 * @param {object} c { birthDate:'YYYY-MM-DD', birthTime:'HH:MM'|null,
 *                     calendar:'양력'|'음력', isLeapMonth, gender, region,
 *                     useLocalSolarTime }
 */
function toEngineInput(c) {
  return 입력과보정(c).info;
}

/** 엔진 입력과, 보정분을 서머타임·지역시로 나눈 내역을 함께 만든다 */
function 입력과보정(c) {
  const parts = String(c.birthDate || '').split('-').map(Number);
  const y = parts[0], mo = parts[1], d = parts[2];

  let hour = 0, minute = 0, hourUnknown = true;
  if (c.birthTime && /^\d{1,2}:\d{2}$/.test(c.birthTime)) {
    const tp = String(c.birthTime).split(':').map(Number);
    hour = tp[0]; minute = tp[1]; hourUnknown = false;
  }

  /* 신청자 달력 값은 '양력' · '음력' · '윤달' 셋이다. 리포트 쪽은 lead.calendar 를 그대로 넘기므로
     '윤달'도 음력(윤달)으로 읽어야 한다. 예전에는 '음력'만 음력으로 봐서 윤달 신청자를 양력 날짜로 계산했다
     (PDF 만세력 장·리포트 글쓰기에 넘기는 명식이 다른 사람의 사주였다). */
  const isLunar = /음력|윤달/.test(String(c.calendar || ''));
  const isLeap = !!c.isLeapMonth || /윤/.test(String(c.calendar || ''));

  /* 시간을 아는 경우에만 보정한다. 시간을 모르면 시주를 안 쓰므로 보정 자체가 의미 없다.
   *   지역시   — 루월당과 똑같은 값으로 한 번만. 지역을 넣고 지역시를 켰을 때만.
   *   서머타임 — 표준시 자체를 당긴 것이라 출생지·지역시 켜고 끄기와 상관없이 -60분. */
  let local = 0, engineLocal = 0, dst = false;
  if (!hourUnknown) {
    if (c.useLocalSolarTime !== false && c.region) {
      local = localTimeCorrection(c.region, `${y}-${pad(mo)}-${pad(d)}`); // 당시 기준 자오선 (안내용)
      engineLocal = regionMinutes135(c.region);                          // 엔진에 넘기는 135도 기준
    }
    /* 서머타임은 양력 날짜로 판정한다. 바꿀 수 없는 날짜는 서머타임일 수도 없으니
       그냥 넘긴다 — 날짜 오류는 예전처럼 엔진이 낸다. */
    try {
      const s = isLunar ? lunarToSolar(y, mo, d, isLeap) : { year: y, month: mo, day: d };
      dst = isDST(`${s.year}-${pad(s.month)}-${pad(s.day)}`, hour, minute);
    } catch (e) {
      dst = false;
    }
  }

  return {
    info: {
      year: y, month: mo, day: d, hour, minute,
      isLunar, isLeapMonth: isLunar && isLeap,
      gender: toGender(c.gender),
      hourUnknown,
      correctionMinutes: engineLocal,
      birthRegionLabel: c.region || '',
    },
    보정: { dst, local },
  };
}

/* ── 보정 내역 문구 ──
 * 엔진이 「서머타임(-1시간), 지역시 서울 -32분 → 12:28 기준」처럼 직접 적는다.
 * 예전 엔진은 서머타임을 몰라 「지역시 서울 -92분」이라 적어 여기서 글자를 바꿨는데, 이제는 고칠 것이 없다.
 * 부르는 곳이 바뀌지 않도록 함수는 남겨 둔다. */
function 보정문구(out) {
  return out;
}

/**
 * 개인 명식 생성
 * @returns {{ text:string, pdfHtml:string, colorHtml:string, raw:object }}
 */
function buildMyeongsik(client, opts) {
  const o = opts || {};
  const x = 입력과보정(client);
  const out = 명식표상세(
    x.info,
    o.jasi === 'split' ? 'splitJasi' : 'jasi',
    '',
    {
      name: client.name || '',
      concern: o.concern || '',
      세운년수: o.세운년수 || 5,
      월운개월수: o.월운개월수 || 12,
    }
  );
  return 보정문구(out, x);
}

/** 궁합(두 사람) 명식 */
function buildGunghap(a, b, opts) {
  const o = opts || {};
  const xa = 입력과보정(a);
  const xb = 입력과보정(b);
  const out = 궁합분석(
    { info: xa.info, name: a.name || '본인' },
    { info: xb.info, name: b.name || '상대방' },
    o.relationType || '연인',
    o.jasi === 'split' ? 'splitJasi' : 'jasi',
    '',
    { concern: o.concern || '' }
  );
  return 보정문구(보정문구(out, xa), xb);
}

module.exports = {
  buildMyeongsik,
  buildGunghap,
  toEngineInput,
  REGIONS,
  searchRegions,
};
