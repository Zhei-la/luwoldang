/* 전화상담 상담지
 *
 * 손님과 통화하면서 폰으로 보는 화면이다.
 * 사주를 하나도 모르는 사람이 그대로 읽으면 상담이 되게 만든다.
 *
 * /leads/:id/callsheet   신청자 한 명의 상담지
 * /callsheet             생년월일을 직접 넣어 열어보는 곳 (연습·시험용)
 */

const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { calcSaju } = require('../services/manseryeok');
const { normalizeBirth, parseHour } = require('../services/birth');
const callsheet = require('../services/callsheet');
const { requireAuth, requireApproved } = require('../middleware/auth');

/* 교육생만 본다. 손님에게 보여주는 화면이 아니다. */
router.use(requireAuth, requireApproved);

/* 만 나이. 생일이 안 지났으면 한 살 뺀다. */
function ageOf(birth) {
  const b = normalizeBirth(birth);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(b || ''))) return null;
  const [y, m, d] = b.split('-').map(Number);
  const now = new Date();
  let a = now.getFullYear() - y;
  const mm = now.getMonth() + 1;
  if (mm < m || (mm === m && now.getDate() < d)) a -= 1;
  return a >= 0 && a < 130 ? a : null;
}

/* 「1994-11-08」 → 「1994년 11월 8일」. 통화 첫마디에서 읽는다. */
function birthText(birth, calendar) {
  const b = normalizeBirth(birth);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(b || ''))) return String(birth || '');
  const [y, m, d] = b.split('-').map(Number);
  const cal = calendar && calendar !== '양력' ? ' (' + calendar + ')' : '';
  return y + '년 ' + m + '월 ' + d + '일' + cal;
}

/* 「07:30」 → 「아침 7시 30분」. 숫자만 읽으면 딱딱하다. */
function timeText(hour) {
  const t = parseHour(hour);
  if (!/^\d{1,2}:\d{2}$/.test(String(t || ''))) return '';
  const [h, mi] = t.split(':').map(Number);
  const part = h < 5 ? '새벽' : h < 12 ? '아침' : h < 18 ? '낮' : h < 21 ? '저녁' : '밤';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return part + ' ' + h12 + '시' + (mi ? ' ' + mi + '분' : '');
}

function sajuOf(o) {
  return calcSaju({
    birthDate: normalizeBirth(o.birth),
    birthTime: parseHour(o.hour),
    calendar: o.calendar === '윤달' ? '음력' : (o.calendar || '양력'),
    isLeapMonth: o.calendar === '윤달',
    region: o.region || '서울특별시',
    useLocalSolarTime: o.use_local_time !== false,
    gender: o.gender,
  });
}

function whoOf(o, teacher) {
  return {
    name: (o.name || '고객').replace(/님$/, ''),
    gender: o.gender || '',
    age: ageOf(o.birth),
    birthText: birthText(o.birth, o.calendar),
    timeText: timeText(o.hour),
    region: o.region || '',
    teacher: (teacher && (teacher.mail_name || teacher.name)) || '루월당',
    ask: o.memo || '',
    phone: o.phone || '',
    product: o.product || '',
  };
}

/* ── 신청자 한 명의 상담지 ─────────────────────────────── */
router.get('/leads/:id/callsheet', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM leads WHERE id = $1 AND teacher_id = $2',
      [req.params.id, req.user.id]
    );
    const lead = rows[0];
    if (!lead) return res.status(404).send('신청 내역을 찾을 수 없습니다.');
    if (!lead.birth) return res.status(400).send('생년월일이 없어 상담지를 만들 수 없습니다.');

    let saju;
    try { saju = sajuOf(lead); }
    catch (e) { return res.status(400).send('생년월일 형식을 확인해주세요.'); }

    const sheet = callsheet.build(saju, whoOf(lead, req.user));
    res.render('dash/callsheet', {
      user: req.user, active: 'leads',
      lead, saju, sheet, backTo: '/leads/' + lead.id,
    });
  } catch (e) { next(e); }
});

/* ── 직접 넣어보는 곳 ──────────────────────────────────── */
router.get('/callsheet', async (req, res, next) => {
  try {
    const q = req.query || {};
    if (!q.birth) {
      return res.render('dash/callsheet-new', { user: req.user, active: 'leads', q });
    }
    const who = {
      name: q.name || '고객', gender: q.gender || '', birth: q.birth,
      hour: q.hour || '', calendar: q.calendar || '양력', region: q.region || '서울특별시',
      memo: q.ask || '',
    };
    let saju;
    try { saju = sajuOf(who); }
    catch (e) { return res.status(400).send('생년월일 형식을 확인해주세요.'); }

    const sheet = callsheet.build(saju, whoOf(who, req.user));
    res.render('dash/callsheet', {
      user: req.user, active: 'leads',
      lead: null, saju, sheet, backTo: '/callsheet',
    });
  } catch (e) { next(e); }
});

/* ── 용어 검색 (화면에서 못 쓸 때를 위한 예비 길) ──────────
   화면은 용어를 통째로 들고 있어 여기 안 물어봐도 된다.
   외부에서 쓰거나 용어가 아주 많아지면 이쪽으로 돌린다. */
router.get('/api/callsheet/terms', (req, res) => {
  const q = String(req.query.q || '').trim();
  res.json({ ok: true, items: q ? callsheet.search(q).slice(0, 20) : [] });
});

module.exports = router;
