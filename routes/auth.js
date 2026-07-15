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

/* ===== 테스트 로그인 (카카오 없이) =====
 * 개발/테스트용. 환경변수 TEST_LOGIN_USER + TEST_LOGIN_PASS 가
 * 둘 다 있을 때만 작동한다. 하나라도 비면 기능 자체가 꺼진다(404).
 *
 *   /auth/test        → 로그인 폼
 *   /auth/test (POST) → 아이디·비번 확인 후 관리자 계정으로 로그인
 *
 * 이 계정은 kakao_id = 'test-account' 로 고정. 관리자 권한.
 */
function testEnabled() {
  return !!(process.env.TEST_LOGIN_USER && process.env.TEST_LOGIN_PASS);
}

router.get('/test', (req, res) => {
  if (!testEnabled()) return res.status(404).send('Not found');
  res.set('Content-Type', 'text/html; charset=utf-8').send(`<!DOCTYPE html>
<html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>테스트 로그인</title>
<style>
  body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;
    background:#182234;font-family:-apple-system,'Malgun Gothic',sans-serif}
  .box{background:#fff;padding:32px 26px;border-radius:14px;width:300px;box-shadow:0 8px 30px rgba(0,0,0,.3)}
  h1{margin:0 0 4px;font-size:18px;color:#241a06}
  p{margin:0 0 20px;font-size:12.5px;color:#8a7f66}
  input{width:100%;box-sizing:border-box;padding:12px;margin-bottom:10px;border:1px solid #d8cfb8;
    border-radius:8px;font-size:15px}
  button{width:100%;padding:13px;border:0;border-radius:8px;background:#B59A62;color:#241a06;
    font-weight:800;font-size:15px;cursor:pointer}
  .err{color:#c0392b;font-size:13px;margin-bottom:10px;min-height:18px}
</style></head>
<body>
  <form class="box" method="post" action="/auth/test">
    <h1>테스트 로그인</h1>
    <p>카카오 없이 들어가는 테스트 계정입니다.</p>
    <div class="err">${req.query.e ? '아이디 또는 비밀번호가 틀렸습니다.' : ''}</div>
    <input name="user" placeholder="아이디" autocomplete="username" autofocus>
    <input name="pass" type="password" placeholder="비밀번호" autocomplete="current-password">
    <button type="submit">로그인</button>
  </form>
</body></html>`);
});

router.post('/test', async (req, res, next) => {
  if (!testEnabled()) return res.status(404).send('Not found');

  const { user, pass } = req.body || {};
  if (user !== process.env.TEST_LOGIN_USER || pass !== process.env.TEST_LOGIN_PASS) {
    return res.redirect('/auth/test?e=1');
  }

  try {
    // 테스트 계정 조회 or 생성 (관리자 권한)
    const found = await pool.query("SELECT * FROM users WHERE kakao_id = 'test-account'");
    let acc = found.rows[0];

    if (!acc) {
      const slug = crypto.randomBytes(5).toString('hex');
      const inserted = await pool.query(
        `INSERT INTO users (kakao_id, name, account_email, role, status, slug, approved_at)
         VALUES ('test-account', $1, $2, 'admin', 'approved', $3, NOW())
         RETURNING *`,
        ['테스트 계정', 'test@luwolsaju.com', slug]
      );
      acc = inserted.rows[0];
      console.log('[TEST] 테스트 계정 생성');
    } else if (acc.role !== 'admin' || acc.status !== 'approved') {
      // 혹시 권한이 빠져 있으면 복구
      await pool.query(
        "UPDATE users SET role='admin', status='approved', approved_at=COALESCE(approved_at,NOW()) WHERE id=$1",
        [acc.id]
      );
    }

    req.session.userId = acc.id;
    console.log('[TEST] 테스트 로그인 성공');
    res.redirect('/home');
  } catch (e) {
    next(e);
  }
});

module.exports = router;

