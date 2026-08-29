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
const { buildPrompt } = require('../services/threads/prompt');

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
t('경고형에 해결 문장이 있으면 통과',
  hard({ postType: '경고형', form: 'single', parts: ['조심하세요. 이렇게 하면 됩니다'] }), true);
t('멀쩡한 글은 통과',
  hard({ postType: '정보형', form: 'single', parts: ['오늘은 정리하기 좋은 날입니다'] }), true);

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
t('지침 전문이 프롬프트에 들어간다', p.includes('# 콘텐츠 지침') && p.length > 14000, true);
t('원장이 프롬프트에 들어간다', p.includes('2026-08-01 · 3회'), true);
t('안 쓴 후킹은 미사용으로', p.includes('미사용'), true);
t('개수 제한이 들어간다', p.includes('정확히 3개만'), true);

console.log('\n' + (fail ? '✗ ' : '✓ ') + '통과 ' + pass + ' · 실패 ' + fail);
process.exit(fail ? 1 : 0);
