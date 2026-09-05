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

/* 사주를 실제로 「가리킨」 말.
   TERMS 와 달리, 뭉뚱그린 말(사주·일간)은 빼고 무엇인지 짚은 것만 센다.
   「같은 일간이라면」은 근거가 아니고 「경금 일간은」이 근거다. */
const POINTED = [
  '갑목', '을목', '병화', '정화', '무토', '기토', '경금', '신금', '임수', '계수',
  '역마', '도화', '삼재', '공망', '화개', '백호', '괴강', '천을귀인', '문창',
  '재성', '관성', '비겁', '식상', '인성', '편재', '정재', '편관', '정관',
  '비견', '겁재', '식신', '상관', '편인', '정인',
  '용신', '기신', '대운', '세운', '원국', '지장간', '십이운성', '12운성',
  '자시', '축시', '진술축미', '삼합', '육합',
  '쥐띠', '소띠', '범띠', '호랑이띠', '토끼띠', '용띠', '뱀띠',
  '말띠', '양띠', '원숭이띠', '닭띠', '개띠', '돼지띠',
];

/* 후킹 이름을 문장에 그대로 붙여 쓴 것.
   「솔직히 말해서, 사주 보는 게 처음이신가요? 나만 그런 거 아니죠?」처럼
   각도를 문장으로 착각해 이어 붙이면 알맹이가 없어진다. */
const HOOK_WORDS = [
  '솔직히 말해서', '솔직히 말하면', '솔직히 말씀드리면',
  '반드시 알아야 할', '꼭 알아야 할', '이것만은 반드시', '반드시 알아두',
  '진짜 고수들은', '고수들은 이렇게', '요즘 핫한', '최근 유행하는',
  '이렇게 활용해', '이렇게 쓰면 됩니다만',
];

/* 「나만 그래?」류는 변형이 많아 정규식으로 잡는다.
   나만 그런 건가요 / 나만 그런 거 아니죠 / 저만 그런가요 … */
const HOOK_RE = [
  { re: /(나|저)만\s*그런\s*(건|거|가|건가)/, name: '나만 그래?' },
  { re: /여러분은\s*어떤/, name: '어때? 의견 묻기' },
  { re: /(알아야|아셔야)\s*할\s*(점|것)이\s*있습니다/, name: '반드시' },
];

/* 오행은 한 글자라 그냥 넣으면 「수요일」·「금방」까지 걸린다.
   기운을 가리키는 자리에 쓰였을 때만 센다.

   ⚠️ 예전엔 「목일간은 먼저 움직이고 토일간은 관찰합니다」가 안 걸렸다.
      POINTED 에는 갑목·을목만 있고, 이 정규식도 「목 기운」 꼴만 봤다.
      그래서 멀쩡히 일간을 짚은 글이 「사주 근거 없음」으로 막혀
      자동 예약이 통째로 안 나갔다. 오행+일간·오행 이야기를 같이 본다. */
const ELEM_RE = new RegExp([
  '(목|화|토|금|수)\\s*(기운|이 없|가 없|이 많|가 많|이 강|이 약|이 부족|가 부족|을 채|를 채|오행)',
  '(목|화|토|금|수)\\s*일간',                    // 목일간 · 화 일간
  '일간이?\\s*(목|화|토|금|수)',                  // 일간이 목
  '오행이?\\s*(치우|몰려|몰린|고르|없|많|강|약)',   // 오행이 치우친 사주
].join('|'));

/** 사주를 실제로 가리켰는지 — 가리킨 말이 하나도 없으면 사주 글이 아니다 */
function pointsToSaju(text) {
  const t = String(text || '');
  if (POINTED.some((w) => t.indexOf(w) >= 0)) return true;
  return ELEM_RE.test(t);
}

/** 후킹 이름을 문장으로 붙여 쓴 곳 */
function hookWordsIn(text) {
  const t = String(text || '');
  const out = HOOK_WORDS.filter((w) => t.indexOf(w) >= 0);
  HOOK_RE.forEach((h) => { if (h.re.test(t)) out.push(h.name); });
  return out;
}

/* 줄바꿈 —
   벤치마크에서 터진 글은 전부 한 줄에 한 뜻씩 끊어 놓았다.
   세 문장을 한 줄에 쭉 이어 쓰면 폰에서 벽처럼 보여 그냥 넘긴다. */
function needsBreaks(parts) {
  const bad = [];
  (parts || []).forEach((p, i) => {
    const text = String(p || '');
    const lines = text.split(String.fromCharCode(10)).map((x) => x.trim()).filter(Boolean);

    /* ⚠️ 예전엔 마침표(.!?)로만 문장을 셌다. 그런데 사주 글은 마침표를
          거의 안 쓴다 — 「삼재라고 다 나쁜 건 아닙니다」 처럼 끝난다.
          그래서 이 검사가 사실상 안 걸리고 60자 규칙만 일하고 있었다.
          한국어 종결 어미도 같이 센다 (length.js 의 proseSentences 와 같은 방식). */
    const sents = (text.match(/[.!?。]|다\s|요\s|음\s|임\s|다$|요$|음$|임$/g) || []).length;

    // 문장이 셋 이상인데 줄이 하나면 벽이다
    if (sents >= 3 && lines.length <= 1) bad.push(i + 1);
    // 한 줄이 60자를 넘어도 폰에서 두세 줄로 접힌다
    else if (lines.some((l) => l.length > 60)) bad.push(i + 1);
    // 길이는 긴데 줄을 거의 안 나눴다 — 폰에서 통째로 벽이다
    else if ([...text].length >= 120 && lines.length < 3) bad.push(i + 1);
  });
  return bad;
}

/* 덩어리 나누기 —
   줄만 나눠도 여섯 줄이 다닥다닥 붙어 있으면 폰에서는 여전히 벽이다.
   뜻이 바뀌는 자리에 빈 줄 하나를 넣어 두세 덩어리로 끊어야 읽힌다.
   반대로 줄마다 비우면 흩어져 보여 성의 없어 보인다. 양쪽을 다 잡는다.

   반환 { ok, why } — why 는 무엇이 문제인지 한 줄. */
function blockCheck(text) {
  const raw = String(text == null ? '' : text).split(String.fromCharCode(10));
  const filled = raw.filter((l) => l.trim()).length;
  /* 빈 줄이 이어져 있어도 한 번으로 센다. 두 줄 비운 것도 한 자리다. */
  let blanks = 0;
  for (let i = 1; i < raw.length; i++) {
    if (!raw[i].trim() && raw[i - 1].trim()) blanks++;
  }

  /* 세 줄 이하는 그냥 둔다. 한 줄짜리 글에 억지로 빈 줄을 넣을 이유가 없다. */
  if (filled <= 3) {
    if (blanks > 1) return { ok: false, why: '짧은 글인데 빈 줄이 많습니다. 붙여서 쓰세요' };
    return { ok: true };
  }
  if (blanks === 0) {
    return { ok: false, why: '여섯 줄이 붙어 있으면 벽입니다. 뜻이 바뀌는 자리에 빈 줄 하나를 넣어주세요' };
  }
  if (blanks > Math.ceil(filled / 2)) {
    return { ok: false, why: '빈 줄이 너무 많습니다. 한 글에 하나나 둘이면 충분합니다' };
  }
  return { ok: true };
}

/* 알맹이 없이 뭉뚱그린 말 — 무엇인지 안 밝히고 넘어가는 표현 */
const VAGUE = [
  /(것|점|방법|부분)들?이\s*(있|많)/,
  /방법이\s*많/,
  /여러\s*가지가\s*있/,
  /잘\s*대처만\s*하면/,
  /도움이\s*될\s*(것|거)/,
];
function vagueIn(text) {
  const t = String(text || '');
  const hit = VAGUE.find((re) => re.test(t));
  return hit ? (t.match(hit) || [''])[0].trim() : null;
}

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
    /* ⚠️ 이것만 발행을 막는다(blocking).
          500자가 넘으면 스레드가 아예 안 받는다 — 우리 취향이 아니라 남의 한계다.
          나머지는 「고치면 좋은 것」이다. 다 지켜야만 올릴 수 있게 해두었더니
          짧은 글 하나 시험 삼아 올려보는 것도 막혔다. */
    blocking: true,
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

  /* 사주를 실제로 가리켰는가.
     이게 없으면 「사주 보는 게 처음이신가요?」 같은 아무 말이 나간다.
     무료사주 안내글은 풀이가 아니라 손님을 받는 글이라 뺀다. */
  const isNotice = post.postType === '브랜딩형' || post.replyType === 'signup';
  if (!isNotice) {
    const pointed = parts.some(pointsToSaju);
    rows.push({
      label: '사주를 실제로 가리킴',
      ok: pointed,
      hard: true,
      detail: pointed
        ? undefined
        : '일간·오행·십성·신살 중 무엇인지 적어야 합니다 (「같은 일간이라면」은 근거가 아닙니다)',
    });
  }

  /* 한 편으로 끝나야 한다.
     1/3, 2/3 로 나눠 올리면 뒷편을 아무도 안 본다. */
  rows.push({
    label: '한 편으로 끝남',
    /* 이어붙이기를 켠 사람은 여러 편을 쓸 수 있다. 켜지 않았으면 한 편이 규칙이다. */
    ok: parts.length <= 1 || !!(post.allowChain),
    hard: true,
    detail: (parts.length <= 1 || post.allowChain)
      ? undefined
      : parts.length + '편으로 나뉘어 있습니다. 한 편에 담거나 덜 중요한 것을 빼주세요',
  });

  /* 줄바꿈 — 한 줄에 쭉 이어 쓰면 폰에서 벽이 된다 */
  const wall = needsBreaks(parts);
  rows.push({
    label: '한 줄에 한 뜻씩 끊음',
    ok: wall.length === 0,
    hard: true,
    detail: wall.length
      ? wall.length === parts.length
        ? '문장마다 줄을 바꿔주세요 (한 줄 60자 넘기지 않기)'
        : wall.join('·') + '번째 편이 한 줄로 붙어 있습니다'
      : undefined,
  });

  /* 덩어리 — 줄을 나눠도 다닥다닥 붙어 있으면 여전히 벽이다 */
  const blockBad = parts.map(blockCheck).find((b) => !b.ok);
  rows.push({
    label: '덩어리 사이를 한 줄 비움',
    ok: !blockBad,
    hard: true,
    detail: blockBad ? blockBad.why : undefined,
  });

  /* 알맹이 없이 뭉뚱그린 말 */
  const vague = parts.map(vagueIn).find(Boolean);
  rows.push({
    label: '무엇인지 밝히고 넘어감',
    ok: !vague,
    hard: true,
    detail: vague
      ? '"' + vague + '" — 무엇인지 적어야 합니다. 「조심할 것들이 있어요」가 아니라 무엇을 조심하는지'
      : undefined,
  });

  /* 후킹 이름을 문장에 그대로 붙여 쓴 경우 */
  const hookish = hookWordsIn(parts.join(' '));
  rows.push({
    label: '후킹 이름을 문장으로 쓰지 않음',
    ok: hookish.length === 0,
    hard: true,
    detail: hookish.length
      ? '"' + hookish.join('", "') + '" — 후킹은 각도이지 문장이 아닙니다'
      : undefined,
  });

  /* ── 소프트 규칙 — 어겨도 발행은 되지만 알려준다 ── */

  const maxTerms = termsInParagraph(parts.join('\n\n'));
  rows.push({
    label: '용어 문단당 2개 이하',
    ok: maxTerms <= 2,
    hard: false,
    detail: '최대 ' + maxTerms + '개',
  });

  /* 길이가 제일 중요하다. 지침은 3~6문장, 되도록 3~5문장이다.
     글자 수는 500자까지 되지만 그건 스레드가 막는 한계일 뿐 목표가 아니다.
     목록이 있는 정보형은 줄이 늘어나므로 산문 문장만 센다. */
  const sentences = parts.map(proseSentences);
  const tooLong = sentences.findIndex((n) => n > 6);
  rows.push({
    label: '한 편이 3~6문장',
    ok: tooLong === -1,
    hard: false,
    detail: sentences.join(' · ') + '문장',
  });

  /* 연재는 하지 않기로 했다. 할 말이 많으면 글 개수를 늘린다. */
  rows.push({
    label: '한 편, 길어도 두 편',
    ok: parts.length <= 2,
    hard: false,
    detail: parts.length + '편',
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

  /* passHard  — 지침을 다 지켰나. 자동 발행은 이걸 본다 (사람이 안 보니까).
     passBlock — 올릴 수는 있나. 사람이 직접 올릴 때는 이것만 본다.
                 나머지는 「고치면 좋습니다」로 보여주고 판단은 사람이 한다. */
  const passHard = rows.filter((r) => r.hard).every((r) => r.ok);
  const passBlock = rows.filter((r) => r.blocking).every((r) => r.ok);
  const advice = rows.filter((r) => r.hard && !r.blocking && !r.ok).map((r) => r.label);
  return { rows, passHard, passBlock, advice, lengths };
}

module.exports = { checkPost, scareViolation, pointsToSaju, hookWordsIn, needsBreaks, vagueIn, BANNED, TERMS, POINTED };
