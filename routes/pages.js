const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { requireAuth, requireApproved } = require('../middleware/auth');

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
    hasMailKey: !!(req.user.mj_key && req.user.mj_secret),
    hasAdminMail: !!(process.env.MJ_KEY && process.env.MJ_SECRET),
    saved: req.query.saved === '1',
  });
});

router.post('/free-saju-settings', async (req, res, next) => {
  try {
    const { site_name, kakao_consult_link, consult_message, button_text,
            openai_key, mj_key, mj_secret, mail_user, mail_name } = req.body;

    // 키/비번은 새로 입력했을 때만 갱신 (빈칸이면 기존 값 유지)
    if (openai_key && openai_key.trim()) {
      await pool.query('UPDATE users SET openai_key = $1 WHERE id = $2', [openai_key.trim(), req.user.id]);
    }
    if (mj_key && mj_key.trim()) {
      await pool.query('UPDATE users SET mj_key = $1 WHERE id = $2', [mj_key.trim(), req.user.id]);
    }
    if (mj_secret && mj_secret.trim()) {
      await pool.query('UPDATE users SET mj_secret = $1 WHERE id = $2', [mj_secret.trim(), req.user.id]);
    }

    await pool.query(
      `UPDATE users
       SET site_name = $1, kakao_consult_link = $2, consult_message = $3, button_text = $4,
           mail_user = $5, mail_name = $6
       WHERE id = $7`,
      [site_name || null, kakao_consult_link || null, consult_message || null, button_text || null,
       (mail_user || '').trim() || null, (mail_name || '').trim() || null, req.user.id]
    );

    res.redirect('/free-saju-settings?saved=1');
  } catch (e) {
    next(e);
  }
});

// 메일 테스트 발송
router.post('/api/mail/test', async (req, res) => {
  const { mailReady, sendMail, fromAddr } = require('../services/mail');
  try {
    if (!mailReady(req.user)) {
      return res.status(400).json({
        ok: false,
        error: 'API 키와 보내는 이메일 주소를 먼저 저장해주세요.',
      });
    }
    const to = (req.body && req.body.to) || req.user.mail_user;
    if (!to) return res.status(400).json({ ok: false, error: '받을 이메일 주소를 입력해주세요.' });

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
    res.json({ ok: true, to });
  } catch (e) {
    console.error('[MAIL] 테스트 실패:', e.message);
    let msg = e.message;
    let hint = null;
    if (/API 키가 올바르지|401|Unauthorized/i.test(msg)) {
      msg = 'API 키가 올바르지 않습니다.';
      hint = 'Mailjet의 API 키와 비밀 키를 다시 확인해주세요.';
    } else if (/sender|not.*(allowed|authori|valid)|From/i.test(msg)) {
      msg = '보내는 이메일 주소가 인증되지 않았습니다.';
      hint = 'Mailjet → Senders & Domains 에서 해당 이메일을 인증(Add a sender)한 뒤 다시 시도해주세요.';
    }
    res.status(500).json({ ok: false, error: msg, hint });
  }
});

// 내담자 추가질문 (다음 단계에서 구현)
router.get('/chat', (req, res) => {
  res.render('dash/placeholder', {
    user: req.user, active: 'chat',
    title: '내담자 추가질문', step: '다음 단계',
  });
});

// 내 계정
router.get('/account', (req, res) => {
  res.render('dash/account', {
    user: req.user, active: 'account',
    baseUrl: process.env.BASE_URL || '',
  });
});

module.exports = router;
