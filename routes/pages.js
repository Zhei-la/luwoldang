const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { requireAuth, requireApproved } = require('../middleware/auth');
const { getPromo, normalizePromo } = require('../services/freePromo');

// 모든 대시보드 페이지는 로그인 + 승인 필요
router.use(requireAuth, requireApproved);

// 홈
router.get('/home', async (req, res, next) => {
  try {
    const q = async (sql) => (await pool.query(sql, [req.user.id])).rows[0].c;
    const stats = {
      pdfs:  await q('SELECT COUNT(*)::int AS c FROM pdfs WHERE teacher_id = $1'),
      sent:  await q('SELECT COUNT(*)::int AS c FROM pdfs WHERE teacher_id = $1 AND mail_sent = TRUE'),
      leads: await q('SELECT COUNT(*)::int AS c FROM leads WHERE teacher_id = $1'),
      free:  await q('SELECT COUNT(*)::int AS c FROM free_logs WHERE teacher_id = $1'),
    };
    res.render('dash/home', { user: req.user, active: 'home', stats });
  } catch (e) {
    next(e);
  }
});

// API 관리 (설정 페이지로 통합)
router.get('/api-settings', (req, res) => res.redirect('/free-saju-settings'));

// 무료사주 웹사이트 설정 (실제 기능)
router.get('/free-saju-settings', (req, res) => {
  res.render('dash/free-settings', {
    user: req.user,
    active: 'settings',
    baseUrl: process.env.BASE_URL || '',
    hasKey: !!req.user.openai_key,
    promo: getPromo(req.user),
    mailDomain: process.env.MAIL_DOMAIN || null,
    mailFrom: require('../services/mail').fromAddr(req.user),
    mailReady: require('../services/mail').mailReady(req.user),
    saved: req.query.saved === '1',
    slugError: SLUG_ERR[req.query.slugerr] || null,
  });
});

router.post('/free-saju-settings', async (req, res, next) => {
  try {
    const { site_name, kakao_consult_link, consult_message, button_text,
            openai_key, mail_local, mail_name, mail_reply,
            pdf_cta_text, pdf_cta_desc, promo_json, review_notice } = req.body;

    // 무료 PDF 업셀 설정 (프리미엄 안내 · Q&A · 후기 이미지 · 할인 문구)
    if (promo_json) {
      let parsed = null;
      try { parsed = JSON.parse(promo_json); } catch (e) { /* 무시 */ }
      if (parsed) {
        await pool.query('UPDATE users SET free_promo = $1 WHERE id = $2',
          [JSON.stringify(normalizePromo(parsed)), req.user.id]);
      }
    }

    // 키/비번은 새로 입력했을 때만 갱신 (빈칸이면 기존 값 유지)
    if (openai_key && openai_key.trim()) {
      await pool.query('UPDATE users SET openai_key = $1 WHERE id = $2', [openai_key.trim(), req.user.id]);
    }

    // 메일 아이디: 영문/숫자/.-_ 만 허용
    const local = String(mail_local || '').toLowerCase().replace(/[^a-z0-9._-]/g, '') || null;

    // 체크박스: 체크하면 'on' 이 넘어오고, 안 하면 아예 안 넘어온다
    const reviewOn = req.body.review_on != null;

    await pool.query(
      `UPDATE users
       SET site_name = $1, kakao_consult_link = $2, consult_message = $3, button_text = $4,
           mail_local = $5, mail_name = $6, mail_reply = $7,
           pdf_cta_text = $8, pdf_cta_desc = $9, review_on = $10, review_notice = $11
       WHERE id = $12`,
      [site_name || null, kakao_consult_link || null, consult_message || null, button_text || null,
       local, (mail_name || '').trim() || null, (mail_reply || '').trim() || null,
       (pdf_cta_text || '').trim() || null, (pdf_cta_desc || '').trim() || null, reviewOn,
       (review_notice || '').trim() || null, req.user.id]
    );

    res.redirect('/free-saju-settings?saved=1');
  } catch (e) {
    next(e);
  }
});

// 메일 테스트 발송
router.post('/api/mail/test', async (req, res) => {
  const { mailReady, sendMail, fromAddr, mailDomain } = require('../services/mail');
  try {
    if (!mailDomain()) {
      return res.status(400).json({ ok: false, error: '메일 도메인이 설정되지 않았습니다. 관리자에게 문의해주세요.' });
    }
    if (!mailReady(req.user)) {
      return res.status(400).json({ ok: false, error: '메일 발송이 아직 준비되지 않았습니다. 관리자에게 문의해주세요.' });
    }
    const to = (req.body && req.body.to) || req.user.mail_reply || req.user.account_email;
    if (!to) return res.status(400).json({ ok: false, error: '테스트 받을 이메일 주소를 입력해주세요.' });

    const name = req.user.mail_name || req.user.site_name || req.user.name || '사주 풀이';
    await sendMail(req.user, {
      to,
      subject: '[테스트] 메일 발송이 정상 작동합니다',
      html: `<div style="font-family:-apple-system,'Malgun Gothic',sans-serif;padding:24px;background:#F7F3EA">
        <div style="max-width:480px;margin:0 auto;background:#fffdf8;border:1px solid #E9E0CF;border-radius:12px;padding:28px;text-align:center">
          <h2 style="margin:0 0 10px;color:#252522">메일 발송 정상 ✓</h2>
          <div style="width:40px;height:2px;background:#B59A62;margin:0 auto 16px"></div>
          <p style="margin:0;color:#6b6656;line-height:1.7;font-size:14px">
            <b>${name}</b> 이름으로 메일이 발송됩니다.<br>이제 무료사주와 사주 리포트를 보낼 수 있습니다.</p>
          <p style="margin:14px 0 0;font-size:12px;color:#b3ad9c">발신: ${fromAddr(req.user)}</p>
        </div></div>`,
    });
    res.json({ ok: true, to, from: fromAddr(req.user) });
  } catch (e) {
    console.error('[MAIL] 테스트 실패:', e.message);
    res.status(500).json({ ok: false, error: e.message });
  }
});

// 내 계정
router.get('/account', (req, res) => {
  res.render('dash/account', {
    user: req.user, active: 'account',
    baseUrl: process.env.BASE_URL || '',
  });
});

/* ===== 링크 주소(슬러그) 변경 ===== */
const SLUG_ERR = {
  bad:   '영문·숫자·하이픈(-)만 쓸 수 있고 3~24자여야 합니다.',
  taken: '이미 다른 분이 쓰고 있는 주소입니다. 다른 걸로 정해주세요.',
  keep:  '사용할 수 없는 주소입니다.',
};

// 시스템 경로와 겹치면 안 되는 이름
const RESERVED = [
  'admin', 'api', 'auth', 'home', 'builder', 'leads', 'pdf', 'pdfs',
  'records', 'chat', 'account', 'free', 'settings', 'login', 'logout',
  'pending', 's', 'dev', 'public', 'static', 'assets',
];

router.post('/free-saju-settings/slug', async (req, res, next) => {
  try {
    const slug = String(req.body.slug || '').trim().toLowerCase();

    if (!/^[a-z0-9-]{3,24}$/.test(slug)) {
      return res.redirect('/free-saju-settings?slugerr=bad');
    }
    if (RESERVED.includes(slug)) {
      return res.redirect('/free-saju-settings?slugerr=keep');
    }
    if (slug === req.user.slug) {
      return res.redirect('/free-saju-settings?saved=1'); // 그대로면 그냥 통과
    }

    const dup = await pool.query('SELECT 1 FROM users WHERE slug = $1', [slug]);
    if (dup.rows[0]) {
      return res.redirect('/free-saju-settings?slugerr=taken');
    }

    await pool.query('UPDATE users SET slug = $1 WHERE id = $2', [slug, req.user.id]);
    res.redirect('/free-saju-settings?saved=1');
  } catch (e) {
    next(e);
  }
});

/* 만세력 작성 워크시트 (직접 입력 -> 캡처용) */
router.get('/manse-sheet', (req, res) => {
  res.render('dash/manse-sheet', { user: req.user, active: 'manse-sheet' });
});

module.exports = router;
