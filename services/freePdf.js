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
  coverPage, tocPage, sajuPages, chapterPages, endPage, buildCSS, esc,
} = require('./pdfDoc');
const { getPromo } = require('./freePromo');

const TYPE = '무료사주';

/** AI 결과(result) → 챕터 배열 */
function freeChapters(result, promo) {
  const r = result || {};
  const ch = (title, body) => ({ title, blocks: [{ sub: '', body: String(body || '').trim() }] });

  const list = [
    ch('만세력 이해하기', promo.manseEssay),
    ch('사주로 보는 나는?', r.self),
    ch('타고난 성향', r.personality),
    ch('올해 운세', [r.year, r.yearOutro].filter(Boolean).join('\n\n')),
    ch('연애운', [r.love, r.loveOutro].filter(Boolean).join('\n\n')),
    ch('재물운', [r.wealth, r.wealthOutro].filter(Boolean).join('\n\n')),
    ch('건강운', r.health),
    ch('종합 조언', r.advice),
  ];

  // 만세력 요약(manse)이 있으면 '만세력 이해하기' 뒤에 붙인다
  if (r.manse) {
    list[0].blocks.push({ sub: '내 사주 한눈에 보기', body: r.manse });
  }
  return list.filter((c) => c.blocks.some((b) => b.body));
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
${chapterPages(chapters, null)}
${promoPages}
${endPage({ teacher })}
</body>
</html>`;
}

module.exports = { buildFreePdfHtml, freeChapters };
