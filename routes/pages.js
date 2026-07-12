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
    hasSmtp: !!req.user.mail_pass,
    hasResend: !!req.user.mail_key,
    mailMode: req.user.mail_mode || (req.user.mail_pass ? 'smtp' : (req.user.mail_key ? 'resend' : 'smtp')),
    hasAdminMail: !!(process.env.RESEND_KEY || (process.env.MAIL_USER && process.env.MAIL_PASS)),
    saved: req.query.saved === '1',
  });
});

router.post('/free-saju-settings', async (req, res, next) => {
  try {
    const { site_name, kakao_consult_link, consult_message, button_text,
            openai_key, mail_mode, mail_key, mail_pass, mail_user, mail_name } = req.body;

    // 키/비번은 새로 입력했을 때만 갱신 (빈칸이면 기존 값 유지)
    if (openai_key && openai_key.trim()) {
      await pool.query('UPDATE users SET openai_key = $1 WHERE id = $2', [openai_key.trim(), req.user.id]);
    }
    if (mail_key && mail_key.trim()) {
      await pool.query('UPDATE users SET mail_key = $1 WHERE id = $2', [mail_key.trim(), req.user.id]);
    }
    if (mail_pass && mail_pass.trim()) {
      // 앱 비밀번호: 구글이 4자씩 띄워서 보여주므로 공백 제거
      await pool.query('UPDATE users SET mail_pass = $1 WHERE id = $2',
        [mail_pass.replace(/\s+/g, ''), req.user.id]);
    }
    await pool.query('UPDATE users SET mail_mode = $1 WHERE id = $2',
      [mail_mode === 'resend' ? 'resend' : 'smtp', req.user.id]);

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

// SMTP 포트 열려있는지 진단
router.get('/api/mail/diag', async (req, res) => {
  const net = require('net');
  const out = {};
  for (const port of [587, 465]) {
    out[port] = await new Promise((resolve) => {
      const sock = new net.Socket();
      const t = setTimeout(() => { sock.destroy(); resolve('막힘 (timeout)'); }, 8000);
      sock.on('connect', () => { clearTimeout(t); sock.destroy(); resolve('열림 ✓'); });
      sock.on('error', (e) => { clearTimeout(t); sock.destroy(); resolve('막힘 (' + e.code + ')'); });
      sock.connect({ host: 'smtp.gmail.com', port, family: 4 });
    });
  }
  const open = Object.values(out).some((v) => v.includes('열림'));
  res.json({ ports: out, smtpAvailable: open,
    message: open ? 'SMTP 사용 가능합니다. Gmail 방식을 쓸 수 있습니다.'
                  : 'SMTP 포트가 막혀 있습니다. Resend 방식을 사용해주세요.' });
});

// 메일 테스트 발송
router.post('/api/mail/test', async (req, res) => {
  const { mailReady, sendMail, fromAddr, mailMode } = require('../services/mail');
  try {
    if (!mailReady(req.user)) {
      return res.status(400).json({ ok: false, error: '메일 설정을 먼저 저장해주세요.' });
    }
    const to = (req.body && req.body.to) || req.user.mail_user || req.user.account_email;
    if (!to) return res.status(400).json({ ok: false, error: '받을 이메일 주소를 입력해주세요.' });

    const name = req.user.mail_name || req.user.site_name || req.user.name || '사주 풀이';
    const r = await sendMail(req.user, {
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
    res.json({ ok: true, to, via: r.via, port: r.port });
  } catch (e) {
    console.error('[MAIL] 테스트 실패:', e.message);
    let msg = e.message;
    let hint = null;

    if (e.smtpBlocked) {
      msg = 'Gmail(SMTP) 연결이 차단되어 있습니다.';
      hint = 'Railway가 SMTP 포트를 막고 있습니다. 발송 방식을 [Resend]로 바꿔주세요.';
    } else if (/Invalid login|BadCredentials|Username and Password not accepted/i.test(msg)) {
      msg = '로그인 실패: Gmail 주소 또는 앱 비밀번호를 확인해주세요.';
      hint = '구글 로그인 비밀번호가 아니라 16자리 앱 비밀번호여야 합니다.';
    } else if (/API key is invalid|Unauthorized|401/i.test(msg)) {
      msg = 'Resend API 키가 올바르지 않습니다. (re_로 시작하는 키)';
    } else if (/not verified|only send testing emails/i.test(msg)) {
      msg = 'Resend는 도메인 인증 전까지 가입한 본인 이메일로만 발송됩니다.';
      hint = '보내는 주소를 비우고, 받는 주소는 Resend 가입 이메일로 테스트해주세요.';
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
