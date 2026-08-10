/* ============================================================
 * routes/threads.js — 스레드 도구
 *
 * 글을 적어두고 예약 발행까지 하는 도구다.
 * 저장은 교육생 브라우저 안에서만 이뤄지고 서버·DB는 쓰지 않는다.
 * 그래서 화면만 띄워주면 된다.
 * ============================================================ */

const express = require('express');
const router = express.Router();
const { requireAuth, requireApproved } = require('../middleware/auth');

router.get('/threads', requireAuth, requireApproved, (req, res) => {
  res.render('dash/threads', { user: req.user, active: 'threads' });
});

module.exports = router;
