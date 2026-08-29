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

/* ── 지금 몇 주차인지 ──
   승인일(또는 따로 정한 시작일)로부터 며칠 지났는지로 정한다.
   들어온 그날이 1주차, 7일 뒤 2주차, 14일 뒤 3주차 …
   28일이 지나면 5가 되어 전체 자료집까지 열린다. */
function weekOf(user, preview) {
  /* 관리자가 '몇 주차 교육생 눈으로' 보고 싶을 때 쓴다 */
  if (user.role === 'admin' && preview >= 1 && preview <= 5) return preview;
  if (user.role === 'admin') return 99;            // 관리자는 다 본다
  const base = user.guide_start || user.approved_at || user.created_at;
  if (!base) return 1;
  const days = Math.floor((Date.now() - new Date(base).getTime()) / 864e5);
  return Math.min(5, Math.floor(days / 7) + 1);
}

/* 아직 안 열린 자료가 며칠 뒤에 열리는지 */
function opensIn(user, week, preview) {
  /* 미리보기 중이면 그 주차 기준으로 남은 날짜를 보여준다 */
  if (preview >= 1 && preview <= 5) return Math.max(0, (week - preview) * 7);
  const base = user.guide_start || user.approved_at || user.created_at;
  if (!base || !week) return 0;
  const openAt = new Date(base).getTime() + (week - 1) * 7 * 864e5;
  return Math.max(0, Math.ceil((openAt - Date.now()) / 864e5));
}

const WEEK_LABEL = ['언제나', '1주차', '2주차', '3주차', '4주차', '총정리 (4주차 후)'];

/* 분류 목록 (글 개수까지 함께) */
/* 주차 제목 · 과제 · 진행 상황을 한 번에 읽어온다 */
async function weekBoard(user, myWeek) {
  const [wk, tasks, done, counts] = await Promise.all([
    pool.query('SELECT week, title, subtitle FROM guide_weeks ORDER BY week'),
    pool.query('SELECT week, title, published FROM guide_tasks'),
    pool.query('SELECT week FROM guide_task_done WHERE teacher_id = $1', [user.id]),
    pool.query(`SELECT COALESCE(week,0) AS week, COUNT(*)::int AS n
                  FROM guide_posts WHERE published GROUP BY COALESCE(week,0)`),
  ]);

  const tmap = {}; tasks.rows.forEach((t) => { tmap[t.week] = t; });
  const dset = new Set(done.rows.map((d) => d.week));
  const cmap = {}; counts.rows.forEach((c) => { cmap[c.week] = c.n; });

  const base = user.guide_start || user.approved_at || user.created_at;
  const openDate = (w) => (base && w > 0
    ? new Date(new Date(base).getTime() + (w - 1) * 7 * 864e5) : null);

  return wk.rows.map((w) => {
    const n = w.week;
    const unlocked = n === 0 || n <= myWeek;
    const task = tmap[n];
    /* 과제는 앞 주차 과제를 마쳐야 열린다 */
    const prevDone = n <= 1 || dset.has(n - 1);
    return {
      week: n,
      title: w.title,
      subtitle: w.subtitle,
      posts: cmap[n] || 0,
      hasTask: !!(task && task.published),
      taskTitle: task ? task.title : '',
      taskDone: dset.has(n),
      taskOpen: unlocked && prevDone,
      unlocked,
      isNow: unlocked && n === myWeek,
      opensAt: openDate(n),
      daysLeft: opensIn(user, n),
    };
  });
}

/* 분류 옆에 붙는 개수.
   총정리 화면에서만 쓰는 숫자다. 거기엔 주차별(1~4주차) 글이 안 뜨므로
   세는 것도 빼야 한다. 안 그러면 「기초 8」 인데 3개만 보인다.
   ⚠️ 설명을 SQL 안에 주석으로 넣지 말 것 — 시험에 쓰는 pg-mem 이
      주석 속 한글을 못 읽어 통째로 터진다. */
async function cats() {
  const { rows } = await pool.query(`
    SELECT c.id, c.name, c.sort, COUNT(p.id)::int AS n
      FROM guide_cats c
      LEFT JOIN guide_posts p
        ON p.cat_id = c.id
       AND p.published
       AND COALESCE(p.week,0) NOT IN (1,2,3,4)
     GROUP BY c.id, c.name, c.sort
     ORDER BY c.sort, c.id
  `);
  return rows;
}

/* ══════════════════════════════════════
   교육생 화면
   ══════════════════════════════════════ */

/* 목록 */
router.get('/guide/all', requireAuth, requireApproved, async (req, res, next) => {
  try {
    const catId = req.query.cat ? Number(req.query.cat) : null;
    const wkFilter = req.query.wk !== undefined && req.query.wk !== '' ? Number(req.query.wk) : null;
    const q = String(req.query.q || '').trim();

    /* 총정리는 분류로 찾아보는 곳이다. 주차별(1~4주차) 글은 여기 뜨지 않는다.
       그건 주차 판에서만 본다. 「언제나」(0)와 「총정리」(5)만 모은다. */
    const where = ['p.published', 'COALESCE(p.week,0) NOT IN (1,2,3,4)'];
    const args = [];
    if (catId) { args.push(catId); where.push(`p.cat_id = $${args.length}`); }
    if (q) {
      args.push('%' + q + '%');
      where.push(`(p.title ILIKE $${args.length} OR p.body ILIKE $${args.length})`);
    }

    const { rows } = await pool.query(`
      SELECT p.id, p.title, p.pinned, p.views, p.created_at, c.name AS cat_name,
             p.format, COALESCE(p.week, 0) AS week
        FROM guide_posts p
        LEFT JOIN guide_cats c ON c.id = p.cat_id
       WHERE ${where.join(' AND ')}
       ORDER BY p.pinned DESC, p.created_at DESC
       LIMIT 200
    `, args);

    /* 아직 안 열린 자료는 목록에 남기되 들어가지 못하게 표시한다.
       숨겨버리면 '자료가 없다'고 오해하기 쉽다. */
    const preview = Number(req.query.week) || 0;
    const my = weekOf(req.user, preview);
    let posts = rows.map((p) => ({
      ...p,
      locked: p.week > 0 && p.week > my,
      weekLabel: WEEK_LABEL[p.week] || '',
      daysLeft: opensIn(req.user, p.week, preview),
    }));

    if (wkFilter !== null) posts = posts.filter((p) => (p.week || 0) === wkFilter);

    /* 주차 탭에 몇 개씩 있는지 */
    const wkCount = {};
    rows.forEach((p) => { const w = p.week || 0; wkCount[w] = (wkCount[w] || 0) + 1; });

    res.render('dash/guide', {
      user: req.user, active: 'guide',
      posts, catList: await cats(), catId, q, myWeek: my, preview,
      wkFilter, wkCount,
    });
  } catch (e) { next(e); }
});

/* ── 주차 판 (자료집 첫 화면) ── */
router.get('/guide', requireAuth, requireApproved, async (req, res, next) => {
  try {
    const preview = Number(req.query.week) || 0;
    const my = weekOf(req.user, preview);
    res.render('dash/guide-weeks', {
      user: req.user, active: 'guide',
      weeks: await weekBoard(req.user, my), myWeek: my, preview,
    });
  } catch (e) { next(e); }
});

router.get('/guide/weeks', requireAuth, requireApproved, async (req, res, next) => {
  try {
    const preview = Number(req.query.week) || 0;
    const my = weekOf(req.user, preview);
    res.render('dash/guide-weeks', {
      user: req.user, active: 'guide',
      weeks: await weekBoard(req.user, my), myWeek: my, preview,
    });
  } catch (e) { next(e); }
});

/* ── 한 주차 안 (강의 자료 순서대로 + 과제) ── */
router.get('/guide/week/:n(\\d+)', requireAuth, requireApproved, async (req, res, next) => {
  try {
    const n = Number(req.params.n);
    const preview = Number(req.query.week) || 0;
    const my = weekOf(req.user, preview);
    if (n > 0 && n > my) {
      return res.status(403).render('dash/guide-locked', {
        user: req.user, active: 'guide',
        post: { title: WEEK_LABEL[n] || (n + '주차') },
        weekLabel: WEEK_LABEL[n] || '', daysLeft: opensIn(req.user, n, preview),
      });
    }

    const [posts, wk, task, done, items] = await Promise.all([
      pool.query(`SELECT p.id, p.title, p.views, p.created_at, c.name AS cat_name
                    FROM guide_posts p LEFT JOIN guide_cats c ON c.id = p.cat_id
                   WHERE p.published AND COALESCE(p.week,0) = $1
                   ORDER BY p.pinned DESC, p.created_at`, [n]),
      pool.query('SELECT * FROM guide_weeks WHERE week = $1', [n]),
      pool.query('SELECT * FROM guide_tasks WHERE week = $1', [n]),
      pool.query('SELECT week, note, done_at FROM guide_task_done WHERE teacher_id = $1', [req.user.id]),
      pool.query(`SELECT i.id, i.title, i.sort,
                         (d.item_id IS NOT NULL) AS done
                    FROM guide_task_items i
                    LEFT JOIN guide_task_item_done d
                      ON d.item_id = i.id AND d.teacher_id = $2
                   WHERE i.week = $1 AND i.published
                   ORDER BY i.sort, i.id`, [n, req.user.id]),
    ]);

    const dset = new Set(done.rows.map((d) => d.week));
    const t = task.rows[0];
    res.render('dash/guide-week', {
      user: req.user, active: 'guide', n,
      week: wk.rows[0] || { week: n, title: WEEK_LABEL[n] || '' },
      posts: posts.rows,
      task: t && t.published ? t : null,
      items: items.rows,
      taskOpen: n <= 1 || dset.has(n - 1),
      taskDone: dset.has(n),
      myDone: done.rows.find((d) => d.week === n) || null,
      preview,
    });
  } catch (e) { next(e); }
});

/* 체크리스트 하나를 켜고 끈다.
   그 주차 항목을 전부 체크하면 「주차 과제 완료」로도 기록한다.
   다음 주차 과제가 그걸 보고 열리기 때문이다. */
router.post('/guide/task/check', requireAuth, requireApproved, async (req, res) => {
  try {
    const itemId = Number(req.body.itemId);
    const on = req.body.done === true || req.body.done === 'true';
    if (!itemId) return res.status(400).json({ ok: false, error: '항목이 올바르지 않습니다.' });

    const it = await pool.query(
      'SELECT week FROM guide_task_items WHERE id = $1 AND published', [itemId]
    );
    if (!it.rowCount) return res.status(404).json({ ok: false, error: '없는 항목입니다.' });
    const week = it.rows[0].week;

    if (on) {
      await pool.query(
        `INSERT INTO guide_task_item_done (teacher_id, item_id) VALUES ($1,$2)
         ON CONFLICT (teacher_id, item_id) DO NOTHING`,
        [req.user.id, itemId]
      );
    } else {
      await pool.query(
        'DELETE FROM guide_task_item_done WHERE teacher_id = $1 AND item_id = $2',
        [req.user.id, itemId]
      );
    }

    /* 그 주차를 다 했는지 다시 센다 */
    const cnt = await pool.query(`
      SELECT COUNT(*)::int AS total,
             COUNT(d.item_id)::int AS done
        FROM guide_task_items i
        LEFT JOIN guide_task_item_done d
          ON d.item_id = i.id AND d.teacher_id = $2
       WHERE i.week = $1 AND i.published
    `, [week, req.user.id]);
    const { total, done } = cnt.rows[0];
    const allDone = total > 0 && done === total;

    if (allDone) {
      await pool.query(
        `INSERT INTO guide_task_done (teacher_id, week) VALUES ($1,$2)
         ON CONFLICT (teacher_id, week) DO NOTHING`,
        [req.user.id, week]
      );
    } else {
      /* 하나라도 풀면 완료를 거둔다. 적어둔 소감은 지우지 않는다. */
      await pool.query(
        'DELETE FROM guide_task_done WHERE teacher_id = $1 AND week = $2 AND note IS NULL',
        [req.user.id, week]
      );
    }

    res.json({ ok: true, total, done, allDone });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

/* 과제 완료 표시 */
router.post('/guide/task/done', requireAuth, requireApproved, async (req, res) => {
  try {
    const n = Number(req.body.week);
    if (!(n >= 1 && n <= 4)) return res.status(400).json({ ok: false, error: '주차가 올바르지 않습니다.' });

    /* 앞 주차를 마치지 않았으면 표시할 수 없다 */
    const { rows } = await pool.query(
      'SELECT week FROM guide_task_done WHERE teacher_id = $1', [req.user.id]
    );
    const dset = new Set(rows.map((d) => d.week));
    if (n > 1 && !dset.has(n - 1)) {
      return res.status(400).json({ ok: false, error: (n - 1) + '주차 과제를 먼저 마쳐주세요.' });
    }

    await pool.query(
      `INSERT INTO guide_task_done (teacher_id, week, note) VALUES ($1,$2,$3)
       ON CONFLICT (teacher_id, week) DO UPDATE SET note = EXCLUDED.note, done_at = NOW()`,
      [req.user.id, n, String(req.body.note || '').slice(0, 1000)]
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
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
    /* 아직 열리지 않은 주차는 볼 수 없다 */
    const preview = Number(req.query.week) || 0;
    const myWeek = weekOf(req.user, preview);
    const pw = post.week || 0;
    if (pw > 0 && pw > myWeek) {
      const d = opensIn(req.user, pw, preview);
      return res.status(403).render('dash/guide-locked', {
        user: req.user, active: 'guide', post,
        weekLabel: WEEK_LABEL[pw] || '', daysLeft: d,
      });
    }

    /* 「목록」 을 누르면 온 곳으로 돌아간다.
       주차별 글이면 그 주차 목록으로, 아니면 총정리로.
       전에는 무조건 주차 판(/guide)으로 가서 다시 찾아 들어가야 했다. */
    const backTo = (pw >= 1 && pw <= 4) ? '/guide/week/' + pw : '/guide/all';

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
      backTo,
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
      SELECT p.id, p.title, p.pinned, p.published, p.views, p.created_at, c.name AS cat_name,
             COALESCE(p.week, 0) AS week
        FROM guide_posts p
        LEFT JOIN guide_cats c ON c.id = p.cat_id
       ORDER BY p.pinned DESC, p.created_at DESC
    `);
    /* 주차별로 몇 개인지 — 관리 화면에서 한눈에 보이게 */
    const wkCount = {};
    rows.forEach((p) => { const w = p.week || 0; wkCount[w] = (wkCount[w] || 0) + 1; });

    res.render('dash/admin-guide', {
      user: req.user, active: 'admin-guide',
      posts: rows, catList: await cats(), wkCount,
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
    const week = Math.min(Math.max(Number(b.week) || 0, 0), 5);
    const body = gh.sanitize(String(b.body || ''));
    const pinned = !!b.pinned;
    const published = b.published !== false && b.published !== 'false';

    let id = b.id ? Number(b.id) : null;
    if (id) {
      await pool.query(
        `UPDATE guide_posts SET cat_id=$2, title=$3, body=$4, pinned=$5, published=$6,
                                week=$7, format='html', updated_at=NOW()
          WHERE id=$1`,
        [id, catId, title, body, pinned, published, week]
      );
    } else {
      const { rows } = await pool.query(
        `INSERT INTO guide_posts (cat_id, title, body, pinned, published, week, format)
         VALUES ($1,$2,$3,$4,$5,$6,'html') RETURNING id`,
        [catId, title, body, pinned, published, week]
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

/* ── 노션 내보내기 파일 가져오기 ──
   노션이 붙여넣기에서 사진을 'attachment:...' 라는 내부 이름표로만 주기 때문에
   붙여넣기로는 사진을 가져올 수 없다.
   대신 노션에서 내려받은 zip 을 브라우저에서 풀어 하나씩 올린다. */
router.get('/admin/guide/import', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    res.render('dash/admin-guide-import', {
      user: req.user, active: 'admin-guide', catList: await cats(),
    });
  } catch (e) { next(e); }
});

/* 노션 글(마크다운)을 자료집 화면용으로 바꿔준다 */
router.post('/admin/guide/md2html', requireAuth, requireAdmin, (req, res) => {
  try {
    res.json({ ok: true, html: gh.sanitize(render(String((req.body || {}).md || ''))) });
  } catch (e) {
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
  /\.amazonaws\.com$/i,               // 노션 사진 저장소 (서명된 주소)
  /(^|\.)notion\.so$/i,               // 노션 중계 주소
  /(^|\.)notion-static\.com$/i,
  /(^|\.)notionusercontent\.com$/i,   // 노션 새 사진 주소
  /(^|\.)notion\.site$/i,
];

router.post('/admin/guide/img/from-url', requireAuth, requireAdmin, async (req, res) => {
  try {
    const raw = String((req.body || {}).url || '');
    let u;
    try { u = new URL(raw); } catch { return res.status(400).json({ ok: false, error: '주소가 올바르지 않습니다.' }); }
    if (u.protocol !== 'https:') return res.status(400).json({ ok: false, error: 'https 주소만 받아옵니다.' });
    if (!IMG_HOSTS.some((re) => re.test(u.hostname))) {
      return res.status(400).json({ ok: false, error: '아직 모르는 사진 주소입니다: ' + u.hostname, host: u.hostname });
    }

    /* 노션 중계 주소(.../image/https%3A%2F%2F...)는 안쪽 진짜 주소를 꺼내 쓴다.
       중계 주소는 로그인이 필요해 서버에서 그대로 받으면 막히기 때문이다. */
    const inner = /\/image\/(https?%3A%2F%2F[^?]+)/i.exec(u.pathname + u.search);
    if (inner) {
      try {
        const dec = new URL(decodeURIComponent(inner[1]));
        if (IMG_HOSTS.some((re) => re.test(dec.hostname))) u = dec;
      } catch { /* 못 꺼내면 원래 주소로 시도한다 */ }
    }

    /* 오래 기다리지 않게 10초로 끊는다 */
    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), 10000);
    let r;
    try {
      r = await fetch(u.href, { signal: ac.signal, redirect: 'follow' });
    } finally { clearTimeout(timer); }

    if (!r.ok) {
      const why = r.status === 401 || r.status === 403
        ? '노션이 접근을 막았습니다 (주소 만료 또는 로그인 필요)'
        : r.status === 404 ? '사진을 찾을 수 없습니다'
        : '받아오기 실패 (' + r.status + ')';
      return res.status(400).json({ ok: false, error: why, host: u.hostname });
    }

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

/* ── 주차 제목 · 과제 관리 ── */
router.get('/admin/guide/weeks', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const [wk, tasks, counts, done, items] = await Promise.all([
      pool.query('SELECT week, title, subtitle FROM guide_weeks ORDER BY week'),
      pool.query('SELECT week, title, body, published FROM guide_tasks'),
      pool.query(`SELECT COALESCE(week,0) AS week, COUNT(*)::int AS n
                    FROM guide_posts WHERE published GROUP BY COALESCE(week,0)`),
      pool.query(`SELECT week, COUNT(*)::int AS n FROM guide_task_done GROUP BY week`),
      pool.query(`SELECT id, week, title, sort FROM guide_task_items
                   WHERE published ORDER BY week, sort, id`),
    ]);
    const tmap = {}; tasks.rows.forEach((t) => { tmap[t.week] = t; });
    const cmap = {}; counts.rows.forEach((c) => { cmap[c.week] = c.n; });
    const dmap = {}; done.rows.forEach((d) => { dmap[d.week] = d.n; });
    const imap = {}; items.rows.forEach((i) => { (imap[i.week] = imap[i.week] || []).push(i); });
    res.render('dash/admin-guide-weeks', {
      user: req.user, active: 'admin-guide',
      weeks: wk.rows.map((w) => ({
        ...w, task: tmap[w.week] || null, posts: cmap[w.week] || 0, doneN: dmap[w.week] || 0,
        items: imap[w.week] || [],
      })),
    });
  } catch (e) { next(e); }
});

router.post('/admin/guide/weeks/save', requireAuth, requireAdmin, async (req, res) => {
  try {
    const b = req.body || {};
    const w = Number(b.week);
    if (!(w >= 0 && w <= 5)) return res.status(400).json({ ok: false, error: '주차가 올바르지 않습니다.' });
    const cut = (v, n) => String(v == null ? '' : v).replace(/[<>]/g, '').slice(0, n);

    await pool.query(
      `INSERT INTO guide_weeks (week, title, subtitle) VALUES ($1,$2,$3)
       ON CONFLICT (week) DO UPDATE SET title = EXCLUDED.title, subtitle = EXCLUDED.subtitle`,
      [w, cut(b.title, 60) || (w + '주차'), cut(b.subtitle, 100) || null]
    );

    /* 과제는 1~4주차만.
       빈 줄은 빼고, 적힌 줄만 순서대로 다시 깐다.
       ⚠️ 통째로 지우면 교육생이 체크해둔 것도 같이 날아간다(ON DELETE CASCADE).
          그래서 글자가 그대로인 줄은 건드리지 않고 살려둔다. */
    if (w >= 1 && w <= 4 && Array.isArray(b.items)) {
      const want = b.items
        .map((t) => cut(t, 200).trim())
        .filter(Boolean)
        .slice(0, 30);

      const cur = await pool.query(
        'SELECT id, title FROM guide_task_items WHERE week = $1 ORDER BY sort, id', [w]
      );
      const left = cur.rows.slice();

      for (let i = 0; i < want.length; i++) {
        const same = left.findIndex((r) => r.title === want[i]);
        if (same >= 0) {
          await pool.query('UPDATE guide_task_items SET sort = $2, published = TRUE WHERE id = $1',
            [left[same].id, i]);
          left.splice(same, 1);
        } else {
          const reuse = left.shift();          /* 글자만 고친 줄은 그 줄을 그대로 쓴다 */
          if (reuse) {
            await pool.query(
              'UPDATE guide_task_items SET title = $2, sort = $3, published = TRUE WHERE id = $1',
              [reuse.id, want[i], i]
            );
          } else {
            await pool.query(
              'INSERT INTO guide_task_items (week, title, sort) VALUES ($1,$2,$3)',
              [w, want[i], i]
            );
          }
        }
      }
      /* 남은 줄은 정말 없어진 것이다 */
      for (const r of left) {
        await pool.query('DELETE FROM guide_task_items WHERE id = $1', [r.id]);
      }
    }
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

/* 여러 글의 공개 시점을 한 번에 바꾼다 */
router.post('/admin/guide/week', requireAuth, requireAdmin, async (req, res) => {
  try {
    const ids = (req.body.ids || []).map(Number).filter(Boolean);
    const week = Math.min(Math.max(Number(req.body.week) || 0, 0), 5);
    if (!ids.length) return res.json({ ok: true, n: 0 });
    await pool.query('UPDATE guide_posts SET week=$2 WHERE id = ANY($1)', [ids, week]);
    res.json({ ok: true, n: ids.length, label: WEEK_LABEL[week] });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
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
      SELECT u.name, u.account_email AS email, COUNT(*)::int AS n, MAX(v.viewed_at) AS last_at
        FROM guide_views v
        JOIN users u ON u.id = v.teacher_id
       WHERE v.post_id = $1
       GROUP BY u.id, u.name, u.account_email
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
