/* ============================================================
 * scripts/threads-selftest.js — 스레드 자동화 자가 점검
 *
 * DB 없이 도는 부분만 본다. 규칙 엔진·글자 수·파싱.
 *   node scripts/threads-selftest.js
 * ============================================================ */

const { checkPost } = require('../services/threads/guideline');
const { threadsLength, numberParts, proseSentences, formOf } = require('../services/threads/length');
const { parseLoose, normalize } = require('../services/threads/parse');
const { HOOKS } = require('../services/threads/hooks');
const { buildPrompt, buildVoicePrompt, loadGuideline } = require('../services/threads/prompt');

let pass = 0, fail = 0;
function t(name, got, want) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (ok) { pass++; console.log('  ✓ ' + name); }
  else { fail++; console.log('  ✗ ' + name + '\n      받음: ' + JSON.stringify(got) + '\n      기대: ' + JSON.stringify(want)); }
}
function section(s) { console.log('\n── ' + s + ' ──'); }

/* ── 글자 수 ── */
section('글자 수 세기');
t('한글은 1자로 센다', threadsLength('가'.repeat(300)), 300);
t('한글 300자가 500 넘지 않는다', threadsLength('가'.repeat(300)) <= 500, true);
t('이모지는 바이트로 센다', threadsLength('🔥'), 4);
t('URL 은 글자 그대로', threadsLength('https://a.co'), 12);
t('연재 번호가 붙는다', numberParts(['가', '나'])[0], '가\n\n1/2');
t('한 편이면 번호 안 붙인다', numberParts(['가']), ['가']);
t('편 수로 형태를 정한다', [formOf(1), formOf(2), formOf(3)], ['single', 'pair', 'chain']);
t('리스트 줄은 문장으로 안 센다', proseSentences('1. 하나\n2. 둘'), 0);

/* ── 겁주기 판정 (이 기능의 급소) ── */
section('겁주기 판정');
const scare = (parts) => {
  const r = checkPost({ postType: '정보형', form: formOf(parts.length), parts });
  return r.rows.find((x) => x.label === '타고난 것으로 겁주지 않음').ok;
};
t('타고난 것으로 겁주면 막는다', scare(['역마살 있으면 큰일 남']), false);
t('삼재 있는 사람 겁주기도 막는다', scare(['삼재 있는 사람은 올해 다 망함']), false);
t('행동을 지목하면 통과', scare(['역마 흐르는 시기에 무리해서 옮기면 큰일 납니다']), true);
t('시기를 지목하면 통과', scare(['이 시기에 큰돈 쓰면 위험합니다']), true);
t('경고가 없으면 통과', scare(['오늘은 정리하기 좋은 날입니다']), true);
t('때만 가리키는 말로는 못 빠져나간다', scare(['공망 있는 사람은 이번 달 위험합니다']), false);
t('타고난 것 + 행동이면 통과', scare(['역마살 있는 사람이 무리해서 밀어붙이면 큰일 납니다']), true);

/* ── 하드 규칙 ── */
section('하드 규칙');
const hard = (post) => checkPost(post).passHard;
t('500자 넘으면 막는다',
  hard({ postType: '정보형', form: 'single', parts: ['가'.repeat(501)] }), false);
t('금지 말투를 막는다',
  hard({ postType: '정보형', form: 'single', parts: ['명리학적 관점에서 보면 그렇습니다'] }), false);
t('경고형인데 해결 문장이 없으면 막는다',
  hard({ postType: '경고형', form: 'single', parts: ['조심하세요'] }), false);
/* 「사주를 실제로 가리킴」 이 하드 규칙이라, 통과해야 하는 글에는
   일간·오행·십성·신살 중 하나가 이름으로 들어 있어야 한다. */
t('경고형에 해결 문장이 있으면 통과',
  hard({ postType: '경고형', form: 'single', parts: ['경금 일간은 이 시기에 조심하세요. 이렇게 하면 됩니다'] }), true);
t('멀쩡한 글은 통과',
  hard({ postType: '정보형', form: 'single', parts: ['경금 일간에게 오늘은 정리하기 좋은 날입니다'] }), true);
t('사주 근거가 없으면 막는다',
  hard({ postType: '정보형', form: 'single', parts: ['오늘은 정리하기 좋은 날입니다'] }), false);

/* ── 소프트 규칙 ── */
section('소프트 규칙');
const soft = (post, label) => {
  const r = checkPost(post).rows.find((x) => x.label === label);
  return r ? r.ok : null;
};
t('용어가 문단당 3개면 걸린다',
  soft({ postType: '정보형', form: 'single', parts: ['역마 도화 삼재 이야기'] }, '용어 문단당 2개 이하'), false);
t('용어 2개는 통과',
  soft({ postType: '정보형', form: 'single', parts: ['역마 도화 이야기'] }, '용어 문단당 2개 이하'), true);

/* ── 파싱 ── */
section('AI 응답 읽기');
const ok1 = parseLoose('{"posts":[{"parts":["가"]}]}');
t('그냥 JSON 을 읽는다', ok1.data.posts.length, 1);
const ok2 = parseLoose('설명입니다\n```json\n{"posts":[{"parts":["가"]}]}\n```\n끝');
t('코드펜스와 설명을 걷어낸다', ok2.data.posts.length, 1);
const ok3 = parseLoose('{"posts":[{"parts":["가"]},{"parts":["나"]},{"parts":["다');
t('잘린 응답에서 앞쪽을 건진다', ok3.data.posts.length >= 2, true);
t('잘렸다고 알려준다', !!ok3.warning, true);
const ok4 = parseLoose('{"posts":[{"parts":["가"]},]}');
t('트레일링 콤마를 고친다', ok4.data.posts.length, 1);
let threw = false;
try { parseLoose('그냥 인사말입니다'); } catch (e) { threw = e.name === 'ParseError'; }
t('JSON 이 없으면 알려준다', threw, true);

section('응답 정리');
t('본문 없는 글은 버린다',
  normalize({ posts: [{ parts: [] }, { parts: ['가'] }] }).value.posts.length, 1);
t('글이 하나도 없으면 실패', normalize({ posts: [] }).ok, false);

/* ── 후킹·프롬프트 ── */
section('후킹과 프롬프트');
t('후킹은 26개', HOOKS.length, 26);
t('자료가 필요한 후킹이 있다', HOOKS.filter((h) => h.needsFacts).length, 4);
const p = buildPrompt('역마살', { ledger: { 12: { lastUsed: '2026-08-01', count: 3 } }, limit: 3 });
/* 지침 파일은 통째로 갈아끼운 적이 있다. 특정 제목을 찾지 말고
   「지침 본문이 실제로 실려 왔는지」를 본다. */
t('지침 전문이 프롬프트에 들어간다',
  p.includes(loadGuideline().trim().slice(0, 40)) && p.length > 14000, true);
t('원장이 프롬프트에 들어간다', p.includes('2026-08-01 · 3회'), true);
t('안 쓴 후킹은 미사용으로', p.includes('미사용'), true);
t('개수 제한이 들어간다', p.includes('정확히 3개만'), true);

/* ── 연작 금지 (한 편으로만 나가야 한다) ── */
section('연작 금지');
const { fixShape } = require('../services/threads/pipeline');
t('모델이 3편을 줘도 한 편만 쓴다', fixShape({ parts: ['가', '나', '다'] }).parts.length, 1);
t('그래서 형태는 늘 single', fixShape({ parts: ['가', '나', '다'] }).form, 'single');
t('첫 편을 남긴다', fixShape({ parts: ['첫', '둘'] }).parts[0], '첫');
t('빈 편은 세지 않는다', fixShape({ parts: ['', '  ', '진짜'] }).parts, ['진짜']);
t('끊은 자리 메모는 남기지 않는다', fixShape({ parts: ['가', '나'], cutNote: '여기서' }).cutNote, '');
const SCHEMA_P = buildPrompt('역마살', { ledger: {}, limit: 1 });
t('예시가 한 편만 보여준다', SCHEMA_P.includes('"1편 본문", "2편 본문"'), false);
t('한 편 규칙이 프롬프트에 있다', SCHEMA_P.includes('form 은 무조건 "single"'), true);

/* ── 모델 고르기 ── */
section('모델 고르기');
const llm = require('../services/threads/llm');
t('추천은 하나만', llm.MODELS.filter((m) => m.recommended).length, 1);
t('모델마다 차이 설명이 있다', llm.MODELS.every((m) => m.note && m.note.length > 20), true);
t('안 고르면 서버 기본값', llm.pickModel(''), llm.DEFAULT_MODEL);
t('고른 것이 있으면 그것', llm.pickModel('gpt-4.1'), 'gpt-4.1');
t('옛 계열은 max_tokens', Object.keys(llm.buildBody('gpt-4o', 'x', {})).includes('max_tokens'), true);
t('옛 계열은 temperature 를 받는다', llm.buildBody('gpt-4o', 'x', {}).temperature, 0.9);
t('새 계열은 max_completion_tokens',
  Object.keys(llm.buildBody('gpt-5', 'x', {})).includes('max_completion_tokens'), true);
t('새 계열엔 temperature 를 안 붙인다', llm.buildBody('gpt-5', 'x', {}).temperature, undefined);
t('o 계열도 새 계열로 본다', llm.isLegacyParamModel('o3'), false);
t('거절당한 항목 이름을 읽어낸다',
  llm.unsupportedParam("Unsupported parameter: 'max_tokens' is not supported"), 'max_tokens');

/* ── 말투 분석 ── */
section('말투 분석');
const voice = require('../services/threads/voice');
t('빈 줄로 글을 가른다',
  voice.splitSamples('첫 번째 글입니다 반갑습니다\n\n두 번째 글입니다 또 뵙네요').length, 2);
t('--- 로도 가른다',
  voice.splitSamples('첫 번째 글입니다 반갑습니다\n---\n두 번째 글입니다 또 뵙네요').length, 2);
t('한 줄짜리는 글로 안 센다', voice.splitSamples('짧다\n\n이건 충분히 긴 글입니다').length, 1);
t('빈 칸은 0개', voice.splitSamples('   ').length, 0);
t('최소 개수를 정해뒀다', voice.MIN_SAMPLES >= 5, true);
const vp = buildVoicePrompt(['글 하나입니다', '글 둘입니다']);
t('말투 프롬프트에 원문이 들어간다', vp.includes('글 하나입니다') && vp.includes('글 둘입니다'), true);
t('지어내지 말라고 적혀 있다', vp.includes('지어내지 마세요'), true);

/* ── 말투 고르기 ── */
section('말투 고르기');
const voices = require('../services/threads/voices');
const { voiceBlock } = require('../services/threads/prompt');
t('프리셋은 4개', voices.PRESETS.length, 4);
t('추천은 하나만', voices.PRESETS.filter((v) => v.recommended).length, 1);
t('프리셋마다 규칙이 있다', voices.PRESETS.every((v) => v.rules.length >= 3), true);
t('없는 이름은 안 받는다', voices.byId('없는것'), null);
const mine = { endings: ['~해'], address: '너', sentenceLen: { avg: 20, max: 30 },
  signaturePhrases: [], bannedWords: [], symbols: { emoji: '', marks: [] },
  toneAxis: {}, ctaPatterns: [], sampleExcerpts: [], lineBreakRhythm: '' };
t('mine 이면 내 팩을 쓴다', voice.resolve({ voiceMode: 'mine', voicePack: mine }), mine);
t('프리셋 이름이면 프리셋으로', voice.resolve({ voiceMode: 'blunt', voicePack: mine }), { preset: 'blunt' });
/* 예전에 쓰던 사람은 voiceMode 가 비어 있다. 뽑아둔 말투가 조용히 꺼지면 안 된다. */
t('안 골랐으면 뽑아둔 팩을 그대로', voice.resolve({ voiceMode: '', voicePack: mine }), mine);
t('둘 다 없으면 없음', voice.resolve({ voiceMode: '', voicePack: null }), null);
t('mine 인데 팩이 없으면 없음', voice.resolve({ voiceMode: 'mine', voicePack: null }), null);
t('프리셋이 프롬프트에 실린다',
  voiceBlock({ preset: 'friendly' }).includes('반말'), true);
t('내 팩이 프롬프트에 실린다', voiceBlock(mine).includes('어미: ~해'), true);
t('아무것도 없으면 기본 말투 안내', voiceBlock(null).includes('아직 말투 팩이 없습니다'), true);

/* ── 벤치마크 ── */
section('벤치마크');
const { loadBenchmark } = require('../services/threads/prompt');
const bm = loadBenchmark();
t('세 유형이 다 있다',
  ['인사 · 무료사주글', '사주 내용글', '댓글 유도글'].every((h) => bm.includes(h)), true);
t('번호로 답하게가 들어갔다', bm.includes('번호로 답하게'), true);
t('처음 오는 사람 우대가 들어갔다', bm.includes('처음이라 더 꼼꼼하게'), true);
t('벤치마크가 프롬프트에 실린다', p.includes('실제로 터진 글'), true);

/* ── 가독성 ── */
section('가독성');
const breaks = (text) => checkPost({ postType: '정보형', form: 'single', parts: [text] })
  .rows.find((r) => r.label === '한 줄에 한 뜻씩 끊음').ok;
/* ⚠️ 사주 글은 마침표를 거의 안 쓴다. 마침표로만 세면 이 검사가 놀고 있게 된다. */
t('마침표 없이 세 문장을 한 줄로 쓰면 막는다',
  breaks('경금 일간은 이런 사람입니다 정리를 잘합니다 딱 잘라 말합니다'), false);
t('줄을 나눠 쓰면 통과',
  breaks('경금 일간은 이런 사람입니다\n정리를 잘합니다\n딱 잘라 말합니다'), true);
t('한 줄이 60자를 넘으면 막는다', breaks('경금 일간은 ' + '가'.repeat(60)), false);
t('길이는 긴데 두 줄뿐이면 막는다',
  breaks('경금 일간은 ' + '가'.repeat(58) + '\n' + '나'.repeat(58)), false);
t('짧은 한 줄은 통과', breaks('현침살은 저주가 잘 맞습니다'), true);

/* 덩어리 — 줄만 나눠도 다닥다닥 붙어 있으면 폰에서는 여전히 벽이다 */
const NL = String.fromCharCode(10);
const blocks = (lines) => checkPost({ postType: '정보형', form: 'single', parts: [lines.join(NL)] })
  .rows.find((r) => r.label === '덩어리 사이를 한 줄 비움').ok;
t('다섯 줄이 빈 줄 없이 붙어 있으면 막는다', blocks([
  '오행이 한쪽에만 몰리면', '억지로 부족한 기운 채우려다가', '오히려 더 지칠 수 있음',
  '없는 걸 메우려고 애쓰지 말고', '강한 쪽을 살리는 게 먼저임']), false);
t('마무리를 빈 줄로 떼면 통과', blocks([
  '오행이 한쪽에만 몰리면', '억지로 부족한 기운 채우려다가', '오히려 더 지칠 수 있음',
  '', '없는 걸 메우려고 애쓰지 말고', '강한 쪽을 살리는 게 먼저임']), true);
t('리스트형 세 덩어리도 통과', blocks([
  '오행이 한쪽으로만 몰린 사람들', '이 세 가지 꼭 겪음', '',
  '1. 주변에서 왜 그렇게 사냐고 함', '2. 남들 다 쉬는데 같은 패턴 반복함', '3. 프레임이 잡히면 못 벗어남',
  '', '본인은 몇 개나 걸리는지 댓글에 남겨봐']), true);
t('줄마다 비우면 막는다 (남발)', blocks([
  '한 줄', '', '두 줄', '', '세 줄', '', '네 줄', '', '다섯 줄']), false);
t('한 줄짜리는 그냥 둔다', blocks(['현침살 사주는 저주가 잘 맞는다']), true);
t('세 줄 글은 붙여 써도 통과', blocks([
  '삼재라고 다 나쁜 건 아닙니다', '정리하는 해예요', '있는 것부터 닫으면 됩니다']), true);
t('빈 줄 두 칸도 한 자리로 센다', blocks([
  '훅 한 줄', '본문 한 줄', '', '', '마무리 한 줄', '덧붙임 한 줄']), true);
t('프롬프트에 빈 줄 규칙이 있다', p.includes('덩어리 사이는 빈 줄 한 줄이다'), true);
t('남발하지 말라고도 적혀 있다', p.includes('남발하면 성의 없어 보인다'), true);

/* ── 소재 추천 ── */
section('소재 추천');
const topics = require('../services/threads/topics');
t('반응 터진 소재에 근거가 다 있다',
  topics.HOT.every((h) => h.why && h.why.length > 15), true);
t('반응 터진 소재가 목록 맨 앞에', topics.ALL.slice(0, topics.HOT.length).every(topics.isHot), true);
t('중복 없이 한 번씩만', topics.ALL.length, new Set(topics.ALL).size);
t('왜 추천인지 물으면 답한다', topics.whyHot('현침살').includes('108,559'), true);
t('아닌 것은 빈 문자열', topics.whyHot('역마살'), '');
const picked = topics.pick(8);
t('8개를 뽑는다', picked.length, 8);
t('겹치지 않는다', picked.length, new Set(picked).size);
/* 전부 무작위로 주면 잘 되는 소재가 밑에 깔려 영영 안 걸린다 */
let hotSeen = 0;
for (let i = 0; i < 200; i++) hotSeen += topics.pick(8).filter(topics.isHot).length;
t('8개 중 둘 이상은 반응 터진 것', hotSeen / 200 >= 2, true);

/* ── 글 모양 다양성 ── */
section('글 모양 다양성');
t('닫는 방식을 여러 개 준다', p.includes('번호로 답하게') && p.includes('몸을 움직이게'), true);
t('전부 질문으로 닫지 말라고 적혀 있다', p.includes('모든 글이 질문으로 끝날 필요는 없다'), true);
t('묶음 안에서 모양을 섞으라고 한다', p.includes('최소 세 가지 모양이 섞여야'), true);
t('생년월일 CTA 는 3분의 1까지', p.includes('3분의 1까지만'), true);

/* ── 인사글 재료 ── */
section('인사글 재료');
const { introBlock, buildFixPrompt } = require('../services/threads/prompt');
t('비어 있으면 인사글을 만들지 말라고 한다',
  introBlock(null).includes('인사글·무료사주 글은 만들지 마세요'), true);
t('셋 다 빈 문자열이어도 같다',
  introBlock({ name: '', career: '', sample: '' }).includes('만들지 마세요'), true);
const ib = introBlock({ name: '루월당사주', career: '10년차', sample: '안녕하세요 반갑습니다' });
t('이름이 들어간다', ib.includes('루월당사주'), true);
t('경력이 들어간다', ib.includes('10년차'), true);
t('첫 줄 예시를 여러 개 준다', ib.includes('안녕, 10년차 루월당사주야') && ib.includes('안녕하세요 루월당사주입니다'), true);
/* 본보기로 주는 문장이라 조사가 틀리면 모델이 그대로 배운다 */
t('받침 없으면 ~야', introBlock({ name: '루월당사주', career: '10년차' }).includes('루월당사주야'), true);
t('받침 있으면 ~이야', introBlock({ name: '하늘문', career: '8년차' }).includes('하늘문이야'), true);
t('긴 경력은 앞 토막만 예시에 쓴다',
  introBlock({ name: '루월당사주', career: '10년차 상담가, 철학관 5년' }).includes('안녕, 10년차 상담가 루월당사주야'), true);
t('매번 같게 쓰지 말라고 한다', ib.includes('매번 같은 문장으로 시작하지 마세요'), true);
t('예시글이 들어간다', ib.includes('안녕하세요 반갑습니다'), true);
t('예시를 베끼지 말라고 한다', ib.includes('그대로 베끼면 안 됩니다'), true);
t('예시 없이 이름만 있어도 만든다',
  introBlock({ name: '루월당사주' }).includes('만들지 마세요'), false);
const pIntro = buildPrompt('역마살', { ledger: {}, limit: 1,
  intro: { name: '루월당사주', career: '10년차', sample: '' } });
t('인사글 재료가 프롬프트에 실린다', pIntro.includes('루월당사주'), true);

/* ── 걸린 글 고쳐 만들기 ── */
section('걸린 글 고쳐 만들기');
const fixP = buildFixPrompt([{ n: 1, parts: ['어떤 글'], problems: ['한 줄에 한 뜻씩 끊음 — 벽입니다'] }], null);
t('원문이 들어간다', fixP.includes('어떤 글'), true);
t('걸린 이유가 그대로 들어간다', fixP.includes('벽입니다'), true);
t('번호를 그대로 쓰라고 한다', fixP.includes('위에서 준 번호를 그대로'), true);
t('새 글을 쓰지 말라고 한다', fixP.includes('새 글을 쓰는 게 아닙니다'), true);
t('빈 줄 규칙도 같이 준다', fixP.includes('덩어리 사이는 빈 줄 한 줄입니다'), true);
t('후킹 이름 금지도 같이 준다', fixP.includes('후킹 이름을 문장에 그대로 쓰지 마세요'), true);

/* ── 글 틀 ── */
section('글 틀');
const FORMS = require('../services/threads/forms');
t('틀마다 설명이 있다', FORMS.FORMS.every((f) => f.hint && f.hint.length > 20), true);
t('틀마다 프롬프트 덩어리가 있다', FORMS.FORMS.every((f) => f.block && f.block.length > 40), true);
t('리스트형은 댓글을 쓴다', !!FORMS.byId('list').reply, true);
t('인사형은 재료가 필요하다', !!FORMS.byId('intro').needsIntro, true);
/* 인사글 재료가 없으면 인사형은 빼야 한다. 두면 없는 경력을 지어낸다. */
t('재료 없으면 인사형을 뺀다',
  FORMS.clean(['intro', 'info'], { hasIntro: false }), ['info']);
t('재료 있으면 남긴다',
  FORMS.clean(['intro', 'info'], { hasIntro: true }), ['intro', 'info']);
t('없는 틀은 버린다', FORMS.clean(['없는것', 'info'], {}), ['info']);
t('겹치면 하나만', FORMS.clean(['info', 'info', 'list'], {}), ['info', 'list']);
/* 다 고르면 결국 아무거나가 된다 */
t('세 개까지만', FORMS.clean(['info', 'list', 'daily', 'question', 'contrast'], {}).length, 3);
t('여러 개면 돌려 쓴다',
  [0, 1, 2, 3].map((n) => FORMS.next(['info', 'list'], n).id), ['info', 'list', 'info', 'list']);
t('안 골랐으면 정보형', FORMS.next([], 0).id, 'info');
t('리스트형은 본문에 항목을 넣지 말라고 한다',
  FORMS.byId('list').block.includes('본문에 리스트를 적으면 댓글을 열 이유가 없어진다'), true);

/* ── 자동 올리기 규칙 ── */
section('자동 올리기 규칙');
const R = require('../services/threads/rules');
t('시각을 08:10 모양으로 맞춘다', [R.hhmm('8:5'), R.hhmm('08:10'), R.hhmm('25:00'), R.hhmm('x')],
  ['08:05', '08:10', '', '']);
const sat = new Date('2026-09-05T00:00:00+09:00');   // 토요일 0시 KST
const kstOf = (d) => {
  const k = new Date(d.getTime() + 9 * 3600 * 1000);
  return R.DAY_NAMES[k.getUTCDay()] + ' ' +
    String(k.getUTCHours()).padStart(2, '0') + ':' + String(k.getUTCMinutes()).padStart(2, '0');
};
t('다음 월요일 08:10', kstOf(R.nextSlotTime({ day: 1, time: '08:10' }, sat)), '월 08:10');
t('오늘 늦은 시각은 오늘', kstOf(R.nextSlotTime({ day: 6, time: '21:05' }, sat)), '토 21:05');
/* 이미 지난 시각이면 다음 주 같은 요일로 넘어가야 한다 */
const satNight = new Date('2026-09-05T22:00:00+09:00');
t('지난 시각은 다음 주로', R.nextSlotTime({ day: 6, time: '21:05' }, satNight).getTime() >
  satNight.getTime() + 6 * 24 * 3600 * 1000, true);

const rule = { id: 'r1', slots: [{ day: 1, time: '08:10' }, { day: 3, time: '12:40' }], jitterMin: 7 };
const up = R.upcoming(rule, 24 * 7, sat);
t('일주일 안이면 둘 다 잡힌다', up.length, 2);
t('이른 순으로', up[0].at < up[1].at, true);
/* 볼 때마다 값이 바뀌면 「몇 시에 올라가나」를 알 수 없다 */
t('흔든 값은 늘 같다',
  R.upcoming(rule, 24 * 7, sat)[0].sendAt.getTime(), up[0].sendAt.getTime());
t('흔드는 폭 안에 있다',
  Math.abs(up[0].sendAt - up[0].at) <= 7 * 60 * 1000, true);
t('흔들기 0이면 그대로', R.upcoming(Object.assign({}, rule, { jitterMin: 0 }), 24 * 7, sat)[0].sendAt.getTime(),
  up[0].at.getTime());

/* 매일 같은 시각이면 기계로 잡힌다 — 저장은 시켜주되 경고한다 */
t('같은 시각이 셋이면 경고',
  R.sameTimeWarning([{ day: 1, time: '09:00' }, { day: 2, time: '09:00' }, { day: 3, time: '09:00' }])
    .includes('계정이 멈춥니다'), true);
t('시각이 흩어져 있으면 조용',
  R.sameTimeWarning([{ day: 1, time: '08:10' }, { day: 3, time: '12:40' }, { day: 5, time: '21:05' }]), '');
t('두 개뿐이면 경고 안 함',
  R.sameTimeWarning([{ day: 1, time: '09:00' }, { day: 2, time: '09:00' }]), '');

const cleaned = R.clean({
  slots: [{ day: 1, time: '8:10' }, { day: 1, time: '08:10' }, { day: 9, time: '25:00' }],
  jitterMin: 99, topics: ['  역마살  ', ''], forms: ['info', 'intro'], mode: '아무거나',
}, { hasIntro: false });
t('겹친 슬롯은 하나만', cleaned.slots.length, 1);
t('시각을 다듬는다', cleaned.slots[0].time, '08:10');
t('흔들기는 30분까지', cleaned.jitterMin, 30);
t('빈 키워드는 버린다', cleaned.topics, ['역마살']);
t('재료 없으면 인사형 빠짐', cleaned.forms, ['info']);
t('이상한 mode 는 안 받는다', cleaned.mode, undefined);

/* ── 오늘의 운세 날짜 ── */
section('오늘의 운세 날짜');
const today = require('../services/threads/today');
/* 36시간 앞서 만들기 때문에 「지금」이 아니라 「올라갈 날」을 봐야 한다 */
const mon = today.forDate(new Date('2026-09-07T08:16:00+09:00'));
t('날짜를 한국 시각으로 읽는다', [mon.month, mon.day, mon.dayName], [9, 7, '월']);
t('일진을 만세력으로 계산한다', mon.ganji, '甲申');
t('한글로도 준다', mon.ganjiKo, '갑신');
t('일간과 오행도 준다', [mon.dayStem, mon.element], ['갑', '목']);
/* 자정 언저리에서 날짜가 밀리면 안 된다 (서버는 UTC 로 돈다) */
t('한국 자정 직후는 그 날',
  [today.forDate(new Date('2026-09-07T00:05:00+09:00')).day], [7]);
t('한국 자정 직전은 전날',
  [today.forDate(new Date('2026-09-06T23:55:00+09:00')).day], [6]);
t('하루 지나면 일진도 넘어간다',
  today.forDate(new Date('2026-09-08T08:00:00+09:00')).ganjiKo !== mon.ganjiKo, true);
const tb = today.block(new Date('2026-09-07T08:16:00+09:00'));
t('올라갈 날이라고 못 박는다', tb.includes('지금이 아니라 이 날 올라갑니다'), true);
t('날짜가 덩어리에 들어간다', tb.includes('9월 7일 월요일'), true);
t('일진이 덩어리에 들어간다', tb.includes('갑신일'), true);
t('지어내지 말라고 한다', tb.includes('간지를 지어내지 마세요'), true);
/* 못 구했으면 지어내느니 빼라고 해야 한다 */
t('못 읽는 날짜면 적지 말라고 한다',
  today.block(new Date('아무거나')).includes('적지 마세요'), true);
t('오늘의 운세 틀은 날짜가 필요하다', !!FORMS.byId('daily').needsDate, true);
t('다른 틀은 날짜를 안 받는다', !!FORMS.byId('info').needsDate, false);

/* ── 오늘의 운세 틀 ── */
section('오늘의 운세 틀');
const { dailyBlock, chainBlock } = require('../services/threads/prompt');
t('안 넣었으면 아무것도 안 실린다', dailyBlock(null), '');

/* 실제 계정 모양 — 짧아도 두 편으로 나눈다 */
const twoPart = {
  body: [
    '오늘은 감정 따라 움직였다가 후회할 띠 있음', '',
    '9월 4일 오늘의 운세', '',
    '🍀 운 좋은 띠', '🐭 쥐띠',
  ].join(NL),
  tail: [
    '좋은 흐름을 타는 띠는', '연결이 붙기 좋고', '',
    '특히 오늘은', '말보다 행동을 보는 날',
  ].join(NL),
  mode: 'chain',
};
const dbChain = dailyBlock(twoPart);
t('1편이 실린다', dbChain.includes('🍀 운 좋은 띠'), true);
t('2편도 실린다', dbChain.includes('말보다 행동을 보는 날'), true);
/* 길이를 보고 합쳐버리면 그 계정 모양이 아니게 된다 */
t('짧아도 나누라고 못 박는다', dbChain.includes('짧아도 두 편으로 나눠'), true);
t('길이 보고 합치지 말라고 한다', dbChain.includes('길이를 보고 합치지 마세요'), true);
t('번호는 적지 말라고 한다', dbChain.includes('번호는 **적지 마세요.**'), true);
t('띠 개수까지 맞추라고 한다', dbChain.includes('그 개수까지 맞추세요'), true);

const dbReply = dailyBlock(Object.assign({}, twoPart, { mode: 'reply' }));
t('댓글 모드면 reply 에 담으라고 한다', dbReply.includes('reply 칸**에 담으세요'), true);
t('댓글 모드면 두 편 이야기는 없다', dbReply.includes('짧아도 두 편으로 나눠'), false);

const dbOne = dailyBlock({ body: '한 편짜리 운세', mode: 'single' });
t('한 편 모드면 한 편이라고 한다', dbOne.includes('한 편으로** 올립니다'), true);

/* 예전에 { sample, asReply } 로 저장해둔 사람이 있다 */
t('예전 모양도 계속 읽는다', dailyBlock({ sample: '옛날 운세 글' }).includes('옛날 운세 글'), true);
t('예전 asReply 도 읽는다',
  dailyBlock({ sample: '본문', tail: '댓글', asReply: true }).includes('reply 칸**에 담으세요'), true);

/* 운세 틀은 그 틀일 때만 실려야 한다 */
const notDaily = buildPrompt('역마살', { ledger: {}, limit: 1, daily: { body: '내 운세 글' } });
t('운세 틀이 아니면 안 실린다', notDaily.includes('내 오늘의 운세 틀'), false);
const isDaily = buildPrompt('오늘의 운세',
  { ledger: {}, limit: 1, wantsDaily: true, daily: { body: '내 운세 글' } });
t('운세 틀이면 실린다', isDaily.includes('내 운세 글'), true);
/* 띠로 갈라 쓰는 게 실제 스타일이다. 예전엔 갈라 쓰지 말라고 되어 있었다. */
t('띠로 갈라도 된다고 한다', FORMS.byId('daily').block.includes('띠로 갈라 줘도 된다'), true);
t('열둘을 다 쓰지 말라고 한다', FORMS.byId('daily').block.includes('열둘을 다 쓰지 마라'), true);
t('내 틀이 규칙보다 우선이라고 한다',
  FORMS.byId('daily').block.includes('그 틀이 이 규칙보다 우선한다'), true);

/* ── 나누기 (틀이 정한다) ── */
section('나누기');
/* 전역 「이어붙이기」 스위치는 없앴다. 리스트형이 스케줄러에 생기면서
   같은 일을 두 군데서 하게 됐기 때문이다. 이제 나누는 건 틀이 정한다. */
t('기본은 한 편', fixShape({ parts: ['가', '나', '다'] }).parts.length, 1);
t('틀이 정하면 그만큼',
  fixShape({ parts: ['가', '나', '다'] }, { chain: { on: true, max: 2 } }).parts.length, 2);
t('번호 여부를 흘리지 않는다', fixShape({ parts: ['가'], numbered: true }).numbered, true);
/* 편이 여럿인 것은 틀이 정한 것이라 「한 편으로 끝남」으로 막으면 안 된다 */
const twoPartPost = { postType: '정보형', form: 'chain',
  parts: ['경금 일간은 이렇습니다', '이어지는 글입니다'] };
t('여러 편이면 통과시킨다',
  checkPost(Object.assign({}, twoPartPost, { allowChain: true }))
    .rows.find((r) => r.label === '한 편으로 끝남').ok, true);
t('허락 없으면 막는다',
  checkPost(twoPartPost).rows.find((r) => r.label === '한 편으로 끝남').ok, false);

/* ── 만들기 함수가 실제로 도는가 ── */
section('만들기 함수');
/* ⚠️ 여기가 비어 있어서 사고가 났다.
   조각들은 다 통과하는데 generate() 를 한 번도 안 돌려봐서
   「Cannot access 'dailyChain' before initialization」이 배포까지 나갔다.
   DB 도 OpenAI 도 없이 껍데기를 끼워 흐름만 한 번 통과시킨다. */
{
  const Module = require('module');
  const origLoad = Module._load;
  const fakeAi = {
    topic: '역마살', situation: '',
    hookScan: [], unusable: [],
    posts: [{
      hooks: [1], postType: '정보형', form: 'single',
      parts: ['경금 일간은 거절을 못 합니다' + NL + '그래서 일이 몰립니다' + NL + NL + '본인은 어떠신가요'],
      reply: '', cta: false,
    }],
  };
  const settings = {
    facts: [], ctaLink: '', intro: null, model: '', voiceMode: '', voicePack: null,
    daily: { body: '내 운세 1편', tail: '내 운세 2편', mode: 'chain' },
  };
  /* store · llm 만 껍데기로 갈아끼운다. 나머지는 진짜 코드를 탄다. */
  Module._load = function (req, parent, isMain) {
    if (req === './store') {
      return { getSettings: async () => settings, getLedger: async () => ({}) };
    }
    if (req === './llm') {
      return { runAi: async () => ({ text: JSON.stringify(fakeAi), usage: null }) };
    }
    return origLoad.apply(this, arguments);
  };
  delete require.cache[require.resolve('../services/threads/pipeline')];
  const freshPipe = require('../services/threads/pipeline');
  Module._load = origLoad;

  let out = null, err = null;
  freshPipe.generate(1, 'sk-test', '역마살', 1, null)
    .then((r) => { out = r; })
    .catch((e) => { err = e; });

  /* 위 약속이 끝난 뒤에 확인해야 한다 */
  setTimeout(() => {
    t('generate 가 터지지 않는다', err ? err.message : '터지지 않음', '터지지 않음');
    t('글이 나온다', !!(out && out.posts && out.posts.length), true);
    t('지침 점검이 붙어 나온다', !!(out && out.posts[0].check), true);

    /* 운세 틀로도 한 번 — dailyChain 이 실제로 쓰이는 길이다 */
    const dailyForm = require('../services/threads/forms').byId('daily');
    freshPipe.generate(1, 'sk-test', '오늘의 운세', 1, { form: dailyForm, at: new Date() })
      .then(() => { t('운세 틀로도 터지지 않는다', true, true); done(); })
      .catch((e) => { t('운세 틀로도 터지지 않는다', e.message, true); done(); });
  }, 60);
}

/* 위 검사가 비동기라 마지막 줄을 미뤄야 한다 */
function done() {
  console.log('\n' + (fail ? '✗ ' : '✓ ') + '통과 ' + pass + ' · 실패 ' + fail);
  process.exit(fail ? 1 : 0);
}

/* ── 막는 것과 고치면 좋은 것 ── */
section('막는 것과 권하는 것');
/* ⚠️ 예전엔 지침을 다 지켜야만 올릴 수 있었다. 그래서 「테스트」 세 글자를
   시험 삼아 올려보는 것도 막혔다. 이제 길이만 막고 나머지는 권한다. */
const tiny = checkPost({ postType: '정보형', form: 'single', parts: ['테스트'] });
t('짧은 글도 올릴 수는 있다', tiny.passBlock, true);
t('다만 지침은 못 지켰다고 알려준다', tiny.passHard, false);
t('무엇을 고치면 좋은지 준다', tiny.advice.length >= 1, true);
t('고칠 것에 사주 근거가 들어 있다', tiny.advice.indexOf('사주를 실제로 가리킴') >= 0, true);

const tooLong = checkPost({ postType: '정보형', form: 'single', parts: ['가'.repeat(600)] });
t('500자를 넘으면 못 올린다', tooLong.passBlock, false);
/* 스레드가 안 받는 길이라 이것만은 막아야 한다 */
t('막는 것은 길이 하나뿐',
  tooLong.rows.filter((r) => r.blocking).map((r) => r.label), ['모든 편 500자 이내']);

const good = checkPost({ postType: '정보형', form: 'single',
  parts: ['경금 일간은 거절을 못 합니다' + NL + '그래서 일이 몰립니다'] });
t('멀쩡한 글은 둘 다 통과', [good.passBlock, good.passHard], [true, true]);
t('멀쩡하면 고칠 것도 없다', good.advice.length, 0);

/* 자동은 사람이 안 보고 나간다 — 지침을 다 지킨 글만 */
const pubSrc = require('fs')
  .readFileSync(require('path').join(__dirname, '..', 'services', 'threads', 'publish.js'), 'utf8');
t('사람이 올릴 땐 길이만 막는다', /if \(!check\.passBlock\)/.test(pubSrc), true);
t('자동일 땐 지침을 다 본다', /if \(auto && !check\.passHard\)/.test(pubSrc), true);
const autoSrc3 = require('fs')
  .readFileSync(require('path').join(__dirname, '..', 'services', 'threads', 'autopost.js'), 'utf8');
t('자동 예약은 auto 로 부른다', /scheduleAt\([^)]*\{ auto: true \}\)/.test(autoSrc3), true);

/* ── 틀이 주제를 이기는가 ── */
section('틀과 주제');
/* ⚠️ 「오늘의 운세」를 고르고 키워드에 「역마살」을 적었더니
   프롬프트에 「주제: 역마살」과 「이번 글은 오늘의 운세」가 같이 들어가
   모델이 주제를 따라가 일간별 정보글이 나왔다. 틀이 이겨야 한다. */
const autoSrc2 = require('fs')
  .readFileSync(require('path').join(__dirname, '..', 'services', 'threads', 'autopost.js'), 'utf8');
t('운세와 인사는 주제를 스스로 정한다',
  /FIXED_TOPIC = \{[^}]*daily:[^}]*intro:/.test(autoSrc2.replace(/\n/g, '')), true);
t('주제를 고를 때 틀을 본다', /pickTopic\(rule, cursor, form\)/.test(autoSrc2), true);
t('모델이 고친 주제로 덮어쓰지 않는다', /FIXED_TOPIC\[form\.id\] \|\| out\.topic/.test(autoSrc2), true);
t('슬롯이 정한 틀을 먼저 쓴다', /s\.slot\.form && forms\.byId\(s\.slot\.form\)/.test(autoSrc2), true);
/* 슬롯마다 틀을 못 박을 수 있어야 「토 아침은 운세」가 된다 */
const slotForm = R.clean({ slots: [{ day: 6, time: '08:10', form: 'daily' }] }, {}).slots[0];
t('슬롯에 틀이 붙는다', slotForm.form, 'daily');
t('슬롯 이름표에 틀이 보인다', R.slotLabel(slotForm), '토 08:10 · 오늘의 운세');
t('없는 틀은 안 붙는다',
  R.clean({ slots: [{ day: 6, time: '08:10', form: '없는것' }] }, {}).slots[0].form, undefined);
t('재료 없으면 인사형은 안 붙는다',
  R.clean({ slots: [{ day: 6, time: '08:10', form: 'intro' }] }, { hasIntro: false }).slots[0].form, undefined);

/* ── 댓글 유도 고르기 ── */
section('댓글 유도 고르기');
const pAsk = buildPrompt('역마살', { ledger: {}, limit: 1, askComments: true });
const pNo = buildPrompt('역마살', { ledger: {}, limit: 1, askComments: false });
const pAuto = buildPrompt('역마살', { ledger: {}, limit: 1 });
t('받기로 하면 그렇게 이른다', pAsk.includes('댓글을 받는 것이 목적'), true);
t('받기로 하면 그냥 끊기를 막는다', pAsk.includes('④(그냥 끊기)는 이번에는 쓰지 마라'), true);
t('안 받기로 하면 질문을 막는다', pNo.includes('질문으로 닫지 마라'), true);
t('안 받기인데 받으라고 하지 않는다', pNo.includes('댓글을 받는 것이 목적'), false);
t('안 고르면 둘 다 없다',
  pAuto.includes('댓글을 받는 것이 목적') || pAuto.includes('조르지 않는다'), false);
t('규칙에 저장된다', R.clean({ askComments: 'yes' }, {}).askComments, 'yes');
t('이상한 값은 안 받는다', R.clean({ askComments: '아무거나' }, {}).askComments, undefined);

/* ── 말투 — 줄 수로도 열어준다 ── */
section('말투 분량 판정');
/* ⚠️ 스레드 글을 그대로 긁어 붙이면 사이가 안 띄어져 「글 1개」로 읽힌다.
   스무 줄을 넣어도 안 열려서 아무리 붙여넣어도 분석이 안 되던 자리다. */
const glue = (n) => Array.from({ length: n }, (_, i) => '운 좋은 띠는 이런 흐름입니다 ' + (i + 1)).join(NL);
t('한 덩어리라도 줄이 넉넉하면 열린다', voice.enough(glue(30)).ok, true);
t('줄이 모자라면 안 열린다', voice.enough(glue(12)).ok, false);
t('막힐 땐 무엇이 모자란지 알려준다',
  voice.enough(glue(12)).why.includes('글 1개 · 12줄'), true);
t('빈 줄로 나눈 10개는 열린다',
  voice.enough(Array.from({ length: 10 }, (_, i) => '열 개짜리 글입니다 반갑습니다 ' + i).join(NL + NL)).ok, true);
t('빈 칸은 안 열린다', voice.enough('').ok, false);
t('줄 수를 센다', voice.lineCount(glue(7)), 7);
t('빈 줄은 안 센다', voice.lineCount('가나다' + NL + '' + NL + '라마바'), 2);

/* ── 같은 자리를 두 번 만들지 않기 ── */
section('같은 자리 두 번 안 만들기');
/* ⚠️ 돈이 새던 자리다.
   찾을 때는 정한 시각(08:10)으로, 저장할 때는 어긋낸 시각(08:16)으로 썼다.
   그래서 영영 못 찾고 5분마다 같은 자리를 다시 만들었다.
   autopost.js 가 두 곳에서 **같은 값**을 쓰는지 글자로 확인한다. */
const autoSrc = require('fs')
  .readFileSync(require('path').join(__dirname, '..', 'services', 'threads', 'autopost.js'), 'utf8');
t('찾을 때 sendAt 을 쓴다', /taken\(rule\.userId, rule\.id, s\.sendAt\)/.test(autoSrc), true);
t('저장할 때도 sendAt 을 쓴다', /slotAt: s\.sendAt\.toISOString\(\)/.test(autoSrc), true);
t('정한 시각(at)으로 찾지 않는다', /taken\([^)]*s\.at\)/.test(autoSrc), false);
/* 어긋낸 값이 볼 때마다 바뀌면 위 둘이 같아도 소용이 없다 */
const jr = { id: 'r1', slots: [{ day: 1, time: '08:10' }], jitterMin: 7 };
const base = new Date('2026-09-05T00:00:00+09:00');
t('어긋낸 값은 몇 번을 봐도 같다',
  R.upcoming(jr, 24 * 7, base)[0].sendAt.getTime(),
  R.upcoming(jr, 24 * 7, base)[0].sendAt.getTime());

/* 마지막 줄은 done() 이 찍는다 — 「만들기 함수」 검사가 비동기라
   여기서 끝내버리면 그 결과를 못 보고 나간다. */
