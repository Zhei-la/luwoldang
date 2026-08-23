/* ============================================================
 * routes/manse.js — 만세력(명리) 계산기
 *
 * 원래 따로 돌던 cb_saju 프로그램을 루월당 안으로 넣은 것.
 * 화면은 views/dash/manse.ejs, 계산은 services/cbEngine.js.
 *
 * 원본 프로그램의 API 요청 형식을 그대로 받는다.
 * (그래야 원본 화면 코드를 거의 안 고치고 쓸 수 있다)
 *
 * 저장 기능은 DB(manse_saved)에 넣는다.
 * 예전에는 교육생 브라우저 안에만 저장해서 PC 에서 저장한 것이 폰에서 안 보였다.
 * 계정에 묶어 두면 어느 기기에서 열어도 같은 목록이 나온다.
 * ============================================================ */

const express = require('express');
const router = express.Router();
const { requireAuth, requireApproved } = require('../middleware/auth');
const engine = require('../services/cbEngine');
const { REGIONS } = require('../services/cbRegions');
const pool = require('../db').pool;

const 명식표상세 = engine['명식표상세'];
const 궁합분석 = engine['궁합분석'];

/* 로그인 + 승인된 교육생만 */
router.use('/manse', requireAuth, requireApproved);
router.use('/api/manse', requireAuth, requireApproved);

/* ── 화면 ── */
router.get('/manse', async (req, res) => {
  /* 사주 신청자 화면에서 '만세력 보기'로 넘어오면 그 사람 정보를 미리 채워준다.
     같은 정보를 두 번 입력하지 않아도 된다. */
  let prefill = null;
  const from = Number(req.query.from);
  if (from) {
    try {
      const { rows } = await pool.query(
        `SELECT name, gender, birth, calendar, hour, region FROM leads
          WHERE id = $1 AND teacher_id = $2`,
        [from, req.user.id]
      );
      if (rows[0]) prefill = rows[0];
    } catch (e) {
      console.error('[만세력] 신청자 불러오기 실패:', e.message);
    }
  }
  res.render('dash/manse', { user: req.user, active: 'manse', prefill });
});

/* ── 지역 목록 (진태양시 보정분 포함) ── */
router.get('/api/manse/regions', (req, res) => {
  res.json({ ok: true, regions: REGIONS });
});

/** 요청 본문 한 사람분 → 엔진 입력 */
function toInfo(p) {
  p = p || {};
  return {
    year: Number(p.year),
    month: Number(p.month),
    day: Number(p.day),
    hour: Number(p.hour != null ? p.hour : 0),
    minute: Number(p.minute != null ? p.minute : 0),
    isLunar: !!p.isLunar,
    isLeapMonth: !!p.isLeapMonth,
    gender: p.gender === 'female' ? 'female' : 'male',
    hourUnknown: !!p.hourUnknown,
    ganjiSelect: typeof p.ganjiSelect === 'string' ? p.ganjiSelect : '',
    correctionMinutes: typeof p.correctionMinutes === 'number' ? p.correctionMinutes : undefined,
    birthRegionLabel: typeof p.birthRegionLabel === 'string' ? p.birthRegionLabel : undefined,
  };
}

const boundary = (b) => (b === 'split' ? 'splitJasi' : 'jasi');
const 야자라벨 = (b) => (b === 'split' ? '적용(야자시)' : '미적용');

/* ── 개인 명식 ── */
router.post('/api/manse/myeongsik', (req, res) => {
  try {
    const b = req.body || {};
    const r = 명식표상세(toInfo(b), boundary(b.jasi), 야자라벨(b.jasi), {
      name: typeof b.name === 'string' ? b.name : '',
      concern: typeof b.concern === 'string' ? b.concern : '',
      세운년수: Number(b['세운년수']) || 5,
      월운개월수: Number(b['월운개월수']) || 12,
      연애상태: typeof b['연애상태'] === 'string' ? b['연애상태'] : '',
    });
    res.json({
      ok: true, text: r.text, pdfHtml: r.pdfHtml, colorHtml: r.colorHtml,
      name: String(b.name || '').trim(),
    });
  } catch (e) {
    console.error('[만세력] 명식 계산 실패:', e.message);
    res.status(500).json({ ok: false, error: e.message });
  }
});

/* ── 궁합 ── */
router.post('/api/manse/gunghap', (req, res) => {
  try {
    const b = req.body || {};
    const p1 = { info: toInfo(b.person1), name: String((b.person1 && b.person1.name) || '') };
    const p2 = { info: toInfo(b.person2), name: String((b.person2 && b.person2.name) || '') };
    const r = 궁합분석(p1, p2,
      typeof b.relationType === 'string' ? b.relationType : '',
      boundary(b.jasi), 야자라벨(b.jasi),
      { concern: typeof b.concern === 'string' ? b.concern : '' });
    res.json({
      ok: true, text: r.text, pdfHtml: r.pdfHtml, colorHtml: r.colorHtml,
      person1Name: p1.name.trim(), person2Name: p2.name.trim(),
    });
  } catch (e) {
    console.error('[만세력] 궁합 계산 실패:', e.message);
    res.status(500).json({ ok: false, error: e.message });
  }
});

/* ══════════════════════════════════════════
   저장된 사주 — 계정에 묶어 저장한다
   ══════════════════════════════════════════ */

/** 개인 사주인지 궁합인지 판정 */
function kindOf(d) {
  return (d && (d.kind === 'gunghap' || (d.person1 && d.person2))) ? '궁합' : '개인';
}
/** 파일 이름 (기존 방식 그대로: 이름_YYMMDD.json) */
function nameOf(d) {
  const p = (n) => String(n).padStart(2, '0');
  const t = new Date();
  const day = String(t.getFullYear()).slice(2) + p(t.getMonth() + 1) + p(t.getDate());
  const base = kindOf(d) === '궁합'
    ? (((d.person1 && d.person1.name) || '본인') + '_' + ((d.person2 && d.person2.name) || '상대') + '_궁합')
    : (d.name || '이름없음');
  return base + '_' + day + '.json';
}

/* 목록 */
router.get('/api/manse/saved', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT filename, type, data,
              to_char(COALESCE(updated_at, created_at, NOW()), 'YYMMDD') AS saved_at
         FROM manse_saved
        WHERE teacher_id = $1 ORDER BY updated_at DESC`,
      [req.user.id]
    );
    const profiles = rows.map((r) => {
      /* 예전 표에서는 글자로 저장돼 있을 수 있다 */
      let d = r.data;
      if (typeof d === 'string') { try { d = JSON.parse(d); } catch (e) { d = {}; } }
      return Object.assign({}, d || {}, {
        filename: r.filename,
        type: r.type || '개인',
        savedAt: d && d.savedAt ? d.savedAt : r.saved_at,   // 저장한 날짜
      });
    });
    res.json({ ok: true, profiles });
  } catch (e) {
    console.error('[만세력] 저장 목록 실패:', e.message);
    res.status(500).json({ ok: false, error: e.message });
  }
});

/* 저장 (같은 이름이 있으면 덮어쓸지 먼저 물어본다) */
router.post('/api/manse/saved', async (req, res) => {
  try {
    const d = req.body || {};
    const overwrite = !!d.overwrite;
    const data = Object.assign({}, d);
    delete data.overwrite;

    const filename = nameOf(data);
    const type = kindOf(data);

    const dup = await pool.query(
      'SELECT 1 FROM manse_saved WHERE teacher_id = $1 AND filename = $2',
      [req.user.id, filename]
    );
    if (dup.rowCount && !overwrite) {
      return res.json({ ok: true, needsConfirm: true, filename });
    }

    await pool.query(
      `INSERT INTO manse_saved (teacher_id, filename, type, data)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (teacher_id, filename)
       DO UPDATE SET data = EXCLUDED.data, type = EXCLUDED.type, updated_at = NOW()`,
      [req.user.id, filename, type, JSON.stringify(data)]
    );
    res.json({ ok: true, filename });
  } catch (e) {
    console.error('[만세력] 저장 실패:', e.message);
    res.status(500).json({ ok: false, error: e.message });
  }
});

/* 삭제 */
router.delete('/api/manse/saved', async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM manse_saved WHERE teacher_id = $1 AND filename = $2',
      [req.user.id, String(req.query.filename || '')]
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

/* 브라우저에만 있던 예전 저장분을 계정으로 옮긴다 (한 번만 실행된다) */
router.post('/api/manse/saved/import', async (req, res) => {
  try {
    const list = Array.isArray(req.body && req.body.profiles) ? req.body.profiles : [];
    let moved = 0;
    for (const row of list) {
      const filename = row.filename || nameOf(row);
      const data = Object.assign({}, row);
      delete data.filename; delete data.type;
      const r = await pool.query(
        `INSERT INTO manse_saved (teacher_id, filename, type, data)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (teacher_id, filename) DO NOTHING`,
        [req.user.id, filename, row.type || kindOf(row), JSON.stringify(data)]
      );
      moved += r.rowCount;
    }
    res.json({ ok: true, moved });
  } catch (e) {
    console.error('[만세력] 옮기기 실패:', e.message);
    res.status(500).json({ ok: false, error: e.message });
  }
});

module.exports = router;
