/* ============================================================
 * 만세력 운영 코드 전수 점검 —  node scripts/manse-audit.js
 *
 * 운영에서 실제로 도는 파일을 그대로 불러 확인한다.
 *   묶음 엔진  services/cbEngine.js (만세력 계산기·신청자 상세·PDF) · services/cbFortune.js (공개 만세력·통합 사이트)
 *   호출부    services/manseryeok.js(calcSaju) · manseCalc.js · dstCorrection.js · 공개 만세력 풀이 msiteReading.js
 *
 *   ① 독립 계산기(lunar-javascript)와 네 기둥 대조 — 지역시·서머타임·127.5도·절입·입춘·자정·자시·시진 경계
 *   ② 12운성 120칸 기준표 대조 — 네 기둥 자리 모두, 대운·세운 포함
 *   ③ 호출부가 보정을 두 번 하지 않는지 — 신청자 상세·PDF 계산(calcSaju) = 만세력 계산기 엔진, 음력은 한국천문연구원
 *   ④ 공개 만세력 풀이 문장이 계산 결과와 어긋나지 않는지
 *
 * 엔진 규칙 원본(신강약↔용신 연동·격국 기준·대운·형충회합)은 만세력 계산기(cb_saju) 폴더의 npm run audit 가 점검한다.
 * 고정값 한 건을 맞추는 시험이 아니라 무작위 날짜·시각·지역을 되풀이한다. 하나라도 어긋나면 종료 코드 1.
 * ============================================================ */

'use strict';

console.warn = () => {};
const { Solar, Lunar } = require('lunar-javascript');
const { lunarToSolar } = require('manseryeok');
const eng = require('../services/cbEngine');
const fort = require('../services/cbFortune');
const ms = require('../services/manseryeok');
const manseCalc = require('../services/manseCalc');
const dstCorrection = require('../services/dstCorrection');
const mreading = require('../services/msiteReading');
const { REGIONS } = require('../services/cbRegions');

const now = new Date(2026, 8, 15, 12);
let seed = 915;
const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
const pad = (n) => String(n).padStart(2, '0');
const BR = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
const ST = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
const H2K = { 甲: '갑', 乙: '을', 丙: '병', 丁: '정', 戊: '무', 己: '기', 庚: '경', 辛: '신', 壬: '임', 癸: '계', 子: '자', 丑: '축', 寅: '인', 卯: '묘', 辰: '진', 巳: '사', 午: '오', 未: '미', 申: '신', 酉: '유', 戌: '술', 亥: '해' };
const k = (s) => String(s).replace(/./g, (c) => H2K[c] || c);

const results = [];
function check(title, fn) {
  const bad = [];
  let n = 0;
  try { n = fn(bad); } catch (e) { bad.push('실행 오류: ' + (e && e.stack || e)); }
  results.push({ title, bad });
  console.log(`${bad.length ? '✗' : '✓'} ${title} — ${n}건${bad.length ? `, 어긋남 ${bad.length}\n    ${bad.slice(0, 5).join('\n    ')}` : ''}`);
}

/* ── 독립 기준 ──
 * 벽시계 + 출생지 경도 → 년·월주는 실제 순간(서머타임·127.5도를 되돌린 한국 표준시 → 북경시 -1시간),
 * 일·시주는 지역시(당시 기준 자오선과 경도 차) 벽시계, 23시부터 다음 날(lunar-javascript sect 1). */
const DST = [['1948-06-01 00:00', '1948-09-13 00:00'], ['1949-04-03 00:00', '1949-09-11 00:00'], ['1950-04-01 00:00', '1950-09-10 00:00'], ['1951-05-06 00:00', '1951-09-09 00:00'], ['1955-05-05 00:00', '1955-09-09 00:00'], ['1956-05-20 00:00', '1956-09-30 00:00'], ['1957-05-05 00:00', '1957-09-22 00:00'], ['1958-05-04 00:00', '1958-09-21 00:00'], ['1959-05-03 00:00', '1959-09-20 00:00'], ['1960-05-01 00:00', '1960-09-18 00:00'], ['1987-05-10 02:00', '1987-10-11 03:00'], ['1988-05-08 02:00', '1988-10-09 03:00']];
const shift = (y, mo, d, h, mi, add) => { const t = new Date(Date.UTC(y, mo - 1, d, h, mi) + add * 60000); return [t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate(), t.getUTCHours(), t.getUTCMinutes()]; };
function oracle(y, mo, d, h, mi, lon) {
  const wall = `${y}-${pad(mo)}-${pad(d)} ${pad(h)}:${pad(mi)}`;
  const isDst = DST.some(([a, b]) => wall >= a && wall < b);
  const ds = wall.slice(0, 10);
  const era = (ds >= '1954-03-21' && ds <= '1961-08-09') || (ds >= '1908-04-01' && ds <= '1911-12-31');
  const std = shift(y, mo, d, h, mi, (isDst ? -60 : 0) + (era ? 30 : 0));
  const local = lon == null ? shift(y, mo, d, h, mi, isDst ? -60 : 0) : shift(y, mo, d, h, mi, (isDst ? -60 : 0) + Math.round((lon - (era ? 127.5 : 135)) * 4));
  const bj = shift(std[0], std[1], std[2], std[3], std[4], -60);
  const ym = Solar.fromYmdHms(bj[0], bj[1], bj[2], bj[3], bj[4], 0).getLunar().getEightChar();
  const dh = Solar.fromYmdHms(local[0], local[1], local[2], local[3], local[4], 0).getLunar().getEightChar();
  dh.setSect(1);
  return { year: k(ym.getYear()), month: k(ym.getMonth()), day: k(dh.getDay()), hour: k(dh.getTime()), isDst, era };
}
const fmt = (o) => `${o.year} ${o.month} ${o.day} ${o.hour}`;
const 엔진 = (e, info) => e.명식표상세(Object.assign({ isLunar: false, isLeapMonth: false, gender: 'male' }, info), 'jasi', '미적용', { now });

/* ── ① 네 기둥 ── */
check('네 기둥 = 독립 계산기 (지역시·서머타임·127.5도 시기 섞음, 만세력 계산기·공개 만세력 묶음 둘 다)', (bad) => {
  let n = 0;
  for (let i = 0; i < 2500; i++) {
    const p = rnd();
    const y = p < 0.25 ? ri(1948, 1961) : p < 0.4 ? ri(1987, 1988) : p < 0.45 ? ri(1908, 1911) : ri(1920, 2045);
    const mo = ri(1, 12), d = ri(1, new Date(y, mo, 0).getDate()), h = ri(0, 23), mi = ri(0, 59);
    const R = REGIONS[ri(0, REGIONS.length - 1)];
    const o = oracle(y, mo, d, h, mi, R.longitude);
    for (const [name, e] of [['cbEngine', eng], ['cbFortune', fort]]) {
      const m = 엔진(e, { year: y, month: mo, day: d, hour: h, minute: mi, correctionMinutes: R.correctionMinutes, birthRegionLabel: R.name }).raw.m;
      n++;
      if (fmt(m) !== fmt(o)) bad.push(`${name} ${y}-${mo}-${d} ${pad(h)}:${pad(mi)} ${R.name}${o.isDst ? ' 서머타임' : ''}${o.era ? ' 127.5도' : ''} → ${fmt(m)} / 기준 ${fmt(o)}`);
    }
  }
  return n;
});

check('절입·입춘 직후 1·15·30분 (지역시 보정이 절입 판정을 밀지 않음)', (bad) => {
  const JIE = ['立春', '惊蛰', '清明', '立夏', '芒种', '小暑', '立秋', '白露', '寒露', '立冬', '大雪', '小寒'];
  let n = 0;
  for (let Y = 1962; Y <= 2040; Y++) {
    const tbl = Lunar.fromYmd(Y, 6, 1).getJieQiTable();
    for (const nm of JIE) {
      const s = tbl[nm];
      if (!s) continue;
      for (const off of [-1, 1, 15, 30]) {
        const t = new Date(Date.UTC(s.getYear(), s.getMonth() - 1, s.getDay(), s.getHour(), s.getMinute()) + 3600000 + off * 60000);
        const [y, mo, d, h, mi] = [t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate(), t.getUTCHours(), t.getUTCMinutes()];
        const o = oracle(y, mo, d, h, mi, 126.978);
        const m = 엔진(eng, { year: y, month: mo, day: d, hour: h, minute: mi, correctionMinutes: -32, birthRegionLabel: '서울특별시' }).raw.m;
        n++;
        if (m.year !== o.year || m.month !== o.month) bad.push(`${nm} ${off > 0 ? '+' : ''}${off}분 ${y}-${mo}-${d} ${pad(h)}:${pad(mi)} → ${m.year} ${m.month} / 기준 ${o.year} ${o.month}`);
      }
    }
  }
  return n;
});

check('자정·23시 자시·시진 경계 (보정 없음 · 서울 -32분)', (bad) => {
  let n = 0;
  for (let i = 0; i < 600; i++) {
    const y = ri(1962, 2040), mo = ri(1, 12), d = ri(1, 28);
    if ((y === 1987 || y === 1988) && mo >= 5 && mo <= 10) continue;
    const odd = ri(1, 10) * 2 - 1;
    for (const [h, mi] of [[22, 59], [23, 0], [23, 31], [23, 32], [23, 59], [0, 0], [0, 32], [odd, 59], [odd + 1, 0]]) {
      for (const [corr, lon, label] of [[0, null, ''], [-32, 126.978, '서울특별시']]) {
        const o = oracle(y, mo, d, h, mi, lon);
        const m = 엔진(eng, { year: y, month: mo, day: d, hour: h, minute: mi, correctionMinutes: corr, birthRegionLabel: label }).raw.m;
        n++;
        if (m.day !== o.day || m.hour !== o.hour) bad.push(`${y}-${mo}-${d} ${pad(h)}:${pad(mi)} 보정 ${corr} → ${m.day} ${m.hour} / 기준 ${o.day} ${o.hour}`);
      }
    }
  }
  return n;
});

/* ── ② 12운성 ── */
const UNSEONG_REF = {
  갑: '목욕 관대 건록 제왕 쇠 병 사 묘 절 태 양 장생', 을: '병 쇠 제왕 건록 관대 목욕 장생 양 태 절 묘 사',
  병: '태 양 장생 목욕 관대 건록 제왕 쇠 병 사 묘 절', 정: '절 묘 사 병 쇠 제왕 건록 관대 목욕 장생 양 태',
  무: '태 양 장생 목욕 관대 건록 제왕 쇠 병 사 묘 절', 기: '절 묘 사 병 쇠 제왕 건록 관대 목욕 장생 양 태',
  경: '사 묘 절 태 양 장생 목욕 관대 건록 제왕 쇠 병', 신: '장생 양 태 절 묘 사 병 쇠 제왕 건록 관대 목욕',
  임: '제왕 쇠 병 사 묘 절 태 양 장생 목욕 관대 건록', 계: '건록 관대 목욕 장생 양 태 절 묘 사 병 쇠 제왕',
};
const 운성 = (s, b) => UNSEONG_REF[s].split(' ')[BR.indexOf(b)];
check('12운성 120칸 = 기준표 (네 기둥 자리·대운·세운·신청자 상세용 unseong())', (bad) => {
  let n = 0;
  for (const [name, e] of [['cbEngine', eng], ['cbFortune', fort]]) {
    const seen = new Set();
    for (let i = 0; i < 700; i++) {
      const r = 엔진(e, { year: ri(1930, 2040), month: ri(1, 12), day: ri(1, 28), hour: ri(0, 23), minute: 30, correctionMinutes: 0 });
      const ds = r.raw.m.day[0];
      for (const p of r.raw.wonguk) { n++; seen.add(ds + p.branchKo); if (p.unseong !== 운성(ds, p.branchKo)) bad.push(`${name} ${p.key}지 ${ds}+${p.branchKo}=${p.unseong}`); }
      for (const x of r.raw.consult.대운목록.concat(r.raw.consult.세운목록)) { n++; if (x.운성 !== 운성(ds, x.간지[1])) bad.push(`${name} 운 ${ds}+${x.간지}=${x.운성}`); }
    }
    if (seen.size < 120) bad.push(`${name}: 확인한 조합 ${seen.size}/120`);
  }
  const HS = { 갑: '甲', 을: '乙', 병: '丙', 정: '丁', 무: '戊', 기: '己', 경: '庚', 신: '辛', 임: '壬', 계: '癸' };
  const HB = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  for (const s of ST) BR.forEach((b, i) => { n++; if (ms.unseong(HS[s], HB[i]) !== 운성(s, b)) bad.push(`unseong() ${s}+${b}`); });
  return n;
});

/* ── ③ 호출부 ── */
check('신청자 상세·PDF(calcSaju) = 만세력 계산기 엔진: 네 기둥 · 적용시각 · 대운 · 음력(한국천문연구원)', (bad) => {
  let n = 0;
  const regions = ['서울', '부산', '광주광역시', '제주', '강원도', '대구광역시'];
  for (let i = 0; i < 1200; i++) {
    const lunar = rnd() < 0.3;
    const p = rnd();
    const y = p < 0.3 ? ri(1948, 1961) : p < 0.45 ? ri(1987, 1988) : ri(1930, 2040);
    const mo = ri(1, 12), d = ri(1, lunar ? 29 : new Date(y, mo, 0).getDate());
    const known = rnd() < 0.9, h = ri(0, 23), mi = ri(0, 59), region = regions[ri(0, regions.length - 1)], gender = rnd() < 0.5 ? '남' : '여';
    let r;
    try { r = ms.calcSaju({ birthDate: `${y}-${pad(mo)}-${pad(d)}`, birthTime: known ? `${pad(h)}:${pad(mi)}` : null, calendar: lunar ? '음력' : '양력', region, gender }); } catch (e) { continue; }
    const s = lunar ? lunarToSolar(y, mo, d, false) : { year: y, month: mo, day: d };
    n++;
    if (r.solarDate !== `${s.year}-${pad(s.month)}-${pad(s.day)}`) { bad.push(`음력 ${y}.${mo}.${d} → ${r.solarDate} / 한국천문연구원 ${s.year}-${s.month}-${s.day}`); continue; }
    const e = 엔진(eng, { year: s.year, month: s.month, day: s.day, hour: known ? h : 12, minute: known ? mi : 0, hourUnknown: !known, gender: gender === '남' ? 'male' : 'female', correctionMinutes: known ? ms.regionMinutes135(region) : 0, birthRegionLabel: region });
    const want = [e.raw.m.year, e.raw.m.month, e.raw.m.day, known ? e.raw.m.hour : null].join(' ');
    const got = [r.pillarsKo.year, r.pillarsKo.month, r.pillarsKo.day, known ? r.pillarsKo.hour : null].join(' ');
    if (got !== want) bad.push(`${y}-${mo}-${d} ${known ? `${pad(h)}:${pad(mi)}` : '시간모름'} ${region} → ${got} / 엔진 ${want}`);
    if (known) {
      const t = (/→ (\d\d:\d\d) 기준/.exec(e.text) || [])[1] || `${pad(h)}:${pad(mi)}`;
      if (r.timeCorrection.correctedTime !== t) bad.push(`${y}-${mo}-${d} ${pad(h)}:${pad(mi)} ${region} 적용시각 ${r.timeCorrection.correctedTime} / 엔진 ${t}`);
    }
    if (r.daewoon) {
      const dw = e.raw.consult;
      if (r.daewoon.startAge !== dw.대운수 || r.daewoon.list[0].ko !== dw.대운목록[0].간지) bad.push(`${y}-${mo}-${d} 대운 ${r.daewoon.startAge}세 ${r.daewoon.list[0].ko} / 엔진 ${dw.대운수}세 ${dw.대운목록[0].간지}`);
    }
  }
  return n;
});

check('보정 사례 — 만세력 계산기·공개 만세력 입력 · PDF 만세력 장(manseCalc) · 신청자 상세(calcSaju)가 같은 값', (bad) => {
  const cases = [
    ['1987-06-21', '06:10', '대구광역시', '04:44', '인'], ['1988-08-15', '16:03', '광주광역시', '14:30', '미'],
    ['1950-07-07', '12:30', '인천광역시', '10:57', '사'], ['1959-06-10', '17:46', '대구광역시', '16:50', '신'],
    ['1955-02-10', '09:10', '대전광역시', '09:10', '사'], ['1909-09-05', '15:05', '서울특별시', '15:03', '신'],
    ['1975-10-20', '11:20', '울산광역시', '10:57', '사'], ['1988-06-15', '14:00', '서울특별시', '12:28', '오'],
  ];
  for (const [date, time, region, wantTime, wantBr] of cases) {
    const [y, mo, d] = date.split('-').map(Number), [h, mi] = time.split(':').map(Number);
    const R = REGIONS.find((x) => x.name === region);
    const 계산기 = 엔진(eng, { year: y, month: mo, day: d, hour: h, minute: mi, correctionMinutes: R.correctionMinutes, birthRegionLabel: region });
    const 공개 = 엔진(fort, { year: y, month: mo, day: d, hour: h, minute: mi, correctionMinutes: R.correctionMinutes, birthRegionLabel: region });
    const pdf = manseCalc.buildMyeongsik({ birthDate: date, birthTime: time, calendar: '양력', gender: '남', region, name: '' });
    const 상세 = ms.calcSaju({ birthDate: date, birthTime: time, region, gender: '남' });
    const 시각 = (t) => (/→ (\d\d:\d\d) 기준/.exec(t) || [])[1] || null;
    const got = [
      ['만세력 계산기', 시각(계산기.text), 계산기.raw.m.hour[1]],
      ['공개 만세력', 시각(공개.text), 공개.raw.m.hour[1]],
      ['PDF 만세력 장', 시각(pdf.text), pdf.raw.m.hour[1]],
      ['신청자 상세', 상세.timeCorrection.correctedTime, 상세.pillarsKo.hour[1]],
    ];
    for (const [where, t, br] of got) if (t !== wantTime || br !== wantBr) bad.push(`${date} ${time} ${region} ${where}: ${t} ${br}시 (기대 ${wantTime} ${wantBr}시)`);
    if (date === '1988-06-15' && 상세.pillarsKo.hour !== '갑오') bad.push(`1988-06-15 14:00 서울 신청자 상세 시주 ${상세.pillarsKo.hour}`);
  }
  const info = { year: 1988, month: 6, day: 15, hour: 14, minute: 0, correctionMinutes: -32, birthRegionLabel: '서울특별시' };
  const x = dstCorrection.서머타임반영(info);
  if (x.info !== info || !x.보정.dst) bad.push('dstCorrection.서머타임반영이 엔진 입력을 바꾸거나 서머타임을 못 알아봄');
  if (!dstCorrection.서머타임안내(x)) bad.push('서머타임 안내 문구가 없음');
  const o = { text: 't' };
  if (dstCorrection.보정문구(o, x) !== o) bad.push('dstCorrection.보정문구가 엔진 글을 바꿈');
  return cases.length * 4 + 3;
});

check('신청자에 저장된 시간 글자 읽기 (시주가 빠지거나 엉뚱한 시로 들어가지 않음)', (bad) => {
  const { parseHour } = require('../services/birth');
  const cases = [
    ['11:00', '11:00'], ['9:05', '09:05'], ['오전 11시', '11:00'], ['오후 2시 30분', '14:30'], ['11시 5분', '11:05'], ['오전 12시', '00:00'],
    ['1100', '11:00'], ['사시 巳 09:30~11:29', '10:30'], ['자시 子 23:30~01:29', '00:30'], ['사시(巳時) 09:30~11:30', '10:30'],
    ['사시', '10:30'], ['巳時', '10:30'], ['모름 / 선택 안함', null], ['', null], ['2500', null], ['아무말', null],
  ];
  for (const [input, want] of cases) { const got = parseHour(input); if (got !== want) bad.push(`${JSON.stringify(input)} → ${got} (기대 ${want})`); }
  const r = ms.calcSaju({ birthDate: '1999-02-21', birthTime: parseHour('오전 11시'), region: '울산', gender: '여' });
  if (r.pillarsKo.hour !== '기사') bad.push(`1999-02-21 「오전 11시」 울산 → 시주 ${r.pillarsKo.hour} (기대 기사)`);
  const e = 엔진(eng, { year: 1999, month: 2, day: 21, hour: 11, minute: 0, gender: 'female', correctionMinutes: -23, birthRegionLabel: '울산광역시' });
  if (/자시/.test(e.text.split('\n')[0])) bad.push('사시 태생 기본정보 줄에 「자시」 글자가 보임');
  return cases.length + 2;
});

check('음력 윤달: 한국천문연구원 기준 (2012년 윤3월 · 2017년 윤5월)', (bad) => {
  let n = 0;
  for (const [y, m, ok] of [[2012, 3, true], [2012, 4, false], [2017, 5, true], [2017, 6, false]]) {
    n++;
    let r = null;
    try { r = ms.calcSaju({ birthDate: `${y}-${pad(m)}-10`, birthTime: '10:00', calendar: '음력', isLeapMonth: true, region: '서울', gender: '여' }); } catch (e) { r = null; }
    if (ok && !r) bad.push(`음력 ${y}년 윤${m}월을 계산하지 못함`);
    if (!ok && r) bad.push(`음력 ${y}년 윤${m}월은 한국 음력에 없는데 계산됨 (${r.solarDate})`);
    if (ok && r) { const s = lunarToSolar(y, m, 10, true); if (r.solarDate !== `${s.year}-${pad(s.month)}-${pad(s.day)}`) bad.push(`음력 ${y}.윤${m}.10 → ${r.solarDate}`); }
  }
  return n;
});

/* ── ④ 공개 만세력 풀이 문장 ── */
check('공개 만세력 풀이 문장이 계산 결과와 어긋나지 않음', (bad) => {
  let n = 0;
  for (let i = 0; i < 1200; i++) {
    const y = ri(1930, 2040), mo = ri(1, 12), d = ri(1, 28), unknown = rnd() < 0.2;
    const r = 엔진(fort, { year: y, month: mo, day: d, hour: ri(0, 23), minute: ri(0, 59), hourUnknown: unknown, correctionMinutes: -32, birthRegionLabel: '서울특별시' });
    const c = r.raw.consult;
    const html = mreading.enrich(c, fort.buildReading(c), r.raw.wonguk).blocks.map((b) => b.html).join(' ') + ' ' + mreading.teaserOf(c);
    const t = html.replace(/<[^>]+>/g, '');
    const g = fort.gradeOf(c.신강약);
    const who = `${y}-${mo}-${d}${unknown ? ' 시간모름' : ''} ${c.신강약}`;
    n++;
    if (g === '중화' && /넉넉하지 않은 사주/.test(t)) bad.push(`${who}: 중화인데 「자기 힘이 넉넉하지 않은 사주」`);
    if (unknown && /여덟 글자/.test(t)) bad.push(`${who}: 여섯 글자인데 「여덟 글자」`);
    if (!unknown && /여섯 글자/.test(t)) bad.push(`${who}: 여덟 글자인데 「여섯 글자」`);
    if (/(목|금)\([木金]\)(가|는|를|와|로) |(화|토|수)\([火土水]\)(이|은|을|과|으로) /.test(t)) bad.push(`${who}: 받침 틀린 조사 — ${(t.match(/[^.]*(?:(?:목|금)\([木金]\)(?:가|는|를|와|로) |(?:화|토|수)\([火土水]\)(?:이|은|을|과|으로) )[^.]*/) || [''])[0].trim()}`);
    const brs = r.raw.wonguk.filter((w) => !w.unknown).map((w) => w.branchKo);
    if (/공망으로 비어/.test(t) && !(c.공망일 || []).some((x) => brs.includes(x))) bad.push(`${who}: 원국에 없는 공망을 비어 있다고 함`);
    if (/상반기와 하반기의 결이 뚜렷하게/.test(t)) bad.push(`${who}: 계산하지 않은 「상반기와 하반기」 단정`);
    if (c.십성분포.인성 === 0 && /받쳐주는 힘/.test(t)) bad.push(`${who}: 인성 0개인데 「받쳐주는 힘」`);
  }
  return n;
});

const failed = results.filter((r) => r.bad.length);
console.log(`\n${results.length}개 항목 중 ${failed.length ? `${failed.length}개 어긋남` : '전부 통과'}`);
process.exit(failed.length ? 1 : 0);
