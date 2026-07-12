const express = require('express');
const router = express.Router();

/**
 * ⚠️ 개발용 임시 로그인은 제거되었습니다.
 *
 * 비밀번호 없이 관리자 계정으로 들어갈 수 있어 보안상 위험했습니다.
 * 관리자 권한은 이제 카카오로 로그인한 뒤
 *   GET /auth/admin?key=<ADMIN_KEY>
 * 로 승격합니다. (routes/auth.js)
 *
 * Railway 환경변수의 DEV_LOGIN 도 삭제하세요.
 */
function devEnabled() {
  return false;
}

router.get('/login', (req, res) => res.status(404).send('Not found'));

module.exports = { router, devEnabled };
