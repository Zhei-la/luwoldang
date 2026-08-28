/* ============================================================
 * routes/memo.js — 멘트 메모장 기기 간 연동
 *
 * 지금까지는 브라우저에만 담겨 있어서 PC에서 쓴 글이
 * 폰에서 안 보였다. 로그인한 사람은 서버에 담아 어디서든 같게 본다.
 *
 * 통째로 주고받는다. 글이 수백 개여도 몇십 KB라 이 편이 단순하고 안전하다.
 * ============================================================ */

const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { requireAuth, requireApproved } = require('../middleware/auth');

const MAX_BYTES = 4 * 1024 * 1024;   // 4MB — 글 수천 개까지 들어간다

/* 담긴 모양이 맞는지 본다. 이상하면 통째로 거절해 기존 것을 지키게 한다. */
function looksValid(d) {
  if (!d || typeof d !== 'object') return false;
  if (!Array.isArray(d.accs) || !Array.isArray(d.boxes) || !Array.isArray(d.posts)) return false;
  if (!d.accs.length) return false;                    // 계정이 하나도 없으면 사고다
  if (d.accs.length > 200 || d.boxes.length > 2000 || d.posts.length > 20000) return false;
  return true;
}

/* ── 내 메모 불러오기 ── */
router.get('/api/memo', requireAuth, requireApproved, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT data, updated_at FROM memo_store WHERE teacher_id = $1',
      [req.user.id]
    );
    if (!rows[0]) return res.json({ ok: true, data: null });   // 아직 올린 적 없음
    res.json({ ok: true, data: rows[0].data, updatedAt: rows[0].updated_at });
  } catch (e) {
    console.error('[메모] 불러오기 실패:', e.message);
    res.status(500).json({ ok: false, error: e.message });
  }
});

/* ── 내 메모 저장하기 ── */
router.post('/api/memo', requireAuth, requireApproved, async (req, res) => {
  try {
    const d = (req.body || {}).data;
    if (!looksValid(d)) {
      return res.status(400).json({ ok: false, error: '메모 모양이 올바르지 않습니다.' });
    }

    const text = JSON.stringify(d);
    if (Buffer.byteLength(text, 'utf8') > MAX_BYTES) {
      return res.status(400).json({ ok: false, error: '메모가 너무 많습니다. 오래된 글을 지워주세요.' });
    }

    await pool.query(
      `INSERT INTO memo_store (teacher_id, data, updated_at) VALUES ($1, $2::jsonb, NOW())
       ON CONFLICT (teacher_id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
      [req.user.id, text]
    );
    res.json({ ok: true, updatedAt: new Date() });
  } catch (e) {
    console.error('[메모] 저장 실패:', e.message);
    res.status(500).json({ ok: false, error: e.message });
  }
});

/* ── 로그인했는지만 알려준다 (메모 화면이 먼저 물어본다) ──
   로그인 안 한 사람도 답을 받아야 하므로 requireAuth 를 쓰지 않고
   세션을 직접 본다. */
router.get('/api/memo/who', async (req, res) => {
  try {
    if (!req.session || !req.session.userId) return res.json({ ok: true, login: false });
    const { rows } = await pool.query(
      'SELECT name, status FROM users WHERE id = $1', [req.session.userId]
    );
    if (!rows[0] || rows[0].status !== 'approved') return res.json({ ok: true, login: false });
    res.json({ ok: true, login: true, name: rows[0].name });
  } catch (e) {
    res.json({ ok: true, login: false });
  }
});

module.exports = router;
