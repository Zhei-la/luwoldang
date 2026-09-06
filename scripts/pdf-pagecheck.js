/**
 * PDF 리포트 페이지 수 점검
 *
 *   목차(outlines.js)를 고치면 페이지 수가 바로 바뀐다.
 *   "30장 이내" 를 넘겼는지 눈으로 세지 말고 이 스크립트로 확인한다.
 *
 *   실행:  node scripts/pdf-pagecheck.js
 *          node scripts/pdf-pagecheck.js 590     ← 소제목당 590자로 가정 (허용 상한)
 *
 *   본문 페이지는 pdfDoc.js 의 실제 분할 함수(chapterPages)를 그대로 돌려서 센다.
 *   고정 페이지(표지·목차·만세력·용어풀이·맺음말)는 아래 상수로 더한다.
 */

const { chapterPages } = require('../services/pdfDoc');
const { OUTLINES, outlineWithQuestion } = require('../services/outlines');

/* 고정 페이지 —  buildReportHtml 이 본문 앞뒤에 붙이는 것들
 *   표지 1 + 목차 1 + 만세력 4 (원국 / 오행·격국 / 대운·세운 / 월운) + 용어풀이 2 + 맺음말 1
 *   궁합은 상대방 원국·오행 2장이 더 붙는다. */
const FIXED = 9;
const FIXED_PAIR = 11;
const PAIR_TYPES = ['연인궁합'];

/* 목표 장수 — 이걸 넘으면 실패.
   종합사주만 평생을 보는 프리미엄이라 40장이고, 나머지는 30장이다. */
const LIMIT = 30;
const LIMIT_BY_TYPE = { 종합사주: 40 };
const limitOf = (type) => LIMIT_BY_TYPE[type] || LIMIT;

/* n자짜리 본문을 문단 3개로 만든다.
 *
 *   문단이 몇 줄을 먹는지는 올림으로 센다(pdfDoc.js 의 paraLines).
 *   그래서 같은 글자 수라도 문단을 어떻게 나누느냐에 따라 줄 수가 달라진다.
 *   고르게 나눈 경우와 들쭉날쭉한 경우를 둘 다 재서 나쁜 쪽을 쓴다. */
const SPLITS = [
  [1 / 3, 1 / 3, 1 / 3],      // 고르게
  [0.45, 0.35, 0.20],         // 첫 문단이 긴 경우
  [0.20, 0.45, 0.35],         // 가운데가 긴 경우
];

function fakeBody(n, split) {
  const filler = '가나다라마바사아자차카타파하거너더러머버서어저처커터퍼허'.repeat(60);
  return split.map((r) => filler.slice(0, Math.round(n * r))).join('\n\n');
}

function bodyPages(chapters, len) {
  let worst = 0;
  for (const split of SPLITS) {
    const filled = chapters.map((c) => ({
      title: c.title,
      blocks: (c.sub || []).map((s) => ({ sub: s, body: fakeBody(len, split) })),
    }));
    const html = chapterPages(filled, '');
    const n = (html.match(/<section class="page/g) || []).length;
    if (n > worst) worst = n;
  }
  return worst;
}

function run(len) {
  console.log(`\n소제목당 ${len}자로 가정. 목표는 ${LIMIT}장 이내 (종합사주만 ${LIMIT_BY_TYPE['종합사주']}장).\n`);
  const head = '리포트'.padEnd(12) + '장  소제목   본문자수   본문p  고정p   합계';
  console.log(head);
  console.log('-'.repeat(head.length + 6));

  let over = 0;
  const rows = [];

  for (const type of Object.keys(OUTLINES)) {
    const fixed = PAIR_TYPES.indexOf(type) >= 0 ? FIXED_PAIR : FIXED;
    const limit = limitOf(type);

    // 질문이 있으면 장이 하나 늘어난다. 늘어난 쪽이 최악이므로 그걸 기준으로 본다.
    for (const q of ['', '올해 이직해도 될까요?']) {
      const chapters = outlineWithQuestion(type, q);
      const subs = chapters.reduce((a, c) => a + c.sub.length, 0);
      const body = bodyPages(chapters, len);
      const total = body + fixed;
      if (total > limit) over++;
      rows.push({ type, q: !!q, chs: chapters.length, subs, chars: subs * len, body, fixed, total, limit });
    }
  }

  // 목표에 가장 바짝 붙은(또는 넘긴) 것부터 보여준다
  rows.sort((a, b) => (b.total - b.limit) - (a.total - a.limit));
  for (const r of rows) {
    const mark = r.total > r.limit ? `  ✗ ${r.limit}장 초과` : '';
    console.log(
      (r.type + (r.q ? '+질문' : '')).padEnd(14) +
      String(r.chs).padStart(2) + String(r.subs).padStart(7) +
      String(r.chars).padStart(10) + String(r.body).padStart(7) +
      String(r.fixed).padStart(6) + String(r.total).padStart(7) + mark
    );
  }

  console.log('');
  if (over) {
    console.log(`✗ 목표 장수를 넘긴 리포트가 ${over}개 있습니다.`);
    process.exitCode = 1;
  } else {
    const worst = rows.reduce((a, r) => Math.max(a, r.total), 0);
    console.log(`✓ 전부 목표 장수 안입니다. 가장 두꺼운 것이 ${worst}장.`);
  }
}

run(Number(process.argv[2]) || 570);
