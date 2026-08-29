/* ============================================================
 * routes/threadsAuto.js — 스레드 자동화
 *
 * 주제 한 단어 → 후킹 26개 스캔 → 글 생성 → 미리보기 → 지침 점검 → 저장.
 *
 * 생성은 교육생 본인 Claude 키로 나간다. 서버 키를 쓰지 않는다.
 * 미리보기 단계에서는 아무것도 저장하지 않는다. 고른 것만 남는다.
 *
 * (발행·예약은 다음 단계에서 붙인다. 지금은 만들고 다듬는 데까지다.)
 * ============================================================ */

const express = require('express');
const router = express.Router();
const { requireAuth, requireApproved } = require('../middleware/auth');

const store = require('../services/threads/store');
const pipeline = require('../services/threads/pipeline');
const { testKey, looksLikeKey } = require('../services/threads/llm');
const { HOOKS } = require('../services/threads/hooks');

const guard = [requireAuth, requireApproved];

/** 오류를 화면이 알아들을 모양으로 */
function fail(res, e, status) {
  const msg = (e && e.message) || '알 수 없는 오류입니다.';
  const hint = (e && e.hint) || '';
  res.status(status || 400).json({ ok: false, error: msg, hint });
}

/* ── 화면 ─────────────────────────────────────────── */

router.get('/threads', ...guard, async (req, res, next) => {
  try {
    const [settings, posts, trash] = await Promise.all([
      store.getSettings(req.user.id),
      store.getPosts(req.user.id),
      store.trashCount(req.user.id),
    ]);
    const ledger = await store.getLedger(req.user.id);
    const used = Object.keys(ledger).length;

    res.render('dash/threads-auto', {
      user: req.user,
      active: 'threads',
      hasKey: !!settings.anthropicKey,
      settings: { ctaLink: settings.ctaLink, allowPublish: settings.allowPublish },
      posts: posts.map(pipeline.view),
      trashCount: trash,
      hookTotal: HOOKS.length,
      hookUsed: used,
      dailyLimit: store.DAILY_LIMIT,
      usedToday: await store.countToday(req.user.id),
    });
  } catch (e) { next(e); }
});

/* 예전 수동 도구는 여기로 옮겨 뒀다 */
router.get('/threads/manual', ...guard, (req, res) => {
  res.render('dash/threads', { user: req.user, active: 'threads' });
});

/* ── 설정 ─────────────────────────────────────────── */

router.get('/api/threads/settings', ...guard, async (req, res, next) => {
  try {
    const s = await store.getSettings(req.user.id);
    /* 키는 통째로 돌려주지 않는다. 들어 있는지와 끝 네 자리만 */
    res.json({
      ok: true,
      s: {
        ctaLink: s.ctaLink,
        allowPublish: s.allowPublish,
        hasKey: !!s.anthropicKey,
        keyTail: s.anthropicKey ? s.anthropicKey.slice(-4) : '',
        facts: s.facts,
        hasVoice: !!s.voicePack,
      },
    });
  } catch (e) { next(e); }
});

router.post('/api/threads/settings', ...guard, async (req, res, next) => {
  try {
    const b = req.body || {};
    const patch = {};

    if (typeof b.ctaLink === 'string') patch.ctaLink = b.ctaLink.trim().slice(0, 300);
    if (typeof b.allowPublish === 'boolean') patch.allowPublish = b.allowPublish;

    if (typeof b.anthropicKey === 'string') {
      const k = b.anthropicKey.trim();
      if (k && !looksLikeKey(k)) {
        return fail(res, { message: 'Claude API 키는 sk-ant- 로 시작합니다. 다시 확인해주세요.' });
      }
      patch.anthropicKey = k;          // 빈 문자열이면 지우는 뜻
    }

    if (Array.isArray(b.facts)) {
      patch.facts = b.facts
        .map((f) => ({ text: String(f && f.text || f || '').trim().slice(0, 300) }))
        .filter((f) => f.text)
        .slice(0, 50);
    }

    const s = await store.saveSettings(req.user.id, patch);
    res.json({ ok: true, hasKey: !!s.anthropicKey });
  } catch (e) { next(e); }
});

/** 키가 진짜 되는지 가장 짧은 질문으로 확인 */
router.post('/api/threads/test-key', ...guard, async (req, res, next) => {
  try {
    const s = await store.getSettings(req.user.id);
    const key = (req.body && req.body.anthropicKey || '').trim() || s.anthropicKey;
    if (!key) return fail(res, { message: '확인할 키가 없습니다.' });
    res.json(await testKey(key));
  } catch (e) { next(e); }
});

/* ── 만들기 ───────────────────────────────────────── */

router.post('/api/threads/generate', ...guard, async (req, res, next) => {
  try {
    const topic = String((req.body && req.body.topic) || '').trim();
    if (!topic) return fail(res, { message: '주제를 적어주세요.' });
    if (topic.length > 120) return fail(res, { message: '주제가 너무 깁니다. 한두 단어면 충분합니다.' });

    let limit = Number((req.body && req.body.limit) || 3);
    if (!(limit >= 1 && limit <= 8)) limit = 3;

    const used = await store.countToday(req.user.id);
    if (used >= store.DAILY_LIMIT) {
      return fail(res, {
        message: '오늘은 ' + store.DAILY_LIMIT + '번까지 만들 수 있습니다.',
        hint: '내일 다시 열립니다. 생성은 본인 Claude 키로 나가기 때문에 실수로 많이 돌지 않게 막아두었습니다.',
      }, 429);
    }

    await store.markRun(req.user.id, topic);
    const out = await pipeline.generate(req.user.id, topic, limit);
    res.json({ ok: true, batch: out, usedToday: used + 1, dailyLimit: store.DAILY_LIMIT });
  } catch (e) {
    if (e.code === 'NO_KEY') return fail(res, e, 400);
    if (String(e.code || '').startsWith('API_')) return fail(res, e, 502);
    if (e.code === 'TIMEOUT' || e.code === 'NETWORK') return fail(res, e, 504);
    if (e.name === 'ParseError' || e.code === 'EMPTY') return fail(res, e, 422);
    next(e);
  }
});

/** 미리보기에서 고른 것만 저장 */
router.post('/api/threads/save', ...guard, async (req, res, next) => {
  try {
    const b = req.body || {};
    const chosen = Array.isArray(b.posts) ? b.posts : [];
    if (!chosen.length) return fail(res, { message: '저장할 글을 골라주세요.' });
    const out = await pipeline.saveChosen(req.user.id, b.batch || {}, chosen);
    res.json({ ok: true, saved: out.saved });
  } catch (e) { next(e); }
});

/* ── 원고 ─────────────────────────────────────────── */

router.get('/api/threads/posts', ...guard, async (req, res, next) => {
  try {
    const list = await store.getPosts(req.user.id, { status: req.query.status });
    res.json({ ok: true, posts: list.map(pipeline.view) });
  } catch (e) { next(e); }
});

router.get('/api/threads/posts/:id', ...guard, async (req, res, next) => {
  try {
    const p = await store.getPost(req.user.id, req.params.id);
    if (!p) return fail(res, { message: '글을 찾지 못했습니다.' }, 404);
    res.json({ ok: true, post: pipeline.view(p) });
  } catch (e) { next(e); }
});

/** 편 내용을 직접 고친다 */
router.post('/api/threads/posts/:id', ...guard, async (req, res, next) => {
  try {
    const parts = (req.body && req.body.parts || [])
      .map((t) => String(t == null ? '' : t)).map((t) => t.trim()).filter(Boolean);
    if (!parts.length) return fail(res, { message: '본문이 비어 있습니다.' });

    const { formOf } = require('../services/threads/length');
    const p = await store.updatePost(req.user.id, req.params.id, {
      parts, form: formOf(parts.length),
    });
    if (!p) return fail(res, { message: '글을 찾지 못했습니다.' }, 404);
    res.json({ ok: true, post: pipeline.view(p) });
  } catch (e) { next(e); }
});

/** 다른 버전으로 다시 쓰기 */
router.post('/api/threads/posts/:id/rewrite', ...guard, async (req, res, next) => {
  try {
    const used = await store.countToday(req.user.id);
    if (used >= store.DAILY_LIMIT) {
      return fail(res, { message: '오늘은 ' + store.DAILY_LIMIT + '번까지 만들 수 있습니다.' }, 429);
    }
    await store.markRun(req.user.id, '다시쓰기');
    const p = await pipeline.rewrite(req.user.id, req.params.id);
    res.json({ ok: true, post: pipeline.view(p) });
  } catch (e) {
    if (e.code === 'NOT_FOUND') return fail(res, e, 404);
    if (e.code === 'NO_KEY') return fail(res, e, 400);
    if (String(e.code || '').startsWith('API_')) return fail(res, e, 502);
    if (e.name === 'ParseError' || e.code === 'EMPTY') return fail(res, e, 422);
    next(e);
  }
});

/** 지우기 — 휴지통을 거친다 */
router.post('/api/threads/delete', ...guard, async (req, res, next) => {
  try {
    const ids = (req.body && req.body.ids || []).map(String).filter(Boolean);
    if (!ids.length) return fail(res, { message: '지울 글을 골라주세요.' });
    const out = await store.deletePosts(req.user.id, ids);
    res.json({ ok: true, deleted: out.deleted, trash: await store.trashCount(req.user.id) });
  } catch (e) { next(e); }
});

/** 가장 최근에 버린 묶음 되살리기 */
router.post('/api/threads/restore', ...guard, async (req, res, next) => {
  try {
    const out = await store.restoreLatest(req.user.id);
    res.json({ ok: true, restored: out.restored, trash: await store.trashCount(req.user.id) });
  } catch (e) { next(e); }
});

module.exports = router;
