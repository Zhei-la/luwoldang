const { pool } = require('../db');

// 로그인 여부 확인 + 최신 유저 정보 주입 (승인/권한 변경 즉시 반영)
async function requireAuth(req, res, next) {
  if (!req.session.userId) return res.redirect('/');
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [req.session.userId]);
    if (!rows[0]) {
      return req.session.destroy(() => res.redirect('/'));
    }
    req.user = rows[0];
    next();
  } catch (e) {
    next(e);
  }
}

// 관리자 승인 완료된 교육생만
function requireApproved(req, res, next) {
  if (req.user.status !== 'approved') return res.redirect('/pending');
  next();
}

// 관리자 전용
function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') return res.status(403).send('접근 권한이 없습니다.');
  next();
}

// 세부 권한 (can_make_pdf 등)
function requirePerm(col) {
  return (req, res, next) => {
    if (!req.user[col]) return res.status(403).send('이 기능에 대한 권한이 없습니다.');
    next();
  };
}

module.exports = { requireAuth, requireApproved, requireAdmin, requirePerm };
