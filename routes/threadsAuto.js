/* ============================================================
 * routes/threadsAuto.js — 스레드 자동화
 *
 * 주제 한 단어 → 후킹 26개 스캔 → 글 생성 → 미리보기 → 지침 점검
 *   → 저장해두거나, 그 자리에서 바로 올리거나 예약.
 *
 * 글은 교육생 본인 OpenAI 키로 만든다 (무료사주가 쓰는 그 키).
 * 올리는 건 Zernio 가 대신한다. 계정은 여러 개 등록해두고 골라 쓴다.
 * ============================================================ */

const express = require('express');
const router = express.Router();
const { requireAuth, requireApproved } = require('../middleware/auth');

const store = require('../services/threads/store');
const accounts = require('../services/threads/accounts');
const pipeline = require('../services/threads/pipeline');
const zernio = require('../services/threads/zernio');
const tail = require('../services/threads/tail');
const scheduler = require('../services/threads/scheduler');
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
    const [settings, posts, trash, ledger, accList, live] = await Promise.all([
      store.getSettings(req.user.id),
      store.getPosts(req.user.id),
      store.trashCount(req.user.id),
      store.getLedger(req.user.id),
      accounts.list(req.user.id),
      accounts.active(req.user.id),
    ]);

    res.render('dash/threads-auto', {
      user: req.user,
      active: 'threads',
      hasKey: !!req.user.openai_key,
      accounts: accList,
      account: live ? { id: live.id, username: live.username } : null,
      allowPublish: settings.allowPublish,
      settings: {
        ctaLink: settings.ctaLink,
        dailyLine: settings.dailyLine,
        ctaPerWeek: settings.ctaPerWeek,
      },
      linksThisWeek: await tail.linksThisWeek(req.user.id),
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

/* 예전 수동 도구 — 탭에서는 감췄고 안내 때문에 주소만 남겨둔다 */
router.get('/threads/manual', ...guard, (req, res) => {
  res.render('dash/threads', { user: req.user, active: 'threads' });
});

/* ── 설정 ─────────────────────────────────────────── */

router.post('/api/threads/settings', ...guard, async (req, res, next) => {
  try {
    const b = req.body || {};
    const patch = {};
    if (typeof b.ctaLink === 'string') patch.ctaLink = b.ctaLink.trim().slice(0, 300);
    if (typeof b.dailyLine === 'string') patch.dailyLine = b.dailyLine.trim().slice(0, 400);
    /* 3번을 넘기면 광고 계정으로 몰려 정지될 수 있다. 화면에서도 막지만 여기서도 조인다. */
    if (b.ctaPerWeek != null) patch.ctaPerWeek = Math.max(0, Math.min(3, Number(b.ctaPerWeek) || 0));
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

/* ── 올릴 계정 ────────────────────────────────────── */

/** 등록해둔 계정 목록 */
router.get('/api/threads/accounts', ...guard, async (req, res, next) => {
  try {
    res.json({ ok: true, accounts: await accounts.list(req.user.id) });
  } catch (e) { next(e); }
});

/**
 * 열쇠를 넣으면 그 열쇠에 붙은 스레드 계정을 모두 등록한다.
 * 다른 Zernio 계정의 열쇠를 또 넣으면 그 계정들도 함께 쌓인다.
 */
router.post('/api/threads/accounts/connect', ...guard, async (req, res, next) => {
  try {
    const key = String((req.body && req.body.key) || '').trim();
    if (!key) return fail(res, { message: 'Zernio 열쇠를 넣어주세요.' });

    const found = await zernio.listAccounts(key);
    if (!found.length) {
      return fail(res, {
        message: '이 열쇠에 연결된 스레드 계정이 없습니다.',
        hint: 'zernio.com 의 Connections 에서 스레드 계정을 먼저 이어주세요.',
      });
    }

    for (const a of found) {
      await accounts.add(req.user.id, key, a.id, a.username);
    }
    res.json({
      ok: true,
      added: found.length,
      accounts: await accounts.list(req.user.id),
      message: '계정 ' + found.length + '개를 등록했습니다.',
    });
  } catch (e) { outsideFail(res, e, next); }
});

/** 올릴 계정을 바꾼다 */
router.post('/api/threads/accounts/use', ...guard, async (req, res, next) => {
  try {
    const id = Number((req.body && req.body.id) || 0);
    if (!id) return fail(res, { message: '계정을 골라주세요.' });
    const ok = await accounts.setActive(req.user.id, id);
    if (!ok) return fail(res, { message: '그 계정을 찾지 못했습니다.' }, 404);
    const live = await accounts.active(req.user.id);
    res.json({ ok: true, account: { id: live.id, username: live.username } });
  } catch (e) { next(e); }
});

/** 계정을 뺀다 */
router.post('/api/threads/accounts/remove', ...guard, async (req, res, next) => {
  try {
    const id = Number((req.body && req.body.id) || 0);
    if (!id) return fail(res, { message: '뺄 계정을 골라주세요.' });
    await accounts.remove(req.user.id, id);
    res.json({ ok: true, accounts: await accounts.list(req.user.id) });
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
    /* 5분 주기만 믿으면 「시간이 지났는데 아직 예약중」 인 순간이 생긴다.
       목록을 열 때 한 번 맞춰준다. */
    await scheduler.checkUser(req.user.id);
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
  const acc = await accounts.active(userId);

  if (!acc) {
    return { ok: false, why: '올릴 스레드 계정이 없습니다. 설정에서 먼저 등록해주세요.' };
  }
  if (!s.allowPublish) {
    return { ok: false, why: '올리기가 잠겨 있습니다. 설정에서 「스레드에 올리기 허용」을 켜주세요.' };
  }
  const check = checkPost(post);
  if (!check.passHard) {
    const bad = check.rows.filter((r) => r.hard && !r.ok).map((r) => r.label).join(', ');
    return { ok: false, why: '지침에 걸립니다 — ' + bad };
  }
  return { ok: true, acc: acc };
}

/**
 * 실제로 나갈 본문을 만든다 — 번호 붙이기 + 꼬리말 한 편.
 * 발행과 예약이 똑같이 써야 한다. 한쪽만 고치면 예약한 글에는 멘트가 안 붙는다.
 */
async function bodyToSend(userId, post) {
  const settings = await store.getSettings(userId);
  const t = await tail.build(userId, settings);
  const body = post.form === 'chain' ? numberParts(post.parts) : post.parts;
  return { parts: tail.attach(body, t.text), tail: t };
}

/** 지금 바로 올린다 */
router.post('/api/threads/posts/:id/publish', ...guard, async (req, res, next) => {
  try {
    const post = await store.getPost(req.user.id, req.params.id);
    if (!post) return fail(res, { message: '글을 찾지 못했습니다.' }, 404);
    if (post.status === 'published') return fail(res, { message: '이미 올린 글입니다.' }, 409);

    const ready = await readyToSend(req.user.id, post);
    if (!ready.ok) return fail(res, { message: ready.why });

    const send = await bodyToSend(req.user.id, post);
    try {
      const out = await zernio.send({
        apiKey: ready.acc.key,
        accountId: ready.acc.accountId,
        parts: send.parts,
        mode: 'publish',
      });
      const saved = await store.updatePost(req.user.id, post.id, {
        status: 'published', zernioId: out.id, permalink: out.permalink,
        publishedAt: new Date().toISOString(), error: null,
        accountId: ready.acc.id, accountName: ready.acc.username,
        linkSent: send.tail.withLink,
      });
      res.json({
        ok: true, post: pipeline.view(saved),
        permalink: out.permalink, account: ready.acc.username,
        tail: send.tail,
      });
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

    const send = await bodyToSend(req.user.id, post);
    try {
      const out = await zernio.send({
        apiKey: ready.acc.key,
        accountId: ready.acc.accountId,
        parts: send.parts,
        mode: 'schedule',
        scheduledFor: when.toISOString(),
      });
      const saved = await store.updatePost(req.user.id, post.id, {
        status: 'scheduled', scheduledFor: when.toISOString(),
        zernioId: out.id, error: null,
        accountId: ready.acc.id, accountName: ready.acc.username,
        linkSent: send.tail.withLink,
      });
      res.json({
        ok: true, post: pipeline.view(saved),
        account: ready.acc.username, tail: send.tail,
      });
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
      const acc = await accounts.active(req.user.id);
      /* Zernio 쪽에서 못 지우면 우리 쪽도 풀지 않는다.
         화면에는 없는데 시간 되면 올라가버리는 게 제일 나쁘다. */
      if (acc) {
        try { await zernio.remove(acc.key, post.zernioId); }
        catch (e) {
          return fail(res, {
            message: 'Zernio 에서 예약을 지우지 못했습니다: ' + e.message,
            hint: 'zernio.com 대시보드에서 직접 지워주세요. 그대로 두면 제 시각에 올라갑니다.',
          }, 502);
        }
      }
    }

    const saved = await store.updatePost(req.user.id, post.id, {
      status: 'draft', scheduledFor: null, zernioId: null,
      /* 나가지 않았으니 이번 주 링크 횟수도 도로 비워준다 */
      linkSent: false,
    });
    res.json({ ok: true, post: pipeline.view(saved) });
  } catch (e) { next(e); }
});

module.exports = router;
