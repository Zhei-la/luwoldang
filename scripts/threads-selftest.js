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
/* ⚠️ 예시글이 있으면 **그것이 주인**이다.
   예전엔 여기서 「안녕, 10년차 ○○이야」 같은 본보기를 먼저 보여줬다.
   그랬더니 모델이 본인 예시글을 통째로 무시하고 그 본보기를 따라
   「운결담이야. 10년차 사주 상담가」로 시작해 버렸다. */
t('예시글이 있으면 내 본보기는 안 준다',
  ib.includes('안녕, 10년차 루월당사주야'), false);
t('예시글이 서식이라고 못 박는다', ib.includes('이것이 서식입니다'), true);
t('줄 차례를 준다', ib.includes('줄 차례 (이 순서 그대로)'), true);
t('이름·경력은 끼워 넣는 재료',
  ib.includes('그 자리에 그대로** 끼워 넣습니다'), true);
t('첫 줄을 바꾸지 말라고 한다', ib.includes('첫 줄을 제 마음대로 바꾸지 마세요'), true);
/* 예시글이 없을 때는 본보기가 있어야 한다 — 아무것도 없으면 지어낸다 */
const ibNo = introBlock({ name: '루월당사주', career: '10년차', sample: '' });
t('예시글이 없으면 본보기를 준다',
  ibNo.includes('안녕, 10년차 루월당사주야') && ibNo.includes('안녕하세요 루월당사주입니다'), true);
/* 본보기로 주는 문장이라 조사가 틀리면 모델이 그대로 배운다 */
t('받침 없으면 ~야', introBlock({ name: '루월당사주', career: '10년차' }).includes('루월당사주야'), true);
t('받침 있으면 ~이야', introBlock({ name: '하늘문', career: '8년차' }).includes('하늘문이야'), true);
t('긴 경력은 앞 토막만 예시에 쓴다',
  introBlock({ name: '루월당사주', career: '10년차 상담가, 철학관 5년' }).includes('안녕, 10년차 상담가 루월당사주야'), true);
t('매번 같게 쓰지 말라고 한다', ibNo.includes('매번 같은 문장으로 시작하지 마세요'), true);
t('예시글이 들어간다', ib.includes('안녕하세요 반갑습니다'), true);
t('예시를 베끼지 말라고 한다', ib.includes('그대로 베끼지는 마세요'), true);
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

/* ── 왜 안 도는지 알려주기 ── */
section('규칙 진단');
/* 「저장했는데 아무것도 안 올라간다」가 제일 답답하다. 로그를 볼 수 없으니
   화면이 이유를 말해줘야 한다. */
const okCtx = { hasKey: true, allowPublish: true, hasAccount: true, filled: 0 };
/* 10시간 뒤 자리 하나. 요일만 맞추고 시각을 00:00 으로 두면
   그 요일이 이미 지나서 다음 주로 밀려버린다 — 시·분까지 같이 맞춘다. */
const soonAt = new Date(Date.now() + 10 * 3600000 + 9 * 3600000);   // 한국 시각
const live = { id: 'd1', enabled: true, jitterMin: 0, mode: 'draft',
  slots: [{
    day: soonAt.getUTCDay(),
    time: String(soonAt.getUTCHours()).padStart(2, '0') + ':' +
          String(soonAt.getUTCMinutes()).padStart(2, '0'),
  }] };
t('시험용 자리는 36시간 안에 있다', R.upcoming(live, 36).length, 1);
t('꺼져 있으면 그렇게 말한다',
  R.diagnose({ id: 'x', enabled: false, slots: [{ day: 1, time: '08:10' }] }, okCtx).why
    .includes('꺼져 있습니다'), true);
t('자리가 없으면 그렇게 말한다',
  R.diagnose({ id: 'x', enabled: true, slots: [] }, okCtx).why.includes('올릴 자리가 없습니다'), true);
t('키가 없으면 그렇게 말한다',
  R.diagnose({ id: 'x', enabled: true, slots: [{ day: 1, time: '08:10' }] },
    Object.assign({}, okCtx, { hasKey: false })).why.includes('OpenAI 키가 없습니다'), true);
/* 바로 예약까지 하는 규칙만 계정·허용이 필요하다 */
t('바로 예약인데 계정이 없으면 막힌다',
  R.diagnose({ id: 'x', enabled: true, mode: 'publish', slots: [{ day: 1, time: '08:10' }] },
    Object.assign({}, okCtx, { hasAccount: false })).ok, false);
t('원고로만 두면 계정이 없어도 돈다',
  R.diagnose({ id: 'x', enabled: true, mode: 'draft', slots: [{ day: 1, time: '08:10' }] },
    Object.assign({}, okCtx, { hasAccount: false, allowPublish: false })).ok, true);
t('바로 예약인데 올리기가 잠겨 있으면 막힌다',
  R.diagnose({ id: 'x', enabled: true, mode: 'publish', slots: [{ day: 1, time: '08:10' }] },
    Object.assign({}, okCtx, { allowPublish: false })).why.includes('잠겨 있습니다'), true);
/* 멀쩡한데 할 일이 없는 것과, 막힌 것은 다르다 */
t('이미 채워뒀으면 그렇게 말한다',
  R.diagnose(live, Object.assign({}, okCtx, { filled: 9 })).why.includes('이미 다 만들어뒀습니다'), true);
t('채울 게 남았으면 개수를 말한다',
  R.diagnose(live, okCtx).why.includes('만듭니다'), true);
t('할 일이 없어도 막힌 것은 아니다', R.diagnose(live, Object.assign({}, okCtx, { filled: 9 })).ok, true);

/* ── 사주를 가리켰는지 (자동 예약의 급소) ── */
section('사주 근거 판정');
const { pointsToSaju } = require('../services/threads/guideline');
/* 자동은 지침을 다 지킨 글만 내보낸다. 그래서 이 판정이 틀리면
   멀쩡한 글이 통째로 안 나간다. 실제로 그렇게 막혀 있었다 —
   「목일간은 먼저 움직이고 토일간은 관찰합니다」가 근거 없음으로 잡혔다. */
t('오행+일간을 근거로 본다', pointsToSaju('목일간은 먼저 움직입니다'), true);
t('띄어 써도 잡는다', pointsToSaju('화 일간이 강하면'), true);
t('순서가 뒤집혀도 잡는다', pointsToSaju('일간이 수인 사람'), true);
t('오행 이야기도 근거다', pointsToSaju('오행이 치우친 사주'), true);
t('예전부터 되던 것도 그대로', pointsToSaju('갑목 일간은'), true);
t('기운 이야기도 그대로', pointsToSaju('수 기운이 없으면'), true);
t('신살도 그대로', pointsToSaju('역마살이 둘이면'), true);
/* 오행은 한 글자라 아무 데나 걸리면 안 된다 */
t('요일은 근거가 아니다', pointsToSaju('수요일에 만나요'), false);
t('금방도 근거가 아니다', pointsToSaju('금방 끝납니다'), false);
t('토요일도 근거가 아니다', pointsToSaju('토요일 저녁에 봅시다'), false);
t('사주 얘기가 없으면 없는 것', pointsToSaju('오늘은 좋은 날입니다'), false);

/* ── 오류 문구 풀어주기 ── */
section('오류 문구');
/* 「일 23:35: 예약 실패 — 지침에 걸립니다 — 사주를 실제로 가리킴」만 봐서는
   무엇을 어떻게 하라는 건지 알 수가 없다. 화면에서 풀어준다.
   화면 코드라 여기서는 「풀어주는 자리가 있는지」와 자리 인식 규칙만 본다. */
const viewSrc = require('fs').readFileSync(
  require('path').join(__dirname, '..', 'views', 'dash', 'threads-auto.ejs'), 'utf8');
t('오류를 풀어주는 자리가 있다', /function errorHelp\(/.test(viewSrc), true);
t('지침 오류를 풀어준다', viewSrc.indexOf('지침에 걸려서 <b>예약하지 않았습니다</b>') > 0, true);
t('올리기 잠김도 풀어준다', viewSrc.indexOf('스레드에 올리기 허용') > 0, true);
t('키 없음도 풀어준다', viewSrc.indexOf('OpenAI 키가 없어 글을 만들지 못했습니다') > 0, true);
/* 「일 23:35: 자리」처럼 콜론이 딸려오면 우습다 */
const whereRe = /^([일월화수목금토]\s\d{1,2}:\d{2})/;
t('자리만 떼어낸다',
  ('일 23:35: 예약 실패 — 지침에 걸립니다'.match(whereRe) || [])[1], '일 23:35');
t('자리가 없는 오류도 받아준다', whereRe.test('OpenAI 키가 없습니다'), false);

/* ── 화면 안내 ── */
section('화면 안내');
/* 규칙을 저장해도 글은 5분 뒤에 생긴다. 안 적어두면 「저장했는데 왜 없냐」가 된다. */
t('저장 뒤 언제 생기는지 알려준다', viewSrc.indexOf('글은 바로 안 생깁니다') > 0, true);
t('비어 있을 때도 알려준다', viewSrc.indexOf('규칙을 켜두면 <b>5분 안에</b>') > 0, true);
/* 더하기 칸 기본 시각을 08:10 로 박아두면 매번 지워야 한다 */
t('기본 시각은 지금으로', /function nowTime\(/.test(viewSrc), true);
t('08:10 을 박아두지 않는다', viewSrc.indexOf('class="t" value="08:10"') > 0, false);

/* ── 화면 스크립트 ── */
section('화면 스크립트');
/* ⚠️ EJS 는 렌더만 되면 통과다. 그 안의 <script> 가 깨져도 서버는 200 을 준다.
   실제로 문자열에 진짜 줄바꿈이 들어가 「올라갈 글」이 통째로 안 그려졌는데
   렌더 검사는 다 통과했다. 그래서 문법을 따로 본다. */
let viewOk = false;
try {
  require('child_process').execFileSync(
    process.execPath, [require('path').join(__dirname, 'view-check.js')], { stdio: 'pipe' }
  );
  viewOk = true;
} catch (e) { viewOk = false; }
t('화면 안 자바스크립트가 성한가', viewOk, true);

/* ── 지난 자리 다음으로 밀기 ── */
section('지난 자리 밀기');
/* ⚠️ 시각이 지났는데 안 올라간 원고가 그대로 남아 「올라갈 글」에
   어제 자리가 계속 떠 있었다. 자리만 다음 차례로 옮겨준다. */
const rollRule = { id: 'r9', jitterMin: 7,
  slots: [{ day: 1, time: '08:10' }, { day: 3, time: '12:40' }] };
/* 저장된 시각은 어긋내기가 얹혀 있어 슬롯 시각과 딱 안 맞는다 */
t('어긋난 시각에서도 슬롯을 되찾는다',
  R.slotOf(rollRule, new Date('2026-09-07T08:16:00+09:00')), { day: 1, time: '08:10' });
t('반대로 어긋나도 찾는다',
  R.slotOf(rollRule, new Date('2026-09-07T08:04:00+09:00')), { day: 1, time: '08:10' });
t('어긋내기 폭을 넘으면 못 찾는다',
  R.slotOf(rollRule, new Date('2026-09-07T09:30:00+09:00')), null);
t('요일이 다르면 못 찾는다',
  R.slotOf(rollRule, new Date('2026-09-08T08:10:00+09:00')), null);
t('다른 슬롯도 제대로 찾는다',
  R.slotOf(rollRule, new Date('2026-09-09T12:40:00+09:00')), { day: 3, time: '12:40' });
/* 민 자리는 반드시 지금보다 뒤여야 한다 */
const past = new Date('2026-09-07T08:16:00+09:00');
const rolled = R.nextSlotTime(R.slotOf(rollRule, past), new Date('2026-09-08T00:00:00+09:00'));
t('민 자리는 앞으로 온다', rolled.getTime() > new Date('2026-09-08T00:00:00+09:00').getTime(), true);
const autoSrc4 = require('fs')
  .readFileSync(require('path').join(__dirname, '..', 'services', 'threads', 'autopost.js'), 'utf8');
t('원고만 민다', /status = 'draft'[\s\S]{0,60}slot_at < \$3/.test(autoSrc4), true);
/* 예약까지 걸린 글을 밀면 Zernio 가 든 것과 화면이 어긋난다 */
t('밀기를 먼저 하고 채운다',
  autoSrc4.indexOf('rollForward(rule)') < autoSrc4.indexOf('rules.plan(rule, LOOKAHEAD_DAYS)'), true);
t('시각을 고칠 수 있게 열어뒀다',
  /slotAt: \['slot_at'/.test(require('fs').readFileSync(
    require('path').join(__dirname, '..', 'services', 'threads', 'store.js'), 'utf8')), true);

/* ── 막는 것과 고치면 좋은 것 ── */
section('막는 것과 권하는 것');
/* ⚠️ 예전엔 지침을 다 지켜야만 올릴 수 있었다. 그래서 「테스트」 세 글자를
   시험 삼아 올려보는 것도 막혔다. 이제 길이만 막고 나머지는 권한다. */
const tiny = checkPost({ postType: '정보형', form: 'single', parts: ['테스트'] });
t('짧은 글도 올릴 수는 있다', tiny.passBlock, true);
t('다만 지침은 못 지켰다고 알려준다', tiny.passHard, false);
t('무엇을 고치면 좋은지 준다', tiny.advice.length >= 1, true);
t('고칠 것에 사주 근거가 들어 있다',
  tiny.advice.some((a) => a.indexOf('사주를 실제로 가리킴') === 0), true);
/* 이름표만 주면 「사주를 실제로 가리킴」이 무슨 말인지 알 수가 없다 */
t('무엇을 적어야 하는지까지 알려준다',
  tiny.advice.some((a) => a.indexOf('일간·오행·십성·신살') > 0), true);

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
t('자동 예약은 auto 로 부른다', /scheduleAt\([\s\S]{0,120}auto: true/.test(autoSrc3), true);
/* 계정을 두세 개 돌리면 규칙마다 자기 계정으로 나가야 한다 */
t('규칙의 계정으로 예약한다',
  /scheduleAt\([\s\S]{0,160}accountId: rule\.accountId/.test(autoSrc3), true);
t('규칙의 계정 몫 설정으로 만든다',
  autoSrc3.indexOf('store.getSettings(rule.userId, rule.accountId') > 0, true);
t('글도 그 계정 말투로 만든다',
  /pipeline\.generate\([\s\S]{0,220}accountId: rule\.accountId/.test(autoSrc3), true);

/* ── 틀이 주제를 이기는가 ── */
section('틀과 주제');
/* ⚠️ 「오늘의 운세」를 고르고 키워드에 「역마살」을 적었더니
   프롬프트에 「주제: 역마살」과 「이번 글은 오늘의 운세」가 같이 들어가
   모델이 주제를 따라가 일간별 정보글이 나왔다. 틀이 이겨야 한다. */
const autoSrc2 = require('fs')
  .readFileSync(require('path').join(__dirname, '..', 'services', 'threads', 'autopost.js'), 'utf8');
t('운세와 인사는 주제를 스스로 정한다',
  /FIXED_TOPIC = \{[^}]*daily:[^}]*intro:/.test(autoSrc2.replace(/\n/g, '')), true);
t('주제를 고를 때 틀을 본다', /pickTopic\(rule, cursor, form, recent\)/.test(autoSrc2), true);

/* ── 키워드를 비워뒀을 때 ──
   ⚠️ 예전엔 인기 소재 여덟 개만 차례로 돌았다. 여덟 번이면 한 바퀴라
      같은 주제가 금세 되풀이됐다. 소재 전부에서 고르되
      최근에 쓴 것은 뺀다. */
const AP = require(require('path').join(__dirname, '..', 'services', 'threads', 'autopost'));
const emptyRule = { topics: [] };
const infoForm = FORMS.byId('info');
const drawn = {};
for (let i = 0; i < 80; i++) drawn[AP.pickTopic(emptyRule, i, infoForm, {})] = 1;
t('여덟 가지보다 훨씬 많이 나온다', Object.keys(drawn).length > 20, true);
/* 틀이 정하는 주제는 아무거나 뽑는 데서 빠져야 한다 */
t('오늘의 운세는 안 섞인다', !!drawn['오늘의 운세'], false);
t('무료사주 인사도 안 섞인다', !!drawn['무료사주 인사'], false);
/* 최근에 쓴 것은 뺀다 */
const usedAll = {};
Object.keys(drawn).forEach(function (k) { usedAll[k] = true; });
const after = {};
for (let i = 0; i < 20; i++) after[AP.pickTopic(emptyRule, i, infoForm, usedAll)] = 1;
t('최근에 쓴 것은 피한다',
  Object.keys(after).some(function (k) { return !usedAll[k]; }), true);
/* 적어둔 키워드가 있으면 그 차례를 지킨다 */
const kwRule = { topics: ['역마살', '현침살', '개운법'] };
t('키워드는 차례대로', AP.pickTopic(kwRule, 0, infoForm, {}), '역마살');
t('키워드 차례가 돈다', AP.pickTopic(kwRule, 3, infoForm, {}), '역마살');
t('키워드가 있어도 운세 틀은 고정',
  AP.pickTopic(kwRule, 0, FORMS.byId('daily'), {}), '오늘의 운세');
/* 최근 주제를 읽어두고 넘기는지 */
t('최근 주제를 한 번만 읽는다', autoSrc2.indexOf('await recentTopics(rule.userId, 20)') > 0, true);
t('못 읽어도 만들기를 막지 않는다', autoSrc2.indexOf('최근 주제 읽기 실패') > 0, true);
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


/* ── 요일 판 ──────────────────────────────────────────
   목록을 훑는 대신 요일로 나눠 본다. 판이 틀리면 「이번 주에 뭐가
   올라갔지」를 확인할 데가 없어지므로, 자리 펼치기부터 확인한다. */
section('요일 판');

const wkRule = { id: 'w1', enabled: true, jitterMin: 0,
  slots: [{ day: 1, time: '08:10' }, { day: 4, time: '20:00' }] };

const two = R.plan(wkRule, 14);
t('14일이면 자리마다 두 번씩', two.length, 4);
t('이른 순으로 준다', two.every((x, i) => !i || x.at >= two[i - 1].at), true);
t('같은 자리는 정확히 7일 간격',
  two[2].at.getTime() - two[0].at.getTime(), 7 * 24 * 3600 * 1000);
t('7일이면 한 번씩만', R.plan(wkRule, 7).length, 2);
t('자리가 없으면 빈 판', R.plan({ id: 'w2', slots: [] }, 14).length, 0);
/* upcoming 은 「다음 한 번」만 준다 — 판에는 다음 주도 있어야 한다 */
t('upcoming 보다 멀리 본다', R.plan(wkRule, 14).length > R.upcoming(wkRule, 36 * 7).length, true);
/* 흔들기가 얹혀야 기계처럼 안 보인다 */
const shook = R.plan({ id: 'w3', jitterMin: 20, slots: [{ day: 2, time: '09:00' }] }, 14);
t('흔든 값도 같이 준다', shook.every((x) => x.sendAt instanceof Date), true);
t('흔든 값은 몇 번을 봐도 같다',
  R.plan({ id: 'w3', jitterMin: 20, slots: [{ day: 2, time: '09:00' }] }, 14)[0].sendAt.getTime(),
  shook[0].sendAt.getTime());

/* ── 왜 안 올라갔나 ──────────────────────────────────
   「시간이 됐는데 글이 안 올라간다」가 가장 답답하다.
   규칙 카드에는 마지막 오류 하나만 뜨니, 글마다 이유를 말해줘야 한다. */
section('글마다 안 올라간 이유');

const routeSrc = require('fs').readFileSync('routes/threadsAuto.js', 'utf8');
t('이유를 만드는 자리가 있다', /function autoWhy\(/.test(routeSrc), true);
t('글마다 실어 보낸다', routeSrc.indexOf('auto: autoWhy(') > 0, true);
/* 원고 모드면 아무리 기다려도 안 나간다 — 이걸 모르면 하루를 버린다 */
t('원고로만 두기를 짚어준다', routeSrc.indexOf('「원고로만 두기」라 자동으로 안 올라갑니다') > 0, true);
t('계정 없음을 짚어준다', routeSrc.indexOf('올릴 스레드 계정이 없습니다') > 0, true);
t('올리기 잠김을 짚어준다', routeSrc.indexOf('올리기가 잠겨 있습니다') > 0, true);
t('지침에 걸린 것도 짚어준다', routeSrc.indexOf('지침에 걸려서 예약하지 못했습니다') > 0, true);
t('화면이 그 이유를 그린다', viewSrc.indexOf('ta-why') > 0, true);

/* 이번 주 월요일부터 보여야 수요일에 월요일 글을 확인할 수 있다 */
t('이번 주 시작을 계산한다', /function weekStart\(/.test(routeSrc), true);
t('하루만 남기지 않는다', routeSrc.indexOf('const since = Date.now() - DAY') > 0, false);
/* 아직 안 만든 자리도 보내야 다음 주가 빈칸으로 보이지 않는다 */
t('안 만든 자리도 같이 보낸다', routeSrc.indexOf('slots,') > 0, true);
/* ⚠️ 꺼진 규칙을 빼버리면 요일 판이 조용히 빈다 —
   「일곱 요일을 다 잡아놨는데 왜 아무것도 안 보이냐」가 된다.
   자리는 보여주고 왜 안 나가는지를 그 자리에 적는다. */
t('꺼진 규칙 자리도 보여준다', routeSrc.indexOf('ruleList.filter((r) => r.enabled)') > 0, false);
t('꺼졌다고 표시해 보낸다', routeSrc.indexOf('off: !r.enabled') > 0, true);
t('켜라고 알려준다', routeSrc.indexOf('「켜기」를 체크해주세요') > 0, true);
t('화면이 꺼진 자리를 따로 그린다', viewSrc.indexOf('규칙 꺼짐') > 0, true);
t('짝을 맞출 이름표가 있다', /function planKeyOf\(/.test(routeSrc), true);

/* 화면 쪽 */
t('요일 단추를 그린다', viewSrc.indexOf('ta-wk-d') > 0, true);
t('주를 앞뒤로 넘긴다', viewSrc.indexOf('taWkPrev') > 0 && viewSrc.indexOf('taWkNext') > 0, true);
t('오늘을 표시한다', viewSrc.indexOf("' today'") > 0, true);
t('지난 요일은 올라갔는지 말한다', viewSrc.indexOf('안 올림') > 0, true);
/* 폰에서는 칸이 50픽셀 남짓이다 — 낱말 사이에서만 넘겨야 읽힌다 */
t('글자가 쪼개지지 않게 한다', viewSrc.indexOf('word-break:keep-all') > 0, true);
t('일곱 칸이 늘 한 줄이다', viewSrc.indexOf('grid-template-columns:repeat(7,1fr)') > 0, true);
/* ta-slot 은 규칙 편집기 요일 칸이 이미 쓰는 이름이다 (inline-flex) */
t('이름이 겹치지 않는다', /class="ta-slot"><b>/.test(viewSrc), false);
t('안 만든 자리를 따로 그린다', viewSrc.indexOf('ta-hold') > 0, true);
/* ⚠️ 36시간만 채우면 요일 판에 이틀치도 안 뜬다. 요일을 다 잡아놔도
   「왜 오늘 것만 보이냐」가 된다. 며칠치를 늘 채워둔다. */
t('며칠치인지 알려준다', viewSrc.indexOf('일치를 늘 채워둡니다') > 0, true);
/* 숫자와 문구가 따로 놀면 「3일이라더니 왜 이틀만 있냐」가 된다.
   값은 rules.js 한 곳에서 정하고 화면도 그 값을 받아 쓴다. */
t('며칠치인지 한 곳에서 정한다', R.LOOKAHEAD_DAYS, 3);
t('자동 올리기도 같은 값을 쓴다',
  require(require('path').join(__dirname, '..', 'services', 'threads', 'autopost')).LOOKAHEAD_DAYS,
  R.LOOKAHEAD_DAYS);
t('화면도 그 값을 받는다', viewSrc.indexOf('var AHEAD    = <%= lookaheadDays %>') > 0, true);
t('라우트가 그 값을 넘긴다', routeSrc.indexOf('lookaheadDays: rules.LOOKAHEAD_DAYS') > 0, true);

/* ── 사용 설명서 ──
   처음 여는 사람은 칸이 뭐가 뭔지 모른다. 보고 그대로 따라 할 수 있어야 한다. */
t('설명서가 있다', viewSrc.indexOf('class="ta-guide"') > 0, true);
t('접혀 있다', /<details class="ta-guide">/.test(viewSrc), true);
/* 「켜기」를 안 눌러 아무 일도 안 일어난 적이 있다 — 그 자리를 짚어준다 */
t('켜기를 짚어준다', viewSrc.indexOf('이걸 안 누르면 아무 일도 안 일어납니다') > 0, true);
t('원고로만 두기를 짚어준다', viewSrc.indexOf('절대 안 올라갑니다') > 0, true);
t('시각 어긋내기를 풀어준다', viewSrc.indexOf('계정이 막힐 수 있습니다') > 0, true);
t('틀 목록을 자동으로 뽑는다', viewSrc.indexOf('formList.forEach') > 0, true);
t('단추 뜻을 적어둔다', viewSrc.indexOf('이 자리의 예약을 취소') > 0, true);
t('되풀이되는 자리까지 편다', autoSrc4.indexOf('rules.plan(rule, LOOKAHEAD_DAYS)') > 0, true);
/* ── 지난 자리 밀기 ──
   ⚠️ 일주일치를 미리 채우면 「그 요일의 다음 번」은 늘 차 있다.
      한 자리만 보던 예전 코드는 아무것도 못 밀게 된다. */
const rollSrc = require('fs')
  .readFileSync(require('path').join(__dirname, '..', 'services', 'threads', 'autopost.js'), 'utf8');
t('빈 자리를 앞에서부터 찾는다', rollSrc.indexOf('const free = [];') > 0, true);
t('한 자리만 보지 않는다',
  /const at = rules\.nextSlotTime\(slot, now\);[\s\S]{0,200}updatePost/.test(rollSrc), false);
t('다 차 있으면 다음에 민다', rollSrc.indexOf('if (!sendAt) break;') > 0, true);
/* ⚠️ 「오늘은 계미일입니다」로 쓴 월요일 운세를 토요일로 옮기면
   날짜가 틀린 글이 나간다. 날짜가 박힌 글은 밀지 않는다. */
t('날짜가 박힌 주제를 안다', rollSrc.indexOf("DATED_TOPIC = { '오늘의 운세': true }") > 0, true);
t('그런 글은 안 민다', rollSrc.indexOf('if (DATED_TOPIC[r.topic]) continue;') > 0, true);
t('밀 때 주제까지 읽어온다', rollSrc.indexOf('SELECT id, slot_at, topic FROM th_posts') > 0, true);

/* 하루가 지나면 창이 하루 굴러야 한다 —
   그래야 손을 안 대도 앞으로 일주일이 늘 차 있다. */
const everyDay = { id: 'w', jitterMin: 0,
  slots: [0, 1, 2, 3, 4, 5, 6].map(function (d) { return { day: d, time: '05:10' }; }) };
const kstDay = function (at) {
  return new Date(at.getTime() + 9 * 3600000).toISOString().slice(0, 10);
};
const planDays = function (n) {
  const from = new Date(Date.UTC(2026, 8, 5, 17, 15) + n * 86400000);
  return R.plan(everyDay, 7, from).map(function (x) { return kstDay(x.at); });
};
t('오늘부터 일주일이 찬다', planDays(0).length, 7);
t('하루 지나도 일주일이 찬다', planDays(1).length, 7);
t('창이 하루 굴러간다', planDays(1)[0], planDays(0)[1]);
t('뒤에 하루가 붙는다', planDays(1)[6] > planDays(0)[6], true);
t('같은 날이 두 번 안 잡힌다',
  new Set(planDays(0)).size, 7);

/* 일곱 요일을 잡아두면 일주일 안에 일곱 자리가 다 잡혀야 한다 */
t('일곱 요일이면 일곱 자리',
  R.plan({ id: 'w', jitterMin: 0, slots: [0, 1, 2, 3, 4, 5, 6].map(function (d) {
    return { day: d, time: '05:10' };
  }) }, 7).length, 7);


/* ── 짧은 글 덩어리 나누기 ────────────────────────────
   ⚠️ 세 줄을 빈 줄로 끊은 글을 「빈 줄이 많다」고 막고 있었다.
      그건 막을 모양이 아니라 **권장하는 모양**이다. 벤치마크 글이 다 그 꼴이고,
      그래서 멀쩡한 자동 글이 예약 단계에서 통째로 막혔다. */
section('짧은 글 덩어리');

const nl = String.fromCharCode(10);
const hard3 = (parts) => checkPost({ postType: '정보형', form: 'single', parts }).passHard;

t('세 줄을 빈 줄로 끊어도 통과',
  hard3(['화 기운이 부족하면 시작이 어렵습니다.' + nl + nl +
         '마음은 급한데 발이 안 떨어지죠.' + nl + nl +
         '아침에 햇빛부터 보세요.']), true);
t('십성을 짚은 세 덩어리도 통과',
  hard3(['재성이 강한 사람은 돈을 잘 봅니다.' + nl + nl +
         '다만 사람을 놓칩니다.' + nl + nl +
         '이번 달엔 밥을 먼저 사보세요.']), true);
t('띠를 짚은 세 덩어리도 통과',
  hard3(['쥐띠는 올해 움직임이 많습니다.' + nl + nl +
         '자리를 옮길 일이 생깁니다.' + nl + nl +
         '서두르지 마세요.']), true);
/* 끝에 남은 줄바꿈 하나로 막히면 사람이 이유를 알 수가 없다 */
t('끝 줄바꿈은 안 센다', hard3(['갑목은 곧게 자랍니다.' + nl]), true);
t('앞 줄바꿈도 안 센다', hard3([nl + '갑목은 곧게 자랍니다.']), true);
/* 그렇다고 다 열어주면 흩어진 글이 나간다 */
t('줄마다 다 비우면 여전히 막는다',
  hard3(['갑목은 곧게 자랍니다.' + nl + nl + '휘지 않습니다.' + nl + nl +
         '그래서 부러집니다.' + nl + nl + '한 번쯤 굽어보세요.' + nl + nl +
         '그게 오래 갑니다.' + nl + nl + '정말입니다.']), false);
t('여섯 줄이 다 붙어 있으면 막는다',
  hard3([['갑목은 곧게 자랍니다.', '휘지 않습니다.', '그래서 부러집니다.',
    '한 번쯤 굽어보세요.', '그게 오래 갑니다.', '정말입니다.'].join(nl)]), false);

/* 사주 근거 — 무엇을 적으면 통과하는지 */
const points = (s) => checkPost({ postType: '정보형', form: 'single', parts: [s] })
  .rows.find((r) => r.label === '사주를 실제로 가리킴').ok;
t('일간을 적으면 통과', points('목일간은 먼저 움직입니다'), true);
t('천간을 적으면 통과', points('갑목은 곧게 자랍니다'), true);
t('오행을 적으면 통과', points('화 기운이 부족합니다'), true);
t('십성을 적으면 통과', points('재성이 강한 사람'), true);
t('신살을 적으면 통과', points('역마가 있으면'), true);
t('띠를 적으면 통과', points('쥐띠는 올해'), true);
t('사주 말이 하나도 없으면 막힌다', points('돈이 모이지 않는 사람들이 있습니다'), false);
/* 「수요일」·「금방」이 오행으로 잡히면 아무 글이나 통과해버린다 */
t('수요일은 오행이 아니다', points('수요일에 만나기로 했습니다'), false);
t('금방은 오행이 아니다', points('금방 끝납니다'), false);


/* ── 지지·간지도 사주 근거다 ──────────────────────────
   ⚠️ 천간(갑목·을목…)만 세고 지지 열둘이 통째로 빠져 있었다.
      그래서 「사주에서는 '진'자가 강할 때」처럼 지지를 딱 짚은 글이,
      그리고 **오늘의 운세가 쓰는 일진(계미일·무진일)이 전부**
      「사주 근거 없음」으로 막혀 자동으로 나가지 못했다. */
section('지지·간지 근거');

const pointed = (s) => checkPost({ postType: '정보형', form: 'single', parts: [s] })
  .rows.find((r) => r.label === '사주를 실제로 가리킴').ok;

/* 오늘의 운세는 일진을 적는다. 이게 막히면 운세가 영영 안 나간다. */
t('계미일은 근거다', pointed('오늘은 계미일입니다'), true);
t('무진일도 근거다', pointed('무진일에는 움직임이 많습니다'), true);
t('갑자일도 근거다', pointed('오늘의 일진은 갑자일'), true);
t('갑자생도 근거다', pointed('갑자생은 올해'), true);
/* 글자를 따옴표로 집어 보이는 꼴 — 수강생이 실제로 쓰는 말투다 */
t('따옴표로 집은 지지도 근거다',
  pointed("이런 흐름, 사주에서는 '진'자가 강할 때 많이 나옵니다"), true);
t('낫표로 집은 지지도 근거다', pointed('사주에서 「진」자가 강하면'), true);
/* 지지+오행 — 조사가 붙어도 걸려야 한다 */
t('진토가', pointed('진토가 강한 사람은'), true);
t('인목은', pointed('인목은 봄에 자랍니다'), true);
t('축토를', pointed('축토를 가진 사람'), true);
t('오화도', pointed('오화도 마찬가지입니다'), true);
t('문장 끝에 와도 센다', pointed('일간은 신금.'), true);
/* 자리 이름만으로도 사주 이야기다 */
t('일지', pointed('일지에 도화가 있으면'), true);
t('월주', pointed('월주가 강한 사람'), true);
t('지지에 진이', pointed('지지에 진이 둘이면'), true);

/* 반대쪽 — 지지는 한 글자라 아무 말이나 통과시키기 쉽다.
   여기가 새면 「테스트」 같은 글도 자동으로 나가버린다. */
t('자수성가는 사주가 아니다', pointed('자수성가한 사람들의 공통점'), false);
t('갑자기는 사주가 아니다', pointed('갑자기 생각났습니다'), false);
t('임신 소식은 사주가 아니다', pointed('임신 소식을 들었습니다'), false);
t('진짜는 사주가 아니다', pointed('진짜 중요한 것은'), false);
t('오해는 사주가 아니다', pointed('오해가 쌓이면'), false);
t('미술관은 사주가 아니다', pointed('미술관에 갔습니다'), false);
t('축하는 사주가 아니다', pointed('축하합니다'), false);
t('사회생활은 사주가 아니다', pointed('사회생활은 어렵습니다'), false);
t('해가 뜨면은 사주가 아니다', pointed('해가 뜨면 시작합니다'), false);
t('사람은 사주가 아니다', pointed('사람은 누구나 실수를 합니다'), false);

/* 수강생이 실제로 보내온 글 — 이게 막혀서 자동이 안 돌았다 */
const real = ['해결법 대신 행동이 먼저 바뀝니다', '',
  '1. 생각한 대로 바로 움직입니다',
  '2. 주변 눈치를 나중에 봅니다',
  '3. 결과가 어떻게 됐든 후회하지 않습니다', '',
  "이런 흐름, 사주에서는 '진'자가 강할 때 많이 나옵니다", '',
  '가끔은 멈추는 연습도 필요합니다'].join(String.fromCharCode(10));
t('실제로 올리던 글이 자동으로 나간다',
  checkPost({ postType: '정보형', form: 'single', parts: [real] }).passHard, true);


/* ── 경고형 해결 문장 ─────────────────────────────────
   ⚠️ 「이렇게」·「방향」 같은 몇 마디만 봤다. 그래서
      「가을까지만 버텨보세요」처럼 멀쩡히 길을 알려주고 닫은 글이
      「해결 문장 없음」으로 막혀 자동으로 나가지 못했다.
      한국어에서 길을 알려주는 자리는 대개 권유형 어미다. */
section('경고형 해결 문장');

const warn = (close) => checkPost({
  postType: '경고형', form: 'single',
  parts: ['올해 역마가 강합니다' + String.fromCharCode(10, 10) +
          '자리를 옮기고 싶어집니다' + String.fromCharCode(10, 10) + close],
}).rows.find((r) => r.label === '경고형 — 해결 문장 있음').ok;

t('버텨보세요', warn('가을까지만 버텨보세요'), true);
t('말해보세요', warn('오늘 한 번만 먼저 말해보세요'), true);
t('늦춰보세요', warn('한 박자만 늦춰보세요'), true);
t('기다리세요', warn('지금은 기다리세요'), true);
t('서두르지 마세요', warn('서두르지 마세요'), true);
t('나눠보세요', warn('통장을 나눠보세요'), true);
t('움직이면 됩니다', warn('그때 움직이면 됩니다'), true);
t('옮기는 게 낫습니다', warn('가을에 옮기는 게 낫습니다'), true);
t('하십시오', warn('가을까지 기다리십시오'), true);
t('이렇게 하면 됩니다', warn('이렇게 하면 됩니다'), true);
t('방향만 잡으면', warn('방향만 잡으면 됩니다'), true);
/* ⚠️ 위는 전부 존댓말이다. 반말·음슴체로 쓰는 계정은 이렇게 닫는데
   하나도 안 걸려서 경고형이 통째로 자동에서 막혔다.
   본인 말투가 반말이면 해결 문장도 반말로 나온다. */
t('버텨봐', warn('가을까지만 버텨봐'), true);
t('띄어 써도 (버텨 봐)', warn('가을까지만 버텨 봐'), true);
t('댓글 남겨봐', warn('본인 띠 있으면 댓글 남겨봐'), true);
t('한 번 더 생각할 것', warn('한 번 더 생각할 것'), true);
t('서두르지 말자', warn('급하게 결정하지 말자'), true);
t('기다리는 게 좋음', warn('오늘은 기다리는 게 좋음'), true);
t('말하면 됨', warn('한 번 삼키고 말하면 됨'), true);
t('서두르지 않는 게 나음', warn('서두르지 않는 게 나음'), true);
t('조심하면 됨', warn('조심하면 됨'), true);

/* 길을 안 알려주고 겁만 주고 끝내면 여전히 막아야 한다 */
t('겁만 주고 끝나면 막는다', warn('올해는 조심할 일이 많습니다'), false);
t('나쁘다고만 하면 막는다', warn('좋지 않은 해입니다'), false);
t('반말로 겁만 줘도 막는다', warn('올해는 조심할 일이 많음'), false);
t('나쁘다고만 하는 반말도 막는다', warn('좋지 않은 해임'), false);

/* 실제로 쓰는 일곱 가지 글 모양이 다 통과하는지 —
   하나라도 막히면 그 틀은 자동으로 영영 안 나간다. */
section('실제 글 모양');
const B = String.fromCharCode(10, 10);
const N = String.fromCharCode(10);
const shapes = {
  '리스트형': ['정보형', '말이 늦게 나오는 사람들이 있습니다' + B +
    '1. 생각을 다 끝내고 말합니다' + N + '2. 틀릴까 봐 한 번 더 봅니다' + N +
    '3. 그래서 늘 한 박자 늦습니다' + B +
    '사주에서는 인성이 두꺼울 때 이렇게 나옵니다' + B + '먼저 반만 말해보세요'],
  '오늘의 운세': ['정보형', '오늘은 계미일입니다' + B + '말이 앞서기 쉬운 날입니다' + B +
    '한 번 삼키고 말하면 하루가 조용합니다'],
  '질문형': ['정보형', '왜 나만 늘 손해 보는 것 같을까요' + B +
    '재성이 약하면 받는 걸 못 챙깁니다' + N + '주는 건 잘하는데 달라는 말을 못 합니다' + B +
    '오늘 한 번만 먼저 말해보세요'],
  '대조형': ['정보형', '같은 목일간이어도 다릅니다' + B + '봄에 난 사람은 밀고 나갑니다' + N +
    '겨울에 난 사람은 먼저 웅크립니다' + B + '같은 글자라도 계절이 다르면 쓰임이 다릅니다'],
  '경고형': ['경고형', '올해 역마가 강합니다' + B + '자리를 옮기고 싶어집니다' + B +
    '다만 지금 옮기면 두 번 옮깁니다' + N + '가을까지만 버텨보세요'],
  '짧은 정보형': ['정보형', '진토가 강하면 잘 안 움직입니다' + B + '대신 한 번 정하면 안 바꿉니다'],
};
Object.keys(shapes).forEach((k) => {
  const [type, body] = shapes[k];
  t(k + ' 은 자동으로 나간다',
    checkPost({ postType: type, form: 'single', parts: [body] }).passHard, true);
});


/* ── 오늘의 운세는 틀대로 나가야 한다 ──────────────────
   ⚠️ 프롬프트에 「짜임새를 그대로 두세요」라고 적어두는 것만으로는
      안 지켜진다. 실제로 이런 일이 있었다.

        틀:   🐑 양띠
        결과: 🐵 원숭이띠 — 오늘은 흐름이 자연스럽게 연결됩니다

      말투도 「~있음」에서 「~입니다」로 바뀌고, 두 편으로 나눠 올리는
      틀인데 한 편으로 합쳐 나왔다. 매일 나가는 글이라 모양이 바뀌면
      매일 오던 사람이 어디를 봐야 할지 모른다. 그래서 기계로 잡는다. */
section('오늘의 운세 틀 지키기');

const DS = require(require('path').join(__dirname, '..', 'services', 'threads', 'dailyshape'));
const LF = String.fromCharCode(10);

/* 수강생이 실제로 저장한 틀 */
const TPL = ['오늘 잘 풀리는 사람은', '사람이든 일이든 먼저 신호가 올 수 있음', '',
  '9월 5일 오늘의 운세', '',
  '🍀 운 좋은 띠', '🐑 양띠', '🐯 호랑이띠', '🐶 개띠', '',
  '⚠️ 조금 조심할 띠', '🐭 쥐띠', '🐷 돼지띠'].join(LF);

/* 실제로 나왔던 글 — 띠마다 설명을 붙이고 말투를 바꿨다 */
const MADE = ['오늘은 갑신일입니다', '', '9월 7일 오늘의 운세', '',
  '🍀 운 좋은 띠',
  '🐵 원숭이띠 — 오늘은 흐름이 자연스럽게 연결됩니다',
  '🐲 용띠 — 주변에서 먼저 손을 내밀어줍니다',
  '🐶 개띠 — 분위기를 주도하기 좋은 날입니다', '',
  '⚠️ 조심할 띠',
  '🐰 토끼띠 — 감정에 휩쓸려 말이 앞서기 쉽습니다',
  '🐔 닭띠 — 결정은 한 번 더 고민하면 더 좋습니다', '',
  '오늘은 강하게 끌리는 대로 한 번 움직여보세요'].join(LF);

/* 틀대로 채운 글 — 날짜와 띠만 바뀌었다 */
const GOOD = ['오늘 잘 풀리는 사람은', '먼저 신호가 올 수 있음', '',
  '9월 7일 오늘의 운세', '',
  '🍀 운 좋은 띠', '🐵 원숭이띠', '🐲 용띠', '🐶 개띠', '',
  '⚠️ 조금 조심할 띠', '🐰 토끼띠', '🐔 닭띠'].join(LF);

t('틀의 줄 수를 센다', DS.outline(TPL).lines, 13);
t('이모지 줄을 센다', DS.outline(TPL).emoji, 7);
t('음슴체를 알아본다', DS.outline(TPL).tone, '음슴체');
t('합니다체를 알아본다', DS.outline(MADE).tone, '합니다체');
t('「이름 — 설명」 줄을 센다', DS.outline(MADE).dash, 5);
t('틀에는 설명 줄이 없다', DS.outline(TPL).dash, 0);

/* 실제로 잘못 나왔던 글을 잡아내야 한다 */
t('설명을 붙인 글을 잡는다', DS.check(TPL, MADE).ok, false);
t('무엇이 틀렸는지 말해준다',
  DS.check(TPL, MADE).why.indexOf('이름만 적던 자리에는 이름만') > 0, true);
t('틀대로 채운 글은 통과', DS.check(TPL, GOOD).ok, true);

/* 말투만 바뀌어도 딴 글로 보인다 */
t('말투가 바뀌면 잡는다',
  DS.check('한 줄임' + LF + '두 줄임', '한 줄입니다' + LF + '두 줄입니다').ok, false);

/* 줄 수가 크게 달라지면 딴 글이다. 다만 날짜·운세가 바뀌니 조금은 봐준다. */
t('한 줄 차이는 봐준다',
  DS.check(TPL, GOOD + LF + '오늘도 좋은 하루 되세요').ok, true);
/* 어중간하면 말투를 단정하지 않는다 — 멀쩡한 글을 다시 시키면 요금만 든다 */
t('음슴체와 해요체가 반반이면 안 잡는다',
  DS.tone('한 줄임' + LF + '두 줄이에요'), '');
t('한쪽이 앞서면 잡아낸다', DS.tone('한 줄임' + LF + '두 줄임' + LF + '세 줄이에요'), '음슴체');
t('절반으로 줄면 잡는다', DS.check(TPL, '오늘 잘 풀리는 사람은').ok, false);

/* 두 편으로 나눠 올리는 틀인지 */
t('두 편 틀을 알아본다', DS.needsTwo({ mode: 'chain', tail: '2편' }), true);
t('꼬리가 비면 두 편이 아니다', DS.needsTwo({ mode: 'chain', tail: '' }), false);
t('한 편 틀은 두 편이 아니다', DS.needsTwo({ mode: 'single', tail: '2편' }), false);

/* 치수를 프롬프트에 넣어야 모델이 지킨다 */
const bp = DS.blueprint(TPL).join(LF);
t('줄 수를 못 박는다', bp.indexOf('13줄') > 0, true);
t('이모지 개수를 못 박는다', bp.indexOf('7개') > 0, true);
t('설명 붙이지 말라고 한다', bp.indexOf('설명을 덧붙이지 마세요') > 0, true);
t('말투를 못 박는다', bp.indexOf('음슴체') > 0, true);

/* 프롬프트에 실제로 실리는지 */
const P = require(require('path').join(__dirname, '..', 'services', 'threads', 'prompt'));
const block = P.dailyBlock({ body: TPL, tail: '운 좋은 띠는' + LF + '흐름이 붙기 좋은 편', mode: 'chain' });
t('치수가 프롬프트에 실린다', block.indexOf('이 틀의 치수') > 0, true);
t('2편 치수도 실린다', block.indexOf('2편의 치수') > 0, true);
t('참고가 아니라 서식이라고 말한다', block.indexOf('참고 자료가 아니라') > 0, true);


/* ── 계정마다 다른 설정 ────────────────────────────────
   ⚠️ 설정이 사람 하나에 한 벌이었다. 계정을 두 개 등록해도
      말투·인사글·운세 틀이 같이 따라다녀서, 계정을 바꿔도 앞 계정
      설정이 그대로 떴다. 계정마다 성격이 다른데 한 벌이면 안 된다. */
section('계정마다 다른 설정');

const storeSrc = require('fs')
  .readFileSync(require('path').join(__dirname, '..', 'services', 'threads', 'store.js'), 'utf8');
const dbSrc = require('fs')
  .readFileSync(require('path').join(__dirname, '..', 'db.js'), 'utf8');
const acctSrc = require('fs')
  .readFileSync(require('path').join(__dirname, '..', 'services', 'threads', 'accounts.js'), 'utf8');
const pubSrc2 = require('fs')
  .readFileSync(require('path').join(__dirname, '..', 'services', 'threads', 'publish.js'), 'utf8');
const pipeSrc2 = require('fs')
  .readFileSync(require('path').join(__dirname, '..', 'services', 'threads', 'pipeline.js'), 'utf8');

t('계정 몫 설정 표가 있다', dbSrc.indexOf('CREATE TABLE IF NOT EXISTS th_acct_settings') > 0, true);
t('규칙에 계정 칸이 있다',
  dbSrc.indexOf('ALTER TABLE th_rules ADD COLUMN IF NOT EXISTS account_id') > 0, true);

/* 무엇이 계정 몫이고 무엇이 사람 몫인지 — 잘못 가르면 열쇠가 갈라진다 */
t('말투는 계정 몫', storeSrc.indexOf("'voiceMode', 'voicePack'") > 0, true);
t('인사글·운세 틀도 계정 몫', /PER_ACCOUNT = \[[^\]]*'intro', 'daily'/.test(storeSrc), true);
t('본보기 글도 계정 몫', /PER_ACCOUNT = \[[\s\S]*?'samples'[\s\S]*?\]/.test(storeSrc), true);
t('열쇠는 계정 몫이 아니다', /PER_ACCOUNT = \[[^\]]*zernioKey/.test(storeSrc), false);
/* ⚠️ 올리기 허용을 사람 몫으로 뒀더니 계정을 바꿔도 같이 켜지고 꺼졌다.
   한 계정만 켜두고 다른 계정은 잠가두는 것이 안 됐다. */
t('올리기 허용은 계정 몫', /PER_ACCOUNT = \[[\s\S]*?'allowPublish'[\s\S]*?\]/.test(storeSrc), true);
t('이미 있는 표에도 붙인다',
  dbSrc.indexOf('ALTER TABLE th_acct_settings ADD COLUMN IF NOT EXISTS allow_publish') > 0, true);
/* NULL 이면 아직 안 정한 것 — false 로 읽으면 이미 켜둔 사람이 갑자기 잠긴다 */
t('안 정했으면 사람 몫을 쓴다',
  storeSrc.indexOf('row.allow_publish == null ? base.allowPublish') > 0, true);

/* 처음 만들 때 사람 몫을 옮겨 담아야 한다.
   빈 칸으로 시작하면 이미 채워둔 사람은 다 날아간 것처럼 보인다. */
t('처음엔 쓰던 설정을 옮겨 담는다', storeSrc.indexOf('async function acctRow') > 0, true);
t('옮겨 담았다고 표시해둔다', storeSrc.indexOf('seeded') > 0, true);
t('계정을 안 주면 지금 고른 계정', storeSrc.indexOf('async function currentAccountId') > 0, true);
/* 계정이 하나도 없으면 예전처럼 사람 단위로 — 안 그러면 아무것도 못 읽는다 */
t('계정이 없으면 사람 몫 그대로', /if \(!id\) return base;/.test(storeSrc), true);
t('저장도 갈라 담는다', storeSrc.indexOf('const acct = {};') > 0, true);

/* ── 계정을 두세 개 돌리기 ──
   계정마다 시간표가 따로 돌아야 한다. */
section('계정 여러 개 돌리기');

t('계정을 번호로 집어 온다', acctSrc.indexOf('async function byId') > 0, true);
t('집은 계정으로 내보낸다', pubSrc2.indexOf('accounts.byId(userId, o.accountId)') > 0, true);
t('못 집었으면 지금 고른 계정', pubSrc2.indexOf('|| await accounts.active(userId)') > 0, true);
/* 꼬리말·링크도 그 계정 몫이라야 한다 */
t('꼬리말도 그 계정 몫으로',
  pubSrc2.indexOf('async function bodyToSend(userId, post, accountId)') > 0, true);
t('예약할 때 그 계정 몫을 넘긴다',
  pubSrc2.indexOf('bodyToSend(userId, post, ready.acc.id)') > 0, true);
t('글도 그 계정 말투로', pipeSrc2.indexOf('store.getSettings(userId, o.accountId)') > 0, true);

/* 규칙에 계정을 담고 꺼낼 수 있어야 한다 */
t('규칙이 계정을 담는다', R.clean({ accountId: 7 }, {}).accountId, 7);
t('0은 안 집은 것으로 본다', R.clean({ accountId: 0 }, {}).accountId, null);
t('빈 값도 안 집은 것', R.clean({ accountId: '' }, {}).accountId, null);
t('안 보내면 건드리지 않는다', R.clean({}, {}).accountId, undefined);

/* 집어둔 계정이 사라지면 왜 안 나가는지 말해줘야 한다 */
const gone = { id: 'g', enabled: true, mode: 'publish', accountId: 9,
  slots: [{ day: 1, time: '08:10' }] };
t('없어진 계정을 짚어준다',
  R.diagnose(gone, { hasKey: true, allowPublish: true, hasAccount: false, filled: 0 })
    .why.indexOf('없어졌습니다') > 0, true);
/* 어디로 나가는지 보여야 한다 — 계정이 둘이면 늘 헷갈린다 */
t('어느 계정으로 나가는지 말해준다',
  R.diagnose(Object.assign({}, live, { accountId: 3 }),
    { hasKey: true, allowPublish: true, hasAccount: true, filled: 0, accountName: 'luwol' })
    .why.indexOf('@luwol') > 0, true);

/* 화면 */
t('규칙에서 계정을 고른다', viewSrc.indexOf('어느 계정으로') > 0, true);
t('계정이 하나면 안 그린다', viewSrc.indexOf('ACCOUNTS.length > 1') > 0, true);
t('고른 계정을 저장에 담는다', viewSrc.indexOf("box.querySelector('.acct')") > 0, true);
t('설명서가 계정별 설정을 알려준다', viewSrc.indexOf('설정은 계정마다 따로입니다') > 0, true);
t('각자 시간표로 돈다고 알려준다', viewSrc.indexOf('각자 자기 시간표대로') > 0, true);


/* ── 띠는 계산해서 정한다 ──────────────────────────────
   ⚠️ 「운 좋은 띠 셋」을 모델이 골랐다. 근거가 없으니 아무 띠나 나왔다.
      계미일에 용띠·원숭이띠가 나오는 식이었다 — 미(未)와는 아무 관계도
      없는 지지다. 명리를 아는 사람이 보면 바로 티가 난다.

      일지 하나만 있으면 합·삼합·방합·충·형·해·파가 다 정해진다.
      여기서 정하고, 모델은 그 근거를 풀어 쓰기만 한다. */
section('띠 고르기 (합충형파해)');

const J = require(require('path').join(__dirname, '..', 'services', 'threads', 'jiji'));

/* 관계표가 명리 기본과 맞는지 — 여기가 틀리면 전부 틀린다 */
t('육합 미-오', J.YUKHAP['미'], '오');
t('육합 자-축', J.YUKHAP['자'], '축');
t('육합 인-해', J.YUKHAP['인'], '해');
t('충은 여섯 칸 건너 (미-축)', J.chungOf('미'), '축');
t('충 자-오', J.chungOf('자'), '오');
t('충 인-신', J.chungOf('인'), '신');
t('해 미-자', J.HAE['미'], '자');
t('파 미-술', J.PA['미'], '술');
t('삼합 해묘미가 있다',
  J.SAMHAP.some(function (g) { return g.set.join('') === '해묘미' && g.element === '목'; }), true);
t('삼합 인오술은 화',
  J.SAMHAP.filter(function (g) { return g.set.join('') === '인오술'; })[0].element, '화');
t('삼형 축술미가 있다',
  J.SAMHYEONG.some(function (g) { return g.join('') === '축술미'; }), true);

/* ⚠️ 실제로 있었던 일 — 계미일(9월 6일) 글이 용띠·원숭이띠로 나갔다.
   미(未)의 기본 관계는 이렇게 나와야 한다. */
const mi = J.pick('미', 3);
t('계미일 좋은 띠는 말·돼지·토끼',
  mi.good.map(function (x) { return x.tti; }).sort().join(','), '돼지띠,말띠,토끼띠');
t('계미일 조심할 띠는 소·개·쥐',
  mi.care.map(function (x) { return x.tti; }).sort().join(','), '개띠,소띠,쥐띠');
t('말띠 근거는 미오합', mi.good[0].why.indexOf('미오합') >= 0, true);
t('토끼·돼지 근거는 해묘미 삼합',
  mi.good.filter(function (x) { return x.tti === '토끼띠'; })[0].why.indexOf('해묘미 삼합') >= 0, true);
t('소띠 근거는 축미충',
  mi.care.filter(function (x) { return x.tti === '소띠'; })[0].why.indexOf('충') >= 0, true);
t('쥐띠 근거는 자미해',
  mi.care.filter(function (x) { return x.tti === '쥐띠'; })[0].why.indexOf('해') >= 0, true);
t('개띠 근거는 형·파',
  /형|파/.test(mi.care.filter(function (x) { return x.tti === '개띠'; })[0].why), true);
/* 용띠·원숭이띠는 미(未)와 아무 관계가 없다 */
t('용띠는 안 나온다',
  mi.good.concat(mi.care).some(function (x) { return x.tti === '용띠'; }), false);
t('원숭이띠도 안 나온다',
  mi.good.concat(mi.care).some(function (x) { return x.tti === '원숭이띠'; }), false);

/* 열두 지지가 다 돌아야 한다. 하나라도 비면 그 날 운세가 못 나간다. */
let allOk = true;
let noOverlap = true;
J.BRANCHES.forEach(function (b) {
  const p = J.pick(b, 3);
  if (!p || !p.good.length || !p.care.length) allOk = false;
  const care = p.care.map(function (x) { return x.tti; });
  if (p.good.some(function (x) { return care.indexOf(x.tti) >= 0; })) noOverlap = false;
});
t('열두 지지가 다 나온다', allOk, true);
/* ⚠️ 합과 파·해가 겹칠 때가 있다 (인해는 육합이면서 파).
   양쪽에 같은 띠를 올리면 읽는 사람이 뭘 믿어야 할지 모른다. */
t('좋은 쪽과 조심 쪽이 안 겹친다', noOverlap, true);
/* 인일은 해(돼지)가 육합이자 파다 — 합을 먼저 본다 */
const inDay = J.pick('인', 3);
t('인일에 돼지띠는 좋은 쪽',
  inDay.good.some(function (x) { return x.tti === '돼지띠'; }), true);
t('인일에 돼지띠는 조심 쪽이 아니다',
  inDay.care.some(function (x) { return x.tti === '돼지띠'; }), false);
/* 억지로 셋을 채우느니 근거 있는 둘이 낫다 */
t('근거가 둘뿐이면 둘만 준다', inDay.care.length, 2);
t('없는 지지는 안 받는다', J.pick('봄'), null);

/* ── 나온 글을 기계로 본다 ──
   프롬프트에 「이 목록을 그대로」라고 적어두는 것만으로는 안 지켜진다. */
section('띠 검사');

const LF2 = String.fromCharCode(10);
const wrongPost = ['🍀 운 좋은 띠', '🐲 용띠', '🐰 토끼띠', '🐷 돼지띠',
  '⚠️ 조심할 띠', '🐵 원숭이띠', '🐔 닭띠', '🐯 호랑이띠'].join(LF2);
const rightPost = ['🍀 운 좋은 띠', '🐴 말띠', '🐰 토끼띠', '🐷 돼지띠',
  '⚠️ 조심할 띠', '🐮 소띠', '🐭 쥐띠', '🐶 개띠'].join(LF2);

t('엉뚱한 띠를 잡는다', J.checkText('미', wrongPost).ok, false);
t('어느 띠가 틀렸는지 말한다', J.checkText('미', wrongPost).why.indexOf('용띠') > 0, true);
t('맞는 띠를 알려준다', J.checkText('미', wrongPost).why.indexOf('말띠') > 0, true);
t('맞게 쓴 글은 통과', J.checkText('미', rightPost).ok, true);
/* 여섯 중 하나라도 빠지면 틀이 무너진다 */
t('빠뜨린 띠도 잡는다',
  J.checkText('미', rightPost.replace('🐭 쥐띠', '')).ok, false);
/* 「범띠」로 적어도 호랑이띠와 같은 것으로 봐야 한다 */
t('범띠는 호랑이띠와 같게 본다',
  J.checkText('미', wrongPost.replace('호랑이띠', '범띠')).why.indexOf('호랑이띠') > 0, true);
t('일지를 모르면 안 막는다', J.checkText('', rightPost).ok, true);

/* 프롬프트에 실리는지 */
const T2 = require(require('path').join(__dirname, '..', 'services', 'threads', 'today'));
const blk = T2.block(new Date('2026-09-06T05:00:00+09:00'));
t('일진을 만세력으로 뽑는다', blk.indexOf('계미일') > 0, true);
t('일지를 같이 준다', T2.forDate(new Date('2026-09-06T05:00:00+09:00')).dayBranch, '미');
t('띠 목록이 프롬프트에 실린다', blk.indexOf('오늘 띠 (계산해둔 값)') > 0, true);
t('근거까지 실린다', blk.indexOf('미오합') > 0, true);
t('고르지 말라고 못 박는다', blk.indexOf('띠를 고르는 것은 당신 일이 아닙니다') > 0, true);
/* 「귀인이 붙는다」를 셋 모두에 뭉뚱그려 붙이던 것도 막는다 */
t('뭉뚱그린 말을 막는다', blk.indexOf('근거 없는 말을 셋 모두에 뭉뚱그려') > 0, true);
/* ⚠️ filter(Boolean) 을 쓰면 빈 줄이 지워져 지시가 한 벽이 된다 */
t('덩어리 사이가 붙지 않는다', blk.split(LF2).filter(function (l) { return !l.trim(); }).length >= 4, true);

/* ── 계정을 바꾸면 화면도 갈려야 한다 ──
   ⚠️ 계정을 바꿔도 규칙과 올라갈 글이 그대로 다 떴다. 루사주와 AI이안이
      같은 목록을 보니 어느 것이 어느 계정 것인지 알 수가 없었다. */
section('계정별 화면 가르기');

t('규칙을 계정으로 거른다',
  routeSrc.indexOf('list.filter((r) => !r.accountId || r.accountId === here)') > 0, true);
/* 계정이 하나뿐이면 거를 것이 없다 — 괜히 걸러서 빈 화면이 되면 안 된다 */
t('계정이 하나면 안 거른다', routeSrc.indexOf('accList.length > 1') > 0, true);
t('올라갈 글도 계정으로 거른다', routeSrc.indexOf('const belongs = (p) =>') > 0, true);
/* 이미 나간 글은 그 글에 새겨진 계정으로 본다 */
t('나간 글은 새겨진 계정으로', routeSrc.indexOf('if (p.accountId) return p.accountId === here;') > 0, true);
/* 원고는 그 글을 만든 규칙의 계정으로 본다 */
t('원고는 규칙의 계정으로', routeSrc.indexOf('if (r && r.accountId) return r.accountId === here;') > 0, true);
t('안 만든 자리도 같은 기준으로',
  (routeSrc.match(/accCount < 2 \|\| !r\.accountId \|\| r\.accountId === here/g) || []).length >= 1, true);

/* 계정을 안 집은 규칙은 고른 계정을 따라간다 — 그렇다고 알려줘야 한다 */
t('따라간다고 표시해 보낸다', routeSrc.indexOf('follows: !r.accountId && accList.length > 1') > 0, true);
t('화면이 그 경고를 그린다', viewSrc.indexOf('지금 고른 계정</b>을 따라갑니다') > 0, true);
/* 계정이 둘이면 새 규칙은 만들 때 못 박는다 — 안 그러면 계정 바꿀 때마다 흔들린다 */
t('새 규칙은 지금 계정에 못 박는다',
  routeSrc.indexOf('if (patch.accountId === undefined && !b.id)') > 0, true);
t('어느 계정 화면인지 보여준다', viewSrc.indexOf('것만 보입니다') > 0, true);

/* ── 같은 글이 두 번 나가지 않게 ──
   ⚠️ 실제로 같은 오늘의 운세가 두 계정에 나란히 올라갔다.
      규칙을 두 개 두면 둘 다 같은 운세 틀을 쓰고, 날짜도 띠도 계산값이라
      글자까지 거의 같은 글이 나간다.
      여러 계정에 같은 글을 뿌리는 것은 스레드가 스팸으로 보는 모양이다. */
section('같은 글 두 번 막기');

const DUP = require(require('path').join(__dirname, '..', 'services', 'threads', 'dupe'));
const L = String.fromCharCode(10);
const dayA = ['오늘 잘 풀리는 사람은', '', '9월 6일 오늘의 운세', '',
  '🍀 운 좋은 띠', '🐴 말띠', '🐷 돼지띠', '🐰 토끼띠'].join(L);
const dayB = dayA.replace('9월 6일', '9월 7일');
const other = ['말이 늦게 나오는 사람들이 있습니다', '', '인성이 두꺼우면 그렇습니다'].join(L);

t('완전히 같으면 1', DUP.similarity(dayA, dayA), 1);
/* 날짜 한 줄만 다른 것도 같은 글이다 — 숫자를 걷어내고 본다 */
t('날짜만 다르면 같은 글로 본다', DUP.similarity(dayA, dayB) >= DUP.SAME_ENOUGH, true);
t('아예 다른 글은 안 걸린다', DUP.similarity(dayA, other) < DUP.SAME_ENOUGH, true);
/* 띠와 후킹을 바꾼 글은 다른 글이다 — 이걸 막으면 아무것도 못 올린다 */
t('띠·후킹을 바꾸면 다른 글',
  DUP.similarity(dayA, dayA.replace('🐰 토끼띠', '🐮 소띠')
    .replace('오늘 잘 풀리는 사람은', '오늘은 사람 관계에서')) < DUP.SAME_ENOUGH, true);
t('빈 글은 안 걸린다', DUP.similarity('', dayA), 0);
t('공백·부호는 걷어낸다', DUP.normalize('가 나.  다!'), '가나다');
/* ⚠️ 예전엔 숫자까지 걷어냈다. 그러면 날마다 나가는 운세가 서로
   같은 글이 되어 다음 날 글이 막힌다. 날짜는 남겨둔다. */
t('날짜는 남겨둔다', DUP.normalize('9월 6일'), '9월6일');
t('날짜만 달라도 아주 닮았다', DUP.similarity(dayA, dayB) >= 0.9, true);
/* 문턱이 하나면 멀쩡한 다음 날 운세가 막힌다 —
   다른 계정이면 조이고, 같은 계정이면 느슨하게 본다 */
t('같은 계정 문턱이 더 높다', DUP.SAME_ACCOUNT > DUP.SAME_ENOUGH, true);

/* 어느 길로 오든 여기서 걸려야 한다 */
const pubSrc3 = require('fs')
  .readFileSync(require('path').join(__dirname, '..', 'services', 'threads', 'publish.js'), 'utf8');
t('내보내기 전에 본다', pubSrc3.indexOf('dupe.findTwin(userId, Object.assign(') > 0, true);
/* 원고에는 계정이 안 새겨져 있다 — 나갈 계정을 붙여줘야 가릴 수 있다 */
t('나갈 계정을 붙여 넘긴다', pubSrc3.indexOf('{ accountId: acc.id }') > 0, true);
t('막을 때 이유를 준다', pubSrc3.indexOf('dupe.why(twin, acc.username)') > 0, true);
/* 검사가 터졌다고 못 올리게 하면 더 답답하다 */
t('검사가 터져도 막지는 않는다', pubSrc3.indexOf('같은 글 검사 실패') > 0, true);
t('화면이 그 이유를 풀어준다', viewSrc.indexOf('이미 나간 글과 똑같아서 막았습니다') > 0, true);

/* 나가고 나서 막는 것보다 잡을 때 알려주는 편이 낫다 */
const rA = { id: 'a', enabled: true, name: '루사주',
  slots: [{ day: 0, time: '05:00', form: 'daily' }, { day: 1, time: '08:00', form: 'info' }] };
const rB = { id: 'b', enabled: true, name: 'AI이안', slots: [{ day: 0, time: '06:00', form: 'daily' }] };
const rC = { id: 'c', enabled: true, name: '다른날', slots: [{ day: 3, time: '06:00', form: 'daily' }] };
t('같은 날 같은 틀이면 미리 알려준다', R.clashWarning(rA, [rB]).indexOf('일요일 오늘의 운세') > 0, true);
t('어느 규칙과 겹치는지 말해준다', R.clashWarning(rA, [rB]).indexOf('AI이안') > 0, true);
t('날이 다르면 안 알린다', R.clashWarning(rA, [rC]), '');
t('꺼진 규칙과는 안 겹친다',
  R.clashWarning(rA, [Object.assign({}, rB, { enabled: false })]), '');
t('자기 자신과는 안 겹친다', R.clashWarning(rA, [rA]), '');
/* 틀을 안 집은 자리는 돌려 쓰므로 겹칠지 알 수 없다 */
t('틀을 안 집었으면 안 알린다',
  R.clashWarning({ id: 'x', enabled: true, slots: [{ day: 0, time: '05:00' }] }, [rB]), '');
t('규칙 카드가 그 경고를 받는다', routeSrc.indexOf('rules.clashWarning(r, list)') > 0, true);

/* ── 종류별 본보기 글 ──
   ⚠️ 큰 칸 하나에 글을 다 붙여넣게 했다. 그러면 말투는 잡혀도
      **짜임새**가 안 잡힌다 — 무료사주 안내글과 리스트형은 여는 법도
      닫는 법도 다른데 한 덩어리로 뭉뚱그려졌다.
      종류를 골라 칸마다 하나씩 넣고, 그 종류를 만들 때 그 본보기를 쓴다. */
section('종류별 본보기 글');

const P3 = require(require('path').join(__dirname, '..', 'services', 'threads', 'prompt'));
const pipeSrc4 = require('fs')
  .readFileSync(require('path').join(__dirname, '..', 'services', 'threads', 'pipeline.js'), 'utf8');
const dbSrc2 = require('fs')
  .readFileSync(require('path').join(__dirname, '..', 'db.js'), 'utf8');

t('본보기 칸이 있다', dbSrc2.indexOf('samples      JSONB') > 0, true);
/* ⚠️ 표가 이미 있으면 CREATE TABLE IF NOT EXISTS 는 새 칸을 안 만든다.
   이미 돌고 있는 곳에는 ALTER 가 있어야 붙는다 — 실제로 여기서 깨졌다. */
t('이미 있는 표에도 칸을 붙인다',
  dbSrc2.indexOf('ALTER TABLE th_acct_settings ADD COLUMN IF NOT EXISTS samples') > 0, true);
t('종류별로 담는다', storeSrc.indexOf("samples: 'samples'") > 0, true);
/* 다섯 칸까지. 그 이상은 프롬프트만 길어지고 나아지지 않는다 */
t('다섯 칸까지만 담는다', storeSrc.indexOf('.slice(0, 5)') > 0, true);
t('빈 칸은 안 담는다', storeSrc.indexOf('.filter((x) => x.text.trim())') > 0, true);
t('모르는 종류는 빈 값으로', routeSrc.indexOf("ok.indexOf(String(x.kind || '')) >= 0") > 0, true);

const sb = P3.sampleBlock({ text: '무료사주 받아가요' }, '인사 · 무료사주');
t('본보기가 프롬프트 덩어리가 된다', sb.indexOf('내가 쓰던 인사 · 무료사주 글') > 0, true);
t('짜임새를 가져가라고 한다', sb.indexOf('여는 법 · 끊는 법 · 닫는 법') > 0, true);
/* 베끼면 안 된다 — 짜임새만 빌린다 */
t('베끼지 말라고 한다', sb.indexOf('짜임새만') > 0, true);
t('글이 없으면 덩어리도 없다', P3.sampleBlock({ text: '' }, 'x'), '');
t('아예 안 주면 빈 값', P3.sampleBlock(null, 'x'), '');

/* 만들 때 그 종류 본보기를 골라 써야 한다 */
t('만드는 틀로 본보기를 고른다',
  pipeSrc4.indexOf("(settings.samples || []).find((x) => x && x.kind === wantKind)") > 0, true);
t('틀을 안 정했으면 정보형 것', pipeSrc4.indexOf("(o.form && o.form.id) || 'info'") > 0, true);
t('프롬프트에 실어 보낸다', pipeSrc4.indexOf('sample,') > 0, true);

/* 화면 — 번호 다섯 칸 */
t('칸이 다섯 개', (viewSrc.match(/si < 5/g) || []).length, 1);
t('칸마다 번호를 붙인다', viewSrc.indexOf('<span class="no"><%= si + 1 %></span>') > 0, true);
t('칸마다 종류를 고른다', viewSrc.indexOf('종류 고르기') > 0, true);
t('종류는 틀 목록에서 뽑는다', viewSrc.indexOf('formList.forEach(function(f){ %>') > 0, true);
t('칸을 합쳐 말투를 뽑는다', viewSrc.indexOf('function sampleText()') > 0, true);
t('저장 단추가 있다', viewSrc.indexOf('taSampleSave') > 0, true);
/* 종류를 안 골라도 말투에는 쓴다 — 본보기로만 안 쓴다 */
t('종류 없는 칸도 말투에 쓴다', viewSrc.indexOf('말투에는 쓰지만 본보기로는 안 씁니다') > 0, true);
t('칸마다 줄 수를 보여준다', viewSrc.indexOf("x.el.querySelector('.cnt')") > 0, true);
/* 큰 칸 하나짜리는 없어졌다 */
t('옛 큰 칸은 없다', viewSrc.indexOf('id="taVoiceIn"') > 0, false);

/* ── 이미 만들어둔 원고도 예약에 걸어준다 ──
   ⚠️ 예약은 **글을 새로 만들 때만** 걸었다. 그래서
        ① 「원고로만 두기」로 글이 쌓이고
        ② 「바로 예약까지」로 바꾸면
        ③ 쌓인 글은 taken() 에 걸려 다시 안 만들어지고
        ④ **영영 예약되지 않았다.**
      화면에는 「다음 확인 때 예약합니다」라고 떠 있었는데 거짓말이었다. */
section('쌓인 원고 걸어주기');

const upSrc = require('fs')
  .readFileSync(require('path').join(__dirname, '..', 'services', 'threads', 'autopost.js'), 'utf8');
t('쌓인 원고를 걸어주는 자리가 있다', /async function catchUp\(rule\)/.test(upSrc), true);
t('앞으로 올릴 원고만 본다', upSrc.indexOf("status = 'draft' AND slot_at IS NOT NULL AND slot_at > NOW()") > 0, true);
t('원고 규칙에서는 안 건다', upSrc.indexOf("if (rule.mode !== 'publish') return { done: 0, errors: [] };") > 0, true);
t('그 규칙의 계정으로 건다', /catchUp[\s\S]{0,900}accountId: rule\.accountId/.test(upSrc), true);
/* 예약을 거는 데는 OpenAI 키가 필요 없다 — 키가 없다고 쌓인 원고까지 못 나가면 안 된다 */
t('키 검사보다 먼저 돈다',
  upSrc.indexOf('await catchUp(rule)') < upSrc.indexOf("errors.concat(['OpenAI 키가 없습니다'])"), true);
/* 같은 말을 다섯 줄 쌓아봐야 읽는 데 방해만 된다 */
t('실패는 첫 번째만 알린다', upSrc.indexOf('if (!errors.length) errors.push') > 0, true);
t('한 바퀴에 다섯 개까지', upSrc.indexOf('const CATCH_UP = 5;') > 0, true);
t('몇 개 걸었는지 돌려준다', upSrc.indexOf('return { made, errors, moved, caught };') > 0, true);

/* ── 영어가 섞이면 못 나간다 ──
   ⚠️ 실제로 「처음으로 Threads에서 무료사주 신청 받아본다」가 나갔다.
      「스레드」라고 쓰면 될 것을 영어로 썼다. */
section('한글로만');

const G4 = require(require('path').join(__dirname, '..', 'services', 'threads', 'guideline'));
const engRow = (t, rp) => checkPost({ postType: '정보형', form: 'single',
  parts: [t], replyText: rp || '' }).rows.find((r) => r.label === '영어 없이 한글로');

t('Threads 를 잡는다', engRow('처음으로 Threads에서 신청 받아본다').ok, false);
t('무엇이 걸렸는지 말해준다',
  engRow('처음으로 Threads에서 신청 받아본다').detail.indexOf('Threads') === 0, true);
t('한글로 바꾸라고 알려준다',
  engRow('Threads 에서').detail.indexOf('스레드') > 0, true);
t('DM 도 잡는다', engRow('디엠 말고 DM 으로').ok, false);
t('vs 도 잡는다', engRow('A vs B 중에 골라봐').ok, false);
/* 첫 댓글도 눈에 보이는 글이다 */
t('첫 댓글에 섞여도 잡는다', engRow('멀쩡한 본문임', 'DM 주세요').ok, false);

/* 막지 말아야 할 것 — 여기가 새면 아무 글도 못 올린다 */
t('한글만 있으면 통과', engRow('갑목은 곧게 자람').ok, true);
t('간지도 통과', engRow('오늘은 계미일임').ok, true);
t('이모지는 통과', engRow('🍀 운 좋은 띠').ok, true);
t('숫자는 통과', engRow('1. 생각을 다 끝내고 말함').ok, true);
/* 한 글자는 「A형」처럼 쓰일 수 있어 봐준다 */
t('한 글자는 봐준다', engRow('A형 성격이랑은 다름').ok, true);
t('영어 낱말 찾기', G4.englishIn('Threads 와 DM'), ['Threads', 'DM']);
t('같은 낱말은 한 번만', G4.englishIn('DM DM DM'), ['DM']);
t('없으면 빈 배열', G4.englishIn('한글만 있음'), []);

/* 애초에 안 쓰도록 프롬프트에도 적어둔다 */
const P5 = require(require('path').join(__dirname, '..', 'services', 'threads', 'prompt'));
const engPrompt = P5.buildPrompt('재물운', { ledger: {}, facts: [], limit: 1 });
t('프롬프트가 영어를 막는다', engPrompt.indexOf('영어를 쓰지 마세요') > 0, true);
t('바꿔 쓸 말을 알려준다', engPrompt.indexOf('Threads → 스레드') > 0, true);

/* ── 첫 댓글도 고칠 수 있어야 한다 ──
   ⚠️ 「수정하기」가 본문만 고쳤다. 리스트형은 알맹이가 댓글에 있어서
      본문만 고칠 수 있으면 반쪽짜리다.
      「내 원고」 탭에서는 첫 댓글이 아예 보이지도 않았다. */
section('첫 댓글 고치기');

t('서버가 댓글을 받는다', routeSrc.indexOf("typeof b.replyText === 'string'") > 0, true);
/* 안 보내면 건드리지 않는다 — 빈 문자열만 「지우기」로 본다 */
t('안 보내면 안 건드린다', routeSrc.indexOf('patch.replyText = b.replyText.trim()') > 0, true);

/* 올라갈 글 — 수정하기 칸 */
t('수정하기에 댓글 칸이 있다', viewSrc.indexOf("<textarea class=\"reply\"") > 0, true);
t('비우면 없이 나간다고 알려준다', viewSrc.indexOf('비우면 댓글 없이 나갑니다') > 0, true);
t('저장할 때 댓글도 담는다', viewSrc.indexOf('replyText: rp ? rp.value : undefined') > 0, true);

/* 내 원고 탭 */
t('원고에 첫 댓글이 보인다', viewSrc.indexOf("<div class=\"txt rp\">") > 0, true);
t('원고에서도 고칠 수 있다', viewSrc.indexOf("<textarea class=\"rp-edit\"") > 0, true);
/* 댓글을 본문으로 잘못 넣으면 두 편짜리 글이 되어버린다 */
t('댓글을 본문에서 갈라낸다', viewSrc.indexOf("t.classList.contains('rp') ? null : t.textContent") > 0, true);
t('저장할 때도 갈라낸다', viewSrc.indexOf('.filter(function(t){ return t !== rpBox; })') > 0, true);

/* ── 첫 줄은 후킹 자리 ──
   ⚠️ 「일진을 그대로 쓰라」고 일러줬더니 모델이 첫 줄을 일진으로 바꿔
      「오늘은 을유일」로 시작했다. 그렇게 시작하면 아무도 안 읽는다.
      틀 첫 줄은 걸어야 하는 자리다. */
const HOOK_TPL = ['오늘 잘 풀리는 사람은', '사람이든 일이든 먼저 신호가 올 수 있음', '',
  '9월 5일 오늘의 운세', '', '🍀 운 좋은 띠', '🐑 양띠', '🐯 호랑이띠'].join(LF);
const HOOK_BAD = ['오늘은 을유일', '사람이든 일이든 먼저 움직일수록 갈림', '',
  '9월 8일 오늘의 운세', '', '🍀 운 좋은 띠', '🐲 용띠', '🐍 뱀띠'].join(LF);
const HOOK_OK = ['오늘은 사람 관계에서', '선명하게 정리되는 게 생길 수 있는 날', '',
  '9월 8일 오늘의 운세', '', '🍀 운 좋은 띠', '🐲 용띠', '🐍 뱀띠'].join(LF);

t('일진을 알아본다', DS.hasGanji('오늘은 을유일'), true);
t('띄어 써도 알아본다', DS.hasGanji('오늘은 계미 일'), true);
t('보통 말은 일진이 아니다', DS.hasGanji('오늘은 사람 관계에서'), false);
t('첫 줄을 일진으로 바꾸면 잡는다', DS.check(HOOK_TPL, HOOK_BAD).ok, false);
t('후킹 자리라고 말해준다',
  DS.check(HOOK_TPL, HOOK_BAD).why.indexOf('첫 줄은 후킹입니다') > 0, true);
t('틀의 첫 줄을 보여준다',
  DS.check(HOOK_TPL, HOOK_BAD).why.indexOf('오늘 잘 풀리는 사람은') > 0, true);
t('후킹으로 시작하면 통과', DS.check(HOOK_TPL, HOOK_OK).ok, true);
/* 틀이 일진으로 시작하는 사람이면 그건 그대로 둬야 한다 */
const GANJI_TPL = ['오늘은 계미일', '', '9월 5일 오늘의 운세', '', '🍀 운 좋은 띠', '🐑 양띠'].join(LF);
t('원래 일진으로 시작하는 틀은 안 막는다',
  DS.check(GANJI_TPL, ['오늘은 을유일', '', '9월 8일 오늘의 운세', '', '🍀 운 좋은 띠', '🐲 용띠'].join(LF)).ok,
  true);
/* 틀에 아예 없는 일진을 넣는 것도 막는다 */
t('틀에 없는 일진을 넣으면 잡는다',
  DS.check(HOOK_TPL, HOOK_OK + LF + '오늘은 을유일이라').ok, false);

/* 줄 차례를 번호로 못 박아야 순서가 지켜진다 */
const skel = DS.skeleton(HOOK_TPL);
t('줄마다 번호를 붙인다', skel.indexOf('1줄:') === 2, true);
t('첫 줄을 후킹이라고 이름 붙인다', skel.indexOf('**후킹**') > 0, true);
/* 첫 줄 주의는 틀마다 다르다 — 부르는 쪽이 정한다 */
t('일진으로 바꾸지 말라고 적는다',
  DS.skeleton(HOOK_TPL, '걸어야 하는 자리. 여기를 일진으로 바꾸지 마세요')
    .indexOf('여기를 일진으로 바꾸지 마세요') > 0, true);
t('인사글엔 다른 주의를 붙인다',
  DS.skeleton(HOOK_TPL, '이름·경력만 이 자리에 끼워 넣으세요')
    .indexOf('이름·경력만') > 0, true);
t('안 주면 무난한 말로', DS.skeleton(HOOK_TPL).indexOf('함부로 바꾸지 마세요') > 0, true);
t('날짜 줄을 알아본다', skel.indexOf('날짜 줄') > 0, true);
t('빈 줄도 자리로 센다', skel.indexOf('(빈 줄)') > 0, true);
t('이모지 줄을 알아본다', skel.indexOf('이모지로 시작') > 0, true);
/* 틀에 일진이 없으면 없다고 못 박아야 안 넣는다 */
t('일진 없는 틀이라고 알려준다',
  DS.blueprint(HOOK_TPL).join(LF).indexOf('일진(계미일 같은 것)이 없습니다') > 0, true);

const P2 = require(require('path').join(__dirname, '..', 'services', 'threads', 'prompt'));
const hookBlock = P2.dailyBlock({ body: HOOK_TPL, mode: 'single' });
t('줄 차례가 프롬프트에 실린다', hookBlock.indexOf('줄 차례 (이 순서 그대로)') > 0, true);
t('순서를 바꾸지 말라고 적는다', hookBlock.indexOf('줄 차례를 바꾸지 마세요') > 0, true);
/* 날짜 덩어리도 첫 줄을 건드리지 말라고 해야 한다 */
const T3 = require(require('path').join(__dirname, '..', 'services', 'threads', 'today'));
t('일진은 틀이 적는 자리에만',
  T3.block(new Date('2026-09-08T05:00:00+09:00')).indexOf('일진으로 글을 시작하지 마세요') > 0, true);

/* ── 이미 만들어둔 글 ──
   ⚠️ 띠를 계산으로 정하기 전에 만든 글이 그대로 남아 있다.
      「예약됨」이면 Zernio 가 들고 있어서 **그대로 나간다.**
      어느 글을 다시 만들어야 하는지 사람이 눈으로 찾게 하면 안 된다. */
t('만들어둔 글의 띠도 본다', routeSrc.indexOf('function ttiWarn(') > 0, true);
t('글마다 실어 보낸다', routeSrc.indexOf('tti: ttiWarn(v)') > 0, true);
t('이미 나간 글은 안 건드린다',
  routeSrc.indexOf("if (post.status === 'published') return null;") > 0, true);
/* 「쥐띠는 올해…」처럼 하나만 짚은 보통 글까지 붙잡으면
   멀쩡한 글에 빨간 줄이 떠서 아무도 안 믿게 된다 */
t('띠를 여럿 늘어놓은 글만 본다', routeSrc.indexOf('if (found < 4) return null;') > 0, true);
t('화면이 그 경고를 그린다', viewSrc.indexOf('띠가 그 날과 안 맞습니다') > 0, true);
t('다시 만들라고 알려준다', viewSrc.indexOf('계산해서 다시 만듭니다') > 0, true);
/* 예약된 글은 그대로 나간다 — 더 세게 짚어야 한다 */
t('예약된 글은 더 세게 짚는다', viewSrc.indexOf('이 글이 그대로 올라갑니다') > 0, true);
t('요일 칸에도 표시한다', viewSrc.indexOf('띠 확인') > 0, true);

/* 파이프라인이 그 검사를 쓰는지 */
const pipeSrc3 = require('fs')
  .readFileSync(require('path').join(__dirname, '..', 'services', 'threads', 'pipeline.js'), 'utf8');
t('만든 글의 띠를 확인한다', pipeSrc3.indexOf('jiji.checkText(t.dayBranch, whole)') > 0, true);
t('날짜 틀에서만 본다', pipeSrc3.indexOf('o.form && o.form.needsDate') > 0, true);
t('첫 댓글까지 같이 본다', pipeSrc3.indexOf('(first.replyText') > 0, true);

/* 마지막 줄은 done() 이 찍는다 — 「만들기 함수」 검사가 비동기라
   여기서 끝내버리면 그 결과를 못 보고 나간다. */
