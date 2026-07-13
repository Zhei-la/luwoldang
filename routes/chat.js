const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { requireAuth, requireApproved } = require('../middleware/auth');
const { calcSaju } = require('../services/manseryeok');
const { normalizeBirth, parseHour } = require('../services/birth');
const { answerFollowUp } = require('../services/ai');

router.use(requireAuth, requireApproved);

/** 채팅방 = 내가 만든 리포트 하나 */
async function roomList(teacherId) {
  const { rows } = await pool.query(
    `SELECT p.id, p.type, p.created_at, p.mail_sent,
            l.name, l.email, l.birth, l.hour, l.calendar, l.region, l.gender,
            (SELECT COUNT(*)::int FROM chat_qa c WHERE c.pdf_id = p.id) AS qa_count,
            (SELECT MAX(created_at) FROM chat_qa c WHERE c.pdf_id = p.id) AS last_at
     FROM pdfs p
     JOIN leads l ON l.id = p.lead_id
     WHERE p.teacher_id = $1
     ORDER BY COALESCE(
       (SELECT MAX(created_at) FROM chat_qa c WHERE c.pdf_id = p.id),
       p.created_at
     ) DESC`,
    [teacherId]
  );
  return rows;
}

/* ===== 화면 ===== */
router.get('/chat', async (req, res, next) => {
  try {
    const rooms = await roomList(req.user.id);
    const pdfId = Number(req.query.pdf) || (rooms[0] ? rooms[0].id : null);

    let room = null;
    let messages = [];

    if (pdfId) {
      room = rooms.find((r) => r.id === pdfId) || null;
      if (room) {
        const qa = await pool.query(
          'SELECT id, question, answer, created_at FROM chat_qa WHERE pdf_id = $1 ORDER BY created_at ASC',
          [pdfId]
        );
        messages = qa.rows;
      }
    }

    res.render('dash/chat', {
      user: req.user,
      active: 'chat',
      rooms,
      room,
      messages,
      hasKey: !!req.user.openai_key,
    });
  } catch (e) {
    next(e);
  }
});

/* ===== 질문 → 답변 ===== */
router.post('/api/chat/:pdfId/ask', async (req, res) => {
  try {
    const question = String(req.body.question || '').trim();
    if (!question) return res.status(400).json({ error: '질문을 입력해주세요.' });
    if (question.length > 800) return res.status(400).json({ error: '질문이 너무 깁니다. (800자 이내)' });
    if (!req.user.openai_key) {
      return res.status(400).json({ error: 'API 관리에서 OpenAI 키를 먼저 등록해주세요.' });
    }

    // 내 리포트인지 확인 (다른 교육생 것 접근 차단)
    const { rows } = await pool.query(
      `SELECT p.id, p.sections, l.name, l.birth, l.hour, l.calendar, l.region, l.gender
       FROM pdfs p JOIN leads l ON l.id = p.lead_id
       WHERE p.id = $1 AND p.teacher_id = $2`,
      [req.params.pdfId, req.user.id]
    );
    const pdf = rows[0];
    if (!pdf) return res.status(404).json({ error: '리포트를 찾을 수 없습니다.' });

    const client = {
      name: pdf.name,
      birthDate: normalizeBirth(pdf.birth),
      birthTime: parseHour(pdf.hour),
      calendar: pdf.calendar,
      region: pdf.region,
      gender: pdf.gender,
    };

    const saju = calcSaju({
      birthDate: client.birthDate,
      birthTime: client.birthTime,
      calendar: pdf.calendar === '윤달' ? '음력' : (pdf.calendar || '양력'),
      isLeapMonth: pdf.calendar === '윤달',
      region: pdf.region || '서울특별시',
      gender: pdf.gender,
    });

    // 지금까지의 대화 (문맥 유지)
    const hist = await pool.query(
      'SELECT question, answer FROM chat_qa WHERE pdf_id = $1 ORDER BY created_at ASC',
      [pdf.id]
    );

    const answer = await answerFollowUp({
      client,
      saju,
      sections: pdf.sections,
      history: hist.rows,
      question,
      openaiKey: req.user.openai_key,
    });

    const ins = await pool.query(
      'INSERT INTO chat_qa (pdf_id, teacher_id, question, answer) VALUES ($1,$2,$3,$4) RETURNING id, created_at',
      [pdf.id, req.user.id, question, answer]
    );

    res.json({ ok: true, id: ins.rows[0].id, answer, created_at: ins.rows[0].created_at });
  } catch (e) {
    console.error('[CHAT] 답변 실패:', e.message);
    res.status(500).json({ error: e.message || '답변 생성에 실패했습니다.' });
  }
});

/* ===== 문답 삭제 ===== */
router.post('/api/chat/:pdfId/delete/:qaId', async (req, res) => {
  try {
    await pool.query('DELETE FROM chat_qa WHERE id = $1 AND teacher_id = $2',
      [req.params.qaId, req.user.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
