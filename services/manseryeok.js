const { Solar, Lunar } = require('lunar-javascript');

/* ============================================================
 * 만세력 계산 엔진 v2
 * - 지역시(진태양시) 보정
 * - 일주 변경 기준(dayChangeMode) 설정화
 * - 서머타임 보정
 * 기준: 포스텔러 호환 (KST 표준자오선 135°E)
 * ============================================================ */

const GAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const JI  = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

const GAN_KO = { 甲:'갑', 乙:'을', 丙:'병', 丁:'정', 戊:'무', 己:'기', 庚:'경', 辛:'신', 壬:'임', 癸:'계' };
const JI_KO  = { 子:'자', 丑:'축', 寅:'인', 卯:'묘', 辰:'진', 巳:'사', 午:'오', 未:'미', 申:'신', 酉:'유', 戌:'술', 亥:'해' };

const GAN_EL = { 甲:'목', 乙:'목', 丙:'화', 丁:'화', 戊:'토', 己:'토', 庚:'금', 辛:'금', 壬:'수', 癸:'수' };
const JI_EL  = { 寅:'목', 卯:'목', 巳:'화', 午:'화', 辰:'토', 戌:'토', 丑:'토', 未:'토', 申:'금', 酉:'금', 亥:'수', 子:'수' };

// 지지 음양 (체용 원리 — 子·巳·午·亥는 인덱스 홀짝과 반대. 포스텔러 기준)
const JI_YIN = {
  子:true,  丑:true,  寅:false, 卯:true,
  辰:false, 巳:false, 午:true,  未:true,
  申:false, 酉:true,  戌:false, 亥:false,
};

// 천간 음양 (甲丙戊庚壬 = 양 / 乙丁己辛癸 = 음)
const GAN_YIN = {
  甲:false, 乙:true, 丙:false, 丁:true, 戊:false,
  己:true,  庚:false, 辛:true, 壬:false, 癸:true,
};

/* ---------- 십성(十星) ----------
 * 일간(日主)을 기준으로 상대 글자의 오행·음양 관계로 결정
 *   같은 오행  : 음양 같으면 비견,   다르면 겁재
 *   내가 생함  : 음양 같으면 식신,   다르면 상관
 *   내가 극함  : 음양 같으면 편재,   다르면 정재
 *   나를 극함  : 음양 같으면 편관,   다르면 정관
 *   나를 생함  : 음양 같으면 편인,   다르면 정인
 */
const SHENG = { 목:'화', 화:'토', 토:'금', 금:'수', 수:'목' }; // 生 (내가 낳는 것)
const KE    = { 목:'토', 화:'금', 토:'수', 금:'목', 수:'화' }; // 剋 (내가 이기는 것)

function tenGod(dayEl, dayYin, targetEl, targetYin) {
  if (!dayEl || !targetEl) return null;
  const same = dayYin === targetYin;
  if (targetEl === dayEl)            return same ? '비견' : '겁재';
  if (SHENG[dayEl] === targetEl)     return same ? '식신' : '상관';
  if (KE[dayEl] === targetEl)        return same ? '편재' : '정재';
  if (KE[targetEl] === dayEl)        return same ? '편관' : '정관';
  if (SHENG[targetEl] === dayEl)     return same ? '편인' : '정인';
  return null;
}

// 지장간 (문서 8번)
const HIDDEN_STEMS = {
  子:['壬','癸'], 丑:['癸','辛','己'], 寅:['戊','丙','甲'], 卯:['甲','乙'],
  辰:['乙','癸','戊'], 巳:['戊','庚','丙'], 午:['丙','己','丁'], 未:['丁','乙','己'],
  申:['戊','壬','庚'], 酉:['庚','辛'], 戌:['辛','丁','戊'], 亥:['戊','甲','壬'],
};

/* ---------- 지역 경도 (표준자오선 135°E 기준 보정) ---------- */
const REGIONS = {
  '서울':126.98, '서울특별시':126.98,
  '인천':126.71, '인천광역시':126.71,
  '경기':127.01, '경기도':127.01,
  '강원':128.20, '강원도':128.20, '강원특별자치도':128.20,
  '대전':127.38, '대전광역시':127.38,
  '세종':127.29, '세종특별자치시':127.29,
  '충북':127.49, '충청북도':127.49,
  '충남':126.80, '충청남도':126.80,
  '광주':126.85, '광주광역시':126.85,
  '전북':127.15, '전라북도':127.15, '전북특별자치도':127.15,
  '전남':126.99, '전라남도':126.99,
  '대구':128.60, '대구광역시':128.60,
  '경북':128.51, '경상북도':128.51,
  '부산':129.08, '부산광역시':129.08,
  '울산':129.31, '울산광역시':129.31,
  '경남':128.69, '경상남도':128.69,
  '제주':126.53, '제주특별자치도':126.53,
};
const STANDARD_MERIDIAN = 135; // KST

function findLongitude(region) {
  if (!region) return REGIONS['서울'];
  const key = String(region).trim();
  if (REGIONS[key] != null) return REGIONS[key];
  for (const name of Object.keys(REGIONS)) {
    if (key.includes(name)) return REGIONS[name];
  }
  return REGIONS['서울'];
}

// 경도차 1도 = 4분
function localTimeCorrection(region) {
  const lon = findLongitude(region);
  return Math.round((lon - STANDARD_MERIDIAN) * 4); // 음수 = 늦춰짐
}

/* ---------- 한국 서머타임 구간 (-60분) ---------- */
const DST_PERIODS = [
  ['1948-06-01','1948-09-12'], ['1949-04-03','1949-09-10'],
  ['1950-04-01','1950-09-09'], ['1951-05-06','1951-09-08'],
  ['1955-05-05','1955-09-08'], ['1956-05-20','1956-09-29'],
  ['1957-05-05','1957-09-21'], ['1958-05-04','1958-09-20'],
  ['1959-05-03','1959-09-19'], ['1960-05-01','1960-09-17'],
  ['1987-05-10','1987-10-11'], ['1988-05-08','1988-10-09'],
];
function isDST(dateStr) {
  return DST_PERIODS.some(function (p) { return dateStr >= p[0] && dateStr <= p[1]; });
}

/* ---------- 시지 구간 ----------
 * 포스텔러 실측 검증 결과: 정시 경계 사용 (子 = 23:00~01:00)
 * 子 23-01 / 丑 01-03 / 寅 03-05 / 卯 05-07 / 辰 07-09 / 巳 09-11
 * 午 11-13 / 未 13-15 / 申 15-17 / 酉 17-19 / 戌 19-21 / 亥 21-23
 */
function hourBranchIndex(hh, mm) {
  const t = hh * 60 + mm;
  if (t >= 23 * 60 || t < 60) return 0;  // 子
  return Math.floor((t - 60) / 120) + 1;
}

const pad = function (n) { return String(n).padStart(2, '0'); };

function calcSaju(o) {
  const birthDate = o.birthDate;
  const birthTime = o.birthTime;
  const calendar = o.calendar || '양력';
  const region = o.region || '서울';
  const isLeapMonth = !!o.isLeapMonth;
  const dayChangeMode = o.dayChangeMode || 'lateZiNextDay';
  const useLocalSolarTime = o.useLocalSolarTime !== false;
  const applyDST = o.applyDST === true; // 검증 결과 기본 off

  const parts = String(birthDate).split('-').map(Number);
  const y = parts[0], m = parts[1], d = parts[2];

  let hh = 0, mm = 0, timeKnown = false;
  if (birthTime && /^\d{1,2}:\d{2}$/.test(birthTime)) {
    const tp = birthTime.split(':').map(Number);
    hh = tp[0]; mm = tp[1]; timeKnown = true;
  }

  // 1) 음력 → 양력 정규화
  let sy = y, sm = m, sd = d;
  if (calendar === '음력') {
    const lu = Lunar.fromYmdHms(y, isLeapMonth ? -m : m, d, hh, mm, 0);
    const so = lu.getSolar();
    sy = so.getYear(); sm = so.getMonth(); sd = so.getDay();
  }

  // 2) 시간 보정 (서머타임 → 지역시)
  const dateStr = sy + '-' + pad(sm) + '-' + pad(sd);
  let correction = 0;
  const notes = [];
  if (timeKnown) {
    if (applyDST && isDST(dateStr)) { correction -= 60; notes.push('서머타임 -60분'); }
    if (useLocalSolarTime) {
      const lt = localTimeCorrection(region);
      correction += lt;
      notes.push('지역시 ' + (lt > 0 ? '+' : '') + lt + '분');
    }
  }

  const base = new Date(sy, sm - 1, sd, hh, mm, 0);
  const applied = new Date(base.getTime() + correction * 60000);
  const ay = applied.getFullYear();
  const am = applied.getMonth() + 1;
  const ad = applied.getDate();
  const ahh = applied.getHours();
  const amm = applied.getMinutes();

  // 3) 년/월/일주 — 보정된 시각 기준
  //    lateZiNextDay(기본): 23시(자시) 진입 시 일주를 다음 날로 넘김
  //    → 보정시각이 23시 이후면 날짜를 +1일 하고 00:30으로 계산
  let py = ay, pm = am, pd = ad, pHour = ahh, pMin = amm;
  if (dayChangeMode !== 'midnight' && ahh >= 23) {
    const next = new Date(ay, am - 1, ad, ahh, amm, 0);
    next.setDate(next.getDate() + 1);
    py = next.getFullYear();
    pm = next.getMonth() + 1;
    pd = next.getDate();
    pHour = 0;
    pMin = 30;
  } else if (dayChangeMode === 'midnight' && ahh >= 23) {
    pHour = 22; // 날짜 안 넘김
  }

  const lunarForPillars = Solar.fromYmdHms(py, pm, pd, pHour, pMin, 0).getLunar();
  const ec = lunarForPillars.getEightChar();

  const yearP = ec.getYear();
  const monthP = ec.getMonth();
  const dayP = ec.getDay();

  // 4) 시주 — 지역시/서머타임 보정된 실제 시각 + 정시 경계
  let hourP = null;
  if (timeKnown) {
    const bIdx = hourBranchIndex(ahh, amm);
    const dayStemIdx = GAN.indexOf(dayP[0]);
    const startStemIdx = (dayStemIdx % 5) * 2;
    const hourStemIdx = (startStemIdx + bIdx) % 10;
    hourP = GAN[hourStemIdx] + JI[bIdx];
  }

  // 5) 오행
  const arr = [yearP, monthP, dayP, hourP].filter(Boolean);
  const elements = { 목:0, 화:0, 토:0, 금:0, 수:0 };
  arr.forEach(function (p) {
    if (GAN_EL[p[0]]) elements[GAN_EL[p[0]]]++;
    if (JI_EL[p[1]]) elements[JI_EL[p[1]]]++;
  });
  const vals = Object.values(elements);
  const max = Math.max.apply(null, vals), min = Math.min.apply(null, vals);
  const strong = Object.keys(elements).filter(function (k) { return elements[k] === max && max > 0; });
  const weak = Object.keys(elements).filter(function (k) { return elements[k] === min; });

  const dayGan = dayP[0];
  const toKo = function (p) { return p ? (GAN_KO[p[0]] || p[0]) + (JI_KO[p[1]] || p[1]) : null; };

  // 표 표시용: 기둥별 천간/지지를 글자 단위로 분해 (한자·한글·오행·음양·십성)
  const dayEl = GAN_EL[dayGan];
  const dayYin = GAN_YIN[dayGan] === true;

  const stemInfo = function (ch, isDayMaster) {
    if (!ch) return null;
    const el = GAN_EL[ch] || null;
    const yin = GAN_YIN[ch] === true;
    return {
      char: ch, ko: GAN_KO[ch] || ch, el: el, yin: yin,
      god: isDayMaster ? '일간' : tenGod(dayEl, dayYin, el, yin),
    };
  };
  const branchInfo = function (ch) {
    if (!ch) return null;
    const el = JI_EL[ch] || null;
    const yin = JI_YIN[ch] === true;
    return {
      char: ch, ko: JI_KO[ch] || ch, el: el, yin: yin,
      god: tenGod(dayEl, dayYin, el, yin),
    };
  };
  const detail = function (p, isDay) {
    if (!p) return { stem: null, branch: null };
    return { stem: stemInfo(p[0], isDay), branch: branchInfo(p[1]) };
  };

  return {
    pillars: { year: yearP, month: monthP, day: dayP, hour: hourP },
    pillarsKo: { year: toKo(yearP), month: toKo(monthP), day: toKo(dayP), hour: toKo(hourP) },
    detail: {
      year: detail(yearP, false),
      month: detail(monthP, false),
      day: detail(dayP, true),
      hour: detail(hourP, false),
    },
    hiddenStems: {
      year: HIDDEN_STEMS[yearP[1]] || [],
      month: HIDDEN_STEMS[monthP[1]] || [],
      day: HIDDEN_STEMS[dayP[1]] || [],
      hour: hourP ? (HIDDEN_STEMS[hourP[1]] || []) : [],
    },
    dayMaster: dayGan,
    dayMasterKo: GAN_KO[dayGan] || dayGan,
    dayMasterElement: GAN_EL[dayGan] || null,
    elements: elements,
    strong: strong,
    weak: weak,
    timeKnown: timeKnown,
    lunarText: lunarForPillars.toString(),
    timeCorrection: {
      originalTime: timeKnown ? pad(hh) + ':' + pad(mm) : null,
      correctedTime: timeKnown ? pad(ahh) + ':' + pad(amm) : null,
      correctionMinutes: correction,
      notes: notes,
      region: region,
    },
    solarDate: dateStr,
  };
}

module.exports = { calcSaju: calcSaju, HIDDEN_STEMS: HIDDEN_STEMS, GAN: GAN, JI: JI, GAN_KO: GAN_KO, JI_KO: JI_KO };
