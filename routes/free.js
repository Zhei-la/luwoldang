const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const { pool } = require('../db');
const { calcSaju } = require('../services/manseryeok');
const { generateFreeSaju, UPSELL } = require('../services/ai');
const { renderLanding, defaultLanding } = require('../services/landing');
const { sendFreeSaju } = require('../services/mail');
const { notify } = require('../services/push');
const { buildFreePdfHtml } = require('../services/freePdf');
const { htmlToPdf, sendPdf } = require('../services/pdfFile');

async function findTeacher(slug) {
  const { rows } = await pool.query(
    "SELECT * FROM users WHERE slug = $1 AND status = 'approved'",
    [slug]
  );
  return rows[0];
}

// 시간 경과 표시
function agoText(d) {
  const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
  if (m < 1) return '방금';
  if (m < 60) return m + '분 전';
  const h = Math.floor(m / 60);
  if (h < 24) return h + '시간 전';
  return Math.floor(h / 24) + '일 전';
}

// 전화번호 마스킹
function maskPhone(p) {
  if (!p) return '';
  const d = String(p).replace(/\D/g, '');
  if (d.length < 8) return '010-****-****';
  return '010-****-' + d.slice(-4);
}
function maskName(n) {
  if (!n) return '';
  const s = String(n);
  if (s.length <= 1) return s;
  return s[0] + '*' + (s.length > 2 ? s.slice(2) : '');
}

/* ===== 공개 랜딩 페이지 (교육생이 꾸민 그대로) ===== */
router.get('/s/:slug', async (req, res, next) => {
  try {
    const teacher = await findTeacher(req.params.slug);
    if (!teacher) return res.status(404).render('free/notfound');

    // 방문 기록 (통계용) — IP+UA 로 중복 대충 거름, 실패해도 페이지엔 영향 없음
    try {
      const { recordVisit } = require('../services/stats');
      const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
      const ua = req.headers['user-agent'] || '';
      const bot = /bot|crawler|spider|slurp|facebookexternalhit|preview/i.test(ua);
      if (!bot) {
        const crypto = require('crypto');
        const key = crypto.createHash('sha1').update(ip + '|' + ua).digest('hex').slice(0, 16);
        recordVisit(teacher.id, key);   // await 안 함 (페이지 응답 지연 방지)
      }
    } catch (e) { /* noop */ }

    const S = teacher.landing || defaultLanding(teacher.site_name || teacher.name);

    // 실제 신청 내역 (가짜 아님)
    const leads = await pool.query(
      'SELECT name, phone, status, created_at FROM leads WHERE teacher_id = $1 ORDER BY created_at DESC LIMIT 6',
      [teacher.id]
    );
    const cnt = await pool.query('SELECT COUNT(*)::int AS c FROM leads WHERE teacher_id = $1', [teacher.id]);

    const live = leads.rows.map((r) => ({
      name: maskName(r.name),
      phone: maskPhone(r.phone),
      status: r.status || '접수완료',
      ago: agoText(r.created_at),
    }));

    const html = renderLanding(S, {
      slug: teacher.slug,
      live,
      stats: { leadCount: cnt.rows[0].c },
    });
    res.set('Content-Type', 'text/html; charset=utf-8').send(html);
  } catch (e) {
    next(e);
  }
});

/* ===== 상담 신청 접수 ===== */
router.post('/s/:slug/apply', async (req, res, next) => {
  try {
    const teacher = await findTeacher(req.params.slug);
    if (!teacher) return res.status(404).json({ ok: false });

    const b = req.body || {};
    // 폼에서 required 를 지우고 보내는 경우도 있으니 서버에서 다시 막는다
    if (!b.name || !b.phone || !b.email) {
      return res.status(400).json({ ok: false, error: '이름 · 연락처 · 이메일은 필수입니다.' });
    }
    if (!/^01[016789][-.]?\d{3,4}[-.]?\d{4}$/.test(String(b.phone).trim())) {
      return res.status(400).json({ ok: false, error: '연락처 형식을 확인해주세요.' });
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(b.email).trim())) {
      return res.status(400).json({ ok: false, error: '이메일 형식을 확인해주세요.' });
    }

    const birth = [b.year, b.month, b.day].filter(Boolean).join('-');
    await pool.query(
      `INSERT INTO leads (teacher_id, name, gender, birth, calendar, hour, region, phone, email, product, memo)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [teacher.id, b.name, b.gender || null, birth || null, b.cal || null, b.hour || null,
       b.region || null, b.phone, b.email || null, b.product || null, b.memo || null]
    );

    // 교육생에게 알림 (실패해도 신청은 정상 처리)
    notify(teacher.id, {
      title: '새 사주 신청이 들어왔어요',
      body: `${b.name || '손님'}님${b.product ? ' · ' + b.product : ''}`,
      url: '/leads',
    }).catch(() => {});

    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

/* ===== 무료사주 입력 ===== */
router.get('/s/:slug/free', async (req, res, next) => {
  try {
    const teacher = await findTeacher(req.params.slug);
    if (!teacher) return res.status(404).render('free/notfound');
    res.render('free/input', { teacher, error: null, form: {} });
  } catch (e) {
    next(e);
  }
});

/* ===== 무료사주 결과 ===== */
router.post('/s/:slug/free/result', async (req, res, next) => {
  try {
    const teacher = await findTeacher(req.params.slug);
    if (!teacher) return res.status(404).render('free/notfound');

    const { name, gender, birthDate, birthTime, calendar, region, timeUnknown, email, phone, agree } = req.body;

    if (!name || !birthDate || !agree) {
      return res.status(400).render('free/input', {
        teacher, error: '이름, 생년월일, 개인정보 수집 동의는 모두 필수입니다.', form: req.body,
      });
    }

    if (!teacher.openai_key) {
      return res.render('free/result', {
        teacher, saju: null, result: null, input: null, logId: null, upsell: UPSELL, mailSent: false,
        error: '현재 무료사주가 준비 중입니다. 잠시 후 다시 시도해주세요.',
      });
    }

    const client = {
      name, gender, birthDate,
      birthTime: timeUnknown ? null : (birthTime || null),
      calendar: calendar || '양력',
      region: region || '서울특별시',
    };

    let saju;
    try {
      saju = calcSaju({
        birthDate,
        birthTime: client.birthTime,
        calendar: client.calendar === '윤달' ? '음력' : client.calendar,
        isLeapMonth: client.calendar === '윤달',
        region: client.region,
        gender: client.gender,
      });
    } catch (e) {
      return res.status(400).render('free/input', {
        teacher, error: '생년월일 형식을 확인해주세요.', form: req.body,
      });
    }

    let result;
    try {
      result = await generateFreeSaju({ client, saju, openaiKey: teacher.openai_key });
    } catch (err) {
      console.error('[AI] 무료사주 생성 실패:', err.message);
      return res.render('free/result', {
        teacher, saju, result: null, input: client, logId: null, upsell: UPSELL, mailSent: false,
        error: '사주 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      });
    }

    // 무료사주 본 사람도 신청자 목록에 기록 (source = 무료사주)
    const lead = await pool.query(
      `INSERT INTO leads (teacher_id, name, gender, birth, calendar, hour, region, status, source)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'무료사주 조회','무료사주') RETURNING id`,
      [teacher.id, client.name, client.gender, client.birthDate, client.calendar,
       client.birthTime || null, client.region]
    );
    const leadId = lead.rows[0].id;

    // 교육생에게 알림 (실패해도 결과 화면은 정상)
    notify(teacher.id, {
      title: '무료사주를 본 손님이 있어요',
      body: `${client.name || '손님'}님이 무료사주를 조회했습니다`,
      url: '/leads',
    }).catch(() => {});

    const token = crypto.randomBytes(16).toString('hex');
    const log = await pool.query(
      `INSERT INTO free_logs (teacher_id, lead_id, input, result, share_token)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [teacher.id, leadId, JSON.stringify(client), JSON.stringify(result), token]
    );

    // 웹에서 바로 결과를 보여주므로 이메일은 보내지 않는다.
    //   (교육생이 직접 만드는 무료사주 PDF 발송은 그대로 유지)

    res.render('free/result', {
      teacher, saju, result, input: client, mailSent: false,
      logId: log.rows[0].id, upsell: UPSELL, error: null,
    });
  } catch (e) {
    next(e);
  }
});

/* ===== 상담 버튼 클릭 → 카카오 링크 ===== */
router.get('/free/go/:logId', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT f.id, u.slug, u.kakao_consult_link
       FROM free_logs f JOIN users u ON u.id = f.teacher_id
       WHERE f.id = $1`,
      [req.params.logId]
    );
    const row = rows[0];
    if (!row) return res.redirect('/');
    await pool.query('UPDATE free_logs SET kakao_clicked = TRUE WHERE id = $1', [req.params.logId]);

    let link = row.kakao_consult_link;
    // 카카오 링크 없으면 랜딩 신청폼으로
    if (!link) return res.redirect('/s/' + row.slug + '#lp-form');
    if (!/^https?:\/\//i.test(link)) link = 'https://' + link;
    res.redirect(link);
  } catch (e) {
    next(e);
  }
});

/* ===== 무료사주 PDF (브라우저 인쇄 → PDF 저장) ===== */
router.get('/free/:logId/pdf', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT f.input, f.result, u.*
       FROM free_logs f JOIN users u ON u.id = f.teacher_id
       WHERE f.id = $1`,
      [req.params.logId]
    );
    const row = rows[0];
    if (!row) return res.status(404).render('free/notfound');

    const client = row.input || {};
    const result = row.result || {};
    const teacher = row;

    let saju = null;
    try {
      saju = calcSaju({
        birthDate: client.birthDate,
        birthTime: client.birthTime || null,
        calendar: client.calendar === '윤달' ? '음력' : (client.calendar || '양력'),
        isLeapMonth: client.calendar === '윤달',
        region: client.region || '서울특별시',
        gender: client.gender,
      });
    } catch (e) { /* 만세력 실패해도 본문은 나가게 */ }

    const html = buildFreePdfHtml({
      teacher, client, saju, result,
      baseUrl: process.env.BASE_URL || '',
    });

    const bar = `
<div class="no-print" style="position:fixed;top:0;left:0;right:0;z-index:999;display:flex;gap:10px;align-items:center;
     justify-content:center;padding:11px;background:#232220;color:#fff;font-family:Pretendard,sans-serif;font-size:13px">
  <span>인쇄 창에서 <b>대상: PDF로 저장</b> · 여백 <b>없음</b> · 배경 그래픽 <b>체크</b></span>
  <button onclick="window.print()" style="padding:7px 16px;border:0;border-radius:5px;background:#c8a45c;color:#241a06;font-weight:800;cursor:pointer">
    PDF로 저장
  </button>
</div>
<div class="no-print" style="height:44px"></div>`;

    res
      .set('Content-Type', 'text/html; charset=utf-8')
      .send(html.replace('<body>', '<body>' + bar));
  } catch (e) {
    next(e);
  }
});

/* ===== 무료사주 PDF — 토큰 링크 (메일로만 나간다) =====
   아이디만 바꿔서 남의 사주를 보는 걸 막으려고 토큰을 쓴다.
   주소가 .pdf 로 끝나야 인앱 브라우저에서 확장자가 붙는다. */
async function loadFree(token) {
  const { rows } = await pool.query(
    `SELECT f.input, f.result, u.*
     FROM free_logs f JOIN users u ON u.id = f.teacher_id
     WHERE f.share_token = $1`,
    [token]
  );
  const row = rows[0];
  if (!row) return null;

  const client = row.input || {};
  let saju = null;
  try {
    saju = calcSaju({
      birthDate: client.birthDate,
      birthTime: client.birthTime || null,
      calendar: client.calendar === '윤달' ? '음력' : (client.calendar || '양력'),
      isLeapMonth: client.calendar === '윤달',
      region: client.region || '서울특별시',
      gender: client.gender,
    });
  } catch (e) { /* 만세력 실패해도 본문은 나간다 */ }

  const html = buildFreePdfHtml({
    teacher: row, client, saju,
    result: row.result || {},
    baseUrl: process.env.BASE_URL || '',
  });
  return { row, client, html };
}

/* 웹에서 읽기 */
router.get('/fr/:token', async (req, res, next) => {
  try {
    const r = await loadFree(req.params.token);
    if (!r) return res.status(404).send('링크가 만료되었거나 잘못된 주소입니다.');

    const bar = `
<style>
  .fb{position:fixed;top:0;left:0;right:0;z-index:999;background:#232220;color:#fff;padding:11px 14px;
    display:flex;gap:12px;align-items:center;justify-content:center;flex-wrap:wrap;
    font-family:Pretendard,-apple-system,'Malgun Gothic',sans-serif;font-size:13px}
  .fb a{padding:11px 24px;border-radius:7px;background:#c8a45c;color:#241a06;
    font-weight:800;font-size:14px;text-decoration:none;min-height:44px;
    display:inline-flex;align-items:center}
  body{padding-top:66px}
  @media(max-width:760px){ .fb a{flex:1 1 100%;justify-content:center} body{padding-top:112px} }
  @media print{ body{padding-top:0} .fb{display:none} }
</style>
<div class="fb no-print">
  <span>${String(r.client.name || '').replace(/[<>&]/g, '')}님의 무료 사주</span>
  <a href="/fr/${req.params.token}/report.pdf">PDF 다운받기</a>
</div>`;

    res
      .set('Content-Type', 'text/html; charset=utf-8')
      .set('X-Robots-Tag', 'noindex, nofollow')
      .send(r.html.replace('<body>', '<body>' + bar));
  } catch (e) {
    next(e);
  }
});

/* PDF 파일로 받기 */
async function downloadFree(req, res) {
  try {
    const r = await loadFree(req.params.token);
    if (!r) return res.status(404).send('링크가 만료되었거나 잘못된 주소입니다.');

    const buf = await htmlToPdf(r.html);
    sendPdf(res, buf, r.client.name, '무료사주');
  } catch (e) {
    console.error('[PDF] 무료사주 파일 생성 실패:', e.message);
    res.status(302).redirect(`/fr/${req.params.token}`);
  }
}
router.get('/fr/:token/report.pdf', downloadFree);
router.get('/fr/:token/download', downloadFree);   // 예전 링크 호환

module.exports = router;
