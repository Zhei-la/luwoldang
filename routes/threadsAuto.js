/* ============================================================
 * routes/threadsAuto.js — 스레드 자동화
 *
 * 주제 한 단어 → 후킹 26개 스캔 → 글 생성 → 미리보기 → 지침 점검
 *   → 저장 → 스레드에 바로 올리거나 시간을 정해 예약.
 *
 * 글은 교육생 본인 OpenAI 키로 만든다 (무료사주가 쓰는 그 키).
 * 올리는 건 Zernio 가 대신한다 — 페이스북 개발자 등록·심사·토큰 갱신이 없다.
 * 예약도 Zernio 가 맡아서, 우리 서버가 꺼져 있어도 제 시각에 나간다.
 * ============================================================ */

const express = require('express');
const router = express.Router();
const { requireAuth, requireApproved } = require('../middleware/auth');

const store = require('../services/threads/store');
const pipeline = require('../services/threads/pipeline');
const zernio = require('../services/threads/zernio');
const { testKey } = require('../services/threads/llm');
const { numberParts, formOf } = require('../services/threads/length');
const { checkPost } = require('../services/threads/guideline');
const { HOOKS } = require('../services/threads/hooks');
const { ALL: TOPIC_LIST } = require('../services/threads/topics');

const guard = [requireAuth, requireApproved];

function fail(res, e, status) {
  res.status(status || 400).json({
    ok: false,
    error: (e && e.message) || '알 수 없는 오류입니다.',
    hint: (e && e.hint) || '',
  });
}

/** 바깥과 이야기하다 난 오류를 상태 코드로 옮긴다 */
function outsideFail(res, e, next) {
  if (e.code === 'NO_KEY' || e.code === 'NO_ACCOUNT') return fail(res, e, 400);
  if (e.code === 'NOT_FOUND') return fail(res, e, 404);
  if (String(e.code || '').startsWith('API_')) return fail(res, e, 502);
  if (String(e.code || '').startsWith('ZERNIO_')) return fail(res, e, 502);
  if (e.code === 'TIMEOUT' || e.code === 'NETWORK') return fail(res, e, 504);
  if (e.name === 'ParseError' || e.code === 'EMPTY') return fail(res, e, 422);
  return next(e);
}

/* ── 화면 ─────────────────────────────────────────── */

router.get('/threads', ...guard, async (req, res, next) => {
  try {
    const [settings, posts, trash, ledger] = await Promise.all([
      store.getSettings(req.user.id),
      store.getPosts(req.user.id),
      store.trashCount(req.user.id),
      store.getLedger(req.user.id),
    ]);

    res.render('dash/threads-auto', {
      user: req.user,
      active: 'threads',
      hasKey: !!req.user.openai_key,
      zernio: {
        hasKey: !!settings.zernioKey,
        connected: !!(settings.zernioKey && settings.zernioAccountId),
        username: settings.zernioUsername,
        allowPublish: settings.allowPublish,
      },
      settings: { ctaLink: settings.ctaLink },
      posts: posts.map(pipeline.view),
      trashCount: trash,
      hookTotal: HOOKS.length,
      hookUsed: Object.keys(ledger).length,
      topics: TOPIC_LIST,
      dailyLimit: store.DAILY_LIMIT,
      usedToday: await store.countToday(req.user.id),
    });
  } catch (e) { next(e); }
});

/* 예전 수동 도구 — 탭에서는 감췄고 토큰 안내 때문에 주소만 남겨둔다 */
router.get('/threads/manual', ...guard, (req, res) => {
  res.render('dash/threads', { user: req.user, active: 'threads' });
});

/* ── 설정 ─────────────────────────────────────────── */

router.get('/api/threads/settings', ...guard, async (req, res, next) => {
  try {
    const s = await store.getSettings(req.user.id);
    res.json({
      ok: true,
      s: {
        ctaLink: s.ctaLink,
        allowPublish: s.allowPublish,
        hasOpenaiKey: !!req.user.openai_key,
        zernioHasKey: !!s.zernioKey,
        zernioConnected: !!(s.zernioKey && s.zernioAccountId),
        zernioUsername: s.zernioUsername,
        facts: s.facts,
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
    if (Array.isArray(b.facts)) {
      patch.facts = b.facts
        .map((f) => ({ text: String((f && f.text) || f || '').trim().slice(0, 300) }))
        .filter((f) => f.text).slice(0, 50);
    }
    await store.saveSettings(req.user.id, patch);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

/** OpenAI 키가 진짜 되는지 (무료사주에 등록한 그 키를 그대로 본다) */
router.post('/api/threads/test-key', ...guard, async (req, res, next) => {
  try {
    if (!req.user.openai_key) {
      return fail(res, { message: 'OpenAI 키가 없습니다. 「무료사주 · API 설정」에서 먼저 등록해주세요.' });
    }
    res.json(await testKey(req.user.openai_key));
  } catch (e) { next(e); }
});

/* ── Zernio 잇기 ──────────────────────────────────── */

/**
 * 열쇠를 넣는다. 넣자마자 연결된 스레드 계정을 물어와 돌려준다.
 * 계정이 하나뿐이면 그것으로 바로 정한다.
 */
router.post('/api/threads/connect', ...guard, async (req, res, next) => {
  try {
    const key = String((req.body && req.body.key) || '').trim();
    if (!key) return fail(res, { message: 'Zernio 열쇠를 넣어주세요.' });

    const out = await zernio.check(key);
    if (!out.ok) return fail(res, { message: out.message }, 400);

    const patch = { zernioKey: key };
    if (out.accounts.length === 1) {
      patch.zernioAccountId = out.accounts[0].id;
      patch.zernioUsername = out.accounts[0].username;
    }
    await store.saveSettings(req.user.id, patch);

    res.json({
      ok: true,
      accounts: out.accounts,
      chosen: patch.zernioAccountId || '',
      message: out.message,
    });
  } catch (e) { outsideFail(res, e, next); }
});

/** 연결된 스레드 계정을 다시 물어본다 */
router.get('/api/threads/accounts', ...guard, async (req, res, next) => {
  try {
    const s = await store.getSettings(req.user.id);
    if (!s.zernioKey) return fail(res, { message: 'Zernio 열쇠를 먼저 넣어주세요.' });
    const accounts = await zernio.listAccounts(s.zernioKey);
    res.json({ ok: true, accounts: accounts, chosen: s.zernioAccountId });
  } catch (e) { outsideFail(res, e, next); }
});

/** 어느 계정에 올릴지 고른다 */
router.post('/api/threads/account', ...guard, async (req, res, next) => {
  try {
    const id = String((req.body && req.body.id) || '').trim();
    if (!id) return fail(res, { message: '계정을 골라주세요.' });

    const s = await store.getSettings(req.user.id);
    const accounts = await zernio.listAccounts(s.zernioKey);
    const hit = accounts.find((a) => String(a.id) === id);
    if (!hit) return fail(res, { message: '그 계정을 찾지 못했습니다. 목록을 새로 불러와 주세요.' });

    await store.saveSettings(req.user.id, {
      zernioAccountId: hit.id, zernioUsername: hit.username,
    });
    res.json({ ok: true, username: hit.username });
  } catch (e) { outsideFail(res, e, next); }
});

router.post('/api/threads/disconnect', ...guard, async (req, res, next) => {
  try {
    await store.saveSettings(req.user.id, {
      zernioKey: '', zernioAccountId: '', zernioUsername: '', allowPublish: false,
    });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

/* ── 만들기 ───────────────────────────────────────── */

router.post('/api/threads/generate', ...guard, async (req, res, next) => {
  try {
    const topic = String((req.body && req.body.topic) || '').trim();
    if (!topic) return fail(res, { message: '주제를 적어주세요.' });
    if (topic.length > 120) return fail(res, { message: '주제가 너무 깁니다. 한두 단어면 충분합니다.' });
    if (!req.user.openai_key) {
      return fail(res, {
        message: 'OpenAI 키가 없습니다.',
        hint: '「무료사주 · API 설정」에서 등록하시면 여기서도 바로 쓰입니다. 따로 넣지 않으셔도 됩니다.',
      });
    }

    let limit = Number((req.body && req.body.limit) || 3);
    if (!(limit >= 1 && limit <= 8)) limit = 3;

    const used = await store.countToday(req.user.id);
    if (used >= store.DAILY_LIMIT) {
      return fail(res, {
        message: '오늘은 ' + store.DAILY_LIMIT + '번까지 만들 수 있습니다.',
        hint: '내일 다시 열립니다. 생성은 본인 OpenAI 키로 나가기 때문에 실수로 많이 돌지 않게 막아두었습니다.',
      }, 429);
    }

    await store.markRun(req.user.id, topic);
    const out = await pipeline.generate(req.user.id, req.user.openai_key, topic, limit);
    res.json({ ok: true, batch: out, usedToday: used + 1, dailyLimit: store.DAILY_LIMIT });
  } catch (e) { outsideFail(res, e, next); }
});

router.post('/api/threads/save', ...guard, async (req, res, next) => {
  try {
    const b = req.body || {};
    const chosen = Array.isArray(b.posts) ? b.posts : [];
    if (!chosen.length) return fail(res, { message: '저장할 글을 골라주세요.' });
    const out = await pipeline.saveChosen(req.user.id, b.batch || {}, chosen);
    res.json({ ok: true, saved: out.saved, ids: out.ids });
  } catch (e) { next(e); }
});

/* ── 원고 ─────────────────────────────────────────── */

router.get('/api/threads/posts', ...guard, async (req, res, next) => {
  try {
    const list = await store.getPosts(req.user.id, { status: req.query.status });
    res.json({ ok: true, posts: list.map(pipeline.view) });
  } catch (e) { next(e); }
});

router.post('/api/threads/posts/:id', ...guard, async (req, res, next) => {
  try {
    const parts = ((req.body && req.body.parts) || [])
      .map((t) => String(t == null ? '' : t).trim()).filter(Boolean);
    if (!parts.length) return fail(res, { message: '본문이 비어 있습니다.' });
    const p = await store.updatePost(req.user.id, req.params.id, {
      parts, form: formOf(parts.length),
    });
    if (!p) return fail(res, { message: '글을 찾지 못했습니다.' }, 404);
    res.json({ ok: true, post: pipeline.view(p) });
  } catch (e) { next(e); }
});

router.post('/api/threads/posts/:id/rewrite', ...guard, async (req, res, next) => {
  try {
    if (!req.user.openai_key) return fail(res, { message: 'OpenAI 키가 없습니다.' });
    const used = await store.countToday(req.user.id);
    if (used >= store.DAILY_LIMIT) {
      return fail(res, { message: '오늘은 ' + store.DAILY_LIMIT + '번까지 만들 수 있습니다.' }, 429);
    }
    await store.markRun(req.user.id, '다시쓰기');
    const p = await pipeline.rewrite(req.user.id, req.user.openai_key, req.params.id);
    res.json({ ok: true, post: pipeline.view(p) });
  } catch (e) { outsideFail(res, e, next); }
});

router.post('/api/threads/delete', ...guard, async (req, res, next) => {
  try {
    const ids = ((req.body && req.body.ids) || []).map(String).filter(Boolean);
    if (!ids.length) return fail(res, { message: '지울 글을 골라주세요.' });
    const out = await store.deletePosts(req.user.id, ids);
    res.json({ ok: true, deleted: out.deleted, trash: await store.trashCount(req.user.id) });
  } catch (e) { next(e); }
});

router.post('/api/threads/restore', ...guard, async (req, res, next) => {
  try {
    const out = await store.restoreLatest(req.user.id);
    res.json({ ok: true, restored: out.restored, trash: await store.trashCount(req.user.id) });
  } catch (e) { next(e); }
});

/* ── 올리기 ───────────────────────────────────────── */

/** 올리기 전에 꼭 보는 것들. 화면과 서버가 같은 기준을 쓴다. */
async function readyToSend(userId, post) {
  const s = await store.getSettings(userId);
  if (!s.zernioKey) {
    return { ok: false, why: 'Zernio 열쇠가 없습니다. 설정에서 먼저 이어주세요.' };
  }
  if (!s.zernioAccountId) {
    return { ok: false, why: '올릴 스레드 계정을 고르지 않았습니다. 설정에서 골라주세요.' };
  }
  if (!s.allowPublish) {
    return { ok: false, why: '올리기가 잠겨 있습니다. 설정에서 「스레드에 올리기 허용」을 켜주세요.' };
  }
  const check = checkPost(post);
  if (!check.passHard) {
    const bad = check.rows.filter((r) => r.hard && !r.ok).map((r) => r.label).join(', ');
    return { ok: false, why: '지침에 걸립니다 — ' + bad };
  }
  return { ok: true, settings: s };
}

/** 지금 바로 올린다 */
router.post('/api/threads/posts/:id/publish', ...guard, async (req, res, next) => {
  try {
    const post = await store.getPost(req.user.id, req.params.id);
    if (!post) return fail(res, { message: '글을 찾지 못했습니다.' }, 404);
    if (post.status === 'published') return fail(res, { message: '이미 올린 글입니다.' }, 409);

    const ready = await readyToSend(req.user.id, post);
    if (!ready.ok) return fail(res, { message: ready.why });

    try {
      const out = await zernio.send({
        apiKey: ready.settings.zernioKey,
        accountId: ready.settings.zernioAccountId,
        parts: post.form === 'chain' ? numberParts(post.parts) : post.parts,
        mode: 'publish',
      });
      const saved = await store.updatePost(req.user.id, post.id, {
        status: 'published', zernioId: out.id, permalink: out.permalink,
        publishedAt: new Date().toISOString(), error: null,
      });
      res.json({ ok: true, post: pipeline.view(saved), permalink: out.permalink });
    } catch (e) {
      await store.updatePost(req.user.id, post.id, {
        status: 'failed', error: String(e.message || e).slice(0, 500),
      });
      return fail(res, { message: e.message }, 502);
    }
  } catch (e) { next(e); }
});

/** 시간을 정해 예약한다. 그 시각에 올리는 건 Zernio 가 맡는다. */
router.post('/api/threads/posts/:id/schedule', ...guard, async (req, res, next) => {
  try {
    const when = new Date(String((req.body && req.body.at) || ''));
    if (isNaN(when.getTime())) return fail(res, { message: '시간을 정해주세요.' });
    if (when.getTime() < Date.now() - 60000) return fail(res, { message: '지난 시각으로는 예약할 수 없습니다.' });

    const post = await store.getPost(req.user.id, req.params.id);
    if (!post) return fail(res, { message: '글을 찾지 못했습니다.' }, 404);
    if (post.status === 'published') return fail(res, { message: '이미 올린 글입니다.' }, 409);

    const ready = await readyToSend(req.user.id, post);
    if (!ready.ok) return fail(res, { message: ready.why });

    try {
      const out = await zernio.send({
        apiKey: ready.settings.zernioKey,
        accountId: ready.settings.zernioAccountId,
        parts: post.form === 'chain' ? numberParts(post.parts) : post.parts,
        mode: 'schedule',
        scheduledFor: when.toISOString(),
      });
      const saved = await store.updatePost(req.user.id, post.id, {
        status: 'scheduled', scheduledFor: when.toISOString(),
        zernioId: out.id, error: null,
      });
      res.json({ ok: true, post: pipeline.view(saved) });
    } catch (e) {
      return fail(res, { message: e.message }, 502);
    }
  } catch (e) { next(e); }
});

/** 예약을 물린다. Zernio 쪽 예약도 같이 지운다. */
router.post('/api/threads/posts/:id/unschedule', ...guard, async (req, res, next) => {
  try {
    const post = await store.getPost(req.user.id, req.params.id);
    if (!post) return fail(res, { message: '글을 찾지 못했습니다.' }, 404);
    if (post.status !== 'scheduled') return fail(res, { message: '예약된 글이 아닙니다.' });

    if (post.zernioId) {
      const s = await store.getSettings(req.user.id);
      /* Zernio 쪽에서 못 지워도 우리 쪽 예약은 푼다.
         못 지운 채로 두면 화면에는 없는데 올라가버린다 — 그건 더 나쁘다. */
      try { await zernio.remove(s.zernioKey, post.zernioId); }
      catch (e) {
        return fail(res, {
          message: 'Zernio 에서 예약을 지우지 못했습니다: ' + e.message,
          hint: 'zernio.com 대시보드에서 직접 지워주세요. 그대로 두면 제 시각에 올라갑니다.',
        }, 502);
      }
    }

    const saved = await store.updatePost(req.user.id, post.id, {
      status: 'draft', scheduledFor: null, zernioId: null,
    });
    res.json({ ok: true, post: pipeline.view(saved) });
  } catch (e) { next(e); }
});

module.exports = router;
