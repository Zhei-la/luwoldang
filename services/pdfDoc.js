/**
 * pdfDoc.js
 * 사주 리포트 PDF 문서 생성
 *
 * 구조:
 *   1p     표지
 *   2p     목차
 *   3~5p   만세력 (원국표 · 오행 · 대운)
 *   6p~    본문 (챕터마다 새 페이지에서 시작)
 *
 * 브라우저 인쇄(Ctrl+P) → PDF 저장으로 출력.
 */

const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));

const EL_COLOR = { 목: '#2e8b57', 화: '#cf4038', 토: '#b8860b', 금: '#6b7684', 수: '#2f6bb0' };

function fmtDate(d) {
  const t = d ? new Date(d) : new Date();
  return `${t.getFullYear()}년 ${t.getMonth() + 1}월 ${t.getDate()}일`;
}

/* ── 1. 표지 ── */
function coverPage({ type, client, teacher }) {
  return `
<section class="page cover">
  <div class="cv-frame">
    <div class="cv-moon"></div>
    <p class="cv-brand">${esc(teacher.site_name || teacher.name || '사주 리포트')}</p>
    <h1 class="cv-type">${esc(type)}</h1>
    <div class="cv-line"></div>
    <p class="cv-name">${esc(client.name)} 님</p>
    <p class="cv-birth">
      ${esc(client.birthDate)} ${esc(client.calendar || '양력')}
      ${client.birthTime ? esc(client.birthTime) : '시간 모름'}
      ${client.gender ? ' · ' + esc(client.gender) : ''}
    </p>
    <p class="cv-date">${fmtDate()}</p>
  </div>
</section>`;
}

/* ── 2. 목차 ── */
function tocPage(chapters) {
  return `
<section class="page toc">
  <h2 class="pg-title">목 차</h2>
  <div class="pg-line"></div>
  <ol class="toc-list">
    <li class="toc-fixed"><span>만세력 · 사주 원국</span></li>
    ${chapters.map((c, i) => `
      <li>
        <span class="toc-no">${String(i + 1).padStart(2, '0')}</span>
        <span class="toc-name">${esc(c.title)}</span>
      </li>`).join('')}
  </ol>
</section>`;
}

/* ── 3. 만세력 ── */
function sajuPage({ client, saju }) {
  if (!saju) return '';

  const cols = ['hour', 'day', 'month', 'year'];
  const labels = { hour: '생시', day: '생일', month: '생월', year: '생년' };

  const cell = (x) => {
    if (!x) return `<td class="ms-none">미상</td>`;
    const c = EL_COLOR[x.el] || '#252522';
    return `<td>
      <div class="ms-gz" style="color:${c}">${esc(x.ko)}<span>${esc(x.char)}</span></div>
      <div class="ms-el" style="color:${c}">${x.yin ? '-' : '+'}${esc(x.el)}</div>
      <div class="ms-god" style="color:${c}">${esc(x.god || '')}</div>
    </td>`;
  };
  const small = (t) => `<td class="ms-sm">${esc(t || '—')}</td>`;
  const jj = (list) => {
    if (!list || !list.length) return small('—');
    return `<td class="ms-sm">${list.map((g) =>
      `<span style="color:${EL_COLOR[g.el] || '#5a5648'}">${esc(g.ko)}</span>`).join('')}</td>`;
  };

  const wheel = saju.elementWheel || [];
  const total = Object.values(saju.elements).reduce((a, b) => a + b, 0) || 1;

  const dw = saju.daewoon && saju.daewoon.list.length ? `
    <h3 class="ms-h">대운 <span>${saju.daewoon.forward ? '순행' : '역행'}</span></h3>
    <table class="ms-dw">
      <tr>${saju.daewoon.list.map((d) => `<th>${d.age}세</th>`).join('')}</tr>
      <tr>${saju.daewoon.list.map((d) => `<td><b>${esc(d.ko)}</b><i>${esc(d.ganzi)}</i></td>`).join('')}</tr>
    </table>` : '';

  return `
<section class="page">
  <h2 class="pg-title">만세력 · 사주 원국</h2>
  <div class="pg-line"></div>

  <div class="ms-meta">
    <p><b>${esc(client.name)}</b> ${client.gender ? esc(client.gender) : ''}</p>
    <p>${esc(client.birthDate)} ${esc(client.calendar || '양력')} ${client.birthTime ? esc(client.birthTime) : '(시간 모름)'} · ${esc(client.region || '')}</p>
    ${saju.timeCorrection && saju.timeCorrection.correctedTime
      ? `<p class="ms-corr">적용시각 ${esc(saju.timeCorrection.correctedTime)} (${esc(saju.timeCorrection.notes.join(', '))})</p>` : ''}
  </div>

  <table class="ms-chart">
    <tr class="ms-head">
      <th></th>
      ${cols.map((c) => `<th>${labels[c]}</th>`).join('')}
    </tr>
    <tr><th class="ms-rh">천간</th>${cols.map((c) => cell(saju.detail[c].stem)).join('')}</tr>
    <tr><th class="ms-rh">지지</th>${cols.map((c) => cell(saju.detail[c].branch)).join('')}</tr>
    <tr><th class="ms-rh sm">지장간</th>${cols.map((c) => jj(saju.detail[c].jijanggan)).join('')}</tr>
    <tr><th class="ms-rh sm">12운성</th>${cols.map((c) => small(saju.detail[c].unseong)).join('')}</tr>
  </table>

  <h3 class="ms-h">오행 분포</h3>
  <table class="ms-el-tbl">
    <tr>
      ${['목', '화', '토', '금', '수'].map((k) => `<th style="color:${EL_COLOR[k]}">${k}</th>`).join('')}
    </tr>
    <tr>
      ${['목', '화', '토', '금', '수'].map((k) =>
        `<td><b style="color:${EL_COLOR[k]}">${saju.elements[k]}</b>
         <i>${Math.round((saju.elements[k] / total) * 100)}%</i></td>`).join('')}
    </tr>
  </table>
  ${wheel.length ? `
    <p class="ms-wheel">
      ${wheel.map((w) => `<span style="color:${EL_COLOR[w.el]}">${w.el}(${w.group}) ${w.pct}%</span>`).join(' · ')}
    </p>` : ''}
  <p class="ms-sum">
    강한 기운 <b>${esc(saju.strong.join(', '))}</b> · 부족한 기운 <b>${esc(saju.weak.join(', '))}</b>
  </p>

  ${dw}
</section>`;
}

/* ── 4. 본문 챕터 (챕터마다 새 페이지) ── */
function chapterPages(chapters) {
  return chapters.map((ch, i) => {
    const blocks = (ch.blocks || []).map((b) => {
      const paras = String(b.body || '').split(/\n{2,}|\n/).filter(Boolean);
      const first = paras[0] || '';
      const rest = paras.slice(1);

      // 소제목 + 첫 문단을 한 덩어리로 묶어 함께 넘어가게 한다
      // (소제목만 페이지 끝에 남는 것을 방지)
      return `
      <div class="ch-block">
        <div class="ch-keep">
          ${b.sub ? `<h3 class="ch-sub">${esc(b.sub)}</h3>` : ''}
          ${first ? `<p>${esc(first)}</p>` : ''}
        </div>
        ${rest.map((p) => `<p>${esc(p)}</p>`).join('')}
      </div>`;
    }).join('');

    return `
<section class="page chapter">
  <div class="ch-head">
    <span class="ch-no">${String(i + 1).padStart(2, '0')}</span>
    <h2 class="ch-title">${esc(ch.title)}</h2>
  </div>
  <div class="pg-line"></div>
  ${blocks || '<p class="ch-empty">내용을 생성하지 못했습니다.</p>'}
</section>`;
  }).join('');
}

/* ── 5. 마무리 ── */
function endPage({ teacher }) {
  return `
<section class="page end">
  <div class="end-box">
    <div class="cv-moon small"></div>
    <p class="end-msg">${esc(teacher.consult_message || '더 궁금한 점이 있으시면 편하게 문의해주세요.')}</p>
    <p class="end-brand">${esc(teacher.site_name || teacher.name || '')}</p>
    <p class="end-note">본 사주 풀이는 참고용 콘텐츠이며,<br>의학적·법률적 조언을 대신하지 않습니다.</p>
  </div>
</section>`;
}

/* ── CSS ── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&display=swap');
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');

* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  background: #e8e6e1;
  font-family: Pretendard, -apple-system, 'Malgun Gothic', sans-serif;
  color: #2b2a26;
  line-height: 1.9;
  -webkit-font-smoothing: antialiased;
}

/* A4 페이지 */
.page {
  width: 210mm;
  min-height: 297mm;
  padding: 26mm 22mm 24mm;
  margin: 0 auto 10mm;
  background: #fffdf8;
  box-shadow: 0 4px 20px rgba(0,0,0,.12);
  position: relative;
  page-break-after: always;
  break-after: page;
}
.page:last-child { page-break-after: auto; break-after: auto; }

/* 표지 */
.cover { display: flex; align-items: center; justify-content: center; }
.cv-frame {
  text-align: center; width: 100%;
  padding: 40mm 12mm;
  border: 1px solid #d8cfb8;
  outline: 3px double #e6dcc4;
  outline-offset: 5px;
}
.cv-moon {
  width: 74px; height: 74px; margin: 0 auto 28px; border-radius: 50%;
  background: radial-gradient(circle at 35% 33%, #fff, #f0e6cf 58%, #d6c49e);
  box-shadow: 0 0 0 7px rgba(181,154,98,.10);
}
.cv-moon.small { width: 54px; height: 54px; margin-bottom: 20px; }
.cv-brand { font-family: 'Nanum Myeongjo', serif; font-size: 15px; letter-spacing: 4px; color: #a08a5c; margin-bottom: 26px; }
.cv-type { font-family: 'Nanum Myeongjo', serif; font-size: 40px; font-weight: 800; letter-spacing: 6px; color: #1f2a3d; }
.cv-line { width: 46px; height: 2px; background: #b59a62; margin: 22px auto 26px; }
.cv-name { font-family: 'Nanum Myeongjo', serif; font-size: 23px; font-weight: 700; margin-bottom: 8px; }
.cv-birth { font-size: 13.5px; color: #7c7466; }
.cv-date { font-size: 12px; color: #b3ad9c; margin-top: 34px; }

/* 공통 제목 */
.pg-title { font-family: 'Nanum Myeongjo', serif; font-size: 25px; font-weight: 800; letter-spacing: 3px; color: #1f2a3d; }
.pg-line { width: 100%; height: 1px; background: #e2d9c5; margin: 14px 0 26px; position: relative; }
.pg-line:after { content: ''; position: absolute; left: 0; top: -1px; width: 54px; height: 3px; background: #b59a62; }

/* 목차 */
.toc-list { list-style: none; margin-top: 10px; }
.toc-list li { display: flex; align-items: baseline; gap: 12px; padding: 11px 0; border-bottom: 1px dotted #e2d9c5; font-size: 15px; }
.toc-list li:last-child { border-bottom: none; }
.toc-fixed { color: #a08a5c; font-weight: 700; font-family: 'Nanum Myeongjo', serif; }
.toc-no { font-family: 'Nanum Myeongjo', serif; font-weight: 700; color: #b59a62; min-width: 26px; }
.toc-name { flex: 1; }

/* 만세력 */
.ms-meta { margin-bottom: 18px; font-size: 13px; color: #6b6656; }
.ms-meta p { margin: 2px 0; }
.ms-meta b { font-size: 16px; color: #2b2a26; }
.ms-corr { color: #a09a8c; font-size: 12px; }
.ms-chart { width: 100%; border-collapse: collapse; margin-bottom: 26px; }
.ms-chart th, .ms-chart td { border: 1px solid #e6ddc9; text-align: center; padding: 9px 4px; background: #fff; }
.ms-head th { background: #faf6ec; font-size: 12.5px; color: #8a8574; font-weight: 600; }
.ms-rh { background: #faf6ec; font-size: 11.5px; color: #8a8574; width: 54px; }
.ms-rh.sm { font-size: 10.5px; color: #b3ad9c; }
.ms-gz { font-family: 'Nanum Myeongjo', serif; font-size: 25px; font-weight: 700; }
.ms-gz span { font-size: 13px; opacity: .55; margin-left: 2px; }
.ms-el { font-size: 11px; margin-top: 2px; }
.ms-god { font-size: 11.5px; margin-top: 2px; opacity: .9; }
.ms-sm { font-size: 12px; color: #5a5648; padding: 7px 4px; }
.ms-none { color: #c9c3b5; font-size: 13px; }
.ms-h { font-family: 'Nanum Myeongjo', serif; font-size: 15px; margin: 24px 0 10px; padding-left: 9px; border-left: 3px solid #b59a62; }
.ms-h span { font-size: 11px; color: #b59a62; border: 1px solid #b59a62; border-radius: 4px; padding: 0 6px; margin-left: 5px; }
.ms-el-tbl { width: 100%; border-collapse: collapse; }
.ms-el-tbl th, .ms-el-tbl td { border: 1px solid #e6ddc9; text-align: center; padding: 8px 4px; background: #fff; }
.ms-el-tbl th { background: #faf6ec; font-size: 13px; font-weight: 700; }
.ms-el-tbl td b { font-size: 18px; }
.ms-el-tbl td i { display: block; font-style: normal; font-size: 11px; color: #b3ad9c; }
.ms-wheel { text-align: center; font-size: 12px; margin-top: 10px; }
.ms-wheel span { font-weight: 600; }
.ms-sum { text-align: center; font-size: 13px; color: #7c7466; margin-top: 10px; }
.ms-sum b { color: #1f2a3d; }
.ms-dw { width: 100%; border-collapse: collapse; }
.ms-dw th, .ms-dw td { border: 1px solid #e6ddc9; text-align: center; padding: 7px 2px; background: #fff; }
.ms-dw th { background: #faf6ec; font-size: 10.5px; color: #8a8574; font-weight: 500; }
.ms-dw td b { display: block; font-family: 'Nanum Myeongjo', serif; font-size: 15px; color: #1f2a3d; }
.ms-dw td i { display: block; font-style: normal; font-size: 10px; color: #b3ad9c; }

/* 본문 챕터 */
.chapter { padding-top: 32mm; }              /* 챕터 첫 페이지는 위 여백 넉넉히 */
.ch-head { display: flex; align-items: baseline; gap: 12px; }
.ch-no { font-family: 'Nanum Myeongjo', serif; font-size: 30px; font-weight: 800; color: #d8cfb8; }
.ch-title { font-family: 'Nanum Myeongjo', serif; font-size: 25px; font-weight: 800; letter-spacing: 2px; color: #1f2a3d; }

.ch-block { margin-bottom: 30px; }
.ch-block:last-child { margin-bottom: 0; }

/* 소제목 — 혼자 페이지 끝에 남지 않게 (제목만 남고 본문 넘어가는 것 방지) */
.ch-sub {
  font-family: 'Nanum Myeongjo', serif; font-size: 16.5px; font-weight: 700;
  color: #1f2a3d; margin: 0 0 13px; padding-left: 11px; border-left: 3px solid #b59a62;
  page-break-after: avoid; break-after: avoid;
  page-break-inside: avoid; break-inside: avoid;
}

.ch-block p {
  font-size: 14.2px; line-height: 2.05; color: #3a3831;
  margin-bottom: 12px; text-align: justify; word-break: keep-all;
  /* 문단이 페이지 경계에서 한두 줄만 남지 않게 */
  orphans: 3; widows: 3;
}
.ch-block p:last-child { margin-bottom: 0; }
.ch-empty { color: #b3ad9c; text-align: center; padding: 40px 0; }

/* 소제목 + 첫 문단을 한 덩어리로 유지 */
.ch-keep {
  page-break-inside: avoid;
  break-inside: avoid;
}

/* 마무리 */
.end { display: flex; align-items: center; justify-content: center; }
.end-box { text-align: center; }
.end-msg { font-family: 'Nanum Myeongjo', serif; font-size: 16px; line-height: 2; color: #4a463d; margin-bottom: 24px; }
.end-brand { font-family: 'Nanum Myeongjo', serif; font-size: 14px; letter-spacing: 4px; color: #a08a5c; margin-bottom: 40px; }
.end-note { font-size: 11.5px; color: #b3ad9c; line-height: 1.9; }

/* 인쇄 */
@media print {
  body { background: #fff; }
  .page {
    margin: 0; box-shadow: none; width: auto; min-height: auto;
    padding: 20mm 18mm 22mm;
  }
  .chapter { padding-top: 26mm; }   /* 챕터 시작 페이지 위 여백 */
  .no-print { display: none !important; }

  /* 제목이 페이지 맨 아래에 홀로 남지 않게 */
  .ch-head, .ch-sub, .ms-h { page-break-after: avoid; break-after: avoid; }
  .ch-keep { page-break-inside: avoid; break-inside: avoid; }
  .ch-block p { orphans: 3; widows: 3; }

  @page { size: A4; margin: 0; }
}
`;

/**
 * 리포트 전체 HTML
 * @param {object} o { type, client, teacher, saju, chapters }
 */
function buildReportHtml({ type, client, teacher, saju, chapters }) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(client.name)}님의 ${esc(type)} 리포트</title>
<style>${CSS}</style>
</head>
<body>
${coverPage({ type, client, teacher })}
${tocPage(chapters)}
${sajuPage({ client, saju })}
${chapterPages(chapters)}
${endPage({ teacher })}
</body>
</html>`;
}

module.exports = { buildReportHtml, CSS };
