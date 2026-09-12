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
 *   엔진에 한 번만 넘긴다.
 *
 * ⚠️ 서머타임
 *   엔진(cbEngine.js)은 서머타임을 모른다. 넘겨받은 보정분만큼만 옮긴다.
 *   그래서 서머타임 구간이면 여기서 -60분을 보정분에 더해 넘긴다.
 *   구간 판정은 manseryeok.js 의 isDST (만세력 계산기 kst-history.ts 와 같은 목록).
 *
 * 엔진이 돌려주는 것:
 *   text      — LLM(ChatGPT 등)에 그대로 붙여넣는 명식 텍스트
 *   pdfHtml   — 사람이 읽는 표 (흰 배경). PDF 만세력 장에 쓴다
 *   colorHtml — 오행 색 타일 표. 화면/이미지 캡처용
 * ============================================================ */

const engine = require('./cbEngine');
const { REGIONS, searchRegions } = require('./cbRegions');
const { localTimeCorrection, isDST } = require('./manseryeok');
/* npm 패키지 manseryeok (위의 ./manseryeok.js 와 다른 것) — 엔진이 음력을 양력으로 바꿀 때 쓰는 함수 */
const { lunarToSolar } = require('manseryeok');

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

  const isLunar = c.calendar === '음력';

  /* 시간을 아는 경우에만 보정한다. 시간을 모르면 시주를 안 쓰므로 보정 자체가 의미 없다.
   *   지역시   — 루월당과 똑같은 값으로 한 번만. 지역을 넣고 지역시를 켰을 때만.
   *   서머타임 — 표준시 자체를 당긴 것이라 출생지·지역시 켜고 끄기와 상관없이 -60분. */
  let local = 0, dst = false;
  if (!hourUnknown) {
    if (c.useLocalSolarTime !== false && c.region) {
      local = localTimeCorrection(c.region, `${y}-${pad(mo)}-${pad(d)}`);
    }
    /* 서머타임은 양력 날짜로 판정한다. 바꿀 수 없는 날짜는 서머타임일 수도 없으니
       그냥 넘긴다 — 날짜 오류는 예전처럼 엔진이 낸다. */
    try {
      const s = isLunar ? lunarToSolar(y, mo, d, !!c.isLeapMonth) : { year: y, month: mo, day: d };
      dst = isDST(`${s.year}-${pad(s.month)}-${pad(s.day)}`, hour, minute);
    } catch (e) {
      dst = false;
    }
  }

  return {
    info: {
      year: y, month: mo, day: d, hour, minute,
      isLunar, isLeapMonth: !!c.isLeapMonth,
      gender: toGender(c.gender),
      hourUnknown,
      correctionMinutes: dst ? local - 60 : local,
      birthRegionLabel: c.region || '',
    },
    보정: { dst, local },
  };
}

/* ── 보정 내역 문구 ──
 * 엔진은 넘겨받은 보정분 하나만 알아서, 서머타임 1시간까지 합쳐 「지역시 서울 -92분」 이라고 적는다.
 * cbEngine.js 는 명리학자가 준 파일이라 손대지 않고, 나온 글자만 바꾼다 (routes/manse.js 의 일간십성과 같은 방식).
 *   글     (지역시 서울 -92분 → 12:28 기준)  →  (서머타임 -1시간, 지역시 서울 -32분 → 12:28 기준)
 *   표 머리 · 지역시 서울 -92분 적용           →  · 서머타임 -1시간 · 지역시 서울 -32분 적용
 * 지역시 보정이 없으면(지역 없음·지역시 끔) 「서머타임 -1시간」만 적는다.
 * 서머타임이 아니면 결과를 그대로 돌려준다. */
const 분 = (n) => (n > 0 ? '+' : '') + n + '분';
const escHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function 보정문구(out, x) {
  if (!out || !x.보정.dst) return out;
  const label = String(x.info.birthRegionLabel || '').trim();
  const 합계 = x.info.correctionMinutes;
  const 지역 = x.보정.local !== 0;

  /* 엔진이 적는 글자 그대로 (cbEngine.js 의 보정Text · pdf보정Suffix) */
  const 글앞 = label ? label + ' ' : '보정 ';
  const 글From = ` (지역시 ${글앞}${분(합계)} → `;
  const 글To = ` (서머타임 -1시간${지역 ? `, 지역시 ${글앞}${분(x.보정.local)}` : ''} → `;
  const 표From = escHtml(` · 지역시 ${label || '보정'} ${분(합계)} 적용`);
  const 표To = escHtml(` · 서머타임 -1시간${지역 ? ` · 지역시 ${label || '보정'} ${분(x.보정.local)}` : ''} 적용`);

  const 바꾸기 = (s) => (typeof s === 'string' ? s.split(글From).join(글To).split(표From).join(표To) : s);
  return Object.assign({}, out, { text: 바꾸기(out.text), pdfHtml: 바꾸기(out.pdfHtml), colorHtml: 바꾸기(out.colorHtml) });
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
