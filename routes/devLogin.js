const express = require('express');
const crypto = require('crypto');
const { pool } = require('../db');

const router = express.Router();

// DEV_LOGIN=on 일 때만 동작. 배포 후 카카오 붙이면 이 값만 지우면 됨.
function devEnabled() {
  return process.env.DEV_LOGIN === 'on';
}

// 임시 로그인: 카카오 없이 관리자 계정으로 바로 진입
router.get('/login', async (req, res, next) => {
  if (!devEnabled()) return res.status(404).send('Not found');
  try {
    const DEV_KAKAO_ID = 'dev-admin';
    let { rows } = await pool.query('SELECT * FROM users WHERE kakao_id = $1', [DEV_KAKAO_ID]);
    let user = rows[0];

    if (!user) {
      const slug = crypto.randomBytes(5).toString('hex');
      const inserted = await pool.query(
        `INSERT INTO users (kakao_id, name, role, status, slug, approved_at)
         VALUES ($1, $2, 'admin', 'approved', $3, NOW())
         RETURNING *`,
        [DEV_KAKAO_ID, '개발자(임시)', slug]
      );
      user = inserted.rows[0];
    }

    req.session.userId = user.id;
    res.redirect('/home');
  } catch (e) {
    next(e);
  }
});

module.exports = { router, devEnabled };
