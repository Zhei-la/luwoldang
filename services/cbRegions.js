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

// src/regions.ts
var regions_exports = {};
__export(regions_exports, {
  REGIONS: () => REGIONS,
  searchRegions: () => searchRegions
});
module.exports = __toCommonJS(regions_exports);
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
function searchRegions(query, limit = 20) {
  const q = query.trim();
  if (!q) return [];
  return REGIONS.filter((r) => r.name.includes(q)).slice(0, limit);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  REGIONS,
  searchRegions
});
