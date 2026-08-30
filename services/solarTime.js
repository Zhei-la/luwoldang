/* 태어난 때에 따라 진태양시 보정이 달라진다.
 *
 * ⚠️ 우리나라 표준시는 쭉 같지 않았다. 표준자오선이 두 번 바뀌었다.
 *
 *   1908-04-01 ~ 1911-12-31 : 127.5°E (UTC+8:30)
 *   1912-01-01 ~ 1954-03-20 : 135°E   (UTC+9)
 *   1954-03-21 ~ 1961-08-09 : 127.5°E (UTC+8:30)   ← 여기가 문제
 *   1961-08-10 ~ 지금       : 135°E   (UTC+9)
 *
 * 127.5°E 를 쓰던 기간에 태어난 분은 시계 자체가 이미 30분 늦게 맞춰져
 * 있었다. 그래서 135° 기준으로 32분을 또 빼면 한 시진이 통째로 밀린다.
 *   예) 1957년 서울 출생 —  135° 기준 -32분 (틀림) / 127.5° 기준 -2분 (맞음)
 *
 * 이 기간과 그 밖은 정확히 30분(7.5도 × 4분) 차이라, 지역 보정값에
 * 30분만 더해 주면 된다. 지역별 경도는 그대로 쓴다.
 *
 * 이 갈래를 안 넣으면 무료사주 웹사이트와 만세력이 서로 다른 시주를 낸다.
 * (웹사이트 쪽 계산기는 이 갈래를 갖고 있었고, 명리학자 엔진은 없었다)
 */

'use strict';

/** 그날의 표준자오선 */
function meridian(year, month, day) {
  const d = String(year) + '-' + String(month).padStart(2, '0') + '-' + String(day).padStart(2, '0');
  if (d >= '1954-03-21' && d <= '1961-08-09') return 127.5;
  if (d >= '1908-04-01' && d <= '1911-12-31') return 127.5;
  return 135;
}

/** 127.5°E 를 쓰던 때인가 */
function isHalfHourEra(year, month, day) {
  return meridian(year, month, day) === 127.5;
}

/**
 * 지역 보정값(135° 기준으로 적어 둔 값)을 그날의 표준자오선에 맞춘다.
 *
 * @param {number} minutes  cbRegions 에 적힌 보정분 (135° 기준, 보통 음수)
 * @returns {number} 그날 실제로 빼야 할 분
 */
function adjust(minutes, year, month, day) {
  const m = Number(minutes) || 0;
  if (!m) return 0;                       /* 보정을 끈 상태면 건드리지 않는다 */
  return isHalfHourEra(year, month, day) ? m + 30 : m;
}

/** 경도에서 바로 구할 때 */
function fromLongitude(longitude, year, month, day) {
  const lon = Number(longitude);
  if (!Number.isFinite(lon)) return 0;
  return Math.round((lon - meridian(year, month, day)) * 4);
}

module.exports = { meridian, isHalfHourEra, adjust, fromLongitude };
