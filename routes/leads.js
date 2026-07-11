const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { requireAuth, requireApproved } = require('../middleware/auth');
const { calcSaju } = require('../services/manseryeok');
const { generatePdfReport, PDF_TYPES } = require('../services/ai');
const { sendPdfReport, buildPdfHtml } = require('../services/mail');

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
function normalizeBirth(b) {
  if (!b) return null;
  const p = String(b).split('-').map((x) => x.trim());
  if (p.length !== 3) return b;
  return `${p[0]}-${String(p[1]).padStart(2, '0')}-${String(p[2]).padStart(2, '0')}`;
}
// '사시 巳 09:30~11:29' → '10:00' / '모름' → null
function parseHour(h) {
  if (!h) return null;
  if (/모름|선택 안함/.test(h)) return null;
  const m = String(h).match(/(\d{2}):(\d{2})/);
  if (!m) return /^\d{1,2}:\d{2}$/.test(h) ? h : null;
  // 구간 시작시각 + 1시간 (구간 중앙)
  let hh = Number(m[1]);
  hh = (hh + 1) % 24;
  return String(hh).padStart(2, '0') + ':00';
}

/* ===== PDF 내용 생성 (AI) ===== */
router.post('/leads/:id/pdf', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM leads WHERE id = $1 AND teacher_id = $2',
      [req.params.id, req.user.id]
    );
    const lead = rows[0];
    if (!lead) return res.status(404).json({ ok: false, error: '신청 내역 없음' });
    if (!req.user.openai_key) return res.status(400).json({ ok: false, error: 'OpenAI 키를 먼저 등록해주세요.' });

    const type = req.body.type;
    if (!PDF_TYPES.includes(type)) return res.status(400).json({ ok: false, error: 'PDF 종류를 선택해주세요.' });

    const saju = calcSaju({
      birthDate: normalizeBirth(lead.birth),
      birthTime: parseHour(lead.hour),
      calendar: lead.calendar === '윤달' ? '음력' : (lead.calendar || '양력'),
      isLeapMonth: lead.calendar === '윤달',
      region: lead.region || '서울특별시',
    });

    const client = {
      name: lead.name, gender: lead.gender,
      birthDate: normalizeBirth(lead.birth),
      birthTime: parseHour(lead.hour),
      calendar: lead.calendar, region: lead.region,
      question: lead.memo,
    };

    const sections = await generatePdfReport({ type, client, saju, openaiKey: req.user.openai_key });

    const ins = await pool.query(
      'INSERT INTO pdfs (teacher_id, lead_id, type, sections) VALUES ($1,$2,$3,$4) RETURNING id',
      [req.user.id, lead.id, type, JSON.stringify(sections)]
    );

    res.json({ ok: true, pdfId: ins.rows[0].id });
  } catch (e) {
    console.error('[PDF] 생성 실패:', e.message);
    res.status(500).json({ ok: false, error: e.message });
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
      });
    } catch (e) { /* noop */ }

    await sendPdfReport({
      to,
      teacher: req.user,
      type: pdf.type,
      sections: pdf.sections,
      saju,
      input: { name: pdf.name },
      baseUrl: process.env.BASE_URL || '',
    });

    await pool.query(
      'UPDATE pdfs SET mail_sent = TRUE, sent_at = NOW(), sent_to = $1 WHERE id = $2',
      [to, pdf.id]
    );
    await pool.query("UPDATE leads SET status = '발송완료' WHERE id = $1", [pdf.lead_id]);

    res.json({ ok: true, to });
  } catch (e) {
    console.error('[MAIL] PDF 발송 실패:', e.message);
    res.status(500).json({ ok: false, error: e.message });
  }
});


/* ===== PDF 미리보기 (인쇄 → PDF 저장 가능) ===== */
router.get('/pdfs/:id/preview', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT p.*, l.name, l.email, l.gender, l.birth, l.calendar, l.hour, l.region
       FROM pdfs p JOIN leads l ON l.id = p.lead_id
       WHERE p.id = $1 AND p.teacher_id = $2`,
      [req.params.id, req.user.id]
    );
    const pdf = rows[0];
    if (!pdf) return res.status(404).send('리포트를 찾을 수 없습니다.');

    let saju = null;
    try {
      saju = calcSaju({
        birthDate: normalizeBirth(pdf.birth),
        birthTime: parseHour(pdf.hour),
        calendar: pdf.calendar === '윤달' ? '음력' : (pdf.calendar || '양력'),
        isLeapMonth: pdf.calendar === '윤달',
        region: pdf.region || '서울특별시',
      });
    } catch (e) { /* noop */ }

    const inner = buildPdfHtml({
      teacher: req.user,
      type: pdf.type,
      sections: pdf.sections,
      saju,
      input: { name: pdf.name },
      baseUrl: process.env.BASE_URL || '',
    });

    // 상단 툴바 + 인쇄 스타일 삽입
    const toolbar = `
<div class="pv-bar no-print">
  <a class="pv-back" href="/leads/${pdf.lead_id}">← 돌아가기</a>
  <span class="pv-title">${pdf.name}님 · ${pdf.type} <em>미리보기</em></span>
  <div class="pv-actions">
    <button onclick="window.print()">PDF로 저장 / 인쇄</button>
    <button class="send" onclick="sendMail()">이메일 보내기</button>
  </div>
</div>
<style>
  .pv-bar{position:sticky;top:0;z-index:99;display:flex;align-items:center;gap:14px;padding:12px 18px;background:#182234;color:#e8e3d6;font-family:-apple-system,'Malgun Gothic',sans-serif;font-size:14px}
  .pv-back{color:#b3ad9c;text-decoration:none}
  .pv-back:hover{color:#B59A62}
  .pv-title{flex:1;font-weight:600}
  .pv-title em{font-style:normal;color:#B59A62;font-size:12px;margin-left:4px}
  .pv-actions{display:flex;gap:8px}
  .pv-actions button{padding:8px 16px;border:1px solid #B59A62;background:transparent;color:#e8e3d6;border-radius:7px;font-size:13px;cursor:pointer;font-family:inherit}
  .pv-actions button:hover{background:rgba(181,154,98,.2)}
  .pv-actions button.send{background:#B59A62;color:#241a06;font-weight:700}
  .pv-actions button:disabled{opacity:.5}
  @media print{
    .no-print{display:none!important}
    body{background:#fff!important}
    @page{margin:12mm}
  }
</style>
<script>
async function sendMail(){
  var email = ${JSON.stringify(pdf.email || '')};
  if(!email){ alert('이 신청자의 이메일이 없습니다.'); return; }
  if(!confirm(email + ' 로 보낼까요?')) return;
  var btns = document.querySelectorAll('.pv-actions button');
  btns.forEach(function(b){ b.disabled = true; });
  try{
    var r = await fetch('/pdfs/${pdf.id}/send', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ email: email })
    });
    var d = await r.json();
    if(!d.ok) throw new Error(d.error || '실패');
    alert('발송 완료: ' + d.to);
    location.href = '/leads/${pdf.lead_id}';
  }catch(e){
    alert('발송 실패: ' + e.message);
    btns.forEach(function(b){ b.disabled = false; });
  }
}
</script>`;

    const html = inner.replace('<body style="margin:0;padding:0;background:#F7F3EA">',
      '<body style="margin:0;padding:0;background:#F7F3EA">' + toolbar);

    res.set('Content-Type', 'text/html; charset=utf-8').send(html);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
