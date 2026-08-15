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

function imgUrl(r) {
  /* 조회할 때 사진 내용(img)은 무거워서 안 가져오고
     '있는지 여부(has_img)'만 가져온다. 그 값을 봐야 한다. */
  const has = r.has_img !== undefined ? r.has_img : !!r.img;
  return has ? '/lp/review-img/' + r.id : (r.img_url || null);
}

/* ── 판매 페이지가 읽어가는 곳 (로그인 없이) ── */
router.get('/api/lp/reviews', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, img IS NOT NULL AS has_img, img_url, body, who
         FROM lp_reviews WHERE published ORDER BY sort, id`
    );
    res.set('Cache-Control', 'public, max-age=60');
    res.json({
      ok: true,
      reviews: rows.map((r) => ({
        id: r.id,
        img: r.has_img ? '/lp/review-img/' + r.id : (r.img_url || null),
        body: r.body,
        who: r.who,
      })),
    });
  } catch (e) {
    /* 표가 아직 없어도 판매 페이지가 깨지지 않게 한다 */
    res.json({ ok: true, reviews: [] });
  }
});

/* 후기 사진 (로그인 없이) */
router.get('/lp/review-img/:id(\\d+)', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT img FROM lp_reviews WHERE id = $1', [req.params.id]);
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
  seats: 10, deadline: '2026년 11월', ladder: '1기 30만 / 50만 / 2기 60만',
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

    await pool.query(`
      UPDATE lp_settings SET
        cohort=$1, price=$2, list_price=$3, next_cohort=$4, next_price=$5,
        seats=$6, deadline=$7, ladder=$8, updated_at=NOW()
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
        `SELECT id, img IS NOT NULL AS has_img, img_url, body, who, sort, published
           FROM lp_reviews ORDER BY sort, id`
      );
      items = rows.map((r) => ({ ...r, url: imgUrl(r) }));
    } catch (dbErr) {
      /* 표가 아직 없어도 화면은 떠야 한다 */
      console.error('[판매 후기] 불러오기 실패:', dbErr.message);
    }
    res.render('dash/admin-lp-reviews', {
      user: req.user, active: 'admin-lp', items, set: await getSettings(),
    });
  } catch (e) { next(e); }
});

router.post('/admin/lp-reviews/save', requireAuth, requireAdmin, async (req, res) => {
  try {
    const b = req.body || {};
    const body = plain(b.body).trim();
    const who = plain(b.who).trim().slice(0, 60) || null;
    if (!body && !b.img) {
      return res.status(400).json({ ok: false, error: '사진이나 글 중 하나는 있어야 합니다.' });
    }

    /* 사진은 새로 올렸을 때만 바꾼다 */
    let img = null;
    if (b.img) {
      img = String(b.img);
      if (!/^data:image\//.test(img)) return res.status(400).json({ ok: false, error: '이미지 파일만 올릴 수 있습니다.' });
      if (img.length > MAX_IMG * 1.4) return res.status(400).json({ ok: false, error: '사진이 너무 큽니다. 3MB 이하로 올려주세요.' });
    }

    const id = b.id ? Number(b.id) : null;
    if (id) {
      if (img) {
        await pool.query(
          'UPDATE lp_reviews SET body=$2, who=$3, img=$4, img_url=NULL WHERE id=$1',
          [id, body, who, img]
        );
      } else {
        await pool.query('UPDATE lp_reviews SET body=$2, who=$3 WHERE id=$1', [id, body, who]);
      }
      return res.json({ ok: true, id });
    }

    const { rows } = await pool.query('SELECT COALESCE(MAX(sort),0)+10 AS s FROM lp_reviews');
    const ins = await pool.query(
      'INSERT INTO lp_reviews (img, body, who, sort) VALUES ($1,$2,$3,$4) RETURNING id',
      [img, body, who, rows[0].s]
    );
    res.json({ ok: true, id: ins.rows[0].id });
  } catch (e) {
    console.error('[판매 후기] 저장 실패:', e.message);
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
