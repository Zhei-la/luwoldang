/* ============================================================
 * services/threads/speech.js — 한 글 안에서 말투를 하나로
 *
 * ⚠️ 실제로 이렇게 나갔다.
 *
 *     안녕하세요 사주상담가 운결담 입니다
 *     오늘은 사주 촉이 제대로 와서 무료로 열어봅니다
 *     복채는 댓글에 스하리 한 번이면 충분해요
 *     댓글에 생년월일시 · 성별 · 요즘 제일 고민되는 거 하나 남겨줘   ← 여기
 *
 * 앞은 존댓말인데 마지막 줄만 반말이다. 사람이 쓴 글로 안 보인다.
 * 모델은 「친근하게」와 「정중하게」를 한 글 안에서 오간다.
 *
 * 그래서 **줄 끝을 세어** 두 말투가 섞였는지 기계로 본다.
 *
 * ⚠️ 이 검사는 **발행을 막지 않는다.** 잘못 잡으면 멀쩡한 글이 통째로
 *    못 나간다. 만들 때 한 번 다시 시키는 데만 쓴다 — 틀리면 요금이
 *    조금 더 나갈 뿐이고, 글은 어차피 나간다.
 * ============================================================ */

const NL = String.fromCharCode(10);

/* 존댓말 끝.
 *
 * ⚠️ 「요」로 끝난다고 다 존댓말이 아니다. 「필요」·「중요」·「주요」가
 *    줄 끝에 오면 명사다. 그래서 **앞 글자까지 묶어** 본다. */
const POLITE = new RegExp(
  '(' + [
    '니다',                                   // 입니다 · 습니다 · 합니다
    '어요', '아요', '해요', '세요', '셔요',
    '네요', '게요', '까요', '나요', '져요',
    '워요', '려요', '에요', '예요', '대요',
    '데요', '래요', '줘요', '봐요', '와요',
    '돼요', '되요', '이요', '구요',
    '죠', '쥬',
    '십시오', '시오',
  ].join('|') + ')' + '\\s*[.!?~…♥♡\\s]*$'
);

/* 반말·음슴체 끝.
 *
 * ⚠️ 음슴체(…음/…함)는 명사와 헷갈린다. 「마음」·「처음」·「사람」이
 *    줄 끝에 오면 잘못 잡는다. 그래서 **그 명사들은 빼고** 본다. */
const PLAIN = new RegExp(
  '(' + [
    '줘', '봐', '해', '와', '가', '자',        // 남겨줘 · 해봐 · 하자
    '거야', '느야', '야',
    '어', '아',                                 // 했어 · 좋아
    '음', '함', '됨', '임', '씀',              // 음슴체
    '단다', '는다', 'ㄴ다',
  ].join('|') + ')' + '\\s*[.!?~…♥♡\\s]*$'
);

/* 「음」으로 끝나지만 음슴체가 아닌 말. 여기 걸리면 안 센다. */
const NOT_UMSEUM = /(마음|처음|사람|이름|얼음|웃음|믿음|졸음|가슴|아픔|기쁨|슬픔|꿈|봄|밤|담|힘)$/;

/* 「야」·「아」·「어」로 끝나지만 반말이 아닌 말 */
const NOT_PLAIN = /(분야|시야|말씀|이야|의미|사이|나이|차이|고민이|무엇이)$/;

/* 셀 필요가 없는 줄 — 목록·이모지·구두점만 있는 줄 */
function skippable(line) {
  const t = line.trim();
  if (!t) return true;
  if (/^[0-9]+[.)]/.test(t) && t.length < 4) return true;
  /* 한글이 두 글자도 없으면 말투를 잴 수 없다 (이모지 · 기호 줄) */
  return (t.match(/[가-힣]/g) || []).length < 2;
}

/**
 * 줄마다 말투를 가른다.
 *
 * 반환 { polite: [줄…], plain: [줄…] }
 * 애매한 줄(명사로 끝나는 줄 등)은 어느 쪽에도 안 넣는다 —
 * **못 미더울 땐 안 세는 편**이 낫다.
 */
function classify(text) {
  const polite = [];
  const plain = [];

  String(text == null ? '' : text).split(NL).forEach((raw) => {
    if (skippable(raw)) return;
    /* 끝의 구두점·이모지를 떼고 본다 */
    const t = raw.trim().replace(/[\s.!?~…·ㆍ,]+$/, '');
    if (!t) return;

    if (POLITE.test(t)) { polite.push(raw.trim()); return; }
    if (NOT_UMSEUM.test(t) || NOT_PLAIN.test(t)) return;
    if (PLAIN.test(t)) { plain.push(raw.trim()); }
  });

  return { polite, plain };
}

/** 이 글의 말투 하나를 고른다. 못 고르면 ''. */
function of(text) {
  const c = classify(text);
  if (c.polite.length > c.plain.length) return '존댓말';
  if (c.plain.length > c.polite.length) return '반말';
  return '';
}

/**
 * 한 글 안에서 존댓말과 반말이 섞였나.
 *
 * ⚠️ **적은 쪽이 하나뿐일 때가 제일 흔하다.** 마지막 줄만 반말로
 *    끝나는 것이 그렇다. 그러니 한 줄이어도 잡는다.
 *
 * 반환 { ok, why }  — why 는 다시 시킬 때 그대로 붙일 한 줄
 */
function mixed(text) {
  const c = classify(text);
  if (!c.polite.length || !c.plain.length) return { ok: true };

  /* 많은 쪽이 그 글의 말투다. 적은 쪽을 거기에 맞춘다. */
  const keepPolite = c.polite.length >= c.plain.length;
  const odd = (keepPolite ? c.plain : c.polite).slice(0, 3);

  return {
    ok: false,
    why: '한 글에 존댓말과 반말이 섞였습니다. ' +
      '이 글은 **' + (keepPolite ? '존댓말' : '반말') + '**입니다 — ' +
      '「' + odd.join('」 · 「') + '」' +
      (odd.length > 1 ? ' 줄들을' : ' 줄을') + ' ' +
      (keepPolite ? '존댓말로' : '반말로') + ' 바꾸고, ' +
      '글 전체를 한 말투로 끝까지 맞추세요.',
  };
}

/** 여러 편·첫 댓글까지 한 덩어리로 본다 — 댓글만 반말인 경우가 있다 */
function mixedIn(parts, replyText) {
  const all = (parts || []).concat(replyText ? [replyText] : []);
  return mixed(all.join(NL));
}

/** 프롬프트에 얹을 덩어리. 본보기가 있으면 그 말투를 따르라고 이른다. */
function block(sample) {
  const want = sample ? of(sample) : '';
  return [
    '════════ 말투는 하나로 ════════',
    '⚠️ **한 글 안에서 존댓말과 반말을 섞지 마세요.**',
    '   앞은 「~입니다」로 가다가 마지막 줄만 「~해줘」로 끝나면',
    '   사람이 쓴 글로 안 보입니다. 실제로 이렇게 나갔습니다.',
    '',
    '   ✗ 오늘은 무료로 열어봅니다 … 고민되는 거 하나 남겨줘',
    '   ✓ 오늘은 무료로 열어봅니다 … 고민되는 거 하나 남겨주세요',
    '   ✓ 오늘은 무료로 열어봄 … 고민되는 거 하나 남겨줘',
    '',
    want
      ? '   이 계정은 **' + want + '**을 씁니다. 처음부터 끝까지 ' + want + '로 쓰세요.'
      : '   어느 쪽이든 좋습니다. **끝까지 하나로** 가세요.',
    '   첫 댓글도 본문과 같은 말투로 씁니다.',
    '',
  ].join(NL);
}

module.exports = { classify, of, mixed, mixedIn, block, POLITE, PLAIN };
