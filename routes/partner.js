/**
 * partner.js — 모집 파트너
 *
 *  공개    : GET  /p/:slug            모집 페이지 (방문 기록)
 *            POST /p/:slug/kakao      카톡 버튼 클릭 기록 → 카톡 링크 반환
 *  파트너  : GET  /partner            내 모집 링크 + 통계 (partner_on 인 사람만)
 *  관리자  : POST /admin/partner/:id/toggle   파트너 승인 on/off + 슬러그 발급
 *            POST /admin/partner/:id/kakao    카톡 링크 지정
 */

const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const { pool } = require('../db');
const { requireAuth, requireApproved, requireAdmin } = require('../middleware/auth');

const AUTH = [requireAuth, requireApproved];

/* 방문자 키 (IP+UA 해시) */
function visitorKey(req) {
  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
  const ua = req.headers['user-agent'] || '';
  return crypto.createHash('sha1').update(ip + '|' + ua).digest('hex').slice(0, 16);
}
function isBot(req) {
  return /bot|crawler|spider|slurp|facebookexternalhit|preview/i.test(req.headers['user-agent'] || '');
}

/* 짧은 슬러그 생성 */
function makeSlug() {
  return crypto.randomBytes(5).toString('hex'); // 10자
}

/* ───── 공개 모집 페이지 ───── */
router.get('/p/:slug', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, site_name, name, partner_kakao, partner_on
       FROM users WHERE partner_slug = $1`,
      [req.params.slug]
    );
    const partner = rows[0];
    if (!partner || !partner.partner_on) {
      return res.status(404).render('pub/partner-notfound');
    }

    // 방문 기록 (봇 제외)
    if (!isBot(req)) {
      const key = visitorKey(req);
      pool.query(
        `INSERT INTO partner_hits (partner_id, kind, visitor_key)
         SELECT $1, 'visit', $2
         WHERE NOT EXISTS (
           SELECT 1 FROM partner_hits
           WHERE partner_id = $1 AND kind = 'visit' AND visitor_key = $2
             AND hit_at > NOW() - INTERVAL '30 minutes'
         )`,
        [partner.id, key]
      ).catch(() => {});
    }

    res.render('pub/partner-landing', {
      slug: req.params.slug,
      brand: partner.site_name || partner.name || '루월당',
    });
  } catch (e) {
    console.error('[모집] 페이지 오류:', e.message);
    res.status(500).send('페이지를 불러오지 못했습니다.');
  }
});

/* 카톡 버튼 클릭 → 기록 후 카톡 링크 반환 */
router.post('/p/:slug/kakao', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, partner_kakao, partner_on FROM users WHERE partner_slug = $1`,
      [req.params.slug]
    );
    const partner = rows[0];
    if (!partner || !partner.partner_on) return res.status(404).json({ ok: false });

    if (!isBot(req)) {
      pool.query(
        `INSERT INTO partner_hits (partner_id, kind, visitor_key) VALUES ($1, 'kakao', $2)`,
        [partner.id, visitorKey(req)]
      ).catch(() => {});
    }

    res.json({ ok: true, kakao: partner.partner_kakao || '' });
  } catch (e) {
    res.status(500).json({ ok: false });
  }
});

/* ───── 파트너 대시보드 ───── */
router.get('/partner', AUTH, async (req, res, next) => {
  try {
    if (!req.user.partner_on) {
      return res.status(403).render('pub/partner-denied', { user: req.user });
    }
    const stats = await partnerStats(req.user.id);
    const base = process.env.BASE_URL || ('https://' + req.headers.host);
    res.render('dash/partner', {
      user: req.user,
      active: 'partner',
      link: base + '/p/' + req.user.partner_slug,
      kakao: req.user.partner_kakao || '',
      stats,
    });
  } catch (e) { next(e); }
});

/* 파트너 통계 (방문/클릭) */
async function partnerStats(partnerId) {
  const q = async (sql) => (await pool.query(sql, [partnerId])).rows[0].n;
  return {
    visitToday: await q(`SELECT COUNT(*)::int AS n FROM partner_hits WHERE partner_id=$1 AND kind='visit' AND hit_at::date=NOW()::date`),
    visitTotal: await q(`SELECT COUNT(*)::int AS n FROM partner_hits WHERE partner_id=$1 AND kind='visit'`),
    kakaoToday: await q(`SELECT COUNT(*)::int AS n FROM partner_hits WHERE partner_id=$1 AND kind='kakao' AND hit_at::date=NOW()::date`),
    kakaoTotal: await q(`SELECT COUNT(*)::int AS n FROM partner_hits WHERE partner_id=$1 AND kind='kakao'`),
  };
}

/* ───── 관리자: 파트너 승인 / 카톡 지정 ───── */
router.post('/admin/partner/:id/toggle', requireAuth, requireApproved, requireAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const cur = await pool.query('SELECT partner_on, partner_slug FROM users WHERE id=$1', [id]);
    if (!cur.rows[0]) return res.status(404).json({ ok: false, error: '없는 사용자' });

    const turnOn = !cur.rows[0].partner_on;
    let slug = cur.rows[0].partner_slug;
    if (turnOn && !slug) {
      // 슬러그 발급 (중복 방지)
      for (let i = 0; i < 5; i++) {
        const s = makeSlug();
        const dup = await pool.query('SELECT 1 FROM users WHERE partner_slug=$1', [s]);
        if (!dup.rows[0]) { slug = s; break; }
      }
    }
    await pool.query(
      'UPDATE users SET partner_on=$2, partner_slug=COALESCE(partner_slug,$3) WHERE id=$1',
      [id, turnOn, slug]
    );
    res.json({ ok: true, partner_on: turnOn, slug });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.post('/admin/partner/:id/kakao', requireAuth, requireApproved, requireAdmin, async (req, res) => {
  try {
    const kakao = String((req.body || {}).kakao || '').trim();
    await pool.query('UPDATE users SET partner_kakao=$2 WHERE id=$1', [req.params.id, kakao || null]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

module.exports = router;
