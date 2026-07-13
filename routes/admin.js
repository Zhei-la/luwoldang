const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { requireAuth, requireApproved, requireAdmin } = require('../middleware/auth');

// 관리자 전용
router.use(requireAuth, requireApproved, requireAdmin);

// 회원 승인 · 관리 페이지
router.get('/approvals', async (req, res, next) => {
  try {
    const pending = await pool.query(
      "SELECT * FROM users WHERE status = 'pending' ORDER BY created_at DESC"
    );
    const approved = await pool.query(
      "SELECT * FROM users WHERE status = 'approved' ORDER BY approved_at DESC NULLS LAST, created_at DESC"
    );
    const rejected = await pool.query(
      "SELECT * FROM users WHERE status = 'rejected' ORDER BY created_at DESC"
    );
    res.render('dash/admin-approvals', {
      user: req.user,
      active: 'admin',
      pending: pending.rows,
      approved: approved.rows,
      rejected: rejected.rows,
    });
  } catch (e) {
    next(e);
  }
});

// 본인 계정은 변경 못 하게 (관리자가 스스로 잠그는 사고 방지)
function guardSelf(req, res) {
  if (String(req.params.id) === String(req.user.id)) {
    res.redirect('/admin/approvals');
    return true;
  }
  return false;
}

// 승인
router.post('/approve/:id', async (req, res, next) => {
  if (guardSelf(req, res)) return;
  try {
    await pool.query(
      "UPDATE users SET status = 'approved', approved_at = NOW() WHERE id = $1",
      [req.params.id]
    );
    res.redirect('/admin/approvals');
  } catch (e) {
    next(e);
  }
});

// 거절
router.post('/reject/:id', async (req, res, next) => {
  if (guardSelf(req, res)) return;
  try {
    await pool.query("UPDATE users SET status = 'rejected' WHERE id = $1", [req.params.id]);
    res.redirect('/admin/approvals');
  } catch (e) {
    next(e);
  }
});

// 승인 해제 (다시 대기 상태로)
router.post('/revoke/:id', async (req, res, next) => {
  if (guardSelf(req, res)) return;
  try {
    await pool.query(
      "UPDATE users SET status = 'pending', approved_at = NULL WHERE id = $1",
      [req.params.id]
    );
    res.redirect('/admin/approvals');
  } catch (e) {
    next(e);
  }
});

/* ===== 역할 변경 (관리자 ↔ 교육생) ===== */
router.post('/role/:id', async (req, res, next) => {
  if (guardSelf(req, res)) return;   // 내 권한은 스스로 못 내림
  try {
    const role = req.body.role === 'admin' ? 'admin' : 'trainee';

    // 마지막 관리자를 내리는 건 막는다 (아무도 못 들어가는 사고 방지)
    if (role === 'trainee') {
      const c = await pool.query("SELECT COUNT(*)::int AS c FROM users WHERE role = 'admin'");
      if (c.rows[0].c <= 1) return res.redirect('/admin/approvals');
    }

    await pool.query('UPDATE users SET role = $1 WHERE id = $2', [role, req.params.id]);
    console.log('[ADMIN] 역할 변경:', req.params.id, '→', role);
    res.redirect('/admin/approvals');
  } catch (e) {
    next(e);
  }
});

module.exports = router;
