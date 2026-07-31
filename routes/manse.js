/* ============================================================
 * routes/manse.js — 만세력(명리) 계산기
 *
 * 원래 따로 돌던 cb_saju 프로그램을 루월당 안으로 넣은 것.
 * 화면은 views/dash/manse.ejs, 계산은 services/cbEngine.js.
 *
 * 원본 프로그램의 API 요청 형식을 그대로 받는다.
 * (그래야 원본 화면 코드를 거의 안 고치고 쓸 수 있다)
 *
 * ⚠️ 원본에 있던 "저장" 기능(/api/saved)은 뺐다.
 *    Railway는 배포할 때마다 파일이 초기화돼서 저장해도 사라진다.
 *    필요해지면 DB(pdfs·leads처럼)에 넣는 방식으로 다시 만들어야 한다.
 * ============================================================ */

const express = require('express');
const router = express.Router();
const { requireAuth, requireApproved } = require('../middleware/auth');
const engine = require('../services/cbEngine');
const { REGIONS } = require('../services/cbRegions');

const 명식표상세 = engine['명식표상세'];
const 궁합분석 = engine['궁합분석'];

/* 로그인 + 승인된 교육생만 */
router.use('/manse', requireAuth, requireApproved);
router.use('/api/manse', requireAuth, requireApproved);

/* ── 화면 ── */
router.get('/manse', (req, res) => {
  res.render('dash/manse', { user: req.user, active: 'manse' });
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

module.exports = router;
