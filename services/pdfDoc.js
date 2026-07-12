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
/**
 * 리포트 종류별 표지
 *   img     : 배경 이미지
 *   style   : 'ink'   = 수묵화 (이미지에 브랜드명이 박혀 있음 → 덮어씀)
 *             'circle'= 원형 (브랜드명 자리가 비어 있음 → 그냥 얹음)
 *   brandTop: 브랜드명 세로 위치 (%)
 */
const COVERS = {
  종합사주:  { img: '/img/pdf/cover-jonghap.jpg',  style: 'ink',    brandTop: 12.4 },
  신년운세:  { img: '/img/pdf/cover-sinnyeon.jpg', style: 'ink',    brandTop: 12.4 },
  연애운:    { img: '/img/pdf/cover-yeonae.jpg',   style: 'circle', brandTop: 18.2 },
  결혼운:    { img: '/img/pdf/cover-gyeolhon.jpg', style: 'circle', brandTop: 18.2 },
  연인궁합:  { img: '/img/pdf/cover-gunghap.jpg',  style: 'circle', brandTop: 18.2 },
  재물운:    { img: '/img/pdf/cover-jaemul.jpg',   style: 'circle', brandTop: 18.2 },
  무료사주:  { img: '/img/pdf/cover-free.jpg',     style: 'circle', brandTop: 18.2 },
};

function coverPage({ type, client, teacher, baseUrl }) {
  const cfg = COVERS[type];
  const brand = teacher.site_name || teacher.name || '';

  if (cfg) {
    const url = (baseUrl || '') + cfg.img;
    // 수묵화 표지는 이미지에 이름이 박혀 있어 배경으로 가려야 한다.
    // 원형 표지는 자리가 비어 있으므로 배경 없이 얹는다.
    const cls = cfg.style === 'ink' ? 'cv-brand-overlay ink' : 'cv-brand-overlay circle';

    return `
<section class="page cover cover-img cover-${cfg.style}" style="background-image:url('${esc(url)}')">
  <div class="${cls}" style="top:${cfg.brandTop}%">${esc(brand)}</div>
  <div class="cv-info">
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

  // 표지 이미지가 없는 종류 → 기본 액자 표지
  return `
<section class="page cover">
  <div class="cv-frame">
    <div class="cv-moon"></div>
    <p class="cv-brand">${esc(brand)}</p>
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
function sajuPage({ client, saju, type }) {
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

  // 신년운세는 세운·월운을 함께 싣는다
  const yl = saju.yearLuck;
  const yearTables = (type === '신년운세' && yl) ? `
    <h3 class="ms-h">${yl.year}년 세운</h3>
    <table class="ms-el-tbl">
      <tr><th>간지</th><th>천간</th><th>지지</th><th>12운성</th></tr>
      <tr>
        <td><b>${esc(yl.sewoon.ko)}</b></td>
        <td>${esc(yl.sewoon.stem.ko)} · ${esc(yl.sewoon.stem.god)}</td>
        <td>${esc(yl.sewoon.branch.ko)} · ${esc(yl.sewoon.branch.god)}</td>
        <td>${esc(yl.sewoon.unseong || '-')}</td>
      </tr>
    </table>
    ${yl.currentDaewoon ? `<p class="ms-sum">현재 대운 <b>${esc(yl.currentDaewoon.ko)}</b> (${yl.currentDaewoon.age}세~, 올해 ${yl.currentDaewoon.currentAge}세)</p>` : ''}

    <h3 class="ms-h">${yl.year}년 월운</h3>
    <table class="ms-wol">
      <tr>${yl.wolwoon.map((w) => `<th>${w.month}월</th>`).join('')}</tr>
      <tr>${yl.wolwoon.map((w) => `<td><b>${esc(w.ko)}</b></td>`).join('')}</tr>
      <tr>${yl.wolwoon.map((w) => `<td class="wol-god">${esc(w.stem.god)}<br>${esc(w.branch.god)}</td>`).join('')}</tr>
      <tr>${yl.wolwoon.map((w) => `<td class="wol-us">${esc(w.unseong || '-')}</td>`).join('')}</tr>
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
  ${yearTables}
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

/* ── 5. 마무리 + 추가질문 CTA ── */
function endPage({ teacher }) {
  const link = teacher.kakao_consult_link || '';
  const btnText = teacher.pdf_cta_text || '추가 질문하러 가기';
  const desc = teacher.pdf_cta_desc
    || '리포트를 읽고 더 궁금한 점이 생기셨다면\n아래 버튼을 눌러 편하게 물어보세요.';

  const cta = link ? `
    <div class="end-cta">
      <p class="end-cta-desc">${esc(desc).replace(/\n/g, '<br>')}</p>
      <a class="end-cta-btn" href="${esc(link)}" target="_blank" rel="noopener">${esc(btnText)}</a>
      <p class="end-cta-url">${esc(link)}</p>
    </div>` : '';

  return `
<section class="page end">
  <div class="end-box">
    <p class="end-msg">${esc(teacher.consult_message || '여기까지 읽어주셔서 감사합니다.')}</p>
    ${cta}
    <p class="end-brand">${esc(teacher.site_name || teacher.name || '')}</p>
  </div>
</section>`;
}

/* ── CSS ── */
const CSS_TEMPLATE = `
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

/* A4 페이지 — 모든 페이지에 한지 테두리 배경 */
.page {
  width: 210mm;
  min-height: 297mm;
  padding: 30mm 26mm 28mm;
  margin: 0 auto 10mm;
  background-color: #fdfaf2;
  background-image: url('BASE_URL/img/pdf/frame.jpg');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  box-shadow: 0 4px 20px rgba(0,0,0,.12);
  position: relative;
  page-break-after: always;
  break-after: page;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.page:last-child { page-break-after: auto; break-after: auto; }

/* 챕터 시작을 확실히 새 페이지로 밀어내는 마커 */
.pagebreak {
  page-break-before: always;
  break-before: page;
  height: 0;
  margin: 0;
  border: 0;
}

/* 표지 — 이미지 배경 */
.cover { display: flex; align-items: center; justify-content: center; }
.cover-img {
  background-image: none;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 0 !important;
  display: block;
}
/* 브랜드명 — 교육생마다 다른 이름 */
.cv-brand-overlay {
  position: absolute;
  left: 0; right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Nanum Myeongjo', serif;
  z-index: 2;
}
/* 수묵화 표지: 이미지에 이름이 박혀 있어 배경으로 덮는다 */
.cv-brand-overlay.ink {
  height: 3.4%;
  background: #fdfaf2;
  font-size: 15px;
  letter-spacing: 5px;
  color: #4a463d;
}
/* 원형 표지: 자리가 비어 있어 배경 없이 얹는다 */
.cv-brand-overlay.circle {
  height: 3%;
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 4px;
  color: #5c4633;
}

/* 원형 표지는 하단 정보를 조금 더 위로 */
.cover-circle .cv-info { bottom: 8%; }
.cover-circle .cv-name { color: #4a3728; }
.cover-circle .cv-birth { color: #7d6a58; }
.cover-circle .cv-date { color: #a08a72; }
.cv-info {
  position: absolute;
  left: 0; right: 0;
  bottom: 6%;
  text-align: center;
}
.cover-img .cv-name {
  font-family: 'Nanum Myeongjo', serif;
  font-size: 19px; font-weight: 700;
  color: #2b2a26; margin-bottom: 6px;
}
.cover-img .cv-birth { font-size: 12.5px; color: #6b6656; }
.cover-img .cv-date { font-size: 11px; color: #9a9384; margin-top: 8px; }
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

/* 월운 표 */
.ms-wol { width: 100%; border-collapse: collapse; table-layout: fixed; }
.ms-wol th, .ms-wol td { border: 1px solid #e6ddc9; text-align: center; padding: 6px 1px; background: #fff; }
.ms-wol th { background: #faf6ec; font-size: 10px; color: #8a8574; font-weight: 500; }
.ms-wol td b { font-family: 'Nanum Myeongjo', serif; font-size: 13px; color: #1f2a3d; }
.ms-wol .wol-god { font-size: 9px; color: #7c7466; line-height: 1.5; }
.ms-wol .wol-us { font-size: 9.5px; color: #a8a293; }

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

/* 마무리 — 상하좌우 중앙 */
.end {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.end-box {
  text-align: center;
  max-width: 125mm;
  margin: 0 auto;
}
.end-msg { font-family: 'Nanum Myeongjo', serif; font-size: 16px; line-height: 2; color: #4a463d; margin-bottom: 30px; }

/* 추가질문 CTA */
.end-cta {
  background: #faf6ec; border: 1px solid #e2d9c5; border-radius: 10px;
  padding: 28px 22px; margin-bottom: 34px;
}
.end-cta-desc { font-size: 14px; line-height: 1.95; color: #5a5648; margin-bottom: 20px; }
.end-cta-btn {
  display: inline-block; padding: 14px 34px; border-radius: 8px;
  background: #FEE500; color: #191600; font-size: 15.5px; font-weight: 700;
  text-decoration: none; border: 1px solid #e4cf00;
}
.end-cta-url { font-size: 10.5px; color: #b3ad9c; margin-top: 14px; word-break: break-all; }

.end-brand { font-family: 'Nanum Myeongjo', serif; font-size: 14px; letter-spacing: 4px; color: #a08a5c; }

/* ============================================================
 * 인쇄 — 여기가 실제 PDF가 되는 부분
 * ============================================================ */
@media print {
  html, body {
    background: #fff !important;
    margin: 0;
    padding: 0;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* 배경(테두리·표지)을 인쇄에 포함 */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* 페이지 = 그냥 콘텐츠 블록. 높이 강제하지 않는다.
     min-height를 남겨두면 내용이 넘칠 때 페이지 계산이 깨진다. */
  .page {
    width: auto !important;
    min-height: 0 !important;
    height: auto !important;
    margin: 0 !important;
    padding: 0 !important;
    box-shadow: none !important;
    page-break-after: always;
    break-after: page;
    /* 배경 이미지(테두리)는 유지 */
  }
  .page:last-child { page-break-after: auto; break-after: auto; }

  /* 표지·마무리는 한 장을 꽉 채운다 */
  .cover, .end {
    min-height: 250mm !important;
    display: flex !important;
    align-items: center;
    justify-content: center;
  }
  .cover-img {
    display: block !important;
    min-height: 297mm !important;
    height: 297mm !important;
    padding: 0 !important;
  }

  /* 챕터 — 반드시 새 페이지에서 시작하고, 위에 여백을 준다 */
  .chapter {
    page-break-before: always;
    break-before: page;
    padding-top: 8mm !important;
  }

  /* 챕터 제목: 아래 내용과 절대 떨어지지 않게 */
  .ch-head {
    page-break-after: avoid !important;
    break-after: avoid !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    margin-bottom: 4mm;
  }
  .pg-line {
    page-break-after: avoid !important;
    break-after: avoid !important;
  }

  /* 소제목 + 첫 문단은 한 덩어리 (제목만 남고 넘어가는 것 방지) */
  .ch-keep {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    page-break-after: avoid !important;
  }
  .ch-sub {
    page-break-after: avoid !important;
    break-after: avoid !important;
  }

  /* 문단: 한두 줄만 떨어지지 않게 (최소 3줄) */
  .ch-block p {
    orphans: 3;
    widows: 3;
    page-break-inside: auto;
  }

  /* 블록 사이 간격 */
  .ch-block { margin-bottom: 8mm; }

  /* 만세력 표는 쪼개지지 않게 */
  .ms-chart, .ms-dw, .ms-wol, .ms-el-tbl {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }
  .ms-h {
    page-break-after: avoid !important;
    break-after: avoid !important;
  }

  .no-print { display: none !important; }

  /* 여백은 @page에서만 준다 */
  @page {
    size: A4;
    margin: 20mm 18mm 22mm;
  }
}
`;

/**
 * 리포트 전체 HTML
 * @param {object} o { type, client, teacher, saju, chapters }
 */
function buildReportHtml({ type, client, teacher, saju, chapters, baseUrl }) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(client.name)}님의 ${esc(type)} 리포트</title>
<style>${buildCSS(baseUrl)}</style>
</head>
<body>
${coverPage({ type, client, teacher, baseUrl })}
${tocPage(chapters)}
${sajuPage({ client, saju, type })}
${chapterPages(chapters)}
${endPage({ teacher })}
</body>
</html>`;
}

/** baseUrl을 주입한 CSS */
function buildCSS(baseUrl) {
  return CSS_TEMPLATE.split('BASE_URL').join(baseUrl || '');
}

module.exports = { buildReportHtml, buildCSS, CSS_TEMPLATE };
