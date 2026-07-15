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
 * 개발/테스트용. 카카오 없이 아이디/비번으로 로그인한다.
 *
 * 환경변수 TEST_ACCOUNTS 에 계정들을 몰아넣는다 (최대 5개):
 *   TEST_ACCOUNTS = test1:pw1 / test2:pw2 / test3:pw3
 *   - 형식: 아이디:비번   (콜론으로 구분)
 *   - 계정끼리는 "/" 로 구분
 *   - 모두 "교육생" 계정. 관리자는 카카오 로그인으로만 된다.
 *   - 각 계정은 서로 독립된 데이터(자기 신청자·리포트·표지)를 가진다
 *   - 로그인한 아이디가 그대로 화면 이름(닉네임)으로 표시된다
 *
 * (구버전 TEST_LOGIN_USER / TEST_LOGIN_PASS 도 계속 지원 — 교육생 1개로 취급)
 *
 *   /auth/test        → 로그인 폼
 *   /auth/test (POST) → 아이디·비번 확인 후 로그인
 */

// 환경변수를 파싱해서 계정 목록을 만든다. { user, pass } 배열. 전부 교육생.
function testAccounts() {
  const list = [];

  const raw = (process.env.TEST_ACCOUNTS || '').trim();
  if (raw) {
    raw.split('/').forEach((chunk) => {
      const parts = chunk.trim().split(':');
      const user = (parts[0] || '').trim();
      const pass = (parts[1] || '').trim();
      if (user && pass) list.push({ user, pass });
    });
  }

  // 구 방식도 지원 (교육생 1개)
  if (process.env.TEST_LOGIN_USER && process.env.TEST_LOGIN_PASS) {
    const u = process.env.TEST_LOGIN_USER.trim();
    if (!list.some((a) => a.user === u)) {
      list.push({ user: u, pass: process.env.TEST_LOGIN_PASS });
    }
  }

  return list.slice(0, 5);   // 최대 5개
}

function testEnabled() {
  return testAccounts().length > 0;
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
    <p>카카오 없이 들어가는 교육생 테스트 계정입니다.</p>
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
  const acc = testAccounts().find((a) => a.user === user && a.pass === pass);
  if (!acc) return res.redirect('/auth/test?e=1');

  try {
    // 계정마다 고유 kakao_id → 데이터가 서로 분리된다
    const kid = 'test:' + acc.user;

    const found = await pool.query('SELECT * FROM users WHERE kakao_id = $1', [kid]);
    let row = found.rows[0];

    if (!row) {
      // 이름(닉네임) = 로그인한 아이디 그대로. 전부 교육생(trainee).
      const slug = crypto.randomBytes(5).toString('hex');
      const inserted = await pool.query(
        `INSERT INTO users (kakao_id, name, account_email, role, status, slug, approved_at)
         VALUES ($1, $2, $3, 'trainee', 'approved', $4, NOW())
         RETURNING *`,
        [kid, acc.user, acc.user + '@test.luwolsaju.com', slug]
      );
      row = inserted.rows[0];
      console.log('[TEST] 교육생 계정 생성:', acc.user);
    } else {
      // 승인이 빠져 있으면 복구. 역할은 건드리지 않는다(교육생 유지).
      if (row.status !== 'approved') {
        await pool.query(
          "UPDATE users SET status='approved', approved_at=COALESCE(approved_at,NOW()) WHERE id=$1",
          [row.id]
        );
      }
      // 닉네임을 아이디와 맞춰둔다
      if (row.name !== acc.user) {
        await pool.query('UPDATE users SET name=$2 WHERE id=$1', [row.id, acc.user]);
      }
    }

    req.session.userId = row.id;
    req.session.testLogin = acc.user;   // 테스트 로그인 표시 (계정 전환 허용용)
    console.log('[TEST] 로그인 성공:', acc.user);
    res.redirect('/home');
  } catch (e) {
    next(e);
  }
});

/* ===== 테스트 계정 전환 (비번 없이) =====
 * 테스트 로그인 상태(session.testLogin 있음)일 때만 작동한다.
 * 카카오 관리자 계정에는 영향 없다.
 *   /auth/switch?to=아이디  → 그 계정으로 즉시 전환
 */
router.get('/switch', async (req, res, next) => {
  if (!req.session.testLogin) return res.status(404).send('Not found');

  const to = String(req.query.to || '').trim();
  const acc = testAccounts().find((a) => a.user === to);
  if (!acc) return res.redirect('/home');

  try {
    const kid = 'test:' + acc.user;
    const found = await pool.query('SELECT * FROM users WHERE kakao_id = $1', [kid]);
    let row = found.rows[0];

    // 아직 한 번도 로그인 안 한 계정이면 만들어준다
    if (!row) {
      const slug = crypto.randomBytes(5).toString('hex');
      const inserted = await pool.query(
        `INSERT INTO users (kakao_id, name, account_email, role, status, slug, approved_at)
         VALUES ($1, $2, $3, 'trainee', 'approved', $4, NOW())
         RETURNING *`,
        [kid, acc.user, acc.user + '@test.luwolsaju.com', slug]
      );
      row = inserted.rows[0];
    }

    req.session.userId = row.id;
    req.session.testLogin = acc.user;
    console.log('[TEST] 계정 전환:', acc.user);
    res.redirect('/home');
  } catch (e) {
    next(e);
  }
});

/* 현재 로그인 계정이 테스트 계정이면, 전환 가능한 계정 목록을 준다.
 * (다른 라우터/뷰에서 계정 전환 바를 그릴 때 쓴다) */
function testSwitchInfo(req) {
  if (!req || !req.session || !req.session.testLogin) return null;
  return {
    current: req.session.testLogin,
    accounts: testAccounts().map((a) => a.user),
  };
}

module.exports = router;
module.exports.testSwitchInfo = testSwitchInfo;


