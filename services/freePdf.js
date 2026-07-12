/**
 * freePdf.js
 *
 * 무료사주 PDF (교육생 브랜드명으로 나감).
 *
 *  표지 → 목차 → 만세력 표
 *   01 만세력 이해하기      (고정 해설 · 설정에서 수정 가능)
 *   02 사주로 보는 나는?     (AI — 강한 기운 / 부족한 기운)
 *   03 타고난 성향
 *   04 올해 운세
 *   05 연애운
 *   06 재물운
 *   07 건강운
 *   08 종합 조언
 *  ── 여기서부터 업셀 (설정에서 전부 수정 가능) ──
 *   09 프리미엄 종합사주 안내
 *   10 이런 질문에 답해드립니다
 *   11 먼저 받아보신 분들의 후기 (교육생 업로드 이미지)
 *   12 할인 안내 + 카카오 상담 버튼
 *  → 마무리 페이지 (브랜드명)
 */

const {
  coverPage, tocPage, sajuPages, endPage, buildCSS, esc,
} = require('./pdfDoc');
const { getPromo } = require('./freePromo');

const TYPE = '무료사주';

/* ── 챕터를 페이지에 "채워서" 배치 ──
 *
 * 기존 유료 리포트는 챕터마다 새 페이지를 강제한다(chapter-start).
 * 무료는 챕터가 짧아서 그러면 페이지 절반이 빈다.
 * → 남은 줄이 충분하면 다음 챕터를 같은 페이지에 이어 붙인다. (보통 2개/장)
 */
const LINES_PER_PAGE = 31;   // A4 한 장에 들어가는 줄 수
const CHARS_PER_LINE = 45;   // 한 줄 글자 수
const LINES_HEAD = 5;        // 챕터 제목 + 구분선
const LINES_GAP = 3;         // 같은 페이지에서 챕터 사이 여백
const MIN_TAIL = 9;          // 이만큼도 안 남으면 새 페이지에서 시작

const lineCount = (t) => Math.ceil(String(t || '').length / CHARS_PER_LINE) + 1;

function flowPages(chapters) {
  const pages = [];
  let cur = [];
  let used = 0;

  const flush = () => { if (cur.length) pages.push(cur); cur = []; used = 0; };

  chapters.forEach((ch, i) => {
    const no = String(i + 1).padStart(2, '0');
    const paras = String(ch.body || '').split(/\n{2,}|\n/).map((x) => x.trim()).filter(Boolean);
    const first = paras[0] ? lineCount(paras[0]) : 0;

    // 이 페이지에 제목 + 첫 문단이 못 들어가면 새 페이지
    const gap = used > 0 ? LINES_GAP : 0;
    if (used > 0 && (used + gap + LINES_HEAD + first > LINES_PER_PAGE
                     || LINES_PER_PAGE - used < MIN_TAIL)) {
      flush();
    }

    cur.push({ t: 'head', no, title: ch.title, second: used > 0 });
    used += (used > 0 ? LINES_GAP : 0) + LINES_HEAD;

    paras.forEach((p) => {
      const n = lineCount(p);
      if (used + n > LINES_PER_PAGE) flush();   // 넘치면 다음 장으로 흘린다
      cur.push({ t: 'p', text: p });
      used += n;
    });
  });

  flush();
  return pages;
}

function renderFlow(chapters) {
  return flowPages(chapters).map((items) => `
<section class="page sheet chapter">
  ${items.map((it) => it.t === 'head' ? `
  <div class="ch-head"${it.second ? ' style="margin-top:26px;padding-top:22px;border-top:1px solid #e6dfd0"' : ''}>
    <span class="ch-no">${it.no}</span>
    <h2 class="ch-title">${esc(it.title)}</h2>
  </div>
  <div class="pg-line"></div>` : `
  <div class="ch-block"><p>${esc(it.text)}</p></div>`).join('')}
</section>`).join('');
}

/** AI 결과(result) → 챕터 배열 */
function freeChapters(result, promo) {
  const r = result || {};
  const kw = Array.isArray(r.keywords) && r.keywords.length
    ? '핵심 키워드 — ' + r.keywords.join(' · ') : '';

  const list = [
    { title: '만세력 이해하기', body: promo.manseEssay },
    { title: '내 사주 한눈에 보기', body: [kw, r.manse].filter(Boolean).join('\n\n') },
    { title: '사주로 보는 나는?', body: r.self },
    { title: '타고난 성향', body: r.personality },
    { title: '올해 운세', body: r.year },
    { title: '연애운', body: r.love },
    { title: '재물운', body: r.wealth },
    { title: '건강운', body: r.health },
    { title: '종합 조언', body: r.advice },
  ];
  return list.filter((c) => String(c.body || '').trim());
}

/** 09 프리미엄 안내 */
function premiumPage(promo, no) {
  const paras = String(promo.premium.body || '').split(/\n{2,}/).filter(Boolean);
  return `
<section class="page sheet chapter chapter-start promo">
  <div class="ch-head">
    <span class="ch-no">${no}</span>
    <h2 class="ch-title">더 깊은 풀이</h2>
  </div>
  <div class="pg-line"></div>
  <div class="promo-title">${esc(promo.premium.title)}</div>
  <div class="promo-body">${paras.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
</section>`;
}

/** 10 Q&A */
function qaPage(promo, no) {
  const items = (promo.qa.items || []).slice(0, 8);
  return `
<section class="page sheet chapter chapter-start promo">
  <div class="ch-head">
    <span class="ch-no">${no}</span>
    <h2 class="ch-title">이런 질문에 답해드립니다</h2>
  </div>
  <div class="pg-line"></div>
  <div class="promo-title">${esc(promo.qa.title)}</div>
  <p class="promo-lead">${esc(promo.qa.intro)}</p>
  <ul class="qa-list">
    ${items.map((q) => `<li><span class="qa-tag">답변완료</span>${esc(q)}</li>`).join('')}
  </ul>
</section>`;
}

/** 11 후기 이미지 (교육생 업로드 — 없으면 페이지 자체를 생략) */
function reviewPages(promo, no) {
  const imgs = promo.reviews.images || [];
  if (!imgs.length) return '';

  // 한 장에 2컷씩
  const chunks = [];
  for (let i = 0; i < imgs.length; i += 2) chunks.push(imgs.slice(i, i + 2));

  return chunks.map((group, i) => `
<section class="page sheet chapter${i === 0 ? ' chapter-start' : ''} promo">
  ${i === 0 ? `
  <div class="ch-head">
    <span class="ch-no">${no}</span>
    <h2 class="ch-title">${esc(promo.reviews.title)}</h2>
  </div>
  <div class="pg-line"></div>` : ''}
  <div class="rv-grid${group.length === 1 ? ' one' : ''}">
    ${group.map((src) => `<img src="${esc(src)}" alt="후기">`).join('')}
  </div>
</section>`).join('');
}

/** 12 할인 + 카카오 상담 버튼 */
function discountPage(promo, teacher, no) {
  const d = promo.discount;
  const paras = String(d.body || '').split(/\n{2,}/).filter(Boolean);
  const link = teacher.kakao_consult_link || '';

  const price = (d.priceNow || d.priceWas || d.off) ? `
  <div class="price-box">
    ${d.off ? `<span class="price-off">${esc(d.off)}</span>` : ''}
    ${d.priceWas ? `<span class="price-was">${esc(d.priceWas)}</span>` : ''}
    ${d.priceNow ? `<span class="price-now">${esc(d.priceNow)}</span>` : ''}
  </div>` : '';

  const btn = link
    ? `<a class="promo-btn" href="${esc(link)}" target="_blank" rel="noopener">${esc(d.btn)}</a>
       <p class="promo-note">버튼을 누르면 상담 채널로 연결됩니다.</p>`
    : `<p class="promo-note">상담 링크가 아직 등록되지 않았습니다. (설정 → 카카오 상담 링크)</p>`;

  return `
<section class="page sheet chapter chapter-start promo">
  <div class="ch-head">
    <span class="ch-no">${no}</span>
    <h2 class="ch-title">상담 안내</h2>
  </div>
  <div class="pg-line"></div>
  <div class="promo-title">${esc(d.title)}</div>
  <div class="promo-body">${paras.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
  ${price}
  ${btn}
</section>`;
}

/**
 * 무료사주 PDF 전체 HTML
 * @param {object} o { teacher, client, saju, result, baseUrl }
 */
function buildFreePdfHtml({ teacher, client, saju, result, baseUrl }) {
  const promo = getPromo(teacher);
  const chapters = freeChapters(result, promo);

  // 목차에는 업셀 페이지도 함께 노출
  const tocList = chapters.slice();
  if (promo.show) {
    tocList.push({ title: '더 깊은 풀이' });
    tocList.push({ title: '이런 질문에 답해드립니다' });
    if ((promo.reviews.images || []).length) tocList.push({ title: promo.reviews.title });
    tocList.push({ title: '상담 안내' });
  }

  const n = chapters.length;
  const pad = (i) => String(i).padStart(2, '0');

  const promoPages = promo.show
    ? premiumPage(promo, pad(n + 1))
      + qaPage(promo, pad(n + 2))
      + reviewPages(promo, pad(n + 3))
      + discountPage(promo, teacher, pad(n + ((promo.reviews.images || []).length ? 4 : 3)))
    : '';

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(client.name)}님의 무료 사주 리포트</title>
<style>${buildCSS(baseUrl)}</style>
</head>
<body>
${coverPage({ type: TYPE, client, teacher, baseUrl })}
${tocPage(tocList, TYPE)}
${sajuPages({ client, saju, type: TYPE })}
${renderFlow(chapters)}
${promoPages}
${endPage({ teacher })}
</body>
</html>`;
}

module.exports = { buildFreePdfHtml, freeChapters };
