/* ============================================================
 * routes/board.js — 공지사항 · 문의하기
 *
 * 공지 : 관리자가 올리면 교육생 홈에 정한 기간 동안 팝업으로 뜬다.
 * 문의 : 교육생이 남기면 관리자에게 알림이 가고,
 *        답변을 달면 남긴 사람에게 알림이 간다.
 *        내가 쓴 것만 보이고 남의 글은 보이지 않는다.
 * ============================================================ */

const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { requireAuth, requireApproved, requireAdmin } = require('../middleware/auth');
const gh = require('../services/guideHtml');
const { notify } = require('../services/push');

const MAX_IMG = 3 * 1024 * 1024;

/* 글자만 남기고 줄바꿈은 살린다 (문의는 서식 없이 글만 받는다) */
function plain(t) {
  return String(t == null ? '' : t)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\r\n?/g, '\n');
}

/* 공지 분류 목록 (글 개수까지) */
async function noticeCats() {
  try {
    const { rows } = await pool.query(`
    SELECT c.id, c.name, c.sort,
           (SELECT COUNT(*)::int FROM notices n
             WHERE n.cat_id = c.id AND n.published) AS n
        FROM notice_cats c
       ORDER BY c.sort, c.id
    `);
    return rows;
  } catch (e) { return []; }
}

/* ══════════════════════════════════
   공지사항
   ══════════════════════════════════ */

/* 목록 */
router.get('/notice', requireAuth, requireApproved, async (req, res, next) => {
  try {
    const catId = req.query.cat ? Number(req.query.cat) : null;
    const args = [];
    let where = 'n.published';
    if (catId) { args.push(catId); where += ` AND n.cat_id = $${args.length}`; }

    let posts = [], catList = [];
    try {
      const { rows } = await pool.query(`
        SELECT n.id, n.title, n.views, n.created_at, n.popup, n.popup_days, c.name AS cat_name
          FROM notices n
          LEFT JOIN notice_cats c ON c.id = n.cat_id
         WHERE ${where}
         ORDER BY n.created_at DESC
         LIMIT 100
      `, args);
      posts = rows;
      catList = await noticeCats();
    } catch (dbErr) {
      console.error('[공지] 불러오기 실패:', dbErr.message);
    }
    res.render('dash/notice', { user: req.user, active: 'notice', posts, catList, catId });
  } catch (e) { next(e); }
});

/* 보기 */
router.get('/notice/:id(\\d+)', requireAuth, requireApproved, async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT n.*, c.name AS cat_name FROM notices n
        LEFT JOIN notice_cats c ON c.id = n.cat_id
       WHERE n.id = $1`, [req.params.id]);
    const post = rows[0];
    if (!post || (!post.published && req.user.role !== 'admin')) return res.status(404).send('없는 공지입니다.');
    if (req.user.role !== 'admin') {
      pool.query('UPDATE notices SET views = views + 1 WHERE id = $1', [post.id]).catch(() => {});
    }
    res.render('dash/notice-view', {
      user: req.user, active: 'notice', post, bodyHtml: gh.sanitize(post.body),
    });
  } catch (e) { next(e); }
});

/* 공지 사진 */
router.get('/notice/img/:id(\\d+)', requireAuth, requireApproved, async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT img FROM notice_images WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).end();
    const m = /^data:(image\/[a-zA-Z+]+);base64,(.+)$/.exec(rows[0].img);
    if (!m) return res.status(404).end();
    res.set('Content-Type', m[1]);
    res.set('Cache-Control', 'private, max-age=86400');
    res.send(Buffer.from(m[2], 'base64'));
  } catch (e) { next(e); }
});

/* 홈에 띄울 공지가 있는지 — 기간이 지나지 않은 것 중 가장 최근 하나 */
router.get('/api/notice/popup', requireAuth, requireApproved, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT id, title, created_at
        FROM notices
       WHERE published AND popup
         AND created_at > NOW() - (popup_days || ' days')::interval
       ORDER BY created_at DESC
       LIMIT 1
    `);
    res.json({ ok: true, notice: rows[0] || null });
  } catch (e) {
    res.json({ ok: true, notice: null });
  }
});

/* ── 관리자 ── */
router.get('/admin/notice', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    let posts = [];
    try {
      const { rows } = await pool.query(`
        SELECT n.id, n.title, n.published, n.popup, n.popup_days, n.views, n.created_at,
               c.name AS cat_name
          FROM notices n
          LEFT JOIN notice_cats c ON c.id = n.cat_id
         ORDER BY n.created_at DESC
      `);
      posts = rows;
    } catch (dbErr) {
      console.error('[공지 관리] 불러오기 실패:', dbErr.message);
    }
    res.render('dash/admin-notice', {
      user: req.user, active: 'admin-notice', posts, catList: await noticeCats(),
    });
  } catch (e) { next(e); }
});

router.get('/admin/notice/edit/:id?', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    let post = { id: null, title: '', body: '', popup: true, popup_days: 7, published: true };
    if (req.params.id) {
      const { rows } = await pool.query('SELECT * FROM notices WHERE id = $1', [req.params.id]);
      if (!rows[0]) return res.redirect('/admin/notice');
      post = rows[0];
    }
    res.render('dash/admin-notice-edit', {
      user: req.user, active: 'admin-notice', post,
      editHtml: gh.sanitize(post.body || ''), catList: await noticeCats(),
    });
  } catch (e) { next(e); }
});

router.post('/admin/notice/save', requireAuth, requireAdmin, async (req, res) => {
  try {
    const b = req.body || {};
    const title = String(b.title || '').trim();
    if (!title) return res.status(400).json({ ok: false, error: '제목을 적어주세요.' });

    const body = gh.sanitize(String(b.body || ''));
    const popup = b.popup !== false && b.popup !== 'false';
    const days = Math.min(Math.max(Number(b.popup_days) || 7, 1), 60);
    const published = b.published !== false && b.published !== 'false';

    const catId = b.cat_id ? Number(b.cat_id) : null;
    let id = b.id ? Number(b.id) : null;
    const isNew = !id;
    if (id) {
      await pool.query(
        `UPDATE notices SET title=$2, body=$3, popup=$4, popup_days=$5, published=$6,
                            cat_id=$7, updated_at=NOW()
          WHERE id=$1`,
        [id, title, body, popup, days, published, catId]
      );
    } else {
      const { rows } = await pool.query(
        `INSERT INTO notices (title, body, popup, popup_days, published, cat_id)
         VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
        [title, body, popup, days, published, catId]
      );
      id = rows[0].id;
    }

    /* 새 공지는 교육생 모두에게 알린다 */
    if (isNew && published) {
      pool.query("SELECT id FROM users WHERE status='approved' AND role<>'admin'")
        .then(({ rows }) => {
          rows.forEach((u) => {
            notify(u.id, {
              title: '새 공지사항',
              body: title,
              url: '/notice/' + id,
              tag: 'notice-' + id,
            }).catch(() => {});
          });
        }).catch(() => {});
    }
    res.json({ ok: true, id });
  } catch (e) {
    console.error('[공지] 저장 실패:', e.message);
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.post('/admin/notice/img', requireAuth, requireAdmin, async (req, res) => {
  try {
    const img = String((req.body || {}).img || '');
    if (!/^data:image\//.test(img)) return res.status(400).json({ ok: false, error: '이미지 파일만 올릴 수 있습니다.' });
    if (img.length > MAX_IMG * 1.4) return res.status(400).json({ ok: false, error: '사진이 너무 큽니다. 3MB 이하로 올려주세요.' });
    const { rows } = await pool.query(
      'INSERT INTO notice_images (notice_id, img) VALUES ($1,$2) RETURNING id',
      [req.body.notice_id ? Number(req.body.notice_id) : null, img]
    );
    res.json({ ok: true, url: '/notice/img/' + rows[0].id });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.post('/admin/notice/delete', requireAuth, requireAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM notices WHERE id = $1', [Number(req.body.id)]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

/* ── 공지 분류 관리 ── */
router.post('/admin/notice/cat', requireAuth, requireAdmin, async (req, res) => {
  try {
    const b = req.body || {};
    if (b.act === 'add') {
      const name = String(b.name || '').trim();
      if (!name) return res.status(400).json({ ok: false, error: '이름을 적어주세요.' });
      const { rows } = await pool.query('SELECT COALESCE(MAX(sort),0)+10 AS s FROM notice_cats');
      await pool.query('INSERT INTO notice_cats (name, sort) VALUES ($1,$2)', [name, rows[0].s]);
    } else if (b.act === 'rename') {
      await pool.query('UPDATE notice_cats SET name=$2 WHERE id=$1',
        [Number(b.id), String(b.name || '').trim()]);
    } else if (b.act === 'move') {
      /* 옆 분류와 순서를 맞바꾼다 */
      const dir = b.dir === 'up' ? 'DESC' : 'ASC';
      const cmp = b.dir === 'up' ? '<' : '>';
      const cur = await pool.query('SELECT id, sort FROM notice_cats WHERE id=$1', [Number(b.id)]);
      if (!cur.rows[0]) return res.json({ ok: true, cats: await noticeCats() });
      const nb = await pool.query(
        `SELECT id, sort FROM notice_cats WHERE sort ${cmp} $1 ORDER BY sort ${dir} LIMIT 1`,
        [cur.rows[0].sort]
      );
      if (nb.rows[0]) {
        await pool.query('UPDATE notice_cats SET sort=$2 WHERE id=$1', [cur.rows[0].id, nb.rows[0].sort]);
        await pool.query('UPDATE notice_cats SET sort=$2 WHERE id=$1', [nb.rows[0].id, cur.rows[0].sort]);
      }
    } else if (b.act === 'del') {
      /* 분류만 지우고 공지는 남긴다 */
      await pool.query('DELETE FROM notice_cats WHERE id=$1', [Number(b.id)]);
    }
    res.json({ ok: true, cats: await noticeCats() });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

/* ══════════════════════════════════
   문의하기
   ══════════════════════════════════ */

const KINDS = ['기능 요청', '오류 신고', '사용 문의', '기타'];

/* 교육생 — 내가 남긴 것만 */
router.get('/support', requireAuth, requireApproved, async (req, res, next) => {
  try {
    let items = [];
    try {
      const { rows } = await pool.query(`
        SELECT id, kind, title, body, answer, answered_at, created_at
          FROM inquiries
         WHERE teacher_id = $1
         ORDER BY created_at DESC
      `, [req.user.id]);
      items = rows;
    } catch (dbErr) {
      console.error('[문의하기] 불러오기 실패:', dbErr.message);
    }
    res.render('dash/support', { user: req.user, active: 'support', items, kinds: KINDS });
  } catch (e) { next(e); }
});

router.post('/support/write', requireAuth, requireApproved, async (req, res) => {
  try {
    const b = req.body || {};
    const title = String(b.title || '').trim();
    const body = plain(b.body).trim();
    if (!title) return res.status(400).json({ ok: false, error: '제목을 적어주세요.' });
    if (!body) return res.status(400).json({ ok: false, error: '내용을 적어주세요.' });

    const kind = KINDS.indexOf(String(b.kind)) > -1 ? String(b.kind) : '기타';
    const { rows } = await pool.query(
      `INSERT INTO inquiries (teacher_id, kind, title, body) VALUES ($1,$2,$3,$4) RETURNING id`,
      [req.user.id, kind, title, body]
    );

    /* 관리자에게 알린다 */
    pool.query("SELECT id FROM users WHERE role='admin'")
      .then(({ rows: admins }) => {
        admins.forEach((a) => {
          notify(a.id, {
            title: '새 문의가 도착했어요',
            body: `${req.user.name || '교육생'} · ${kind} · ${title}`,
            url: '/admin/support',
            tag: 'inq-' + rows[0].id,
          }).catch(() => {});
        });
      }).catch(() => {});

    res.json({ ok: true, id: rows[0].id });
  } catch (e) {
    console.error('[문의] 저장 실패:', e.message);
    res.status(500).json({ ok: false, error: e.message });
  }
});

/* 교육생이 자기 글을 지운다 */
router.post('/support/delete', requireAuth, requireApproved, async (req, res) => {
  try {
    await pool.query('DELETE FROM inquiries WHERE id = $1 AND teacher_id = $2',
      [Number(req.body.id), req.user.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

/* 관리자 — 전부 보기 */
router.get('/admin/support', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const only = req.query.only === 'open' ? 'AND i.answered_at IS NULL' : '';
    let items = [];
    let count = { open: 0, all_n: 0 };
    let dbError = null;
    try {
      const { rows } = await pool.query(`
        SELECT i.*, u.name AS who, u.account_email AS email
          FROM inquiries i
          JOIN users u ON u.id = i.teacher_id
         WHERE TRUE ${only}
         ORDER BY (i.answered_at IS NULL) DESC, i.created_at DESC
      `);
      items = rows;
      const { rows: cnt } = await pool.query(
        'SELECT COUNT(*) FILTER (WHERE answered_at IS NULL)::int AS open, COUNT(*)::int AS all_n FROM inquiries'
      );
      count = cnt[0];
    } catch (dbErr) {
      /* 표가 아직 없을 수 있다. 화면은 뜨되, 무엇이 잘못됐는지는 알려준다.
         조용히 넘기면 '문의가 없는 것'과 구분이 안 된다. */
      console.error('[문의 관리] 불러오기 실패:', dbErr.message);
      dbError = dbErr.message;
    }
    res.render('dash/admin-support', {
      user: req.user, active: 'admin-support',
      items, count, only: req.query.only || '', dbError,
    });
  } catch (e) { next(e); }
});

router.post('/admin/support/answer', requireAuth, requireAdmin, async (req, res) => {
  try {
    const id = Number(req.body.id);
    const answer = plain(req.body.answer).trim();
    if (!answer) return res.status(400).json({ ok: false, error: '답변을 적어주세요.' });

    const { rows } = await pool.query(
      `UPDATE inquiries SET answer=$2, answered_at=NOW() WHERE id=$1
       RETURNING teacher_id, title`, [id, answer]
    );
    if (!rows[0]) return res.status(404).json({ ok: false, error: '없는 문의입니다.' });

    /* 문의한 사람에게 알린다 */
    notify(rows[0].teacher_id, {
      title: '문의에 답변이 달렸어요',
      body: rows[0].title,
      url: '/support',
      tag: 'inq-answer-' + id,
    }).catch(() => {});

    res.json({ ok: true });
  } catch (e) {
    console.error('[문의] 답변 실패:', e.message);
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.post('/admin/support/delete', requireAuth, requireAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM inquiries WHERE id = $1', [Number(req.body.id)]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

module.exports = router;
