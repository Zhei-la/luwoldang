/**
 * push.js — 브라우저 알림 켜기/끄기
 *
 *   GET  /push/key        알림 인증용 공개키 + 현재 등록된 기기 수
 *   POST /push/subscribe  이 기기에서 알림 받기
 *   POST /push/unsubscribe 이 기기 알림 끄기
 *   POST /push/test       테스트 알림 보내기
 */

const express = require('express');
const router = express.Router();
const { requireAuth, requireApproved } = require('../middleware/auth');
const push = require('../services/push');

const AUTH = [requireAuth, requireApproved];

router.get('/push/key', AUTH, async (req, res) => {
  res.json({
    ok: true,
    ready: push.pushReady(),
    key: push.publicKey(),
    devices: await push.subCount(req.user.id),
  });
});

router.post('/push/subscribe', AUTH, async (req, res) => {
  try {
    await push.saveSub(req.user.id, (req.body || {}).sub);
    res.json({ ok: true, devices: await push.subCount(req.user.id) });
  } catch (e) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

router.post('/push/unsubscribe', AUTH, async (req, res) => {
  try {
    const ep = (req.body || {}).endpoint;
    if (ep) await push.removeSub(ep);
    res.json({ ok: true, devices: await push.subCount(req.user.id) });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.post('/push/test', AUTH, async (req, res) => {
  const n = await push.notify(req.user.id, {
    title: '루월당 알림 테스트',
    body: '알림이 정상적으로 오고 있습니다 🎉',
    url: '/leads',
  });
  res.json({ ok: n > 0, sent: n });
});

module.exports = router;
