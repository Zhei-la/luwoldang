const { Solar, Lunar } = require('lunar-javascript');

// 天干 / 地支 → 오행
const GAN_EL = { 甲:'목', 乙:'목', 丙:'화', 丁:'화', 戊:'토', 己:'토', 庚:'금', 辛:'금', 壬:'수', 癸:'수' };
const JI_EL  = { 寅:'목', 卯:'목', 巳:'화', 午:'화', 辰:'토', 戌:'토', 丑:'토', 未:'토', 申:'금', 酉:'금', 亥:'수', 子:'수' };

// 天干 / 地支 → 한글 음
const GAN_KO = { 甲:'갑', 乙:'을', 丙:'병', 丁:'정', 戊:'무', 己:'기', 庚:'경', 辛:'신', 壬:'임', 癸:'계' };
const JI_KO  = { 子:'자', 丑:'축', 寅:'인', 卯:'묘', 辰:'진', 巳:'사', 午:'오', 未:'미', 申:'신', 酉:'유', 戌:'술', 亥:'해' };

function toKo(pillar) {
  if (!pillar) return null;
  const g = pillar[0], j = pillar[1];
  return (GAN_KO[g] || g) + (JI_KO[j] || j);
}

function countElements(pillars) {
  const c = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  pillars.forEach((p) => {
    if (!p) return;
    const g = p[0], j = p[1];
    if (GAN_EL[g]) c[GAN_EL[g]]++;
    if (JI_EL[j]) c[JI_EL[j]]++;
  });
  return c;
}

/**
 * @param {string} birthDate 'YYYY-MM-DD'
 * @param {string|null} birthTime 'HH:MM' 또는 null(시간 모름)
 * @param {string} calendar '양력' | '음력'
 */
function calcSaju({ birthDate, birthTime, calendar }) {
  const [y, m, d] = String(birthDate).split('-').map(Number);
  let hh = 0, mm = 0, timeKnown = false;
  if (birthTime && /^\d{1,2}:\d{2}$/.test(birthTime)) {
    [hh, mm] = birthTime.split(':').map(Number);
    timeKnown = true;
  }

  let lunar;
  if (calendar === '음력') {
    lunar = Lunar.fromYmdHms(y, m, d, hh, mm, 0);
  } else {
    lunar = Solar.fromYmdHms(y, m, d, hh, mm, 0).getLunar();
  }

  const ec = lunar.getEightChar();
  const pillars = {
    year: ec.getYear(),
    month: ec.getMonth(),
    day: ec.getDay(),
    hour: timeKnown ? ec.getTime() : null,
  };

  const arr = [pillars.year, pillars.month, pillars.day, pillars.hour].filter(Boolean);
  const elements = countElements(arr);

  const entries = Object.entries(elements);
  const max = Math.max(...entries.map((e) => e[1]));
  const min = Math.min(...entries.map((e) => e[1]));
  const strong = entries.filter((e) => e[1] === max && max > 0).map((e) => e[0]);
  const weak = entries.filter((e) => e[1] === min).map((e) => e[0]);

  const dayGan = ec.getDayGan();

  return {
    pillars,
    pillarsKo: {
      year: toKo(pillars.year),
      month: toKo(pillars.month),
      day: toKo(pillars.day),
      hour: toKo(pillars.hour),
    },
    dayMaster: dayGan,
    dayMasterKo: GAN_KO[dayGan] || dayGan,
    dayMasterElement: GAN_EL[dayGan] || null,
    elements,
    strong,
    weak,
    timeKnown,
    lunarText: lunar.toString(),
  };
}

module.exports = { calcSaju };
