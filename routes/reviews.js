/**
 * reviews.js — 내담자 후기
 *
 *  내담자 : /r/:token 하단 → POST /r/:token/review   (로그인 없음)
 *  교육생 : /reviews                                  (내 후기만)
 *           POST /api/reviews/:id/show                (랜딩 노출 on/off)
 *           POST /api/reviews/:id/delete
 *
 * 조작 방지: 후기는 리포트를 실제로 받은 사람만 쓸 수 있다.
 *            (share_token 을 가진 사람 = 메일을 받은 본인)
 *            리포트 하나당 후기 하나.
 */
const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { requireAuth, requireApproved } = require('../middleware/auth');

const AUTH = [requireAuth, requireApproved];

/** 이름 가리기: 김가영 → 김*영 */
function maskName(n) {
  const s = String(n || '').trim();
  if (s.length <= 1) return s || '익명';
  if (s.length === 2) return s[0] + '*';
  return s[0] + '*'.repeat(s.length - 2) + s[s.length - 1];
}

/* ===== 내담자가 후기 작성 (로그인 없음) ===== */
router.post('/r/:token/review', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT p.id AS pdf_id, p.teacher_id, p.lead_id, l.name
       FROM pdfs p JOIN leads l ON l.id = p.lead_id
       WHERE p.share_token = $1`,
      [req.params.token]
    );
    const pdf = rows[0];
    if (!pdf) return res.status(404).json({ error: '잘못된 주소입니다.' });

    const rating = Math.max(1, Math.min(5, Number(req.body.rating) || 0));
    const body = String(req.body.body || '').trim();
    let photo = String(req.body.photo || '');

    if (!rating) return res.status(400).json({ error: '별점을 골라주세요.' });
    if (body.length < 5) return res.status(400).json({ error: '후기를 조금만 더 적어주세요.' });
    if (body.length > 1500) return res.status(400).json({ error: '후기가 너무 깁니다. (1500자 이내)' });
    if (photo && !photo.startsWith('data:image/')) photo = '';   // 외부 URL 주입 차단

    const saved = await pool.query(
      `INSERT INTO reviews (teacher_id, pdf_id, lead_id, name, rating, body, photo)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       ON CONFLICT (pdf_id) DO UPDATE
         SET rating = EXCLUDED.rating,
             body = EXCLUDED.body,
             photo = EXCLUDED.photo,
             created_at = NOW()
       RETURNING id`,
      [pdf.teacher_id, pdf.pdf_id, pdf.lead_id, maskName(pdf.name), rating, body, photo || null]
    );

    console.log('[후기] 접수:', maskName(pdf.name), rating + '점');
    res.json({ ok: true, id: saved.rows[0].id });
  } catch (e) {
    console.error('[후기] 저장 실패:', e.message);
    res.status(500).json({ error: '후기를 저장하지 못했습니다.' });
  }
});

/* ===== 교육생: 내 후기 목록 ===== */
router.get('/reviews', AUTH, async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT r.*, p.type
       FROM reviews r LEFT JOIN pdfs p ON p.id = r.pdf_id
       WHERE r.teacher_id = $1
       ORDER BY r.created_at DESC`,
      [req.user.id]
    );

    const stat = {
      total: rows.length,
      shown: rows.filter((x) => x.shown).length,
      avg: rows.length
        ? (rows.reduce((a, x) => a + (x.rating || 0), 0) / rows.length).toFixed(1)
        : '0.0',
    };

    res.render('dash/reviews', {
      user: req.user, active: 'reviews',
      reviews: rows, stat,
    });
  } catch (e) {
    next(e);
  }
});

/* ===== 랜딩 노출 on/off ===== */
router.post('/api/reviews/:id/show', AUTH, async (req, res) => {
  try {
    const show = !!req.body.shown;
    const { rows } = await pool.query(
      'UPDATE reviews SET shown = $1 WHERE id = $2 AND teacher_id = $3 RETURNING shown',
      [show, req.params.id, req.user.id]
    );
    if (!rows[0]) return res.status(404).json({ error: '후기를 찾을 수 없습니다.' });
    res.json({ ok: true, shown: rows[0].shown });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* ===== 삭제 ===== */
router.post('/api/reviews/:id/delete', AUTH, async (req, res) => {
  try {
    await pool.query('DELETE FROM reviews WHERE id = $1 AND teacher_id = $2',
      [req.params.id, req.user.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* ===== 랜딩 빌더에서 불러갈 목록 (노출 체크된 것만) ===== */
router.get('/api/reviews/published', AUTH, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, name, rating, body, photo, created_at
       FROM reviews
       WHERE teacher_id = $1 AND shown = TRUE
       ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json({ ok: true, reviews: rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = { router, maskName };
