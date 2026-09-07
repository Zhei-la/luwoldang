/* 상담 응대
 *
 * 손님이 던진 말을 치면 바로 보낼 문장이 나오는 화면이다.
 *
 * ⚠️ API 를 쓰지 않는다. 답은 자료집에 이미 다 적혀 있고, 화면이 찾아만 준다.
 *    비용이 0원이고, 통화 중에도 기다림 없이 바로 뜬다.
 *    그리고 무엇보다 — 상담 문구는 지어내면 안 되는 것이다.
 *
 * /counsel               상황 찾기 · 내 기준
 * /counsel/settings      내 기준 저장 (컨셉 · 제작 기간 · 추가 질문 · 환불)
 * /counsel/gap           「다른 데랑 왜 달라요」 — 이 손님의 보정 차이를 실제로 계산
 */

const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const counsel = require('../services/counsel');
const { requireAuth, requireApproved } = require('../middleware/auth');

/* 교육생만 본다. 손님에게 보여주는 화면이 아니다. */
router.use(requireAuth, requireApproved);

router.get('/counsel', (req, res, next) => {
  try {
    const st = counsel.settingsOf(req.user);
    res.render('dash/counsel', {
      user: req.user, active: 'counsel',
      st,
      situations: counsel.SITUATIONS,
      cats: counsel.CATS,
      danger: counsel.DANGER,
      prevent: counsel.PREVENT.map(([k, v]) => [k, counsel.fill(v, st, '○○')]),
    });
  } catch (e) { next(e); }
});

/* 내 기준 저장 — 이걸 채워두면 문구의 ○○ 가 자동으로 메워진다 */
router.post('/counsel/settings', async (req, res) => {
  try {
    const b = req.body || {};
    const cut = (v, n) => String(v == null ? '' : v).trim().slice(0, n);
    const next = {
      concept: b.concept === 'A' ? 'A' : (b.concept === 'B' ? 'B' : ''),
      days: cut(b.days, 20),
      times: cut(b.times, 20),
      refund: cut(b.refund, 300),
    };
    await pool.query('UPDATE users SET counsel = $1 WHERE id = $2',
      [JSON.stringify(next), req.user.id]);
    res.json({ ok: true, st: next });
  } catch (e) {
    console.error('[상담응대] 기준 저장 실패:', e.message);
    res.status(500).json({ ok: false, error: '저장하지 못했습니다.' });
  }
});

/* 「다른 데랑 왜 달라요」 — 설명 대신 숫자를 보여준다.
   이 손님 시각으로 실제 두 번 계산해서 시주가 갈리는지 본다. */
router.post('/counsel/gap', (req, res) => {
  try {
    const r = counsel.gapCheck(req.body || {});
    if (!r.ok) return res.status(400).json(r);
    const name = String((req.body && req.body.name) || '').trim();
    r.say = counsel.fill(r.say, counsel.settingsOf(req.user), name || '○○');
    res.json(r);
  } catch (e) {
    console.error('[상담응대] 보정 비교 실패:', e.message);
    res.status(500).json({ ok: false, error: '계산하지 못했습니다.' });
  }
});

module.exports = router;
