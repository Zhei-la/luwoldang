const express = require('express');
const router = express.Router();
const { requireAuth, requireApproved, requireAdmin } = require('../middleware/auth');

// 모든 대시보드 페이지는 로그인 + 승인 필요
router.use(requireAuth, requireApproved);

// 홈
router.get('/home', (req, res) => {
  res.render('dash/home', { user: req.user, active: 'home' });
});

// 각 메뉴 (아직 껍데기 — 단계별로 알맹이 채움)
router.get('/free-saju-settings', (req, res) => {
  res.render('dash/placeholder', { user: req.user, active: 'free', title: '무료사주 웹사이트 설정', step: '3단계' });
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

// 관리자 전용
router.get('/admin/approvals', requireAdmin, (req, res) => {
  res.render('dash/placeholder', { user: req.user, active: 'admin', title: '회원 승인 · 관리', step: '9단계' });
});

module.exports = router;
