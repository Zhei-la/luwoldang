const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { requireAuth, requireApproved } = require('../middleware/auth');

// 모든 대시보드 페이지는 로그인 + 승인 필요
router.use(requireAuth, requireApproved);

// 홈
router.get('/home', (req, res) => {
  res.render('dash/home', { user: req.user, active: 'home' });
});

// 무료사주 웹사이트 설정 (실제 기능)
router.get('/free-saju-settings', (req, res) => {
  res.render('dash/free-settings', {
    user: req.user,
    active: 'settings',
    baseUrl: process.env.BASE_URL || '',
    hasKey: !!req.user.openai_key,
    hasMail: !!req.user.mail_pass,
    hasAdminMail: !!(process.env.MAIL_USER && process.env.MAIL_PASS),
    saved: req.query.saved === '1',
  });
});

router.post('/free-saju-settings', async (req, res, next) => {
  try {
    const { site_name, kakao_consult_link, consult_message, button_text,
            openai_key, mail_user, mail_pass, mail_name } = req.body;

    // 키/비번은 새로 입력했을 때만 갱신 (빈칸이면 기존 값 유지)
    if (openai_key && openai_key.trim()) {
      await pool.query('UPDATE users SET openai_key = $1 WHERE id = $2', [openai_key.trim(), req.user.id]);
    }
    if (mail_pass && mail_pass.trim()) {
      // 앱 비밀번호는 공백 없이 저장 (구글이 4자씩 띄워서 보여줌)
      await pool.query('UPDATE users SET mail_pass = $1 WHERE id = $2',
        [mail_pass.replace(/\s+/g, ''), req.user.id]);
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
  const { mailReady, sendWithFallback, fromAddr } = require('../services/mail');
  try {
    if (!mailReady(req.user)) {
      return res.status(400).json({ ok: false, error: '메일 설정이 없습니다. 이메일과 앱 비밀번호를 저장한 뒤 다시 시도해주세요.' });
    }
    const to = req.user.mail_user || process.env.MAIL_USER;
    const name = req.user.mail_name || req.user.site_name || req.user.name || '사주 풀이';

    const r = await sendWithFallback(req.user, {
      from: fromAddr(req.user),
      to,
      subject: '[테스트] 메일 발송이 정상 작동합니다',
      html: `<div style="font-family:-apple-system,'Malgun Gothic',sans-serif;padding:24px;background:#F7F3EA">
        <div style="max-width:480px;margin:0 auto;background:#fffdf8;border:1px solid #E9E0CF;border-radius:12px;padding:28px;text-align:center">
          <h2 style="margin:0 0 10px;color:#252522">메일 발송 정상 ✓</h2>
          <div style="width:40px;height:2px;background:#B59A62;margin:0 auto 16px"></div>
          <p style="margin:0;color:#6b6656;line-height:1.7;font-size:14px">
            <b>${name}</b> 이름으로 메일이 발송됩니다.<br>이제 무료사주와 사주 리포트를 보낼 수 있습니다.</p>
        </div></div>`,
    });
    res.json({ ok: true, to, port: r.port });
  } catch (e) {
    console.error('[MAIL] 테스트 실패:', e.message);
    let msg = e.message;
    if (/Invalid login|BadCredentials|Username and Password not accepted/i.test(msg)) {
      msg = '로그인 실패: Gmail 주소 또는 앱 비밀번호를 확인해주세요. (구글 로그인 비밀번호가 아니라 16자리 앱 비밀번호여야 합니다)';
    } else if (/timeout|ETIMEDOUT|ECONNREFUSED|연결하지 못했습니다/i.test(msg)) {
      msg = '메일 서버 연결 실패: 네트워크가 SMTP 포트를 막고 있을 수 있습니다. 잠시 후 다시 시도해주세요.';
    }
    res.status(500).json({ ok: false, error: msg });
  }
});

router.get('/pdf/create', (req, res) => {
  res.render('dash/placeholder', { user: req.user, active: 'pdf', title: 'PDF 만들기', step: '4단계' });
});

router.get('/chat', (req, res) => {
  res.render('dash/placeholder', { user: req.user, active: 'chat', title: '내담자 추가질문', step: '8단계' });
});

router.get('/records', (req, res) => {
  res.render('dash/placeholder', { user: req.user, active: 'records', title: 'PDF · 이메일 발송 기록', step: '7단계' });
});

router.get('/api-settings', (req, res) => {
  res.render('dash/placeholder', { user: req.user, active: 'api', title: 'API 관리', step: '9단계' });
});

// 내 계정 (지금도 실제 정보 표시)
router.get('/account', (req, res) => {
  res.render('dash/account', { user: req.user, active: 'account', baseUrl: process.env.BASE_URL || '' });
});

module.exports = router;
