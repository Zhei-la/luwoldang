/* 명리 엔진 묶음 — 만세력 계산기(/manse)·신청자 상세·PDF·무료사주가 쓴다.
 * 원본: 만세력 계산기(cb_saju) src/engine.ts · src/strength.ts · src/kst-history.ts
 * 만드는 법: cb_saju 폴더에서 node scripts/build-bundles.mjs <saju-platform> [ruwoldang-web]
 * 원본 TypeScript 를 esbuild 로 묶은 것이다. 손으로 고치지 마세요. */
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// entry.ts
var entry_exports = {};
__export(entry_exports, {
  HIDDEN_STEMS_TABLE: () => HIDDEN_STEMS_TABLE,
  \uACA9\uAD6D\uAE30\uC900: () => \uACA9\uAD6D\uAE30\uC900,
  \uACA9\uAD6D\uD310\uC815: () => \uACA9\uAD6D\uD310\uC815,
  \uAD81\uD569\uBD84\uC11D: () => \uAD81\uD569\uBD84\uC11D,
  \uBA85\uC2DD\uD45C: () => \uBA85\uC2DD\uD45C,
  \uBA85\uC2DD\uD45C\uC0C1\uC138: () => \uBA85\uC2DD\uD45C\uC0C1\uC138,
  \uC2DC\uAC01\uBCF4\uC815\uD50C\uB798\uADF8: () => \uC2DC\uAC01\uBCF4\uC815\uD50C\uB798\uADF8,
  \uC870\uD6C4\uC6A9\uC2E0\uACC4\uC0B0: () => \uC870\uD6C4\uC6A9\uC2E0\uACC4\uC0B0,
  \uC9C0\uC7A5\uAC04\uC2ED\uC131\uBAA9\uB85D: () => \uC9C0\uC7A5\uAC04\uC2ED\uC131\uBAA9\uB85D
});
module.exports = __toCommonJS(entry_exports);

// src/engine.ts
var import_manseryeok = require("manseryeok");

// src/regions.ts
function reg(name, longitude) {
  return { name, longitude, correctionMinutes: Math.round((longitude - 135) * 4) };
}
var REGIONS = [
  // ── 특별시·광역시·특별자치시·도 (17) ──
  reg("\uC11C\uC6B8\uD2B9\uBCC4\uC2DC", 126.978),
  reg("\uBD80\uC0B0\uAD11\uC5ED\uC2DC", 129.075),
  reg("\uB300\uAD6C\uAD11\uC5ED\uC2DC", 128.601),
  reg("\uC778\uCC9C\uAD11\uC5ED\uC2DC", 126.705),
  reg("\uAD11\uC8FC\uAD11\uC5ED\uC2DC", 126.851),
  reg("\uB300\uC804\uAD11\uC5ED\uC2DC", 127.385),
  reg("\uC6B8\uC0B0\uAD11\uC5ED\uC2DC", 129.311),
  reg("\uC138\uC885\uD2B9\uBCC4\uC790\uCE58\uC2DC", 127.289),
  reg("\uACBD\uAE30\uB3C4", 127.01),
  reg("\uAC15\uC6D0\uD2B9\uBCC4\uC790\uCE58\uB3C4", 127.73),
  reg("\uCDA9\uCCAD\uBD81\uB3C4", 127.49),
  reg("\uCDA9\uCCAD\uB0A8\uB3C4", 126.664),
  reg("\uC804\uBD81\uD2B9\uBCC4\uC790\uCE58\uB3C4", 127.148),
  reg("\uC804\uB77C\uB0A8\uB3C4", 126.463),
  reg("\uACBD\uC0C1\uBD81\uB3C4", 128.689),
  reg("\uACBD\uC0C1\uB0A8\uB3C4", 128.681),
  reg("\uC81C\uC8FC\uD2B9\uBCC4\uC790\uCE58\uB3C4", 126.532),
  // ── 경기도 시 (28) ──
  reg("\uC218\uC6D0\uC2DC", 127.01),
  reg("\uC131\uB0A8\uC2DC", 127.138),
  reg("\uC548\uC591\uC2DC", 126.957),
  reg("\uC548\uC0B0\uC2DC", 126.831),
  reg("\uC6A9\uC778\uC2DC", 127.177),
  reg("\uBD80\uCC9C\uC2DC", 126.783),
  reg("\uAD11\uBA85\uC2DC", 126.865),
  reg("\uD3C9\uD0DD\uC2DC", 127.113),
  reg("\uB3D9\uB450\uCC9C\uC2DC", 127.06),
  reg("\uC548\uC131\uC2DC", 127.28),
  reg("\uAE40\uD3EC\uC2DC", 126.716),
  reg("\uD654\uC131\uC2DC", 126.831),
  reg("\uAD11\uC8FC\uC2DC(\uACBD\uAE30)", 127.255),
  reg("\uC774\uCC9C\uC2DC", 127.435),
  reg("\uC591\uC8FC\uC2DC", 127.046),
  reg("\uC624\uC0B0\uC2DC", 127.077),
  reg("\uAD6C\uB9AC\uC2DC", 127.144),
  reg("\uB0A8\uC591\uC8FC\uC2DC", 127.216),
  reg("\uD30C\uC8FC\uC2DC", 126.78),
  reg("\uC758\uC815\uBD80\uC2DC", 127.048),
  reg("\uC2DC\uD765\uC2DC", 126.803),
  reg("\uAD70\uD3EC\uC2DC", 126.935),
  reg("\uD558\uB0A8\uC2DC", 127.214),
  reg("\uC5EC\uC8FC\uC2DC", 127.637),
  reg("\uACFC\uCC9C\uC2DC", 126.998),
  reg("\uACE0\uC591\uC2DC", 126.835),
  reg("\uC758\uC655\uC2DC", 126.968),
  reg("\uD3EC\uCC9C\uC2DC", 127.2),
  // ── 경기도 군 (2) ──
  reg("\uC591\uD3C9\uAD70", 127.495),
  reg("\uAC00\uD3C9\uAD70", 127.51),
  reg("\uC5F0\uCC9C\uAD70", 127.075),
  // ── 강원특별자치도 시 (7) ──
  reg("\uCD98\uCC9C\uC2DC", 127.73),
  reg("\uC6D0\uC8FC\uC2DC", 127.945),
  reg("\uAC15\uB989\uC2DC", 128.876),
  reg("\uB3D9\uD574\uC2DC", 129.114),
  reg("\uD0DC\uBC31\uC2DC", 128.986),
  reg("\uC18D\uCD08\uC2DC", 128.591),
  reg("\uC0BC\uCC99\uC2DC", 129.165),
  // ── 강원특별자치도 군 (11) ──
  reg("\uD64D\uCC9C\uAD70", 127.888),
  reg("\uD6A1\uC131\uAD70", 127.985),
  reg("\uC601\uC6D4\uAD70", 128.462),
  reg("\uD3C9\uCC3D\uAD70", 128.39),
  reg("\uC815\uC120\uAD70", 128.661),
  reg("\uCCA0\uC6D0\uAD70", 127.313),
  reg("\uD654\uCC9C\uAD70", 127.708),
  reg("\uC591\uAD6C\uAD70", 127.99),
  reg("\uC778\uC81C\uAD70", 128.17),
  reg("\uACE0\uC131\uAD70(\uAC15\uC6D0)", 128.468),
  reg("\uC591\uC591\uAD70", 128.619),
  // ── 충청북도 시 (3) ──
  reg("\uCCAD\uC8FC\uC2DC", 127.49),
  reg("\uCDA9\uC8FC\uC2DC", 127.926),
  reg("\uC81C\uCC9C\uC2DC", 128.191),
  // ── 충청북도 군 (8) ──
  reg("\uBCF4\uC740\uAD70", 127.729),
  reg("\uC625\uCC9C\uAD70", 127.571),
  reg("\uC601\uB3D9\uAD70", 127.783),
  reg("\uC99D\uD3C9\uAD70", 127.581),
  reg("\uC9C4\uCC9C\uAD70", 127.435),
  reg("\uAD34\uC0B0\uAD70", 127.788),
  reg("\uC74C\uC131\uAD70", 127.686),
  reg("\uB2E8\uC591\uAD70", 128.365),
  // ── 충청남도 시 (8) ──
  reg("\uCC9C\uC548\uC2DC", 127.149),
  reg("\uACF5\uC8FC\uC2DC", 127.119),
  reg("\uBCF4\uB839\uC2DC", 126.612),
  reg("\uC544\uC0B0\uC2DC", 127.005),
  reg("\uC11C\uC0B0\uC2DC", 126.45),
  reg("\uB17C\uC0B0\uC2DC", 127.098),
  reg("\uACC4\uB8E1\uC2DC", 127.249),
  reg("\uB2F9\uC9C4\uC2DC", 126.629),
  // ── 충청남도 군 (7) ──
  reg("\uAE08\uC0B0\uAD70", 127.488),
  reg("\uBD80\uC5EC\uAD70", 126.91),
  reg("\uC11C\uCC9C\uAD70", 126.692),
  reg("\uCCAD\uC591\uAD70", 126.802),
  reg("\uD64D\uC131\uAD70", 126.665),
  reg("\uC608\uC0B0\uAD70", 126.845),
  reg("\uD0DC\uC548\uAD70", 126.298),
  // ── 전북특별자치도 시 (6) ──
  reg("\uC804\uC8FC\uC2DC", 127.148),
  reg("\uAD70\uC0B0\uC2DC", 126.737),
  reg("\uC775\uC0B0\uC2DC", 126.957),
  reg("\uC815\uC74D\uC2DC", 126.856),
  reg("\uB0A8\uC6D0\uC2DC", 127.39),
  reg("\uAE40\uC81C\uC2DC", 126.88),
  // ── 전북특별자치도 군 (8) ──
  reg("\uC644\uC8FC\uAD70", 127.161),
  reg("\uC9C4\uC548\uAD70", 127.425),
  reg("\uBB34\uC8FC\uAD70", 127.66),
  reg("\uC7A5\uC218\uAD70", 127.521),
  reg("\uC784\uC2E4\uAD70", 127.288),
  reg("\uC21C\uCC3D\uAD70", 127.138),
  reg("\uACE0\uCC3D\uAD70", 126.702),
  reg("\uBD80\uC548\uAD70", 126.733),
  // ── 전라남도 시 (5) ──
  reg("\uBAA9\uD3EC\uC2DC", 126.392),
  reg("\uC5EC\uC218\uC2DC", 127.662),
  reg("\uC21C\uCC9C\uC2DC", 127.487),
  reg("\uB098\uC8FC\uC2DC", 126.712),
  reg("\uAD11\uC591\uC2DC", 127.696),
  // ── 전라남도 군 (17) ──
  reg("\uB2F4\uC591\uAD70", 126.988),
  reg("\uACE1\uC131\uAD70", 127.292),
  reg("\uAD6C\uB840\uAD70", 127.463),
  reg("\uACE0\uD765\uAD70", 127.285),
  reg("\uBCF4\uC131\uAD70", 127.08),
  reg("\uD654\uC21C\uAD70", 126.986),
  reg("\uC7A5\uD765\uAD70", 126.907),
  reg("\uAC15\uC9C4\uAD70", 126.767),
  reg("\uD574\uB0A8\uAD70", 126.599),
  reg("\uC601\uC554\uAD70", 126.697),
  reg("\uBB34\uC548\uAD70", 126.481),
  reg("\uD568\uD3C9\uAD70", 126.517),
  reg("\uC601\uAD11\uAD70", 126.512),
  reg("\uC7A5\uC131\uAD70", 126.786),
  reg("\uC644\uB3C4\uAD70", 126.755),
  reg("\uC9C4\uB3C4\uAD70", 126.264),
  reg("\uC2E0\uC548\uAD70", 126.107),
  // ── 경상북도 시 (10) ──
  reg("\uD3EC\uD56D\uC2DC", 129.365),
  reg("\uACBD\uC8FC\uC2DC", 129.225),
  reg("\uAE40\uCC9C\uC2DC", 128.113),
  reg("\uC548\uB3D9\uC2DC", 128.729),
  reg("\uAD6C\uBBF8\uC2DC", 128.335),
  reg("\uC601\uC8FC\uC2DC", 128.624),
  reg("\uC601\uCC9C\uC2DC", 128.939),
  reg("\uC0C1\uC8FC\uC2DC", 128.159),
  reg("\uBB38\uACBD\uC2DC", 128.187),
  reg("\uACBD\uC0B0\uC2DC", 128.741),
  // ── 경상북도 군 (12) ──
  reg("\uC758\uC131\uAD70", 128.697),
  reg("\uCCAD\uC1A1\uAD70", 129.057),
  reg("\uC601\uC591\uAD70", 129.112),
  reg("\uC601\uB355\uAD70", 129.365),
  reg("\uCCAD\uB3C4\uAD70", 128.734),
  reg("\uACE0\uB839\uAD70", 128.263),
  reg("\uC131\uC8FC\uAD70", 128.283),
  reg("\uCE60\uACE1\uAD70", 128.402),
  reg("\uC608\uCC9C\uAD70", 128.452),
  reg("\uBD09\uD654\uAD70", 128.732),
  reg("\uC6B8\uC9C4\uAD70", 129.4),
  reg("\uC6B8\uB989\uAD70", 130.905),
  // ── 대구광역시 편입 군 (1) ──
  reg("\uAD70\uC704\uAD70(\uB300\uAD6C)", 128.573),
  // ── 경상남도 시 (8) ──
  reg("\uCC3D\uC6D0\uC2DC", 128.681),
  reg("\uC9C4\uC8FC\uC2DC", 128.108),
  reg("\uD1B5\uC601\uC2DC", 128.433),
  reg("\uC0AC\uCC9C\uC2DC", 128.064),
  reg("\uAE40\uD574\uC2DC", 128.889),
  reg("\uBC00\uC591\uC2DC", 128.746),
  reg("\uAC70\uC81C\uC2DC", 128.621),
  reg("\uC591\uC0B0\uC2DC", 129.037),
  // ── 경상남도 군 (9) ──
  reg("\uC758\uB839\uAD70", 128.262),
  reg("\uD568\uC548\uAD70", 128.406),
  reg("\uCC3D\uB155\uAD70", 128.492),
  reg("\uB0A8\uD574\uAD70", 127.892),
  reg("\uD558\uB3D9\uAD70", 127.751),
  reg("\uC0B0\uCCAD\uAD70", 127.874),
  reg("\uD568\uC591\uAD70", 127.725),
  reg("\uAC70\uCC3D\uAD70", 127.91),
  reg("\uD569\uCC9C\uAD70", 128.169),
  // ── 제주특별자치도 시 (2) ──
  reg("\uC81C\uC8FC\uC2DC", 126.532),
  reg("\uC11C\uADC0\uD3EC\uC2DC", 126.561)
];

// src/kst-history.ts
var STANDARD_127_5_PERIODS = [
  ["1908-04-01", "1911-12-31"],
  ["1954-03-21", "1961-08-09"]
];
var DST_PERIODS = [
  ["1948-06-01 00:00", "1948-09-13 00:00"],
  ["1949-04-03 00:00", "1949-09-11 00:00"],
  ["1950-04-01 00:00", "1950-09-10 00:00"],
  ["1951-05-06 00:00", "1951-09-09 00:00"],
  ["1955-05-05 00:00", "1955-09-09 00:00"],
  ["1956-05-20 00:00", "1956-09-30 00:00"],
  ["1957-05-05 00:00", "1957-09-22 00:00"],
  ["1958-05-04 00:00", "1958-09-21 00:00"],
  ["1959-05-03 00:00", "1959-09-20 00:00"],
  ["1960-05-01 00:00", "1960-09-18 00:00"],
  ["1987-05-10 02:00", "1987-10-11 03:00"],
  ["1988-05-08 02:00", "1988-10-09 03:00"]
];
var dayKey = (y, m, d) => y * 1e4 + m * 100 + d;
var parseDay = (s) => {
  const [y, m, d] = s.split("-").map(Number);
  return dayKey(y, m, d);
};
var parseWall = (s) => {
  const [date, time] = s.split(" ");
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  return Date.UTC(y, m - 1, d, hh, mm);
};
var STANDARD_127_5 = STANDARD_127_5_PERIODS.map(([a, b]) => [parseDay(a), parseDay(b)]);
var DST = DST_PERIODS.map(([a, b]) => [parseWall(a), parseWall(b)]);
var REGION_BY_NAME = new Map(REGIONS.map((r) => [r.name, r]));
function \uC11C\uBA38\uD0C0\uC784\uD310\uC815(year, month, day, hour, minute) {
  const wall = Date.UTC(year, month - 1, day, hour, minute);
  return DST.some(([start, end]) => wall >= start && wall < end);
}
function \uAE30\uC900\uC790\uC624\uC120\uD310\uC815(year, month, day) {
  const key = dayKey(year, month, day);
  return STANDARD_127_5.some(([start, end]) => key >= start && key <= end) ? 127.5 : 135;
}
function \uC9C0\uC5ED\uBCF4\uC815\uBD84\uC0B0\uCD9C(correctionMinutes, regionLabel, meridian) {
  if (meridian === 135) return correctionMinutes;
  const region = REGION_BY_NAME.get((regionLabel || "").trim());
  if (region && region.correctionMinutes === correctionMinutes) return Math.round((region.longitude - 127.5) * 4) || 0;
  return correctionMinutes + 30;
}
function \uCD9C\uC0DD\uC2DC\uAC01\uC5ED\uC0AC\uBCF4\uC815(clock, correctionMinutes, regionLabel) {
  const \uC11C\uBA38\uD0C0\uC784 = \uC11C\uBA38\uD0C0\uC784\uD310\uC815(clock.year, clock.month, clock.day, clock.hour, clock.minute);
  const \uAE30\uC900\uC790\uC624\uC120 = \uAE30\uC900\uC790\uC624\uC120\uD310\uC815(clock.year, clock.month, clock.day);
  const \uC9C0\uC5ED\uBCF4\uC815 = typeof correctionMinutes === "number" && correctionMinutes !== 0;
  const \uC9C0\uC5ED\uBCF4\uC815\uBD84 = \uC9C0\uC5ED\uBCF4\uC815 ? \uC9C0\uC5ED\uBCF4\uC815\uBD84\uC0B0\uCD9C(correctionMinutes, regionLabel, \uAE30\uC900\uC790\uC624\uC120) : 0;
  const d = new Date(Date.UTC(clock.year, clock.month - 1, clock.day, clock.hour, clock.minute, 0));
  d.setUTCMinutes(d.getUTCMinutes() - (\uC11C\uBA38\uD0C0\uC784 ? 60 : 0) + \uC9C0\uC5ED\uBCF4\uC815\uBD84);
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
    hour: d.getUTCHours(),
    minute: d.getUTCMinutes(),
    \uC11C\uBA38\uD0C0\uC784,
    \uAE30\uC900\uC790\uC624\uC120,
    \uC9C0\uC5ED\uBCF4\uC815,
    \uC9C0\uC5ED\uBCF4\uC815\uBD84,
    \uC801\uC6A9: \uC11C\uBA38\uD0C0\uC784 || \uC9C0\uC5ED\uBCF4\uC815
  };
}
var \uC11C\uBA38\uD0C0\uC784\uBB38\uAD6C = "\uC11C\uBA38\uD0C0\uC784(-1\uC2DC\uAC04)";
function \uC9C0\uC5ED\uBCF4\uC815\uBB38\uAD6C(r, \uC55E\uB9D0) {
  const \uAE30\uC900 = r.\uAE30\uC900\uC790\uC624\uC120 === 127.5 ? "127.5\uB3C4 \uAE30\uC900 " : "";
  return `${\uC55E\uB9D0} ${\uAE30\uC900}${r.\uC9C0\uC5ED\uBCF4\uC815\uBD84 > 0 ? "+" : ""}${r.\uC9C0\uC5ED\uBCF4\uC815\uBD84}\uBD84`;
}
function \uBCF4\uC815\uBB38\uAD6C\uC870\uAC01(r, \uC9C0\uC5ED\uC55E\uB9D0) {
  const parts = [];
  if (r.\uC11C\uBA38\uD0C0\uC784) parts.push(\uC11C\uBA38\uD0C0\uC784\uBB38\uAD6C);
  if (r.\uC9C0\uC5ED\uBCF4\uC815) parts.push(\uC9C0\uC5ED\uBCF4\uC815\uBB38\uAD6C(r, \uC9C0\uC5ED\uC55E\uB9D0));
  return parts;
}

// src/strength.ts
var \uCC9C\uAC04\uC624\uD589 = { \uAC11: "\uBAA9", \uC744: "\uBAA9", \uBCD1: "\uD654", \uC815: "\uD654", \uBB34: "\uD1A0", \uAE30: "\uD1A0", \uACBD: "\uAE08", \uC2E0: "\uAE08", \uC784: "\uC218", \uACC4: "\uC218" };
var \uC0DD = { \uBAA9: "\uD654", \uD654: "\uD1A0", \uD1A0: "\uAE08", \uAE08: "\uC218", \uC218: "\uBAA9" };
var \uADF9 = { \uBAA9: "\uD1A0", \uD1A0: "\uC218", \uC218: "\uD654", \uD654: "\uAE08", \uAE08: "\uBAA9" };
var \uC0DD\uBC1B = { \uD654: "\uBAA9", \uD1A0: "\uD654", \uAE08: "\uD1A0", \uC218: "\uAE08", \uBAA9: "\uC218" };
var \uADF9\uBC1B = { \uD1A0: "\uBAA9", \uC218: "\uD1A0", \uD654: "\uC218", \uAE08: "\uD654", \uBAA9: "\uAE08" };
var \uC624\uD589\uC21C = ["\uBAA9", "\uD654", "\uD1A0", "\uAE08", "\uC218"];
var \uD55C\uC790 = { \uBAA9: "\u6728", \uD654: "\u706B", \uD1A0: "\u571F", \uAE08: "\u91D1", \uC218: "\u6C34" };
var \uC9C0\uC7A5\uAC04\uC77C\uC218 = {
  \uC790: [{ \uAC04: "\uC784", \uC77C\uC218: 10, \uC790\uB9AC: "\uC5EC\uAE30" }, { \uAC04: "\uACC4", \uC77C\uC218: 20, \uC790\uB9AC: "\uBCF8\uAE30" }],
  \uCD95: [{ \uAC04: "\uACC4", \uC77C\uC218: 9, \uC790\uB9AC: "\uC5EC\uAE30" }, { \uAC04: "\uC2E0", \uC77C\uC218: 3, \uC790\uB9AC: "\uC911\uAE30" }, { \uAC04: "\uAE30", \uC77C\uC218: 18, \uC790\uB9AC: "\uBCF8\uAE30" }],
  \uC778: [{ \uAC04: "\uBB34", \uC77C\uC218: 7, \uC790\uB9AC: "\uC5EC\uAE30" }, { \uAC04: "\uBCD1", \uC77C\uC218: 7, \uC790\uB9AC: "\uC911\uAE30" }, { \uAC04: "\uAC11", \uC77C\uC218: 16, \uC790\uB9AC: "\uBCF8\uAE30" }],
  \uBB18: [{ \uAC04: "\uAC11", \uC77C\uC218: 10, \uC790\uB9AC: "\uC5EC\uAE30" }, { \uAC04: "\uC744", \uC77C\uC218: 20, \uC790\uB9AC: "\uBCF8\uAE30" }],
  \uC9C4: [{ \uAC04: "\uC744", \uC77C\uC218: 9, \uC790\uB9AC: "\uC5EC\uAE30" }, { \uAC04: "\uACC4", \uC77C\uC218: 3, \uC790\uB9AC: "\uC911\uAE30" }, { \uAC04: "\uBB34", \uC77C\uC218: 18, \uC790\uB9AC: "\uBCF8\uAE30" }],
  \uC0AC: [{ \uAC04: "\uBB34", \uC77C\uC218: 7, \uC790\uB9AC: "\uC5EC\uAE30" }, { \uAC04: "\uACBD", \uC77C\uC218: 7, \uC790\uB9AC: "\uC911\uAE30" }, { \uAC04: "\uBCD1", \uC77C\uC218: 16, \uC790\uB9AC: "\uBCF8\uAE30" }],
  \uC624: [{ \uAC04: "\uBCD1", \uC77C\uC218: 10, \uC790\uB9AC: "\uC5EC\uAE30" }, { \uAC04: "\uAE30", \uC77C\uC218: 9, \uC790\uB9AC: "\uC911\uAE30" }, { \uAC04: "\uC815", \uC77C\uC218: 11, \uC790\uB9AC: "\uBCF8\uAE30" }],
  \uBBF8: [{ \uAC04: "\uC815", \uC77C\uC218: 9, \uC790\uB9AC: "\uC5EC\uAE30" }, { \uAC04: "\uC744", \uC77C\uC218: 3, \uC790\uB9AC: "\uC911\uAE30" }, { \uAC04: "\uAE30", \uC77C\uC218: 18, \uC790\uB9AC: "\uBCF8\uAE30" }],
  \uC2E0: [{ \uAC04: "\uBB34", \uC77C\uC218: 7, \uC790\uB9AC: "\uC5EC\uAE30" }, { \uAC04: "\uC784", \uC77C\uC218: 7, \uC790\uB9AC: "\uC911\uAE30" }, { \uAC04: "\uACBD", \uC77C\uC218: 16, \uC790\uB9AC: "\uBCF8\uAE30" }],
  \uC720: [{ \uAC04: "\uACBD", \uC77C\uC218: 10, \uC790\uB9AC: "\uC5EC\uAE30" }, { \uAC04: "\uC2E0", \uC77C\uC218: 20, \uC790\uB9AC: "\uBCF8\uAE30" }],
  \uC220: [{ \uAC04: "\uC2E0", \uC77C\uC218: 9, \uC790\uB9AC: "\uC5EC\uAE30" }, { \uAC04: "\uC815", \uC77C\uC218: 3, \uC790\uB9AC: "\uC911\uAE30" }, { \uAC04: "\uBB34", \uC77C\uC218: 18, \uC790\uB9AC: "\uBCF8\uAE30" }],
  \uD574: [{ \uAC04: "\uBB34", \uC77C\uC218: 7, \uC790\uB9AC: "\uC5EC\uAE30" }, { \uAC04: "\uAC11", \uC77C\uC218: 7, \uC790\uB9AC: "\uC911\uAE30" }, { \uAC04: "\uC784", \uC77C\uC218: 16, \uC790\uB9AC: "\uBCF8\uAE30" }]
};
var \uC138\uB825\uAE30\uC900 = {
  \uC790\uB9AC: { \uB144\uAC04: 0.7, \uC6D4\uAC04: 1, \uC77C\uAC04: 1, \uC2DC\uAC04: 0.9, \uB144\uC9C0: 0.8, \uC6D4\uC9C0: 3, \uC77C\uC9C0: 1.5, \uC2DC\uC9C0: 1 },
  \uACC4\uC808: { \uC655: 1.2, \uC0C1: 1.1, \uD734: 1, \uC218: 0.9, \uC0AC: 0.8 },
  \uD1B5\uADFC: { \uBCF8\uAE30: 1, \uC911\uAE30\uC5EC\uAE30: 0.85, \uC5C6\uC74C: 0.6 },
  \uCDA9: { \uBD99\uC74C: 0.7, \uB5A8\uC5B4\uC9D0: 0.85, \uC6D4\uC9C0\uBD99\uC74C: 0.8, \uC6D4\uC9C0\uB5A8\uC5B4\uC9D0: 0.9 },
  \uD615\uD30C\uD574: 0.9,
  \uBC29\uD569\uC62E\uAE40: 0.5,
  \uC0BC\uD569\uC62E\uAE40: 0.5,
  \uBC18\uD569\uC62E\uAE40: 0.3,
  \uC721\uD569\uC62E\uAE40: 0.4,
  \uC721\uD569\uBB36\uC784: 0.9,
  \uCC9C\uAC04\uD569\uBB36\uC784: 0.8,
  \uC77C\uAC04\uD569\uBB36\uC784: 0.9,
  \uCC9C\uAC04\uCDA9: 0.85,
  // 돕는 힘(비겁+인성)의 비율 하한 → 등급. 위에서부터 처음 만족하는 등급.
  // 돕는 오행은 다섯 중 둘(비겁·인성)이라 치우침 없는 사주의 돕는 힘은 40%대에 모인다. 중화를 그 자리에 둔다.
  \uB4F1\uAE09: [
    { \uB4F1\uAE09: "\uADF9\uC2E0\uAC15", \uC774\uC0C1: 0.73 },
    { \uB4F1\uAE09: "\uC2E0\uAC15", \uC774\uC0C1: 0.6 },
    { \uB4F1\uAE09: "\uC911\uAC15", \uC774\uC0C1: 0.51 },
    { \uB4F1\uAE09: "\uC911\uD654", \uC774\uC0C1: 0.4 },
    { \uB4F1\uAE09: "\uC911\uC57D", \uC774\uC0C1: 0.32 },
    { \uB4F1\uAE09: "\uC2E0\uC57D", \uC774\uC0C1: 0.19 },
    { \uB4F1\uAE09: "\uADF9\uC2E0\uC57D", \uC774\uC0C1: 0 }
  ],
  \uB4DD\uC138: { O: 0.5, \uC138\uBAA8: 0.3 },
  \uC870\uD6C4\uAE09\uD568: 0.1
  // 한여름·한겨울에 필요한 오행 비율이 이보다 낮으면 조후 참고 문장을 붙인다
};
var \uACC4\uC808\uC624\uD589 = { \uC778: "\uBAA9", \uBB18: "\uBAA9", \uC0AC: "\uD654", \uC624: "\uD654", \uC2E0: "\uAE08", \uC720: "\uAE08", \uD574: "\uC218", \uC790: "\uC218", \uC9C4: "\uD1A0", \uC220: "\uD1A0", \uCD95: "\uD1A0", \uBBF8: "\uD1A0" };
var \uACC4\uC808\uC774\uB984 = { \uC778: "\uCD08\uBD04", \uBB18: "\uD55C\uBD04", \uC9C4: "\uB2A6\uBD04", \uC0AC: "\uCD08\uC5EC\uB984", \uC624: "\uD55C\uC5EC\uB984", \uBBF8: "\uB2A6\uC5EC\uB984", \uC2E0: "\uCD08\uAC00\uC744", \uC720: "\uD55C\uAC00\uC744", \uC220: "\uB2A6\uAC00\uC744", \uD574: "\uCD08\uACA8\uC6B8", \uC790: "\uD55C\uACA8\uC6B8", \uCD95: "\uB2A6\uACA8\uC6B8" };
var \uC655\uC0C1\uB73B = { \uC655: "\uC81C\uCCA0\uC774\uB77C \uAC00\uC7A5 \uC655\uC131", \uC0C1: "\uACC4\uC808\uC774 \uC0DD\uD574 \uC8FC\uC5B4 \uD798\uC774 \uBD99\uC74C", \uD734: "\uACC4\uC808\uC744 \uC0DD\uD558\uB290\uB77C \uD798\uC744 \uC27C", \uC218: "\uACC4\uC808\uC744 \uC774\uAE30\uB824\uB2E4 \uAC07\uD600 \uC57D\uD574\uC9D0", \uC0AC: "\uACC4\uC808\uC5D0 \uB20C\uB824 \uAC00\uC7A5 \uC57D\uD568" };
function \uC655\uC0C1\uD734\uC218\uC0AC(\uC6D4\uC9C0, el) {
  const w = \uACC4\uC808\uC624\uD589[\uC6D4\uC9C0];
  if (el === w) return "\uC655";
  if (\uC0DD[w] === el) return "\uC0C1";
  if (\uC0DD[el] === w) return "\uD734";
  if (\uADF9[el] === w) return "\uC218";
  return "\uC0AC";
}
function \uBB34\uB9AC\uC624\uD589(\uB098) {
  return { \uBE44\uAC81: \uB098, \uC778\uC131: \uC0DD\uBC1B[\uB098], \uC2DD\uC0C1: \uC0DD[\uB098], \uC7AC\uC131: \uADF9[\uB098], \uAD00\uC131: \uADF9\uBC1B[\uB098] };
}
function \uBB34\uB9AC\uC774\uB984(\uB098, el) {
  const m = \uBB34\uB9AC\uC624\uD589(\uB098);
  return Object.keys(m).find((k2) => m[k2] === el);
}
var \uD37C\uC13C\uD2B8 = (x) => Math.round(x * 100);
var \uCDA9\uC30D = ["\uC790\uC624", "\uCD95\uBBF8", "\uC778\uC2E0", "\uBB18\uC720", "\uC9C4\uC220", "\uC0AC\uD574"];
var \uD30C\uC30D = ["\uC790\uC720", "\uCD95\uC9C4", "\uC778\uD574", "\uBB18\uC624", "\uC0AC\uC2E0", "\uC220\uBBF8"];
var \uD574\uC30D = ["\uC790\uBBF8", "\uCD95\uC624", "\uC778\uC0AC", "\uBB18\uC9C4", "\uC2E0\uD574", "\uC720\uC220"];
var \uD615\uC30D = ["\uC778\uC0AC", "\uC0AC\uC2E0", "\uC778\uC2E0", "\uCD95\uC220", "\uC220\uBBF8", "\uCD95\uBBF8", "\uC790\uBB18"];
var \uC790\uD615\uAE00\uC790 = /* @__PURE__ */ new Set(["\uC9C4", "\uC624", "\uC720", "\uD574"]);
var \uC721\uD569\uD45C = { \uC790\uCD95: "\uD1A0", \uC778\uD574: "\uBAA9", \uBB18\uC220: "\uD654", \uC9C4\uC720: "\uAE08", \uC0AC\uC2E0: "\uC218", \uC624\uBBF8: "\uD654" };
var \uC0BC\uD569\uD45C = [
  { \uAE00\uC790: ["\uD574", "\uBB18", "\uBBF8"], \uC655\uC9C0: "\uBB18", \uC624\uD589: "\uBAA9", \uC774\uB984: "\uD574\uBB18\uBBF8 \uBAA9\uAD6D" },
  { \uAE00\uC790: ["\uC778", "\uC624", "\uC220"], \uC655\uC9C0: "\uC624", \uC624\uD589: "\uD654", \uC774\uB984: "\uC778\uC624\uC220 \uD654\uAD6D" },
  { \uAE00\uC790: ["\uC0AC", "\uC720", "\uCD95"], \uC655\uC9C0: "\uC720", \uC624\uD589: "\uAE08", \uC774\uB984: "\uC0AC\uC720\uCD95 \uAE08\uAD6D" },
  { \uAE00\uC790: ["\uC2E0", "\uC790", "\uC9C4"], \uC655\uC9C0: "\uC790", \uC624\uD589: "\uC218", \uC774\uB984: "\uC2E0\uC790\uC9C4 \uC218\uAD6D" }
];
var \uBC29\uD569\uD45C = [
  { \uAE00\uC790: ["\uC778", "\uBB18", "\uC9C4"], \uC624\uD589: "\uBAA9", \uC774\uB984: "\uC778\uBB18\uC9C4 \uB3D9\uBC29 \uBAA9" },
  { \uAE00\uC790: ["\uC0AC", "\uC624", "\uBBF8"], \uC624\uD589: "\uD654", \uC774\uB984: "\uC0AC\uC624\uBBF8 \uB0A8\uBC29 \uD654" },
  { \uAE00\uC790: ["\uC2E0", "\uC720", "\uC220"], \uC624\uD589: "\uAE08", \uC774\uB984: "\uC2E0\uC720\uC220 \uC11C\uBC29 \uAE08" },
  { \uAE00\uC790: ["\uD574", "\uC790", "\uCD95"], \uC624\uD589: "\uC218", \uC774\uB984: "\uD574\uC790\uCD95 \uBD81\uBC29 \uC218" }
];
var \uCC9C\uAC04\uD569\uD45C = { \uAC11\uAE30: "\uD1A0", \uC744\uACBD: "\uAE08", \uBCD1\uC2E0: "\uC218", \uC815\uC784: "\uBAA9", \uBB34\uACC4: "\uD654" };
var \uCC9C\uAC04\uCDA9\uC30D = ["\uAC11\uACBD", "\uC744\uC2E0", "\uBCD1\uC784", "\uC815\uACC4"];
var \uC30D = (list, a, b) => list.includes(a + b) || list.includes(b + a);
var \uD45C\uCC3E\uAE30 = (t, a, b) => t[a + b] ?? t[b + a];
var \uC815\uC2DD = (list, a, b) => list.includes(a + b) ? a + b : b + a;
function \uBC1B\uCE68(w) {
  const t = w.replace(/\([^)]*\)/g, "");
  for (let i = t.length - 1; i >= 0; i--) {
    const c = t.charCodeAt(i);
    if (c >= 44032 && c <= 55203) return (c - 44032) % 28;
  }
  return 1;
}
var \uC740 = (w) => w + (\uBC1B\uCE68(w) ? "\uC740" : "\uB294");
var \uC774 = (w) => w + (\uBC1B\uCE68(w) ? "\uC774" : "\uAC00");
var \uC744 = (w) => w + (\uBC1B\uCE68(w) ? "\uC744" : "\uB97C");
var \uC73C\uB85C = (w) => {
  const j = \uBC1B\uCE68(w);
  return w + (j === 0 || j === 8 ? "\uB85C" : "\uC73C\uB85C");
};
function \uC62E\uAE30\uAE30(z, \uBE44\uC728, \uB300\uC0C1) {
  let \uD569\uACC4 = 0;
  for (const [el, v] of z.\uD798) {
    z.\uD798.set(el, v * (1 - \uBE44\uC728));
    \uD569\uACC4 += v;
  }
  z.\uD798.set(\uB300\uC0C1, (z.\uD798.get(\uB300\uC0C1) || 0) + \uD569\uACC4 * \uBE44\uC728);
}
function \uC138\uB825\uBD84\uC11D(p, hourUnknown = false) {
  const \uAE30\uC900 = \uC138\uB825\uAE30\uC900;
  const \uC77C\uAC04 = p.day[0];
  const \uB098 = \uCC9C\uAC04\uC624\uD589[\uC77C\uAC04];
  const \uBB34\uB9AC = \uBB34\uB9AC\uC624\uD589(\uB098);
  const \uC6D4\uC9C0 = p.month[1];
  const \uC21C\uC11C\uD0A4 = [["year", "\uB144"], ["month", "\uC6D4"], ["day", "\uC77C"], ["hour", "\uC2DC"]];
  const \uC4F0\uB294\uD0A4 = hourUnknown ? \uC21C\uC11C\uD0A4.slice(0, 3) : \uC21C\uC11C\uD0A4;
  const \uADFC\uAC70 = [];
  const \uC0AC\uAC74 = [];
  const \uB3D5\uB294\uD569\uAD6D = [];
  const \uC9C0\uC9C0 = \uC4F0\uB294\uD0A4.map(([k2, \uC774\uB984], i) => {
    const \uAE00\uC790 = p[k2][1];
    const w = \uAE30\uC900.\uC790\uB9AC[`${\uC774\uB984}\uC9C0`];
    const \uD7982 = /* @__PURE__ */ new Map();
    for (const h of \uC9C0\uC7A5\uAC04\uC77C\uC218[\uAE00\uC790]) \uD7982.set(\uCC9C\uAC04\uC624\uD589[h.\uAC04], (\uD7982.get(\uCC9C\uAC04\uC624\uD589[h.\uAC04]) || 0) + w * h.\uC77C\uC218 / 30);
    return { \uC790\uB9AC: `${\uC774\uB984}\uC9C0`, \uAE00\uC790, \uC21C\uC11C: i, \uD798: \uD7982, \uBC30\uC218: 1 };
  });
  const \uAE00\uC790\uC788\uC74C = (g) => \uC9C0\uC9C0.some((z) => z.\uAE00\uC790 === g);
  const \uBD99\uC74C = (a, b) => Math.abs(a.\uC21C\uC11C - b.\uC21C\uC11C) === 1;
  const \uC790\uB9AC\uAE00 = (zs) => [...new Set(zs.map((z) => z.\uC790\uB9AC))].join("\xB7");
  const \uC644\uC131\uAD6D = /* @__PURE__ */ new Set();
  for (const g of \uBC29\uD569\uD45C) {
    if (!g.\uAE00\uC790.every(\uAE00\uC790\uC788\uC74C)) continue;
    const \uB300\uC0C1 = \uC9C0\uC9C0.filter((z) => g.\uAE00\uC790.includes(z.\uAE00\uC790));
    \uB300\uC0C1.forEach((z) => \uC62E\uAE30\uAE30(z, \uAE30\uC900.\uBC29\uD569\uC62E\uAE40, g.\uC624\uD589));
    if (g.\uC624\uD589 === \uBB34\uB9AC.\uBE44\uAC81 || g.\uC624\uD589 === \uBB34\uB9AC.\uC778\uC131) \uB3D5\uB294\uD569\uAD6D.push(`${g.\uC774\uB984} \uBC29\uD569`);
    \uC0AC\uAC74.push(`${g.\uC774\uB984}(${\uC790\uB9AC\uAE00(\uB300\uC0C1)}) \uBC29\uD569 \uC131\uB9BD \u2192 \uC138 \uAE00\uC790\uC758 \uD798 \uC808\uBC18\uC774 ${\uC73C\uB85C(`${g.\uC624\uD589}(${\uBB34\uB9AC\uC774\uB984(\uB098, g.\uC624\uD589)})`)} \uBAA8\uC784`);
  }
  for (const g of \uC0BC\uD569\uD45C) {
    if (g.\uAE00\uC790.every(\uAE00\uC790\uC788\uC74C)) {
      const \uB300\uC0C1 = \uC9C0\uC9C0.filter((z) => g.\uAE00\uC790.includes(z.\uAE00\uC790));
      \uB300\uC0C1.forEach((z) => \uC62E\uAE30\uAE30(z, \uAE30\uC900.\uC0BC\uD569\uC62E\uAE40, g.\uC624\uD589));
      if (g.\uC624\uD589 === \uBB34\uB9AC.\uBE44\uAC81 || g.\uC624\uD589 === \uBB34\uB9AC.\uC778\uC131) \uB3D5\uB294\uD569\uAD6D.push(`${g.\uC774\uB984} \uC0BC\uD569`);
      \uC644\uC131\uAD6D.add(g.\uC774\uB984);
      \uC0AC\uAC74.push(`${g.\uC774\uB984}(${\uC790\uB9AC\uAE00(\uB300\uC0C1)}) \uC0BC\uD569 \uC131\uB9BD \u2192 \uC138 \uAE00\uC790\uC758 \uD798 \uC808\uBC18\uC774 ${\uC73C\uB85C(`${g.\uC624\uD589}(${\uBB34\uB9AC\uC774\uB984(\uB098, g.\uC624\uD589)})`)} \uBAA8\uC784`);
      continue;
    }
    const \uC655\uC9C0\uB4E4 = \uC9C0\uC9C0.filter((z) => z.\uAE00\uC790 === g.\uC655\uC9C0);
    const \uC9DD\uB4E4 = \uC9C0\uC9C0.filter((z) => z.\uAE00\uC790 !== g.\uC655\uC9C0 && g.\uAE00\uC790.includes(z.\uAE00\uC790));
    const \uC30D\uB4E4 = [];
    for (const a of \uC655\uC9C0\uB4E4) for (const b of \uC9DD\uB4E4) if (\uBD99\uC74C(a, b) || a.\uC790\uB9AC === "\uC6D4\uC9C0" || b.\uC790\uB9AC === "\uC6D4\uC9C0") \uC30D\uB4E4.push([a, b]);
    if (\uC30D\uB4E4.length) {
      const \uB300\uC0C1 = [...new Set(\uC30D\uB4E4.flat())];
      \uB300\uC0C1.forEach((z) => \uC62E\uAE30\uAE30(z, \uAE30\uC900.\uBC18\uD569\uC62E\uAE40, g.\uC624\uD589));
      const \uAE00\uC790\uBAA8\uC74C = new Set(\uB300\uC0C1.map((z) => z.\uAE00\uC790));
      \uC0AC\uAC74.push(`${g.\uAE00\uC790.filter((x) => \uAE00\uC790\uBAA8\uC74C.has(x)).join("")} \uBC18\uD569(${\uC790\uB9AC\uAE00(\uB300\uC0C1)}) \u2192 \uD798 \uC77C\uBD80\uAC00 ${\uC73C\uB85C(`${g.\uC624\uD589}(${\uBB34\uB9AC\uC774\uB984(\uB098, g.\uC624\uD589)})`)} \uAE30\uC6C0`);
    }
  }
  for (let i = 0; i + 1 < \uC9C0\uC9C0.length; i++) {
    const a = \uC9C0\uC9C0[i], b = \uC9C0\uC9C0[i + 1];
    const e = \uD45C\uCC3E\uAE30(\uC721\uD569\uD45C, a.\uAE00\uC790, b.\uAE00\uC790);
    if (!e) continue;
    const st = \uC655\uC0C1\uD734\uC218\uC0AC(\uC6D4\uC9C0, e);
    const \uC774\uB984 = \uC815\uC2DD(Object.keys(\uC721\uD569\uD45C), a.\uAE00\uC790, b.\uAE00\uC790);
    if (st === "\uC655" || st === "\uC0C1") {
      \uC62E\uAE30\uAE30(a, \uAE30\uC900.\uC721\uD569\uC62E\uAE40, e);
      \uC62E\uAE30\uAE30(b, \uAE30\uC900.\uC721\uD569\uC62E\uAE40, e);
      \uC0AC\uAC74.push(`${\uC774\uB984} \uC721\uD569(${a.\uC790\uB9AC}\xB7${b.\uC790\uB9AC}) \u2192 \uC6D4\uB839\uC5D0\uC11C ${\uC774(e)} ${st}\uC774\uB77C \uB450 \uAE00\uC790 \uD798\uC774 ${\uC73C\uB85C(`${e}(${\uBB34\uB9AC\uC774\uB984(\uB098, e)})`)} \uAE30\uC6C0`);
    } else {
      a.\uBC30\uC218 *= \uAE30\uC900.\uC721\uD569\uBB36\uC784;
      b.\uBC30\uC218 *= \uAE30\uC900.\uC721\uD569\uBB36\uC784;
      \uC0AC\uAC74.push(`${\uC774\uB984} \uC721\uD569(${a.\uC790\uB9AC}\xB7${b.\uC790\uB9AC}) \u2192 \uC6D4\uB839\uC774 ${\uC744(e)} \uB3D5\uC9C0 \uC54A\uC544 \uD569\uD654\uD558\uC9C0 \uBABB\uD558\uACE0 \uC11C\uB85C \uBB36\uC5EC \uD798\uC774 \uC870\uAE08 \uC904\uC5B4\uB4E6`);
    }
  }
  for (let i = 0; i < \uC9C0\uC9C0.length; i++) for (let j = i + 1; j < \uC9C0\uC9C0.length; j++) {
    const a = \uC9C0\uC9C0[i], b = \uC9C0\uC9C0[j];
    if (!\uC30D(\uCDA9\uC30D, a.\uAE00\uC790, b.\uAE00\uC790)) continue;
    const near = \uBD99\uC74C(a, b);
    for (const z of [a, b]) z.\uBC30\uC218 *= z.\uC790\uB9AC === "\uC6D4\uC9C0" ? near ? \uAE30\uC900.\uCDA9.\uC6D4\uC9C0\uBD99\uC74C : \uAE30\uC900.\uCDA9.\uC6D4\uC9C0\uB5A8\uC5B4\uC9D0 : near ? \uAE30\uC900.\uCDA9.\uBD99\uC74C : \uAE30\uC900.\uCDA9.\uB5A8\uC5B4\uC9D0;
    \uC0AC\uAC74.push(`${\uC815\uC2DD(\uCDA9\uC30D, a.\uAE00\uC790, b.\uAE00\uC790)}\uCDA9(${a.\uC790\uB9AC}\xB7${b.\uC790\uB9AC}, ${near ? "\uBD99\uC5B4 \uC788\uC74C" : "\uB5A8\uC5B4\uC838 \uC788\uC74C"}) \u2192 \uB450 \uAE00\uC790\uC758 \uBFCC\uB9AC\uAC00 \uD754\uB4E4\uB824 \uD798\uC774 \uC904\uC5B4\uB4E6`);
  }
  for (let i = 0; i + 1 < \uC9C0\uC9C0.length; i++) {
    const a = \uC9C0\uC9C0[i], b = \uC9C0\uC9C0[i + 1];
    const \uC885\uB958 = [];
    if (a.\uAE00\uC790 === b.\uAE00\uC790 && \uC790\uD615\uAE00\uC790.has(a.\uAE00\uC790)) \uC885\uB958.push(`${a.\uAE00\uC790}${b.\uAE00\uC790} \uC790\uD615`);
    else if (\uC30D(\uD615\uC30D, a.\uAE00\uC790, b.\uAE00\uC790)) \uC885\uB958.push(`${\uC815\uC2DD(\uD615\uC30D, a.\uAE00\uC790, b.\uAE00\uC790)}\uD615`);
    if (\uC30D(\uD30C\uC30D, a.\uAE00\uC790, b.\uAE00\uC790)) \uC885\uB958.push(`${\uC815\uC2DD(\uD30C\uC30D, a.\uAE00\uC790, b.\uAE00\uC790)}\uD30C`);
    if (\uC30D(\uD574\uC30D, a.\uAE00\uC790, b.\uAE00\uC790)) \uC885\uB958.push(`${\uC815\uC2DD(\uD574\uC30D, a.\uAE00\uC790, b.\uAE00\uC790)}\uD574`);
    if (!\uC885\uB958.length) continue;
    a.\uBC30\uC218 *= \uAE30\uC900.\uD615\uD30C\uD574;
    b.\uBC30\uC218 *= \uAE30\uC900.\uD615\uD30C\uD574;
    \uC0AC\uAC74.push(`${\uC885\uB958.join("\xB7")}(${a.\uC790\uB9AC}\xB7${b.\uC790\uB9AC}) \u2192 \uC11C\uB85C \uAC70\uC2AC\uB7EC \uD798\uC774 \uC870\uAE08 \uC904\uC5B4\uB4E6`);
  }
  const \uCC9C\uAC04 = \uC4F0\uB294\uD0A4.map(([k2, \uC774\uB984], i) => ({
    \uC790\uB9AC: `${\uC774\uB984}\uAC04`,
    \uAE00\uC790: p[k2][0],
    \uC21C\uC11C: i,
    \uC624\uD589: \uCC9C\uAC04\uC624\uD589[p[k2][0]],
    \uBC30\uC218: 1,
    \uD1B5\uADFC: 1,
    \uBFCC\uB9AC\uAE00: ""
  }));
  for (let i = 0; i + 1 < \uCC9C\uAC04.length; i++) {
    const a = \uCC9C\uAC04[i], b = \uCC9C\uAC04[i + 1];
    const e = \uD45C\uCC3E\uAE30(\uCC9C\uAC04\uD569\uD45C, a.\uAE00\uC790, b.\uAE00\uC790);
    if (e) {
      const \uC77C\uAC04\uB08C = a.\uC790\uB9AC === "\uC77C\uAC04" || b.\uC790\uB9AC === "\uC77C\uAC04";
      const \uD569\uC774\uB984 = `${\uC815\uC2DD(Object.keys(\uCC9C\uAC04\uD569\uD45C), a.\uAE00\uC790, b.\uAE00\uC790)}\uD569`;
      if (\uC77C\uAC04\uB08C) {
        const \uB2E4\uB978 = a.\uC790\uB9AC === "\uC77C\uAC04" ? b : a;
        \uB2E4\uB978.\uBC30\uC218 *= \uAE30\uC900.\uC77C\uAC04\uD569\uBB36\uC784;
        \uC0AC\uAC74.push(`${\uD569\uC774\uB984}(${a.\uC790\uB9AC}\xB7${b.\uC790\uB9AC}) \u2192 \uC77C\uAC04\uACFC \uD569\uD574 ${\uB2E4\uB978.\uC790\uB9AC} ${\uB2E4\uB978.\uAE00\uC790}\uC758 \uD798\uC774 \uBB36\uC784 (\uC77C\uAC04 \uC790\uC2E0\uC740 \uBCC0\uD558\uC9C0 \uC54A\uB294 \uAC83\uC73C\uB85C \uBD04)`);
      } else {
        const st = \uC655\uC0C1\uD734\uC218\uC0AC(\uC6D4\uC9C0, e);
        if (st === "\uC655" || st === "\uC0C1") {
          a.\uC624\uD589 = e;
          b.\uC624\uD589 = e;
          \uC0AC\uAC74.push(`${\uD569\uC774\uB984}(${a.\uC790\uB9AC}\xB7${b.\uC790\uB9AC}) \u2192 \uC6D4\uB839\uC5D0\uC11C ${\uC774(e)} ${st}\uC774\uB77C \uD569\uD654 \uC131\uB9BD, \uB450 \uAE00\uC790\uB97C ${\uC73C\uB85C(`${e}(${\uBB34\uB9AC\uC774\uB984(\uB098, e)})`)} \uBD04`);
        } else {
          a.\uBC30\uC218 *= \uAE30\uC900.\uCC9C\uAC04\uD569\uBB36\uC784;
          b.\uBC30\uC218 *= \uAE30\uC900.\uCC9C\uAC04\uD569\uBB36\uC784;
          \uC0AC\uAC74.push(`${\uD569\uC774\uB984}(${a.\uC790\uB9AC}\xB7${b.\uC790\uB9AC}) \u2192 \uC6D4\uB839\uC774 ${\uC744(e)} \uB3D5\uC9C0 \uC54A\uC544 \uD569\uD654\uD558\uC9C0 \uBABB\uD558\uACE0 \uB450 \uAE00\uC790\uAC00 \uBB36\uC5EC \uD798\uC774 \uC904\uC5B4\uB4E6`);
        }
      }
    }
    if (\uC30D(\uCC9C\uAC04\uCDA9\uC30D, a.\uAE00\uC790, b.\uAE00\uC790)) {
      for (const z of [a, b]) if (z.\uC790\uB9AC !== "\uC77C\uAC04") z.\uBC30\uC218 *= \uAE30\uC900.\uCC9C\uAC04\uCDA9;
      \uC0AC\uAC74.push(`${\uC815\uC2DD(\uCC9C\uAC04\uCDA9\uC30D, a.\uAE00\uC790, b.\uAE00\uC790)}\uCDA9(${a.\uC790\uB9AC}\xB7${b.\uC790\uB9AC}) \u2192 \uC11C\uB85C \uBD80\uB52A\uD600 ${[a, b].filter((z) => z.\uC790\uB9AC !== "\uC77C\uAC04").map((z) => z.\uC790\uB9AC).join("\xB7")} \uD798\uC774 \uC904\uC5B4\uB4E6`);
    }
  }
  for (const s of \uCC9C\uAC04) {
    let \uBCF8\uAE30 = "", \uACC1 = "";
    for (const z of \uC9C0\uC9C0) for (const h of \uC9C0\uC7A5\uAC04\uC77C\uC218[z.\uAE00\uC790]) {
      if (\uCC9C\uAC04\uC624\uD589[h.\uAC04] !== s.\uC624\uD589) continue;
      if (h.\uC790\uB9AC === "\uBCF8\uAE30") {
        if (!\uBCF8\uAE30) \uBCF8\uAE30 = `${z.\uC790\uB9AC} ${z.\uAE00\uC790}\uC758 \uBCF8\uAE30 ${h.\uAC04}`;
      } else if (!\uACC1) \uACC1 = `${z.\uC790\uB9AC} ${z.\uAE00\uC790}\uC758 ${h.\uC790\uB9AC} ${h.\uAC04}`;
    }
    if (\uBCF8\uAE30) {
      s.\uD1B5\uADFC = \uAE30\uC900.\uD1B5\uADFC.\uBCF8\uAE30;
      s.\uBFCC\uB9AC\uAE00 = `${\uBCF8\uAE30}\uC5D0 \uBFCC\uB9AC`;
    } else if (\uACC1) {
      s.\uD1B5\uADFC = \uAE30\uC900.\uD1B5\uADFC.\uC911\uAE30\uC5EC\uAE30;
      s.\uBFCC\uB9AC\uAE00 = `${\uACC1}\uC5D0 \uC57D\uD55C \uBFCC\uB9AC`;
    } else {
      s.\uD1B5\uADFC = \uAE30\uC900.\uD1B5\uADFC.\uC5C6\uC74C;
      s.\uBFCC\uB9AC\uAE00 = `\uBFCC\uB9AC \uC5C6\uC74C(\uD798 ${\uD37C\uC13C\uD2B8(\uAE30\uC900.\uD1B5\uADFC.\uC5C6\uC74C)}%)`;
    }
  }
  const \uACC4\uC808\uBC30\uC218 = (el) => \uAE30\uC900.\uACC4\uC808[\uC655\uC0C1\uD734\uC218\uC0AC(\uC6D4\uC9C0, el)];
  const \uD798 = { \uBAA9: 0, \uD654: 0, \uD1A0: 0, \uAE08: 0, \uC218: 0 };
  const \uC870\uAC01\uD798 = [];
  for (const z of \uC9C0\uC9C0) {
    let \uB3D5\uB294 = 0, \uC804\uCCB4 = 0;
    for (const [el, v] of z.\uD798) {
      const x = v * z.\uBC30\uC218 * \uACC4\uC808\uBC30\uC218(el);
      \uD798[el] += x;
      \uC804\uCCB4 += x;
      if (el === \uBB34\uB9AC.\uBE44\uAC81 || el === \uBB34\uB9AC.\uC778\uC131) \uB3D5\uB294 += x;
    }
    \uC870\uAC01\uD798.push({ \uC790\uB9AC: z.\uC790\uB9AC, \uB3D5\uB294, \uC804\uCCB4 });
  }
  for (const s of \uCC9C\uAC04) {
    const x = \uAE30\uC900.\uC790\uB9AC[s.\uC790\uB9AC] * s.\uBC30\uC218 * s.\uD1B5\uADFC * \uACC4\uC808\uBC30\uC218(s.\uC624\uD589);
    \uD798[s.\uC624\uD589] += x;
    \uC870\uAC01\uD798.push({ \uC790\uB9AC: s.\uC790\uB9AC, \uB3D5\uB294: s.\uC624\uD589 === \uBB34\uB9AC.\uBE44\uAC81 || s.\uC624\uD589 === \uBB34\uB9AC.\uC778\uC131 ? x : 0, \uC804\uCCB4: x });
  }
  const \uCD1D\uD569 = \uC624\uD589\uC21C.reduce((a, el) => a + \uD798[el], 0);
  const \uB3D5\uB294\uD798 = \uD798[\uBB34\uB9AC.\uBE44\uAC81] + \uD798[\uBB34\uB9AC.\uC778\uC131];
  const \uBE44\uC728 = \uB3D5\uB294\uD798 / \uCD1D\uD569;
  const \uB4F1\uAE09 = \uAE30\uC900.\uB4F1\uAE09.find((g) => \uBE44\uC728 >= g.\uC774\uC0C1).\uB4F1\uAE09;
  const \uB3D5\uB294\uC624\uD589 = (\uAC04) => \uCC9C\uAC04\uC624\uD589[\uAC04] === \uBB34\uB9AC.\uBE44\uAC81 || \uCC9C\uAC04\uC624\uD589[\uAC04] === \uBB34\uB9AC.\uC778\uC131;
  const \uD45C\uC2DC = (\uC9C0) => {
    const hs = \uC9C0\uC7A5\uAC04\uC77C\uC218[\uC9C0];
    if (\uB3D5\uB294\uC624\uD589(hs.find((h) => h.\uC790\uB9AC === "\uBCF8\uAE30").\uAC04)) return "O";
    return hs.some((h) => h.\uC790\uB9AC !== "\uBCF8\uAE30" && \uB3D5\uB294\uC624\uD589(h.\uAC04)) ? "\u25B3" : "X";
  };
  const \uB4DD\uB839 = \uD45C\uC2DC(\uC6D4\uC9C0);
  const \uB4DD\uC9C0 = \uD45C\uC2DC(p.day[1]);
  const \uB098\uBA38\uC9C0 = \uC870\uAC01\uD798.filter((x) => x.\uC790\uB9AC !== "\uC6D4\uC9C0" && x.\uC790\uB9AC !== "\uC77C\uC9C0" && x.\uC790\uB9AC !== "\uC77C\uAC04");
  const \uB098\uBA38\uC9C0\uBE44\uC728 = \uB098\uBA38\uC9C0.reduce((a, x) => a + x.\uB3D5\uB294, 0) / (\uB098\uBA38\uC9C0.reduce((a, x) => a + x.\uC804\uCCB4, 0) || 1);
  const \uBE44\uC728\uB4DD\uC138 = \uB098\uBA38\uC9C0\uBE44\uC728 >= \uAE30\uC900.\uB4DD\uC138.O ? "O" : \uB098\uBA38\uC9C0\uBE44\uC728 >= \uAE30\uC900.\uB4DD\uC138.\uC138\uBAA8 ? "\u25B3" : "X";
  const \uB4DD\uC138\uC62C\uB9BC = \uB3D5\uB294\uD569\uAD6D.length > 0 && \uBE44\uC728\uB4DD\uC138 !== "O";
  const \uB4DD\uC138 = \uB4DD\uC138\uC62C\uB9BC ? \uBE44\uC728\uB4DD\uC138 === "X" ? "\u25B3" : "O" : \uBE44\uC728\uB4DD\uC138;
  const \uC6D4\uBCF8\uAE30 = \uC9C0\uC7A5\uAC04\uC77C\uC218[\uC6D4\uC9C0].find((h) => h.\uC790\uB9AC === "\uBCF8\uAE30").\uAC04;
  const \uC77C\uBCF8\uAE30 = \uC9C0\uC7A5\uAC04\uC77C\uC218[p.day[1]].find((h) => h.\uC790\uB9AC === "\uBCF8\uAE30").\uAC04;
  const \uACC1\uB3C4\uC6C0 = (\uC9C0) => \uC9C0\uC7A5\uAC04\uC77C\uC218[\uC9C0].filter((h) => h.\uC790\uB9AC !== "\uBCF8\uAE30" && \uB3D5\uB294\uC624\uD589(h.\uAC04)).map((h) => `${h.\uC790\uB9AC} ${h.\uAC04}`);
  const \uB098\uC0C1\uD0DC = \uC655\uC0C1\uD734\uC218\uC0AC(\uC6D4\uC9C0, \uB098);
  \uADFC\uAC70.push(
    `\uC6D4\uB839: ${\uC6D4\uC9C0}\uC6D4(${\uACC4\uC808\uC774\uB984[\uC6D4\uC9C0]})\uC740 ${\uACC4\uC808\uC624\uD589[\uC6D4\uC9C0]}\uC758 \uACC4\uC808 \u2014 ${\uC77C\uAC04}${\uB098} \uC77C\uAC04\uC740 \u300C${\uB098\uC0C1\uD0DC}\u300D(${\uC655\uC0C1\uB73B[\uB098\uC0C1\uD0DC]}). \uC6D4\uC9C0 \uBCF8\uAE30 ${\uC740(\uC6D4\uBCF8\uAE30 + \uCC9C\uAC04\uC624\uD589[\uC6D4\uBCF8\uAE30])} ${\uBB34\uB9AC\uC774\uB984(\uB098, \uCC9C\uAC04\uC624\uD589[\uC6D4\uBCF8\uAE30])}` + (\uB4DD\uB839 === "\u25B3" ? `, \uC6D4\uC9C0 \uC18D ${\uC774(\uACC1\uB3C4\uC6C0(\uC6D4\uC9C0).join("\xB7"))} \uC870\uAE08 \uB3C4\uC6C0` : "") + ` \u2192 \uB4DD\uB839 ${\uB4DD\uB839}`
  );
  \uADFC\uAC70.push(
    `\uC77C\uC9C0: ${p.day[1]}\uC758 \uBCF8\uAE30 ${\uC740(\uC77C\uBCF8\uAE30 + \uCC9C\uAC04\uC624\uD589[\uC77C\uBCF8\uAE30])} ${\uBB34\uB9AC\uC774\uB984(\uB098, \uCC9C\uAC04\uC624\uD589[\uC77C\uBCF8\uAE30])}` + (\uB4DD\uC9C0 === "\u25B3" ? `, ${\uC774(\uACC1\uB3C4\uC6C0(p.day[1]).join("\xB7"))} \uC57D\uD55C \uBFCC\uB9AC` : "") + ` \u2192 \uB4DD\uC9C0 ${\uB4DD\uC9C0}`
  );
  \uADFC\uAC70.push(`\uCC9C\uAC04 \uBFCC\uB9AC(\uD22C\uAC04\xB7\uD1B5\uADFC): ${\uCC9C\uAC04.map((s) => `${s.\uC790\uB9AC} ${s.\uAE00\uC790}${\uCC9C\uAC04\uC624\uD589[s.\uAE00\uC790]}${s.\uC624\uD589 !== \uCC9C\uAC04\uC624\uD589[s.\uAE00\uC790] ? `(\uD569\uD654 ${s.\uC624\uD589})` : ""} ${s.\uBFCC\uB9AC\uAE00}`).join(" / ")}`);
  if (\uC0AC\uAC74.length) \uC0AC\uAC74.forEach((x) => \uADFC\uAC70.push(`\uAD00\uACC4: ${x}`));
  else \uADFC\uAC70.push("\uAD00\uACC4: \uC138\uB825\uC744 \uBC14\uAFC0 \uB9CC\uD55C \uD569\xB7\uCDA9\xB7\uD615\xB7\uD30C\xB7\uD574\uAC00 \uC5C6\uC74C");
  const \uBB34\uB9AC\uD37C\uC13C\uD2B8 = Object.fromEntries(Object.keys(\uBB34\uB9AC).map((k2) => [k2, \uD37C\uC13C\uD2B8(\uD798[\uBB34\uB9AC[k2]] / \uCD1D\uD569)]));
  \uADFC\uAC70.push(
    `\uC138\uB825: \uB3D5\uB294 \uD798 ${\uD37C\uC13C\uD2B8(\uBE44\uC728)}% (\uBE44\uAC81 ${\uBB34\uB9AC\uD37C\uC13C\uD2B8.\uBE44\uAC81}% \xB7 \uC778\uC131 ${\uBB34\uB9AC\uD37C\uC13C\uD2B8.\uC778\uC131}%) / \uBE7C\uB294 \uD798 ${100 - \uD37C\uC13C\uD2B8(\uBE44\uC728)}% (\uC2DD\uC0C1 ${\uBB34\uB9AC\uD37C\uC13C\uD2B8.\uC2DD\uC0C1}% \xB7 \uC7AC\uC131 ${\uBB34\uB9AC\uD37C\uC13C\uD2B8.\uC7AC\uC131}% \xB7 \uAD00\uC131 ${\uBB34\uB9AC\uD37C\uC13C\uD2B8.\uAD00\uC131}%)`
  );
  \uADFC\uAC70.push(
    `\uB4DD\uC138: \uC6D4\uC9C0\xB7\uC77C\uC9C0\xB7\uC77C\uAC04\uC744 \uBE80 \uB098\uBA38\uC9C0 \uAE00\uC790\uC5D0\uC11C \uB3D5\uB294 \uD798\uC774 ${\uD37C\uC13C\uD2B8(\uB098\uBA38\uC9C0\uBE44\uC728)}% (${\uD37C\uC13C\uD2B8(\uAE30\uC900.\uB4DD\uC138.O)}% \uC774\uC0C1 O \xB7 ${\uD37C\uC13C\uD2B8(\uAE30\uC900.\uB4DD\uC138.\uC138\uBAA8)}% \uC774\uC0C1 \u25B3 \u2192 ${\uBE44\uC728\uB4DD\uC138})` + (\uB4DD\uC138\uC62C\uB9BC ? `, ${\uB3D5\uB294\uD569\uAD6D.join("\xB7")}\uC73C\uB85C \uB3D5\uB294 \uC624\uD589\uC774 \uBAA8\uC5EC \uD55C \uB2E8\uACC4 \uC62C\uB9BC` : "") + ` \u2192 \uB4DD\uC138 ${\uB4DD\uC138}`
  );
  const \uAD6C\uAC04 = \uAE30\uC900.\uB4F1\uAE09.findIndex((g) => g.\uB4F1\uAE09 === \uB4F1\uAE09);
  const \uD558\uD55C = \uD37C\uC13C\uD2B8(\uAE30\uC900.\uB4F1\uAE09[\uAD6C\uAC04].\uC774\uC0C1), \uC0C1\uD55C = \uAD6C\uAC04 > 0 ? \uD37C\uC13C\uD2B8(\uAE30\uC900.\uB4F1\uAE09[\uAD6C\uAC04 - 1].\uC774\uC0C1) : 100;
  \uADFC\uAC70.push(`\uD310\uC815: \uB3D5\uB294 \uD798 ${\uD37C\uC13C\uD2B8(\uBE44\uC728)}%\uB294 ${\uB4F1\uAE09} \uAD6C\uAC04(${\uD558\uD55C}% \uC774\uC0C1 ${\uC0C1\uD55C}% \uBBF8\uB9CC)`);
  return {
    \uB4F1\uAE09,
    \uC810\uC218: \uD37C\uC13C\uD2B8(\uBE44\uC728),
    \uB4DD\uB839,
    \uB4DD\uC9C0,
    \uB4DD\uC138,
    \uC624\uD589\uD798: Object.fromEntries(\uC624\uD589\uC21C.map((el) => [el, \uD37C\uC13C\uD2B8(\uD798[el] / \uCD1D\uD569)])),
    \uC2ED\uC131\uD798: \uBB34\uB9AC\uD37C\uC13C\uD2B8,
    \uADFC\uAC70,
    \uC77C\uAC04\uC624\uD589: \uB098,
    \uC6D4\uC9C0
  };
}
function \uC138\uB825\uAE30\uC900\uC124\uBA85() {
  const b = \uC138\uB825\uAE30\uC900;
  const p = \uD37C\uC13C\uD2B8;
  return [
    "\uC774 \uBE44\uC728\uC740 \uBA85\uB9AC \uACF5\uD1B5 \uACF5\uC2DD\uC774 \uC544\uB2C8\uB77C \uC774 \uB9CC\uC138\uB825\uC758 \uACC4\uC0B0 \uAE30\uC900\uC774\uC5D0\uC694. \uC5EC\uB35F \uAE00\uC790(\uC2DC\uAC04 \uBAA8\uB974\uBA74 \uC5EC\uC12F)\uC758 \uD798\uC744 \uC624\uD589\uBCC4\uB85C \uB354\uD55C \uD569\uACC4\uB97C 100%\uB85C \uBCF4\uACE0, \uBE44\uAC81+\uC778\uC131\uC744 \u300C\uB3D5\uB294 \uD798\u300D\uC73C\uB85C \uBD10\uC694.",
    `\uC790\uB9AC \uAC00\uC911\uCE58: \uC6D4\uC9C0 ${b.\uC790\uB9AC.\uC6D4\uC9C0} \xB7 \uC77C\uC9C0 ${b.\uC790\uB9AC.\uC77C\uC9C0} \xB7 \uC2DC\uC9C0 ${b.\uC790\uB9AC.\uC2DC\uC9C0} \xB7 \uB144\uC9C0 ${b.\uC790\uB9AC.\uB144\uC9C0} / \uC6D4\uAC04 ${b.\uC790\uB9AC.\uC6D4\uAC04} \xB7 \uC77C\uAC04 ${b.\uC790\uB9AC.\uC77C\uAC04} \xB7 \uC2DC\uAC04 ${b.\uC790\uB9AC.\uC2DC\uAC04} \xB7 \uB144\uAC04 ${b.\uC790\uB9AC.\uB144\uAC04}`,
    "\uC9C0\uC7A5\uAC04: \uC9C0\uC9C0 \uD55C \uAE00\uC790\uC758 \uD798\uC744 \uC5EC\uAE30\xB7\uC911\uAE30\xB7\uBCF8\uAE30\uC5D0 \uC0AC\uB839 \uC77C\uC218(30\uC77C) \uBE44\uC728\uB85C \uB098\uB220\uC694. \uC608) \uC9C4 = \uC744 9\uC77C \xB7 \uACC4 3\uC77C \xB7 \uBB34 18\uC77C \u2014 \uAC89\uAE00\uC790\uC5D0 \uC5C6\uB294 \uC624\uD589\uB3C4 \uC774\uB807\uAC8C \uC870\uAE08 \uC7A1\uD600\uC694.",
    `\uACC4\uC808(\uC6D4\uB839): \uD0DC\uC5B4\uB09C \uB2EC\uC758 \uACC4\uC808\uC5D0\uC11C \uC655 \xD7${b.\uACC4\uC808.\uC655} \xB7 \uC0C1 \xD7${b.\uACC4\uC808.\uC0C1} \xB7 \uD734 \xD7${b.\uACC4\uC808.\uD734} \xB7 \uC218 \xD7${b.\uACC4\uC808.\uC218} \xB7 \uC0AC \xD7${b.\uACC4\uC808.\uC0AC}`,
    `\uD1B5\uADFC: \uCC9C\uAC04\uC740 \uAC19\uC740 \uC624\uD589\uC774 \uC9C0\uC9C0 \uBCF8\uAE30\uC5D0 \uC788\uC73C\uBA74 \xD7${b.\uD1B5\uADFC.\uBCF8\uAE30}, \uC911\uAE30\xB7\uC5EC\uAE30\uC5D0\uB9CC \uC788\uC73C\uBA74 \xD7${b.\uD1B5\uADFC.\uC911\uAE30\uC5EC\uAE30}, \uC5C6\uC73C\uBA74 \xD7${b.\uD1B5\uADFC.\uC5C6\uC74C}`,
    `\uBC29\uD569\xB7\uC0BC\uD569: \uC138 \uAE00\uC790\uAC00 \uBAA8\uB450 \uC788\uC744 \uB54C\uB9CC \uC131\uB9BD, \uC138 \uAE00\uC790 \uD798\uC758 ${p(b.\uBC29\uD569\uC62E\uAE40)}%\uB97C \uADF8 \uC624\uD589\uC73C\uB85C \uC62E\uACA8\uC694. \uBC18\uD569(\uC655\uC9C0 \uD3EC\uD568, \uBD99\uC5B4 \uC788\uAC70\uB098 \uC6D4\uC9C0\uAC00 \uB084 \uB54C) ${p(b.\uBC18\uD569\uC62E\uAE40)}%. \uC721\uD569: \uBD99\uC5B4 \uC788\uACE0 \uD569\uD55C \uC624\uD589\uC774 \uC6D4\uB839\uC5D0\uC11C \uC655\xB7\uC0C1\uC774\uBA74 ${p(b.\uC721\uD569\uC62E\uAE40)}%\uB97C \uC62E\uAE30\uACE0, \uC544\uB2C8\uBA74 \uD569\uD654\uD558\uC9C0 \uBABB\uD55C \uAC83\uC73C\uB85C \uBCF4\uACE0 \uB450 \uAE00\uC790 \xD7${b.\uC721\uD569\uBB36\uC784}`,
    `\uCC9C\uAC04\uD569: \uBD99\uC5B4 \uC788\uB294 \uB450 \uCC9C\uAC04\uC774 \uD569\uD558\uACE0 \uD569\uD55C \uC624\uD589\uC774 \uC6D4\uB839\uC5D0\uC11C \uC655\xB7\uC0C1\uC774\uBA74 \uD569\uD654(\uB450 \uAE00\uC790\uB97C \uADF8 \uC624\uD589\uC73C\uB85C), \uC544\uB2C8\uBA74 \uB450 \uAE00\uC790 \xD7${b.\uCC9C\uAC04\uD569\uBB36\uC784}. \uC77C\uAC04\uC774 \uB080 \uD569\uC740 \uD569\uD654\uB85C \uBCF4\uC9C0 \uC54A\uACE0 \uC0C1\uB300 \uAE00\uC790\uB9CC \xD7${b.\uC77C\uAC04\uD569\uBB36\uC784}`,
    `\uCDA9\xB7\uD615\xB7\uD30C\xB7\uD574: \uCDA9\uC740 \uBD99\uC5B4 \uC788\uC73C\uBA74 \xD7${b.\uCDA9.\uBD99\uC74C}(\uC6D4\uC9C0 \xD7${b.\uCDA9.\uC6D4\uC9C0\uBD99\uC74C}), \uB5A8\uC5B4\uC838 \uC788\uC73C\uBA74 \xD7${b.\uCDA9.\uB5A8\uC5B4\uC9D0}(\uC6D4\uC9C0 \xD7${b.\uCDA9.\uC6D4\uC9C0\uB5A8\uC5B4\uC9D0}) \xB7 \uBD99\uC5B4 \uC788\uB294 \uD615\xB7\uD30C\xB7\uD574 \xD7${b.\uD615\uD30C\uD574} \xB7 \uCC9C\uAC04\uCDA9 \xD7${b.\uCC9C\uAC04\uCDA9}`,
    `\uB4F1\uAE09 \uAD6C\uAC04(\uB3D5\uB294 \uD798): ${b.\uB4F1\uAE09.map((g, i) => i === 0 ? `${g.\uB4F1\uAE09} ${p(g.\uC774\uC0C1)}% \uC774\uC0C1` : `${g.\uB4F1\uAE09} ${p(g.\uC774\uC0C1)}~${p(b.\uB4F1\uAE09[i - 1].\uC774\uC0C1)}%`).join(" \xB7 ")}`,
    `\uB4DD\uB839\xB7\uB4DD\uC9C0: \uC6D4\uC9C0\xB7\uC77C\uC9C0 \uBCF8\uAE30\uAC00 \uBE44\uAC81\xB7\uC778\uC131\uC774\uBA74 O, \uC5EC\uAE30\xB7\uC911\uAE30\uB9CC \uADF8\uB807\uB2E4\uBA74 \u25B3 / \uB4DD\uC138: \uB098\uBA38\uC9C0 \uAE00\uC790\uC758 \uB3D5\uB294 \uD798 ${p(b.\uB4DD\uC138.O)}% \uC774\uC0C1 O, ${p(b.\uB4DD\uC138.\uC138\uBAA8)}% \uC774\uC0C1 \u25B3, \uB3D5\uB294 \uC624\uD589\uC758 \uBC29\uD569\xB7\uC0BC\uD569\uC774 \uC131\uB9BD\uD558\uBA74 \uD55C \uB2E8\uACC4 \uC62C\uB9BC`
  ];
}
var \uAC15\uD55C\uB4F1\uAE09 = /* @__PURE__ */ new Set(["\uADF9\uC2E0\uAC15", "\uC2E0\uAC15", "\uC911\uAC15"]);
var \uC57D\uD55C\uB4F1\uAE09 = /* @__PURE__ */ new Set(["\uC911\uC57D", "\uC2E0\uC57D", "\uADF9\uC2E0\uC57D"]);
var \uC870\uD6C4\uC624\uD589 = (\uAE00\uC790) => \uCC9C\uAC04\uC624\uD589[\uAE00\uC790] ?? \uAE00\uC790;
function \uC6A9\uC2E0\uBD84\uC11D(s, \uC870\uD6C4\uC8FC\uC6A9\uC2E0) {
  const \uB098 = s.\uC77C\uAC04\uC624\uD589;
  const m = \uBB34\uB9AC\uC624\uD589(\uB098);
  const f = s.\uC2ED\uC131\uD798;
  const \uC774\uB984 = (k2) => `${m[k2]}(${k2})`;
  const \uADFC\uAC70 = [];
  let \uC6A9\uC2E0, \uD76C\uC2E0, \uBC29\uBC95;
  if (\uAC15\uD55C\uB4F1\uAE09.has(s.\uB4F1\uAE09)) {
    if (f.\uC778\uC131 > f.\uBE44\uAC81) {
      \uC6A9\uC2E0 = m.\uC7AC\uC131;
      \uD76C\uC2E0 = m.\uC2DD\uC0C1;
      \uBC29\uBC95 = "\uC5B5\uBD80(\uC7AC\uADF9\uC778)";
      \uADFC\uAC70.push(`${s.\uB4F1\uAE09}\uC774\uACE0 \uB3D5\uB294 \uD798 \uAC00\uC6B4\uB370 \uC778\uC131(${f.\uC778\uC131}%)\uC774 \uBE44\uAC81(${f.\uBE44\uAC81}%)\uBCF4\uB2E4 \uD07C \u2192 \uB118\uCE58\uB294 \uC778\uC131\uC744 \uB204\uB974\uB294 ${\uC744(\uC774\uB984("\uC7AC\uC131"))} \uC6A9\uC2E0, \uC7AC\uC131\uC744 \uC0DD\uD558\uB294 ${\uC744(\uC774\uB984("\uC2DD\uC0C1"))} \uD76C\uC2E0\uC73C\uB85C \uBD04`);
    } else if (f.\uAD00\uC131 >= f.\uC2DD\uC0C1 && f.\uAD00\uC131 >= 10) {
      \uC6A9\uC2E0 = m.\uAD00\uC131;
      \uD76C\uC2E0 = m.\uC7AC\uC131;
      \uBC29\uBC95 = "\uC5B5\uBD80(\uAD00\uC131\uC73C\uB85C \uC5B5\uC81C)";
      \uADFC\uAC70.push(`${s.\uB4F1\uAE09}\uC774\uACE0 \uBE44\uAC81(${f.\uBE44\uAC81}%)\uC774 \uC8FC\uB3C4, \uAD00\uC131\uC774 ${f.\uAD00\uC131}%\uB85C \uC4F8 \uB9CC\uD568 \u2192 \uB098\uB97C \uB2E4\uC2A4\uB9AC\uB294 ${\uC744(\uC774\uB984("\uAD00\uC131"))} \uC6A9\uC2E0, \uAD00\uC131\uC744 \uC0DD\uD558\uB294 ${\uC744(\uC774\uB984("\uC7AC\uC131"))} \uD76C\uC2E0\uC73C\uB85C \uBD04`);
    } else {
      \uC6A9\uC2E0 = m.\uC2DD\uC0C1;
      \uD76C\uC2E0 = m.\uC7AC\uC131;
      \uBC29\uBC95 = "\uC5B5\uBD80(\uC2DD\uC0C1\uC73C\uB85C \uC124\uAE30)";
      \uADFC\uAC70.push(`${s.\uB4F1\uAE09}\uC774\uACE0 \uBE44\uAC81(${f.\uBE44\uAC81}%)\uC774 \uC8FC\uB3C4, \uAD00\uC131\uC774 ${f.\uAD00\uC131}%\uB85C \uC57D\uD574 \uB204\uB974\uAE30\uBCF4\uB2E4 \uD758\uB824\uBCF4\uB0B4\uB294 \uD3B8\uC774 \uC21C\uD568 \u2192 ${\uC744(\uC774\uB984("\uC2DD\uC0C1"))} \uC6A9\uC2E0, \uC2DD\uC0C1\uC758 \uD798\uC744 \uBC1B\uC544 \uC4F0\uB294 ${\uC744(\uC774\uB984("\uC7AC\uC131"))} \uD76C\uC2E0\uC73C\uB85C \uBD04`);
    }
  } else if (\uC57D\uD55C\uB4F1\uAE09.has(s.\uB4F1\uAE09)) {
    const \uBE7C\uB294 = ["\uAD00\uC131", "\uC2DD\uC0C1", "\uC7AC\uC131"];
    const \uAC00\uC7A5 = \uBE7C\uB294.reduce((a, b) => f[b] > f[a] ? b : a);
    if (\uAC00\uC7A5 === "\uC7AC\uC131") {
      \uC6A9\uC2E0 = m.\uBE44\uAC81;
      \uD76C\uC2E0 = m.\uC778\uC131;
      \uBC29\uBC95 = "\uC5B5\uBD80(\uBE44\uAC81\uC73C\uB85C \uC7AC\uC131 \uAC10\uB2F9)";
      \uADFC\uAC70.push(`${s.\uB4F1\uAE09}\uC774\uACE0 \uBE7C\uB294 \uD798 \uAC00\uC6B4\uB370 \uC7AC\uC131(${f.\uC7AC\uC131}%)\uC774 \uAC00\uC7A5 \uD07C \u2192 \uC7AC\uC131\uC744 \uAC10\uB2F9\uD560 ${\uC744(\uC774\uB984("\uBE44\uAC81"))} \uC6A9\uC2E0, \uBE44\uAC81\uC744 \uC0DD\uD558\uB294 ${\uC744(\uC774\uB984("\uC778\uC131"))} \uD76C\uC2E0\uC73C\uB85C \uBD04`);
    } else if (\uAC00\uC7A5 === "\uAD00\uC131") {
      \uC6A9\uC2E0 = m.\uC778\uC131;
      \uD76C\uC2E0 = m.\uBE44\uAC81;
      \uBC29\uBC95 = "\uC5B5\uBD80(\uC0B4\uC778\uC0C1\uC0DD)";
      \uADFC\uAC70.push(`${s.\uB4F1\uAE09}\uC774\uACE0 \uBE7C\uB294 \uD798 \uAC00\uC6B4\uB370 \uAD00\uC131(${f.\uAD00\uC131}%)\uC774 \uAC00\uC7A5 \uD07C \u2192 \uAD00\uC131\uC758 \uD798\uC744 \uBC1B\uC544 \uB098\uB97C \uC0DD\uD558\uB294 ${\uC744(\uC774\uB984("\uC778\uC131"))} \uC6A9\uC2E0(\uC0B4\uC778\uC0C1\uC0DD), \uB098\uC640 \uAC19\uC740 ${\uC744(\uC774\uB984("\uBE44\uAC81"))} \uD76C\uC2E0\uC73C\uB85C \uBD04`);
    } else {
      \uC6A9\uC2E0 = m.\uC778\uC131;
      \uD76C\uC2E0 = m.\uBE44\uAC81;
      \uBC29\uBC95 = "\uC5B5\uBD80(\uC778\uC131\uC73C\uB85C \uC2DD\uC0C1 \uC81C\uC5B4)";
      \uADFC\uAC70.push(`${s.\uB4F1\uAE09}\uC774\uACE0 \uBE7C\uB294 \uD798 \uAC00\uC6B4\uB370 \uC2DD\uC0C1(${f.\uC2DD\uC0C1}%)\uC774 \uAC00\uC7A5 \uCEE4 \uD798\uC774 \uC0C8\uC5B4 \uB098\uAC10 \u2192 \uC2DD\uC0C1\uC744 \uB204\uB974\uACE0 \uB098\uB97C \uC0DD\uD558\uB294 ${\uC744(\uC774\uB984("\uC778\uC131"))} \uC6A9\uC2E0, ${\uC744(\uC774\uB984("\uBE44\uAC81"))} \uD76C\uC2E0\uC73C\uB85C \uBD04`);
    }
  } else {
    \uC6A9\uC2E0 = \uC870\uD6C4\uC624\uD589(\uC870\uD6C4\uC8FC\uC6A9\uC2E0);
    \uD76C\uC2E0 = \uC0DD\uBC1B[\uC6A9\uC2E0];
    \uBC29\uBC95 = "\uC870\uD6C4(\uADE0\uD615\uC774\uB77C \uACC4\uC808 \uC6B0\uC120)";
    \uADFC\uAC70.push(`\uC911\uD654\uB77C \uB3D5\uB294 \uD798(${s.\uC810\uC218}%)\uACFC \uBE7C\uB294 \uD798\uC774 \uBE44\uC2B7\uD574 \uC5B5\uBD80\uBCF4\uB2E4 \uACC4\uC808\uC758 \uC628\uB3C4\uB97C \uBA3C\uC800 \uB9DE\uCDA4 \u2192 ${s.\uC6D4\uC9C0}\uC6D4 \uC870\uD6C4\uD45C\uC758 \uC8FC\uC6A9\uC2E0 ${\uC744(`${\uC870\uD6C4\uC8FC\uC6A9\uC2E0}(${\uC6A9\uC2E0})`)} \uC6A9\uC2E0, \uC774\uB97C \uC0DD\uD558\uB294 ${\uC744(\uD76C\uC2E0)} \uD76C\uC2E0\uC73C\uB85C \uBD04`);
  }
  const \uC5EC\uB984 = ["\uC0AC", "\uC624", "\uBBF8"].includes(s.\uC6D4\uC9C0), \uACA8\uC6B8 = ["\uD574", "\uC790", "\uCD95"].includes(s.\uC6D4\uC9C0);
  const \uC870\uD6C4\uD544\uC694 = \uC5EC\uB984 ? "\uC218" : \uACA8\uC6B8 ? "\uD654" : null;
  if (\uC870\uD6C4\uD544\uC694 && \uC6A9\uC2E0 !== \uC870\uD6C4\uD544\uC694 && \uD76C\uC2E0 !== \uC870\uD6C4\uD544\uC694 && s.\uC624\uD589\uD798[\uC870\uD6C4\uD544\uC694] < \uD37C\uC13C\uD2B8(\uC138\uB825\uAE30\uC900.\uC870\uD6C4\uAE09\uD568)) {
    \uADFC\uAC70.push(`\uCC38\uACE0: ${\uACC4\uC808\uC774\uB984[s.\uC6D4\uC9C0]} \uD0DC\uC0DD\uC778\uB370 ${\uC870\uD6C4\uD544\uC694}(${\uD55C\uC790[\uC870\uD6C4\uD544\uC694]}) \uAE30\uC6B4\uC774 ${s.\uC624\uD589\uD798[\uC870\uD6C4\uD544\uC694]}%\uB85C \uB9E4\uC6B0 \uC801\uC5B4, \uC870\uD6C4\uB85C\uB294 ${\uC870\uD6C4\uD544\uC694}\uB3C4 \uD568\uAED8 \uCC59\uACA8\uC57C \uD568`);
  }
  const \uAE30\uC2E0 = \uADF9\uBC1B[\uC6A9\uC2E0];
  const \uAD6C\uC2E0 = \uC0DD\uBC1B[\uAE30\uC2E0];
  const \uD55C\uC2E0 = \uC624\uD589\uC21C.find((el) => ![\uC6A9\uC2E0, \uD76C\uC2E0, \uAE30\uC2E0, \uAD6C\uC2E0].includes(el));
  \uADFC\uAC70.push(`\uAE30\uC2E0\uC740 \uC6A9\uC2E0 ${\uC744(\uC6A9\uC2E0)} \uADF9\uD558\uB294 ${\uAE30\uC2E0}, \uAD6C\uC2E0\uC740 \uAE30\uC2E0\uC744 \uC0DD\uD558\uB294 ${\uAD6C\uC2E0}, \uD55C\uC2E0\uC740 \uB098\uBA38\uC9C0 ${\uD55C\uC2E0}`);
  return { \uC6A9\uC2E0, \uD76C\uC2E0, \uAE30\uC2E0, \uAD6C\uC2E0, \uD55C\uC2E0, \uBC29\uBC95, \uADFC\uAC70 };
}

// src/engine.ts
var H2K = { \u7532: "\uAC11", \u4E59: "\uC744", \u4E19: "\uBCD1", \u4E01: "\uC815", \u620A: "\uBB34", \u5DF1: "\uAE30", \u5E9A: "\uACBD", \u8F9B: "\uC2E0", \u58EC: "\uC784", \u7678: "\uACC4", \u5B50: "\uC790", \u4E11: "\uCD95", \u5BC5: "\uC778", \u536F: "\uBB18", \u8FB0: "\uC9C4", \u5DF3: "\uC0AC", \u5348: "\uC624", \u672A: "\uBBF8", \u7533: "\uC2E0", \u9149: "\uC720", \u620C: "\uC220", \u4EA5: "\uD574", \u6728: "\uBAA9", \u706B: "\uD654", \u571F: "\uD1A0", \u91D1: "\uAE08", \u6C34: "\uC218" };
var k = (s) => s ? String(s).replace(/[一-鿿]/g, (c) => H2K[c] || c) : s;
var STEM_K2H = { \uAC11: "\u7532", \uC744: "\u4E59", \uBCD1: "\u4E19", \uC815: "\u4E01", \uBB34: "\u620A", \uAE30: "\u5DF1", \uACBD: "\u5E9A", \uC2E0: "\u8F9B", \uC784: "\u58EC", \uACC4: "\u7678" };
var BRANCH_K2H = { \uC790: "\u5B50", \uCD95: "\u4E11", \uC778: "\u5BC5", \uBB18: "\u536F", \uC9C4: "\u8FB0", \uC0AC: "\u5DF3", \uC624: "\u5348", \uBBF8: "\u672A", \uC2E0: "\u7533", \uC720: "\u9149", \uC220: "\u620C", \uD574: "\u4EA5" };
var STEM_ELEM = { \u7532: "\uBAA9", \u4E59: "\uBAA9", \u4E19: "\uD654", \u4E01: "\uD654", \u620A: "\uD1A0", \u5DF1: "\uD1A0", \u5E9A: "\uAE08", \u8F9B: "\uAE08", \u58EC: "\uC218", \u7678: "\uC218" };
var STEM_YANG = { \u7532: true, \u4E59: false, \u4E19: true, \u4E01: false, \u620A: true, \u5DF1: false, \u5E9A: true, \u8F9B: false, \u58EC: true, \u7678: false };
var SAENG = { \uBAA9: "\uD654", \uD654: "\uD1A0", \uD1A0: "\uAE08", \uAE08: "\uC218", \uC218: "\uBAA9" };
var GEUK = { \uBAA9: "\uD1A0", \uD654: "\uAE08", \uD1A0: "\uC218", \uAE08: "\uBAA9", \uC218: "\uD654" };
function tenGod(dayStem, other) {
  const de = STEM_ELEM[dayStem], oe = STEM_ELEM[other];
  const same = STEM_YANG[dayStem] === STEM_YANG[other];
  if (de === oe) return same ? "\uBE44\uACAC" : "\uAC81\uC7AC";
  if (SAENG[de] === oe) return same ? "\uC2DD\uC2E0" : "\uC0C1\uAD00";
  if (GEUK[de] === oe) return same ? "\uD3B8\uC7AC" : "\uC815\uC7AC";
  if (GEUK[oe] === de) return same ? "\uD3B8\uAD00" : "\uC815\uAD00";
  if (SAENG[oe] === de) return same ? "\uD3B8\uC778" : "\uC815\uC778";
  return "";
}
var BRANCH_MAIN = { \u5B50: "\u7678", \u4E11: "\u5DF1", \u5BC5: "\u7532", \u536F: "\u4E59", \u8FB0: "\u620A", \u5DF3: "\u4E19", \u5348: "\u4E01", \u672A: "\u5DF1", \u7533: "\u5E9A", \u9149: "\u8F9B", \u620C: "\u620A", \u4EA5: "\u58EC" };
var BRANCH_ELEM_KO = { \uC790: "\uC218", \uCD95: "\uD1A0", \uC778: "\uBAA9", \uBB18: "\uBAA9", \uC9C4: "\uD1A0", \uC0AC: "\uD654", \uC624: "\uD654", \uBBF8: "\uD1A0", \uC2E0: "\uAE08", \uC720: "\uAE08", \uC220: "\uD1A0", \uD574: "\uC218" };
function \uC624\uD589\uBD84\uD3EC\uACC4\uC0B0(pillars) {
  const count = { \uBAA9: 0, \uD654: 0, \uD1A0: 0, \uAE08: 0, \uC218: 0 };
  pillars.forEach((gz) => {
    count[STEM_ELEM_KO[gz[0]]]++;
    count[BRANCH_ELEM_KO[gz[1]]]++;
  });
  return count;
}
var HIDDEN_STEMS_TABLE = {
  \uC790: { \uC5EC\uAE30: "\uC784", \uC911\uAE30: null, \uC815\uAE30: "\uACC4" },
  \uCD95: { \uC5EC\uAE30: "\uACC4", \uC911\uAE30: "\uC2E0", \uC815\uAE30: "\uAE30" },
  \uC778: { \uC5EC\uAE30: "\uBB34", \uC911\uAE30: "\uBCD1", \uC815\uAE30: "\uAC11" },
  \uBB18: { \uC5EC\uAE30: "\uAC11", \uC911\uAE30: null, \uC815\uAE30: "\uC744" },
  \uC9C4: { \uC5EC\uAE30: "\uC744", \uC911\uAE30: "\uACC4", \uC815\uAE30: "\uBB34" },
  \uC0AC: { \uC5EC\uAE30: "\uBB34", \uC911\uAE30: "\uACBD", \uC815\uAE30: "\uBCD1" },
  \uC624: { \uC5EC\uAE30: "\uBCD1", \uC911\uAE30: "\uAE30", \uC815\uAE30: "\uC815" },
  \uBBF8: { \uC5EC\uAE30: "\uC815", \uC911\uAE30: "\uC744", \uC815\uAE30: "\uAE30" },
  \uC2E0: { \uC5EC\uAE30: "\uBB34", \uC911\uAE30: "\uC784", \uC815\uAE30: "\uACBD" },
  \uC720: { \uC5EC\uAE30: "\uACBD", \uC911\uAE30: null, \uC815\uAE30: "\uC2E0" },
  \uC220: { \uC5EC\uAE30: "\uC2E0", \uC911\uAE30: "\uC815", \uC815\uAE30: "\uBB34" },
  \uD574: { \uC5EC\uAE30: "\uBB34", \uC911\uAE30: "\uAC11", \uC815\uAE30: "\uC784" }
};
function \uC9C0\uC7A5\uAC04\uC2ED\uC131\uBAA9\uB85D(dayStemHanja, branch) {
  const hs = HIDDEN_STEMS_TABLE[branch];
  const line = (stemKo) => stemKo ? `${stemKo} (${tenGod(dayStemHanja, STEM_K2H[stemKo])})` : "-";
  return [line(hs.\uC5EC\uAE30), line(hs.\uC911\uAE30), line(hs.\uC815\uAE30)];
}
function \uC9C0\uC7A5\uAC04\uB77C\uC778(dayStemHanja, branch) {
  const hs = HIDDEN_STEMS_TABLE[branch];
  const seg = (stemKo) => stemKo ? `${stemKo}(${tenGod(dayStemHanja, STEM_K2H[stemKo])})` : "-";
  return [seg(hs.\uC5EC\uAE30), seg(hs.\uC911\uAE30), seg(hs.\uC815\uAE30)].join("\xB7");
}
var HIDDEN_SLOT_LABEL = { \uC5EC\uAE30: "\uC5EC\uAE30", \uC911\uAE30: "\uC911\uAE30", \uC815\uAE30: "\uBCF8\uAE30" };
var \uACA9\uAD6D\uAE30\uC900 = "\uC6D4\uB839 \uAE30\uC900: \uC6D4\uC9C0\uAC00 \uC77C\uAC04\uC758 \uAC74\uB85D\xB7\uC591\uC778\uC774\uBA74 \uAC74\uB85D\uACA9\xB7\uC591\uC778\uACA9, \uC544\uB2C8\uBA74 \uC6D4\uC9C0 \uC9C0\uC7A5\uAC04 \uC911 \uB144\xB7\uC6D4\xB7\uC2DC \uCC9C\uAC04\uC5D0 \uB4DC\uB7EC\uB09C \uAE00\uC790\uB97C \uBCF8\uAE30\u2192\uC911\uAE30\u2192\uC5EC\uAE30 \uC21C\uC73C\uB85C \uACE8\uB77C \uADF8 \uC2ED\uC131\uC73C\uB85C \uC815\uD558\uACE0, \uB4DC\uB7EC\uB09C \uAE00\uC790\uAC00 \uC5C6\uC73C\uBA74 \uBCF8\uAE30\uB85C \uC815\uD568";
var \uAC74\uB85D\uC9C0 = { \uAC11: "\uC778", \uC744: "\uBB18", \uBCD1: "\uC0AC", \uC815: "\uC624", \uBB34: "\uC0AC", \uAE30: "\uC624", \uACBD: "\uC2E0", \uC2E0: "\uC720", \uC784: "\uD574", \uACC4: "\uC790" };
var \uC591\uC778\uC9C0 = { \uAC11: "\uBB18", \uBCD1: "\uC624", \uBB34: "\uC624", \uACBD: "\uC720", \uC784: "\uC790" };
function \uACA9\uAD6D\uD310\uC815(dayStemHanja, monthBranch, exposedStemsKo) {
  const dayKo = k(dayStemHanja);
  const \uC740\uB294 = (w) => w + ((w.charCodeAt(w.length - 1) - 44032) % 28 ? "\uC740" : "\uB294");
  if (\uAC74\uB85D\uC9C0[dayKo] === monthBranch) return { name: "\uAC74\uB85D\uACA9", basis: `\uC6D4\uC9C0 ${\uC740\uB294(monthBranch)} ${dayKo}\uC758 \uAC74\uB85D` };
  if (\uC591\uC778\uC9C0[dayKo] === monthBranch) return { name: "\uC591\uC778\uACA9", basis: `\uC6D4\uC9C0 ${\uC740\uB294(monthBranch)} ${dayKo}\uC758 \uC591\uC778` };
  const hs = HIDDEN_STEMS_TABLE[monthBranch];
  const slots = [
    { slot: "\uC815\uAE30", ko: hs.\uC815\uAE30 },
    { slot: "\uC911\uAE30", ko: hs.\uC911\uAE30 },
    { slot: "\uC5EC\uAE30", ko: hs.\uC5EC\uAE30 }
  ];
  let picked = slots.find((s) => s.ko && exposedStemsKo.includes(s.ko));
  const \uD22C\uCD9C\uB428 = !!picked;
  if (!picked) picked = slots[0];
  const charKo = picked.ko;
  const tg = tenGod(dayStemHanja, STEM_K2H[charKo]);
  const name = tg === "\uBE44\uACAC" ? "\uC6D4\uBE44\uACA9" : tg === "\uAC81\uC7AC" ? "\uC6D4\uAC81\uACA9" : `${tg}\uACA9`;
  const basis = `\uC6D4\uC9C0 ${monthBranch} ${HIDDEN_SLOT_LABEL[picked.slot]} ${charKo} ${\uD22C\uCD9C\uB428 ? "\uD22C\uCD9C" : "\uAE30\uC900"}`;
  return { name, basis };
}
var STEM_ELEM_KO = { \uAC11: "\uBAA9", \uC744: "\uBAA9", \uBCD1: "\uD654", \uC815: "\uD654", \uBB34: "\uD1A0", \uAE30: "\uD1A0", \uACBD: "\uAE08", \uC2E0: "\uAE08", \uC784: "\uC218", \uACC4: "\uC218" };
var JOHU_TABLE = {
  \uC778: { \uAC11: "\uBCD1\uACC4", \uC744: "\uBCD1\uACC4", \uBCD1: "\uC784\uACBD", \uC815: "\uAC11\uACBD", \uBB34: "\uBCD1\uAC11\uACC4", \uAE30: "\uBCD1\uACC4", \uACBD: "\uD654\uAC11", \uC2E0: "\uAE30\uC784", \uC784: "\uACBD\uBCD1\uBB34", \uACC4: "\uC2E0\uBCD1" },
  \uBB18: { \uAC11: "\uACBD\uD654\uD1A0", \uC744: "\uBCD1\uACC4", \uBCD1: "\uC784\uACBD", \uC815: "\uACBD\uAC11", \uBB34: "\uBCD1\uAC11\uACC4", \uAE30: "\uAC11\uACC4\uBCD1", \uACBD: "\uC815\uAC11", \uC2E0: "\uC784\uAC11", \uC784: "\uBB34\uAE08", \uACC4: "\uACBD\uC2E0" },
  \uC9C4: { \uAC11: "\uACBD\uC784", \uC744: "\uACC4\uBCD1", \uBCD1: "\uC784\uAC11", \uC815: "\uAC11\uACBD", \uBB34: "\uAC11\uBCD1\uACC4", \uAE30: "\uBCD1\uACC4\uAC11", \uACBD: "\uAC11\uC815", \uC2E0: "\uC784\uAC11", \uC784: "\uAC11\uACBD", \uACC4: "\uBCD1\uAE08" },
  \uC0AC: { \uAC11: "\uACC4\uC815\uACBD", \uC744: "\uACC4", \uBCD1: "\uC784\uACBD", \uC815: "\uAC11\uACBD", \uBB34: "\uAC11\uBCD1\uACC4", \uAE30: "\uACC4\uBCD1", \uACBD: "\uC784\uBB34\uBCD1", \uC2E0: "\uC784\uACC4", \uC784: "\uC218\uAE08", \uACC4: "\uAE08\uC784" },
  \uC624: { \uAC11: "\uACC4\uC815\uACBD", \uC744: "\uACC4\uBCD1", \uBCD1: "\uC784\uACBD", \uC815: "\uC784\uACBD", \uBB34: "\uC784\uAC11\uBCD1", \uAE30: "\uACC4\uBCD1", \uACBD: "\uC784\uACC4", \uC2E0: "\uC218\uAE30", \uC784: "\uC218\uAE08", \uACC4: "\uAE08\uC218" },
  \uBBF8: { \uAC11: "\uACC4\uACBD", \uC744: "\uACC4\uBCD1", \uBCD1: "\uC784\uACBD", \uC815: "\uAC11\uC784", \uBB34: "\uACC4\uBCD1\uAC11", \uAE30: "\uACC4\uBCD1", \uACBD: "\uC815\uAC11", \uC2E0: "\uC784\uACBD", \uC784: "\uC2E0\uAC11", \uACC4: "\uAE08\uC218" },
  \uC2E0: { \uAC11: "\uC815\uACBD", \uC744: "\uBCD1\uACC4", \uBCD1: "\uC784\uBB34", \uC815: "\uAC11\uACBD", \uBB34: "\uBCD1\uACC4\uAC11", \uAE30: "\uBCD1\uACC4", \uACBD: "\uC815\uAC11", \uC2E0: "\uC784\uAC11", \uC784: "\uBB34\uC815", \uACC4: "\uC815\uAC11" },
  \uC720: { \uAC11: "\uC815\uACBD\uAC11", \uC744: "\uACC4\uBCD1\uC2E0", \uBCD1: "\uC784\uD654", \uC815: "\uAC11\uACBD", \uBB34: "\uBCD1\uACC4", \uAE30: "\uBCD1\uACC4", \uACBD: "\uC815\uAC11", \uC2E0: "\uC784\uAC11", \uC784: "\uAC11", \uACC4: "\uC2E0\uBCD1" },
  \uC220: { \uAC11: "\uC218\uACBD\uC2E0\uAC11", \uC744: "\uACC4\uC2E0", \uBCD1: "\uAC11\uC784", \uC815: "\uAC11\uACBD", \uBB34: "\uAC11\uACC4\uBCD1", \uAE30: "\uAC11\uACC4\uBCD1", \uACBD: "\uAC11\uC784", \uC2E0: "\uC784\uAC11", \uC784: "\uAC11\uBCD1", \uACC4: "\uC2E0\uAC11" },
  \uD574: { \uAC11: "\uACBD\uD654", \uC744: "\uBCD1\uBB34", \uBCD1: "\uAC11\uACBD", \uC815: "\uAC11\uACBD", \uBB34: "\uAC11\uBCD1", \uAE30: "\uBCD1\uAC11", \uACBD: "\uC815\uBCD1", \uC2E0: "\uC784\uBCD1", \uC784: "\uBB34\uBCD1\uACBD", \uACC4: "\uACBD\uC2E0" },
  \uC790: { \uAC11: "\uD654\uACBD\uBCD1", \uC744: "\uBCD1", \uBCD1: "\uAC11\uC784", \uC815: "\uAC11\uACBD", \uBB34: "\uBCD1\uAC11", \uAE30: "\uBCD1\uAC11", \uACBD: "\uC815\uAC11", \uC2E0: "\uD654\uAC11", \uC784: "\uBB34\uBCD1", \uACC4: "\uBCD1\uC2E0" },
  \uCD95: { \uAC11: "\uD654\uACBD\uBCD1\uC815", \uC744: "\uBCD1", \uBCD1: "\uAC11\uC784", \uC815: "\uAC11\uACBD", \uBB34: "\uBCD1\uAC11", \uAE30: "\uBCD1\uAC11", \uACBD: "\uBCD1\uC815\uAC11", \uC2E0: "\uBCD1\uC784", \uC784: "\uBCD1\uAC11", \uACC4: "\uBCD1\uC815" }
};
function \uC870\uD6C4\uC6A9\uC2E0\uACC4\uC0B0(monthBranch, dayStem) {
  const entry = JOHU_TABLE[monthBranch][dayStem];
  const chars = entry.split("");
  return { \uC8FC\uC6A9\uC2E0: chars[0], \uBCF4\uC870\uC6A9\uC2E0: chars.slice(1) };
}
var TEN_GOD_GROUP = {
  \uC815\uC778: "\uC778\uC131",
  \uD3B8\uC778: "\uC778\uC131",
  \uBE44\uACAC: "\uBE44\uAC81",
  \uAC81\uC7AC: "\uBE44\uAC81",
  \uC2DD\uC2E0: "\uC2DD\uC0C1",
  \uC0C1\uAD00: "\uC2DD\uC0C1",
  \uC815\uC7AC: "\uC7AC\uC131",
  \uD3B8\uC7AC: "\uC7AC\uC131",
  \uC815\uAD00: "\uAD00\uC131",
  \uD3B8\uAD00: "\uAD00\uC131"
};
function pairKey(a, b) {
  return [a, b].sort().join("");
}
var CHEONGAN_HAP_MAP = {};
[["\uAC11", "\uAE30", "\uD1A0"], ["\uC744", "\uACBD", "\uAE08"], ["\uBCD1", "\uC2E0", "\uC218"], ["\uC815", "\uC784", "\uBAA9"], ["\uBB34", "\uACC4", "\uD654"]].forEach(([a, b, el]) => {
  CHEONGAN_HAP_MAP[pairKey(a, b)] = `${a}${b}\uD569(${el})`;
});
var CHEONGAN_CHUNG_MAP = {};
[["\uAC11", "\uACBD"], ["\uC744", "\uC2E0"], ["\uBCD1", "\uC784"], ["\uC815", "\uACC4"]].forEach(([a, b]) => {
  CHEONGAN_CHUNG_MAP[pairKey(a, b)] = `${a}${b}\uCDA9`;
});
function \uCC9C\uAC04\uAD00\uACC4\uC815\uADDC\uD654(type, a, b) {
  if (type === "\uD569") {
    const found2 = CHEONGAN_HAP_MAP[pairKey(a, b)];
    if (found2) return found2;
    console.warn(`[\uD615\uCDA9\uD68C\uD569 \uC815\uADDC\uD654] \uC0AC\uC804\uC5D0 \uC5C6\uB294 \uCC9C\uAC04\uD569 \uC870\uD569: ${a}${b}`);
    return `${a}${b}\uD569`;
  }
  const found = CHEONGAN_CHUNG_MAP[pairKey(a, b)];
  if (found) return found;
  const ea = STEM_ELEM_KO[a], eb = STEM_ELEM_KO[b];
  if (GEUK[ea] === eb) return `\uCC9C\uAC04\uADF9(${a}\u2192${b})`;
  if (GEUK[eb] === ea) return `\uCC9C\uAC04\uADF9(${b}\u2192${a})`;
  console.warn(`[\uD615\uCDA9\uD68C\uD569 \uC815\uADDC\uD654] \uBC29\uD5A5\uC744 \uD310\uB2E8\uD560 \uC218 \uC5C6\uB294 \uCC9C\uAC04 \uAD00\uACC4: ${a}${b}`);
  return `${a}${b}\uADF9`;
}
var JIJI_CHUNG_MAP = {};
[["\uC790", "\uC624"], ["\uCD95", "\uBBF8"], ["\uC778", "\uC2E0"], ["\uBB18", "\uC720"], ["\uC9C4", "\uC220"], ["\uC0AC", "\uD574"]].forEach(([a, b]) => {
  JIJI_CHUNG_MAP[pairKey(a, b)] = `${a}${b}\uCDA9`;
});
var JIJI_YUKHAP_MAP = {};
[["\uC790", "\uCD95", "\uD1A0"], ["\uC778", "\uD574", "\uBAA9"], ["\uBB18", "\uC220", "\uD654"], ["\uC9C4", "\uC720", "\uAE08"], ["\uC0AC", "\uC2E0", "\uC218"], ["\uC624", "\uBBF8", "\uD654\uD1A0"]].forEach(([a, b, el]) => {
  JIJI_YUKHAP_MAP[pairKey(a, b)] = `${a}${b}\uD569(${el})`;
});
var JIJI_PA_MAP = {};
[["\uC790", "\uC720"], ["\uCD95", "\uC9C4"], ["\uC778", "\uD574"], ["\uBB18", "\uC624"], ["\uC0AC", "\uC2E0"], ["\uC220", "\uBBF8"]].forEach(([a, b]) => {
  JIJI_PA_MAP[pairKey(a, b)] = `${a}${b}\uD30C`;
});
var JIJI_HAE_MAP = {};
[["\uC790", "\uBBF8"], ["\uCD95", "\uC624"], ["\uC778", "\uC0AC"], ["\uBB18", "\uC9C4"], ["\uC2E0", "\uD574"], ["\uC720", "\uC220"]].forEach(([a, b]) => {
  JIJI_HAE_MAP[pairKey(a, b)] = `${a}${b}\uD574`;
});
var JIJI_WONJIN_MAP = {};
[["\uC790", "\uBBF8"], ["\uCD95", "\uC624"], ["\uC778", "\uC720"], ["\uBB18", "\uC2E0"], ["\uC9C4", "\uD574"], ["\uC0AC", "\uC220"]].forEach(([a, b]) => {
  JIJI_WONJIN_MAP[pairKey(a, b)] = `${a}${b}\uC6D0\uC9C4`;
});
var GWIMUN_PAIRS = [["\uC790", "\uC720"], ["\uCD95", "\uC624"], ["\uC778", "\uBBF8"], ["\uBB18", "\uC2E0"], ["\uC9C4", "\uD574"], ["\uC0AC", "\uC220"]];
var JIJI_GWIMUN_MAP = {};
GWIMUN_PAIRS.forEach(([a, b]) => {
  JIJI_GWIMUN_MAP[pairKey(a, b)] = `${a}${b}\uADC0\uBB38`;
});
var SAMHAP_GROUPS = [
  { order: ["\uD574", "\uBB18", "\uBBF8"], element: "\uBAA9" },
  { order: ["\uC778", "\uC624", "\uC220"], element: "\uD654" },
  { order: ["\uC0AC", "\uC720", "\uCD95"], element: "\uAE08" },
  { order: ["\uC2E0", "\uC790", "\uC9C4"], element: "\uC218" }
];
var BANGHAP_GROUPS = [
  { order: ["\uC778", "\uBB18", "\uC9C4"], label: "\uB3D9\uBC29\uBAA9" },
  { order: ["\uC0AC", "\uC624", "\uBBF8"], label: "\uB0A8\uBC29\uD654" },
  { order: ["\uC2E0", "\uC720", "\uC220"], label: "\uC11C\uBC29\uAE08" },
  { order: ["\uD574", "\uC790", "\uCD95"], label: "\uBD81\uBC29\uC218" }
];
function \uC0BC\uD569\uC815\uADDC\uD654(branches) {
  const group = SAMHAP_GROUPS.find((g) => branches.every((b) => g.order.includes(b)));
  if (!group) {
    console.warn(`[\uD615\uCDA9\uD68C\uD569 \uC815\uADDC\uD654] \uC0AC\uC804\uC5D0 \uC5C6\uB294 \uC0BC\uD569/\uBC18\uD569 \uC870\uD569: ${branches.join("")}`);
    return branches.length >= 3 ? `${branches.join("")} \uC0BC\uD569` : `${branches.join("")} \uBC18\uD569`;
  }
  const ordered = group.order.filter((b) => branches.includes(b));
  return branches.length >= 3 ? `${ordered.join("")}(${group.element}\uAD6D)` : `${ordered.join("")} \uBC18\uD569`;
}
function \uBC29\uD569\uC815\uADDC\uD654(branches) {
  const group = BANGHAP_GROUPS.find((g) => branches.every((b) => g.order.includes(b)));
  if (!group) {
    console.warn(`[\uD615\uCDA9\uD68C\uD569 \uC815\uADDC\uD654] \uC0AC\uC804\uC5D0 \uC5C6\uB294 \uBC29\uD569 \uC870\uD569: ${branches.join("")}`);
    return `${branches.join("")} \uBC29\uD569`;
  }
  const ordered = group.order.filter((b) => branches.includes(b));
  return branches.length >= 3 ? `${ordered.join("")}(${group.label})` : `${ordered.join("")} \uBC29\uD569`;
}
var HYEONG_PAIR_MAP = {};
[["\uC778", "\uC0AC"], ["\uC0AC", "\uC2E0"], ["\uC778", "\uC2E0"], ["\uCD95", "\uC220"], ["\uC220", "\uBBF8"], ["\uCD95", "\uBBF8"], ["\uC790", "\uBB18"]].forEach(([a, b]) => {
  HYEONG_PAIR_MAP[pairKey(a, b)] = `${a}${b}\uD615`;
});
var SAMHYEONG_GROUPS = [["\uC778", "\uC0AC", "\uC2E0"], ["\uCD95", "\uC220", "\uBBF8"]];
var JAHYEONG_SET = /* @__PURE__ */ new Set(["\uC9C4", "\uC624", "\uC720", "\uD574"]);
function \uD615\uC815\uADDC\uD654(rawLeadTokens) {
  const results = /* @__PURE__ */ new Set();
  const branchSet = /* @__PURE__ */ new Set();
  const pairs = [];
  rawLeadTokens.forEach((tok) => {
    const a = tok[0], b = tok[1] ?? tok[0];
    pairs.push([a, b]);
    branchSet.add(a);
    branchSet.add(b);
  });
  const absorbed = /* @__PURE__ */ new Set();
  SAMHYEONG_GROUPS.forEach((group) => {
    if (group.every((b) => branchSet.has(b))) {
      results.add(`${group.join("")} \uC0BC\uD615`);
      group.forEach((b) => absorbed.add(b));
    }
  });
  pairs.forEach(([a, b]) => {
    if (a === b) {
      if (!JAHYEONG_SET.has(a)) console.warn(`[\uD615\uCDA9\uD68C\uD569 \uC815\uADDC\uD654] \uC0AC\uC804\uC5D0 \uC5C6\uB294 \uC790\uD615: ${a}${a}`);
      results.add(`${a}${a} \uC790\uD615`);
      return;
    }
    if (absorbed.has(a) && absorbed.has(b)) return;
    const found = HYEONG_PAIR_MAP[pairKey(a, b)];
    if (found) {
      results.add(found);
      return;
    }
    console.warn(`[\uD615\uCDA9\uD68C\uD569 \uC815\uADDC\uD654] \uC0AC\uC804\uC5D0 \uC5C6\uB294 \uD615 \uC870\uD569: ${a}${b}`);
    results.add(`${a}${b}\uD615`);
  });
  return [...results];
}
function \uC6D0\uAD6D\uAD00\uACC4(p, hourUnknown) {
  const keys = hourUnknown ? ["year", "month", "day"] : ["year", "month", "day", "hour"];
  const \uAC04 = keys.map((key) => p[key][0]);
  const \uC9C0 = keys.map((key) => p[key][1]);
  const \uC30D\uB4E4 = (arr) => {
    const out = [];
    for (let i = 0; i < arr.length; i++) for (let j = i + 1; j < arr.length; j++) out.push([arr[i], arr[j]]);
    return out;
  };
  const \uCC9C\uAC04 = /* @__PURE__ */ new Set();
  for (const [a, b] of \uC30D\uB4E4(\uAC04)) {
    if (a === b) continue;
    const key = pairKey(a, b);
    if (CHEONGAN_HAP_MAP[key]) {
      \uCC9C\uAC04.add(\uCC9C\uAC04\uAD00\uACC4\uC815\uADDC\uD654("\uD569", a, b));
      continue;
    }
    if (CHEONGAN_CHUNG_MAP[key]) {
      \uCC9C\uAC04.add(\uCC9C\uAC04\uAD00\uACC4\uC815\uADDC\uD654("\uCDA9", a, b));
      continue;
    }
    if (key === pairKey("\uAC11", "\uBB34") || key === pairKey("\uC744", "\uAE30")) \uCC9C\uAC04.add(\uCC9C\uAC04\uAD00\uACC4\uC815\uADDC\uD654("\uCDA9", a, b));
  }
  const \uC721\uD569 = /* @__PURE__ */ new Set(), \uCDA9 = /* @__PURE__ */ new Set(), \uD30C = /* @__PURE__ */ new Set(), \uD574 = /* @__PURE__ */ new Set(), \uC6D0\uC9C4 = /* @__PURE__ */ new Set(), \uADC0\uBB38 = /* @__PURE__ */ new Set();
  const \uD615\uD1A0\uD070 = [];
  for (const [a, b] of \uC30D\uB4E4(\uC9C0)) {
    if (a === b) {
      if (JAHYEONG_SET.has(a)) \uD615\uD1A0\uD070.push(a + a);
      continue;
    }
    const key = pairKey(a, b);
    if (JIJI_YUKHAP_MAP[key]) \uC721\uD569.add(JIJI_YUKHAP_MAP[key]);
    if (JIJI_CHUNG_MAP[key]) \uCDA9.add(JIJI_CHUNG_MAP[key]);
    if (JIJI_PA_MAP[key]) \uD30C.add(JIJI_PA_MAP[key]);
    if (JIJI_HAE_MAP[key]) \uD574.add(JIJI_HAE_MAP[key]);
    if (HYEONG_PAIR_MAP[key] || SAMHYEONG_GROUPS.some((g) => g.includes(a) && g.includes(b))) \uD615\uD1A0\uD070.push(a + b);
    if (JIJI_WONJIN_MAP[key]) \uC6D0\uC9C4.add(JIJI_WONJIN_MAP[key].replace(/원진$/, " \uC6D0\uC9C4"));
    if (JIJI_GWIMUN_MAP[key]) \uADC0\uBB38.add(JIJI_GWIMUN_MAP[key].replace(/귀문$/, " \uADC0\uBB38"));
  }
  const \uAE00\uC790\uB4E4 = new Set(\uC9C0);
  const \uC0BC\uD569 = /* @__PURE__ */ new Set();
  for (const g of SAMHAP_GROUPS) {
    const have = g.order.filter((b) => \uAE00\uC790\uB4E4.has(b));
    if (have.length >= 2) \uC0BC\uD569.add(\uC0BC\uD569\uC815\uADDC\uD654(have));
  }
  const \uBC29\uD569 = /* @__PURE__ */ new Set();
  for (const g of BANGHAP_GROUPS) {
    const have = g.order.filter((b) => \uAE00\uC790\uB4E4.has(b));
    if (have.length === 3) \uBC29\uD569.add(\uBC29\uD569\uC815\uADDC\uD654(have));
  }
  return {
    \uCC9C\uAC04: [...\uCC9C\uAC04],
    \uC721\uD569: [...\uC721\uD569],
    \uC0BC\uD569: [...\uC0BC\uD569],
    \uBC29\uD569: [...\uBC29\uD569],
    \uCDA9: [...\uCDA9],
    \uD615: \uD615\uD1A0\uD070.length ? \uD615\uC815\uADDC\uD654(\uD615\uD1A0\uD070) : [],
    \uD30C: [...\uD30C],
    \uD574: [...\uD574],
    \uC6D0\uC9C4: [...\uC6D0\uC9C4],
    \uADC0\uBB38: [...\uADC0\uBB38]
  };
}
function \uCC9C\uAC04\uC30D\uAD00\uACC4\uD14D\uC2A4\uD2B8(a, b) {
  if (a === b) return "\uD2B9\uBCC4\uD55C \uD569\uCDA9 \uC5C6\uC74C";
  const key = pairKey(a, b);
  if (CHEONGAN_HAP_MAP[key]) return CHEONGAN_HAP_MAP[key];
  if (CHEONGAN_CHUNG_MAP[key]) return CHEONGAN_CHUNG_MAP[key];
  const ea = STEM_ELEM_KO[a], eb = STEM_ELEM_KO[b];
  if (GEUK[ea] === eb) return `\uCC9C\uAC04\uADF9(${a}\u2192${b})`;
  if (GEUK[eb] === ea) return `\uCC9C\uAC04\uADF9(${b}\u2192${a})`;
  return "\uD2B9\uBCC4\uD55C \uD569\uCDA9 \uC5C6\uC74C";
}
function \uC9C0\uC9C0\uC30D\uC804\uCCB4\uAD00\uACC4(a, b) {
  if (a === b) return JAHYEONG_SET.has(a) ? [`${a}${a}\uC790\uD615`] : [];
  const key = pairKey(a, b);
  const out = [];
  if (JIJI_YUKHAP_MAP[key]) out.push(JIJI_YUKHAP_MAP[key]);
  if (JIJI_CHUNG_MAP[key]) out.push(JIJI_CHUNG_MAP[key]);
  if (HYEONG_PAIR_MAP[key]) out.push(HYEONG_PAIR_MAP[key]);
  if (JIJI_PA_MAP[key]) out.push(JIJI_PA_MAP[key]);
  if (JIJI_HAE_MAP[key]) out.push(JIJI_HAE_MAP[key]);
  if (JIJI_WONJIN_MAP[key]) out.push(JIJI_WONJIN_MAP[key]);
  if (JIJI_GWIMUN_MAP[key]) out.push(JIJI_GWIMUN_MAP[key]);
  return out;
}
var BRANCH_ORDER = ["\uC790", "\uCD95", "\uC778", "\uBB18", "\uC9C4", "\uC0AC", "\uC624", "\uBBF8", "\uC2E0", "\uC720", "\uC220", "\uD574"];
var STEM_ORDER = ["\uAC11", "\uC744", "\uBCD1", "\uC815", "\uBB34", "\uAE30", "\uACBD", "\uC2E0", "\uC784", "\uACC4"];
function \uACF5\uB9DD\uACC4\uC0B0(ganzhi) {
  const s = STEM_ORDER.indexOf(ganzhi[0]);
  const b = BRANCH_ORDER.indexOf(ganzhi[1]);
  const diff = (b - s + 12) % 12;
  return [BRANCH_ORDER[(10 + diff) % 12], BRANCH_ORDER[(11 + diff) % 12]];
}
var SIBIJISAL_LABELS = ["\uAC81\uC0B4", "\uC7AC\uC0B4", "\uCC9C\uC0B4", "\uC9C0\uC0B4", "\uB144\uC0B4", "\uC6D4\uC0B4", "\uB9DD\uC2E0\uC0B4", "\uC7A5\uC131\uC0B4", "\uBC18\uC548\uC0B4", "\uC5ED\uB9C8\uC0B4", "\uC721\uD574\uC0B4", "\uD654\uAC1C\uC0B4"];
var SAMHAP_ANCHOR = {
  \uC2E0: "\uC9C4",
  \uC790: "\uC9C4",
  \uC9C4: "\uC9C4",
  \uC778: "\uC220",
  \uC624: "\uC220",
  \uC220: "\uC220",
  \uD574: "\uBBF8",
  \uBB18: "\uBBF8",
  \uBBF8: "\uBBF8",
  \uC0AC: "\uCD95",
  \uC720: "\uCD95",
  \uCD95: "\uCD95"
};
function \uC2ED\uC774\uC2E0\uC0B4\uB9F5(referenceBranch) {
  const anchorIdx = BRANCH_ORDER.indexOf(SAMHAP_ANCHOR[referenceBranch]);
  const startIdx = (anchorIdx + 1) % 12;
  const map = {};
  for (let i = 0; i < 12; i++) map[BRANCH_ORDER[(startIdx + i) % 12]] = SIBIJISAL_LABELS[i];
  return map;
}
var \uC2ED\uC774\uC2E0\uC0B4\uBCC4\uCE6D = (label) => label === "\uB144\uC0B4" ? "\uB144\uC0B4(\uB3C4\uD654)" : label;
var SIBIUNSEONG_LABELS = ["\uC7A5\uC0DD", "\uBAA9\uC695", "\uAD00\uB300", "\uAC74\uB85D", "\uC81C\uC655", "\uC1E0", "\uBCD1", "\uC0AC", "\uBB18", "\uC808", "\uD0DC", "\uC591"];
var UNSEONG_START = {
  \uAC11: { start: "\uD574", forward: true },
  \uC744: { start: "\uC624", forward: false },
  \uBCD1: { start: "\uC778", forward: true },
  \uC815: { start: "\uC720", forward: false },
  \uBB34: { start: "\uC778", forward: true },
  \uAE30: { start: "\uC720", forward: false },
  \uACBD: { start: "\uC0AC", forward: true },
  \uC2E0: { start: "\uC790", forward: false },
  \uC784: { start: "\uC2E0", forward: true },
  \uACC4: { start: "\uBB18", forward: false }
};
function \uC2ED\uC774\uC6B4\uC131\uB9F5(dayStemKo) {
  const { start, forward } = UNSEONG_START[dayStemKo];
  const startIdx = BRANCH_ORDER.indexOf(start);
  const map = {};
  for (let i = 0; i < 12; i++) {
    const idx = forward ? (startIdx + i) % 12 : (startIdx - i + 120) % 12;
    map[BRANCH_ORDER[idx]] = SIBIUNSEONG_LABELS[i];
  }
  return map;
}
function \uC2ED\uC131\uACC4\uC0B0(dayStemHanja, ganzhi) {
  const stem = tenGod(dayStemHanja, STEM_K2H[ganzhi[0]]);
  const branch = tenGod(dayStemHanja, STEM_K2H[HIDDEN_STEMS_TABLE[ganzhi[1]].\uC815\uAE30]);
  return { stem, branch };
}
var \uBE48\uCE78\uCC44\uC6C0 = (s) => s && String(s).length ? String(s) : "-";
var PILLAR_LINE_COLS = [
  { key: "hour", label: "\uC2DC\uC8FC", salKey: "\uC2DC" },
  { key: "day", label: "\uC77C\uC8FC", salKey: "\uC77C" },
  { key: "month", label: "\uC6D4\uC8FC", salKey: "\uC6D4" },
  { key: "year", label: "\uB144\uC8FC", salKey: "\uB144" }
];
function \uC6D0\uAD6D\uB77C\uC778\uD14D\uC2A4\uD2B8(m, dayStemHanja, tgSelf, unseong, yearSal, daySal, \uD2B9\uC218\uC2E0\uC0B4byPillar, hourUnknown) {
  return PILLAR_LINE_COLS.filter((c) => !(c.key === "hour" && hourUnknown)).map((c) => {
    const ganzhi = m[c.key];
    const stem = ganzhi[0], branch = ganzhi[1];
    const stemPart = c.key === "day" ? `${stem}(\uC77C\uAC04, \uB098)` : `${stem}(\uC2ED\uC131 ${tgSelf[c.key].stem})`;
    const sinsal = \uD2B9\uC218\uC2E0\uC0B4byPillar[c.salKey];
    return `${c.label} ${ganzhi} \u2014 \uCC9C\uAC04 ${stemPart} / \uC9C0\uC9C0 ${branch}(\uC2ED\uC131 ${tgSelf[c.key].branch}) / \uC9C0\uC7A5\uAC04 ${\uC9C0\uC7A5\uAC04\uB77C\uC778(dayStemHanja, branch)} / \uC6B4\uC131 ${unseong[c.key]} / \uC2E0\uC0B4(\uB144\uC9C0\uAE30\uC900) ${\uC2ED\uC774\uC2E0\uC0B4\uBCC4\uCE6D(yearSal[c.key])} / \uC2E0\uC0B4(\uC77C\uC9C0\uAE30\uC900) ${\uC2ED\uC774\uC2E0\uC0B4\uBCC4\uCE6D(daySal[c.key])} / \uC2E0\uC0B4\xB7\uADC0\uC778 ${sinsal.length ? sinsal.join("\xB7") : "-"}`;
  }).join("\n");
}
var PILLAR_LABELS = [["year", "\uB144"], ["month", "\uC6D4"], ["day", "\uC77C"], ["hour", "\uC2DC"]];
function \uCD94\uAC00\uD2B9\uC218\uC2E0\uC0B4(p) {
  const results = [];
  const byPillar = { \uB144: [], \uC6D4: [], \uC77C: [], \uC2DC: [] };
  const dayStem = p.day[0];
  const monthBranch = p.month[1];
  const hitsByStem = (stem) => PILLAR_LABELS.filter(([key]) => p[key][0] === stem).map(([, label]) => label);
  const hitsByBranch = (branch) => PILLAR_LABELS.filter(([key]) => p[key][1] === branch).map(([, label]) => label);
  const hitsByEither = (ch) => PILLAR_LABELS.filter(([key]) => p[key][0] === ch || p[key][1] === ch).map(([, label]) => label);
  const hitsByStemOrBranch = (stems, branches) => PILLAR_LABELS.filter(([key]) => stems.has(p[key][0]) || branches.has(p[key][1])).map(([, label]) => label);
  const hitsByBranches = (branches) => {
    const set = /* @__PURE__ */ new Set();
    branches.forEach((b) => hitsByBranch(b).forEach((x) => set.add(x)));
    return PILLAR_LABELS.map(([, label]) => label).filter((l) => set.has(l));
  };
  const addByPillar = (name, hits) => hits.forEach((h) => byPillar[h].push(name));
  const pushIfHits = (name, hits) => {
    if (hits.length) {
      results.push(`${name}(${hits.join("/")})`);
      addByPillar(name, hits);
    }
  };
  const CHEONEUL = {
    \uAC11: ["\uCD95", "\uBBF8"],
    \uBB34: ["\uCD95", "\uBBF8"],
    \uACBD: ["\uCD95", "\uBBF8"],
    \uC744: ["\uC790", "\uC2E0"],
    \uAE30: ["\uC790", "\uC2E0"],
    \uBCD1: ["\uD574", "\uC720"],
    \uC815: ["\uD574", "\uC720"],
    \uC2E0: ["\uC778", "\uC624"],
    \uC784: ["\uC0AC", "\uBB18"],
    \uACC4: ["\uC0AC", "\uBB18"]
  };
  if (CHEONEUL[dayStem]) pushIfHits("\uCC9C\uC744\uADC0\uC778", hitsByBranches(CHEONEUL[dayStem]));
  const MUNCHANG = { \uAC11: "\uC0AC", \uC744: "\uC624", \uBCD1: "\uC2E0", \uC815: "\uC720", \uBB34: "\uC2E0", \uAE30: "\uC720", \uACBD: "\uD574", \uC2E0: "\uC790", \uC784: "\uC778", \uACC4: "\uBB18" };
  if (MUNCHANG[dayStem]) pushIfHits("\uBB38\uCC3D\uADC0\uC778", hitsByBranch(MUNCHANG[dayStem]));
  const HAKDANG = { \uAC11: "\uD574", \uC744: "\uC624", \uBCD1: "\uC778", \uC815: "\uC720", \uBB34: "\uC778", \uAE30: "\uC720", \uACBD: "\uC0AC", \uC2E0: "\uC790", \uC784: "\uC2E0", \uACC4: "\uBB18" };
  if (HAKDANG[dayStem]) pushIfHits("\uD559\uB2F9\uADC0\uC778", hitsByBranch(HAKDANG[dayStem]));
  const MUNGOK = { \uAC11: "\uD574", \uC744: "\uC790", \uBCD1: "\uC778", \uC815: "\uBB18", \uBB34: "\uC778", \uAE30: "\uBB18", \uACBD: "\uC0AC", \uC2E0: "\uC624", \uC784: "\uC2E0", \uACC4: "\uC720" };
  if (MUNGOK[dayStem]) pushIfHits("\uBB38\uACE1\uADC0\uC778", hitsByBranch(MUNGOK[dayStem]));
  const GEUMYEO = { \uAC11: "\uC9C4", \uC744: "\uC0AC", \uBCD1: "\uBBF8", \uC815: "\uC2E0", \uBB34: "\uBBF8", \uAE30: "\uC2E0", \uACBD: "\uC220", \uC2E0: "\uD574", \uC784: "\uCD95", \uACC4: "\uC778" };
  if (GEUMYEO[dayStem]) pushIfHits("\uAE08\uC5EC\uB85D", hitsByBranch(GEUMYEO[dayStem]));
  const YANGIN = { \uAC11: "\uBB18", \uBCD1: "\uC624", \uBB34: "\uC624", \uACBD: "\uC720", \uC784: "\uC790" };
  if (YANGIN[dayStem]) pushIfHits("\uC591\uC778\uC0B4", hitsByBranch(YANGIN[dayStem]));
  const HONGYEOM = { \uAC11: "\uC624", \uC744: "\uC624", \uBCD1: "\uC778", \uC815: "\uBBF8", \uBB34: "\uC9C4", \uAE30: "\uC9C4", \uACBD: "\uC220", \uC2E0: "\uC720", \uC784: "\uC790", \uACC4: "\uC2E0" };
  if (HONGYEOM[dayStem]) pushIfHits("\uD64D\uC5FC\uC0B4", hitsByBranch(HONGYEOM[dayStem]));
  const HYEOPROK = {
    \uAC11: ["\uCD95", "\uBB18"],
    \uC744: ["\uC778", "\uC9C4"],
    \uBCD1: ["\uC9C4", "\uC624"],
    \uC815: ["\uC0AC", "\uBBF8"],
    \uBB34: ["\uC9C4", "\uC624"],
    \uAE30: ["\uC0AC", "\uBBF8"],
    \uACBD: ["\uBBF8", "\uC720"],
    \uC2E0: ["\uC2E0", "\uC220"],
    \uC784: ["\uC220", "\uC790"],
    \uACC4: ["\uD574", "\uCD95"]
  };
  if (HYEOPROK[dayStem]) pushIfHits("\uD611\uB85D", hitsByBranches(HYEOPROK[dayStem]));
  const TAEGEUK = {
    \uAC11: ["\uC790", "\uC624"],
    \uC744: ["\uC790", "\uC624"],
    \uBCD1: ["\uBB18", "\uC720"],
    \uC815: ["\uBB18", "\uC720"],
    \uBB34: ["\uC9C4", "\uC220", "\uCD95", "\uBBF8"],
    \uAE30: ["\uC9C4", "\uC220", "\uCD95", "\uBBF8"],
    \uACBD: ["\uC778", "\uD574"],
    \uC2E0: ["\uC778", "\uD574"],
    \uC784: ["\uC0AC", "\uC2E0"],
    \uACC4: ["\uC0AC", "\uC2E0"]
  };
  if (TAEGEUK[dayStem]) pushIfHits("\uD0DC\uADF9\uADC0\uC778", hitsByBranches(TAEGEUK[dayStem]));
  const yearBranch = p.year[1];
  const dayBranchRef = p.day[1];
  const targetsFor = (map) => [...new Set([map[yearBranch], map[dayBranchRef]].filter(Boolean))];
  const YEOKMA = { \uC778: "\uC2E0", \uC624: "\uC2E0", \uC220: "\uC2E0", \uC0AC: "\uD574", \uC720: "\uD574", \uCD95: "\uD574", \uC2E0: "\uC778", \uC790: "\uC778", \uC9C4: "\uC778", \uD574: "\uC0AC", \uBB18: "\uC0AC", \uBBF8: "\uC0AC" };
  pushIfHits("\uC5ED\uB9C8\uC0B4", hitsByBranches(targetsFor(YEOKMA)));
  const HWAGAE = { \uC778: "\uC220", \uC624: "\uC220", \uC220: "\uC220", \uC0AC: "\uCD95", \uC720: "\uCD95", \uCD95: "\uCD95", \uC2E0: "\uC9C4", \uC790: "\uC9C4", \uC9C4: "\uC9C4", \uD574: "\uBBF8", \uBB18: "\uBBF8", \uBBF8: "\uBBF8" };
  pushIfHits("\uD654\uAC1C\uC0B4", hitsByBranches(targetsFor(HWAGAE)));
  const DOHWA = { \uC778: "\uBB18", \uC624: "\uBB18", \uC220: "\uBB18", \uC0AC: "\uC624", \uC720: "\uC624", \uCD95: "\uC624", \uC2E0: "\uC720", \uC790: "\uC720", \uC9C4: "\uC720", \uD574: "\uC790", \uBB18: "\uC790", \uBBF8: "\uC790" };
  pushIfHits("\uB3C4\uD654\uC0B4", hitsByBranches(targetsFor(DOHWA)));
  const WOLDEOK_BY_MONTHBRANCH = {
    \uC778: "\uBCD1",
    \uC624: "\uBCD1",
    \uC220: "\uBCD1",
    \uC2E0: "\uC784",
    \uC790: "\uC784",
    \uC9C4: "\uC784",
    \uD574: "\uAC11",
    \uBB18: "\uAC11",
    \uBBF8: "\uAC11",
    \uC0AC: "\uACBD",
    \uC720: "\uACBD",
    \uCD95: "\uACBD"
  };
  if (WOLDEOK_BY_MONTHBRANCH[monthBranch]) pushIfHits("\uC6D4\uB355\uADC0\uC778", hitsByStem(WOLDEOK_BY_MONTHBRANCH[monthBranch]));
  const CHEONDEOK_BY_MONTHBRANCH = {
    \uC778: "\uC815",
    \uBB18: "\uC2E0",
    \uC9C4: "\uC784",
    \uC0AC: "\uC2E0",
    \uC624: "\uD574",
    \uBBF8: "\uAC11",
    \uC2E0: "\uACC4",
    \uC720: "\uC778",
    \uC220: "\uBCD1",
    \uD574: "\uC744",
    \uC790: "\uC0AC",
    \uCD95: "\uACBD"
  };
  if (CHEONDEOK_BY_MONTHBRANCH[monthBranch]) pushIfHits("\uCC9C\uB355\uADC0\uC778", hitsByEither(CHEONDEOK_BY_MONTHBRANCH[monthBranch]));
  const BAEKHO = ["\uAC11\uC9C4", "\uC744\uBBF8", "\uBCD1\uC220", "\uC815\uCD95", "\uBB34\uC9C4", "\uC784\uC220", "\uACC4\uCD95"];
  pushIfHits("\uBC31\uD638\uC0B4", PILLAR_LABELS.filter(([key]) => BAEKHO.includes(p[key])).map(([, label]) => label));
  const GORAN = ["\uAC11\uC778", "\uC744\uC0AC", "\uBCD1\uC624", "\uC815\uC0AC", "\uBB34\uC2E0", "\uAE30\uC720", "\uC2E0\uD574"];
  pushIfHits("\uACE0\uB780\uC0B4", PILLAR_LABELS.filter(([key]) => GORAN.includes(p[key])).map(([, label]) => label));
  if (["\uACBD\uC9C4", "\uACBD\uC220", "\uC784\uC9C4", "\uBB34\uC220"].includes(p.day)) {
    results.push("\uAD34\uAC15\uC0B4(\uC77C)");
    addByPillar("\uAD34\uAC15\uC0B4", ["\uC77C"]);
  }
  for (const [a, b] of GWIMUN_PAIRS) {
    const aHits = hitsByBranch(a), bHits = hitsByBranch(b);
    if (aHits.length && bHits.length) {
      results.push(`\uADC0\uBB38\uAD00\uC0B4(${aHits.join("/")}-${bHits.join("/")})`);
      addByPillar("\uADC0\uBB38\uAD00\uC0B4", [.../* @__PURE__ */ new Set([...aHits, ...bHits])]);
    }
  }
  pushIfHits("\uD604\uCE68\uC0B4", hitsByStemOrBranch(/* @__PURE__ */ new Set(["\uAC11", "\uC2E0"]), /* @__PURE__ */ new Set(["\uBB18", "\uC624", "\uC2E0"])));
  return { list: results, byPillar };
}
function \uC6D4\uC6B41\uAC1C\uC6D4(dayStemHanja, gender, dayBoundary, y, m, curY, curM) {
  const p = (0, import_manseryeok.calculateFourPillars)({ year: y, month: m, day: 15, hour: 12, minute: 0, isLunar: false, gender, dayBoundary }).toObject();
  const \uC6D4\uC8FC = p.month;
  const stemH = STEM_K2H[\uC6D4\uC8FC[0]], branchH = BRANCH_K2H[\uC6D4\uC8FC[1]];
  return {
    year: y,
    month: m,
    ganzhi: \uC6D4\uC8FC,
    tgStem: tenGod(dayStemHanja, stemH),
    tgBranch: tenGod(dayStemHanja, BRANCH_MAIN[branchH]),
    isCurrent: y === curY && m === curM
  };
}
function \uC6D4\uC6B4\uACC4\uC0B0(dayStemHanja, gender, dayBoundary, baseDate, \uCD1D\uAC1C\uC6D4\uC218) {
  let y = baseDate.getFullYear(), m = baseDate.getMonth() + 1 - 1;
  const curY = baseDate.getFullYear(), curM = baseDate.getMonth() + 1;
  while (m < 1) {
    m += 12;
    y -= 1;
  }
  const startY = y, startM = m;
  const rows = [];
  for (let i = 0; i < \uCD1D\uAC1C\uC6D4\uC218; i++) {
    const row = \uC6D4\uC6B41\uAC1C\uC6D4(dayStemHanja, gender, dayBoundary, y, m, curY, curM);
    const mark = row.isCurrent ? " \u2190 \uC774\uBC88\uB2EC" : "";
    rows.push(`  ${row.year}\uB144 ${row.month}\uC6D4 ${row.ganzhi} (${row.tgStem}/${row.tgBranch})${mark}`);
    if (i < \uCD1D\uAC1C\uC6D4\uC218 - 1) {
      m++;
      if (m > 12) {
        m = 1;
        y++;
      }
    }
  }
  return { text: rows.join("\n"), startY, startM, endY: y, endM: m };
}
function \uC6D4\uC6B4\uD45C\uB370\uC774\uD130(dayStemHanja, gender, dayBoundary, baseDate) {
  let y = baseDate.getFullYear(), m = baseDate.getMonth() + 1 - 1;
  const curY = baseDate.getFullYear(), curM = baseDate.getMonth() + 1;
  while (m < 1) {
    m += 12;
    y -= 1;
  }
  const rows = [];
  for (let i = 0; i < 12; i++) {
    rows.push(\uC6D4\uC6B41\uAC1C\uC6D4(dayStemHanja, gender, dayBoundary, y, m, curY, curM));
    m++;
    if (m > 12) {
      m = 1;
      y++;
    }
  }
  return rows;
}
function \uC138\uC6B41\uB144(unseongMap, dayStemHanja, gender, dayBoundary, year, curY) {
  const p = (0, import_manseryeok.calculateFourPillars)({ year, month: 7, day: 1, hour: 12, minute: 0, isLunar: false, gender, dayBoundary }).toObject();
  const ganzhiKo = p.year;
  const stemH = STEM_K2H[ganzhiKo[0]], branchH = BRANCH_K2H[ganzhiKo[1]];
  return { year, ganzhi: ganzhiKo, tgStem: tenGod(dayStemHanja, stemH), tgBranch: tenGod(dayStemHanja, BRANCH_MAIN[branchH]), stage12: unseongMap[ganzhiKo[1]], isCurrent: year === curY };
}
function \uC138\uC6B4\uACC4\uC0B0(dayStemHanja, dayStemKo, gender, dayBoundary, startYear, \uB144\uC218) {
  const unseongMap = \uC2ED\uC774\uC6B4\uC131\uB9F5(dayStemKo);
  const rows = [];
  for (let i = 0; i < \uB144\uC218; i++) {
    const row = \uC138\uC6B41\uB144(unseongMap, dayStemHanja, gender, dayBoundary, startYear + i, startYear);
    rows.push(`  ${row.year}\uB144 ${row.ganzhi} (${row.tgStem}/${row.tgBranch}, ${row.stage12})${row.isCurrent ? " \u2190 \uC62C\uD574" : ""}`);
  }
  return { text: rows.join("\n"), endYear: startYear + \uB144\uC218 - 1 };
}
function \uC138\uC6B4\uD45C\uB370\uC774\uD130(dayStemHanja, dayStemKo, gender, dayBoundary, startYear) {
  const unseongMap = \uC2ED\uC774\uC6B4\uC131\uB9F5(dayStemKo);
  const rows = [];
  for (let i = 0; i < 5; i++) rows.push(\uC138\uC6B41\uB144(unseongMap, dayStemHanja, gender, dayBoundary, startYear + i, startYear));
  return rows;
}
function \uC138\uC6B4\uAD6C\uAC04(dayStemHanja, dayStemKo, gender, dayBoundary, startYear, \uB144\uC218, curYear) {
  const unseongMap = \uC2ED\uC774\uC6B4\uC131\uB9F5(dayStemKo);
  const rows = [];
  for (let i = 0; i < \uB144\uC218; i++) rows.push(\uC138\uC6B41\uB144(unseongMap, dayStemHanja, gender, dayBoundary, startYear + i, curYear));
  return rows;
}
function \uB9CC\uB098\uC774\uACC4\uC0B0(birthSolar, now) {
  let age = now.getFullYear() - birthSolar.year;
  const beforeBirthday = now.getMonth() + 1 < birthSolar.month || now.getMonth() + 1 === birthSolar.month && now.getDate() < birthSolar.day;
  if (beforeBirthday) age--;
  return age;
}
function \uCD9C\uC0DD\uC9C0\uBCF4\uC815\uC801\uC6A9(info) {
  const solar = info.isLunar ? (0, import_manseryeok.lunarToSolar)(info.year, info.month, info.day, info.isLeapMonth) : { year: info.year, month: info.month, day: info.day };
  const r = \uCD9C\uC0DD\uC2DC\uAC01\uC5ED\uC0AC\uBCF4\uC815({ year: solar.year, month: solar.month, day: solar.day, hour: info.hour, minute: info.minute }, info.correctionMinutes, info.birthRegionLabel);
  if (!r.\uC801\uC6A9) return { info, \uBCF4\uC815: r };
  return {
    info: {
      ...info,
      year: r.year,
      month: r.month,
      day: r.day,
      hour: r.hour,
      minute: r.minute,
      isLunar: false,
      isLeapMonth: false
    },
    \uBCF4\uC815: r
  };
}
var \uBCF4\uC815\uD50C\uB798\uADF8 = (r) => ({ \uC11C\uBA38\uD0C0\uC784: r.\uC11C\uBA38\uD0C0\uC784, \uAE30\uC900\uC790\uC624\uC120: r.\uAE30\uC900\uC790\uC624\uC120 });
function \uC2DC\uAC01\uBCF4\uC815\uD50C\uB798\uADF8(info) {
  if (info.hourUnknown || info.ganjiSelect) return null;
  return \uBCF4\uC815\uD50C\uB798\uADF8(\uCD9C\uC0DD\uC9C0\uBCF4\uC815\uC801\uC6A9(info).\uBCF4\uC815);
}
function \uC591\uB825\uC73C\uB85C(info) {
  if (!info.isLunar) return info;
  const s = (0, import_manseryeok.lunarToSolar)(info.year, info.month, info.day, info.isLeapMonth);
  return { ...info, year: s.year, month: s.month, day: s.day, isLunar: false, isLeapMonth: false };
}
function \uD45C\uC900\uC2DC\uAC01(solar, \uBCF4\uC815) {
  if (!\uBCF4\uC815) return solar;
  const shift = (\uBCF4\uC815.\uC11C\uBA38\uD0C0\uC784 ? -60 : 0) + (\uBCF4\uC815.\uAE30\uC900\uC790\uC624\uC120 === 127.5 ? 30 : 0);
  if (!shift) return solar;
  const d = new Date(Date.UTC(solar.year, solar.month - 1, solar.day, solar.hour, solar.minute));
  d.setUTCMinutes(d.getUTCMinutes() + shift);
  return { ...solar, year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate(), hour: d.getUTCHours(), minute: d.getUTCMinutes() };
}
var ELEMENT_CLASS = { \uBAA9: "el-mok", \uD654: "el-hwa", \uD1A0: "el-to", \uAE08: "el-geum", \uC218: "el-su" };
function elCharSpan(ch, esc) {
  const el = STEM_ELEM_KO[ch] ?? BRANCH_ELEM_KO[ch];
  const escaped = esc(ch);
  return el ? `<span class="${ELEMENT_CLASS[el]}">${escaped}</span>` : escaped;
}
function ganzhiSpan(gz, esc) {
  return gz.split("").map((ch) => elCharSpan(ch, esc)).join("");
}
function elNameSpan(name, esc) {
  const cls = ELEMENT_CLASS[name];
  const escaped = esc(name);
  return cls ? `<span class="${cls}">${escaped}</span>` : escaped;
}
function sinsalClass(label) {
  if (label.startsWith("\uACF5\uB9DD")) return "pdf-gongmang";
  if (label.includes("\uADC0\uC778") || label.endsWith("\uB85D")) return "pdf-gwiin";
  if (label.endsWith("\uC0B4")) return "pdf-sal";
  return "";
}
function stemBranchHanjaCell(ko, isStem, esc) {
  const el = isStem ? STEM_ELEM_KO[ko] : BRANCH_ELEM_KO[ko];
  const hanja = isStem ? STEM_K2H[ko] : BRANCH_K2H[ko];
  const coloredHanja = el ? `<span class="${ELEMENT_CLASS[el]}">${esc(hanja)}</span>` : esc(hanja);
  return `<div class="pdf-hanja-main">${coloredHanja}</div><div class="pdf-hanja-sub">${esc(ko)}</div>`;
}
var TILE_CLASS = { \uBAA9: "tile-mok", \uD654: "tile-hwa", \uD1A0: "tile-to", \uAE08: "tile-geum", \uC218: "tile-su" };
function stemBranchTileCell(ko, isStem, esc) {
  const el = isStem ? STEM_ELEM_KO[ko] : BRANCH_ELEM_KO[ko];
  const hanja = isStem ? STEM_K2H[ko] : BRANCH_K2H[ko];
  const tileClass = el ? TILE_CLASS[el] : "";
  return `<div class="color-tile ${tileClass}">${esc(hanja)}</div><div class="pdf-hanja-sub">${esc(ko)}</div>`;
}
function PDF\uD5E4\uB354HTML(label, name, infoLine, esc) {
  const nameText = name ? `${label}: ${name}` : label;
  return `<div class="pdf-header"><div class="pdf-header-name">${esc(nameText)}</div><div class="pdf-header-info">${esc(infoLine)}</div></div>`;
}
function PDF\uD45CHTML(p, variant = "pdf") {
  const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const stemBranchCell = variant === "color" ? stemBranchTileCell : stemBranchHanjaCell;
  const cols = ["hour", "day", "month", "year"];
  const colHeader = { hour: "\uC2DC\uC8FC", day: "\uC77C\uC8FC", month: "\uC6D4\uC8FC", year: "\uB144\uC8FC" };
  const pillarKey = { hour: "\uC2DC", day: "\uC77C", month: "\uC6D4", year: "\uB144" };
  const cell = (c, html, big = false) => p.hourUnknown && c === "hour" ? `<td>-</td>` : `<td${big ? ' class="pdf-big"' : ""}>${html}</td>`;
  const rowLabel = (label) => `<th class="pdf-wonguk-label">${esc(label)}</th>`;
  const headerRow = `<tr><th class="pdf-wonguk-label"></th>${cols.map((c) => `<th>${esc(colHeader[c])}</th>`).join("")}</tr>`;
  const tgStemRow = `<tr>${rowLabel("\uC2ED\uC131(\uCC9C\uAC04)")}${cols.map((c) => cell(c, c === "day" ? esc("\uC77C\uAC04(\uB098)") : esc(\uBE48\uCE78\uCC44\uC6C0(p.tgSelf[c].stem)))).join("")}</tr>`;
  const stemRow = `<tr>${rowLabel("\uCC9C\uAC04")}${cols.map((c) => cell(c, stemBranchCell(p.m[c][0], true, esc), true)).join("")}</tr>`;
  const branchRow = `<tr>${rowLabel("\uC9C0\uC9C0")}${cols.map((c) => cell(c, stemBranchCell(p.m[c][1], false, esc), true)).join("")}</tr>`;
  const tgBranchRow = `<tr>${rowLabel("\uC2ED\uC131(\uC9C0\uC9C0)")}${cols.map((c) => cell(c, esc(\uBE48\uCE78\uCC44\uC6C0(p.tgSelf[c].branch)))).join("")}</tr>`;
  const jijangganRow = `<tr>${rowLabel("\uC9C0\uC7A5\uAC04")}${cols.map((c) => {
    if (p.hourUnknown && c === "hour") return `<td>-</td>`;
    const lines = \uC9C0\uC7A5\uAC04\uC2ED\uC131\uBAA9\uB85D(p.dayStemHanja, p.m[c][1]);
    const colored = lines.map((l) => {
      if (l === "-") return "-";
      const sp = l.indexOf(" ");
      return elCharSpan(l.slice(0, sp), esc) + esc(l.slice(sp));
    });
    return `<td class="pdf-jijanggan-cell">${colored.map((l) => `<div>${l}</div>`).join("")}</td>`;
  }).join("")}</tr>`;
  const unseongRow = `<tr>${rowLabel("\uC2ED\uC774\uC6B4\uC131")}${cols.map((c) => cell(c, esc(\uBE48\uCE78\uCC44\uC6C0(p.unseong[c])))).join("")}</tr>`;
  const yearSalRow = `<tr>${rowLabel("\uC2E0\uC0B4(\uC0AC\uD68C\xB7\uD658\uACBD)")}${cols.map((c) => cell(c, esc(\uBE48\uCE78\uCC44\uC6C0(\uC2ED\uC774\uC2E0\uC0B4\uBCC4\uCE6D(p.yearSal[c]))))).join("")}</tr>`;
  const daySalRow = `<tr>${rowLabel("\uC2E0\uC0B4(\uB0B4\uBA74\xB7\uC2EC\uB9AC)")}${cols.map((c) => cell(c, esc(\uBE48\uCE78\uCC44\uC6C0(\uC2ED\uC774\uC2E0\uC0B4\uBCC4\uCE6D(p.daySal[c]))))).join("")}</tr>`;
  const gongmangLabel = (branch) => {
    const inYear = p.\uACF5\uB9DD\uB144.includes(branch), inDay = p.\uACF5\uB9DD\uC77C.includes(branch);
    if (inYear && inDay) return "\uACF5\uB9DD(\uB144, \uC77C)";
    if (inYear) return "\uACF5\uB9DD(\uB144)";
    if (inDay) return "\uACF5\uB9DD(\uC77C)";
    return null;
  };
  const specialRow = `<tr>${rowLabel("\uC2E0\uC0B4\xB7\uADC0\uC778")}${cols.map((c) => {
    if (p.hourUnknown && c === "hour") return `<td>-</td>`;
    const gm = gongmangLabel(p.m[c][1]);
    const items = [...gm ? [gm] : [], ...p.\uD2B9\uC218\uC2E0\uC0B4byPillar[pillarKey[c]]];
    return `<td>${items.length ? items.map((x) => `<div class="${sinsalClass(x)}">${esc(x)}</div>`).join("") : "-"}</td>`;
  }).join("")}</tr>`;
  const wongukTable = `<table class="pdf-table pdf-wonguk"><thead>${headerRow}</thead><tbody>${tgStemRow}${stemRow}${branchRow}${tgBranchRow}${jijangganRow}${unseongRow}${yearSalRow}${daySalRow}${specialRow}</tbody></table>`;
  const daeunBody = p.daeunRows.map((row) => {
    const trOpen = row.current ? `<tr class="pdf-current">` : `<tr>`;
    if (!row.d) return `${trOpen}<td>${esc(row.label)}</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>`;
    return `${trOpen}<td>${esc(row.label)}</td><td>${esc(row.d.startAge)}\uC138</td><td>${ganzhiSpan(k(row.d.ganzhi), esc)}</td><td>${esc(row.d.stemTenGod)}/${esc(row.d.branchTenGod)}</td><td>${esc(row.d.stage12)}</td></tr>`;
  }).join("");
  const daeunTable = `<table class="pdf-table pdf-daeun"><caption>\uB300\uC6B4</caption><thead><tr><th>\uAD6C\uBD84</th><th>\uB098\uC774</th><th>\uAC04\uC9C0</th><th>\uC2ED\uC131</th><th>\uC6B4\uC131</th></tr></thead><tbody>${daeunBody}</tbody></table>`;
  const seyunBody = p.seyunRows.map((r) => `<tr${r.isCurrent ? ' class="pdf-current"' : ""}><td>${r.year}\uB144</td><td>${ganzhiSpan(r.ganzhi, esc)}</td><td>${esc(r.tgStem)}/${esc(r.tgBranch)}</td><td>${esc(r.stage12)}</td></tr>`).join("");
  const seyunTable = `<table class="pdf-table pdf-seyun"><caption>\uC138\uC6B4</caption><thead><tr><th>\uB144\uB3C4</th><th>\uAC04\uC9C0</th><th>\uC2ED\uC131</th><th>\uC6B4\uC131</th></tr></thead><tbody>${seyunBody}</tbody></table>`;
  const wolunBody = p.wolunRows.map(
    (r) => `<tr${r.isCurrent ? ' class="pdf-current"' : ""}><td>${r.year}.${String(r.month).padStart(2, "0")}</td><td>${ganzhiSpan(r.ganzhi, esc)}</td><td>${esc(r.tgStem)}/${esc(r.tgBranch)}</td></tr>`
  ).join("");
  const wolunTable = `<table class="pdf-table pdf-wolun"><caption>\uC6D4\uC6B4</caption><thead><tr><th>\uC6D4</th><th>\uAC04\uC9C0</th><th>\uC2ED\uC131</th></tr></thead><tbody>${wolunBody}</tbody></table>`;
  const sub = (s) => `<div style="font-size:0.82em;opacity:0.72;margin-top:2px">${esc(s)}</div>`;
  const eokbuLine = `\uC6A9\uC2E0 ${elNameSpan(p.eokbu.\uC6A9\uC2E0, esc)} \xB7 \uD76C\uC2E0 ${elNameSpan(p.eokbu.\uD76C\uC2E0, esc)} (\uAE30\uC2E0 ${elNameSpan(p.eokbu.\uAE30\uC2E0, esc)} \xB7 \uAD6C\uC2E0 ${elNameSpan(p.eokbu.\uAD6C\uC2E0, esc)} \xB7 \uD55C\uC2E0 ${elNameSpan(p.eokbu.\uD55C\uC2E0, esc)})`;
  const sgyTable = `<table class="pdf-table pdf-sgy"><tbody><tr>${rowLabel("\uACA9\uAD6D")}<td>${esc(p.gyeokName)}${sub(`${p.gyeokBasis} \xB7 \uC6D4\uB839 \uAE30\uC900`)}</td></tr><tr>${rowLabel("\uC2E0\uAC15\uC57D")}<td>${esc(p.sgyGradeLabel)}${sub(p.sgySummary)}</td></tr><tr>${rowLabel("\uC5B5\uBD80\uC6A9\uC2E0")}<td>${eokbuLine}${sub(p.yongsinMethod)}</td></tr><tr>${rowLabel("\uC870\uD6C4\uC6A9\uC2E0")}<td>${esc(p.johuLine)}</td></tr></tbody></table>`;
  return `<div class="pdf-card${p.variantClass}">${p.headerHtml}${wongukTable}${sgyTable}${daeunTable}${seyunTable}${wolunTable}</div>`;
}
function _\uBA85\uC2DD\uD45C\uC0DD\uC131(info, dayBoundary, \uC57C\uC790\uB77C\uBCA8, opts = {}) {
  const now = opts.now ?? /* @__PURE__ */ new Date();
  const hourUnknown = !!info.hourUnknown;
  const ganjiMode = !!info.ganjiSelect;
  const solarInfo = \uC591\uB825\uC73C\uB85C(info);
  const \uBCF4\uC815\uACB0\uACFC = !hourUnknown && !ganjiMode ? \uCD9C\uC0DD\uC9C0\uBCF4\uC815\uC801\uC6A9(solarInfo) : null;
  const correctionActive = !!\uBCF4\uC815\uACB0\uACFC && \uBCF4\uC815\uACB0\uACFC.\uBCF4\uC815.\uC801\uC6A9;
  const correctedInfo = correctionActive ? \uBCF4\uC815\uACB0\uACFC.info : solarInfo;
  const \uBCF4\uC815\uC870\uAC01 = correctionActive ? \uBCF4\uC815\uBB38\uAD6C\uC870\uAC01(\uBCF4\uC815\uACB0\uACFC.\uBCF4\uC815, `\uC9C0\uC5ED\uC2DC ${(info.birthRegionLabel || "").trim() || "\uBCF4\uC815"}`) : [];
  const \uC2DC\uAC01\uBCF4\uC815 = \uBCF4\uC815\uACB0\uACFC ? \uBCF4\uC815\uD50C\uB798\uADF8(\uBCF4\uC815\uACB0\uACFC.\uBCF4\uC815) : null;
  const effectiveInfo = hourUnknown ? { ...correctedInfo, hour: 12, minute: 0 } : correctedInfo;
  const \uD45C\uC900\uC2DCInfo = hourUnknown ? { ...solarInfo, hour: 12, minute: 0 } : \uD45C\uC900\uC2DC\uAC01(solarInfo, \uBCF4\uC815\uACB0\uACFC ? \uBCF4\uC815\uACB0\uACFC.\uBCF4\uC815 : null);
  const \uC9C0\uC5ED\uC2DC\uAE30\uB465 = (0, import_manseryeok.calculateFourPillars)({ ...effectiveInfo, dayBoundary }).toObject();
  const \uD45C\uC900\uC2DC\uACC4\uC0B0 = (0, import_manseryeok.calculateFourPillars)({ ...\uD45C\uC900\uC2DCInfo, gender: info.gender, dayBoundary });
  const \uD45C\uC900\uC2DC\uAE30\uB465 = \uD45C\uC900\uC2DC\uACC4\uC0B0.toObject();
  const m = { hour: \uC9C0\uC5ED\uC2DC\uAE30\uB465.hour, day: \uC9C0\uC5ED\uC2DC\uAE30\uB465.day, month: \uD45C\uC900\uC2DC\uAE30\uB465.month, year: \uD45C\uC900\uC2DC\uAE30\uB465.year };
  const thisYear = now.getFullYear();
  const dayStemHanja = STEM_K2H[m.day[0]];
  const daySalMap = \uC2ED\uC774\uC2E0\uC0B4\uB9F5(m.day[1]);
  const daySal = { hour: daySalMap[m.hour[1]], day: daySalMap[m.day[1]], month: daySalMap[m.month[1]], year: daySalMap[m.year[1]] };
  const yearSalMap = \uC2ED\uC774\uC2E0\uC0B4\uB9F5(m.year[1]);
  const yearSal = { hour: yearSalMap[m.hour[1]], day: yearSalMap[m.day[1]], month: yearSalMap[m.month[1]], year: yearSalMap[m.year[1]] };
  const unseongMap = \uC2ED\uC774\uC6B4\uC131\uB9F5(m.day[0]);
  const unseong = { hour: unseongMap[m.hour[1]], day: unseongMap[m.day[1]], month: unseongMap[m.month[1]], year: unseongMap[m.year[1]] };
  const tgSelf = {
    year: \uC2ED\uC131\uACC4\uC0B0(dayStemHanja, m.year),
    month: \uC2ED\uC131\uACC4\uC0B0(dayStemHanja, m.month),
    day: \uC2ED\uC131\uACC4\uC0B0(dayStemHanja, m.day),
    hour: \uC2ED\uC131\uACC4\uC0B0(dayStemHanja, m.hour)
  };
  const \uD2B9\uC218\uC2E0\uC0B4\uACB0\uACFC = \uCD94\uAC00\uD2B9\uC218\uC2E0\uC0B4({ year: m.year, month: m.month, day: m.day, hour: hourUnknown ? "--" : m.hour });
  const blocks = [];
  const name = (opts.name || "").trim();
  let head = "";
  if (name) head += `\uC774\uB984: ${name}
`;
  const timeText = hourUnknown ? "\uC2DC\uAC01 \uBBF8\uC0C1" : info.ganjiSelect ? `${info.ganjiSelect}(\uAC04\uC9C0\uC120\uD0DD)` : `${String(info.hour).padStart(2, "0")}:${String(info.minute).padStart(2, "0")}`;
  const jasiText = hourUnknown ? "" : ` (\uC790\uC2DC: ${\uC57C\uC790\uB77C\uBCA8})`;
  const \uBCF4\uC815Text = correctionActive ? ` (${\uBCF4\uC815\uC870\uAC01.join(", ")} \u2192 ${String(correctedInfo.hour).padStart(2, "0")}:${String(correctedInfo.minute).padStart(2, "0")} \uAE30\uC900)` : "";
  head += `\uAE30\uBCF8\uC815\uBCF4: ${info.isLunar ? "\uC74C\uB825" : "\uC591\uB825"} ${info.year}\uB144 ${info.month}\uC6D4 ${info.day}\uC77C ${timeText}${\uBCF4\uC815Text}, ${info.gender === "female" ? "\uC5EC\uC131" : "\uB0A8\uC131"}${jasiText}, \uC77C\uAC04(\uB098): ${m.day[0]}`;
  if (hourUnknown) head += `
(\uCD9C\uC0DD\uC2DC\uAC01 \uBBF8\uC0C1 \u2014 \uC2DC\uC8FC \uC81C\uC678)`;
  blocks.push(head);
  const genderText = info.gender === "female" ? "\uC5EC\uC131" : "\uB0A8\uC131";
  const pdf\uC790\uC2DCSuffix = hourUnknown ? "" : ` \xB7 \uC790\uC2DC ${\uC57C\uC790\uB77C\uBCA8}`;
  const pdf\uBCF4\uC815Suffix = correctionActive ? ` \xB7 ${\uBCF4\uC815\uC870\uAC01.join(" \xB7 ")} \uC801\uC6A9` : "";
  const pdfInfoLine = `${info.isLunar ? "\uC74C\uB825" : "\uC591\uB825"} ${info.year}\uB144 ${info.month}\uC6D4 ${info.day}\uC77C ${timeText} \xB7 ${genderText}${pdf\uC790\uC2DCSuffix}${pdf\uBCF4\uC815Suffix}`;
  const headerLabel = opts.headerLabel || "\uB0B4\uB2F4\uC790";
  const variantClass = opts.personVariant === "a" ? " pdf-card-a" : opts.personVariant === "b" ? " pdf-card-b" : "";
  const headerEsc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const pdfHeaderHtml = PDF\uD5E4\uB354HTML(headerLabel, name, pdfInfoLine, headerEsc);
  blocks.push(`[\uC6D0\uAD6D]
${\uC6D0\uAD6D\uB77C\uC778\uD14D\uC2A4\uD2B8(m, dayStemHanja, tgSelf, unseong, yearSal, daySal, \uD2B9\uC218\uC2E0\uC0B4\uACB0\uACFC.byPillar, hourUnknown)}`);
  const fe = \uC624\uD589\uBD84\uD3EC\uACC4\uC0B0(hourUnknown ? [m.year, m.month, m.day] : [m.year, m.month, m.day, m.hour]);
  blocks.push(`[\uC624\uD589\uBD84\uD3EC] \uBAA9 ${fe.\uBAA9} \uD654 ${fe.\uD654} \uD1A0 ${fe.\uD1A0} \uAE08 ${fe.\uAE08} \uC218 ${fe.\uC218}`);
  const \uACA9\uAD6D\uD22C\uCD9C\uD6C4\uBCF4 = hourUnknown ? [m.year[0], m.month[0]] : [m.year[0], m.month[0], m.hour[0]];
  const gyeok = \uACA9\uAD6D\uD310\uC815(dayStemHanja, m.month[1], \uACA9\uAD6D\uD22C\uCD9C\uD6C4\uBCF4);
  const \uC138\uB825 = \uC138\uB825\uBD84\uC11D({ year: m.year, month: m.month, day: m.day, hour: m.hour }, hourUnknown);
  const sgy = {
    score: \uC138\uB825.\uC810\uC218,
    grade: \uC138\uB825.\uB4F1\uAE09,
    gradeLabel: \uC138\uB825.\uB4F1\uAE09 + (hourUnknown ? " (\uC2DC\uC8FC \uC81C\uC678 \uAE30\uC900)" : ""),
    \uB4DD\uB839\uB77C\uBCA8: \uC138\uB825.\uB4DD\uB839,
    \uB4DD\uC9C0\uB77C\uBCA8: \uC138\uB825.\uB4DD\uC9C0,
    \uB4DD\uC138\uB77C\uBCA8: \uC138\uB825.\uB4DD\uC138
  };
  const johu = \uC870\uD6C4\uC6A9\uC2E0\uACC4\uC0B0(m.month[1], m.day[0]);
  const johuText = johu.\uBCF4\uC870\uC6A9\uC2E0.length ? `${johu.\uC8FC\uC6A9\uC2E0} (\uBCF4\uC870: ${johu.\uBCF4\uC870\uC6A9\uC2E0.join(", ")})` : johu.\uC8FC\uC6A9\uC2E0;
  const \uC6A9 = \uC6A9\uC2E0\uBD84\uC11D(\uC138\uB825, johu.\uC8FC\uC6A9\uC2E0);
  const eokbu = { \uC6A9\uC2E0: \uC6A9.\uC6A9\uC2E0, \uD76C\uC2E0: \uC6A9.\uD76C\uC2E0, \uAE30\uC2E0: \uC6A9.\uAE30\uC2E0, \uAD6C\uC2E0: \uC6A9.\uAD6C\uC2E0, \uD55C\uC2E0: \uC6A9.\uD55C\uC2E0 };
  const eokbuText = `\uC6A9\uC2E0 ${eokbu.\uC6A9\uC2E0} / \uD76C\uC2E0 ${eokbu.\uD76C\uC2E0} / \uAE30\uC2E0 ${eokbu.\uAE30\uC2E0} / \uAD6C\uC2E0 ${eokbu.\uAD6C\uC2E0} / \uD55C\uC2E0 ${eokbu.\uD55C\uC2E0}`;
  const \uADFC\uAC70\uC904 = (list) => list.map((x) => `
  \uADFC\uAC70: ${x}`).join("");
  blocks.push(
    `[\uACA9\uAD6D] ${gyeok.name} (${gyeok.basis})
  \uAE30\uC900: ${\uACA9\uAD6D\uAE30\uC900}
[\uC2E0\uAC15\uC57D] ${sgy.gradeLabel} (\uB4DD\uB839${sgy.\uB4DD\uB839\uB77C\uBCA8} \uB4DD\uC9C0${sgy.\uB4DD\uC9C0\uB77C\uBCA8} \uB4DD\uC138${sgy.\uB4DD\uC138\uB77C\uBCA8}, \uB3D5\uB294 \uD798 ${sgy.score}%)${\uADFC\uAC70\uC904(\uC138\uB825.\uADFC\uAC70)}
[\uC5B5\uBD80\uC6A9\uC2E0] ${eokbuText} \u2014 ${\uC6A9.\uBC29\uBC95}${\uADFC\uAC70\uC904(\uC6A9.\uADFC\uAC70)}
[\uC870\uD6C4\uC6A9\uC2E0] ${johuText}`
  );
  const \uBD84\uB958\uB41C\uC2E0\uC0B4\uC774\uB984 = new Set(Object.values(\uD2B9\uC218\uC2E0\uC0B4\uACB0\uACFC.byPillar).flat());
  const \uAE30\uD0C0\uC2E0\uC0B4 = [...new Set(\uD2B9\uC218\uC2E0\uC0B4\uACB0\uACFC.list.map((entry) => entry.replace(/\(.*\)$/, "")).filter((name2) => !\uBD84\uB958\uB41C\uC2E0\uC0B4\uC774\uB984.has(name2)))];
  if (\uAE30\uD0C0\uC2E0\uC0B4.length) blocks.push(`[\uC2E0\uC0B4\xB7\uADC0\uC778 \uAE30\uD0C0] ${\uAE30\uD0C0\uC2E0\uC0B4.join(", ")}`);
  const [\uACF5\uB9DD\uB1441, \uACF5\uB9DD\uB1442] = \uACF5\uB9DD\uACC4\uC0B0(m.year);
  const [\uACF5\uB9DD\uC77C1, \uACF5\uB9DD\uC77C2] = \uACF5\uB9DD\uACC4\uC0B0(m.day);
  blocks.push(`[\uACF5\uB9DD] \uB144\uC8FC\uAE30\uC900: ${\uACF5\uB9DD\uB1441}, ${\uACF5\uB9DD\uB1442} / \uC77C\uC8FC\uAE30\uC900: ${\uACF5\uB9DD\uC77C1}, ${\uACF5\uB9DD\uC77C2}`);
  const \uAD00\uACC4 = \uC6D0\uAD6D\uAD00\uACC4(m, hourUnknown);
  const \uCC9C\uAC04\uACB0\uACFC = new Set(\uAD00\uACC4.\uCC9C\uAC04);
  const \uD569\uC804\uCCB4 = [...\uAD00\uACC4.\uC721\uD569, ...\uAD00\uACC4.\uC0BC\uD569, ...\uAD00\uACC4.\uBC29\uD569];
  const \uCDA9\uD615\uD30C\uD574\uC804\uCCB4 = [...\uAD00\uACC4.\uCDA9, ...\uAD00\uACC4.\uD615, ...\uAD00\uACC4.\uD30C, ...\uAD00\uACC4.\uD574, ...\uAD00\uACC4.\uC6D0\uC9C4, ...\uAD00\uACC4.\uADC0\uBB38];
  let hcw = `[\uD615\uCDA9\uD68C\uD569]`;
  if (\uCC9C\uAC04\uACB0\uACFC.size) hcw += `
  \uCC9C\uAC04: ${[...\uCC9C\uAC04\uACB0\uACFC].join(" / ")}`;
  if (\uD569\uC804\uCCB4.length) hcw += `
  \uD569: ${\uD569\uC804\uCCB4.join(" / ")}`;
  if (\uCDA9\uD615\uD30C\uD574\uC804\uCCB4.length) hcw += `
  \uCDA9\uD615\uD30C\uD574: ${\uCDA9\uD615\uD30C\uD574\uC804\uCCB4.join(" / ")}`;
  blocks.push(hcw);
  const birthSolar = info.isLunar ? (0, import_manseryeok.lunarToSolar)(info.year, info.month, info.day, info.isLeapMonth) : { year: info.year, month: info.month, day: info.day };
  const manAge = \uB9CC\uB098\uC774\uACC4\uC0B0(birthSolar, now);
  const \uB300\uC6B4\uC815\uBCF4 = \uD45C\uC900\uC2DC\uACC4\uC0B0.luckPillars || { forward: true, startAge: 0, pillars: [] };
  const \uB300\uC6B4\uBC29\uD5A5\uAE00 = \uB300\uC6B4\uC815\uBCF4.forward ? "\uC21C\uD589" : "\uC5ED\uD589";
  const daeunList = (\uB300\uC6B4\uC815\uBCF4.pillars || []).map((p) => {
    const gz = p.korean;
    return {
      startAge: p.age,
      ganzhi: gz,
      stemTenGod: tenGod(dayStemHanja, STEM_K2H[gz[0]]),
      branchTenGod: tenGod(dayStemHanja, BRANCH_MAIN[BRANCH_K2H[gz[1]]]),
      stage12: unseongMap[gz[1]]
    };
  });
  let curDaeunIdx = 0;
  daeunList.forEach((d, i) => {
    if (d.startAge <= manAge) curDaeunIdx = i;
  });
  let dae = `[\uB300\uC6B4] \uB300\uC6B4\uC218 ${\uB300\uC6B4\uC815\uBCF4.startAge}, ${\uB300\uC6B4\uBC29\uD5A5\uAE00}`;
  daeunList.forEach((d, i) => {
    dae += `
  ${d.startAge}\uC138 ${k(d.ganzhi)} (${d.stemTenGod}/${d.branchTenGod}, ${d.stage12})${i === curDaeunIdx ? " \u2190 \uD604\uC7AC \uB300\uC6B4" : ""}`;
  });
  blocks.push(dae);
  const daeunPdfRows = [
    { label: "\uC9C0\uB09C \uB300\uC6B4", d: daeunList[curDaeunIdx - 1] },
    { label: "\uD604\uC7AC \uB300\uC6B4", d: daeunList[curDaeunIdx], current: true },
    { label: "\uB2E4\uC74C \uB300\uC6B4", d: daeunList[curDaeunIdx + 1] }
  ];
  const \uC138\uC6B4\uB144\uC218 = opts.\uC138\uC6B4\uB144\uC218 ?? 5;
  const seRes = \uC138\uC6B4\uACC4\uC0B0(dayStemHanja, m.day[0], info.gender, dayBoundary, thisYear, \uC138\uC6B4\uB144\uC218);
  blocks.push(`[\uC138\uC6B4] (${thisYear}~${seRes.endYear})
${seRes.text}`);
  const seyunPdfRows = \uC138\uC6B4\uD45C\uB370\uC774\uD130(dayStemHanja, m.day[0], info.gender, dayBoundary, thisYear);
  const \uC6D4\uC6B4\uAC1C\uC6D4\uC218 = opts.\uC6D4\uC6B4\uAC1C\uC6D4\uC218 ?? 12;
  const wolRes = \uC6D4\uC6B4\uACC4\uC0B0(dayStemHanja, info.gender, dayBoundary, now, \uC6D4\uC6B4\uAC1C\uC6D4\uC218);
  const \uD5A5\uD6C4\uAC1C\uC6D4 = \uC6D4\uC6B4\uAC1C\uC6D4\uC218 - 2;
  blocks.push(`[\uC6D4\uC6B4] (\uC9C0\uB09C 1\uAC1C\uC6D4 ~ \uD5A5\uD6C4 ${\uD5A5\uD6C4\uAC1C\uC6D4}\uAC1C\uC6D4)
${wolRes.text}`);
  const wolunPdfRows = \uC6D4\uC6B4\uD45C\uB370\uC774\uD130(dayStemHanja, info.gender, dayBoundary, now);
  const \uC5F0\uC560\uC0C1\uD0DC = (opts.\uC5F0\uC560\uC0C1\uD0DC || "").trim();
  if (\uC5F0\uC560\uC0C1\uD0DC && \uC5F0\uC560\uC0C1\uD0DC !== "\uC120\uD0DD\uC548\uD568") blocks.push(`[\uC5F0\uC560\uC0C1\uD0DC] ${\uC5F0\uC560\uC0C1\uD0DC}`);
  const concern = (opts.concern || "").trim();
  if (concern) blocks.push(`[\uACE0\uBBFC]
${concern}`);
  const pdfTableParams = {
    hourUnknown,
    dayStemHanja,
    m: { hour: m.hour, day: m.day, month: m.month, year: m.year },
    tgSelf,
    unseong,
    yearSal,
    daySal,
    \uD2B9\uC218\uC2E0\uC0B4byPillar: \uD2B9\uC218\uC2E0\uC0B4\uACB0\uACFC.byPillar,
    daeunRows: daeunPdfRows,
    seyunRows: seyunPdfRows,
    wolunRows: wolunPdfRows,
    gyeokName: gyeok.name,
    gyeokBasis: gyeok.basis,
    sgyGradeLabel: sgy.gradeLabel,
    sgySummary: `\uB4DD\uB839 ${sgy.\uB4DD\uB839\uB77C\uBCA8} \xB7 \uB4DD\uC9C0 ${sgy.\uB4DD\uC9C0\uB77C\uBCA8} \xB7 \uB4DD\uC138 ${sgy.\uB4DD\uC138\uB77C\uBCA8} \xB7 \uB3D5\uB294 \uD798 ${sgy.score}%`,
    yongsinMethod: \uC6A9.\uBC29\uBC95,
    eokbu,
    johuLine: johuText,
    \uACF5\uB9DD\uB144: [\uACF5\uB9DD\uB1441, \uACF5\uB9DD\uB1442],
    \uACF5\uB9DD\uC77C: [\uACF5\uB9DD\uC77C1, \uACF5\uB9DD\uC77C2],
    headerHtml: pdfHeaderHtml,
    variantClass
  };
  const pdfHtml = PDF\uD45CHTML(pdfTableParams, "pdf");
  const colorHtml = PDF\uD45CHTML(pdfTableParams, "color");
  const \uC2ED\uC131\uC0C1\uC138 = {};
  const \uC2ED\uC131\uADF8\uB8F9 = { \uC778\uC131: 0, \uBE44\uAC81: 0, \uC2DD\uC0C1: 0, \uC7AC\uC131: 0, \uAD00\uC131: 0 };
  const \uC2ED\uC131\uAC12 = hourUnknown ? [tgSelf.year.stem, tgSelf.year.branch, tgSelf.month.stem, tgSelf.month.branch, tgSelf.day.branch] : [tgSelf.year.stem, tgSelf.year.branch, tgSelf.month.stem, tgSelf.month.branch, tgSelf.day.branch, tgSelf.hour.stem, tgSelf.hour.branch];
  \uC2ED\uC131\uAC12.forEach((v) => {
    if (!v) return;
    \uC2ED\uC131\uC0C1\uC138[v] = (\uC2ED\uC131\uC0C1\uC138[v] || 0) + 1;
    const g = TEN_GOD_GROUP[v];
    if (g) \uC2ED\uC131\uADF8\uB8F9[g]++;
  });
  const \uB300\uC6B4\uD56D\uBAA9 = (d) => d ? { \uB098\uC774: d.startAge, \uAC04\uC9C0: k(d.ganzhi), \uC2ED\uC131: `${d.stemTenGod}/${d.branchTenGod}`, \uC6B4\uC131: d.stage12 } : null;
  const \uC138\uC6B4\uD604\uC7AC = seyunPdfRows.find((r) => r.isCurrent) || seyunPdfRows.find((r) => r.year === thisYear) || null;
  const \uC6D4\uC6B4\uD604\uC7AC = wolunPdfRows.find((r) => r.isCurrent) || null;
  const \uACF5\uB9DD\uB77C\uBCA8 = (branch) => {
    const inYear = [\uACF5\uB9DD\uB1441, \uACF5\uB9DD\uB1442].includes(branch), inDay = [\uACF5\uB9DD\uC77C1, \uACF5\uB9DD\uC77C2].includes(branch);
    if (inYear && inDay) return "\uACF5\uB9DD(\uB144, \uC77C)";
    if (inYear) return "\uACF5\uB9DD(\uB144)";
    if (inDay) return "\uACF5\uB9DD(\uC77C)";
    return null;
  };
  const wongukCols = [
    { c: "hour", key: "\uC2DC" },
    { c: "day", key: "\uC77C" },
    { c: "month", key: "\uC6D4" },
    { c: "year", key: "\uB144" }
  ];
  const wonguk = wongukCols.map(({ c, key }) => {
    const gz = m[c];
    const stemKo = gz[0], branchKo = gz[1];
    const gm = \uACF5\uB9DD\uB77C\uBCA8(branchKo);
    const unknown = hourUnknown && c === "hour";
    return {
      key,
      ganzhi: gz,
      stemKo,
      stemHanja: STEM_K2H[stemKo] || stemKo,
      stemElem: STEM_ELEM_KO[stemKo] || "",
      branchKo,
      branchHanja: BRANCH_K2H[branchKo] || branchKo,
      branchElem: BRANCH_ELEM_KO[branchKo] || "",
      stemTenGod: c === "day" ? "\uC77C\uAC04" : \uBE48\uCE78\uCC44\uC6C0(tgSelf[c].stem),
      branchTenGod: \uBE48\uCE78\uCC44\uC6C0(tgSelf[c].branch),
      jijanggan: unknown ? [] : \uC9C0\uC7A5\uAC04\uC2ED\uC131\uBAA9\uB85D(dayStemHanja, branchKo).filter((l) => l !== "-"),
      unseong: \uBE48\uCE78\uCC44\uC6C0(unseong[c]),
      yearSal: \uBE48\uCE78\uCC44\uC6C0(\uC2ED\uC774\uC2E0\uC0B4\uBCC4\uCE6D(yearSal[c])),
      daySal: \uBE48\uCE78\uCC44\uC6C0(\uC2ED\uC774\uC2E0\uC0B4\uBCC4\uCE6D(daySal[c])),
      sinsal: unknown ? [] : [...gm ? [gm] : [], ...\uD2B9\uC218\uC2E0\uC0B4\uACB0\uACFC.byPillar[key] || []],
      unknown
    };
  });
  const raw = {
    m: { hour: m.hour, day: m.day, month: m.month, year: m.year },
    hourUnknown,
    \uC2DC\uAC01\uBCF4\uC815,
    eokbu,
    wonguk,
    \uC6D4\uC6B4\uBAA9\uB85D: wolunPdfRows.map((r) => ({
      \uB144: r.year,
      \uC6D4: r.month,
      \uAC04\uC9C0: r.ganzhi,
      \uCC9C\uAC04\uC2ED\uC131: r.tgStem,
      \uC9C0\uC9C0\uC2ED\uC131: r.tgBranch,
      \uD604\uC7AC: !!r.isCurrent
    })),
    consult: {
      \uC77C\uAC04: m.day[0],
      \uC77C\uAC04\uC624\uD589: STEM_ELEM_KO[m.day[0]],
      \uC77C\uC8FC: m.day,
      \uC131\uBCC4: info.gender,
      \uB9CC\uB098\uC774: manAge,
      \uACA9\uAD6D: gyeok.name,
      \uACA9\uAD6D\uADFC\uAC70: gyeok.basis,
      \uACA9\uAD6D\uAE30\uC900,
      \uC2E0\uAC15\uC57D: sgy.gradeLabel,
      \uC2E0\uAC15\uC57D\uC810\uC218: sgy.score,
      \uB4DD\uB839: sgy.\uB4DD\uB839\uB77C\uBCA8,
      \uB4DD\uC9C0: sgy.\uB4DD\uC9C0\uB77C\uBCA8,
      \uB4DD\uC138: sgy.\uB4DD\uC138\uB77C\uBCA8,
      \uC2E0\uAC15\uC57D\uADFC\uAC70: \uC138\uB825.\uADFC\uAC70,
      \uC2E0\uAC15\uC57D\uAE30\uC900: \uC138\uB825\uAE30\uC900\uC124\uBA85(),
      \uC138\uB825\uBD84\uD3EC: \uC138\uB825.\uC2ED\uC131\uD798,
      \uC624\uD589\uC138\uB825: \uC138\uB825.\uC624\uD589\uD798,
      \uC6A9\uC2E0: eokbu.\uC6A9\uC2E0,
      \uD76C\uC2E0: eokbu.\uD76C\uC2E0,
      \uAE30\uC2E0: eokbu.\uAE30\uC2E0,
      \uAD6C\uC2E0: eokbu.\uAD6C\uC2E0,
      \uD55C\uC2E0: eokbu.\uD55C\uC2E0,
      \uC6A9\uC2E0\uBC29\uBC95: \uC6A9.\uBC29\uBC95,
      \uC6A9\uC2E0\uADFC\uAC70: \uC6A9.\uADFC\uAC70,
      \uC870\uD6C4: johuText,
      \uC624\uD589\uBD84\uD3EC: fe,
      \uC2ED\uC131\uBD84\uD3EC: \uC2ED\uC131\uADF8\uB8F9,
      \uC2ED\uC131\uC0C1\uC138,
      \uACF5\uB9DD\uB144: [\uACF5\uB9DD\uB1441, \uACF5\uB9DD\uB1442],
      \uACF5\uB9DD\uC77C: [\uACF5\uB9DD\uC77C1, \uACF5\uB9DD\uC77C2],
      \uC2E0\uC0B4: {
        \uB144: \uD2B9\uC218\uC2E0\uC0B4\uACB0\uACFC.byPillar.\uB144 || [],
        \uC6D4: \uD2B9\uC218\uC2E0\uC0B4\uACB0\uACFC.byPillar.\uC6D4 || [],
        \uC77C: \uD2B9\uC218\uC2E0\uC0B4\uACB0\uACFC.byPillar.\uC77C || [],
        \uC2DC: \uD2B9\uC218\uC2E0\uC0B4\uACB0\uACFC.byPillar.\uC2DC || []
      },
      \uC2E0\uC0B4\uAE30\uD0C0: \uAE30\uD0C0\uC2E0\uC0B4,
      \uD569: \uD569\uC804\uCCB4,
      \uCDA9\uD615\uD30C\uD574: \uCDA9\uD615\uD30C\uD574\uC804\uCCB4,
      \uCC9C\uAC04\uAD00\uACC4: [...\uCC9C\uAC04\uACB0\uACFC],
      \uD604\uC7AC\uB300\uC6B4: \uB300\uC6B4\uD56D\uBAA9(daeunList[curDaeunIdx]),
      \uB2E4\uC74C\uB300\uC6B4: \uB300\uC6B4\uD56D\uBAA9(daeunList[curDaeunIdx + 1]),
      \uB300\uC6B4\uC218: \uB300\uC6B4\uC815\uBCF4.startAge,
      \uB300\uC6B4\uBC29\uD5A5: \uB300\uC6B4\uBC29\uD5A5\uAE00,
      \uB300\uC6B4\uBAA9\uB85D: daeunList.map((d, i) => ({
        \uB098\uC774: d.startAge,
        \uAC04\uC9C0: k(d.ganzhi),
        \uCC9C\uAC04\uC2ED\uC131: d.stemTenGod,
        \uC9C0\uC9C0\uC2ED\uC131: d.branchTenGod,
        \uC6B4\uC131: d.stage12,
        \uD604\uC7AC: i === curDaeunIdx
      })),
      \uC138\uC6B4\uBAA9\uB85D: \uC138\uC6B4\uAD6C\uAC04(dayStemHanja, m.day[0], info.gender, dayBoundary, thisYear - 2, 15, thisYear).map((r) => ({
        \uB144\uB3C4: r.year,
        \uAC04\uC9C0: r.ganzhi,
        \uCC9C\uAC04\uC2ED\uC131: r.tgStem,
        \uC9C0\uC9C0\uC2ED\uC131: r.tgBranch,
        \uC6B4\uC131: r.stage12,
        \uD604\uC7AC: !!r.isCurrent
      })),
      \uC62C\uD574\uC138\uC6B4: \uC138\uC6B4\uD604\uC7AC ? { \uB144\uB3C4: \uC138\uC6B4\uD604\uC7AC.year, \uAC04\uC9C0: \uC138\uC6B4\uD604\uC7AC.ganzhi, \uC2ED\uC131: `${\uC138\uC6B4\uD604\uC7AC.tgStem}/${\uC138\uC6B4\uD604\uC7AC.tgBranch}`, \uC6B4\uC131: \uC138\uC6B4\uD604\uC7AC.stage12 } : null,
      \uC774\uBC88\uB2EC\uC6D4\uC6B4: \uC6D4\uC6B4\uD604\uC7AC ? { \uB77C\uBCA8: `${\uC6D4\uC6B4\uD604\uC7AC.year}\uB144 ${\uC6D4\uC6B4\uD604\uC7AC.month}\uC6D4`, \uAC04\uC9C0: \uC6D4\uC6B4\uD604\uC7AC.ganzhi, \uC2ED\uC131: `${\uC6D4\uC6B4\uD604\uC7AC.tgStem}/${\uC6D4\uC6B4\uD604\uC7AC.tgBranch}`, \uC6B4\uC131: "" } : null,
      \uACE0\uBBFC: concern,
      \uC5F0\uC560\uC0C1\uD0DC: \uC5F0\uC560\uC0C1\uD0DC && \uC5F0\uC560\uC0C1\uD0DC !== "\uC120\uD0DD\uC548\uD568" ? \uC5F0\uC560\uC0C1\uD0DC : ""
    }
  };
  return { text: blocks.join("\n\n") + "\n", pdfHtml, colorHtml, raw };
}
function \uBA85\uC2DD\uD45C(info, dayBoundary, \uC57C\uC790\uB77C\uBCA8, opts = {}) {
  return _\uBA85\uC2DD\uD45C\uC0DD\uC131(info, dayBoundary, \uC57C\uC790\uB77C\uBCA8, opts).text;
}
function \uBA85\uC2DD\uD45C\uC0C1\uC138(info, dayBoundary, \uC57C\uC790\uB77C\uBCA8, opts = {}) {
  return _\uBA85\uC2DD\uD45C\uC0DD\uC131(info, dayBoundary, \uC57C\uC790\uB77C\uBCA8, opts);
}
var GUNGHAP_PILLAR_LABEL = { hour: "\uC2DC\uC9C0", day: "\uC77C\uC9C0", month: "\uC6D4\uC9C0", year: "\uB144\uC9C0" };
var \uC5C6\uC74C\uBB38\uAD6C = "\uD2B9\uBCC4\uD55C \uD569\uCDA9\uD615\uD30C\uD574\uC6D0\uC9C4 \uC5C6\uC74C";
function \uAD81\uD569\uAD50\uCC28\uACC4\uC0B0(a, b) {
  const ilganRel = \uCC9C\uAC04\uC30D\uAD00\uACC4\uD14D\uC2A4\uD2B8(a.m.day[0], b.m.day[0]);
  const iljiRelList = \uC9C0\uC9C0\uC30D\uC804\uCCB4\uAD00\uACC4(a.m.day[1], b.m.day[1]);
  const yeonjiRelList = \uC9C0\uC9C0\uC30D\uC804\uCCB4\uAD00\uACC4(a.m.year[1], b.m.year[1]);
  const aCols = a.hourUnknown ? ["year", "month", "day"] : ["year", "month", "day", "hour"];
  const bCols = b.hourUnknown ? ["year", "month", "day"] : ["year", "month", "day", "hour"];
  const crossLines = [];
  aCols.forEach((ak) => {
    bCols.forEach((bk) => {
      const rels = \uC9C0\uC9C0\uC30D\uC804\uCCB4\uAD00\uACC4(a.m[ak][1], b.m[bk][1]);
      if (rels.length) crossLines.push(`\uBCF8\uC778 ${GUNGHAP_PILLAR_LABEL[ak]} ${a.m[ak][1]} \u2194 \uC0C1\uB300 ${GUNGHAP_PILLAR_LABEL[bk]} ${b.m[bk][1]}: ${rels.join("\xB7")}`);
    });
  });
  const aDist = \uC624\uD589\uBD84\uD3EC\uACC4\uC0B0(aCols.map((c) => a.m[c]));
  const bDist = \uC624\uD589\uBD84\uD3EC\uACC4\uC0B0(bCols.map((c) => b.m[c]));
  return {
    aDayStem: a.m.day[0],
    bDayStem: b.m.day[0],
    ilganRel,
    aDayBranch: a.m.day[1],
    bDayBranch: b.m.day[1],
    iljiRelList,
    aYearBranch: a.m.year[1],
    bYearBranch: b.m.year[1],
    yeonjiRelList,
    crossLines,
    aYongsin: a.eokbu.\uC6A9\uC2E0,
    bYongsin: b.eokbu.\uC6A9\uC2E0,
    aYongsinCountInB: bDist[a.eokbu.\uC6A9\uC2E0],
    bYongsinCountInA: aDist[b.eokbu.\uC6A9\uC2E0]
  };
}
function \uAD81\uD569\uD14D\uC2A4\uD2B8\uBE14\uB85D(c) {
  let s = `[\uAD81\uD569 \uAD00\uACC4 \uBD84\uC11D]
`;
  s += `\uC77C\uAC04 \uAD00\uACC4: ${c.aDayStem}(\uBCF8\uC778) \u2194 ${c.bDayStem}(\uC0C1\uB300) \u2014 ${c.ilganRel}
`;
  s += `\uC77C\uC9C0 \uAD00\uACC4: ${c.aDayBranch}(\uBCF8\uC778) \u2194 ${c.bDayBranch}(\uC0C1\uB300) \u2014 ${c.iljiRelList.length ? c.iljiRelList.join("\xB7") : \uC5C6\uC74C\uBB38\uAD6C}
`;
  s += `\uB144\uC9C0(\uB760) \uAD00\uACC4: ${c.aYearBranch}(\uBCF8\uC778) \u2194 ${c.bYearBranch}(\uC0C1\uB300) \u2014 ${c.yeonjiRelList.length ? c.yeonjiRelList.join("\xB7") : \uC5C6\uC74C\uBB38\uAD6C}
`;
  s += `\uC804\uCCB4 \uC9C0\uC9C0 \uAD50\uCC28:
`;
  s += c.crossLines.length ? c.crossLines.map((l) => `  ${l}`).join("\n") : "  \uC131\uB9BD\uD558\uB294 \uD569\uCDA9\uD615\uD30C\uD574\uC6D0\uC9C4 \uC5C6\uC74C";
  s += `
\uC6A9\uC2E0 \uC0C1\uD638 \uCDA9\uC871:
`;
  s += `  \uBCF8\uC778 \uC6A9\uC2E0 ${c.aYongsin} \u2192 \uC0C1\uB300 \uC6D0\uAD6D\uC5D0 ${c.aYongsinCountInB}\uAC1C
`;
  s += `  \uC0C1\uB300 \uC6A9\uC2E0 ${c.bYongsin} \u2192 \uBCF8\uC778 \uC6D0\uAD6D\uC5D0 ${c.bYongsinCountInA}\uAC1C`;
  return s;
}
function \uAD81\uD569\uD45CHTML(c) {
  const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const rowLabel = (label) => `<th class="pdf-wonguk-label">${esc(label)}</th>`;
  const crossCell = c.crossLines.length ? c.crossLines.map((l) => `<div>${esc(l)}</div>`).join("") : esc("\uC131\uB9BD\uD558\uB294 \uD569\uCDA9\uD615\uD30C\uD574\uC6D0\uC9C4 \uC5C6\uC74C");
  return `<table class="pdf-table pdf-gunghap"><tbody><tr>${rowLabel("\uC77C\uAC04 \uAD00\uACC4")}<td>${esc(c.aDayStem)}(\uBCF8\uC778) \u2194 ${esc(c.bDayStem)}(\uC0C1\uB300) \u2014 ${esc(c.ilganRel)}</td></tr><tr>${rowLabel("\uC77C\uC9C0 \uAD00\uACC4")}<td>${esc(c.aDayBranch)}(\uBCF8\uC778) \u2194 ${esc(c.bDayBranch)}(\uC0C1\uB300) \u2014 ${esc(c.iljiRelList.length ? c.iljiRelList.join("\xB7") : \uC5C6\uC74C\uBB38\uAD6C)}</td></tr><tr>${rowLabel("\uB144\uC9C0(\uB760) \uAD00\uACC4")}<td>${esc(c.aYearBranch)}(\uBCF8\uC778) \u2194 ${esc(c.bYearBranch)}(\uC0C1\uB300) \u2014 ${esc(c.yeonjiRelList.length ? c.yeonjiRelList.join("\xB7") : \uC5C6\uC74C\uBB38\uAD6C)}</td></tr><tr>${rowLabel("\uC9C0\uC9C0 \uAD50\uCC28")}<td>${crossCell}</td></tr><tr>${rowLabel("\uC6A9\uC2E0 \uC0C1\uD638 \uCDA9\uC871")}<td><div>\uBCF8\uC778 \uC6A9\uC2E0 ${elNameSpan(c.aYongsin, esc)} \u2192 \uC0C1\uB300 \uC6D0\uAD6D\uC5D0 ${c.aYongsinCountInB}\uAC1C</div><div>\uC0C1\uB300 \uC6A9\uC2E0 ${elNameSpan(c.bYongsin, esc)} \u2192 \uBCF8\uC778 \uC6D0\uAD6D\uC5D0 ${c.bYongsinCountInA}\uAC1C</div></td></tr></tbody></table>`;
}
function \uAD81\uD569\uBD84\uC11D(personA, personB, relationType, dayBoundary, \uC57C\uC790\uB77C\uBCA8, opts = {}) {
  const aResult = _\uBA85\uC2DD\uD45C\uC0DD\uC131(personA.info, dayBoundary, \uC57C\uC790\uB77C\uBCA8, { name: personA.name, now: opts.now, headerLabel: "\uBCF8\uC778", personVariant: "a" });
  const bResult = _\uBA85\uC2DD\uD45C\uC0DD\uC131(personB.info, dayBoundary, \uC57C\uC790\uB77C\uBCA8, { name: personB.name, now: opts.now, headerLabel: "\uC0C1\uB300\uBC29", personVariant: "b" });
  const cross = \uAD81\uD569\uAD50\uCC28\uACC4\uC0B0(aResult.raw, bResult.raw);
  const aName = (personA.name || "").trim() || "\uBCF8\uC778";
  const bName = (personB.name || "").trim() || "\uC0C1\uB300";
  const concern = (opts.concern || "").trim();
  const parts = [
    `[\uAD00\uACC4] ${relationType} (\uBCF8\uC778: ${aName} / \uC0C1\uB300: ${bName})`,
    `[\uBCF8\uC778 \uBA85\uC2DD\uD45C]
${aResult.text.trim()}`,
    `[\uC0C1\uB300 \uBA85\uC2DD\uD45C]
${bResult.text.trim()}`,
    \uAD81\uD569\uD14D\uC2A4\uD2B8\uBE14\uB85D(cross)
  ];
  if (concern) parts.push(`[\uACE0\uBBFC]
${concern}`);
  const text = parts.join("\n\n") + "\n";
  const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const buildHtml = (variant) => {
    const aHtml = variant === "color" ? aResult.colorHtml : aResult.pdfHtml;
    const bHtml = variant === "color" ? bResult.colorHtml : bResult.pdfHtml;
    return `<div class="gunghap-relation-label">[\uAD00\uACC4] ${esc(relationType)} (\uBCF8\uC778: ${esc(aName)} / \uC0C1\uB300: ${esc(bName)})</div>` + aHtml + bHtml + // 각자의 pdf-card 안에 이미 "본인:"/"상대방:" 헤더가 포함되어 있어 별도 라벨이 필요 없다.
    `<div class="gunghap-person-label">\uAD81\uD569 \uAD00\uACC4 \uBD84\uC11D</div>${\uAD81\uD569\uD45CHTML(cross)}`;
  };
  return { text, pdfHtml: buildHtml("pdf"), colorHtml: buildHtml("color"), \uC2DC\uAC01\uBCF4\uC815: { a: aResult.raw.\uC2DC\uAC01\uBCF4\uC815, b: bResult.raw.\uC2DC\uAC01\uBCF4\uC815 } };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HIDDEN_STEMS_TABLE,
  \uACA9\uAD6D\uAE30\uC900,
  \uACA9\uAD6D\uD310\uC815,
  \uAD81\uD569\uBD84\uC11D,
  \uBA85\uC2DD\uD45C,
  \uBA85\uC2DD\uD45C\uC0C1\uC138,
  \uC2DC\uAC01\uBCF4\uC815\uD50C\uB798\uADF8,
  \uC870\uD6C4\uC6A9\uC2E0\uACC4\uC0B0,
  \uC9C0\uC7A5\uAC04\uC2ED\uC131\uBAA9\uB85D
});
