/**
 * docs/PDF-리포트-목차.md 를 services/outlines.js 에서 다시 만든다.
 *
 *   목차는 두 군데서 쓰인다.
 *     · 프로그램의 「AI로 리포트 작성」  → services/outlines.js
 *     · 교육생이 손으로 뽑을 때의 GPT   → docs/PDF-리포트-목차.md (Knowledge 파일)
 *   예전에는 이 둘을 손으로 맞췄다. 한쪽만 고치면 조용히 어긋난다.
 *   이제 코드가 원본이고 문서는 여기서 만들어 낸다.
 *
 *   실행:  node scripts/pdf-outline-doc.js
 */

const fs = require('fs');
const path = require('path');
const { OUTLINES, QUESTION_CHAPTER } = require('../services/outlines');

const OUT = path.join(__dirname, '..', 'docs', 'PDF-리포트-목차.md');
const TYPES = Object.keys(OUTLINES);

/** 한 종류를 코드 블록으로 */
function block(type) {
  const chapters = OUTLINES[type];
  const subs = chapters.reduce((a, c) => a + c.sub.length, 0);

  const lines = chapters.map((c, i) => {
    const head = `${i + 1}. ${c.title}`;
    const note = c.note
      ? c.note.split('\n').map((x) => `   ※ ${x.trim()}`).join('\n') + '\n'
      : '';
    const sub = c.sub.map((s) => `   · ${s}`).join('\n');
    return `${head}\n${note}${sub}`;
  }).join('\n');

  return `## ${type}

${type} — ${chapters.length}장, 소제목 ${subs}개

\`\`\`
[${type}] ${chapters.length}장
${lines}
\`\`\`
`;
}

const q = QUESTION_CHAPTER;

const doc = `# 리포트 목차

이 파일은 **GPT의 Knowledge 에 올려 두는 목차표**입니다.
「PDF 글 생성기 지침」이 이 파일에서 목차를 찾습니다.

> ⚠️ 이 파일은 \`services/outlines.js\` 에서 자동으로 만들어집니다.
> 손으로 고치지 마세요. 목차를 바꾸려면 \`services/outlines.js\` 를 고친 다음
> \`node scripts/pdf-outline-doc.js\` 를 실행하세요.

쓸 수 있는 종류는 아래 ${TYPES.length}가지입니다.

${TYPES.join(' / ')}

**소제목은 여기 적힌 글자 그대로 씁니다.** 바꾸거나, 줄이거나, 새로 만들지 않습니다.
한 장의 소제목을 하나도 빠뜨리지 않습니다.

소제목 하나가 리포트의 한 페이지입니다. **소제목 하나에 3문단, 480~570자**로 씁니다.
길게 쓰면 페이지가 밀려 리포트가 두꺼워집니다.

\`※\` 로 시작하는 줄은 그 장에서 특히 지켜야 할 것입니다. 본문에 그대로 옮겨 적지 마세요.

---

## ${q.title}

내담자가 신청할 때 「묻고 싶은 것」을 적었으면, 이 장을 **마지막 장 바로 앞**에 끼워 넣습니다.
질문이 없으면 넣지 않습니다.

\`\`\`
[${q.title}] 1장
1. ${q.title}
${q.sub.map((s) => `   · ${s}`).join('\n')}
\`\`\`

---

## 신년운세는 남은 기간만 씁니다

신년운세는 지금이 몇 월이냐에 따라 다루는 기간이 달라집니다.
지나간 달은 풀 수 없기 때문입니다.

아래 목차대로 쓰되, **이미 지난 달은 빼고 남은 달만** 씁니다.
「상반기와 하반기의 흐름」·「월별 운세 흐름」·「기회가 큰 시기와 올해 활용법」
세 장이 특히 그렇습니다.

---

${TYPES.map(block).join('\n---\n\n')}`;

fs.writeFileSync(OUT, doc, 'utf8');

const subs = TYPES.reduce((a, t) => a + OUTLINES[t].reduce((b, c) => b + c.sub.length, 0), 0);
console.log(`${path.relative(process.cwd(), OUT)} 을 다시 만들었습니다 — ${TYPES.length}종, 소제목 ${subs}개`);
