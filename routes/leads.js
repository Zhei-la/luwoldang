const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { requireAuth, requireApproved } = require('../middleware/auth');
const { calcSaju } = require('../services/manseryeok');
const { generatePdfReport, PDF_TYPES, generateFreeSaju, UPSELL, rewriteBlock } = require('../services/ai');
const { sendPdfReport, buildPdfHtml, sendFreeSaju, sendBundle } = require('../services/mail');
const { buildReportHtml, esc } = require('../services/pdfDoc');
const { resolveCover, resolveBgPaper } = require('../services/coverStore');
const { buildFreePdfHtml } = require('../services/freePdf');
const { normalizeBirth, parseHour } = require('../services/birth');
const { ensureToken } = require('./share');
const { htmlToPdf, sendPdf } = require('../services/pdfFile');

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
    // 이메일 발송이든, 카톡으로 직접 전달했든 '전달 완료'로 본다
    const done = (r) => r.mail_sent || r.delivered_at;

    if (filter === '상담신청') leads = rows.filter((r) => r.source !== '무료사주');
    else if (filter === '무료사주') leads = rows.filter((r) => r.source === '무료사주');
    else if (filter === '미발송') leads = rows.filter((r) => !done(r));
    else if (filter === '발송완료') leads = rows.filter((r) => done(r));

    const counts = {
      all: rows.length,
      상담신청: rows.filter((r) => r.source !== '무료사주').length,
      무료사주: rows.filter((r) => r.source === '무료사주').length,
      미발송: rows.filter((r) => !done(r)).length,
      발송완료: rows.filter((r) => done(r)).length,
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

    // 발송 스냅샷: 이 시점의 리포트 내용 + 상호명/표지/배경지를 고정 보관
    //   (나중에 교육생이 수정/개명해도, 이미 보낸 리포트는 이대로 유지)
    const sentMeta = {
      site_name: req.user.site_name || null,
      name: req.user.name || null,
      cover_set: req.user.cover_set || null,
      bg_paper: req.user.bg_paper || null,
      kakao_consult_link: req.user.kakao_consult_link || null,
      pdf_cta_text: req.user.pdf_cta_text || null,
      pdf_cta_desc: req.user.pdf_cta_desc || null,
    };
    await pool.query(
      `UPDATE pdfs
         SET mail_sent = TRUE, sent_at = NOW(), sent_to = $1,
             sent_sections = $2, sent_meta = $3, edits_pending = FALSE
       WHERE id = $4`,
      [to, JSON.stringify(pdf.sections || []), JSON.stringify(sentMeta), pdf.id]
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


/* ===== 리포트 내용 수정 저장 =====
   applyToSent:
     - undefined/false → 편집본만 저장. 발송된 리포트면 edits_pending=TRUE (발송본은 그대로)
     - true            → 편집본 저장 + 발송 스냅샷도 갱신 (내담자가 보는 것도 바뀜)
   응답의 wasSent 로 프론트가 "발송본에도 적용할까요?" 팝업을 띄운다. */
router.post('/pdfs/:id/edit', async (req, res) => {
  try {
    const chapters = req.body && req.body.chapters;
    const applyToSent = !!(req.body && req.body.applyToSent);
    if (!Array.isArray(chapters)) {
      return res.status(400).json({ ok: false, error: '형식이 올바르지 않습니다.' });
    }

    // 발송 여부 확인
    const cur = await pool.query(
      'SELECT mail_sent FROM pdfs WHERE id = $1 AND teacher_id = $2',
      [req.params.id, req.user.id]
    );
    if (!cur.rows[0]) return res.status(404).json({ ok: false, error: '리포트를 찾을 수 없습니다.' });
    const wasSent = !!cur.rows[0].mail_sent;

    if (!wasSent) {
      // 아직 발송 안 함 → 그냥 저장
      await pool.query(
        'UPDATE pdfs SET sections = $1 WHERE id = $2 AND teacher_id = $3',
        [JSON.stringify(chapters), req.params.id, req.user.id]
      );
    } else if (applyToSent) {
      // 발송됨 + 발송본에도 적용 → 편집본 + 스냅샷 함께 갱신
      await pool.query(
        `UPDATE pdfs SET sections = $1, sent_sections = $1, edits_pending = FALSE
         WHERE id = $2 AND teacher_id = $3`,
        [JSON.stringify(chapters), req.params.id, req.user.id]
      );
    } else {
      // 발송됨 + 편집본만 저장 → 발송본(sent_sections)은 유지, 미적용 표시
      await pool.query(
        `UPDATE pdfs SET sections = $1, edits_pending = TRUE
         WHERE id = $2 AND teacher_id = $3`,
        [JSON.stringify(chapters), req.params.id, req.user.id]
      );
    }

    res.json({ ok: true, wasSent, applied: !wasSent || applyToSent });
  } catch (e) {
    console.error('[PDF] 수정 실패:', e.message);
    res.status(500).json({ ok: false, error: e.message });
  }
});

/* ===== 발송본에 편집 내용 적용 (수정하기 옆 '발송본에 적용' 버튼) ===== */
router.post('/pdfs/:id/apply-to-sent', async (req, res) => {
  try {
    const { rowCount } = await pool.query(
      `UPDATE pdfs SET sent_sections = sections, edits_pending = FALSE
       WHERE id = $1 AND teacher_id = $2 AND mail_sent = TRUE`,
      [req.params.id, req.user.id]
    );
    if (!rowCount) return res.status(404).json({ ok: false, error: '발송된 리포트를 찾을 수 없습니다.' });
    res.json({ ok: true });
  } catch (e) {
    console.error('[PDF] 발송본 적용 실패:', e.message);
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
    <button id="btnApplySent" style="display:none">발송본에 적용</button>
    <a id="btnDl" class="dlbtn" href="/pdfs/${pdf.id}/report.pdf">PDF 다운받기</a>
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
  .pv-actions button,.pv-actions .dlbtn{padding:8px 16px;border:1px solid #B59A62;background:transparent;color:#e8e3d6;
    border-radius:7px;font-size:13px;cursor:pointer;font-family:inherit;white-space:nowrap;min-height:40px;
    text-decoration:none;display:inline-flex;align-items:center;justify-content:center}
  .pv-actions .dlbtn{background:#2f9e5e;border-color:#2f9e5e;color:#fff;font-weight:700}
  .pv-actions .dlbtn.loading{opacity:.6;pointer-events:none}
  .pv-actions button.send{background:#B59A62;color:#241a06;font-weight:700}
  .pv-actions button:disabled{opacity:.45}
  .pv-warn{display:none;flex:1 1 100%;margin-top:8px;padding:9px 12px;border-radius:7px;
    background:#3a2e1a;border:1px solid #6b5a33;color:#f0dcae;font-size:12.5px;line-height:1.6}
  @media (max-width:760px){
    .pv-bar{padding:10px 12px;gap:7px}
    body{padding-top:118px}
    .pv-title{flex:1 1 100%;font-size:12.5px}
    .pv-actions{flex:1 1 100%;display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px}
    .pv-actions button,.pv-actions .dlbtn{width:100%;padding:11px 2px;font-size:11.5px;min-height:44px}
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
  .blk-tools{position:absolute;right:-118px;top:0;display:none;gap:5px;align-items:flex-start}
  body.editing .blk-tools{display:flex}
  .blk-ai{padding:5px 9px;border-radius:6px;border:1px solid #B59A62;background:#fff;color:#8a6f3c;
    font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap;font-family:Pretendard,sans-serif;line-height:1.4}
  .blk-ai:hover{background:#B59A62;color:#fff}
  .blk-ai:disabled{opacity:.5}
  .blk-del{width:24px;height:24px;border-radius:6px;flex:none;
    border:1px solid #e0c4c0;background:#fff;color:#b0392c;font-size:13px;cursor:pointer;line-height:1}
  @media(max-width:1100px){ .blk-tools{right:4px;top:-30px} }
  .edit-hint{position:fixed;bottom:18px;left:50%;transform:translateX(-50%);background:#182234;color:#e8e3d6;
    padding:10px 20px;border-radius:8px;font-size:13px;z-index:98;display:none;
    font-family:Pretendard,-apple-system,sans-serif}
  body.editing .edit-hint{display:block}
  .toast{position:fixed;bottom:70px;left:50%;transform:translateX(-50%) translateY(10px);opacity:0;
    background:#2f9e5e;color:#fff;padding:9px 18px;border-radius:8px;font-size:13px;font-weight:700;
    z-index:99;transition:.25s;pointer-events:none;font-family:Pretendard,sans-serif}
  .toast.on{opacity:1;transform:translateX(-50%)}
</style>

<div class="edit-hint no-print">글을 눌러 바로 고칠 수 있습니다. 문단 옆 <b>AI 다시 쓰기</b>로 그 부분만 새로 받을 수도 있습니다.</div>
<div class="toast" id="toast"></div>

<script>
var PDF_ID = ${pdf.id};
var LEAD_ID = ${pdf.lead_id};
var EMAIL = ${JSON.stringify(pdf.email || '')};
var MAIL_SENT = ${pdf.mail_sent ? 'true' : 'false'};
var EDITS_PENDING = ${pdf.edits_pending ? 'true' : 'false'};
var UA = navigator.userAgent || '';
var IN_APP = /KAKAOTALK|NAVER|Instagram|FBAN|FBAV|Line\//i.test(UA);
var EDITING = false;
var ORIGINAL = {};
var DIRTY = false;

function $(id){ return document.getElementById(id); }
// ⚠️ '사주 용어 풀이' 페이지도 .page.chapter 라서, 그냥 긁으면 가짜 챕터가 저장된다.
// data-ch 가 붙은 진짜 본문 페이지만 잡는다.
function pagesOf(){ return Array.prototype.slice.call(document.querySelectorAll('.page.chapter[data-ch]')); }
function toast(msg, bad){
  var t = $('toast');
  t.textContent = msg;
  t.style.background = bad ? '#c0392b' : '#2f9e5e';
  t.classList.add('on');
  setTimeout(function(){ t.classList.remove('on'); }, 1800);
}

/* 리플로우는 PDF 본체(pdfDoc.js)에 내장돼 있어 여기선 안 돌린다 */

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
    if (b.querySelector('.blk-tools')) return;

    var box = document.createElement('div');
    box.className = 'blk-tools no-print';

    var ai = document.createElement('button');
    ai.type = 'button';
    ai.className = 'blk-ai';
    ai.textContent = 'AI 다시 쓰기';
    ai.onclick = function(){ rewriteBlock(b, ai); };

    var x = document.createElement('button');
    x.type = 'button';
    x.className = 'blk-del';
    x.textContent = '×';
    x.title = '이 문단 묶음 삭제';
    x.onclick = function(){ if (confirm('이 문단 묶음을 삭제할까요?')) { b.remove(); DIRTY = true; } };

    box.appendChild(ai);
    box.appendChild(x);
    b.appendChild(box);
  });
}

/* 이 블록만 AI 에게 다시 쓰게 한다 */
async function rewriteBlock(blk, btn){
  var sec = blk.closest('.page.chapter[data-ch]');
  if (!sec) return;

  var note = prompt('어떻게 고칠까요? (비워두면 문체만 다듬습니다)\\n\\n예) 더 구체적으로 / 좀 더 짧게 / 재물 얘기를 더');
  if (note === null) return;

  var subEl = blk.querySelector('.ch-sub');
  var paras = [];
  blk.querySelectorAll('p').forEach(function(p){
    var t = p.innerText.trim();
    if (t) paras.push(t);
  });
  if (!paras.length) { alert('내용이 없습니다.'); return; }

  var old = btn.textContent;
  btn.disabled = true;
  btn.textContent = '다시 쓰는 중...';

  try {
    var r = await fetch('/pdfs/' + PDF_ID + '/rewrite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chapterTitle: (sec.querySelector('.ch-title') || {}).innerText || '',
        sub: subEl ? subEl.innerText.trim() : '',
        body: paras.join('\\n\\n'),
        note: (note || '').trim()
      })
    });
    var d = await r.json();
    if (!d.ok) throw new Error(d.error || '실패');

    // 새 문단으로 갈아끼운다
    blk.querySelectorAll('p').forEach(function(p){ p.remove(); });
    var tools = blk.querySelector('.blk-tools');
    String(d.body).split(/\\n{2,}|\\n/).filter(Boolean).forEach(function(t){
      var p = document.createElement('p');
      p.textContent = t.trim();
      p.setAttribute('contenteditable', 'true');
      p.oninput = function(){ DIRTY = true; };
      blk.insertBefore(p, tools);
    });
    DIRTY = true;
    toast('다시 썼습니다. 확인하고 저장하세요.');
  } catch (e) {
    toast('실패: ' + e.message, true);
  }
  btn.disabled = false;
  btn.textContent = old;
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
      if (!sub && last) last.body += '\\n\\n' + paras.join('\\n\\n');
      else arr.push({ sub: sub, body: paras.join('\\n\\n') });
    });
  });
  return order.map(function(k){ return byCh[k]; });
}

async function save(box, applyToSent){
  var btn = box ? box.querySelector('[data-save]') : null;
  if (btn) { btn.disabled = true; btn.textContent = '저장 중...'; }
  try {
    var r = await fetch('/pdfs/' + PDF_ID + '/edit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chapters: collect(), applyToSent: !!applyToSent })
    });
    var d = await r.json();
    if (!d.ok) throw new Error(d.error || '실패');
    DIRTY = false;
    if (d.wasSent && !d.applied) {
      EDITS_PENDING = true;
      toast('편집본 저장됨 (보낸 리포트엔 미적용)');
    } else {
      if (d.applied) EDITS_PENDING = false;
      toast('저장했습니다');
    }
    if (window._refreshApplyBtn) window._refreshApplyBtn();
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
  pagesOf().forEach(makeEditable);   // 용어 풀이·표지·목차는 건드리지 않는다
  $('btnEdit').style.display = 'none';
  $('btnDone').style.display = '';
  $('pvMode').textContent = '수정 중';
};

$('btnDone').onclick = async function(){
  if (DIRTY) {
    if (confirm('저장하지 않은 수정이 있습니다. 저장할까요?')) {
      // 발송된 리포트면 발송본에도 적용할지 물어본다
      var applyToSent = false;
      if (MAIL_SENT) {
        applyToSent = confirm(
          '이미 보낸 리포트입니다.\\n\\n' +
          '수정한 내용을 [이미 보낸 리포트]에도 적용할까요?\\n\\n' +
          '· 확인 = 내담자가 보는 리포트도 바뀝니다\\n' +
          '· 취소 = 내 편집본만 저장 (보낸 리포트는 그대로)'
        );
      }
      await save(null, applyToSent);
    }
  }
  EDITING = false;
  toast('정리된 내용으로 다시 만듭니다');
  setTimeout(function(){ location.reload(); }, 700);
};

var dl = $('btnDl');
if (dl) dl.addEventListener('click', function(){
  dl.classList.add('loading');
  dl.textContent = 'PDF 만드는 중… (20초쯤)';
  setTimeout(function(){ dl.classList.remove('loading'); dl.textContent = 'PDF 다운받기'; }, 45000);
});

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

/* 발송본에 적용 버튼: 발송됐고 편집본이 미적용 상태일 때만 노출 */
(function(){
  var b = $('btnApplySent');
  if (!b) return;
  function refresh(){ b.style.display = (MAIL_SENT && EDITS_PENDING) ? '' : 'none'; }
  refresh();
  b.onclick = async function(){
    if (!confirm('지금 편집본을 [이미 보낸 리포트]에 적용할까요?\\n내담자가 보는 리포트가 바뀝니다.')) return;
    b.disabled = true; b.textContent = '적용 중...';
    try {
      var r = await fetch('/pdfs/' + PDF_ID + '/apply-to-sent', { method: 'POST' });
      var d = await r.json();
      if (!d.ok) throw new Error(d.error || '실패');
      EDITS_PENDING = false;
      toast('보낸 리포트에 적용했습니다');
      refresh();
    } catch (e) {
      toast('적용 실패: ' + e.message, true);
    }
    b.disabled = false; b.textContent = '발송본에 적용';
  };
  // 저장 후 상태 변화 반영을 위해 주기적으로 확인
  window._refreshApplyBtn = refresh;
})();

window.addEventListener('beforeunload', function(e){
  if (EDITING && DIRTY) { e.preventDefault(); e.returnValue = ''; }
});


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

/* ===== 묶어서 보내기 — 리포트 여러 개를 메일 한 통에 ===== */
router.post('/leads/:id/send-bundle', async (req, res) => {
  try {
    const ids = (req.body.pdfIds || []).map(Number).filter(Boolean);
    if (!ids.length) return res.status(400).json({ error: '리포트를 선택해주세요.' });

    // 내 리포트인지 + 같은 신청자 것인지 확인
    const { rows } = await pool.query(
      `SELECT p.id, p.type, l.name, l.email, l.birth, l.hour, l.calendar, l.region, l.gender
       FROM pdfs p JOIN leads l ON l.id = p.lead_id
       WHERE p.id = ANY($1) AND p.teacher_id = $2 AND p.lead_id = $3
       ORDER BY p.created_at ASC`,
      [ids, req.user.id, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: '리포트를 찾을 수 없습니다.' });

    const lead = rows[0];
    const to = String(req.body.email || lead.email || '').trim();
    if (!to) return res.status(400).json({ error: '이메일이 없습니다.' });

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
    } catch (e) { /* 만세력 실패해도 메일은 나간다 */ }

    const base = process.env.BASE_URL || '';
    const items = [];
    for (const p of rows) {
      const token = await ensureToken(p.id);
      items.push({ type: p.type, shareUrl: `${base}/r/${token}` });
    }

    await sendBundle({
      to,
      teacher: req.user,
      saju,
      input: { name: lead.name },
      items,
      baseUrl: base,
    });

    await pool.query(
      'UPDATE pdfs SET mail_sent = TRUE, sent_at = NOW(), sent_to = $1 WHERE id = ANY($2)',
      [to, ids]
    );

    console.log('[MAIL] 묶음 발송:', to, '·', rows.map((x) => x.type).join(', '));
    res.json({ ok: true, to, count: rows.length });
  } catch (e) {
    console.error('[MAIL] 묶음 발송 실패:', e.message);
    res.status(500).json({ error: e.message || '발송에 실패했습니다.' });
  }
});

/* ===== 미리보기에서 PDF 파일로 내려받기 (교육생) =====
   브라우저 인쇄는 카톡·메일 앱 안에서 막혀 있어서, 서버가 직접 만들어 준다. */
async function downloadPdf(req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT p.id, p.type, p.sections, p.extra,
              l.name, l.birth, l.hour, l.calendar, l.region, l.gender
       FROM pdfs p JOIN leads l ON l.id = p.lead_id
       WHERE p.id = $1 AND p.teacher_id = $2`,
      [req.params.id, req.user.id]
    );
    const pdf = rows[0];
    if (!pdf) return res.status(404).send('리포트를 찾을 수 없습니다.');

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
    } catch (e) { /* 만세력 실패해도 본문은 나간다 */ }

    const baseUrl = process.env.BASE_URL || '';
    const cover = await resolveCover(req.user.id, pdf.type);
    const bgPaper = await resolveBgPaper(req.user.id);
    const token = await ensureToken(pdf.id);
    const reviewUrl = (process.env.BASE_URL || 'https://www.luwolsaju.com') + '/r/' + token + '#rvwWrap';
    const html = pdf.type === FREE
      ? buildFreePdfHtml({ teacher: req.user, client, saju, result: pdf.sections || {}, baseUrl })
      : buildReportHtml({
          type: pdf.type, client, saju,
          chapters: Array.isArray(pdf.sections) ? pdf.sections : [],
          teacher: req.user, extra: pdf.extra || null, baseUrl, cover, bgPaper,
          reviewUrl, reviewMode: 'pdf',
        });

    const buf = await htmlToPdf(html);
    sendPdf(res, buf, pdf.name, pdf.type);
  } catch (e) {
    console.error('[PDF] 미리보기 다운로드 실패:', e.message);
    res.status(500).send('PDF를 만들지 못했습니다. 잠시 후 다시 시도해주세요.');
  }
}

// 주소가 .pdf 로 끝나야 인앱 브라우저에서 확장자가 붙는다
router.get('/pdfs/:id/report.pdf', downloadPdf);
router.get('/pdfs/:id/download', downloadPdf);   // 예전 주소 호환

/* ===== 블록 하나만 AI 로 다시 쓰기 ===== */
router.post('/pdfs/:id/rewrite', async (req, res) => {
  try {
    if (!req.user.openai_key) {
      return res.status(400).json({ ok: false, error: 'OpenAI 키를 먼저 등록해주세요.' });
    }
    const { chapterTitle, sub, body, note } = req.body || {};
    if (!body || String(body).trim().length < 20) {
      return res.status(400).json({ ok: false, error: '다시 쓸 내용이 없습니다.' });
    }

    const { rows } = await pool.query(
      `SELECT p.type, l.name, l.birth, l.hour, l.calendar, l.region, l.gender, l.memo
       FROM pdfs p JOIN leads l ON l.id = p.lead_id
       WHERE p.id = $1 AND p.teacher_id = $2`,
      [req.params.id, req.user.id]
    );
    const pdf = rows[0];
    if (!pdf) return res.status(404).json({ ok: false, error: '리포트를 찾을 수 없습니다.' });

    const client = {
      name: pdf.name,
      birthDate: normalizeBirth(pdf.birth),
      birthTime: parseHour(pdf.hour),
      calendar: pdf.calendar,
      region: pdf.region,
      gender: pdf.gender,
      question: pdf.memo || '',
    };

    const saju = calcSaju({
      birthDate: client.birthDate,
      birthTime: client.birthTime,
      calendar: pdf.calendar === '윤달' ? '음력' : (pdf.calendar || '양력'),
      isLeapMonth: pdf.calendar === '윤달',
      region: pdf.region || '서울특별시',
      gender: pdf.gender,
    });

    const text = await rewriteBlock({
      type: pdf.type,
      chapterTitle: String(chapterTitle || '').trim(),
      sub: String(sub || '').trim(),
      body: String(body),
      note: String(note || '').trim(),
      client, saju,
      openaiKey: req.user.openai_key,
    });

    res.json({ ok: true, body: text });
  } catch (e) {
    console.error('[PDF] 다시쓰기 실패:', e.message);
    res.status(500).json({ ok: false, error: e.message || '다시 쓰지 못했습니다.' });
  }
});

/* ===== 신청자 삭제 ===== */
router.post('/api/leads/:id/delete', async (req, res) => {
  try {
    // 리포트가 있으면 같이 지운다 (없는 리포트를 참조하는 껍데기가 남지 않게)
    await pool.query('DELETE FROM pdfs WHERE lead_id = $1 AND teacher_id = $2',
      [req.params.id, req.user.id]);
    const { rowCount } = await pool.query('DELETE FROM leads WHERE id = $1 AND teacher_id = $2',
      [req.params.id, req.user.id]);
    if (!rowCount) return res.status(404).json({ ok: false, error: '신청자를 찾을 수 없습니다.' });

    console.log('[신청자] 삭제:', req.params.id);
    res.json({ ok: true });
  } catch (e) {
    console.error('[신청자] 삭제 실패:', e.message);
    res.status(500).json({ ok: false, error: e.message });
  }
});

/* ===== 전달 완료 표시 (이메일 말고 카톡 등으로 직접 보낸 경우) ===== */
router.post('/api/leads/:id/delivered', async (req, res) => {
  try {
    const on = req.body.delivered !== false;
    const by = String(req.body.by || '직접 전달').slice(0, 20);

    const { rows } = await pool.query(
      `UPDATE leads
       SET delivered_at = $1, delivered_by = $2
       WHERE id = $3 AND teacher_id = $4
       RETURNING delivered_at, delivered_by`,
      [on ? new Date() : null, on ? by : null, req.params.id, req.user.id]
    );
    if (!rows[0]) return res.status(404).json({ ok: false, error: '신청자를 찾을 수 없습니다.' });

    res.json({ ok: true, delivered: !!rows[0].delivered_at, by: rows[0].delivered_by });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

module.exports = router;

