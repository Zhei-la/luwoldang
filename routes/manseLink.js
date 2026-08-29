/* ============================================================
 * routes/manseLink.js — 만세력 연동
 *
 *   POST /api/manse/lead?key=...   만세력이 신청자를 넘겨주는 곳 (로그인 없음)
 *   GET  /admin/manse              연동 주소·열쇠·수강생 목록 (관리자)
 *
 * ⚠️ 받는 주소는 로그인 없이 열려 있어야 한다.
 *    server.js 에서 leadsRouter 보다 먼저 붙여야 한다 —
 *    그 라우터의 requireAuth 가 /api/* 를 통째로 가로챈다.
 * ============================================================ */

const express = require('express');
const router = express.Router();
const { requireAuth, requireApproved, requireAdmin } = require('../middleware/auth');
const { pool } = require('../db');
const manse = require('../services/manseLink');
const { notify } = require('../services/push');

/* ── 만세력이 부르는 곳 (로그인 없음) ───────────────── */

/**
 * 실패해도 만세력 쪽 접수는 이미 끝나 있다. 그쪽은 재시도도 하지 않는다.
 * 그래서 여기서 500 을 내면 그 손님은 그냥 사라진다.
 * 받을 수 있는 것은 최대한 받고, 못 받은 것만 기록에 남긴다.
 */
router.post('/api/manse/lead', async (req, res) => {
  const key = (req.query && req.query.key) || req.get('x-manse-key') || '';
  if (!(await manse.keyOk(key))) {
    console.warn('[만세력] 열쇠가 맞지 않는 요청');
    return res.status(401).json({ ok: false, error: '열쇠가 맞지 않습니다.' });
  }

  const b = req.body || {};
  if (b.type && b.type !== 'lead') {
    /* 나중에 다른 종류가 생겨도 옛 서버가 터지지 않게 그냥 받아넘긴다 */
    return res.json({ ok: true, skipped: b.type });
  }

  try {
    const out = await manse.take(b);
    if (!out.ok) return res.status(400).json({ ok: false, error: out.why });

    if (!out.dup && out.teacher) {
      notify(out.teacher.id, {
        title: '만세력에서 신청이 들어왔어요',
        body: (b.name || '손님') + '님이 번호를 남겼습니다',
        url: '/leads/' + out.leadId,
      });
    }
    res.json({ ok: true, id: out.leadId, duplicate: !!out.dup });
  } catch (e) {
    console.error('[만세력] 신청 받기 실패:', e.message);
    res.status(500).json({ ok: false, error: '저장하지 못했습니다.' });
  }
});

/** 만세력 쪽에서 주소가 살아 있는지 확인해 볼 수 있게 */
router.get('/api/manse/ping', async (req, res) => {
  const key = (req.query && req.query.key) || req.get('x-manse-key') || '';
  if (!(await manse.keyOk(key))) return res.status(401).json({ ok: false });
  res.json({ ok: true, program: '루월당 프로그램' });
});

/* ── 관리자 화면 ──────────────────────────────────── */

const admin = [requireAuth, requireApproved, requireAdmin];

router.get('/admin/manse', ...admin, async (req, res, next) => {
  try {
    /* 프록시 뒤에 있으므로 x-forwarded-proto 를 본다 */
    const proto = req.get('x-forwarded-proto') || req.protocol || 'https';
    const [link, students, links, recent] = await Promise.all([
      manse.getKey(),
      manse.studentJson(),
      pool.query(
        `SELECT name, site_name, slug FROM users
          WHERE status = 'approved' AND slug IS NOT NULL AND slug <> ''
          ORDER BY name`
      ),
      pool.query(
        `SELECT l.id, l.name, l.phone, l.recruiter, l.created_at, u.name AS teacher
           FROM leads l LEFT JOIN users u ON u.id = l.teacher_id
          WHERE l.source = '만세력'
          ORDER BY l.created_at DESC LIMIT 20`
      ),
    ]);
    res.render('dash/admin-manse', {
      user: req.user,
      active: 'admin-manse',
      link,
      hookUrl: proto + '://' + req.get('host') + '/api/manse/lead?key=' + link.hook_key,
      students,
      studentText: JSON.stringify(students, null, 2),
      links: links.rows,
      baseUrl: require('../services/msiteTheme').baseUrl(req),
      recent: recent.rows,
    });
  } catch (e) { next(e); }
});

router.post('/admin/manse/reset', ...admin, async (req, res, next) => {
  try {
    await manse.resetKey();
    res.redirect('/admin/manse?새열쇠=1');
  } catch (e) { next(e); }
});

module.exports = router;
