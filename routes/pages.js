const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { requireAuth, requireApproved } = require('../middleware/auth');

// 모든 대시보드 페이지는 로그인 + 승인 필요
router.use(requireAuth, requireApproved);

// 홈
router.get('/home', (req, res) => {
  res.render('dash/home', { user: req.user, active: 'home' });
});

// 무료사주 웹사이트 설정 (실제 기능)
router.get('/free-saju-settings', (req, res) => {
  res.render('dash/free-settings', {
    user: req.user,
    active: 'settings',
    baseUrl: process.env.BASE_URL || '',
    hasKey: !!req.user.openai_key,
    saved: req.query.saved === '1',
  });
});

router.post('/free-saju-settings', async (req, res, next) => {
  try {
    const { site_name, kakao_consult_link, consult_message, button_text, openai_key } = req.body;

    // OpenAI 키는 새로 입력했을 때만 갱신 (빈칸이면 기존 키 유지)
    if (openai_key && openai_key.trim()) {
      await pool.query('UPDATE users SET openai_key = $1 WHERE id = $2', [openai_key.trim(), req.user.id]);
    }

    await pool.query(
      `UPDATE users
       SET site_name = $1, kakao_consult_link = $2, consult_message = $3, button_text = $4
       WHERE id = $5`,
      [site_name || null, kakao_consult_link || null, consult_message || null, button_text || null, req.user.id]
    );

    res.redirect('/free-saju-settings?saved=1');
  } catch (e) {
    next(e);
  }
});

router.get('/pdf/create', (req, res) => {
  res.render('dash/placeholder', { user: req.user, active: 'pdf', title: 'PDF 만들기', step: '4단계' });
});

router.get('/chat', (req, res) => {
  res.render('dash/placeholder', { user: req.user, active: 'chat', title: '내담자 추가질문', step: '8단계' });
});

router.get('/records', (req, res) => {
  res.render('dash/placeholder', { user: req.user, active: 'records', title: 'PDF · 이메일 발송 기록', step: '7단계' });
});

router.get('/api-settings', (req, res) => {
  res.render('dash/placeholder', { user: req.user, active: 'api', title: 'API 관리', step: '9단계' });
});

// 내 계정 (지금도 실제 정보 표시)
router.get('/account', (req, res) => {
  res.render('dash/account', { user: req.user, active: 'account', baseUrl: process.env.BASE_URL || '' });
});

module.exports = router;
