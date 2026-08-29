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

let cached = null;
function loadGuideline() {
  if (cached) return cached;
  cached = fs.readFileSync(GUIDELINE_PATH, 'utf8');
  return cached;
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
- **기본은 form: "single" 이다.** 정보형에서 목록이 길어 한 편에 도저히 안 들어갈 때만 "pair"(두 편)까지 쓴다.
  세 편 이상 이어 쓰는 연재는 하지 마라.
  할 말이 많으면 글을 길게 늘리지 말고 **글 개수를 늘려라.**
- 한 글에 메시지는 하나만. 후킹은 글당 1~2개, 정말 자연스러울 때만 3개.
- 한 문장은 25자 안팎. 한 문장에 뜻 하나. 쉼표를 아끼고 자주 줄을 바꾼다.
- 사주 용어는 그 자리에서 한 마디로 푼다. 한 글에 한두 개까지.
- 마지막 줄은 행동을 부른다 — 댓글에 일간·생년월일을 적게 만드는 것이 제일 세다.
- parts 에는 1/4 같은 번호를 넣지 마라. 시스템이 붙인다.
- 신청 유도(cta: true)는 전체 글의 3분의 1 이하로만.
- 본문에 URL 을 적지 마라. 주소는 시스템이 맨 뒤에 붙인다.
- 500자는 스레드가 막는 한계일 뿐 목표가 아니다. 그 근처까지 채우지 마라.
- 타고난 것으로 겁주지 않는다. 경고형은 반드시 해결 문장으로 닫는다.`;
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

module.exports = { buildPrompt, buildRewritePrompt, loadGuideline, voiceBlock };
