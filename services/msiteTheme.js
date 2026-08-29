/* ============================================================
 * services/msiteTheme.js — 공개 만세력 페이지 색
 *
 * 교육생이 다 똑같은 페이지를 뿌리면 금세 티가 난다.
 * 그렇다고 색을 자유롭게 고르게 하면 글씨가 안 보이는 조합이 나온다.
 * 그래서 미리 짜둔 다섯 벌 중에 고르게 한다. 전부 읽히는지 확인한 것들이다.
 * ============================================================ */

const THEMES = {
  /* 기본 — 먹과 한지 */
  meok: {
    name: '먹과 한지',
    hint: '차분한 기본. 무엇에나 어울립니다.',
    ink: '#241F18', ink2: '#4A4438', dim: '#7C7566', faint: '#A8A192',
    line: '#E6DFD1', line2: '#F0EAE0', bg: '#FBF8F2', card: '#FFFFFF',
    gold: '#B08D57', goldD: '#8A6F3C', navy: '#241F18',
  },
  /* 소나무 — 초록 */
  sol: {
    name: '소나무',
    hint: '단정하고 믿음직한 인상.',
    ink: '#1B2620', ink2: '#3A4A41', dim: '#68786E', faint: '#9AA79F',
    line: '#DBE5DE', line2: '#EBF1ED', bg: '#F7FAF8', card: '#FFFFFF',
    gold: '#3E7D5A', goldD: '#2F6446', navy: '#1B2620',
  },
  /* 노을 — 붉은 기 */
  noeul: {
    name: '노을',
    hint: '따뜻하고 눈에 잘 띕니다.',
    ink: '#2A1D1A', ink2: '#4E3A34', dim: '#7F6B64', faint: '#AC9A94',
    line: '#EEDFD9', line2: '#F7EDE9', bg: '#FDF8F5', card: '#FFFFFF',
    gold: '#C0503C', goldD: '#9A3E2E', navy: '#2A1D1A',
  },
  /* 새벽 — 남색 */
  saebyeok: {
    name: '새벽',
    hint: '깔끔하고 도시적인 느낌.',
    ink: '#1A202A', ink2: '#37414F', dim: '#65707F', faint: '#98A2AF',
    line: '#DCE2EA', line2: '#EDF0F5', bg: '#F7F9FC', card: '#FFFFFF',
    gold: '#3C5A80', goldD: '#2E4767', navy: '#1A202A',
  },
  /* 밤 — 어두운 바탕 */
  bam: {
    name: '밤',
    hint: '어두운 바탕. 사진이 돋보입니다.',
    ink: '#F2EEE6', ink2: '#D6CFC2', dim: '#A79E8E', faint: '#7C7466',
    line: '#3A342B', line2: '#2C2721', bg: '#1C1814', card: '#262119',
    gold: '#C9A469', goldD: '#DCBB88', navy: '#C9A469',
  },
};

const DEFAULT = 'meok';

function get(key) {
  return THEMES[key] || THEMES[DEFAULT];
}

/** 화면 맨 위에 넣을 색 지정문 */
function cssVars(key) {
  const t = get(key);
  return [
    '--ink:' + t.ink, '--ink2:' + t.ink2, '--dim:' + t.dim, '--faint:' + t.faint,
    '--line:' + t.line, '--line2:' + t.line2, '--bg:' + t.bg, '--card:' + t.card,
    '--gold:' + t.gold, '--gold-d:' + t.goldD, '--navy:' + t.navy,
  ].join(';');
}

/** 설정 화면에서 고르게 할 목록 */
function list() {
  return Object.keys(THEMES).map((k) => ({
    key: k,
    name: THEMES[k].name,
    hint: THEMES[k].hint,
    bg: THEMES[k].bg,
    card: THEMES[k].card,
    ink: THEMES[k].ink,
    gold: THEMES[k].gold,
  }));
}

/** 저장할 때 아무 값이나 들어오지 않게 거른다 */
function clean(key) {
  return THEMES[key] ? key : DEFAULT;
}

module.exports = { THEMES, DEFAULT, get, cssVars, list, clean };
