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
const solarTime = require('../services/solarTime');
const router = express.Router();
const { requireAuth, requireApproved } = require('../middleware/auth');
const engine = require('../services/cbEngine');
/* 엔진은 서머타임을 모른다. 넘기기 직전에 얹고, 엔진이 적은 보정 문구를 바로잡는다. */
const { 서머타임반영, 보정문구, 서머타임안내 } = require('../services/dstCorrection');
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
    /* ⚠️ 화면은 지금 기준(135도)으로 적힌 보정분을 보낸다.
       1954-03-21~1961-08-09 는 표준자오선이 127.5도라 30분을 되돌려야
       한다. 안 하면 그때 태어난 분의 시주가 한 시진 밀린다. */
    correctionMinutes: typeof p.correctionMinutes === 'number'
      ? solarTime.adjust(p.correctionMinutes, Number(p.year), Number(p.month), Number(p.day))
      : undefined,
    birthRegionLabel: typeof p.birthRegionLabel === 'string' ? p.birthRegionLabel : undefined,
  };
}

/**
 * 일간 칸에도 십성을 적어 준다.
 *
 * 엔진은 십성(천간) 줄의 일간 자리에 십성 대신 「일간(나)」라고만 쓴다.
 * 그래서 네 칸 중 한 칸만 십성이 비어 보인다. 다른 만세력은 여기에도 십성이 뜬다.
 * 일간은 저와 같은 천간이라 십성으로는 늘 <b>비견</b>이다 —
 * 오행도 음양도 같으니 정의상 그렇다.
 *
 * ⚠️ 엔진 파일(cbEngine.js)은 명리학자가 준 것이라 손대지 않는다.
 *    내보내기 직전에 글자만 바꾼다.
 */
function 일간십성(out) {
  if (!out || typeof out !== 'string') return out;
  return out
    /* 표(PDF·컬러) — 십성 줄의 일간 칸 */
    .split('<td>일간(나)</td>').join('<td>비견 (나)</td>')
    /* LLM 에 넘기는 글 — 기둥 설명 줄 */
    .split('(일간, 나)').join('(일간, 나 · 십성 비견)');
}

/**
 * 서머타임 구간 태생에게만 「왜 1시간을 뺐는지」 안내를 붙인다. 화면은 보정 문구 옆 ⓘ 를 누르면 펼친다.
 * 아무도 해당하지 않으면 dstNotice 키 자체를 보내지 않는다 — 응답이 예전과 똑같다.
 * idx 는 몇 번째 사람인지(0=본인·개인, 1=상대방). 화면이 idx 번째 「기본정보」 줄·표머리에 ⓘ 를 붙인다.
 * @param {Array<{ who: string, x: object }>} people  who: 궁합이면 '본인 (이름)', 개인이면 ''
 */
function 서머타임안내응답(people) {
  const list = people.map((p, idx) => ({ idx, who: p.who, lines: 서머타임안내(p.x) })).filter((p) => p.lines);
  return list.length ? { dstNotice: list } : {};
}
const 누구 = (role, name) => (String(name || '').trim() ? `${role} (${String(name).trim()})` : role);

const boundary = (b) => (b === 'split' ? 'splitJasi' : 'jasi');
const 야자라벨 = (b) => (b === 'split' ? '적용(야자시)' : '미적용');

/* ── 개인 명식 ── */
router.post('/api/manse/myeongsik', (req, res) => {
  try {
    const b = req.body || {};
    const x = 서머타임반영(toInfo(b));
    const r = 보정문구(명식표상세(x.info, boundary(b.jasi), 야자라벨(b.jasi), {
      name: typeof b.name === 'string' ? b.name : '',
      concern: typeof b.concern === 'string' ? b.concern : '',
      세운년수: Number(b['세운년수']) || 5,
      월운개월수: Number(b['월운개월수']) || 12,
      연애상태: typeof b['연애상태'] === 'string' ? b['연애상태'] : '',
    }), x);
    res.json({
      ok: true,
      text: 일간십성(r.text), pdfHtml: 일간십성(r.pdfHtml), colorHtml: 일간십성(r.colorHtml),
      name: String(b.name || '').trim(),
      ...서머타임안내응답([{ who: '', x }]),
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
    const x1 = 서머타임반영(toInfo(b.person1));
    const x2 = 서머타임반영(toInfo(b.person2));
    const p1 = { info: x1.info, name: String((b.person1 && b.person1.name) || '') };
    const p2 = { info: x2.info, name: String((b.person2 && b.person2.name) || '') };
    const r = 보정문구(보정문구(궁합분석(p1, p2,
      typeof b.relationType === 'string' ? b.relationType : '',
      boundary(b.jasi), 야자라벨(b.jasi),
      { concern: typeof b.concern === 'string' ? b.concern : '' }), x1), x2);
    res.json({
      ok: true,
      text: 일간십성(r.text), pdfHtml: 일간십성(r.pdfHtml), colorHtml: 일간십성(r.colorHtml),
      person1Name: p1.name.trim(), person2Name: p2.name.trim(),
      ...서머타임안내응답([{ who: 누구('본인', p1.name), x: x1 }, { who: 누구('상대방', p2.name), x: x2 }]),
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
