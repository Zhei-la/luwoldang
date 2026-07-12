const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { requireAuth, requireApproved } = require('../middleware/auth');
const { calcSaju } = require('../services/manseryeok');
const { generatePdfReport, PDF_TYPES } = require('../services/ai');
const { sendPdfReport, buildPdfHtml } = require('../services/mail');
const { buildReportHtml } = require('../services/pdfDoc');

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
function normalizeBirth(b) {
  if (!b) return null;
  const p = String(b).split('-').map((x) => x.trim());
  if (p.length !== 3) return b;
  return `${p[0]}-${String(p[1]).padStart(2, '0')}-${String(p[2]).padStart(2, '0')}`;
}
/**
 * 저장된 시간 문자열 → 사주 계산용 'HH:MM'
 *
 *  '11:00'                  → '11:00'   (실제 시각 그대로)
 *  '사시 巳 09:30~11:29'     → '10:30'   (구간 중앙값)
 *  '모름 / 선택 안함'         → null
 */
function parseHour(h) {
  if (!h) return null;
  const str = String(h).trim();
  if (/모름|선택 안함/.test(str)) return null;

  // 1) 실제 시각만 저장된 경우 ('11:00') → 그대로 사용
  if (/^\d{1,2}:\d{2}$/.test(str)) {
    const [hh, mm] = str.split(':').map(Number);
    return String(hh).padStart(2, '0') + ':' + String(mm).padStart(2, '0');
  }

  // 2) 시간 구간 ('사시 巳 09:30~11:29') → 구간 중앙값
  const range = str.match(/(\d{1,2}):(\d{2})\s*[~-]\s*(\d{1,2}):(\d{2})/);
  if (range) {
    const start = Number(range[1]) * 60 + Number(range[2]);
    let end = Number(range[3]) * 60 + Number(range[4]);
    if (end < start) end += 24 * 60;           // 자시(23:30~01:29) 자정 넘김
    const mid = Math.round((start + end) / 2) % (24 * 60);
    return String(Math.floor(mid / 60)).padStart(2, '0') + ':' + String(mid % 60).padStart(2, '0');
  }

  // 3) 시각 하나만 발견되면 그대로
  const one = str.match(/(\d{1,2}):(\d{2})/);
  if (one) {
    return String(Number(one[1])).padStart(2, '0') + ':' + one[2];
  }
  return null;
}

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

    const chapters = await generatePdfReport({
      type, client, saju, openaiKey: req.user.openai_key,
      onProgress: (done, total, title) => send('progress', { done, total, title }),
    });

    const ins = await pool.query(
      'INSERT INTO pdfs (teacher_id, lead_id, type, sections) VALUES ($1,$2,$3,$4) RETURNING id',
      [req.user.id, lead.id, type, JSON.stringify(chapters)]
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

    const chapters = Array.isArray(pdf.sections) ? pdf.sections : [];
    const inner = buildReportHtml({
      type: pdf.type,
      client,
      teacher: req.user,
      saju,
      chapters,
    });

    const toolbar = `
<div class="pv-bar no-print">
  <a class="pv-back" href="/leads/${pdf.lead_id}">← 돌아가기</a>
  <span class="pv-title">${pdf.name}님 · ${pdf.type} <em>${chapters.length}개 챕터</em></span>
  <div class="pv-actions">
    <button onclick="window.print()">PDF로 저장 / 인쇄</button>
    <button class="send" onclick="sendMail()">이메일 보내기</button>
  </div>
</div>
<style>
  .pv-bar{position:sticky;top:0;z-index:99;display:flex;align-items:center;gap:14px;padding:12px 18px;background:#182234;color:#e8e3d6;font-family:Pretendard,-apple-system,'Malgun Gothic',sans-serif;font-size:14px}
  .pv-back{color:#b3ad9c;text-decoration:none}
  .pv-back:hover{color:#B59A62}
  .pv-title{flex:1;font-weight:600}
  .pv-title em{font-style:normal;color:#B59A62;font-size:12px;margin-left:6px}
  .pv-actions{display:flex;gap:8px}
  .pv-actions button{padding:8px 16px;border:1px solid #B59A62;background:transparent;color:#e8e3d6;border-radius:7px;font-size:13px;cursor:pointer;font-family:inherit}
  .pv-actions button:hover{background:rgba(181,154,98,.2)}
  .pv-actions button.send{background:#B59A62;color:#241a06;font-weight:700}
  .pv-actions button:disabled{opacity:.5}
  body{padding-top:0}
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

    const html = inner.replace('<body>', '<body>' + toolbar);
    res.set('Content-Type', 'text/html; charset=utf-8').send(html);
  } catch (e) {
    next(e);
  }
});

module.exports = router;module.exports = router;
