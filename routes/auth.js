const express = require('express');
const crypto = require('crypto');
const { pool } = require('../db');

const router = express.Router();

const KAKAO_AUTH = 'https://kauth.kakao.com/oauth/authorize';
const KAKAO_TOKEN = 'https://kauth.kakao.com/oauth/token';
const KAKAO_ME = 'https://kapi.kakao.com/v2/user/me';

function redirectUri() {
  return `${process.env.BASE_URL}/auth/kakao/callback`;
}

// 1) 카카오 로그인 시작
router.get('/kakao', (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.KAKAO_REST_KEY,
    redirect_uri: redirectUri(),
    response_type: 'code',
  });
  res.redirect(`${KAKAO_AUTH}?${params.toString()}`);
});

// 2) 콜백: 토큰 교환 → 프로필 → 유저 생성/조회 → 세션
router.get('/kakao/callback', async (req, res, next) => {
  const { code, error } = req.query;
  if (error || !code) return res.status(400).send('카카오 로그인이 취소되었거나 오류가 발생했습니다.');

  try {
    // 토큰 교환
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.KAKAO_REST_KEY,
      redirect_uri: redirectUri(),
      code,
    });
    if (process.env.KAKAO_CLIENT_SECRET) {
      body.append('client_secret', process.env.KAKAO_CLIENT_SECRET);
    }

    const tokenRes = await fetch(KAKAO_TOKEN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      body,
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      console.error('[KAKAO] 토큰 발급 실패:', tokenData);
      return res.status(400).send('카카오 토큰 발급에 실패했습니다. Redirect URI / REST 키를 확인하세요.');
    }

    // 사용자 정보
    const meRes = await fetch(KAKAO_ME, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const me = await meRes.json();
    const kakaoId = String(me.id);
    const nickname = me.kakao_account?.profile?.nickname || me.properties?.nickname || '이름없음';
    const email = me.kakao_account?.email || null;

    // 조회 or 생성
    const found = await pool.query('SELECT * FROM users WHERE kakao_id = $1', [kakaoId]);
    let user = found.rows[0];

    if (!user) {
      // 첫 가입자는 자동으로 관리자 + 승인
      const cnt = await pool.query('SELECT COUNT(*)::int AS c FROM users');
      const isFirst = cnt.rows[0].c === 0;
      const slug = crypto.randomBytes(5).toString('hex');

      const inserted = await pool.query(
        `INSERT INTO users (kakao_id, name, account_email, role, status, slug, approved_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
          kakaoId,
          nickname,
          email,
          isFirst ? 'admin' : 'trainee',
          isFirst ? 'approved' : 'pending',
          slug,
          isFirst ? new Date() : null,
        ]
      );
      user = inserted.rows[0];
    }

    req.session.userId = user.id;
    res.redirect(user.status === 'approved' ? '/home' : '/pending');
  } catch (e) {
    next(e);
  }
});

/* ===== 관리자 승격 =====
 * 카카오로 로그인한 뒤 아래 주소를 열면 그 계정이 관리자가 된다.
 *   /auth/admin?key=<ADMIN_KEY>
 * ADMIN_KEY 는 Railway 환경변수. 비워두면 이 기능 자체가 꺼진다.
 */
router.get('/admin', async (req, res, next) => {
  const KEY = process.env.ADMIN_KEY || '';
  if (!KEY) return res.status(404).send('Not found');
  if (!req.query.key || req.query.key !== KEY) return res.status(404).send('Not found');
  if (!req.session.userId) return res.redirect('/auth/kakao');

  try {
    const { rows } = await pool.query(
      `UPDATE users
       SET role = 'admin', status = 'approved', approved_at = COALESCE(approved_at, NOW())
       WHERE id = $1
       RETURNING name, kakao_id`,
      [req.session.userId]
    );
    if (!rows[0]) return res.redirect('/');
    console.log('[ADMIN] 관리자 승격:', rows[0].name, rows[0].kakao_id);
    res.redirect('/home');
  } catch (e) {
    next(e);
  }
});

module.exports = router;
