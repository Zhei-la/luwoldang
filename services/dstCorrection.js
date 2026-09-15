/* ============================================================
 * dstCorrection.js — 서머타임 태생인지 판정하고 안내 문구를 만든다
 *
 * 엔진(cbEngine · cbFortune)이 날짜를 보고 서머타임(-60분)과 127.5도 표준시를 스스로 반영한다.
 * 그래서 이 파일은 더 이상 엔진 입력을 바꾸지 않는다. 판정(보정.dst)과 안내 문구만 만든다.
 *   · 구간 판정은 manseryeok.js 의 isDST (엔진 src/kst-history.ts 와 같은 목록).
 *   · 예전 엔진은 서머타임을 몰라 여기서 보정분에 -60분을 얹었다. 지금 그렇게 하면 두 번 빠진다.
 *   · 생시모름 · 간지선택은 판정하지 않는다(엔진도 보정하지 않는다).
 * ============================================================ */

'use strict';

const { isDST, DST_PERIODS } = require('./manseryeok');
/* npm 패키지 manseryeok (위의 ./manseryeok.js 와 다른 것) — 엔진이 음력을 양력으로 바꿀 때 쓰는 함수 */
const { lunarToSolar } = require('manseryeok');

const pad = (n) => String(n).padStart(2, '0');

/**
 * 엔진 입력 → 그대로의 엔진 입력 + 서머타임 판정
 * @param {object} info 엔진 입력 { year, month, day, hour, minute, isLunar, isLeapMonth,
 *                       hourUnknown, ganjiSelect, correctionMinutes(135도 기준 지역시 보정분), birthRegionLabel }
 * @returns {{ info: object, 보정: { dst: boolean, local: number, year: number|null } }}  info 는 받은 것 그대로
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
    info,                         // 엔진이 서머타임을 스스로 반영하므로 입력을 바꾸지 않는다
    보정: { dst, local, year },   // year: 판정에 쓴 양력 연도 (안내 문구용)
  };
}

/* ── 서머타임 안내 ──
 * 보정 내역만 「(서머타임 -60분, 지역시 -23분)」 으로 적으면 손님은 왜 시각이 바뀌었는지 모른다.
 * 서머타임 구간 태생에게만 이유를 적어 준다. 아니면 null.
 * 「이 시기」 는 구간 목록(DST_PERIODS)에서 이어진 해끼리 묶어 뽑는다 — 1948~1951 · 1955~1960 · 1987~1988 */
function 시행연도구간() {
  const years = [...new Set(DST_PERIODS.map((p) => Number(String(p[0]).slice(0, 4))))].sort((a, b) => a - b);
  const runs = [];
  for (const y of years) {
    const last = runs[runs.length - 1];
    if (last && y === last[1] + 1) last[1] = y;
    else runs.push([y, y]);
  }
  return runs;
}
const 연도구간글 = ([a, b]) => (a === b ? `${a}년` : `${a}~${b}년`);

function 시행기간(year) {
  const r = 시행연도구간().find(([a, b]) => year >= a && year <= b);
  return r ? 연도구간글(r) : `${year}년`;
}

/* ── 서머타임이란? (입력 전에도 보는 기본 설명) ──
 * 만세력 계산기 생시 칸 옆 「서머타임이란? ⓘ」 를 누르면 펼친다. 생년월일과 상관없이 늘 같은 내용이다.
 * 연도와 기간 목록은 구간 목록(DST_PERIODS)에서 만든다 — 목록을 따로 적어두면 둘이 어긋난다. */
const 시각라벨 = (s) => {
  const [date, time] = String(s).split(' ');
  return `${date.split('-').map(Number).join('.')} ${time}`;
};
function 서머타임기본안내() {
  return {
    lines: [
      '여름철에 시계를 실제 시각보다 1시간 앞당겨 쓰던 제도입니다.',
      `우리나라는 ${시행연도구간().map(연도구간글).join(', ')}의 일부 기간에 시행했습니다.`,
      '이 기간에 태어나셨다면 기록된 출생 시각이 실제보다 1시간 앞서 있어, 1시간을 빼고 사주를 계산합니다.',
      '생년월일과 태어난 시각을 넣으면 해당 여부를 자동으로 확인해 반영합니다.',
    ],
    periods: DST_PERIODS.map(([a, b]) => `${시각라벨(a)} ~ ${시각라벨(b)}`),
  };
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
 * 엔진이 「서머타임(-1시간), 지역시 서울특별시 -32분 → 12:28 기준」처럼 직접 적는다.
 * 예전 엔진은 서머타임을 몰라 「지역시 서울 -92분」이라 적어 여기서 글자를 바꿨는데, 이제는 고칠 것이 없다.
 * 부르는 곳(routes/manse.js)이 바뀌지 않도록 함수는 남겨 둔다. */
function 보정문구(out) {
  return out;
}

module.exports = { 서머타임반영, 보정문구, 서머타임안내, 서머타임기본안내 };
