const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { calcSaju } = require('../services/manseryeok');
const { generateFreeSaju, UPSELL } = require('../services/ai');

async function findTeacher(slug) {
  const { rows } = await pool.query(
    "SELECT * FROM users WHERE slug = $1 AND status = 'approved'",
    [slug]
  );
  return rows[0];
}

// 무료사주 입력 화면
router.get('/s/:slug', async (req, res, next) => {
  try {
    const teacher = await findTeacher(req.params.slug);
    if (!teacher) return res.status(404).render('free/notfound');
    res.render('free/input', { teacher, error: null, form: {} });
  } catch (e) {
    next(e);
  }
});

// 무료사주 결과 생성
router.post('/s/:slug/result', async (req, res, next) => {
  try {
    const teacher = await findTeacher(req.params.slug);
    if (!teacher) return res.status(404).render('free/notfound');

    const { name, gender, birthDate, birthTime, calendar, region, timeUnknown, agree } = req.body;

    if (!name || !birthDate || !agree) {
      return res.status(400).render('free/input', {
        teacher,
        error: '이름, 생년월일, 개인정보 수집 동의는 필수입니다.',
        form: req.body,
      });
    }

    if (!teacher.openai_key) {
      return res.render('free/result', {
        teacher, saju: null, result: null, input: null, logId: null, upsell: UPSELL,
        error: '현재 무료사주가 준비 중입니다. 잠시 후 다시 시도해주세요.',
      });
    }

    const client = {
      name,
      gender,
      birthDate,
      birthTime: timeUnknown ? null : (birthTime || null),
      calendar: calendar || '양력',
      region,
    };

    let saju;
    try {
      saju = calcSaju({
        birthDate,
        birthTime: client.birthTime,
        calendar: client.calendar,
        region: client.region,
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
        teacher, saju, result: null, input: client, logId: null, upsell: UPSELL,
        error: '사주 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      });
    }

    const log = await pool.query(
      'INSERT INTO free_logs (teacher_id, input, result) VALUES ($1, $2, $3) RETURNING id',
      [teacher.id, JSON.stringify(client), JSON.stringify(result)]
    );

    res.render('free/result', { teacher, saju, result, input: client, logId: log.rows[0].id, upsell: UPSELL, error: null });
  } catch (e) {
    next(e);
  }
});

// 상담 버튼 클릭 → 기록 후 카카오 링크로 이동
router.get('/free/go/:logId', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT f.id, u.kakao_consult_link
       FROM free_logs f JOIN users u ON u.id = f.teacher_id
       WHERE f.id = $1`,
      [req.params.logId]
    );
    const row = rows[0];
    if (!row) return res.redirect('/');
    await pool.query('UPDATE free_logs SET kakao_clicked = TRUE WHERE id = $1', [req.params.logId]);

    let link = row.kakao_consult_link;
    if (!link) return res.send('상담 링크가 아직 등록되지 않았습니다.');
    if (!/^https?:\/\//i.test(link)) link = 'https://' + link;
    res.redirect(link);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
