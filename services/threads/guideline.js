/* ============================================================
 * services/threads/guideline.js — 지침 점검
 *
 * 규칙으로 판정한다. AI 판단이 아니다.
 * 하드 규칙을 하나라도 어기면 발행을 막는다.
 *
 * 이 중 제일 중요한 건 「겁주기」 판정이다.
 *   "역마살 있으면 큰일 남"        → 타고난 것으로 겁줌   차단
 *   "역마 흐르는 시기에 이러면 큰일" → 행동·시기를 지목함  통과
 * 사주 콘텐츠의 신뢰는 여기서 갈린다.
 * ============================================================ */

const { threadsLength, THREADS_MAX, numberParts, proseSentences } = require('./length');

/* 지침 「쓰지 않는 말투」 */
const BANNED = [
  '명리학적 관점에서',
  '오행의 균형을 고려하면',
  '십성의 배치를 살펴보면',
  '용신을 정확히 잡아야',
  '사주 원국의 구조상',
  '좋아요와 팔로우',
  '팔로우 부탁',
];

/* 겁주기 판정용 */
const INBORN = /(역마살|도화살|삼재|공망|화개살|백호|괴강|일간|원국|사주|재성|관성|비겁|식상|인성)/;
const INBORN_SUBJECT = /(있으면|있는 사람|인 사람|있다고|타고|가진 사람)/;
const SCARE = /(큰일|망한|망함|안 좋|나빠|위험|끝장|최악|불행|파산|이혼|죽)/;

/* 행동을 지목했으면 통과시킨다.
 *
 * ⚠️ 여기에 "올해·이번 달·이 시기" 같은 때만 가리키는 말을 넣으면 안 된다.
 *    원본에는 들어 있었는데, 그러면 이런 문장이 그냥 통과한다.
 *      "삼재 있는 사람은 올해 다 망함"
 *    타고난 것으로 겁주는 문장인데 "올해"가 있다는 이유로 빠져나간다.
 *    때를 가리키는 것만으로는 면죄가 안 된다. 무엇을 하느냐가 있어야 한다.
 *    (대운·세운이 흐른다는 뜻의 "흐르는"은 타고난 것이 아니라 지나가는 것이라 남겨둔다) */
const ACTION = /(하면|할 때|하시면|쓰면|움직이면|들어오면|옮기면|벌이면|나서면|밀어붙이면|건드리면|겹치면|흐르는)/;

/* 해결 문장 신호 — 경고형은 이걸로 닫아야 한다 */
const SOLUTION = /(하면 됩?니다|하면 돼|하시면|보셔야|찾는 거|방향|정리하|바꾸면|이렇게)/;

/* 사주 용어 — 한 문단에 너무 많으면 읽기 어렵다 */
const TERMS = [
  '역마', '도화', '삼재', '공망', '화개', '백호', '괴강', '천을귀인',
  '재성', '관성', '비겁', '식상', '인성', '편재', '정재', '편관', '정관',
  '일간', '원국', '대운', '세운', '용신', '기신', '충', '합', '형', '파',
  '갑목', '을목', '병화', '정화', '무토', '기토', '경금', '신금', '임수', '계수',
];

/** 겁주는 문장을 찾으면 그 문장 앞부분을 돌려준다. 없으면 null. */
function scareViolation(text) {
  for (const raw of String(text == null ? '' : text).split(/[.\n]/)) {
    const s = raw.trim();
    if (!s || !SCARE.test(s)) continue;
    if (!INBORN.test(s) || !INBORN_SUBJECT.test(s)) continue;
    if (ACTION.test(s)) continue;          // 행동·시기를 지목했으면 통과
    return s.slice(0, 40);
  }
  return null;
}

/** 한 문단에 사주 용어가 최대 몇 개 나오는지 */
function termsInParagraph(text) {
  let max = 0;
  for (const para of String(text == null ? '' : text).split(/\n\s*\n/)) {
    const found = new Set();
    for (const t of TERMS) if (para.includes(t)) found.add(t);
    max = Math.max(max, found.size);
  }
  return max;
}

/**
 * 글 한 편을 점검한다.
 * post = { postType, form, parts: [] }
 * 반환 { rows, passHard, lengths }
 */
function checkPost(post) {
  const rows = [];
  const parts = Array.isArray(post.parts) ? post.parts : [];
  const numbered = post.form === 'chain' ? numberParts(parts) : parts;
  const lengths = numbered.map(threadsLength);

  /* ── 하드 규칙 — 하나라도 어기면 발행 못 함 ── */

  const over = lengths.findIndex((n) => n > THREADS_MAX);
  rows.push({
    label: '모든 편 500자 이내',
    ok: over === -1,
    hard: true,
    detail: over === -1
      ? '최대 ' + (lengths.length ? Math.max.apply(null, lengths) : 0) + '자'
      : (over + 1) + '번째 편이 ' + lengths[over] + '자',
  });

  const scare = parts.map(scareViolation).find(Boolean);
  rows.push({
    label: '타고난 것으로 겁주지 않음',
    ok: !scare,
    hard: true,
    detail: scare ? '"' + scare + '…"' : '행동·시기를 지목하거나 경고 없음',
  });

  const banned = BANNED.filter((b) => parts.some((p) => String(p).includes(b)));
  rows.push({
    label: '금지 말투 없음',
    ok: banned.length === 0,
    hard: true,
    detail: banned.length ? banned.join(', ') : undefined,
  });

  if (post.postType === '경고형') {
    const hasSolution = parts.some((p) => SOLUTION.test(p));
    rows.push({
      label: '경고형 — 해결 문장 있음',
      ok: hasSolution,
      hard: true,
      detail: hasSolution ? undefined : '"이렇게 하면 된다"로 닫아야 합니다',
    });
  }

  /* ── 소프트 규칙 — 어겨도 발행은 되지만 알려준다 ── */

  const maxTerms = termsInParagraph(parts.join('\n\n'));
  rows.push({
    label: '용어 문단당 2개 이하',
    ok: maxTerms <= 2,
    hard: false,
    detail: '최대 ' + maxTerms + '개',
  });

  if (post.form === 'chain' && lengths.length >= 3) {
    const mountain = lengths[0] < lengths[1] && lengths[1] > lengths[lengths.length - 1];
    rows.push({
      label: '산 모양 길이 (2편이 제일 김)',
      ok: mountain,
      hard: false,
      detail: lengths.join(' → '),
    });

    const firstProse = proseSentences(parts[0]);
    rows.push({
      label: '1편에 설명 없음',
      ok: firstProse <= 2,
      hard: false,
      detail: '산문 ' + firstProse + '문장',
    });

    const ctaIdx = parts.findIndex((p) => /댓글에 남겨|생년월일/.test(p));
    rows.push({
      label: '신청 안내는 마지막 편에만',
      ok: ctaIdx === -1 || ctaIdx === parts.length - 1,
      hard: false,
      detail: ctaIdx === -1 ? '없음' : (ctaIdx + 1) + '편',
    });
  }

  if (post.form === 'pair' && parts.length === 2) {
    const body = String(parts[0] || '');
    const reply = String(parts[1] || '');

    const overlap = reply
      .split('\n')
      .filter((l) => l.trim().length > 6 && body.includes(l.trim())).length;
    rows.push({
      label: '첫 댓글이 본문 요약이 아님',
      ok: overlap === 0,
      hard: false,
      detail: overlap ? '겹치는 줄 ' + overlap + '개' : undefined,
    });

    const promised = /댓글|아래|더 있/.test(body);
    rows.push({
      label: '본문에서 예고한 댓글이 있음',
      ok: !promised || reply.trim().length > 0,
      hard: false,
    });
  }

  const passHard = rows.filter((r) => r.hard).every((r) => r.ok);
  return { rows, passHard, lengths };
}

module.exports = { checkPost, scareViolation, BANNED, TERMS };
