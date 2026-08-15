/* ============================================================
 * routes/lpReview.js — 판매 페이지(/lp/) 후기 관리
 *
 * 관리자가 사진과 글을 올리면 판매 페이지가 읽어가 보여준다.
 * 판매 페이지는 로그인 없이 누구나 보는 곳이므로
 * 읽기(API·사진)는 열어두고, 쓰기는 관리자만 할 수 있게 한다.
 * ============================================================ */

const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const MAX_IMG = 3 * 1024 * 1024;

/* 글자만 남긴다 — 판매 페이지에 그대로 들어가므로 태그는 받지 않는다 */
function plain(t) {
  return String(t == null ? '' : t)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\r\n?/g, '\n')
    .slice(0, 2000);
}

/* 후기들의 사진을 한 번에 읽어와 후기별로 묶어준다 */
async function imagesOf(ids) {
  if (!ids.length) return {};
  const { rows } = await pool.query(
    `SELECT id, review_id, img IS NOT NULL AS has_img, img_url
       FROM lp_review_imgs WHERE review_id = ANY($1) ORDER BY sort, id`,
    [ids]
  );
  const map = {};
  rows.forEach((r) => {
    const url = r.has_img ? '/lp/rimg/' + r.id : (r.img_url || null);
    if (!url) return;
    (map[r.review_id] = map[r.review_id] || []).push({ id: r.id, url });
  });
  return map;
}

/* ── 판매 페이지가 읽어가는 곳 (로그인 없이) ── */
router.get('/api/lp/reviews', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, body, who FROM lp_reviews
        WHERE published AND COALESCE(kind,'review')='review' ORDER BY sort, id`
    );
    const imgs = await imagesOf(rows.map((r) => r.id));
    res.set('Cache-Control', 'public, max-age=60');
    res.json({
      ok: true,
      reviews: rows.map((r) => ({
        id: r.id,
        imgs: (imgs[r.id] || []).map((x) => x.url),
        img: (imgs[r.id] || [])[0] ? imgs[r.id][0].url : null,   // 예전 방식도 계속 통하게
        body: r.body,
        who: r.who,
      })),
    });
  } catch (e) {
    /* 표가 아직 없어도 판매 페이지가 깨지지 않게 한다 */
    res.json({ ok: true, reviews: [] });
  }
});

/* 프로그램 실제 화면 (로그인 없이) */
router.get('/api/lp/shots', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, title, body FROM lp_reviews
        WHERE published AND kind='shot' ORDER BY sort, id`
    );
    const imgs = await imagesOf(rows.map((r) => r.id));
    res.set('Cache-Control', 'public, max-age=60');
    res.json({
      ok: true,
      shots: rows
        .map((r) => ({ id: r.id, title: r.title, body: r.body, imgs: (imgs[r.id] || []).map((x) => x.url) }))
        .filter((r) => r.imgs.length),      /* 사진이 없는 건 아직 안 보여준다 */
    });
  } catch (e) {
    res.json({ ok: true, shots: [] });
  }
});

/* 후기 사진 — 여러 장 (로그인 없이) */
router.get('/lp/rimg/:id(\\d+)', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT img FROM lp_review_imgs WHERE id = $1', [req.params.id]);
    if (!rows[0] || !rows[0].img) return res.status(404).end();
    const m = /^data:(image\/[a-zA-Z+]+);base64,(.+)$/.exec(rows[0].img);
    if (!m) return res.status(404).end();
    res.set('Content-Type', m[1]);
    res.set('Cache-Control', 'public, max-age=86400');
    res.send(Buffer.from(m[2], 'base64'));
  } catch (e) { res.status(404).end(); }
});

/* 예전 주소도 계속 통하게 — 그 후기의 첫 사진을 준다 */
router.get('/lp/review-img/:id(\\d+)', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT img FROM lp_review_imgs WHERE review_id = $1 AND img IS NOT NULL ORDER BY sort, id LIMIT 1',
      [req.params.id]
    );
    if (!rows[0] || !rows[0].img) return res.status(404).end();
    const m = /^data:(image\/[a-zA-Z+]+);base64,(.+)$/.exec(rows[0].img);
    if (!m) return res.status(404).end();
    res.set('Content-Type', m[1]);
    res.set('Cache-Control', 'public, max-age=86400');
    res.send(Buffer.from(m[2], 'base64'));
  } catch (e) { res.status(404).end(); }
});

/* ── 판매 페이지 설정 (기수·금액 등) ── */
const DEFAULT_SET = {
  cohort: '3기', price: 70, list_price: 80,
  next_cohort: '4기', next_price: 110,
  seats: 10, deadline: '10월 31일', ladder: '1기 30만 / 50만 / 2기 60만',
  early_until: '9월 30일', late_price: 80,
  live_date: '9월 19일', live_url: 'https://open.kakao.com/o/gdlttwDi',
};

async function getSettings() {
  try {
    const { rows } = await pool.query('SELECT * FROM lp_settings WHERE id = 1');
    return rows[0] || DEFAULT_SET;
  } catch (e) { return DEFAULT_SET; }
}

/* 판매 페이지가 읽어가는 곳 (로그인 없이) */
router.get('/api/lp/settings', async (req, res) => {
  const st = await getSettings();
  res.set('Cache-Control', 'public, max-age=60');
  res.json({
    ok: true,
    s: {
      cohort: st.cohort, price: st.price, listPrice: st.list_price,
      discount: Math.max(0, (st.list_price || 0) - (st.price || 0)),
      nextCohort: st.next_cohort, nextPrice: st.next_price,
      seats: st.seats, deadline: st.deadline, ladder: st.ladder,
      earlyUntil: st.early_until, latePrice: st.late_price,
      liveDate: st.live_date, liveUrl: st.live_url,
    },
  });
});

router.post('/admin/lp-settings', requireAuth, requireAdmin, async (req, res) => {
  try {
    const b = req.body || {};
    const num = (v, d) => {
      const n = Number(v);
      return Number.isFinite(n) && n >= 0 && n < 100000 ? Math.round(n) : d;
    };
    const txt = (v, d, len) => {
      /* 판매 페이지에 그대로 들어가는 값이다.
         기수·마감일 같은 짧은 말만 들어오므로,
         한글·영문·숫자와 몇 가지 기호만 남기고 전부 버린다. */
      const t = String(v == null ? '' : v)
        .replace(/<[^>]*>/g, ' ')
        .replace(/[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9 .,~\-/()월일년기만원명]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      return t ? t.slice(0, len) : d;
    };
    const cur = await getSettings();

    /* 라이브 대기방 주소는 카카오 오픈채팅만 받는다 */
    const url = (v, d) => {
      const t = String(v == null ? '' : v).trim();
      return /^https:\/\/open\.kakao\.com\/[\w/-]+$/.test(t) ? t : d;
    };

    await pool.query(`
      UPDATE lp_settings SET
        cohort=$1, price=$2, list_price=$3, next_cohort=$4, next_price=$5,
        seats=$6, deadline=$7, ladder=$8,
        early_until=$9, late_price=$10, live_date=$11, live_url=$12,
        updated_at=NOW()
      WHERE id=1
    `, [
      txt(b.cohort, cur.cohort, 20),
      num(b.price, cur.price),
      num(b.listPrice, cur.list_price),
      txt(b.nextCohort, cur.next_cohort, 20),
      num(b.nextPrice, cur.next_price),
      num(b.seats, cur.seats),
      txt(b.deadline, cur.deadline, 40),
      txt(b.ladder, cur.ladder, 120),
      txt(b.earlyUntil, cur.early_until, 40),
      num(b.latePrice, cur.late_price),
      txt(b.liveDate, cur.live_date, 40),
      url(b.liveUrl, cur.live_url),
    ]);
    res.json({ ok: true });
  } catch (e) {
    console.error('[판매 설정] 저장 실패:', e.message);
    res.status(500).json({ ok: false, error: e.message });
  }
});

/* ── 관리자 ── */
router.get('/admin/lp-reviews', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    let items = [];
    try {
      const { rows } = await pool.query(
        `SELECT id, body, who, title, COALESCE(kind,'review') AS kind, sort, published
           FROM lp_reviews ORDER BY sort, id`
      );
      const imgs = await imagesOf(rows.map((r) => r.id));
      items = rows.map((r) => ({ ...r, imgs: imgs[r.id] || [] }));
    } catch (dbErr) {
      /* 표가 아직 없어도 화면은 떠야 한다 */
      console.error('[판매 후기] 불러오기 실패:', dbErr.message);
    }
    res.render('dash/admin-lp-reviews', {
      user: req.user, active: 'admin-lp',
      items: items.filter((r) => r.kind !== 'shot'),
      shots: items.filter((r) => r.kind === 'shot'),
      set: await getSettings(),
    });
  } catch (e) { next(e); }
});

router.post('/admin/lp-reviews/save', requireAuth, requireAdmin, async (req, res) => {
  try {
    const b = req.body || {};
    const body = plain(b.body).trim();
    const who = plain(b.who).trim().slice(0, 60) || null;
    const title = plain(b.title).trim().slice(0, 80) || null;
    const hasNew = (Array.isArray(b.imgs) && b.imgs.length) || b.img;
    if (!body && !hasNew && !b.id) {
      return res.status(400).json({ ok: false, error: '사진이나 글 중 하나는 있어야 합니다.' });
    }

    /* 새로 올린 사진들 — 없으면 지금 사진을 그대로 둔다 */
    const list = Array.isArray(b.imgs) ? b.imgs : (b.img ? [b.img] : []);
    if (list.length > 10) return res.status(400).json({ ok: false, error: '사진은 한 후기에 10장까지 넣을 수 있습니다.' });
    for (const im of list) {
      if (!/^data:image\//.test(String(im))) return res.status(400).json({ ok: false, error: '이미지 파일만 올릴 수 있습니다.' });
      if (String(im).length > MAX_IMG * 1.4) return res.status(400).json({ ok: false, error: '사진이 너무 큽니다. 3MB 이하로 올려주세요.' });
    }

    let id = b.id ? Number(b.id) : null;
    if (id) {
      await pool.query(
        'UPDATE lp_reviews SET body=$2, who=$3, title=COALESCE($4, title) WHERE id=$1',
        [id, body, who, title]
      );
    } else {
      const { rows } = await pool.query('SELECT COALESCE(MAX(sort),0)+10 AS s FROM lp_reviews');
      const ins = await pool.query(
        'INSERT INTO lp_reviews (body, who, sort) VALUES ($1,$2,$3) RETURNING id',
        [body, who, rows[0].s]
      );
      id = ins.rows[0].id;
    }

    /* 올린 사진을 뒤에 이어 붙인다 */
    for (const im of list) {
      const { rows: mx } = await pool.query(
        'SELECT COALESCE(MAX(sort),0)+10 AS s FROM lp_review_imgs WHERE review_id=$1', [id]
      );
      await pool.query(
        'INSERT INTO lp_review_imgs (review_id, img, sort) VALUES ($1,$2,$3)', [id, String(im), mx[0].s]
      );
    }
    res.json({ ok: true, id });
  } catch (e) {
    console.error('[판매 후기] 저장 실패:', e.message);
    res.status(500).json({ ok: false, error: e.message });
  }
});

/* 사진 한 장만 지우기 */
router.post('/admin/lp-reviews/img-delete', requireAuth, requireAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM lp_review_imgs WHERE id = $1', [Number(req.body.imgId)]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.post('/admin/lp-reviews/delete', requireAuth, requireAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM lp_reviews WHERE id = $1', [Number(req.body.id)]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

/* 보이기·숨기기 */
router.post('/admin/lp-reviews/toggle', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'UPDATE lp_reviews SET published = NOT published WHERE id=$1 RETURNING published',
      [Number(req.body.id)]
    );
    res.json({ ok: true, published: rows[0] ? rows[0].published : null });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

/* 순서 옮기기 — 옆 후기와 자리를 맞바꾼다 */
router.post('/admin/lp-reviews/move', requireAuth, requireAdmin, async (req, res) => {
  try {
    const id = Number(req.body.id);
    const up = req.body.dir === 'up';
    const cur = await pool.query('SELECT id, sort FROM lp_reviews WHERE id=$1', [id]);
    if (!cur.rows[0]) return res.json({ ok: true });

    const nb = await pool.query(
      `SELECT id, sort FROM lp_reviews
        WHERE sort ${up ? '<' : '>'} $1 ORDER BY sort ${up ? 'DESC' : 'ASC'} LIMIT 1`,
      [cur.rows[0].sort]
    );
    if (nb.rows[0]) {
      await pool.query('UPDATE lp_reviews SET sort=$2 WHERE id=$1', [cur.rows[0].id, nb.rows[0].sort]);
      await pool.query('UPDATE lp_reviews SET sort=$2 WHERE id=$1', [nb.rows[0].id, cur.rows[0].sort]);
    }
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

module.exports = router;
