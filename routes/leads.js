const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { requireAuth, requireApproved } = require('../middleware/auth');
const { calcSaju } = require('../services/manseryeok');
const { generatePdfReport, PDF_TYPES, generateFreeSaju, UPSELL } = require('../services/ai');
const { sendPdfReport, buildPdfHtml, sendFreeSaju } = require('../services/mail');
const { buildReportHtml, esc } = require('../services/pdfDoc');
const { buildFreePdfHtml } = require('../services/freePdf');
const { normalizeBirth, parseHour } = require('../services/birth');
const { ensureToken } = require('./share');

const FREE = '무료사주';

router.use(requireAuth, requireApproved);

/* ===== 신청자 목록 ===== */
router.get('/leads', async (req, res, next) => {
  try {
    const filter = req.query.f || 'all'; // all | 상담신청 | 무료사주 | 미발송 | 발송완료
    const { rows } = await pool.query(
      `SELECT l.*,
              p.id AS pdf_id, p.type AS pdf_type, p.mail_sent, p.sent_at
       FROM leads l
       LEFT JOIN LATERAL (
         SELECT id, type, mail_sent, sent_at FROM pdfs
         WHERE lead_id = l.id ORDER BY created_at DESC LIMIT 1
       ) p ON TRUE
       WHERE l.teacher_id = $1
       ORDER BY l.created_at DESC LIMIT 200`,
      [req.user.id]
    );

    let leads = rows;
    if (filter === '상담신청') leads = rows.filter((r) => r.source !== '무료사주');
    else if (filter === '무료사주') leads = rows.filter((r) => r.source === '무료사주');
    else if (filter === '미발송') leads = rows.filter((r) => !r.mail_sent);
    else if (filter === '발송완료') leads = rows.filter((r) => r.mail_sent);

    const counts = {
      all: rows.length,
      상담신청: rows.filter((r) => r.source !== '무료사주').length,
      무료사주: rows.filter((r) => r.source === '무료사주').length,
      미발송: rows.filter((r) => !r.mail_sent).length,
      발송완료: rows.filter((r) => r.mail_sent).length,
    };

    res.render('dash/leads', { user: req.user, active: 'leads', leads, filter, counts });
  } catch (e) {
    next(e);
  }
});

/* ===== 신청자 상세 + PDF 제작 화면 ===== */
router.get('/leads/:id', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM leads WHERE id = $1 AND teacher_id = $2',
      [req.params.id, req.user.id]
    );
    const lead = rows[0];
    if (!lead) return res.status(404).send('신청 내역을 찾을 수 없습니다.');

    const pdfs = await pool.query(
      'SELECT * FROM pdfs WHERE lead_id = $1 ORDER BY created_at DESC',
      [lead.id]
    );

    // 사주 계산 (미리보기용)
    let saju = null;
    try {
      saju = calcSaju({
        birthDate: normalizeBirth(lead.birth),
        birthTime: parseHour(lead.hour),
        calendar: lead.calendar === '윤달' ? '음력' : (lead.calendar || '양력'),
        isLeapMonth: lead.calendar === '윤달',
        region: lead.region || '서울특별시',
        gender: lead.gender,
      });
    } catch (e) { /* 생년월일 형식 문제 시 무시 */ }

    res.render('dash/lead-detail', {
      user: req.user, active: 'leads',
      lead, saju, pdfs: pdfs.rows,
      types: PDF_TYPES,
      hasKey: !!req.user.openai_key,
    });
  } catch (e) {
    next(e);
  }
});

// '1999-2-21' → '1999-02-21'

/* ===== PDF 내용 생성 (AI) — 챕터별 진행상황 스트리밍 ===== */
router.get('/leads/:id/pdf/stream', async (req, res) => {
  const type = req.query.type;

  res.set({
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  const send = (ev, data) => res.write(`event: ${ev}\ndata: ${JSON.stringify(data)}\n\n`);

  try {
    const { rows } = await pool.query(
      'SELECT * FROM leads WHERE id = $1 AND teacher_id = $2',
      [req.params.id, req.user.id]
    );
    const lead = rows[0];
    if (!lead) { send('error', { error: '신청 내역을 찾을 수 없습니다.' }); return res.end(); }
    if (!req.user.openai_key) { send('error', { error: 'OpenAI 키를 먼저 등록해주세요.' }); return res.end(); }
    if (!PDF_TYPES.includes(type)) { send('error', { error: 'PDF 종류를 선택해주세요.' }); return res.end(); }

    const saju = calcSaju({
      birthDate: normalizeBirth(lead.birth),
      birthTime: parseHour(lead.hour),
      calendar: lead.calendar === '윤달' ? '음력' : (lead.calendar || '양력'),
      isLeapMonth: lead.calendar === '윤달',
      region: lead.region || '서울특별시',
      gender: lead.gender,
    });

    const client = {
      name: lead.name, gender: lead.gender,
      birthDate: normalizeBirth(lead.birth),
      birthTime: parseHour(lead.hour),
      calendar: lead.calendar, region: lead.region,
      question: lead.memo,
    };

    /* ── 무료사주: 공개 페이지와 완전히 같은 파이프라인 ── */
    if (type === FREE) {
      send('progress', { done: 0, total: 1, title: '무료 사주 풀이 생성 중' });
      const free = await generateFreeSaju({ client, saju, openaiKey: req.user.openai_key });
      send('progress', { done: 1, total: 1, title: '완료' });

      const insF = await pool.query(
        'INSERT INTO pdfs (teacher_id, lead_id, type, sections, extra) VALUES ($1,$2,$3,$4,NULL) RETURNING id',
        [req.user.id, lead.id, FREE, JSON.stringify(free)]
      );
      send('done', { pdfId: insF.rows[0].id, chapters: 1 });
      return res.end();
    }

    const result = await generatePdfReport({
      type, client, saju, openaiKey: req.user.openai_key,
      onProgress: (done, total, title) => send('progress', { done, total, title }),
    });
    // generatePdfReport 는 챕터 배열을 반환한다.
    // (예전에 { chapters, checklist, loveCard } 객체를 쓰던 버전과도 호환되게 둘 다 받는다)
    const chapters = Array.isArray(result) ? result : (result.chapters || []);
    const extra = (!Array.isArray(result) && (result.checklist || result.loveCard))
      ? { checklist: result.checklist || null, loveCard: result.loveCard || null }
      : null;

    if (!chapters.length) {
      console.error('[PDF] 챕터가 0개입니다. AI 생성 실패 가능성.');
      send('error', { message: '리포트 생성에 실패했습니다. OpenAI 키와 사용량을 확인해주세요.' });
      return res.end();
    }

    const ins = await pool.query(
      'INSERT INTO pdfs (teacher_id, lead_id, type, sections, extra) VALUES ($1,$2,$3,$4,$5) RETURNING id',
      [req.user.id, lead.id, type, JSON.stringify(chapters), extra ? JSON.stringify(extra) : null]
    );

    send('done', { pdfId: ins.rows[0].id, chapters: chapters.length });
    res.end();
  } catch (e) {
    console.error('[PDF] 생성 실패:', e.message);
    send('error', { error: e.message });
    res.end();
  }
});

/* ===== PDF 이메일 발송 ===== */
router.post('/pdfs/:id/send', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT p.*, l.name, l.email, l.gender, l.birth, l.calendar, l.hour, l.region
       FROM pdfs p JOIN leads l ON l.id = p.lead_id
       WHERE p.id = $1 AND p.teacher_id = $2`,
      [req.params.id, req.user.id]
    );
    const pdf = rows[0];
    if (!pdf) return res.status(404).json({ ok: false, error: 'PDF를 찾을 수 없습니다.' });

    const to = (req.body.email || pdf.email || '').trim();
    if (!to) return res.status(400).json({ ok: false, error: '받는 이메일이 없습니다.' });

    let saju = null;
    try {
      saju = calcSaju({
        birthDate: normalizeBirth(pdf.birth),
        birthTime: parseHour(pdf.hour),
        calendar: pdf.calendar === '윤달' ? '음력' : (pdf.calendar || '양력'),
        isLeapMonth: pdf.calendar === '윤달',
        region: pdf.region || '서울특별시',
        gender: pdf.gender,
      });
    } catch (e) { /* noop */ }

    if (pdf.type === FREE) {
      // 무료사주는 공개 페이지와 같은 메일 템플릿으로
      await sendFreeSaju({
        to, teacher: req.user, saju,
        result: pdf.sections || {},
        input: { name: pdf.name, email: to },
        upsell: UPSELL,
        baseUrl: process.env.BASE_URL || '',
      });
    } else {
      const token = await ensureToken(pdf.id);
      const base = process.env.BASE_URL || '';
      await sendPdfReport({
        to,
        teacher: req.user,
        type: pdf.type,
        sections: pdf.sections,
        saju,
        input: { name: pdf.name },
        baseUrl: base,
        shareUrl: `${base}/r/${token}`,
      });
    }

    await pool.query(
      'UPDATE pdfs SET mail_sent = TRUE, sent_at = NOW(), sent_to = $1 WHERE id = $2',
      [to, pdf.id]
    );
    // 발송 완료 시각 기록 → 3일 뒤 연락처 자동 마스킹
    await pool.query(
      "UPDATE leads SET status = '발송완료', delivered_at = COALESCE(delivered_at, NOW()) WHERE id = $1",
      [pdf.lead_id]
    );

    res.json({ ok: true, to });
  } catch (e) {
    console.error('[MAIL] PDF 발송 실패:', e.message);
    res.status(500).json({ ok: false, error: e.message });
  }
});


/* ===== 리포트 내용 수정 저장 ===== */
router.post('/pdfs/:id/edit', async (req, res) => {
  try {
    const chapters = req.body && req.body.chapters;
    if (!Array.isArray(chapters)) {
      return res.status(400).json({ ok: false, error: '형식이 올바르지 않습니다.' });
    }

    const { rowCount } = await pool.query(
      'UPDATE pdfs SET sections = $1 WHERE id = $2 AND teacher_id = $3',
      [JSON.stringify(chapters), req.params.id, req.user.id]
    );
    if (!rowCount) return res.status(404).json({ ok: false, error: '리포트를 찾을 수 없습니다.' });

    res.json({ ok: true });
  } catch (e) {
    console.error('[PDF] 수정 실패:', e.message);
    res.status(500).json({ ok: false, error: e.message });
  }
});

/* ===== PDF 미리보기 (인쇄 → PDF 저장) ===== */
router.get('/pdfs/:id/preview', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT p.*, l.name, l.email, l.gender, l.birth, l.calendar, l.hour, l.region, l.memo
       FROM pdfs p JOIN leads l ON l.id = p.lead_id
       WHERE p.id = $1 AND p.teacher_id = $2`,
      [req.params.id, req.user.id]
    );
    const pdf = rows[0];
    if (!pdf) return res.status(404).send('리포트를 찾을 수 없습니다.');

    const client = {
      name: pdf.name,
      gender: pdf.gender,
      birthDate: normalizeBirth(pdf.birth),
      birthTime: parseHour(pdf.hour),
      calendar: pdf.calendar,
      region: pdf.region,
      question: pdf.memo,
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
    } catch (e) { /* noop */ }

    /* ── 무료사주: 공개 링크 PDF와 똑같이 ── */
    if (pdf.type === FREE) {
      const html = buildFreePdfHtml({
        teacher: req.user, client, saju,
        result: pdf.sections || {},
        baseUrl: process.env.BASE_URL || '',
      });
      const bar = `
<style>
  .fv-bar{position:fixed;top:0;left:0;right:0;z-index:999;display:flex;gap:10px;align-items:center;
    justify-content:center;flex-wrap:wrap;padding:11px 12px;background:#232220;color:#fff;
    font-family:Pretendard,-apple-system,'Malgun Gothic',sans-serif;font-size:13px}
  .fv-bar a{color:#c8a45c;text-decoration:none}
  .fv-bar button{padding:9px 18px;border:0;border-radius:6px;background:#c8a45c;color:#241a06;
    font-weight:800;font-size:13.5px;cursor:pointer;min-height:40px}
  body{padding-top:50px}
  @media (max-width:760px){ .fv-bar .tip{display:none} .fv-bar button{flex:1 1 100%} body{padding-top:96px} }
  @media print{ body{padding-top:0} .fv-bar{display:none} }
</style>
<div class="fv-bar no-print">
  <a href="/leads/${pdf.lead_id}">← 돌아가기</a>
  <span>${esc(pdf.name)}님 · 무료사주</span>
  <span class="tip" style="opacity:.6">여백 <b>없음</b> · 배경 그래픽 <b>체크</b></span>
  <button onclick="window.print()">PDF로 저장</button>
</div>`;
      return res
        .set('Content-Type', 'text/html; charset=utf-8')
        .send(html.replace('<body>', '<body>' + bar));
    }

    const chapters = Array.isArray(pdf.sections) ? pdf.sections : [];
    const extra = pdf.extra || null;
    const inner = buildReportHtml({
      type: pdf.type,
      client,
      teacher: req.user,
      saju,
      chapters,
      extra,
      baseUrl: process.env.BASE_URL || '',
    });

    const toolbar = `
<div class="pv-bar no-print">
  <a class="pv-back" href="/leads/${pdf.lead_id}">← 돌아가기</a>
  <span class="pv-title">${esc(pdf.name)}님 · ${esc(pdf.type)} <em id="pvMode">${chapters.length}개 챕터</em></span>
  <div class="pv-actions">
    <button id="btnEdit">수정하기</button>
    <button id="btnDone" style="display:none">수정 완료</button>
    <button id="btnPrint">PDF로 저장</button>
    <button id="btnSend" class="send">이메일 보내기</button>
  </div>
  <div class="pv-warn" id="pvWarn">
    <b>앱 안의 브라우저</b>라서 PDF 저장이 막혀 있습니다.
    오른쪽 위 <b>⋮</b> → <b>다른 브라우저로 열기</b>를 눌러주세요.
  </div>
</div>

<style>
  /* sticky 로 두면 본문(A4 794px)을 따라가 모바일에선 버튼이 화면 밖으로 나간다 */
  .pv-bar{position:fixed;top:0;left:0;right:0;z-index:99;display:flex;align-items:center;gap:14px;
    padding:12px 18px;background:#182234;color:#e8e3d6;flex-wrap:wrap;
    font-family:Pretendard,-apple-system,'Malgun Gothic',sans-serif;font-size:14px;
    box-shadow:0 2px 12px rgba(0,0,0,.25)}
  body{padding-top:60px}
  .pv-back{color:#b3ad9c;text-decoration:none}
  .pv-title{flex:1;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .pv-title em{font-style:normal;color:#B59A62;font-size:12px;margin-left:6px}
  .pv-actions{display:flex;gap:8px;flex-wrap:wrap}
  .pv-actions button{padding:8px 16px;border:1px solid #B59A62;background:transparent;color:#e8e3d6;
    border-radius:7px;font-size:13px;cursor:pointer;font-family:inherit;white-space:nowrap;min-height:40px}
  .pv-actions button.send{background:#B59A62;color:#241a06;font-weight:700}
  .pv-actions button:disabled{opacity:.45}
  .pv-warn{display:none;flex:1 1 100%;margin-top:8px;padding:9px 12px;border-radius:7px;
    background:#3a2e1a;border:1px solid #6b5a33;color:#f0dcae;font-size:12.5px;line-height:1.6}
  @media (max-width:760px){
    .pv-bar{padding:10px 12px;gap:8px}
    body{padding-top:108px}
    .pv-actions{flex:1 1 100%;gap:6px}
    .pv-actions button{flex:1;padding:11px 4px;font-size:12.5px;min-height:44px}
  }
  @media print{ body{padding-top:0} .pv-bar,.pg-tools,.blk-del,.edit-hint,.toast{display:none!important} }

  .pg-tools{position:absolute;top:8px;right:10px;display:none;gap:5px;z-index:20}
  body.editing .pg-tools{display:flex}
  .pg-tools button{padding:5px 10px;border:1px solid #d8cfb8;background:#fff;color:#6b6656;
    border-radius:6px;font-size:11.5px;cursor:pointer;font-family:Pretendard,sans-serif;line-height:1.4}
  .pg-tools button.save{background:#B59A62;border-color:#B59A62;color:#fff;font-weight:700}

  body.editing .ch-block p,
  body.editing .ch-sub,
  body.editing .ch-title{outline:1px dashed #c8b98e;outline-offset:3px;border-radius:3px}
  body.editing [contenteditable]:focus{outline:2px solid #B59A62;background:#fffdf5}
  body.editing .ch-block{position:relative}
  .blk-del{position:absolute;right:-32px;top:2px;width:24px;height:24px;border-radius:6px;
    border:1px solid #e0c4c0;background:#fff;color:#b0392c;font-size:13px;cursor:pointer;display:none;line-height:1}
  body.editing .blk-del{display:block}
  .edit-hint{position:fixed;bottom:18px;left:50%;transform:translateX(-50%);background:#182234;color:#e8e3d6;
    padding:10px 20px;border-radius:8px;font-size:13px;z-index:98;display:none;
    font-family:Pretendard,-apple-system,sans-serif}
  body.editing .edit-hint{display:block}
  .toast{position:fixed;bottom:70px;left:50%;transform:translateX(-50%) translateY(10px);opacity:0;
    background:#2f9e5e;color:#fff;padding:9px 18px;border-radius:8px;font-size:13px;font-weight:700;
    z-index:99;transition:.25s;pointer-events:none;font-family:Pretendard,sans-serif}
  .toast.on{opacity:1;transform:translateX(-50%)}
</style>

<div class="edit-hint no-print">글을 눌러 바로 고칠 수 있습니다. 페이지마다 <b>저장</b> · <b>되돌리기</b> 버튼이 있습니다.</div>
<div class="toast" id="toast"></div>

<script>
var PDF_ID = ${pdf.id};
var LEAD_ID = ${pdf.lead_id};
var EMAIL = ${JSON.stringify(pdf.email || '')};
var UA = navigator.userAgent || '';
var IN_APP = /KAKAOTALK|NAVER|Instagram|FBAN|FBAV|Line\//i.test(UA);
var EDITING = false;
var ORIGINAL = {};
var DIRTY = false;

function $(id){ return document.getElementById(id); }
function pagesOf(){ return Array.prototype.slice.call(document.querySelectorAll('.page.chapter')); }
function toast(msg, bad){
  var t = $('toast');
  t.textContent = msg;
  t.style.background = bad ? '#c0392b' : '#2f9e5e';
  t.classList.add('on');
  setTimeout(function(){ t.classList.remove('on'); }, 1800);
}

/* 1. 리플로우 — 실제 높이를 재서 페이지를 다시 채운다 */
function movable(sec){
  return Array.prototype.filter.call(sec.children, function(el){
    return !el.classList.contains('fn') && !el.classList.contains('pg-tools');
  });
}
function capacity(sec){
  var cs = getComputedStyle(sec);
  var fn = sec.querySelector('.fn');
  return sec.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)
       - (fn ? fn.offsetHeight + 12 : 0) - 6;
}
/* ⚠️ 자식 높이를 더하면 margin collapse 때문에 실제보다 크게 나온다.
   마지막 요소의 아래 끝을 직접 재야 정확하다. */
function contentH(sec){
  var kids = movable(sec);
  if (!kids.length) return 0;
  var cs = getComputedStyle(sec);
  var top = sec.getBoundingClientRect().top + parseFloat(cs.paddingTop);
  var last = kids[kids.length - 1].getBoundingClientRect();
  return Math.max(0, last.bottom - top);
}
function lastPara(sec){
  var blocks = sec.querySelectorAll('.ch-block');
  for (var i = blocks.length - 1; i >= 0; i--) {
    var ps = blocks[i].querySelectorAll('p');
    if (ps.length) return ps[ps.length - 1];
  }
  return null;
}
function firstPara(sec){
  var b = sec.querySelector('.ch-block');
  return b ? b.querySelector('p') : null;
}
function pushDown(p, next){
  var src = p.parentNode;
  var first = next.querySelector('.ch-block');
  if (first && !first.querySelector('.ch-sub')) first.insertBefore(p, first.firstChild);
  else {
    var nb = document.createElement('div');
    nb.className = 'ch-block';
    nb.appendChild(p);
    next.insertBefore(nb, next.firstChild);
  }
  if (src && !src.querySelector('p') && !src.querySelector('.ch-sub')) src.remove();
}
function pullUp(p, sec){
  var src = p.parentNode;
  var anchor = p.nextSibling;
  var srcHasSub = !!src.querySelector('.ch-sub');
  var isFirstOfBlock = !p.previousElementSibling || p.previousElementSibling.classList.contains('ch-sub');

  // 소제목이 붙은 블록의 첫 문단이면 소제목까지 통째로 올린다 (소제목만 홀로 남으면 흉하다)
  if (srcHasSub && isFirstOfBlock) {
    var srcAnchor = src.nextSibling;
    var srcParent = src.parentNode;
    sec.appendChild(src);
    return function undo(){ srcParent.insertBefore(src, srcAnchor); };
  }

  var blocks = sec.querySelectorAll('.ch-block');
  var last = blocks.length ? blocks[blocks.length - 1] : null;
  if (last) last.appendChild(p);
  else {
    var nb = document.createElement('div');
    nb.className = 'ch-block';
    nb.appendChild(p);
    sec.appendChild(nb);
  }
  return function undo(){ if (src) src.insertBefore(p, anchor); };
}
function reflow(){
  var groups = {};
  pagesOf().forEach(function(sec){
    var k = sec.dataset.ch;
    (groups[k] = groups[k] || []).push(sec);
  });

  Object.keys(groups).forEach(function(k){
    var g = groups[k];
    for (var i = 0; i < g.length; i++) {
      var guard = 0;
      while (contentH(g[i]) > capacity(g[i]) && guard++ < 60) {
        var p = lastPara(g[i]);
        if (!p) break;
        if (!g[i + 1]) {
          var ns = document.createElement('section');
          ns.className = 'page sheet chapter';
          ns.dataset.ch = k;
          g[i].parentNode.insertBefore(ns, g[i].nextSibling);
          g.splice(i + 1, 0, ns);
        }
        pushDown(p, g[i + 1]);
      }
      guard = 0;
      while (g[i + 1] && guard++ < 60) {
        var q = firstPara(g[i + 1]);
        if (!q) break;
        var undo = pullUp(q, g[i]);
        if (contentH(g[i]) > capacity(g[i])) { undo(); break; }
      }
    }
    g.slice().forEach(function(sec){
      if (!sec.querySelector('p') && !sec.querySelector('.ch-head')) sec.remove();
    });
  });
}

/* 2. 페이지별 편집 */
function addPageTools(){
  pagesOf().forEach(function(sec, idx){
    if (sec.querySelector('.pg-tools')) return;
    ORIGINAL[idx] = sec.innerHTML;

    var box = document.createElement('div');
    box.className = 'pg-tools no-print';
    box.innerHTML = '<button type="button" data-revert>되돌리기</button>' +
                    '<button type="button" class="save" data-save>이 페이지 저장</button>';
    sec.appendChild(box);

    box.querySelector('[data-revert]').onclick = function(){
      if (!confirm('이 페이지를 처음 만들어진 글로 되돌릴까요?')) return;
      sec.innerHTML = ORIGINAL[idx];
      sec.appendChild(box);
      makeEditable(sec);
      DIRTY = true;
      toast('되돌렸습니다');
    };
    box.querySelector('[data-save]').onclick = function(){ save(box); };
  });
}
function makeEditable(root){
  root.querySelectorAll('.ch-title, .ch-sub, .ch-block p').forEach(function(el){
    el.setAttribute('contenteditable', 'true');
    el.oninput = function(){ DIRTY = true; };
  });
  root.querySelectorAll('.ch-block').forEach(function(b){
    if (b.querySelector('.blk-del')) return;
    var x = document.createElement('button');
    x.className = 'blk-del no-print';
    x.textContent = '×';
    x.onclick = function(){ if (confirm('이 문단 묶음을 삭제할까요?')) { b.remove(); DIRTY = true; } };
    b.appendChild(x);
  });
}

/* 화면 → 데이터 (페이지가 아니라 '챕터' 단위로 합친다) */
function collect(){
  var byCh = {}, order = [];
  pagesOf().forEach(function(sec){
    var k = sec.dataset.ch;
    if (!byCh[k]) {
      var t = sec.querySelector('.ch-title');
      byCh[k] = { title: t ? t.innerText.trim() : '', blocks: [] };
      order.push(k);
    }
    sec.querySelectorAll('.ch-block').forEach(function(b){
      var subEl = b.querySelector('.ch-sub');
      var paras = [];
      b.querySelectorAll('p').forEach(function(p){
        var t = p.innerText.trim();
        if (t) paras.push(t);
      });
      if (!subEl && !paras.length) return;
      var sub = subEl ? subEl.innerText.trim() : '';
      var arr = byCh[k].blocks;
      var last = arr[arr.length - 1];
      if (!sub && last) last.body += '\n\n' + paras.join('\n\n');
      else arr.push({ sub: sub, body: paras.join('\n\n') });
    });
  });
  return order.map(function(k){ return byCh[k]; });
}

async function save(box){
  var btn = box ? box.querySelector('[data-save]') : null;
  if (btn) { btn.disabled = true; btn.textContent = '저장 중...'; }
  try {
    var r = await fetch('/pdfs/' + PDF_ID + '/edit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chapters: collect() })
    });
    var d = await r.json();
    if (!d.ok) throw new Error(d.error || '실패');
    DIRTY = false;
    toast('저장했습니다');
  } catch (e) {
    toast('저장 실패: ' + e.message, true);
  }
  if (btn) { btn.disabled = false; btn.textContent = '이 페이지 저장'; }
}

/* 3. 상단 버튼 */
$('btnEdit').onclick = function(){
  EDITING = true;
  document.body.classList.add('editing');
  addPageTools();
  makeEditable(document);
  $('btnEdit').style.display = 'none';
  $('btnDone').style.display = '';
  $('pvMode').textContent = '수정 중';
};

$('btnDone').onclick = async function(){
  if (DIRTY) {
    if (confirm('저장하지 않은 수정이 있습니다. 저장할까요?')) await save(null);
  }
  EDITING = false;
  toast('정리된 내용으로 다시 만듭니다');
  setTimeout(function(){ location.reload(); }, 700);
};

$('btnPrint').onclick = function(){
  if (IN_APP) {
    $('pvWarn').style.display = 'block';
    alert('앱 안의 브라우저에서는 PDF 저장이 안 됩니다.\n\n오른쪽 위 메뉴에서 "다른 브라우저로 열기"를 눌러주세요.');
    return;
  }
  window.print();
};

$('btnSend').onclick = async function(){
  if (!EMAIL) { alert('이 신청자의 이메일이 없습니다.'); return; }
  if (DIRTY && !confirm('저장하지 않은 수정이 있습니다. 그대로 보낼까요?')) return;
  if (!confirm(EMAIL + ' 로 보낼까요?')) return;

  var btns = document.querySelectorAll('.pv-actions button');
  btns.forEach(function(b){ b.disabled = true; });
  $('btnSend').textContent = '보내는 중...';
  try {
    var r = await fetch('/pdfs/' + PDF_ID + '/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: EMAIL })
    });
    var d = await r.json();
    if (!d.ok) throw new Error(d.error || '실패');
    alert('발송 완료: ' + d.to);
    location.href = '/leads/' + LEAD_ID;
  } catch (e) {
    alert('발송 실패: ' + e.message);
    btns.forEach(function(b){ b.disabled = false; });
    $('btnSend').textContent = '이메일 보내기';
  }
};

if (IN_APP) $('pvWarn').style.display = 'block';

window.addEventListener('beforeunload', function(e){
  if (EDITING && DIRTY) { e.preventDefault(); e.returnValue = ''; }
});

// 폰트가 다 뜬 뒤에 재배치해야 높이가 정확하다
function runReflow(){
  try {
    reflow();
    // 빈 블록 정리
    document.querySelectorAll('.ch-block').forEach(function(b){
      if (!b.querySelector('p') && !b.querySelector('.ch-sub')) b.remove();
    });
  } catch (e) { console.error('[reflow]', e); }
}
function boot(){
  runReflow();
  setTimeout(runReflow, 400);   // 웹폰트가 늦게 뜨는 경우 대비해 한 번 더
}
if (document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ setTimeout(boot, 60); });
else window.addEventListener('load', function(){ setTimeout(boot, 200); });
</script>`;

    const html = inner.replace('<body>', '<body>' + toolbar);
    res.set('Content-Type', 'text/html; charset=utf-8').send(html);
  } catch (e) {
    next(e);
  }
});


/* ===== PDF 만들기 — 내담자 직접 입력 (외부 신청분) ===== */
router.get('/pdf/create', (req, res) => {
  res.render('dash/pdf-create', {
    user: req.user,
    active: 'pdf',
    types: PDF_TYPES,
    hasKey: !!req.user.openai_key,
    error: null,
    form: {},
  });
});

router.post('/pdf/create', async (req, res, next) => {
  try {
    const b = req.body || {};
    const back = (error, form) => res.status(400).render('dash/pdf-create', {
      user: req.user, active: 'pdf', types: PDF_TYPES,
      hasKey: !!req.user.openai_key, error, form,
    });

    if (!b.name || !b.birthDate) return back('이름과 생년월일은 필수입니다.', b);
    if (!req.user.openai_key) return back('OpenAI API 키를 먼저 등록해주세요.', b);

    const lead = await pool.query(
      `INSERT INTO leads (teacher_id, name, gender, birth, calendar, hour, region, email, phone, memo, status, source)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'제작 대기','직접 입력') RETURNING id`,
      [req.user.id, b.name, b.gender || null, b.birthDate, b.calendar || '양력',
       b.timeUnknown ? null : (b.birthTime || null), b.region || '서울특별시',
       (b.email || '').trim() || null, (b.phone || '').trim() || null, (b.memo || '').trim() || null]
    );

    res.redirect('/leads/' + lead.rows[0].id);
  } catch (e) {
    next(e);
  }
});

/* ===== PDF · 이메일 발송 기록 ===== */
router.get('/records', async (req, res, next) => {
  try {
    const f = req.query.f || 'all';
    const { rows } = await pool.query(
      `SELECT p.*, l.name, l.email AS lead_email, l.source
       FROM pdfs p JOIN leads l ON l.id = p.lead_id
       WHERE p.teacher_id = $1
       ORDER BY p.created_at DESC LIMIT 200`,
      [req.user.id]
    );

    const free = await pool.query(
      `SELECT f.id, f.created_at, f.mail_sent, f.input
       FROM free_logs f WHERE f.teacher_id = $1
       ORDER BY f.created_at DESC LIMIT 100`,
      [req.user.id]
    );

    let records = rows;
    if (f === '발송완료') records = rows.filter((r) => r.mail_sent);
    else if (f === '미발송') records = rows.filter((r) => !r.mail_sent);

    const counts = {
      all: rows.length,
      발송완료: rows.filter((r) => r.mail_sent).length,
      미발송: rows.filter((r) => !r.mail_sent).length,
      무료사주: free.rows.length,
    };

    res.render('dash/records', {
      user: req.user, active: 'records',
      records, freeLogs: free.rows, filter: f, counts,
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
/* ===== PDF 만들기 — 내담자 직접 입력 (외부 신청분) ===== */
router.get('/pdf/create', (req, res) => {
  res.render('dash/pdf-create', {
    user: req.user,
    active: 'pdf',
    types: PDF_TYPES,
    hasKey: !!req.user.openai_key,
    error: null,
    form: {},
  });
});

router.post('/pdf/create', async (req, res, next) => {
  try {
    const b = req.body || {};
    const back = (error, form) => res.status(400).render('dash/pdf-create', {
      user: req.user, active: 'pdf', types: PDF_TYPES,
      hasKey: !!req.user.openai_key, error, form,
    });

    if (!b.name || !b.birthDate) return back('이름과 생년월일은 필수입니다.', b);
    if (!req.user.openai_key) return back('OpenAI API 키를 먼저 등록해주세요.', b);

    const lead = await pool.query(
      `INSERT INTO leads (teacher_id, name, gender, birth, calendar, hour, region, email, phone, memo, status, source)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'제작 대기','직접 입력') RETURNING id`,
      [req.user.id, b.name, b.gender || null, b.birthDate, b.calendar || '양력',
       b.timeUnknown ? null : (b.birthTime || null), b.region || '서울특별시',
       (b.email || '').trim() || null, (b.phone || '').trim() || null, (b.memo || '').trim() || null]
    );

    res.redirect('/leads/' + lead.rows[0].id);
  } catch (e) {
    next(e);
  }
});

/* ===== PDF · 이메일 발송 기록 ===== */
router.get('/records', async (req, res, next) => {
  try {
    const f = req.query.f || 'all';
    const { rows } = await pool.query(
      `SELECT p.*, l.name, l.email AS lead_email, l.source
       FROM pdfs p JOIN leads l ON l.id = p.lead_id
       WHERE p.teacher_id = $1
       ORDER BY p.created_at DESC LIMIT 200`,
      [req.user.id]
    );

    const free = await pool.query(
      `SELECT f.id, f.created_at, f.mail_sent, f.input
       FROM free_logs f WHERE f.teacher_id = $1
       ORDER BY f.created_at DESC LIMIT 100`,
      [req.user.id]
    );

    let records = rows;
    if (f === '발송완료') records = rows.filter((r) => r.mail_sent);
    else if (f === '미발송') records = rows.filter((r) => !r.mail_sent);

    const counts = {
      all: rows.length,
      발송완료: rows.filter((r) => r.mail_sent).length,
      미발송: rows.filter((r) => !r.mail_sent).length,
      무료사주: free.rows.length,
    };

    res.render('dash/records', {
      user: req.user, active: 'records',
      records, freeLogs: free.rows, filter: f, counts,
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;

