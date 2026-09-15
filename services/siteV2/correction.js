/* ============================================================
 * services/siteV2/correction.js — 통합 사이트의 태어난 시각 보정
 *
 * 통합 사이트 묶음(render.js)이 무료사주를 계산할 때 부른다.
 * 서머타임 구간·지역 경도·표준자오선은 루월당 만세력(services/manseryeok.js)
 * 원본 함수를 그대로 쓴다. 여기서 새로 정하는 값은 없다.
 *
 * 통합 사이트는 지역을 짧은 이름(서울·부산 …)으로 받는다. manseryeok.js 의
 * 지역표에 같은 이름이 있다. 「해외·모름」은 보정하지 않는다
 * (manseryeok.js 는 모르는 지역을 서울로 치므로 여기서 먼저 거른다).
 * ============================================================ */

'use strict';

const manse = require('../manseryeok');

const KNOWN = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종', '경기', '강원',
  '충북', '충남', '전북', '전남', '경북', '경남', '제주'];

const knownRegion = (region) => !!region && KNOWN.includes(region);

/** 지역시 보정분(당시 기준 자오선) — 화면 안내용. 1954-03-21~1961-08-09 는 manseryeok.js 가 127.5도로 계산한다 */
function localMinutes(region, solarDate) {
  return knownRegion(region) ? manse.localTimeCorrection(region, solarDate) : 0;
}

/** 135°E 기준 지역 보정분 — 명리 엔진에 넘기는 값. 서머타임·127.5도 표준시는 엔진이 스스로 반영한다 */
function regionMinutes135(region) {
  return knownRegion(region) ? manse.regionMinutes135(region) : 0;
}

/** 서머타임 판정 — manseryeok.js 의 DST_PERIODS 그대로 */
function isDST(solarDate, hh, mm) {
  return manse.isDST(solarDate, hh, mm);
}

const pad = (n) => String(n).padStart(2, '0');

function shiftTime(hh, mm, minutes) {
  const t = (((hh * 60 + mm + minutes) % 1440) + 1440) % 1440;
  return pad(Math.floor(t / 60)) + ':' + pad(t % 60);
}

module.exports = { knownRegion, localMinutes, regionMinutes135, isDST, shiftTime, standardMeridian: manse.standardMeridian };
