/**
 * routes/covers.js — 교육생 "내 표지" 관리
 * server.js 에서 requireAuth 가 걸린 뒤에 마운트된다 (pagesRouter 계열).
 */

const express = require('express');
const router = express.Router();
const { requireAuth, requireApproved } = require('../middleware/auth');
const store = require('../services/coverStore');

// 표지를 지정할 수 있는 리포트 종류
const TYPES = ['종합사주', '신년운세', '연애운', '결혼운', '재물운', '건강운', '무료사주'];

router.use(requireAuth, requireApproved);

/* 내 표지 화면 */
router.get('/covers', async (req, res, next) => {
  try {
    const mine = await store.listMyCovers(req.user.id);
    res.render('dash/covers', {
      user: req.user,
      active: 'covers',
      types: TYPES,
      mine,
    });
  } catch (e) {
    next(e);
  }
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
