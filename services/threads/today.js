/* ============================================================
 * services/threads/today.js — 그 날의 날짜와 일진
 *
 * 「오늘의 운세」는 날짜를 틀리면 아무 소용이 없다. 그런데 두 가지가 겹친다.
 *
 *   ① 모델은 오늘이 며칠인지 모른다. 물어보면 지어낸다.
 *   ② 우리는 **며칠 앞서** 만들어 걸어둔다. 월요일에 만든 글이
 *      수요일에 올라가는데, 그 글이 「오늘」이라고 하면 월요일 이야기가 된다.
 *
 * 그래서 「오늘」이 아니라 **그 글이 올라갈 날**을 계산해서 넘긴다.
 * 일진(간지)은 이 사이트의 만세력 엔진으로 직접 뽑는다 — 모델에게 맡기면
 * 그럴듯한 두 글자를 지어낸다.
 * ============================================================ */

const { calcSaju } = require('../manseryeok');

const TZ_OFFSET_MS = 9 * 60 * 60 * 1000;
const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

/* 간지를 한글로. 화면과 글에 한자를 그대로 내보내지 않는다. */
const STEM = {
  甲: '갑', 乙: '을', 丙: '병', 丁: '정', 戊: '무',
  己: '기', 庚: '경', 辛: '신', 壬: '임', 癸: '계',
};
const BRANCH = {
  子: '자', 丑: '축', 寅: '인', 卯: '묘', 辰: '진', 巳: '사',
  午: '오', 未: '미', 申: '신', 酉: '유', 戌: '술', 亥: '해',
};
const ELEMENT = {
  甲: '목', 乙: '목', 丙: '화', 丁: '화', 戊: '토',
  己: '토', 庚: '금', 辛: '금', 壬: '수', 癸: '수',
};

function ko(ganji) {
  const g = String(ganji || '');
  const s = STEM[g[0]] || '';
  const b = BRANCH[g[1]] || '';
  return s + b;
}

/**
 * 그 시각(UTC Date)이 한국에서 몇 월 며칠 무슨 요일인지, 그 날의 일진은 무엇인지.
 *
 * 반환 { date:'2026-09-07', month, day, dayName, ganji, ganjiKo, dayStem, element }
 * 계산이 안 되면 null — 부르는 쪽이 「그럼 날짜 얘기는 빼라」고 이르면 된다.
 */
function forDate(at) {
  const when = at ? new Date(at) : new Date();
  if (isNaN(when.getTime())) return null;

  const k = new Date(when.getTime() + TZ_OFFSET_MS);
  const y = k.getUTCFullYear();
  const m = k.getUTCMonth() + 1;
  const d = k.getUTCDate();
  const date = y + '-' + String(m).padStart(2, '0') + '-' + String(d).padStart(2, '0');

  try {
    /* 일주는 하루 단위라 시각은 아무 때나 잡아도 같다.
       다만 자시(23시 이후)는 다음 날로 넘어가는 셈법이 있어 정오로 고정한다. */
    const r = calcSaju({ birthDate: date, birthTime: '12:00', calendar: '양력', region: '서울특별시' });
    const ganji = (r && r.pillars && r.pillars.day) || '';
    if (!ganji) return null;
    return {
      date,
      month: m,
      day: d,
      dayName: DAY_NAMES[k.getUTCDay()],
      ganji,
      ganjiKo: ko(ganji),
      dayStem: STEM[ganji[0]] || '',
      element: ELEMENT[ganji[0]] || '',
    };
  } catch (e) {
    console.error('[스레드] 일진 계산 실패(' + date + '):', e.message);
    return null;
  }
}

/**
 * 「오늘의 운세」 틀일 때 프롬프트에 얹을 덩어리.
 * 날짜를 못 구했으면 날짜 이야기를 아예 빼라고 이른다 — 지어내는 것보다 낫다.
 */
function block(at) {
  const t = forDate(at);
  if (!t) {
    return '════════ 이 글이 올라갈 날 ════════\n' +
      '(날짜를 계산하지 못했습니다. **날짜·요일·일진을 글에 적지 마세요.** 지어내면 안 됩니다.)\n';
  }
  return [
    '════════ 이 글이 올라갈 날 ════════',
    '⚠️ **지금이 아니라 이 날 올라갑니다.** 「오늘」은 아래 날짜를 말합니다.',
    '',
    '  날짜   ' + t.month + '월 ' + t.day + '일 ' + t.dayName + '요일',
    '  일진   ' + t.ganjiKo + '일 (' + t.ganji + ') — 일간은 ' + t.dayStem + ', 오행은 ' + t.element,
    '',
    '- 날짜와 요일은 **위 값을 그대로** 쓰세요. 다른 날짜를 적으면 안 됩니다.',
    '- 일진도 위 값 그대로입니다. **간지를 지어내지 마세요.**',
    '- 한자는 쓰지 말고 「' + t.ganjiKo + '일」처럼 한글로 적으세요.',
    '',
  ].join('\n');
}

module.exports = { forDate, block, ko, DAY_NAMES };
