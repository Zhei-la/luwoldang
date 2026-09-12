/* ============================================================
 * dstCorrection.js — 명리 엔진에 넘길 입력에 서머타임을 얹는다
 *
 * 엔진(cbEngine · cbFortune)은 서머타임을 모른다. 넘겨받은 보정분만큼만 시각을 옮긴다.
 * 그래서 서머타임 구간이면 보정분(correctionMinutes)에 -60분을 더해 넘긴다.
 *   · 구간 판정은 manseryeok.js 의 isDST 하나만 쓴다 (calcSaju · manseCalc 와 같은 판정).
 *   · 서머타임은 표준시 자체를 당긴 것이라 지역시 보정을 켜고 끄는 것과 상관없이 뺀다.
 *   · 생시모름 · 간지선택은 엔진이 보정을 아예 하지 않으므로 건드리지 않는다.
 *   · 서머타임이 아니면 받은 입력을 그대로 돌려준다 (구간 밖 결과는 예전과 똑같다).
 *
 * ⚠️ services/manseCalc.js 에도 같은 처리(입력과보정 · 보정문구)가 있다.
 *    그쪽은 루월당 내담자 형식({ birthDate, birthTime, ... })을 받고, 여기는 엔진 형식을 받는다.
 *    문구를 고치면 두 곳을 같이 고칠 것.
 * ============================================================ */

'use strict';

const { isDST, DST_PERIODS } = require('./manseryeok');
/* npm 패키지 manseryeok (위의 ./manseryeok.js 와 다른 것) — 엔진이 음력을 양력으로 바꿀 때 쓰는 함수 */
const { lunarToSolar } = require('manseryeok');

const pad = (n) => String(n).padStart(2, '0');

/**
 * 엔진 입력 → 서머타임을 얹은 엔진 입력
 * @param {object} info 엔진 입력 { year, month, day, hour, minute, isLunar, isLeapMonth,
 *                       hourUnknown, ganjiSelect, correctionMinutes(지역시 보정분), birthRegionLabel }
 * @returns {{ info: object, 보정: { dst: boolean, local: number } }}
 */
function 서머타임반영(info) {
  const local = Number(info && info.correctionMinutes) || 0;
  let dst = false;
  let year = null;
  if (info && !info.hourUnknown && !info.ganjiSelect) {
    /* 서머타임은 양력 날짜로 판정한다. 바꿀 수 없는 날짜는 서머타임일 수도 없으니
       그냥 넘긴다 — 날짜 오류는 예전처럼 엔진이 낸다. */
    try {
      const s = info.isLunar
        ? lunarToSolar(info.year, info.month, info.day, !!info.isLeapMonth)
        : { year: info.year, month: info.month, day: info.day };
      year = s.year;
      dst = isDST(`${s.year}-${pad(s.month)}-${pad(s.day)}`, info.hour, info.minute);
    } catch (e) {
      dst = false;
    }
  }
  return {
    info: dst ? Object.assign({}, info, { correctionMinutes: local - 60 }) : info,
    보정: { dst, local, year },   // year: 판정에 쓴 양력 연도 (안내 문구용)
  };
}

/* ── 서머타임 안내 ──
 * 보정 내역만 「(서머타임 -60분, 지역시 -23분)」 으로 적으면 손님은 왜 시각이 바뀌었는지 모른다.
 * 서머타임 구간 태생에게만 이유를 적어 준다. 아니면 null.
 * 「이 시기」 는 구간 목록(DST_PERIODS)에서 이어진 해끼리 묶어 뽑는다 — 1948~1951 · 1955~1960 · 1987~1988 */
function 시행기간(year) {
  const years = [...new Set(DST_PERIODS.map((p) => Number(String(p[0]).slice(0, 4))))].sort((a, b) => a - b);
  const runs = [];
  for (const y of years) {
    const last = runs[runs.length - 1];
    if (last && y === last[1] + 1) last[1] = y;
    else runs.push([y, y]);
  }
  const r = runs.find(([a, b]) => year >= a && year <= b);
  if (!r) return `${year}년`;
  return r[0] === r[1] ? `${r[0]}년` : `${r[0]}~${r[1]}년`;
}

/** @returns {string[]|null} 줄 단위 안내 문구 (화면에서 줄바꿈으로 잇는다) */
function 서머타임안내(x) {
  if (!x || !x.보정 || !x.보정.dst) return null;
  return [
    `이 시기(${시행기간(x.보정.year)})에는 서머타임이 시행되어`,
    '시계가 실제 시각보다 1시간 앞당겨져 있었습니다.',
    '그래서 태어나신 시각에서 1시간을 빼고 계산합니다.',
  ];
}

/* ── 보정 내역 문구 ──
 * 엔진은 넘겨받은 보정분 하나만 알아서, 서머타임 1시간까지 합쳐 「지역시 서울 -92분」 이라고 적는다.
 * cbEngine.js 는 명리학자가 준 파일이라 손대지 않고, 나온 글자만 바꾼다 (manseCalc.js 와 같은 문구).
 *   글     (지역시 서울 -92분 → 12:28 기준)  →  (서머타임 -1시간, 지역시 서울 -32분 → 12:28 기준)
 *   표 머리 · 지역시 서울 -92분 적용           →  · 서머타임 -1시간 · 지역시 서울 -32분 적용
 * 지역시 보정이 없으면(지역 없음·보정 끔) 「서머타임 -1시간」만 적는다.
 * 서머타임이 아니면 결과를 그대로 돌려준다. */
const 분 = (n) => (n > 0 ? '+' : '') + n + '분';
const escHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function 보정문구(out, x) {
  if (!out || !x || !x.보정.dst) return out;
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

module.exports = { 서머타임반영, 보정문구, 서머타임안내 };
