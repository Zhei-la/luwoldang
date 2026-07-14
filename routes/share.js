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

const FREE = '무료사주';

/** 링크가 없으면 만들어준다 (메일 보낼 때 호출) */
async function ensureToken(pdfId) {
  const { rows } = await pool.query('SELECT share_token FROM pdfs WHERE id = $1', [pdfId]);
  if (rows[0] && rows[0].share_token) return rows[0].share_token;

  const token = crypto.randomBytes(16).toString('hex');
  await pool.query('UPDATE pdfs SET share_token = $1 WHERE id = $2', [token, pdfId]);
  return token;
}

router.get('/r/:token', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT p.id, p.type, p.sections, p.extra,
              l.name, l.birth, l.hour, l.calendar, l.region, l.gender,
              u.site_name, u.name AS teacher_name, u.kakao_consult_link, u.button_text,
              u.pdf_cta_text, u.pdf_cta_desc, u.free_promo
       FROM pdfs p
       JOIN leads l ON l.id = p.lead_id
       JOIN users u ON u.id = p.teacher_id
       WHERE p.share_token = $1`,
      [req.params.token]
    );
    const pdf = rows[0];
    if (!pdf) return res.status(404).send('링크가 만료되었거나 잘못된 주소입니다.');

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

    // 상단 저장 바 (인쇄 시에는 안 보임)
    const url = `${baseUrl}/r/${req.params.token}`;
    const bar = `
<style>
  .sv-bar{position:fixed;top:0;left:0;right:0;z-index:999;background:#232220;color:#fff;
    font-family:Pretendard,-apple-system,'Malgun Gothic',sans-serif;padding:11px 14px}
  .sv-row{display:flex;gap:10px;align-items:center;justify-content:center;flex-wrap:wrap;font-size:13px}
  .sv-btn{padding:9px 20px;border:0;border-radius:6px;background:#c8a45c;color:#241a06;
    font-weight:800;font-size:13.5px;cursor:pointer;min-height:42px}
  .sv-btn.ghost{background:transparent;border:1px solid #6b6558;color:#e8e3d6}
  .sv-warn{display:none;margin-top:9px;padding:10px 12px;border-radius:8px;
    background:#3a2e1a;border:1px solid #6b5a33;color:#f0dcae;font-size:12.5px;line-height:1.7}
  .sv-warn b{color:#ffd98a}
  body{padding-top:64px}
  @media(max-width:760px){ body{padding-top:74px} .sv-btn{flex:1} }
  @media print{ body{padding-top:0} .sv-bar,.sv-tip{display:none} }
  .sv-tip{max-width:480px;margin:0 auto 10px;padding:0 16px;font-size:12px;color:#8a8577;
    text-align:center;line-height:1.6;font-family:Pretendard,-apple-system,sans-serif}
</style>

<div class="sv-bar no-print">
  <div class="sv-row">
    <span>${escapeHtml(pdf.name)}님의 사주 리포트</span>
    <button class="sv-btn" id="svPrint">PDF로 저장</button>
    <button class="sv-btn ghost" id="svCopy">링크 복사</button>
  </div>
  <div class="sv-warn" id="svWarn">
    지금 <b>앱 안의 브라우저</b>로 열려 있어서 PDF 저장이 막혀 있습니다.<br>
    오른쪽 위 <b>⋮</b> 또는 <b>···</b> → <b>다른 브라우저로 열기</b>를 눌러주세요.
    <div style="margin-top:8px"><button class="sv-btn" id="svChrome" style="width:100%">브라우저로 열기</button></div>
  </div>
</div>
<div class="sv-tip no-print">
  인쇄 창에서 <b>PDF로 저장</b> 선택 · 여백 <b>없음</b> · 배경 그래픽 <b>켜기</b>
</div>

<script>
(function(){
  var UA = navigator.userAgent || '';
  // 카톡·네이버·인스타·페북·라인·다음 인앱 브라우저는 window.print() 가 막혀 있다
  var IN_APP = /KAKAOTALK|NAVER|Instagram|FBAN|FBAV|Line\/|DaumApps|everytimeApp|kakaostory/i.test(UA);
  var URL_ = ${JSON.stringify(url)};

  if (IN_APP) document.getElementById('svWarn').style.display = 'block';

  document.getElementById('svPrint').onclick = function(){
    if (IN_APP) {
      document.getElementById('svWarn').style.display = 'block';
      alert('앱 안의 브라우저에서는 PDF 저장이 안 됩니다.\n\n오른쪽 위 메뉴에서 "다른 브라우저로 열기"를 눌러주세요.');
      return;
    }
    window.print();
  };

  document.getElementById('svCopy').onclick = function(){
    var done = function(){ alert('링크를 복사했습니다.\n브라우저 주소창에 붙여넣어 열어주세요.'); };
    if (navigator.clipboard) navigator.clipboard.writeText(URL_).then(done, done);
    else {
      var t = document.createElement('textarea');
      t.value = URL_; document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); } catch(e) {}
      t.remove(); done();
    }
  };

  var chrome = document.getElementById('svChrome');
  if (chrome) chrome.onclick = function(){
    if (/Android/i.test(UA)) {
      // 안드로이드: 크롬으로 강제 오픈
      location.href = 'intent://' + URL_.replace(/^https?:\/\//, '') +
        '#Intent;scheme=https;package=com.android.chrome;end';
    } else {
      // 아이폰: 사파리로는 강제 이동이 막혀 있어 복사만 안내
      document.getElementById('svCopy').click();
    }
  };
})();
</script>`;

    res
      .set('Content-Type', 'text/html; charset=utf-8')
      .set('X-Robots-Tag', 'noindex, nofollow')   // 검색엔진에 안 잡히게
      .send(html.replace('<body>', '<body>' + bar));
  } catch (e) {
    next(e);
  }
});

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (m) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]
  ));
}

module.exports = { router, ensureToken };

