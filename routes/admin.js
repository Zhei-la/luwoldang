const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { requireAuth, requireApproved, requireAdmin } = require('../middleware/auth');
const coverStore = require('../services/coverStore');

const COVER_TYPES = ['종합사주', '신년운세', '연애운', '결혼운', '재물운', '건강운', '연인궁합', '무료사주'];

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

/* ══════════════ 기본 표지 관리 (전 교육생 공용) ══════════════ */

router.get('/covers', async (req, res, next) => {
  try {
    const presets = await coverStore.listPresets();
    const customSets = await coverStore.listCustomSets();
    res.render('dash/admin-covers', {
      user: req.user, active: 'admin-covers', types: COVER_TYPES, presets, customSets,
    });
  } catch (e) { next(e); }
});

router.post('/covers/add', async (req, res) => {
  try {
    const { type, name, img, style, brandTop } = req.body || {};
    if (COVER_TYPES.indexOf(type) < 0) return res.status(400).json({ ok: false, error: '알 수 없는 리포트 종류입니다.' });
    await coverStore.addPreset({
      type, name, img,
      style: style || 'circle',
      brandTop: brandTop != null ? Number(brandTop) : 18.2,
    });
    console.log('[ADMIN] 기본 표지 추가:', type);
    res.json({ ok: true });
  } catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/covers/delete/:id', async (req, res) => {
  try { await coverStore.deletePreset(req.params.id); res.json({ ok: true }); }
  catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/covers/img/:id', async (req, res) => {
  try {
    const row = await coverStore.getPresetImg(req.params.id);
    if (!row) return res.status(404).end();
    const m = /^data:(image\/[a-z.+-]+);base64,(.*)$/i.exec(row.img);
    if (!m) return res.status(415).end();
    res.set('Content-Type', m[1]);
    res.send(Buffer.from(m[2], 'base64'));
  } catch (e) { res.status(500).end(); }
});

/* ══════════════ 커스텀 표지 세트 ══════════════ */

// 새 세트 만들기
router.post('/covers/set/create', async (req, res) => {
  try {
    const { key, name } = req.body || {};
    await coverStore.addCustomSet(key, name);
    res.json({ ok: true });
  } catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

// 세트에 표지 추가/교체
router.post('/covers/set/add-item', async (req, res) => {
  try {
    const { setKey, type, img, style } = req.body || {};
    if (COVER_TYPES.indexOf(type) < 0) return res.status(400).json({ ok: false, error: '알 수 없는 종류입니다.' });
    await coverStore.addSetItem(setKey, { type, img, style: style || 'plain' });
    res.json({ ok: true });
  } catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

// 세트 삭제
router.post('/covers/set/delete/:key', async (req, res) => {
  try {
    await coverStore.deleteCustomSet(req.params.key);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;