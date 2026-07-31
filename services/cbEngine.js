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

// src/engine.ts
var engine_exports = {};
__export(engine_exports, {
  HIDDEN_STEMS_TABLE: () => HIDDEN_STEMS_TABLE,
  \uACA9\uAD6D\uD310\uC815: () => \uACA9\uAD6D\uD310\uC815,
  \uAD81\uD569\uBD84\uC11D: () => \uAD81\uD569\uBD84\uC11D,
  \uBA85\uC2DD\uD45C: () => \uBA85\uC2DD\uD45C,
  \uBA85\uC2DD\uD45C\uC0C1\uC138: () => \uBA85\uC2DD\uD45C\uC0C1\uC138,
  \uC870\uD6C4\uC6A9\uC2E0\uACC4\uC0B0: () => \uC870\uD6C4\uC6A9\uC2E0\uACC4\uC0B0,
  \uC9C0\uC7A5\uAC04\uC2ED\uC131\uBAA9\uB85D: () => \uC9C0\uC7A5\uAC04\uC2ED\uC131\uBAA9\uB85D
});
module.exports = __toCommonJS(engine_exports);
var import_manseryeok = require("manseryeok");
var import_ssaju = require("ssaju");
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
function \uACA9\uAD6D\uD310\uC815(dayStemHanja, monthBranch, exposedStemsKo) {
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
  const name = tg === "\uBE44\uACAC" ? "\uAC74\uB85D\uACA9" : tg === "\uAC81\uC7AC" ? "\uC591\uC778\uACA9" : `${tg}\uACA9`;
  const basis = `\uC6D4\uC9C0 ${monthBranch} ${HIDDEN_SLOT_LABEL[picked.slot]} ${charKo} ${\uD22C\uCD9C\uB428 ? "\uD22C\uCD9C" : "\uAE30\uC900"}`;
  return { name, basis };
}
var STEM_ELEM_KO = { \uAC11: "\uBAA9", \uC744: "\uBAA9", \uBCD1: "\uD654", \uC815: "\uD654", \uBB34: "\uD1A0", \uAE30: "\uD1A0", \uACBD: "\uAE08", \uC2E0: "\uAE08", \uC784: "\uC218", \uACC4: "\uC218" };
var INSEONG_OF = { \uBAA9: "\uC218", \uD654: "\uBAA9", \uD1A0: "\uD654", \uAE08: "\uD1A0", \uC218: "\uAE08" };
function \uC2E0\uAC15\uC57D\uACC4\uC0B0(pillars, hourUnknown = false) {
  const dayElement = STEM_ELEM_KO[pillars.day[0]];
  const insEl = INSEONG_OF[dayElement];
  const isFriendly = (stemKo) => !!stemKo && (STEM_ELEM_KO[stemKo] === dayElement || STEM_ELEM_KO[stemKo] === insEl);
  const hidden = (branch) => HIDDEN_STEMS_TABLE[branch];
  let score = 0;
  const deukryeong = isFriendly(hidden(pillars.month[1]).\uC815\uAE30);
  if (deukryeong) score += 40;
  const deukji = isFriendly(hidden(pillars.day[1]).\uC815\uAE30);
  if (deukji) score += 15;
  if (isFriendly(hidden(pillars.year[1]).\uC815\uAE30)) score += 10;
  if (!hourUnknown && isFriendly(hidden(pillars.hour[1]).\uC815\uAE30)) score += 10;
  const \uCC9C\uAC04\uD6C4\uBCF4 = hourUnknown ? [pillars.year[0], pillars.month[0]] : [pillars.year[0], pillars.month[0], pillars.hour[0]];
  let \uC138count = 0;
  \uCC9C\uAC04\uD6C4\uBCF4.forEach((stemKo) => {
    if (isFriendly(stemKo)) {
      score += 8;
      \uC138count++;
    }
  });
  const \uD1B5\uADFC\uB300\uC0C1 = hourUnknown ? [pillars.year, pillars.month, pillars.day] : [pillars.year, pillars.month, pillars.day, pillars.hour];
  \uD1B5\uADFC\uB300\uC0C1.forEach((gz) => {
    const hs = hidden(gz[1]);
    if (isFriendly(hs.\uC911\uAE30)) score += 3;
    if (isFriendly(hs.\uC5EC\uAE30)) score += 3;
  });
  let grade = score >= 88 ? "\uADF9\uC2E0\uAC15" : score >= 63 ? "\uC2E0\uAC15" : score >= 53 ? "\uC911\uAC15" : score >= 43 ? "\uC911\uD654" : score >= 30 ? "\uC911\uC57D" : score >= 15 ? "\uC2E0\uC57D" : "\uADF9\uC2E0\uC57D";
  let \uBCF4\uC815 = null;
  const \uAC15\uD55C\uCABD = ["\uADF9\uC2E0\uAC15", "\uC2E0\uAC15", "\uC911\uAC15"];
  const \uC57D\uD55C\uCABD = ["\uC911\uC57D", "\uC2E0\uC57D", "\uADF9\uC2E0\uC57D"];
  const \uC801\uAD70\uC624\uD589 = /* @__PURE__ */ new Set([SAENG[dayElement], GEUK[dayElement], GEUK_INV[dayElement]]);
  const \uCEA1\uC9C0\uC9C0 = new Set(\uD1B5\uADFC\uB300\uC0C1.map((gz) => gz[1]));
  const \uC801\uAD70\uBC29\uD569\uC0BC\uD569\uC644\uC131 = [...SAMHAP_GROUPS, ...BANGHAP_GROUPS].some((g) => {
    const el = g.element ?? g.label.slice(-1);
    return \uC801\uAD70\uC624\uD589.has(el) && g.order.every((b) => \uCEA1\uC9C0\uC9C0.has(b));
  });
  if (deukryeong && !deukji && \uAC15\uD55C\uCABD.includes(grade) && (\uC138count <= 1 || \uC801\uAD70\uBC29\uD569\uC0BC\uD569\uC644\uC131)) {
    grade = "\uC911\uD654";
    \uBCF4\uC815 = "\uAC15\uBCC0\uC57D";
  } else if (!deukryeong) {
    let \uD1B5\uADFC\uBE0C\uB79C\uCE58\uC218 = 0;
    \uD1B5\uADFC\uB300\uC0C1.forEach((gz) => {
      const hs = hidden(gz[1]);
      if (isFriendly(hs.\uC5EC\uAE30) || isFriendly(hs.\uC911\uAE30) || isFriendly(hs.\uC815\uAE30)) \uD1B5\uADFC\uBE0C\uB79C\uCE58\uC218++;
    });
    if (\uD1B5\uADFC\uBE0C\uB79C\uCE58\uC218 >= 3 && \uC57D\uD55C\uCABD.includes(grade)) {
      grade = "\uC911\uD654";
      \uBCF4\uC815 = "\uC57D\uBCC0\uAC15";
    }
  }
  const bo = (b) => b ? "O" : "X";
  const \uB4DD\uC138\uB77C\uBCA8 = \uC138count === \uCC9C\uAC04\uD6C4\uBCF4.length ? "O" : \uC138count === 0 ? "X" : "\u25B3";
  const gradeLabel = (\uBCF4\uC815 ? `${grade}(${\uBCF4\uC815})` : grade) + (hourUnknown ? " (\uC2DC\uC8FC \uC81C\uC678 \uAE30\uC900)" : "");
  return { score, grade, gradeLabel, \uB4DD\uB839\uB77C\uBCA8: bo(deukryeong), \uB4DD\uC9C0\uB77C\uBCA8: bo(deukji), \uB4DD\uC138\uB77C\uBCA8 };
}
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
var GEUK_INV = { \uD1A0: "\uBAA9", \uAE08: "\uD654", \uC218: "\uD1A0", \uBAA9: "\uAE08", \uD654: "\uC218" };
var \uC624\uD589\uC21C\uC11C = ["\uBAA9", "\uD654", "\uD1A0", "\uAE08", "\uC218"];
var \uAC15\uD55C\uB4F1\uAE09 = /* @__PURE__ */ new Set(["\uADF9\uC2E0\uAC15", "\uC2E0\uAC15", "\uC911\uAC15"]);
function \uC5B5\uBD80\uC6A9\uC2E0\uACC4\uC0B0(grade, tg, dayElement, hourUnknown = false) {
  const values = hourUnknown ? [tg.year.stem, tg.year.branch, tg.month.stem, tg.month.branch, tg.day.branch] : [tg.year.stem, tg.year.branch, tg.month.stem, tg.month.branch, tg.day.branch, tg.hour.stem, tg.hour.branch];
  const count = { \uC778\uC131: 0, \uBE44\uAC81: 0, \uC2DD\uC0C1: 0, \uC7AC\uC131: 0, \uAD00\uC131: 0 };
  values.forEach((v) => {
    const g = TEN_GOD_GROUP[v];
    if (g) count[g]++;
  });
  let \uC6A9\uC2E0, \uD76C\uC2E0;
  if (\uAC15\uD55C\uB4F1\uAE09.has(grade)) {
    \uC6A9\uC2E0 = count.\uC778\uC131 > count.\uBE44\uAC81 ? GEUK[dayElement] : GEUK_INV[dayElement];
    \uD76C\uC2E0 = INSEONG_OF[\uC6A9\uC2E0];
  } else {
    \uC6A9\uC2E0 = dayElement;
    \uD76C\uC2E0 = INSEONG_OF[dayElement];
  }
  const \uAE30\uC2E0 = GEUK_INV[\uC6A9\uC2E0];
  const \uAD6C\uC2E0 = INSEONG_OF[\uAE30\uC2E0];
  const \uD55C\uC2E0 = \uC624\uD589\uC21C\uC11C.find((el) => ![\uC6A9\uC2E0, \uD76C\uC2E0, \uAE30\uC2E0, \uAD6C\uC2E0].includes(el));
  return { \uC6A9\uC2E0, \uD76C\uC2E0, \uAE30\uC2E0, \uAD6C\uC2E0, \uD55C\uC2E0 };
}
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
function \uC9C0\uC9C0\uB2E8\uC21C\uC815\uADDC\uD654(map, name, a, b) {
  const found = map[pairKey(a, b)];
  if (found) return found;
  console.warn(`[\uD615\uCDA9\uD68C\uD569 \uC815\uADDC\uD654] \uC0AC\uC804\uC5D0 \uC5C6\uB294 ${name} \uC870\uD569: ${a}${b}`);
  return `${a}${b}${name}`;
}
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
[["\uC778", "\uC0AC"], ["\uC0AC", "\uC2E0"], ["\uCD95", "\uC220"], ["\uC220", "\uBBF8"], ["\uC790", "\uBB18"]].forEach(([a, b]) => {
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
function \uC138\uC6B41\uB144(bySsaju, unseongMap, dayStemHanja, gender, dayBoundary, year, curY) {
  const found = bySsaju.get(year);
  if (found) return { year, ganzhi: k(found.ganzhi), tgStem: found.tenGodStem, tgBranch: found.tenGodBranch, stage12: found.stage12, isCurrent: year === curY };
  const p = (0, import_manseryeok.calculateFourPillars)({ year, month: 7, day: 1, hour: 12, minute: 0, isLunar: false, gender, dayBoundary }).toObject();
  const ganzhiKo = p.year;
  const stemH = STEM_K2H[ganzhiKo[0]], branchH = BRANCH_K2H[ganzhiKo[1]];
  return { year, ganzhi: ganzhiKo, tgStem: tenGod(dayStemHanja, stemH), tgBranch: tenGod(dayStemHanja, BRANCH_MAIN[branchH]), stage12: unseongMap[ganzhiKo[1]], isCurrent: year === curY };
}
function \uC138\uC6B4\uACC4\uC0B0(s, dayStemHanja, dayStemKo, gender, dayBoundary, startYear, \uB144\uC218) {
  const bySsaju = /* @__PURE__ */ new Map();
  (s.seyun || []).forEach((y) => bySsaju.set(y.year, y));
  const unseongMap = \uC2ED\uC774\uC6B4\uC131\uB9F5(dayStemKo);
  const rows = [];
  for (let i = 0; i < \uB144\uC218; i++) {
    const row = \uC138\uC6B41\uB144(bySsaju, unseongMap, dayStemHanja, gender, dayBoundary, startYear + i, startYear);
    rows.push(`  ${row.year}\uB144 ${row.ganzhi} (${row.tgStem}/${row.tgBranch}, ${row.stage12})${row.isCurrent ? " \u2190 \uC62C\uD574" : ""}`);
  }
  return { text: rows.join("\n"), endYear: startYear + \uB144\uC218 - 1 };
}
function \uC138\uC6B4\uD45C\uB370\uC774\uD130(s, dayStemHanja, dayStemKo, gender, dayBoundary, startYear) {
  const bySsaju = /* @__PURE__ */ new Map();
  (s.seyun || []).forEach((y) => bySsaju.set(y.year, y));
  const unseongMap = \uC2ED\uC774\uC6B4\uC131\uB9F5(dayStemKo);
  const rows = [];
  for (let i = 0; i < 5; i++) rows.push(\uC138\uC6B41\uB144(bySsaju, unseongMap, dayStemHanja, gender, dayBoundary, startYear + i, startYear));
  return rows;
}
function \uB9CC\uB098\uC774\uACC4\uC0B0(birthSolar, now) {
  let age = now.getFullYear() - birthSolar.year;
  const beforeBirthday = now.getMonth() + 1 < birthSolar.month || now.getMonth() + 1 === birthSolar.month && now.getDate() < birthSolar.day;
  if (beforeBirthday) age--;
  return age;
}
function \uCD9C\uC0DD\uC9C0\uBCF4\uC815\uC801\uC6A9(info) {
  if (typeof info.correctionMinutes !== "number" || info.correctionMinutes === 0) return info;
  const solar = info.isLunar ? (0, import_manseryeok.lunarToSolar)(info.year, info.month, info.day, info.isLeapMonth) : { year: info.year, month: info.month, day: info.day };
  const d = new Date(Date.UTC(solar.year, solar.month - 1, solar.day, info.hour, info.minute, 0));
  d.setUTCMinutes(d.getUTCMinutes() + info.correctionMinutes);
  return {
    ...info,
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
    hour: d.getUTCHours(),
    minute: d.getUTCMinutes(),
    isLunar: false,
    isLeapMonth: false
  };
}
function ssaju\uC785\uB825\uBCF4\uC815(info, dayBoundary) {
  if (dayBoundary === "jasi" && info.hour === 23) {
    const solar = info.isLunar ? (0, import_manseryeok.lunarToSolar)(info.year, info.month, info.day, info.isLeapMonth) : { year: info.year, month: info.month, day: info.day };
    const d = new Date(Date.UTC(solar.year, solar.month - 1, solar.day));
    d.setUTCDate(d.getUTCDate() + 1);
    return {
      year: d.getUTCFullYear(),
      month: d.getUTCMonth() + 1,
      day: d.getUTCDate(),
      hour: info.hour - 23,
      minute: info.minute,
      calendar: "solar",
      leap: false
    };
  }
  return {
    year: info.year,
    month: info.month,
    day: info.day,
    hour: info.hour,
    minute: info.minute,
    calendar: info.isLunar ? "lunar" : "solar",
    leap: !!info.isLeapMonth
  };
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
  const eokbuLine = `\uC6A9\uC2E0 ${elNameSpan(p.eokbu.\uC6A9\uC2E0, esc)} \xB7 \uD76C\uC2E0 ${elNameSpan(p.eokbu.\uD76C\uC2E0, esc)} (\uAE30\uC2E0 ${elNameSpan(p.eokbu.\uAE30\uC2E0, esc)} \xB7 \uAD6C\uC2E0 ${elNameSpan(p.eokbu.\uAD6C\uC2E0, esc)} \xB7 \uD55C\uC2E0 ${elNameSpan(p.eokbu.\uD55C\uC2E0, esc)})`;
  const sgyTable = `<table class="pdf-table pdf-sgy"><tbody><tr>${rowLabel("\uACA9\uAD6D")}<td>${esc(p.gyeokName)}</td></tr><tr>${rowLabel("\uC2E0\uAC15\uC57D")}<td>${esc(p.sgyGradeLabel)}</td></tr><tr>${rowLabel("\uC5B5\uBD80\uC6A9\uC2E0")}<td>${eokbuLine}</td></tr><tr>${rowLabel("\uC870\uD6C4\uC6A9\uC2E0")}<td>${esc(p.johuLine)}</td></tr></tbody></table>`;
  return `<div class="pdf-card${p.variantClass}">${p.headerHtml}${wongukTable}${sgyTable}${daeunTable}${seyunTable}${wolunTable}</div>`;
}
function _\uBA85\uC2DD\uD45C\uC0DD\uC131(info, dayBoundary, \uC57C\uC790\uB77C\uBCA8, opts = {}) {
  const now = opts.now ?? /* @__PURE__ */ new Date();
  const hourUnknown = !!info.hourUnknown;
  const ganjiMode = !!info.ganjiSelect;
  const correctionActive = !hourUnknown && !ganjiMode && typeof info.correctionMinutes === "number" && info.correctionMinutes !== 0;
  const correctedInfo = correctionActive ? \uCD9C\uC0DD\uC9C0\uBCF4\uC815\uC801\uC6A9(info) : info;
  const effectiveInfo = hourUnknown ? { ...correctedInfo, hour: 12, minute: 0 } : correctedInfo;
  const m = (0, import_manseryeok.calculateFourPillars)({ ...effectiveInfo, dayBoundary }).toObject();
  const ssajuIn = ssaju\uC785\uB825\uBCF4\uC815(effectiveInfo, dayBoundary);
  const s = (0, import_ssaju.calculateSaju)({
    year: ssajuIn.year,
    month: ssajuIn.month,
    day: ssajuIn.day,
    hour: ssajuIn.hour,
    minute: ssajuIn.minute,
    gender: info.gender === "female" ? "\uC5EC" : "\uB0A8",
    calendar: ssajuIn.calendar,
    leap: ssajuIn.leap
  });
  const br = s.branchRelations;
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
  const \uBCF4\uC815Text = correctionActive ? ` (\uC9C0\uC5ED\uC2DC ${(info.birthRegionLabel || "").trim() ? `${info.birthRegionLabel.trim()} ` : "\uBCF4\uC815 "}${info.correctionMinutes > 0 ? "+" : ""}${info.correctionMinutes}\uBD84 \u2192 ${String(correctedInfo.hour).padStart(2, "0")}:${String(correctedInfo.minute).padStart(2, "0")} \uAE30\uC900)` : "";
  head += `\uAE30\uBCF8\uC815\uBCF4: ${info.isLunar ? "\uC74C\uB825" : "\uC591\uB825"} ${info.year}\uB144 ${info.month}\uC6D4 ${info.day}\uC77C ${timeText}${\uBCF4\uC815Text}, ${info.gender === "female" ? "\uC5EC\uC131" : "\uB0A8\uC131"}${jasiText}, \uC77C\uAC04(\uB098): ${m.day[0]}`;
  if (hourUnknown) head += `
(\uCD9C\uC0DD\uC2DC\uAC01 \uBBF8\uC0C1 \u2014 \uC2DC\uC8FC \uC81C\uC678)`;
  blocks.push(head);
  const genderText = info.gender === "female" ? "\uC5EC\uC131" : "\uB0A8\uC131";
  const pdf\uC790\uC2DCSuffix = hourUnknown ? "" : ` \xB7 \uC790\uC2DC ${\uC57C\uC790\uB77C\uBCA8}`;
  const pdf\uBCF4\uC815Suffix = correctionActive ? ` \xB7 \uC9C0\uC5ED\uC2DC ${(info.birthRegionLabel || "").trim() || "\uBCF4\uC815"} ${info.correctionMinutes > 0 ? "+" : ""}${info.correctionMinutes}\uBD84 \uC801\uC6A9` : "";
  const pdfInfoLine = `${info.isLunar ? "\uC74C\uB825" : "\uC591\uB825"} ${info.year}\uB144 ${info.month}\uC6D4 ${info.day}\uC77C ${timeText} \xB7 ${genderText}${pdf\uC790\uC2DCSuffix}${pdf\uBCF4\uC815Suffix}`;
  const headerLabel = opts.headerLabel || "\uB0B4\uB2F4\uC790";
  const variantClass = opts.personVariant === "a" ? " pdf-card-a" : opts.personVariant === "b" ? " pdf-card-b" : "";
  const headerEsc = (s2) => String(s2 ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const pdfHeaderHtml = PDF\uD5E4\uB354HTML(headerLabel, name, pdfInfoLine, headerEsc);
  blocks.push(`[\uC6D0\uAD6D]
${\uC6D0\uAD6D\uB77C\uC778\uD14D\uC2A4\uD2B8(m, dayStemHanja, tgSelf, unseong, yearSal, daySal, \uD2B9\uC218\uC2E0\uC0B4\uACB0\uACFC.byPillar, hourUnknown)}`);
  const fe = \uC624\uD589\uBD84\uD3EC\uACC4\uC0B0(hourUnknown ? [m.year, m.month, m.day] : [m.year, m.month, m.day, m.hour]);
  blocks.push(`[\uC624\uD589\uBD84\uD3EC] \uBAA9 ${fe.\uBAA9} \uD654 ${fe.\uD654} \uD1A0 ${fe.\uD1A0} \uAE08 ${fe.\uAE08} \uC218 ${fe.\uC218}`);
  const \uACA9\uAD6D\uD22C\uCD9C\uD6C4\uBCF4 = hourUnknown ? [m.year[0], m.month[0]] : [m.year[0], m.month[0], m.hour[0]];
  const gyeok = \uACA9\uAD6D\uD310\uC815(dayStemHanja, m.month[1], \uACA9\uAD6D\uD22C\uCD9C\uD6C4\uBCF4);
  const sgy = \uC2E0\uAC15\uC57D\uACC4\uC0B0({ year: m.year, month: m.month, day: m.day, hour: m.hour }, hourUnknown);
  const johu = \uC870\uD6C4\uC6A9\uC2E0\uACC4\uC0B0(m.month[1], m.day[0]);
  const johuText = johu.\uBCF4\uC870\uC6A9\uC2E0.length ? `${johu.\uC8FC\uC6A9\uC2E0} (\uBCF4\uC870: ${johu.\uBCF4\uC870\uC6A9\uC2E0.join(", ")})` : johu.\uC8FC\uC6A9\uC2E0;
  const eokbu = \uC5B5\uBD80\uC6A9\uC2E0\uACC4\uC0B0(sgy.grade, tgSelf, STEM_ELEM_KO[m.day[0]], hourUnknown);
  const eokbuText = `\uC6A9\uC2E0 ${eokbu.\uC6A9\uC2E0} / \uD76C\uC2E0 ${eokbu.\uD76C\uC2E0} / \uAE30\uC2E0 ${eokbu.\uAE30\uC2E0} / \uAD6C\uC2E0 ${eokbu.\uAD6C\uC2E0} / \uD55C\uC2E0 ${eokbu.\uD55C\uC2E0}`;
  blocks.push(
    `[\uACA9\uAD6D] ${gyeok.name} (${gyeok.basis})
[\uC2E0\uAC15\uC57D] ${sgy.gradeLabel} (\uB4DD\uB839${sgy.\uB4DD\uB839\uB77C\uBCA8} \uB4DD\uC9C0${sgy.\uB4DD\uC9C0\uB77C\uBCA8} \uB4DD\uC138${sgy.\uB4DD\uC138\uB77C\uBCA8}, \uC810\uC218 ${sgy.score})
[\uC5B5\uBD80\uC6A9\uC2E0] ${eokbuText}
[\uC870\uD6C4\uC6A9\uC2E0] ${johuText}`
  );
  const \uBD84\uB958\uB41C\uC2E0\uC0B4\uC774\uB984 = new Set(Object.values(\uD2B9\uC218\uC2E0\uC0B4\uACB0\uACFC.byPillar).flat());
  const \uAE30\uD0C0\uC2E0\uC0B4 = [...new Set(\uD2B9\uC218\uC2E0\uC0B4\uACB0\uACFC.list.map((entry) => entry.replace(/\(.*\)$/, "")).filter((name2) => !\uBD84\uB958\uB41C\uC2E0\uC0B4\uC774\uB984.has(name2)))];
  if (\uAE30\uD0C0\uC2E0\uC0B4.length) blocks.push(`[\uC2E0\uC0B4\xB7\uADC0\uC778 \uAE30\uD0C0] ${\uAE30\uD0C0\uC2E0\uC0B4.join(", ")}`);
  const [\uACF5\uB9DD\uB1441, \uACF5\uB9DD\uB1442] = \uACF5\uB9DD\uACC4\uC0B0(m.year);
  const [\uACF5\uB9DD\uC77C1, \uACF5\uB9DD\uC77C2] = \uACF5\uB9DD\uACC4\uC0B0(m.day);
  blocks.push(`[\uACF5\uB9DD] \uB144\uC8FC\uAE30\uC900: ${\uACF5\uB9DD\uB1441}, ${\uACF5\uB9DD\uB1442} / \uC77C\uC8FC\uAE30\uC900: ${\uACF5\uB9DD\uC77C1}, ${\uACF5\uB9DD\uC77C2}`);
  const flat = (obj) => {
    const set = /* @__PURE__ */ new Set();
    Object.values(obj || {}).forEach((v) => {
      if (v) String(v).split(",").forEach((x) => set.add(k(x.trim())));
    });
    return [...set];
  };
  const leadChars = (phrase) => phrase.split(" ")[0].split("");
  const \uCC9C\uAC04\uACB0\uACFC = /* @__PURE__ */ new Set();
  (s.stemRelations || []).forEach((r) => {
    const [a, b] = leadChars(k(r.desc));
    \uCC9C\uAC04\uACB0\uACFC.add(\uCC9C\uAC04\uAD00\uACC4\uC815\uADDC\uD654(r.type, a, b));
  });
  const \uC721\uD569\uACB0\uACFC = /* @__PURE__ */ new Set();
  flat(br.\uC721\uD569).forEach((phrase) => {
    const [a, b] = leadChars(phrase);
    \uC721\uD569\uACB0\uACFC.add(\uC9C0\uC9C0\uB2E8\uC21C\uC815\uADDC\uD654(JIJI_YUKHAP_MAP, "\uD569", a, b));
  });
  const \uC0BC\uD569\uACB0\uACFC = /* @__PURE__ */ new Set();
  flat(br.\uC0BC\uD569).forEach((phrase) => \uC0BC\uD569\uACB0\uACFC.add(\uC0BC\uD569\uC815\uADDC\uD654(leadChars(phrase))));
  flat(br.\uBC18\uD569).forEach((phrase) => \uC0BC\uD569\uACB0\uACFC.add(\uC0BC\uD569\uC815\uADDC\uD654(leadChars(phrase))));
  const \uBC29\uD569\uACB0\uACFC = /* @__PURE__ */ new Set();
  flat(br.\uBC29\uD569).forEach((phrase) => \uBC29\uD569\uACB0\uACFC.add(\uBC29\uD569\uC815\uADDC\uD654(leadChars(phrase))));
  const \uCDA9\uACB0\uACFC = /* @__PURE__ */ new Set();
  flat(br.\uCDA9).forEach((phrase) => {
    const [a, b] = leadChars(phrase);
    \uCDA9\uACB0\uACFC.add(\uC9C0\uC9C0\uB2E8\uC21C\uC815\uADDC\uD654(JIJI_CHUNG_MAP, "\uCDA9", a, b));
  });
  const \uD30C\uACB0\uACFC = /* @__PURE__ */ new Set();
  flat(br.\uD30C).forEach((phrase) => {
    const [a, b] = leadChars(phrase);
    \uD30C\uACB0\uACFC.add(\uC9C0\uC9C0\uB2E8\uC21C\uC815\uADDC\uD654(JIJI_PA_MAP, "\uD30C", a, b));
  });
  const \uD574\uACB0\uACFC = /* @__PURE__ */ new Set();
  flat(br.\uD574).forEach((phrase) => {
    const [a, b] = leadChars(phrase);
    \uD574\uACB0\uACFC.add(\uC9C0\uC9C0\uB2E8\uC21C\uC815\uADDC\uD654(JIJI_HAE_MAP, "\uD574", a, b));
  });
  const \uD615\uACB0\uACFC = \uD615\uC815\uADDC\uD654(flat(br.\uD615).map((phrase) => phrase.split(" ")[0]));
  const \uC6D0\uC9C4\uACB0\uACFC = flat(br.\uC6D0\uC9C4);
  const \uADC0\uBB38\uACB0\uACFC = flat(br.\uADC0\uBB38);
  const \uD569\uC804\uCCB4 = [...\uC721\uD569\uACB0\uACFC, ...\uC0BC\uD569\uACB0\uACFC, ...\uBC29\uD569\uACB0\uACFC];
  const \uCDA9\uD615\uD30C\uD574\uC804\uCCB4 = [...\uCDA9\uACB0\uACFC, ...\uD615\uACB0\uACFC, ...\uD30C\uACB0\uACFC, ...\uD574\uACB0\uACFC, ...\uC6D0\uC9C4\uACB0\uACFC, ...\uADC0\uBB38\uACB0\uACFC];
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
  const daeunList = s.daeun.list || [];
  let curDaeunIdx = 0;
  daeunList.forEach((d, i) => {
    if (d.startAge <= manAge) curDaeunIdx = i;
  });
  let dae = `[\uB300\uC6B4] \uB300\uC6B4\uC218 ${s.daeun.startAge}, ${s.daeun.basis.direction === "forward" ? "\uC21C\uD589" : "\uC5ED\uD589"}`;
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
  const seRes = \uC138\uC6B4\uACC4\uC0B0(s, dayStemHanja, m.day[0], info.gender, dayBoundary, thisYear, \uC138\uC6B4\uB144\uC218);
  blocks.push(`[\uC138\uC6B4] (${thisYear}~${seRes.endYear})
${seRes.text}`);
  const seyunPdfRows = \uC138\uC6B4\uD45C\uB370\uC774\uD130(s, dayStemHanja, m.day[0], info.gender, dayBoundary, thisYear);
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
    sgyGradeLabel: sgy.gradeLabel,
    eokbu,
    johuLine: johuText,
    \uACF5\uB9DD\uB144: [\uACF5\uB9DD\uB1441, \uACF5\uB9DD\uB1442],
    \uACF5\uB9DD\uC77C: [\uACF5\uB9DD\uC77C1, \uACF5\uB9DD\uC77C2],
    headerHtml: pdfHeaderHtml,
    variantClass
  };
  const pdfHtml = PDF\uD45CHTML(pdfTableParams, "pdf");
  const colorHtml = PDF\uD45CHTML(pdfTableParams, "color");
  const raw = {
    m: { hour: m.hour, day: m.day, month: m.month, year: m.year },
    hourUnknown,
    eokbu
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
  return { text, pdfHtml: buildHtml("pdf"), colorHtml: buildHtml("color") };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HIDDEN_STEMS_TABLE,
  \uACA9\uAD6D\uD310\uC815,
  \uAD81\uD569\uBD84\uC11D,
  \uBA85\uC2DD\uD45C,
  \uBA85\uC2DD\uD45C\uC0C1\uC138,
  \uC870\uD6C4\uC6A9\uC2E0\uACC4\uC0B0,
  \uC9C0\uC7A5\uAC04\uC2ED\uC131\uBAA9\uB85D
});
