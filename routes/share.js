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
const { htmlToPdf, sendPdf } = require('../services/pdfFile');
const { maskName } = require('./reviews');

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
            u.pdf_cta_text, u.pdf_cta_desc, u.free_promo, u.review_on, u.review_notice,
            u.cover_set, u.bg_paper
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
    review_on: pdf.review_on,
    review_notice: pdf.review_notice,
  };
  const baseUrl = process.env.BASE_URL || '';
  // 후기 작성 링크 (리포트 하단 후기 폼으로 스크롤)
  const reviewUrl = baseUrl + '/r/' + token + '#rvwWrap';
  // 본문 배경지
  const { paperImg } = require('../services/bgPapers');
  const bgPaper = pdf.bg_paper ? (pdf.bg_paper === 'none' ? 'none' : paperImg(pdf.bg_paper)) : undefined;

  const html = pdf.type === FREE
    ? buildFreePdfHtml({ teacher, client, saju, result: pdf.sections || {}, baseUrl })
    : buildReportHtml({
        type: pdf.type, client, saju,
        chapters: Array.isArray(pdf.sections) ? pdf.sections : [],
        teacher, extra: pdf.extra || null, baseUrl, reviewUrl, reviewMode: 'web', bgPaper,
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
  <a class="sv-btn" id="svDl" href="/r/${escapeHtml(req.params.token)}/report.pdf">
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

    // 이미 쓴 후기가 있으면 보여준다
    const rv = await pool.query(
      'SELECT rating, body FROM reviews WHERE pdf_id = $1',
      [pdf.id]
    );
    const mine = rv.rows[0] || null;

    const reviewBox = `
<style>
  html{scroll-behavior:smooth}
  .rvw{position:relative;left:50%;transform:translateX(-50%);scroll-margin-top:70px;
    width:92vw;max-width:640px;margin:26px 0 40px;padding:0;box-sizing:border-box;
    font-family:Pretendard,-apple-system,'Malgun Gothic',sans-serif}
  .rvw-card{box-sizing:border-box}
  .rvw-card{background:#fff;border:1px solid #E9E0CF;border-radius:14px;padding:24px 20px}
  .rvw-h{font-size:17px;font-weight:800;color:#252522;margin:0 0 6px;text-align:center}
  .rvw-s{font-size:13px;color:#8a8574;margin:0 0 18px;text-align:center;line-height:1.7}
  .rvw-notice{font-size:14px;color:#8a6f3c;background:#fbf6ec;border:1px solid #ecdfc4;
    border-radius:10px;padding:12px 14px;margin:0 0 14px;text-align:center;line-height:1.6;font-weight:600}
  .rvw-stars{display:flex;justify-content:center;gap:6px;margin-bottom:18px}
  .rvw-stars button{font-size:34px;line-height:1;background:none;border:0;cursor:pointer;
    color:#e0d8c6;padding:0;transition:.12s}
  .rvw-stars button.on{color:#f5b301}
  .rvw textarea{width:100%;min-height:110px;padding:12px;border:1px solid #E9E0CF;border-radius:10px;
    font-size:14.5px;line-height:1.7;font-family:inherit;resize:vertical;background:#fdfcfa;outline:none}
  .rvw textarea:focus{border-color:#B59A62}
  .rvw-photo{margin-top:10px}
  .rvw-photo label{display:block;padding:12px;border:1.5px dashed #E0D8C6;border-radius:10px;
    text-align:center;font-size:13px;color:#8a8574;cursor:pointer;background:#fdfcfa}
  .rvw-photo label:hover{border-color:#B59A62;color:#8a6f3c}
  .rvw-photo input{display:none}
  .rvw-prev{margin-top:10px;position:relative;display:none}
  .rvw-prev img{width:100%;border-radius:10px;border:1px solid #E9E0CF;display:block}
  .rvw-prev button{position:absolute;top:8px;right:8px;width:28px;height:28px;border-radius:50%;
    border:0;background:rgba(0,0,0,.6);color:#fff;font-size:15px;cursor:pointer;line-height:1}
  .rvw-send{width:100%;margin-top:14px;padding:15px;border:0;border-radius:10px;background:#B59A62;
    color:#fff;font-size:15.5px;font-weight:800;cursor:pointer}
  .rvw-send:disabled{opacity:.5}
  .rvw-done{text-align:center;padding:24px 10px}
  .rvw-done b{display:block;font-size:16px;color:#252522;margin-bottom:6px}
  .rvw-done span{font-size:13.5px;color:#8a8574}
  @media print{ .rvw{display:none} }
</style>

<div class="rvw no-print" id="rvwWrap">
  <div class="rvw-card">
    ${mine ? `
      <div class="rvw-done">
        <b>후기를 남겨주셔서 감사합니다.</b>
        <span>${'★'.repeat(mine.rating)}${'☆'.repeat(5 - mine.rating)} · 아래에서 다시 고칠 수 있습니다.</span>
      </div>` : ''}

    <h3 class="rvw-h">${mine ? '후기 고치기' : '후기를 남겨주세요'}</h3>
    ${pdf.review_notice ? `<p class="rvw-notice">${escapeHtml(pdf.review_notice)}</p>` : ''}
    <p class="rvw-s">읽어보신 소감을 남겨주시면 큰 힘이 됩니다.<br>
    이름은 <b>${escapeHtml(maskName(pdf.name))}</b> 처럼 가려서 표시됩니다.</p>

    <div class="rvw-stars" id="rvwStars">
      ${[1, 2, 3, 4, 5].map((n) => `<button type="button" data-n="${n}">★</button>`).join('')}
    </div>

    <textarea id="rvwBody" placeholder="어떤 점이 좋았는지, 무엇이 도움이 됐는지 편하게 적어주세요.">${mine ? escapeHtml(mine.body) : ''}</textarea>

    <div class="rvw-photo">
      <label for="rvwFile">사진 넣기 (선택)</label>
      <input type="file" id="rvwFile" accept="image/*">
    </div>
    <div class="rvw-prev" id="rvwPrev">
      <img id="rvwImg" alt="">
      <button type="button" id="rvwDel">×</button>
    </div>

    <button class="rvw-send" id="rvwSend">${mine ? '후기 다시 저장' : '후기 남기기'}</button>
  </div>
</div>

<script>
(function(){
  var TOKEN = ${JSON.stringify(req.params.token)};
  var rating = ${mine ? mine.rating : 0};
  var photo = '';

  var stars = document.getElementById('rvwStars');
  var send = document.getElementById('rvwSend');
  var body = document.getElementById('rvwBody');
  var file = document.getElementById('rvwFile');
  var prev = document.getElementById('rvwPrev');
  var img = document.getElementById('rvwImg');

  function paint(){
    Array.prototype.forEach.call(stars.children, function(b, i){
      b.classList.toggle('on', i < rating);
    });
  }
  stars.addEventListener('click', function(e){
    var b = e.target.closest('button'); if (!b) return;
    rating = Number(b.dataset.n);
    paint();
  });
  paint();

  // 사진은 줄여서 보낸다
  file.addEventListener('change', function(){
    var f = file.files[0]; if (!f) return;
    var im = new Image();
    im.onload = function(){
      var MAX = 1000, w = im.width, h = im.height;
      var long = Math.max(w, h);
      if (long > MAX) { var r = MAX / long; w = Math.round(w * r); h = Math.round(h * r); }
      var c = document.createElement('canvas');
      c.width = w; c.height = h;
      var ctx = c.getContext('2d');
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h);
      ctx.drawImage(im, 0, 0, w, h);
      photo = c.toDataURL('image/jpeg', 0.75);
      img.src = photo;
      prev.style.display = 'block';
    };
    im.src = URL.createObjectURL(f);
  });
  document.getElementById('rvwDel').onclick = function(){
    photo = ''; prev.style.display = 'none'; file.value = '';
  };

  send.onclick = async function(){
    if (!rating) { alert('별점을 골라주세요.'); return; }
    var text = (body.value || '').trim();
    if (text.length < 5) { alert('후기를 조금만 더 적어주세요.'); return; }

    send.disabled = true;
    send.textContent = '보내는 중...';
    try {
      var r = await fetch('/r/' + TOKEN + '/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: rating, body: text, photo: photo })
      });
      var d = await r.json();
      if (!d.ok) throw new Error(d.error || '실패');
      document.getElementById('rvwWrap').innerHTML =
        '<div class="rvw-card"><div class="rvw-done">' +
        '<b>후기 감사합니다.</b><span>소중히 읽겠습니다.</span></div></div>';
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    } catch (e) {
      alert('저장 실패: ' + e.message);
      send.disabled = false;
      send.textContent = '후기 남기기';
    }
  };
})();

// PDF 등 다른 곳에서 #rvwWrap 을 달고 들어온 경우,
// 콘텐츠(이미지 포함)가 다 그려진 뒤 후기 폼으로 확실히 내려준다.
(function(){
  if (location.hash !== '#rvwWrap') return;
  function toReview(){
    var el = document.getElementById('rvwWrap');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  window.addEventListener('load', function(){ setTimeout(toReview, 400); });
})();
</script>`;

    res
      .set('Content-Type', 'text/html; charset=utf-8')
      .set('X-Robots-Tag', 'noindex, nofollow')
      .send(html.replace('<body>', '<body>' + bar).replace('</body>', (pdf.review_on === false ? '' : reviewBox) + '</body>'));
  } catch (e) {
    next(e);
  }
});

/* ===== PDF 파일로 내려받기 =====
   ⚠️ 주소가 .pdf 로 끝나야 한다. 카톡·삼성인터넷 같은 인앱 브라우저는
      Content-Disposition 을 무시하고 URL 끝으로 파일명을 정하기 때문에,
      확장자가 없으면 "올바르지 않은 확장자" 오류가 난다. */
async function downloadReport(req, res) {
  try {
    const r = await loadReport(req.params.token);
    if (!r) return res.status(404).send('링크가 만료되었거나 잘못된 주소입니다.');
    const { pdf, html } = r;

    const buf = await htmlToPdf(html);
    sendPdf(res, buf, pdf.name, pdf.type);
  } catch (e) {
    console.error('[PDF] 파일 생성 실패:', e.message);
    res.status(302).redirect(`/r/${req.params.token}?pdferr=1`);
  }
}

router.get('/r/:token/report.pdf', downloadReport);
router.get('/r/:token/download', downloadReport);   // 예전 링크(메일에 이미 나간 것) 호환

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (m) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]
  ));
}

module.exports = { router, ensureToken };
