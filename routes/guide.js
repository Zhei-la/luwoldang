/* ============================================================
 * routes/guide.js — 사주 자료집
 *
 * 관리자가 글과 사진을 올리면 로그인한 교육생이 읽는다.
 * 노션 공유 링크와 달리 계정으로 막혀 있어서,
 * 수강이 끝난 사람은 계정만 막으면 접근이 끊긴다.
 *
 * 사진은 파일이 아니라 DB(guide_images)에 담는다.
 * Railway 는 배포할 때마다 파일이 지워지기 때문이다.
 * ============================================================ */

const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { requireAuth, requireApproved, requireAdmin } = require('../middleware/auth');
const { render } = require('../services/guideMd');          // 예전 글(마크다운)용
const gh = require('../services/guideHtml');                  // 새 글(블로그 방식)용

const MAX_IMG = 3 * 1024 * 1024;   // 사진 한 장 3MB

/* 분류 목록 (글 개수까지 함께) */
async function cats() {
  const { rows } = await pool.query(`
    SELECT c.id, c.name, c.sort,
           (SELECT COUNT(*)::int FROM guide_posts p
             WHERE p.cat_id = c.id AND p.published) AS n
      FROM guide_cats c
     ORDER BY c.sort, c.id
  `);
  return rows;
}

/* ══════════════════════════════════════
   교육생 화면
   ══════════════════════════════════════ */

/* 목록 */
router.get('/guide', requireAuth, requireApproved, async (req, res, next) => {
  try {
    const catId = req.query.cat ? Number(req.query.cat) : null;
    const q = String(req.query.q || '').trim();

    const where = ['p.published'];
    const args = [];
    if (catId) { args.push(catId); where.push(`p.cat_id = $${args.length}`); }
    if (q) {
      args.push('%' + q + '%');
      where.push(`(p.title ILIKE $${args.length} OR p.body ILIKE $${args.length})`);
    }

    const { rows } = await pool.query(`
      SELECT p.id, p.title, p.pinned, p.views, p.created_at, c.name AS cat_name,
             LEFT(p.body, 600) AS preview, p.format
        FROM guide_posts p
        LEFT JOIN guide_cats c ON c.id = p.cat_id
       WHERE ${where.join(' AND ')}
       ORDER BY p.pinned DESC, p.created_at DESC
       LIMIT 200
    `, args);

    /* 목록에 보여줄 한 줄 요약 — 태그와 서식 기호를 걷어낸다 */
    const posts = rows.map((p) => ({
      ...p,
      preview: p.format === 'md'
        ? String(p.preview || '').replace(/[#*>`\-]|!\[[^\]]*\]\([^)]*\)/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160)
        : gh.toText(p.preview),
    }));

    res.render('dash/guide', {
      user: req.user, active: 'guide',
      posts, catList: await cats(), catId, q,
    });
  } catch (e) { next(e); }
});

/* 글 보기 */
router.get('/guide/:id(\\d+)', requireAuth, requireApproved, async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT p.*, c.name AS cat_name
        FROM guide_posts p
        LEFT JOIN guide_cats c ON c.id = p.cat_id
       WHERE p.id = $1
    `, [req.params.id]);
    const post = rows[0];
    if (!post || (!post.published && req.user.role !== 'admin')) {
      return res.status(404).send('없는 글입니다.');
    }
    /* 조회수와 열람 기록은 관리자가 볼 때는 남기지 않는다 */
    if (req.user.role !== 'admin') {
      pool.query('UPDATE guide_posts SET views = views + 1 WHERE id = $1', [post.id]).catch(() => {});
      pool.query('INSERT INTO guide_views (post_id, teacher_id) VALUES ($1,$2)',
        [post.id, req.user.id]).catch(() => {});
    }

    /* 화면에 남길 문구 — 캡처가 돌아다니면 누구 계정에서 나갔는지 알 수 있다.
       관리자에게도 보여준다. 그래야 실제로 어떻게 찍히는지 확인할 수 있다. */
    const who = req.user.name || '교육생';
    const day = new Date().toLocaleDateString('ko-KR');
    const mark = ['루월당', who, String(req.user.email || '').split('@')[0], day]
      .filter(Boolean).join(' · ');
    /* 좁은 화면에서는 짧게 — 길면 글 위로 넘어온다 */
    const markShort = '루월당 · ' + who;
    res.render('dash/guide-view', {
      user: req.user, active: 'guide', post,
      bodyHtml: post.format === 'md' ? render(post.body) : gh.sanitize(post.body),
      mark,
      markShort,
      lock: req.user.role !== 'admin',   // 관리자는 자기 글이라 막지 않는다
    });
  } catch (e) { next(e); }
});

/* 사진 내려주기 — 로그인한 사람만 볼 수 있다 */
router.get('/guide/img/:id(\\d+)', requireAuth, requireApproved, async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT img FROM guide_images WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).end();
    const m = /^data:(image\/[a-zA-Z+]+);base64,(.+)$/.exec(rows[0].img);
    if (!m) return res.status(404).end();
    res.set('Content-Type', m[1]);
    res.set('Cache-Control', 'private, max-age=86400');
    res.send(Buffer.from(m[2], 'base64'));
  } catch (e) { next(e); }
});

/* ══════════════════════════════════════
   관리자 화면
   ══════════════════════════════════════ */

/* 관리 목록 */
router.get('/admin/guide', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT p.id, p.title, p.pinned, p.published, p.views, p.created_at, c.name AS cat_name
        FROM guide_posts p
        LEFT JOIN guide_cats c ON c.id = p.cat_id
       ORDER BY p.pinned DESC, p.created_at DESC
    `);
    res.render('dash/admin-guide', {
      user: req.user, active: 'admin-guide',
      posts: rows, catList: await cats(),
    });
  } catch (e) { next(e); }
});

/* 글쓰기 · 고치기 화면 */
router.get('/admin/guide/edit/:id?', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    let post = { id: null, cat_id: null, title: '', body: '', pinned: false, published: true };
    if (req.params.id) {
      const { rows } = await pool.query('SELECT * FROM guide_posts WHERE id = $1', [req.params.id]);
      if (!rows[0]) return res.redirect('/admin/guide');
      post = rows[0];
    }
    /* 예전 마크다운 글을 열면 보이는 그대로 고칠 수 있게 HTML 로 바꿔 보여준다 */
    const editHtml = post.format === 'md' ? render(post.body) : gh.sanitize(post.body);
    res.render('dash/admin-guide-edit', {
      user: req.user, active: 'admin-guide', post, editHtml, catList: await cats(),
    });
  } catch (e) { next(e); }
});

/* 저장 */
router.post('/admin/guide/save', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const b = req.body || {};
    const title = String(b.title || '').trim();
    if (!title) return res.status(400).json({ ok: false, error: '제목을 적어주세요.' });

    const catId = b.cat_id ? Number(b.cat_id) : null;
    const body = gh.sanitize(String(b.body || ''));
    const pinned = !!b.pinned;
    const published = b.published !== false && b.published !== 'false';

    let id = b.id ? Number(b.id) : null;
    if (id) {
      await pool.query(
        `UPDATE guide_posts SET cat_id=$2, title=$3, body=$4, pinned=$5, published=$6,
                                format='html', updated_at=NOW()
          WHERE id=$1`,
        [id, catId, title, body, pinned, published]
      );
    } else {
      const { rows } = await pool.query(
        `INSERT INTO guide_posts (cat_id, title, body, pinned, published, format)
         VALUES ($1,$2,$3,$4,$5,'html') RETURNING id`,
        [catId, title, body, pinned, published]
      );
      id = rows[0].id;
    }
    res.json({ ok: true, id });
  } catch (e) {
    console.error('[자료집] 저장 실패:', e.message);
    res.status(500).json({ ok: false, error: e.message });
  }
});

/* 사진 올리기 — 글 안에 끼워 넣을 주소를 돌려준다 */
router.post('/admin/guide/img', requireAuth, requireAdmin, async (req, res) => {
  try {
    const img = String((req.body || {}).img || '');
    if (!/^data:image\//.test(img)) return res.status(400).json({ ok: false, error: '이미지 파일만 올릴 수 있습니다.' });
    if (img.length > MAX_IMG * 1.4) return res.status(400).json({ ok: false, error: '사진이 너무 큽니다. 3MB 이하로 올려주세요.' });

    const postId = req.body.post_id ? Number(req.body.post_id) : null;
    const { rows } = await pool.query(
      'INSERT INTO guide_images (post_id, img) VALUES ($1,$2) RETURNING id',
      [postId, img]
    );
    res.json({ ok: true, url: '/guide/img/' + rows[0].id });
  } catch (e) {
    console.error('[자료집] 사진 실패:', e.message);
    res.status(500).json({ ok: false, error: e.message });
  }
});

/* 글 안에서 다른 자료로 연결할 때 고를 목록 */
router.get('/admin/guide/list', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT p.id, p.title, c.name AS cat_name
        FROM guide_posts p
        LEFT JOIN guide_cats c ON c.id = p.cat_id
       ORDER BY c.sort NULLS LAST, p.created_at
       LIMIT 300
    `);
    res.json({ ok: true, posts: rows });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

/* 미리보기 — 글쓰기 화면에서 실제 보이는 모습을 확인한다 */
router.post('/admin/guide/preview', requireAuth, requireAdmin, (req, res) => {
  try {
    res.json({ ok: true, html: gh.sanitize(String((req.body || {}).body || '')) });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

/* ── 주소로 된 사진을 받아와 저장한다 ──
   노션 글을 통째로 복사해 붙여넣으면 사진이 파일이 아니라 주소로만 넘어온다.
   브라우저는 다른 사이트의 사진을 직접 읽을 수 없으므로 서버가 대신 받아온다.

   ⚠️ 아무 주소나 받아오면 내부망을 들여다보는 통로가 될 수 있어,
      노션이 사진을 두는 곳으로만 제한한다. */
const IMG_HOSTS = [
  /\.amazonaws\.com$/i,          // 노션 사진 저장소
  /(^|\.)notion\.so$/i,
  /(^|\.)notion-static\.com$/i,
];

router.post('/admin/guide/img/from-url', requireAuth, requireAdmin, async (req, res) => {
  try {
    const raw = String((req.body || {}).url || '');
    let u;
    try { u = new URL(raw); } catch { return res.status(400).json({ ok: false, error: '주소가 올바르지 않습니다.' }); }
    if (u.protocol !== 'https:') return res.status(400).json({ ok: false, error: 'https 주소만 받아옵니다.' });
    if (!IMG_HOSTS.some((re) => re.test(u.hostname))) {
      return res.status(400).json({ ok: false, error: '노션 사진만 자동으로 가져올 수 있습니다.' });
    }

    /* 오래 기다리지 않게 10초로 끊는다 */
    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), 10000);
    let r;
    try {
      r = await fetch(u.href, { signal: ac.signal, redirect: 'follow' });
    } finally { clearTimeout(timer); }

    if (!r.ok) return res.status(400).json({ ok: false, error: '사진을 받아오지 못했습니다 (' + r.status + ')' });

    const type = String(r.headers.get('content-type') || '').split(';')[0].trim();
    if (!/^image\//.test(type)) return res.status(400).json({ ok: false, error: '사진이 아닙니다.' });

    const buf = Buffer.from(await r.arrayBuffer());
    if (buf.length > MAX_IMG) return res.status(400).json({ ok: false, error: '사진이 너무 큽니다 (3MB 초과).' });

    const dataUrl = 'data:' + type + ';base64,' + buf.toString('base64');
    const postId = req.body.post_id ? Number(req.body.post_id) : null;
    const { rows } = await pool.query(
      'INSERT INTO guide_images (post_id, img) VALUES ($1,$2) RETURNING id',
      [postId, dataUrl]
    );
    res.json({ ok: true, url: '/guide/img/' + rows[0].id });
  } catch (e) {
    const msg = e.name === 'AbortError' ? '사진 받아오기가 너무 오래 걸립니다.' : e.message;
    console.error('[자료집] 주소 사진 실패:', msg);
    res.status(500).json({ ok: false, error: msg });
  }
});

/* 삭제 */
router.post('/admin/guide/delete', requireAuth, requireAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM guide_posts WHERE id = $1', [Number(req.body.id)]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

/* 누가 읽었는지 — 유출 추적용 */
router.get('/admin/guide/views/:id(\\d+)', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { rows: p } = await pool.query('SELECT id, title FROM guide_posts WHERE id=$1', [req.params.id]);
    if (!p[0]) return res.redirect('/admin/guide');
    const { rows } = await pool.query(`
      SELECT u.name, u.email, COUNT(*)::int AS n, MAX(v.viewed_at) AS last_at
        FROM guide_views v
        JOIN users u ON u.id = v.teacher_id
       WHERE v.post_id = $1
       GROUP BY u.id, u.name, u.email
       ORDER BY MAX(v.viewed_at) DESC
    `, [req.params.id]);
    res.render('dash/admin-guide-views', {
      user: req.user, active: 'admin-guide', post: p[0], readers: rows,
    });
  } catch (e) { next(e); }
});

/* ── 분류 관리 ── */
router.post('/admin/guide/cat', requireAuth, requireAdmin, async (req, res) => {
  try {
    const b = req.body || {};
    if (b.act === 'add') {
      const name = String(b.name || '').trim();
      if (!name) return res.status(400).json({ ok: false, error: '이름을 적어주세요.' });
      const { rows } = await pool.query('SELECT COALESCE(MAX(sort),0)+10 AS s FROM guide_cats');
      await pool.query('INSERT INTO guide_cats (name, sort) VALUES ($1,$2)', [name, rows[0].s]);
    } else if (b.act === 'rename') {
      await pool.query('UPDATE guide_cats SET name=$2 WHERE id=$1', [Number(b.id), String(b.name || '').trim()]);
    } else if (b.act === 'move') {
      /* 위·아래로 한 칸 이동 — 옆 분류와 순서를 맞바꾼다 */
      const dir = b.dir === 'up' ? 'DESC' : 'ASC';
      const cmp = b.dir === 'up' ? '<' : '>';
      const cur = await pool.query('SELECT id, sort FROM guide_cats WHERE id=$1', [Number(b.id)]);
      if (!cur.rows[0]) return res.json({ ok: true });
      const nb = await pool.query(
        `SELECT id, sort FROM guide_cats WHERE sort ${cmp} $1 ORDER BY sort ${dir} LIMIT 1`,
        [cur.rows[0].sort]
      );
      if (nb.rows[0]) {
        await pool.query('UPDATE guide_cats SET sort=$2 WHERE id=$1', [cur.rows[0].id, nb.rows[0].sort]);
        await pool.query('UPDATE guide_cats SET sort=$2 WHERE id=$1', [nb.rows[0].id, cur.rows[0].sort]);
      }
    } else if (b.act === 'del') {
      /* 분류만 지우고 글은 남긴다 (분류 없음으로 간다) */
      await pool.query('DELETE FROM guide_cats WHERE id=$1', [Number(b.id)]);
    }
    res.json({ ok: true, cats: await cats() });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

module.exports = router;
