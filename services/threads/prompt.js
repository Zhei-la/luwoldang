/* ============================================================
 * services/threads/prompt.js — 프롬프트 조립
 *
 * 콘텐츠 지침(CONTENT-GUIDELINE.md) 전문이 프롬프트에 그대로 들어간다.
 * 그 파일을 고치면 다음 생성부터 바로 반영된다. 코드는 안 건드려도 된다.
 * ============================================================ */

const fs = require('fs');
const path = require('path');
const { HOOKS } = require('./hooks');

const GUIDELINE_PATH = path.join(__dirname, 'CONTENT-GUIDELINE.md');
/* 실제로 터진 글을 유형별로 뜯어본 것. 노션 「사주 글 벤치마킹」에서 옮겨 온다.
   지침이 「어떻게 쓸까」라면 이건 「이렇게 쓰니 터지더라」다. */
const BENCHMARK_PATH = path.join(__dirname, 'BENCHMARK.md');

let cached = null;
function loadGuideline() {
  if (cached) return cached;
  cached = fs.readFileSync(GUIDELINE_PATH, 'utf8');
  return cached;
}

let benchCached = null;
function loadBenchmark() {
  if (benchCached !== null) return benchCached;
  try { benchCached = fs.readFileSync(BENCHMARK_PATH, 'utf8'); }
  catch (e) { benchCached = ''; }   // 파일이 없어도 글은 나와야 한다
  return benchCached;
}

const SCHEMA = `{
  "topic": "받은 주제 그대로",
  "situation": "상황으로 바꾼 것",
  "hookScan": [
    { "id": 1, "name": "반드시", "verdict": "usable|combinable|blocked|deprioritized",
      "angle": "usable/combinable 일 때만. 한 줄. 나머지는 이 항목을 아예 빼라" }
  ],
  "posts": [
    {
      "hooks": [12, 14],
      "postType": "공감형|댓글형|정보형|경고형|브랜딩형|대조형",
      "form": "single|pair",
      "parts": ["1편 본문", "2편 본문"],
      "replyType": "rest_of_list|seed|solution_more|signup|none",
      "cta": true,
      "cutNote": "pair 일 때 어디서 끊었는지 한 줄. single 이면 빈 문자열"
    }
  ],
  "unusable": [
    { "id": 4, "name": "실제 금액이나 수치", "unlock": "무엇이 있으면 쓸 수 있는지" }
  ]
}`;

/** 말투 팩을 프롬프트에 넣을 모양으로 편다 */
function voiceBlock(v) {
  if (!v) {
    return '(아직 말투 팩이 없습니다. 지침의 「쓰지 않는 말투」만 지키고, ' +
           '사주 보는 사람이 툭 던지듯 자연스러운 존댓말로 써주세요.)';
  }
  const lines = [
    '어미: ' + (v.endings || []).join(' · '),
    '독자 호칭: ' + (v.address || ''),
    '문장 길이: 평균 ' + (v.sentenceLen && v.sentenceLen.avg) + '자, 최대 ' + (v.sentenceLen && v.sentenceLen.max) + '자',
    '줄바꿈: ' + (v.lineBreakRhythm || ''),
    '자주 쓰는 표현: ' + (v.signaturePhrases || []).join(' / '),
    '절대 쓰지 않는 말: ' + (v.bannedWords || []).join(' / '),
    '이모지: ' + (v.symbols && v.symbols.emoji) + ' · 기호: ' + ((v.symbols && v.symbols.marks) || []).join(' '),
    '톤: ' + Object.keys(v.toneAxis || {}).map((k) => k + ' ' + v.toneAxis[k]).join(' · '),
    '실제로 쓰는 마무리: ' + (v.ctaPatterns || []).join(' / '),
    '',
    '아래는 본인이 실제로 쓴 글입니다. 이 목소리를 그대로 흉내 내세요.',
  ];
  (v.sampleExcerpts || []).forEach((s, i) => lines.push('--- 예시 ' + (i + 1) + ' ---\n' + s));
  return lines.join('\n');
}

/**
 * 주제 하나로 글을 만드는 프롬프트.
 * ledger = { 후킹번호: { lastUsed, count } }
 */
function buildPrompt(topic, opts) {
  const o = opts || {};
  const ledger = o.ledger || {};
  const facts = o.facts || [];

  const ledgerLines = HOOKS.map((h) => {
    const l = ledger[h.id];
    const used = l && l.count ? l.lastUsed + ' · ' + l.count + '회' : '미사용';
    const lock = h.needsFacts ? ' [사실 자료 필요]' : '';
    return '  ' + String(h.id).padStart(2) + '. ' + h.name + lock + ' — ' + used;
  }).join('\n');

  const countRule = o.limit
    ? '- **글은 정확히 ' + o.limit + '개만** 만든다. 건진 후킹이 많아도 ' + o.limit + '개를 넘기지 마라.\n' +
      '  가장 잘 맞는 후킹부터 골라 쓰고, 못 쓴 것은 unusable 이 아니라 그냥 넘어간다.'
    : '- 건진 후킹 수에 맞춰 글 개수를 정한다. 최대 8개까지.';

  return `당신은 사주 콘텐츠를 쓰는 명리학자입니다. 아래 지침에 따라 스레드 콘텐츠를 만들어주세요.

════════ 지침 ════════
${loadGuideline()}

${loadBenchmark() ? `════════ 실제로 터진 글 — 유형과 공식 ════════
${loadBenchmark()}

⚠️ 위 자료를 쓰는 규칙 — 이걸 거꾸로 알아듣는 일이 잦다. 잘 읽어라.

**① 순서 틀은 그대로 따른다.** 이게 반응이 터진 이유다.
   인사글이면 인사 → 계기 → 차별점 → 댓글 지정, 이 네 줄 순서를 지켜라.
   내용글이면 행동이 앞, 용어가 뒤. 순서를 바꾸지 마라.
   **순서까지 피하려 들면 알맹이 없는 글이 된다.**

**② 바꾸는 것은 소재와 문장뿐이다.**
   위에 나온 소재(병화일간 먹는 거, 귀한 사주, 현침살 저주, 개운법,
   인천 남동구)는 이미 쓰인 것이다. 다른 일간·다른 신살·다른 행동으로 잡아라.
   문장을 그대로 옮기거나 몇 글자만 바꿔 쓰면 그 글은 버려진다.

**③ 후킹 이름을 문장에 그대로 쓰지 마라.**
   「솔직히 말해서」 「나만 그런 거 아니죠?」 「반드시 알아야 할」 같은 말을
   이어 붙이는 것은 글이 아니다. 후킹은 **각도**이지 문장이 아니다.
   ✗ "솔직히 말해서, 사주 보는 게 처음이신가요? 나만 그런 거 아니죠?"
   ⭕ "사주 상담 10년 하면서 제일 많이 들은 말이 이겁니다"

**④ 사주 글자가 반드시 들어가야 한다.**
   일간 이름(갑목·병화·경금…), 오행, 십성, 신살, 대운 중
   **적어도 하나를 실제로 가리켜라.**
   ✗ "같은 일간이라면 비슷한 경험할 수 있답니다"  ← 어느 일간인지가 없다
   ⭕ "경금 일간은 거절을 못 합니다"              ← 가리켰다
` : ''}
════════ 내 말투 ════════
${voiceBlock(o.voicePack)}

════════ 후킹 사용 이력 ════════
최근에 쓴 후킹은 후순위로 민다. 미사용을 먼저 쓴다.
${ledgerLines}

════════ 사실 창고 ════════
${facts.length
  ? facts.map((f) => '- ' + f).join('\n')
  : '(비어 있음 — 실제 수치·이벤트·사례·개인 소식이 필요한 후킹은 blocked 로 처리하고, 무엇이 있으면 쓸 수 있는지 unlock 에 적어주세요)'}

${o.ctaLink ? '════════ 신청 안내 ════════\n신청 주소는 시스템이 글 맨 뒤에 따로 붙입니다. 본문에 URL 을 적지 마세요.\ncta: true 로 둔 글은 마지막을 안내하는 문장으로 닫기만 하세요.\n' : ''}
${o.extra || ''}
════════ 주제 ════════
${topic}

════════ 출력 형식 ════════
아래 JSON 하나만 출력하세요. 앞뒤에 인사말, 설명, 코드펜스 전부 붙이지 마세요.

${SCHEMA}

지켜야 할 것:
- hookScan 은 26개를 전부 담는다. 하나라도 빠지면 안 된다.
- **angle 은 usable/combinable 일 때만 적는다.** blocked/deprioritized 는 id·name·verdict 세 개만 넣어라.
- unusable 에는 blocked 인 것만, 무엇이 있으면 열리는지 한 줄로.
${countRule}
- **길이가 제일 중요하다. 한 글은 3~6문장, 되도록 3~5문장이다.**
  후킹 1문장 + 본문 1~3문장 + 마무리 1문장. 배경 설명·친절한 해설·강의식 정리는 뺀다.
- **form 은 무조건 "single" 이다. parts 에는 한 편만 담는다.**
  1/3, 2/3 처럼 번호를 붙여 나눠 올리면 사람들이 뒷편을 안 본다.
  할 말이 다 안 들어가면 글을 나누지 말고 덜 중요한 것을 버려라.
  500자 안에 한 편으로 끝난다.
- 한 글에 메시지는 하나만. 후킹은 글당 1~2개, 정말 자연스러울 때만 3개.
- **줄바꿈이 제일 중요하다. 한 줄에 한 뜻씩 끊어라.**
  세 문장을 한 줄에 쭉 이어 쓰면 폰에서 벽처럼 보여 그냥 넘긴다.
  parts 안에서 줄바꿈 문자로 실제로 줄을 나눠라. 한 줄은 60자를 넘기지 않는다.
  ✗ "삼재가 되는 해, 알아야 할 게 있습니다. 이 시기엔 조심할 것들이 있어요. 겁내지 말고 대처하면 됩니다."
  ⭕ "삼재라고 다 나쁜 건 아닙니다
     들어오는 삼재는 벌여둔 걸 정리하는 해예요
     새로 벌이지 말고 있는 것부터 닫으면 됩니다"
- 한 문장은 25자 안팎. 한 문장에 뜻 하나. 쉼표를 아낀다.
- **무엇인지 밝히고 넘어가라.** 「조심할 것들이 있어요」 「방법이 많답니다」처럼
  뭉뚱그리면 읽고 나서 남는 게 없다. 무엇을 조심하는지, 어떤 방법인지 적어라.
- 사주 용어는 그 자리에서 한 마디로 푼다. 한 글에 한두 개까지.
- 마지막 줄은 행동을 부른다. 다만 **생년월일을 적어달라는 글은 셋 중 하나까지만** 쓴다.
  매번 그렇게 닫으면 받아만 가는 계정으로 보인다.
  나머지는 「본인은 어떤지」, 「몇 개 걸리는지」처럼 읽은 것에 답하게 닫아라.

- **정보형은 「왜 그런지」가 반드시 있어야 한다.**
  무엇이 그렇다고만 하고 넘어가면 읽고 나서 남는 게 없다.
  ✗ "오행이 치우친 사주는 주의할 점이 있어요. 감정적으로 힘들어질 수 있습니다."
  ⭕ "수가 없는 사주는 쉬는 법을 못 배웁니다
     물이 받쳐줘야 나무가 쉬는데 그게 없어서 계속 버티기만 합니다
     그러다 한 번에 무너집니다"
- parts 에는 1/4 같은 번호를 넣지 마라. 시스템이 붙인다.
- 신청 유도(cta: true)는 전체 글의 3분의 1 이하로만.
- 본문에 URL 을 적지 마라. 주소는 시스템이 맨 뒤에 붙인다.
- 500자는 스레드가 막는 한계일 뿐 목표가 아니다. 그 근처까지 채우지 마라.
- 타고난 것으로 겁주지 않는다. 경고형은 반드시 해결 문장으로 닫는다.
- **사주 근거가 없는 글은 쓰지 마라.** 일간·오행·십성·신살·대운 중
  적어도 하나를 이름으로 가리켜야 한다. 「같은 일간이라면」처럼 뭉뚱그리면 안 된다.
  「경금 일간은」, 「도화살이 둘이면」처럼 **무엇인지 적어라.**
- **벤치마크의 순서 틀은 그대로 따르고, 소재와 문장만 새로 잡아라.**
- 후킹 이름을 문장에 그대로 쓰지 마라. 후킹은 각도이지 문장이 아니다.`;
}

/** 같은 자리에서 다른 버전으로 다시 쓰는 프롬프트 */
function buildRewritePrompt(post, voicePack) {
  return `아래 글을 **다른 버전으로 다시** 써주세요.

주제와 형태는 그대로 두고, 표현과 구성을 바꿉니다.

════════ 내 말투 ════════
${voiceBlock(voicePack)}

════════ 지켜야 할 것 ════════
- 주제: ${post.topic}${post.situation ? ' (' + post.situation + ')' : ''}
- 글 유형: ${post.postType}
- 편 개수: ${post.parts.length}편 그대로
- ${post.cta ? '마지막에 신청 안내를 넣습니다.' : '신청 안내는 넣지 않습니다.'}
- 훅을 다르게 잡고, 예로 드는 것도 바꿔주세요. 같은 말을 돌려쓰지 마세요.
- 길이는 3~6문장. 길게 늘리지 마세요.
- 타고난 것으로 겁주지 않습니다. 경고하는 글이면 해결 문장으로 닫습니다.
- 1/4 같은 번호는 넣지 마세요.


════════ 지금 글 (이것과 다르게) ════════
${post.parts.map((t, i) => '--- ' + (i + 1) + '편 ---\n' + t).join('\n\n')}

════════ 출력 형식 ════════
아래 JSON 하나만 출력하세요. 설명이나 코드펜스는 붙이지 마세요.

{ "parts": ["1편 본문", "2편 본문"], "cutNote": "두 편일 때 어디서 끊었는지" }`;
}

module.exports = { buildPrompt, buildRewritePrompt, loadGuideline, loadBenchmark, voiceBlock };
