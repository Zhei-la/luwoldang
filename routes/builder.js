const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { requireAuth, requireApproved } = require('../middleware/auth');
const { defaultLanding } = require('../services/landing');

router.use(requireAuth, requireApproved);

// 빌더 화면
router.get('/builder', (req, res) => {
  res.render('dash/builder', {
    user: req.user,
    active: 'free',
    baseUrl: process.env.BASE_URL || '',
  });
});

// 현재 랜딩 JSON 불러오기
router.get('/api/landing', (req, res) => {
  const S = req.user.landing || defaultLanding(req.user.site_name || req.user.name);
  res.json(S);
});

// 랜딩 JSON 저장
router.post('/api/landing', async (req, res, next) => {
  try {
    const S = req.body;
    if (!S || !Array.isArray(S.blocks)) {
      return res.status(400).json({ ok: false, error: '형식이 올바르지 않습니다.' });
    }
    await pool.query('UPDATE users SET landing = $1 WHERE id = $2', [JSON.stringify(S), req.user.id]);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
