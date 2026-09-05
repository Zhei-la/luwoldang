/* ============================================================
 * services/threads/jiji.js — 지지 관계로 띠를 고른다
 *
 * ⚠️ 예전엔 「운 좋은 띠 셋」을 모델이 골랐다. 근거가 없으니 아무 띠나
 *    나왔다. 계미일에 용띠·원숭이띠가 나오는 식이었다 — 미(未)와는
 *    아무 관계도 없는 지지다. 명리를 아는 사람이 보면 바로 티가 난다.
 *
 * 띠는 지어낼 것이 아니라 **계산해서 정할 것**이다.
 * 그 날 일진의 지지 하나만 있으면 합·삼합·방합·충·형·해·파가 다 정해진다.
 *
 * 그래서 여기서 띠를 정하고, 모델에게는 「이 목록을 그대로 쓰라」고 준다.
 * 모델이 하는 일은 그 근거를 스레드 말투로 풀어 쓰는 것뿐이다.
 *
 * 관계표 출처는 명리 기본서에 나오는 그대로다 —
 *   육합 자축·인해·묘술·진유·사신·오미
 *   삼합 신자진(수) 해묘미(목) 인오술(화) 사유축(금)
 *   방합 인묘진(목) 사오미(화) 신유술(금) 해자축(수)
 *   충   자오·축미·인신·묘유·진술·사해
 *   형   인사신 · 축술미 · 자묘 · 진진 오오 유유 해해(자형)
 *   해   자미·축오·인사·묘진·신해·유술
 *   파   자유·축진·인해·묘오·사신·미술
 * ============================================================ */

/* 지지 열둘. 자리 번호가 곧 띠 번호다. */
const BRANCHES = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
const ANIMALS = ['쥐', '소', '범', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];
/* 글에 쓰는 이름. 「범띠」보다 「호랑이띠」가 스레드에서 자연스럽다. */
const TTI = ['쥐띠', '소띠', '호랑이띠', '토끼띠', '용띠', '뱀띠',
  '말띠', '양띠', '원숭이띠', '닭띠', '개띠', '돼지띠'];
const EMOJI = ['🐭', '🐮', '🐯', '🐰', '🐲', '🐍', '🐴', '🐑', '🐵', '🐔', '🐶', '🐷'];

function idx(b) { return BRANCHES.indexOf(String(b || '').trim()); }

/* 육합 — 짝이 정해져 있다 */
const YUKHAP = { 자: '축', 축: '자', 인: '해', 해: '인', 묘: '술', 술: '묘',
  진: '유', 유: '진', 사: '신', 신: '사', 오: '미', 미: '오' };

/* 삼합 — 셋이 한 묶음. 어느 오행으로 모이는지까지 적어둔다. */
const SAMHAP = [
  { set: ['신', '자', '진'], element: '수' },
  { set: ['해', '묘', '미'], element: '목' },
  { set: ['인', '오', '술'], element: '화' },
  { set: ['사', '유', '축'], element: '금' },
];

/* 방합 — 계절이 같은 셋 */
const BANGHAP = [
  { set: ['인', '묘', '진'], element: '목' },
  { set: ['사', '오', '미'], element: '화' },
  { set: ['신', '유', '술'], element: '금' },
  { set: ['해', '자', '축'], element: '수' },
];

/* 형 — 삼형 둘, 상형 하나, 자형 넷 */
const SAMHYEONG = [['인', '사', '신'], ['축', '술', '미']];
const SANGHYEONG = [['자', '묘']];
const JAHYEONG = ['진', '오', '유', '해'];

const HAE = { 자: '미', 미: '자', 축: '오', 오: '축', 인: '사', 사: '인',
  묘: '진', 진: '묘', 신: '해', 해: '신', 유: '술', 술: '유' };

const PA = { 자: '유', 유: '자', 축: '진', 진: '축', 인: '해', 해: '인',
  묘: '오', 오: '묘', 사: '신', 신: '사', 미: '술', 술: '미' };

/** 충 — 여섯 칸 건너 마주 본다 */
function chungOf(b) {
  const i = idx(b);
  return i < 0 ? null : BRANCHES[(i + 6) % 12];
}

/** 두 글자를 붙여 부르는 이름 — 「미오합」·「축미충」처럼 */
function pair(a, b, kind) { return a + b + kind; }

/**
 * 그 날 지지에 걸리는 관계를 전부 모은다.
 *
 * 반환 { good: [...], care: [...] }
 *   각 항목 { branch, tti, emoji, kind, why }
 *   kind 는 '육합' '삼합' '방합' '충' '형' '해' '파'
 */
function relations(dayBranch) {
  const b = String(dayBranch || '').trim();
  if (idx(b) < 0) return null;

  const good = [];
  const care = [];
  const add = (list, branch, kind, why) => {
    if (branch === b && kind !== '자형') return;      // 자기 자신은 안 넣는다
    list.push({ branch, kind, why });
  };

  /* ── 좋은 쪽 ── */
  if (YUKHAP[b]) add(good, YUKHAP[b], '육합', pair(b, YUKHAP[b], '합'));

  SAMHAP.forEach((g) => {
    if (g.set.indexOf(b) < 0) return;
    g.set.filter((x) => x !== b).forEach((x) => {
      add(good, x, '삼합', g.set.join('') + ' 삼합(' + g.element + ')');
    });
  });
  BANGHAP.forEach((g) => {
    if (g.set.indexOf(b) < 0) return;
    g.set.filter((x) => x !== b).forEach((x) => {
      add(good, x, '방합', g.set.join('') + ' 방합(' + g.element + ')');
    });
  });

  /* ── 조심할 쪽 ── */
  const ch = chungOf(b);
  if (ch) add(care, ch, '충', pair(b, ch, '충'));

  SAMHYEONG.forEach((g) => {
    if (g.indexOf(b) < 0) return;
    g.filter((x) => x !== b).forEach((x) => add(care, x, '형', g.join('') + ' 삼형'));
  });
  SANGHYEONG.forEach((g) => {
    if (g.indexOf(b) < 0) return;
    g.filter((x) => x !== b).forEach((x) => add(care, x, '형', pair(b, x, '형')));
  });
  if (JAHYEONG.indexOf(b) >= 0) care.push({ branch: b, kind: '자형', why: b + b + ' 자형' });

  if (HAE[b]) add(care, HAE[b], '해', pair(b, HAE[b], '해'));
  if (PA[b]) add(care, PA[b], '파', pair(b, PA[b], '파'));

  return { good, care };
}

/* 어느 관계를 먼저 꼽을지. 앞에 있을수록 세다. */
const GOOD_ORDER = ['육합', '삼합', '방합'];
const CARE_ORDER = ['충', '형', '자형', '해', '파'];

/** 같은 띠가 여러 번 걸리면 하나로 합치고, 근거를 모아 적는다. */
function merge(list, order) {
  const by = {};
  list.forEach((x) => {
    if (!by[x.branch]) by[x.branch] = { branch: x.branch, kinds: [], whys: [] };
    if (by[x.branch].kinds.indexOf(x.kind) < 0) by[x.branch].kinds.push(x.kind);
    if (by[x.branch].whys.indexOf(x.why) < 0) by[x.branch].whys.push(x.why);
  });
  return Object.keys(by).map((k) => by[k]).sort((a, b) => {
    const rank = (x) => Math.min.apply(null, x.kinds.map((k) => {
      const i = order.indexOf(k);
      return i < 0 ? 99 : i;
    }));
    return rank(a) - rank(b);
  });
}

/**
 * 그 날의 「운 좋은 띠」와 「조심할 띠」.
 *
 * ⚠️ 합과 파·해가 같은 띠에 겹칠 때가 있다 (인해는 육합이면서 파다).
 *    그럴 땐 **합을 먼저 본다.** 좋은 쪽에 넣고 조심 쪽에서는 뺀다.
 *    양쪽에 같은 띠를 올려두면 읽는 사람이 뭘 믿어야 할지 모른다.
 *    다만 충은 합과 겹치지 않는다 — 여섯 칸 건너라 짝이 다르다.
 *
 * 반환 { good: [...], care: [...], dayBranch }
 *   각 항목 { tti, emoji, why }  why 는 「미오합」처럼 짧은 근거
 */
function pick(dayBranch, howMany) {
  const rel = relations(dayBranch);
  if (!rel) return null;
  const n = Math.max(1, Math.min(4, Number(howMany) || 3));

  const good = merge(rel.good, GOOD_ORDER).slice(0, n);
  const taken = {};
  good.forEach((g) => { taken[g.branch] = true; });

  /* 합이 걸린 띠는 조심 쪽에서 뺀다 */
  const care = merge(rel.care.filter((x) => !taken[x.branch]), CARE_ORDER).slice(0, n);

  const dress = (x) => {
    const i = idx(x.branch);
    return { tti: TTI[i], emoji: EMOJI[i], animal: ANIMALS[i], branch: x.branch, why: x.whys.join(' · ') };
  };
  return { dayBranch, good: good.map(dress), care: care.map(dress) };
}

/**
 * 프롬프트에 얹을 덩어리.
 *
 * 모델에게 **띠를 고르게 하지 않는다.** 여기서 정한 것을 그대로 쓰게 한다.
 * 모델이 할 일은 근거를 스레드 말투로 풀어 쓰는 것뿐이다.
 */
const HANJA = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

function block(dayBranch, howMany) {
  const p = pick(dayBranch, howMany);
  if (!p) return '';

  const line = (x) => '  ' + x.emoji + ' ' + x.tti + '  — ' + x.why;
  return [
    '════════ 오늘 띠 (계산해둔 값) ════════',
    '이 날 일지는 **' + p.dayBranch + '(' + HANJA[idx(p.dayBranch)] + ')** 입니다.',
    '아래는 그 지지의 합·삼합·충·형·해·파를 따져 **계산해둔 결과**입니다.',
    '',
    '  운 좋은 띠',
    p.good.map(line).join('\n'),
    '',
    '  조심할 띠',
    p.care.map(line).join('\n'),
    '',
    '⚠️ **이 띠 목록을 그대로 쓰세요.** 띠를 고르는 것은 당신 일이 아닙니다.',
    '   다른 띠를 넣거나, 빼거나, 순서를 바꾸지 마세요.',
    '   근거(미오합·해묘미 삼합 같은 것)도 위 값을 그대로 씁니다. 지어내지 마세요.',
    '⚠️ 「귀인이 붙는다」·「새 인연이 열린다」처럼 **근거 없는 말을 셋 모두에 뭉뚱그려**',
    '   붙이지 마세요. 띠마다 걸린 관계가 달라서 같은 말이 될 수 없습니다.',
    '',
  ].join('\n');
}

/**
 * 나온 글에 **엉뚱한 띠**가 들어갔는지 본다.
 *
 * ⚠️ 프롬프트에 「이 목록을 그대로 쓰세요」라고 적어두는 것만으로는
 *    안 지켜진다. 계미일에 용띠·원숭이띠를 넣는 일이 실제로 있었다.
 *    미(未)와는 아무 관계도 없는 지지라, 아는 사람이 보면 바로 티가 난다.
 *
 * 반환 { ok, why }  — why 는 다시 시킬 때 그대로 붙일 한 줄
 */
function checkText(dayBranch, text) {
  const p = pick(dayBranch);
  if (!p) return { ok: true };

  const t = String(text == null ? '' : text);
  const allowed = {};
  p.good.concat(p.care).forEach((x) => { allowed[x.tti] = true; });
  /* 「범띠」로 적어도 호랑이띠와 같은 것으로 본다 */
  const same = { 호랑이띠: '범띠', 범띠: '호랑이띠' };

  const wrong = [];
  const missing = [];
  TTI.forEach((name, i) => {
    const alt = same[name];
    const inText = t.indexOf(name) >= 0 || (alt && t.indexOf(alt) >= 0);
    if (inText && !allowed[name]) wrong.push(name);
    if (!inText && allowed[name]) missing.push(name);
  });

  if (wrong.length) {
    return {
      ok: false,
      why: '이 날과 관계없는 띠가 들어갔습니다 (' + wrong.join(', ') + '). ' +
        '위 「오늘 띠」에 계산해둔 것만 쓰세요 — ' +
        '좋은 쪽 ' + p.good.map((x) => x.tti).join('·') +
        ', 조심할 쪽 ' + p.care.map((x) => x.tti).join('·') + '.',
    };
  }
  if (missing.length) {
    return {
      ok: false,
      why: '계산해둔 띠가 빠졌습니다 (' + missing.join(', ') + '). ' +
        '여섯 띠를 모두 적어야 합니다.',
    };
  }
  return { ok: true };
}

module.exports = {
  checkText,
  BRANCHES, ANIMALS, TTI, EMOJI,
  relations, pick, block, chungOf, idx, HANJA,
  YUKHAP, SAMHAP, BANGHAP, HAE, PA, SAMHYEONG,
};
