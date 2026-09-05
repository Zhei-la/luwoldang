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
const { testKey, MODELS, DEFAULT_MODEL } = require('../services/threads/llm');
const voice = require('../services/threads/voice');
/* 올리기·예약은 자동 규칙과 같은 길을 타야 한다. 그래서 서비스로 뺐다. */
const { readyToSend, bodyToSend } = require('../services/threads/publish');
const rules = require('../services/threads/rules');
const autopost = require('../services/threads/autopost');
const FORMS = require('../services/threads/forms');
const VOICES = require('../services/threads/voices');
const { numberParts, formOf } = require('../services/threads/length');
const { checkPost } = require('../services/threads/guideline');
const { HOOKS } = require('../services/threads/hooks');
const { ALL: TOPIC_LIST, HOT: HOT_TOPICS } = require('../services/threads/topics');

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
        model: settings.model,
      },
      models: MODELS,
      defaultModel: DEFAULT_MODEL,
      voicePack: settings.voicePack || null,
      voiceMin: voice.MIN_SAMPLES,
      voiceLines: voice.MIN_LINES,
      voicePresets: VOICES.PRESETS,
      voiceMode: settings.voiceMode || '',
      intro: settings.intro || { name: '', career: '', sample: '' },
      daily: settings.daily
        ? {
            body: settings.daily.body || settings.daily.sample || '',
            tail: settings.daily.tail || '',
            mode: settings.daily.mode || (settings.daily.asReply ? 'reply' : 'single'),
          }
        : { body: '', tail: '', mode: 'single' },
      formList: FORMS.FORMS,
      formMax: FORMS.MAX_PICK,
      dayNames: rules.DAY_NAMES,
      autoRules: (await rules.list(req.user.id)).map((r) => Object.assign({}, r, {
        next: rules.upcoming(r, 24 * 7).slice(0, 3).map((u) => u.sendAt.toISOString()),
        warning: rules.sameTimeWarning(r.slots),
      })),
      linksThisWeek: await tail.linksThisWeek(req.user.id),
      posts: posts.map((x) => pipeline.view(x)),
      trashCount: trash,
      hookTotal: HOOKS.length,
      hookUsed: Object.keys(ledger).length,
      topics: TOPIC_LIST,
      hotTopics: HOT_TOPICS,
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
    /* 모델 이름은 그대로 받는다. 되는지는 「연결 확인」이 실제로 불러서 판단한다.
       목록에 없는 모델을 적어 쓸 수 있어야 새 모델이 나와도 배포 없이 넘어간다. */
    if (typeof b.model === 'string') patch.model = b.model.trim().slice(0, 60);
    /* 말투: 'mine'(내 글에서 뽑은 것) 또는 프리셋 이름. 그 외 값은 버린다. */
    if (typeof b.voiceMode === 'string') {
      const m = b.voiceMode.trim();
      patch.voiceMode = (m === 'mine' || m === '' || VOICES.byId(m)) ? m : '';
    }
    /* 인사글 재료. 셋 다 비면 아예 지운다 — 빈 값이 남아 있으면
       프롬프트가 「등록됐다」고 잘못 읽는다. */
    if (b.intro && typeof b.intro === 'object') {
      const name   = String(b.intro.name   || '').trim().slice(0, 60);
      const career = String(b.intro.career || '').trim().slice(0, 200);
      const sample = String(b.intro.sample || '').trim().slice(0, 2000);
      patch.intro = (name || career || sample) ? { name, career, sample } : null;
    }
    /* 오늘의 운세 틀. 본문이 비면 통째로 지운다.
       mode — chain(두 편으로 나눔) / reply(본문+첫 댓글) / single(한 편) */
    if (b.daily && typeof b.daily === 'object') {
      const body = String(b.daily.body || '').trim().slice(0, 2000);
      const tail = String(b.daily.tail || '').trim().slice(0, 2000);
      let mode = ['chain', 'reply', 'single'].indexOf(b.daily.mode) >= 0 ? b.daily.mode : 'single';
      /* 이어지는 글이 비었는데 나눈다고 하면 앞뒤가 안 맞는다 */
      if (!tail) mode = 'single';
      patch.daily = body
        ? { body, tail, mode, numbered: b.daily.numbered !== false }
        : null;
    }
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
    res.json(await testKey(req.user.openai_key, (req.body || {}).model));
  } catch (e) { next(e); }
});

/* ── 내 말투 ──────────────────────────────────────── */

/** 지금 잡혀 있는 말투 팩 */
router.get('/api/threads/voice', ...guard, async (req, res, next) => {
  try {
    const s = await store.getSettings(req.user.id);
    res.json({ voicePack: s.voicePack || null, min: voice.MIN_SAMPLES });
  } catch (e) { next(e); }
});

/**
 * 붙여넣은 내 글에서 말투를 뽑는다.
 * text(덩어리 하나) 또는 samples(배열) 둘 다 받는다.
 */
router.post('/api/threads/voice', ...guard, async (req, res, next) => {
  try {
    if (!req.user.openai_key) {
      return fail(res, { message: 'OpenAI 키가 없습니다. 「무료사주 · API 설정」에서 먼저 등록해주세요.' });
    }
    const b = req.body || {};
    const input = Array.isArray(b.samples) ? b.samples : b.text;
    const out = await voice.analyze(req.user.id, req.user.openai_key, input);
    res.json(out);
  } catch (e) {
    if (e.code === 'TOO_FEW') return fail(res, e, 400);
    outsideFail(res, e, next);
  }
});

/** 뽑힌 말투를 사람이 손본다 */
router.patch('/api/threads/voice', ...guard, async (req, res, next) => {
  try {
    res.json({ voicePack: await voice.patch(req.user.id, req.body || {}) });
  } catch (e) {
    if (e.code === 'NO_PACK') return fail(res, e, 400);
    next(e);
  }
});

/** 말투를 지운다. 지침의 기본 말투로 돌아간다. */
router.delete('/api/threads/voice', ...guard, async (req, res, next) => {
  try {
    await voice.clear(req.user.id);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

/* ── 자동 규칙 ────────────────────────────────────── */

/** 규칙 목록 + 앞으로 언제 올라가는지 */
router.get('/api/threads/rules', ...guard, async (req, res, next) => {
  try {
    const list = await rules.list(req.user.id);
    res.json({
      ok: true,
      rules: list.map((r) => Object.assign({}, r, {
        next: rules.upcoming(r, 24 * 7).slice(0, 5).map((u) => ({
          label: rules.slotLabel(u.slot),
          at: u.sendAt.toISOString(),
        })),
        warning: rules.sameTimeWarning(r.slots),
      })),
    });
  } catch (e) { next(e); }
});

/** 규칙 만들기·고치기. id 가 없으면 새로 만든다. */
router.post('/api/threads/rules', ...guard, async (req, res, next) => {
  try {
    const b = req.body || {};
    const s = await store.getSettings(req.user.id);
    const hasIntro = !!(s.intro && (s.intro.name || s.intro.career || s.intro.sample));
    const patch = rules.clean(b, { hasIntro });

    /* 틀을 하나도 못 고르는 경우가 있다 — 인사형만 골랐는데 인사글 재료가 없을 때다.
       그대로 저장하면 왜 안 도는지 알 수가 없다. */
    if (Array.isArray(b.forms) && b.forms.length && !patch.forms.length) {
      return fail(res, {
        message: '고른 글 틀을 쓸 수 없습니다.',
        hint: '인사·무료사주 틀은 설정의 「인사글 재료」를 먼저 채워야 합니다.',
      });
    }
    const saved = await rules.save(req.user.id, b.id || null, patch);
    res.json({
      ok: true,
      rule: saved,
      warning: rules.sameTimeWarning(saved.slots),
      /* 언제 올라가는지가 이 화면의 알맹이다. 저장하자마자 보여준다. */
      next: rules.upcoming(saved, 24 * 7).slice(0, 3).map((u) => u.sendAt.toISOString()),
    });
  } catch (e) {
    if (e.code === 'TOO_MANY') return fail(res, e);
    next(e);
  }
});

router.delete('/api/threads/rules/:id', ...guard, async (req, res, next) => {
  try {
    await rules.remove(req.user.id, req.params.id);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

/** 기다리지 않고 지금 한 번 돌린다 (확인용) */
router.post('/api/threads/rules/:id/run', ...guard, async (req, res, next) => {
  try {
    if (!req.user.openai_key) {
      return fail(res, { message: 'OpenAI 키가 없습니다. 「무료사주 · API 설정」에서 먼저 등록해주세요.' });
    }
    const rule = await rules.get(req.user.id, req.params.id);
    if (!rule) return fail(res, { message: '규칙을 찾지 못했습니다.' }, 404);
    if (!rule.slots.length) return fail(res, { message: '언제 올릴지를 먼저 정해주세요.' });

    const out = await autopost.runRule(Object.assign({}, rule, {
      userId: req.user.id, openaiKey: req.user.openai_key,
    }));
    res.json({
      ok: true,
      made: out.made.length,
      errors: out.errors,
      slots: out.made.map((m) => new Date(m.at).toISOString()),
    });
  } catch (e) { outsideFail(res, e, next); }
});

/**
 * 앞으로 올라갈 글들. 자동 규칙이 미리 만들어둔 것을 시각 순으로 보여준다.
 *
 * 36시간 앞서 만들어두기 때문에, 마음에 안 드는 글을 **올라가기 전에**
 * 볼 수 있어야 한다. 안 그러면 자동이 아니라 도박이 된다.
 */
router.get('/api/threads/upcoming', ...guard, async (req, res, next) => {
  try {
    const settings = await store.getSettings(req.user.id);
    const all = await store.getPosts(req.user.id);
    const list = all
      .filter((p) => p.slotAt && p.status !== 'published')
      .sort((a, b) => new Date(a.slotAt) - new Date(b.slotAt))
      .map((p) => {
        const v = pipeline.view(p);
        return {
          id: v.id,
          slotAt: v.slotAt,
          status: v.status,
          topic: v.topic,
          postType: v.postType,
          parts: v.parts,
          replyText: v.replyText || '',
          passHard: v.check.passHard,
          bad: (v.check.rows || []).filter((r) => r.hard && !r.ok).map((r) => r.label),
          lengths: v.lengths,
        };
      });
    res.json({ ok: true, posts: list });
  } catch (e) { next(e); }
});

/**
 * 예정된 글 하나를 다시 만든다.
 * topic 을 주면 그 주제로, 안 주면 **같은 주제로** 다시 만든다.
 */
router.post('/api/threads/upcoming/:id/regenerate', ...guard, async (req, res, next) => {
  try {
    if (!req.user.openai_key) {
      return fail(res, { message: 'OpenAI 키가 없습니다. 「무료사주 · API 설정」에서 먼저 등록해주세요.' });
    }
    const old = await store.getPost(req.user.id, req.params.id);
    if (!old) return fail(res, { message: '글을 찾지 못했습니다.' }, 404);
    if (old.status === 'published') return fail(res, { message: '이미 올린 글입니다.' }, 409);

    const b = req.body || {};
    const topic = String(b.topic || old.topic || '').trim();
    if (!topic) return fail(res, { message: '주제를 정해주세요.' });

    const used = await store.countToday(req.user.id);
    if (used >= store.DAILY_LIMIT) {
      return fail(res, { message: '오늘은 ' + store.DAILY_LIMIT + '번까지 만들 수 있습니다.' }, 429);
    }
    await store.markRun(req.user.id, '예정 글 다시 만들기');

    const form = FORMS.byId(b.form) || null;
    const out = await pipeline.generate(req.user.id, req.user.openai_key, topic, 1, {
      form,
      at: old.slotAt ? new Date(old.slotAt) : null,
    });
    const made = (out.posts || [])[0];
    if (!made) return fail(res, { message: '글이 비어 있습니다. 다시 눌러주세요.' }, 422);

    /* 자리는 그대로 두고 내용만 갈아끼운다. Zernio 에 이미 걸어둔 것이 있으면
       그건 그대로 남으므로, 예약을 다시 걸어야 한다는 뜻으로 상태를 되돌린다. */
    const saved = await store.updatePost(req.user.id, old.id, {
      parts: made.parts,
      replyText: made.replyText || '',
      numbered: !!made.numbered,
      form: made.form,
      postType: made.postType,
      cta: made.cta,
      status: 'draft',
      zernioId: null,
      scheduledFor: null,
      error: null,
    });
    const settings = await store.getSettings(req.user.id);
    res.json({ ok: true, post: pipeline.view(saved), topic });
  } catch (e) { outsideFail(res, e, next); }
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

    /* 'yes' 꼭 받기 · 'no' 조르지 않기 · 그 외는 글마다 알아서 */
    const ask = String((req.body && req.body.askComments) || '');
    const askComments = ask === 'yes' ? true : ask === 'no' ? false : null;

    await store.markRun(req.user.id, topic);
    const out = await pipeline.generate(req.user.id, req.user.openai_key, topic, limit, { askComments });
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

/* 글 하나의 고정멘트를 켜고 끈다 */
router.post('/api/threads/posts/:id/tail', ...guard, async (req, res, next) => {
  try {
    const post = await store.getPost(req.user.id, req.params.id);
    if (!post) return fail(res, { message: '글을 찾지 못했습니다.' }, 404);
    const off = !!(req.body && (req.body.off === true || req.body.off === 'true'));
    const saved = await store.updatePost(req.user.id, post.id, { noTail: off });
    res.json({ ok: true, noTail: off, post: pipeline.view(saved) });
  } catch (e) { next(e); }
});

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
