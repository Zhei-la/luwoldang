/**
 * 본문 후처리 검사 — 숫자 표기
 *
 *   AI 가 "삼십살", "이천이십육년" 처럼 한글로 쓴 숫자를 아라비아 숫자로 되돌리는
 *   후처리(fixKoreanNumbers)가 있다. 그런데 지지의 「사」와 「오」는
 *   한자 숫자 4·5 이기도 해서, "병오 세운" 의 "오 세" 를 나이로 읽고
 *   "병5세운" 으로 바꿔 손님에게 내보낸 적이 있다.
 *
 *   같은 사고가 다시 나지 않게 여기에 남긴다.
 *   실행:  node scripts/pdf-textcheck.js
 */

const { fixKoreanNumbers } = require('../services/ai');

/* [입력, 기대 출력] */
const CASES = [
  // 간지는 건드리면 안 된다 (60갑자 중 사·오가 들어간 것들)
  ['올해의 병오 세운에서는', '올해의 병오 세운에서는'],
  ['정사 세운을 보면', '정사 세운을 보면'],
  ['기사 대운의 흐름', '기사 대운의 흐름'],
  ['기사 월운에서는', '기사 월운에서는'],
  ['갑오 세운과 을사 월운', '갑오 세운과 을사 월운'],
  ['무오 대운 · 임오 세운 · 계사 월운', '무오 대운 · 임오 세운 · 계사 월운'],
  ['경오 대운의 사 운성', '경오 대운의 사 운성'],

  // 한글 숫자는 되돌려야 한다
  ['이천이십육년에는', '2026년에는'],
  ['서른넷부터', '34세부터'],
  ['예순 전후', '60세 전후'],
  ['팔월에는', '8월에는'],
  ['육십만원', '60만원'],
  ['마흔셋에', '43세에'],
];

let bad = 0;
for (const [input, want] of CASES) {
  const got = fixKoreanNumbers(input);
  const ok = got === want;
  if (!ok) bad++;
  console.log(`${ok ? '  통과  ' : '  실패  '}${JSON.stringify(input)} → ${JSON.stringify(got)}`
    + (ok ? '' : `   (기대: ${JSON.stringify(want)})`));
}

console.log('');
if (bad) {
  console.log(`✗ ${CASES.length}개 중 ${bad}개 실패`);
  process.exitCode = 1;
} else {
  console.log(`✓ ${CASES.length}개 전부 통과`);
}
