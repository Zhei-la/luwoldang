/**
 * share.js — 내담자 공개 열람 링크
 *
 *   GET /r/:token
 *
 * 로그인 없이 리포트를 열어보고, 브라우저 인쇄로 PDF 저장까지 할 수 있다.
 * 토큰은 pdfs.share_token 에 저장된 32자 랜덤값 — 추측 불가능.
 */
const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const { pool } = require('../db');
const { calcSaju } = require('../services/manseryeok');
const { normalizeBirth, parseHour } = require('../services/birth');
const { buildReportHtml } = require('../services/pdfDoc');
const { buildFreePdfHtml } = require('../services/freePdf');
const { htmlToPdf, pdfFilename } = require('../services/pdfFile');

const FREE = '무료사주';

/** 링크가 없으면 만들어준다 (메일 보낼 때 호출) */
async function ensureToken(pdfId) {
  const { rows } = await pool.query('SELECT share_token FROM pdfs WHERE id = $1', [pdfId]);
  if (rows[0] && rows[0].share_token) return rows[0].share_token;

  const token = crypto.randomBytes(16).toString('hex');
  await pool.query('UPDATE pdfs SET share_token = $1 WHERE id = $2', [token, pdfId]);
  return token;
}

/** 토큰 → 리포트 HTML (열람용 · 다운로드용 공통) */
async function loadReport(token) {
  const { rows } = await pool.query(
    `SELECT p.id, p.type, p.sections, p.extra,
            l.name, l.birth, l.hour, l.calendar, l.region, l.gender,
            u.site_name, u.name AS teacher_name, u.kakao_consult_link, u.button_text,
            u.pdf_cta_text, u.pdf_cta_desc, u.free_promo
     FROM pdfs p
     JOIN leads l ON l.id = p.lead_id
     JOIN users u ON u.id = p.teacher_id
     WHERE p.share_token = $1`,
    [token]
  );
  const pdf = rows[0];
  if (!pdf) return null;

  const client = {
    name: pdf.name,
    birthDate: normalizeBirth(pdf.birth),
    birthTime: parseHour(pdf.hour),
    calendar: pdf.calendar,
    region: pdf.region,
    gender: pdf.gender,
  };

  let saju = null;
  try {
    saju = calcSaju({
      birthDate: client.birthDate,
      birthTime: client.birthTime,
      calendar: pdf.calendar === '윤달' ? '음력' : (pdf.calendar || '양력'),
      isLeapMonth: pdf.calendar === '윤달',
      region: pdf.region || '서울특별시',
      gender: pdf.gender,
    });
  } catch (e) { /* 만세력 실패해도 본문은 보여준다 */ }

  const teacher = {
    site_name: pdf.site_name,
    name: pdf.teacher_name,
    kakao_consult_link: pdf.kakao_consult_link,
    button_text: pdf.button_text,
    pdf_cta_text: pdf.pdf_cta_text,
    pdf_cta_desc: pdf.pdf_cta_desc,
    free_promo: pdf.free_promo,
  };
  const baseUrl = process.env.BASE_URL || '';

  const html = pdf.type === FREE
    ? buildFreePdfHtml({ teacher, client, saju, result: pdf.sections || {}, baseUrl })
    : buildReportHtml({
        type: pdf.type, client, saju,
        chapters: Array.isArray(pdf.sections) ? pdf.sections : [],
        teacher, extra: pdf.extra || null, baseUrl,
      });

  return { pdf, html };
}

/* ===== 리포트 열람 ===== */
router.get('/r/:token', async (req, res, next) => {
  try {
    const r = await loadReport(req.params.token);
    if (!r) return res.status(404).send('링크가 만료되었거나 잘못된 주소입니다.');
    const { pdf, html } = r;

    const bar = `
<style>
  .sv-bar{position:fixed;top:0;left:0;right:0;z-index:999;background:#232220;color:#fff;
    font-family:Pretendard,-apple-system,'Malgun Gothic',sans-serif;padding:11px 14px;
    display:flex;gap:12px;align-items:center;justify-content:center;flex-wrap:wrap;font-size:13px}
  .sv-name{opacity:.85}
  .sv-btn{padding:11px 26px;border:0;border-radius:7px;background:#c8a45c;color:#241a06;
    font-weight:800;font-size:14px;cursor:pointer;min-height:44px;text-decoration:none;
    display:inline-flex;align-items:center;gap:7px}
  .sv-btn:active{filter:brightness(.94)}
  .sv-btn.loading{opacity:.6;pointer-events:none}
  body{padding-top:66px}
  @media(max-width:760px){ .sv-name{flex:1 1 100%;text-align:center} .sv-btn{flex:1 1 100%;justify-content:center} body{padding-top:112px} }
  @media print{ body{padding-top:0} .sv-bar{display:none} }
</style>
<div class="sv-bar no-print">
  <span class="sv-name">${escapeHtml(pdf.name)}님의 사주 리포트</span>
  <a class="sv-btn" id="svDl" href="/r/${escapeHtml(req.params.token)}/download">
    <span id="svDlText">PDF 다운받기</span>
  </a>
</div>
<script>
(function(){
  var a = document.getElementById('svDl');
  var t = document.getElementById('svDlText');
  a.addEventListener('click', function(){
    a.classList.add('loading');
    t.textContent = 'PDF 만드는 중… (20초쯤)';
    // 파일 전송이 시작되면 페이지는 그대로 남는다. 시간이 지나면 버튼을 되돌린다.
    setTimeout(function(){
      a.classList.remove('loading');
      t.textContent = 'PDF 다운받기';
    }, 40000);
  });
})();
</script>`;

    res
      .set('Content-Type', 'text/html; charset=utf-8')
      .set('X-Robots-Tag', 'noindex, nofollow')
      .send(html.replace('<body>', '<body>' + bar));
  } catch (e) {
    next(e);
  }
});

/* ===== PDF 파일로 내려받기 ===== */
router.get('/r/:token/download', async (req, res, next) => {
  try {
    const r = await loadReport(req.params.token);
    if (!r) return res.status(404).send('링크가 만료되었거나 잘못된 주소입니다.');
    const { pdf, html } = r;

    const buf = await htmlToPdf(html);
    const fn = pdfFilename(pdf.name, pdf.type);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': buf.length,
      'Content-Disposition': `attachment; filename="${fn.ascii}"; filename*=UTF-8''${fn.utf8}`,
      'Cache-Control': 'no-store',
    });
    res.send(buf);
  } catch (e) {
    console.error('[PDF] 파일 생성 실패:', e.message);
    // 크롬이 없거나 실패하면 열람 페이지로 돌려보낸다 (인쇄로 저장 가능)
    res.status(302).redirect(`/r/${req.params.token}?pdferr=1`);
  }
});

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (m) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]
  ));
}

module.exports = { router, ensureToken };

