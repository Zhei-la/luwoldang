/**
 * routes/covers.js — 교육생 "내 표지" 관리
 * server.js 에서 requireAuth 가 걸린 뒤에 마운트된다 (pagesRouter 계열).
 */

const express = require('express');
const router = express.Router();
const { requireAuth, requireApproved } = require('../middleware/auth');
const store = require('../services/coverStore');
const { builtinSets } = require('../services/coverSets');
const { builtinPapers } = require('../services/bgPapers');

// 표지를 지정할 수 있는 리포트 종류
const TYPES = ['종합사주', '신년운세', '연애운', '결혼운', '재물운', '건강운', '연인궁합', '무료사주'];

router.use(requireAuth, requireApproved);

/* 내 표지 화면 */
router.get('/covers', async (req, res, next) => {
  try {
    const mine = await store.listMyCovers(req.user.id);
    const custom = await store.listCustomSets();
    const chosen = await store.myChosenSet(req.user.id);
    const papers = builtinPapers();
    const chosenPaper = await store.myBgPaper(req.user.id);
    // 기본 세트 + 관리자 커스텀 세트 합치기
    const sets = builtinSets().concat(
      custom.map((c) => ({ key: c.set_key, name: c.name, kinds: null, custom: true }))
    );
    res.render('dash/covers', {
      user: req.user,
      active: 'covers',
      types: TYPES,
      mine,
      sets,
      chosen,
      papers,
      chosenPaper,
    });
  } catch (e) {
    next(e);
  }
});

/* 세트 고르기 */
router.post('/covers/choose-set', async (req, res) => {
  try {
    await store.chooseSet(req.user.id, (req.body || {}).setKey || null);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

/* 본문 배경지 고르기 */
router.post('/covers/choose-paper', async (req, res) => {
  try {
    await store.chooseBgPaper(req.user.id, (req.body || {}).paperKey || null);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

/* 기본 세트 표지 미리보기 이미지 (커스텀 세트만 — 기본세트는 public 파일 직접) */
router.get('/covers/set-img/:setKey/:type', async (req, res) => {
  try {
    const row = await store.getSetItemImg(req.params.setKey, req.params.type);
    if (!row) return res.status(404).end();
    const m = /^data:(image\/[a-z.+-]+);base64,(.*)$/i.exec(row.img);
    if (!m) return res.status(415).end();
    res.set('Content-Type', m[1]);
    res.send(Buffer.from(m[2], 'base64'));
  } catch (e) { res.status(500).end(); }
});

/* 내 낱개 표지 미리보기 이미지 */
router.get('/covers/my-img/:type', async (req, res) => {
  try {
    const img = await store.getMyCoverImg(req.user.id, req.params.type);
    if (!img) return res.status(404).end();
    const m = /^data:(image\/[a-z.+-]+);base64,(.*)$/i.exec(img);
    if (!m) return res.status(415).end();
    res.set('Content-Type', m[1]);
    res.set('Cache-Control', 'no-store');
    res.send(Buffer.from(m[2], 'base64'));
  } catch (e) { res.status(500).end(); }
});

/* 내 표지 올리기 (data URI) */
router.post('/covers/upload', async (req, res) => {
  try {
    const { type, img, style, brandTop } = req.body || {};
    if (TYPES.indexOf(type) < 0) return res.status(400).json({ ok: false, error: '알 수 없는 리포트 종류입니다.' });

    await store.saveMyCover(req.user.id, {
      type,
      img,
      style: style || 'plain',   // 직접 만든 표지는 보통 이름까지 다 그려서 옴 → 안 얹음
      brandTop: brandTop != null ? Number(brandTop) : 18.2,
    });
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

/* 내 표지 삭제 (→ 관리자 기본 / 코드 기본으로 되돌아감) */
router.post('/covers/delete', async (req, res) => {
  try {
    await store.deleteMyCover(req.user.id, (req.body || {}).type);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

module.exports = router;
