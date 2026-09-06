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
const { formOf } = require('../services/threads/length');
const { checkPost } = require('../services/threads/guideline');
const { HOOKS } = require('../services/threads/hooks');
const today = require('../services/threads/today');
const jiji = require('../services/threads/jiji');
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


/**
 * 규칙 목록에 「지금 도는지, 안 돌면 왜인지」를 붙인다.
 * 화면과 API 가 같은 답을 줘야 해서 한 곳에 둔다.
 */
async function rulesWithStatus(req) {
  const [settings, acc, list, accList] = await Promise.all([
    store.getSettings(req.user.id),
    accounts.active(req.user.id),
    rules.list(req.user.id),
    accounts.list(req.user.id),
  ]);
  /* 규칙이 계정을 집어뒀으면 그 계정이 아직 있는지 봐야 한다.
     지운 계정을 붙들고 있으면 영영 안 나가는데 이유를 알 수 없다. */
  const accIds = {};
  accList.forEach((a) => { accIds[a.id] = a; });

  /* ⚠️ 계정을 바꿔도 규칙이 그대로 다 떴다. 루사주와 AI이안이 같은 목록을
        보니 어느 것이 어느 계정 것인지 알 수가 없었다.
        지금 고른 계정 것만 보여준다 — 계정을 안 집은 규칙은
        「지금 고른 계정」으로 나가므로 어느 계정에서 보든 보여준다. */
  const here = acc ? acc.id : null;
  const mine = accList.length > 1
    ? list.filter((r) => !r.accountId || r.accountId === here)
    : list;
  const posts = await store.getPosts(req.user.id);
  const now = Date.now();
  const until = now + 36 * 3600 * 1000;

  return mine.map((r) => {
    /* 이 규칙이 앞으로 일주일 안에 이미 채워둔 자리 개수 */
    const filled = posts.filter((p) => p.ruleId === r.id && p.slotAt &&
      new Date(p.slotAt).getTime() >= now && new Date(p.slotAt).getTime() <= until).length;
    return Object.assign({}, r, {
      next: rules.upcoming(r, 24 * 7).slice(0, 3).map((u) => u.sendAt.toISOString()),
      /* 같은 시각만 보는 게 아니다. 다른 규칙과 같은 날 같은 틀이면
         글이 거의 똑같이 나가서 스팸으로 걸린다. */
      warning: rules.sameTimeWarning(r.slots) || rules.clashWarning(r, list),
      /* 계정을 안 집은 규칙은 지금 고른 계정으로 나간다 — 그렇다고 알려준다 */
      follows: !r.accountId && accList.length > 1,
      status: rules.diagnose(r, {
        hasKey: !!req.user.openai_key,
        allowPublish: settings.allowPublish,
        hasAccount: r.accountId ? !!accIds[r.accountId] : !!acc,
        accountName: r.accountId && accIds[r.accountId]
          ? (accIds[r.accountId].username || '') : '',
        filled,
      }),
    });
  });
}


/**
 * 이 글이 자동으로 올라갈지, 안 간다면 왜인지.
 *
 * 「시간이 되어도 안 올라간다」의 답이 여기 있어야 한다.
 * 규칙 카드에는 마지막 오류 하나만 뜨니 어느 글이 왜 막혔는지 알 수가 없다.
 */
function autoWhy(post, rule, settings, acc) {
  if (post.status === 'published') return null;
  if (post.status === 'scheduled') {
    return { ok: true, why: '예약해뒀습니다. 시간이 되면 Zernio 가 올립니다.' };
  }
  if (!rule) {
    return { ok: false, why: '자동 규칙에서 빠진 글입니다. 「내 원고」에서 직접 올리세요.' };
  }
  if (rule.mode !== 'publish') {
    return {
      ok: false,
      why: '이 규칙은 「원고로만 두기」라 자동으로 안 올라갑니다. ' +
        '자동으로 내보내려면 규칙에서 「바로 예약까지」로 바꿔주세요.',
    };
  }
  if (!acc) return { ok: false, why: '올릴 스레드 계정이 없습니다. 설정에서 등록해주세요.' };
  if (!settings.allowPublish) {
    return { ok: false, why: '올리기가 잠겨 있습니다. 설정에서 「스레드에 올리기 허용」을 켜주세요.' };
  }
  if (!post.check.passHard) {
    return {
      ok: false,
      why: '지침에 걸려서 예약하지 못했습니다 (' + post.check.advice.join(', ') + '). ' +
        '자동으로 나가는 글은 지침을 다 지켜야 합니다 — 「수정하기」나 「글 재생성」을 눌러주세요.',
    };
  }
  return { ok: true, why: '다음 확인 때 예약합니다. (5분마다 돕니다)' };
}


const KST_MS = 9 * 3600 * 1000;

/** 이번 주 월요일 0시 (한국 시각). 요일 판의 왼쪽 끝이다. */
function weekStart(at) {
  const k = new Date(at.getTime() + KST_MS);
  const back = (k.getUTCDay() + 6) % 7;          // 월요일이 0
  const m = Date.UTC(k.getUTCFullYear(), k.getUTCMonth(), k.getUTCDate() - back);
  return new Date(m - KST_MS);
}

/** 이 시각이 규칙의 어느 슬롯이었는지, 그 슬롯의 시각 문자열. */
function slotTimeOf(rule, at) {
  if (!rule || !at) return '';
  const s = rules.slotOf(rule, at);
  return s ? s.time : '';
}

/**
 * 「이 규칙의 이 날 이 자리」를 가리키는 이름표.
 * 저장된 시각에는 흔들기가 얹혀 있어서 시각만으로는 짝이 안 맞는다.
 */
function planKeyOf(ruleId, at, time) {
  if (!ruleId || !at || !time) return '';
  const k = new Date(new Date(at).getTime() + KST_MS);
  return ruleId + '|' + k.toISOString().slice(0, 10) + '|' + time;
}

/**
 * 오늘의 운세 글의 띠가 그 날 일지와 맞는가.
 *
 * ⚠️ 예전에는 띠를 모델이 골랐다. 그때 만들어 둔 글이 그대로 남아 있고,
 *    「예약됨」이면 Zernio 가 들고 있어서 **그대로 나간다.**
 *    어느 글을 다시 만들어야 하는지 사람이 눈으로 찾게 하면 안 된다.
 *
 * 반환 null(볼 것 없음) 또는 { ok:false, why }
 */
function ttiWarn(post) {
  if (post.status === 'published') return null;      // 이미 나간 건 어쩔 수 없다
  if (!post.slotAt) return null;

  const whole = (post.parts || []).join(String.fromCharCode(10)) +
    String.fromCharCode(10) + (post.replyText || '');

  /* 띠를 **여럿 늘어놓은 글**만 본다.
     「쥐띠는 올해 움직임이 많습니다」처럼 하나만 짚은 보통 글까지
     붙잡으면, 멀쩡한 글에 빨간 줄이 떠서 아무도 안 믿게 된다.
     운세 글은 좋은 쪽·조심할 쪽을 합쳐 넷 이상 적는다. */
  const found = jiji.TTI.filter((name) => whole.indexOf(name) >= 0).length;
  if (found < 4) return null;

  const t = today.forDate(post.slotAt);
  if (!t || !t.dayBranch) return null;

  const c = jiji.checkText(t.dayBranch, whole);
  return c.ok ? null : { ok: false, why: c.why };
}

/**
 * Zernio 에 걸어둔 예약을 뺀다.
 *
 * ⚠️ **글이 두 번 올라간 적이 있다.** 예정 글을 「다시 만들기」 하면
 *    우리 쪽 zernioId 만 지우고 Zernio 쪽 예약은 그대로 뒀다. 그래서
 *    ① 옛 내용이 걸린 예약이 살아 있고 ② 새 내용으로 예약이 또 걸려
 *    같은 자리에 **두 개가 나갔다.** 예약을 푸는 곳은 반드시 여기를 거친다.
 *
 * ⚠️ 계정도 조심해야 한다. 예전엔 늘 「지금 고른 계정」의 키로 지웠다.
 *    계정이 둘이면 다른 계정 키로 지우려 들어 실패하고, 실패한 예약은
 *    제 시각에 그대로 나간다. **글이 걸린 그 계정**으로 지운다.
 *
 * 반환 { ok, why }  — 못 뺐으면 ok:false. 부르는 쪽이 멈출지 정한다.
 */
async function dropSchedule(userId, post) {
  if (!post || !post.zernioId) return { ok: true };
  const acc = (post.accountId && await accounts.byId(userId, post.accountId))
    || await accounts.active(userId);
  if (!acc) return { ok: false, why: '올릴 계정을 찾지 못했습니다.' };
  try {
    await zernio.remove(acc.key, post.zernioId);
    return { ok: true };
  } catch (e) {
    return { ok: false, why: e.message };
  }
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
        /* 종류별 본보기 글 — 화면이 다섯 칸을 채워 보여준다 */
        samples: settings.samples || [],
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
      /* 안내 문구가 숫자와 따로 놀지 않게 화면도 같은 값을 쓴다 */
      lookaheadDays: rules.LOOKAHEAD_DAYS,
      autoRules: await rulesWithStatus(req),
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
    /* 종류별 본보기 글. 다섯 칸까지.
       말투만으로는 짜임새가 안 잡힌다 — 무료사주 안내글과 리스트형은
       여는 법도 닫는 법도 다르다. 그 종류를 만들 때 그 칸을 본보기로 쓴다. */
    if (Array.isArray(b.samples)) {
      const ok = FORMS.FORMS.map((f) => f.id);
      patch.samples = b.samples
        .filter((x) => x && String(x.text || '').trim())
        .slice(0, 5)
        .map((x) => ({
          /* 모르는 종류는 빈 값으로 둔다 — 말투에는 쓰고 본보기로는 안 쓴다 */
          kind: ok.indexOf(String(x.kind || '')) >= 0 ? String(x.kind) : '',
          text: String(x.text).trim().slice(0, 3000),
        }));
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
        /* ⚠️ numbered 는 뺐다 — 「1/2 · 2/2」가 늘 붙어서 나갔다 */
        ? { body, tail, mode }
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
    res.json({ ok: true, rules: await rulesWithStatus(req) });
  } catch (e) { next(e); }
});

/** 규칙 만들기·고치기. id 가 없으면 새로 만든다. */
router.post('/api/threads/rules', ...guard, async (req, res, next) => {
  try {
    const b = req.body || {};
    /* 「인사글 재료가 있나」는 **그 규칙이 쓸 계정** 기준으로 봐야 한다.
       계정마다 인사글이 따로 있어서, 사람 단위로 보면 엉뚱한 답이 나온다. */
    const acctId = Number(b.accountId) > 0 ? Number(b.accountId) : undefined;
    const s = await store.getSettings(req.user.id, acctId);
    const hasIntro = !!(s.intro && (s.intro.name || s.intro.career || s.intro.sample));
    const patch = rules.clean(b, { hasIntro });

    /* ⚠️ 계정을 안 집은 규칙은 「지금 고른 계정」을 따라간다. 계정이 둘이면
          계정을 바꿀 때마다 그 규칙이 나가는 곳도 같이 바뀌어 헷갈린다.
          계정이 둘 이상이면 **만들 때 지금 계정에 못 박는다.** */
    if (patch.accountId === undefined && !b.id) {
      const all = await accounts.list(req.user.id);
      if (all.length > 1) {
        const cur = await accounts.active(req.user.id);
        if (cur) patch.accountId = cur.id;
      }
    }

    /* 틀을 하나도 못 고르는 경우가 있다 — 인사형만 골랐는데 인사글 재료가 없을 때다.
       그대로 저장하면 왜 안 도는지 알 수가 없다. */
    if (Array.isArray(b.forms) && b.forms.length && !patch.forms.length) {
      return fail(res, {
        message: '고른 글 틀을 쓸 수 없습니다.',
        hint: '인사·무료사주 틀은 설정의 「인사글 재료」를 먼저 채워야 합니다.',
      });
    }
    const saved = await rules.save(req.user.id, b.id || null, patch);

    /* ⚠️ 저장만 하고 5분을 기다리게 두면 아무것도 안 보인다. 「아직 한 번도
          안 돌았습니다」만 뜬 채로 아래 요일 판이 텅 비어 있었다.
          **저장을 누르면 바로 채우기 시작한다.**
          기다렸다 답하면 안 된다 — 세 편 만드는 데 1~2분이 걸려서
          브라우저가 먼저 끊는다. 뒤에서 돌리고 화면에는 바로 답한다.
          같은 규칙을 두 군데서 돌리는 건 runRule 의 자물쇠가 막는다. */
    const willFill = saved.enabled && saved.slots.length && !!req.user.openai_key;
    if (willFill) {
      const uid = req.user.id;
      const key = req.user.openai_key;
      setImmediate(() => {
        autopost.runRule(Object.assign({}, saved, { userId: uid, openaiKey: key }))
          .then((r) => {
            if (r.skipped) return;
            console.log('[스레드] 저장하자마자 ' + r.made.length + '개 만들었습니다' +
              (r.errors.length ? ' (' + r.errors[0] + ')' : ''));
          })
          .catch((e) => console.error('[스레드] 저장 직후 만들기 실패:', e.message));
      });
    }

    res.json({
      ok: true,
      rule: saved,
      /* 지금 채우는 중인지. 화면이 이걸 보고 목록을 다시 읽는다. */
      filling: willFill,
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

/* ⚠️ 「지금 한 번 만들어보기」는 없앴다.
      저장을 눌러도 아무것도 안 생겨서, 그 단추를 눌러야만 글이 나왔다.
      그런데 그 단추가 5분 주기와 겹치면 같은 자리에 두 개가 생겼다.
      이제 **저장이 곧 만들기**다 (위 POST /rules 참고). */

/**
 * 앞으로 올라갈 글들. 자동 규칙이 미리 만들어둔 것을 시각 순으로 보여준다.
 *
 * 며칠 앞서 만들어두기 때문에, 마음에 안 드는 글을 **올라가기 전에**
 * 볼 수 있어야 한다. 안 그러면 자동이 아니라 도박이 된다.
 */
router.get('/api/threads/upcoming', ...guard, async (req, res, next) => {
  try {
    const settings = await store.getSettings(req.user.id);
    const all = await store.getPosts(req.user.id);
    /* 이 글이 자동으로 나갈 수 있는지 글마다 판단하려면 규칙과 계정이 필요하다.
       규칙 카드에는 마지막 오류 하나만 뜨는데, 어느 글이 왜 막혔는지는
       거기서 알 수가 없다. */
    const [ruleList, acc] = await Promise.all([
      rules.list(req.user.id),
      accounts.active(req.user.id),
    ]);
    const ruleById = {};
    ruleList.forEach((r) => { ruleById[r.id] = r; });
    /* 요일 판은 **이번 주 월요일부터** 보여준다.
       「이번 주에 뭐가 올라갔지」를 확인하려면 지난 요일도 남아 있어야 한다.
       하루만 남기면 수요일에 월요일 글을 확인할 수가 없다. */
    const since = weekStart(new Date()).getTime();

    /* ⚠️ 계정을 바꿔도 올라갈 글이 그대로 다 떴다. 두 계정이 같은 판을
          보니 어느 글이 어느 계정으로 나가는지 알 수가 없었다.
          이미 나간 글은 그 글에 새겨진 계정으로, 아직 원고인 글은
          그 글을 만든 규칙의 계정으로 가른다. */
    const accCount = (await accounts.list(req.user.id)).length;
    const here = acc ? acc.id : null;
    const belongs = (p) => {
      if (accCount < 2) return true;
      if (p.accountId) return p.accountId === here;
      const r = ruleById[p.ruleId];
      /* 규칙이 계정을 안 집었으면 「지금 고른 계정」으로 나간다 */
      if (r && r.accountId) return r.accountId === here;
      return true;
    };

    const list = all
      .filter((p) => {
        if (!p.slotAt) return false;
        if (!belongs(p)) return false;
        const at = new Date(p.publishedAt || p.slotAt).getTime();
        return at >= since;
      })
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
          /* 띠가 그 날 일지와 맞는지. 계산이 붙기 전에 만든 글은 안 맞는다. */
          tti: ttiWarn(v),
          /* 올라간 글이면 언제 어디로 나갔는지 */
          auto: autoWhy(v, ruleById[v.ruleId], settings, acc),
          planKey: planKeyOf(v.ruleId, v.slotAt, slotTimeOf(ruleById[v.ruleId], v.slotAt)),
          publishedAt: v.publishedAt || null,
          permalink: v.permalink || null,
          accountName: v.accountName || null,
          scheduledFor: v.scheduledFor || null,
          error: v.error || null,
        };
      });
    /* ⚠️ **같은 시각에 두 개씩 걸린 적이 있다.** 규칙이 둘 다 같은 요일·시각을
          잡고 있으면 각자 자기 자리를 채워서 그 시각에 두 글이 나란히 나간다.
          앞으로는 막았지만 이미 걸린 것은 코드가 못 지운다 —
          어느 자리가 겹쳤는지 **눈에 보여줘야** 사람이 하나를 뺄 수 있다. */
    const NEAR_MS = 3 * 60 * 1000;
    list.forEach((p, i) => {
      if (p.status === 'published') return;
      const t = new Date(p.slotAt).getTime();
      const twin = list.find((q, j) => j !== i && q.status !== 'published' &&
        Math.abs(new Date(q.slotAt).getTime() - t) <= NEAR_MS);
      if (!twin) return;
      p.twin = '이 시각에 글이 두 개 걸려 있습니다' +
        (twin.topic ? ' (다른 하나는 「' + twin.topic + '」)' : '') + '. ' +
        '그대로 두면 둘 다 올라갑니다 — 하나는 「자리 빼기」로 빼주세요.';
    });

    /* 아직 글이 안 만들어진 자리도 보여준다.
       자동은 정해둔 며칠 앞까지만 채우니, 그 너머는 자리만 보여준다.
       빈칸만 보면 「예약이 안 걸렸나」 싶다 — 자리는 잡혀 있다고 알려줘야 한다. */
    const written = {};
    list.forEach((x) => { if (x.planKey) written[x.planKey] = true; });

    const AHEAD_MS = rules.LOOKAHEAD_DAYS * 24 * 3600 * 1000;
    const slots = [];
    /* ⚠️ 꺼진 규칙을 빼버리면 요일 판이 조용히 빈다.
          「일곱 요일을 다 잡아놨는데 왜 아무것도 안 보이냐」가 된다.
          자리는 보여주고 **왜 안 나가는지**를 그 자리에 적는다. */
    ruleList
      /* 지금 고른 계정의 자리만. 규칙 목록과 같은 기준이어야 한다. */
      .filter((r) => accCount < 2 || !r.accountId || r.accountId === here)
      .forEach((r) => {
      rules.plan(r, 14).forEach((x) => {
        const key = planKeyOf(r.id, x.at, x.slot.time);
        if (written[key]) return;
        const f = x.slot.form ? FORMS.byId(x.slot.form) : null;
        const soon = new Date(x.sendAt).getTime() - Date.now() <= AHEAD_MS;
        slots.push({
          planKey: key,
          slotAt: new Date(x.sendAt).toISOString(),
          ruleName: r.name || '',
          formLabel: f ? f.label : '',
          off: !r.enabled,
          note: !r.enabled
            ? '이 규칙이 꺼져 있어 글을 만들지 않습니다. 위 규칙에서 「켜기」를 체크해주세요.'
            : soon
              ? '곧 만듭니다. 5분마다 확인해서 ' + rules.LOOKAHEAD_DAYS + '일치를 채웁니다.'
              : rules.LOOKAHEAD_DAYS + '일 앞까지만 미리 만듭니다. 날짜가 가까워지면 여기에 글이 보입니다.',
        });
      });
    });

    res.json({ ok: true, posts: list, slots, weekStart: since });
  } catch (e) { next(e); }
});

/**
 * 예정된 글의 시각을 사람이 직접 바꾼다.
 *
 * 자동 규칙이 정해준 자리가 늘 맞는 것은 아니다 — 운세가 저녁에 걸리거나,
 * 그날만 다른 시각에 올리고 싶을 때가 있다.
 *
 * ⚠️ 이미 Zernio 에 걸어둔 글이면 예약을 풀고 다시 걸어야 한다.
 *    여기서 시각만 바꾸면 화면과 실제가 어긋난다.
 */
router.post('/api/threads/upcoming/:id/slot', ...guard, async (req, res, next) => {
  try {
    const b = req.body || {};
    let when;

    /* 요일 + 시각으로 받는다.
       ⚠️ 날짜를 직접 고르게 하면 지난 날짜를 찍거나 몇 월 며칠인지 세어야 한다.
          자리는 원래 「무슨 요일 몇 시」로 잡는 것이라 요일이면 충분하다.
          앞으로 오는 그 요일의 첫 번째를 잡아준다. */
    if (b.day != null && b.time) {
      const day = Number(b.day);
      const time = rules.hhmm(b.time);
      if (!(day >= 0 && day <= 6) || !time) {
        return fail(res, { message: '요일과 시각을 정해주세요.' });
      }
      when = rules.nextSlotTime({ day, time }, new Date());
    } else {
      when = new Date(String(b.at || ''));
    }

    if (isNaN(when.getTime())) return fail(res, { message: '시각을 정해주세요.' });
    if (when.getTime() < Date.now() - 60000) {
      return fail(res, { message: '지난 시각으로는 옮길 수 없습니다.' });
    }
    const post = await store.getPost(req.user.id, req.params.id);
    if (!post) return fail(res, { message: '글을 찾지 못했습니다.' }, 404);
    if (post.status === 'published') return fail(res, { message: '이미 올린 글입니다.' }, 409);

    /* 예약이 걸려 있던 글이면 옛 예약부터 뺀다.
       ⚠️ 못 뺀 채 자리만 옮기면 옛 자리와 새 자리에 **두 개가 나간다.** */
    if (post.status === 'scheduled' && post.zernioId) {
      const off = await dropSchedule(req.user.id, post);
      if (!off.ok) {
        return fail(res, {
          message: 'Zernio 에서 옛 예약을 지우지 못했습니다: ' + off.why,
          hint: '이대로 옮기면 옛 시각에도 글이 하나 더 올라갑니다. ' +
            'zernio.com 대시보드에서 직접 지운 뒤 다시 옮겨주세요.',
        }, 502);
      }
      await store.updatePost(req.user.id, post.id, {
        status: 'draft', zernioId: null, scheduledFor: null,
      });
    }

    const saved = await store.updatePost(req.user.id, post.id, {
      slotAt: when.toISOString(),
    });
    res.json({ ok: true, post: pipeline.view(saved) });
  } catch (e) { outsideFail(res, e, next); }
});

/**
 * 이 자리를 취소한다 — 자동으로 안 올라가게.
 *
 * 글을 지우는 것이 아니다. 자리(slot_at·rule_id)만 떼어내 「올라갈 글」에서
 * 빠지고, 예약이 걸려 있었으면 Zernio 에서도 뺀다.
 * 글은 「내 원고」에 그대로 남아 나중에 손으로 올릴 수 있다.
 */
router.post('/api/threads/upcoming/:id/unhook', ...guard, async (req, res, next) => {
  try {
    const post = await store.getPost(req.user.id, req.params.id);
    if (!post) return fail(res, { message: '글을 찾지 못했습니다.' }, 404);
    if (post.status === 'published') return fail(res, { message: '이미 올린 글입니다.' }, 409);

    if (post.status === 'scheduled' && post.zernioId) {
      const off = await dropSchedule(req.user.id, post);
      /* ⚠️ 화면에서는 뗐는데 시간 되면 올라가는 게 제일 나쁘다.
            못 뺐으면 우리 쪽도 그대로 두고 사람에게 알린다. */
      if (!off.ok) {
        return fail(res, {
          message: 'Zernio 에서 예약을 지우지 못했습니다: ' + off.why,
          hint: '그대로 두면 제 시각에 올라갑니다. zernio.com 대시보드에서 직접 지워주세요.',
        }, 502);
      }
    }
    await store.updatePost(req.user.id, post.id, {
      status: 'draft', zernioId: null, scheduledFor: null,
      /* rule_id 까지 떼어야 자동이 그 자리를 다시 보지 않는다.
         slot_at 만 지우면 다음 회차에 또 채워 넣는다. */
      slotAt: null, ruleId: null, error: null,
    });
    res.json({ ok: true });
  } catch (e) { outsideFail(res, e, next); }
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

    /* ⚠️ **먼저 예약을 뺀다.** 옛 예약을 살려둔 채 새 글을 걸면 같은 자리에
          두 개가 나간다. 실제로 두 번 올라갔다.
          못 빼면 여기서 멈춘다 — 다시 만들어봐야 옛 글이 그대로 나간다. */
    if (old.status === 'scheduled' && old.zernioId) {
      const off = await dropSchedule(req.user.id, old);
      if (!off.ok) {
        return fail(res, {
          message: 'Zernio 에서 예약을 먼저 지우지 못했습니다: ' + off.why,
          hint: '이대로 다시 만들면 옛 글이 그대로 올라갑니다. ' +
            'zernio.com 대시보드에서 직접 지운 뒤 다시 눌러주세요.',
        }, 502);
      }
      await store.updatePost(req.user.id, old.id, {
        status: 'draft', zernioId: null, scheduledFor: null,
      });
    }

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

    /* 자리는 그대로 두고 내용만 갈아끼운다. 옛 예약은 위에서 이미 뺐으니
       여기서는 「다시 걸어야 한다」는 뜻으로 원고로 돌려놓기만 한다. */
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
    /* ⚠️ 「내 원고」는 **손으로 만든 글**만 둔다.
          자동 규칙이 만든 글까지 섞이니 목록이 자동 글로 뒤덮여서
          내가 주제를 골라 만든 글을 찾을 수가 없었다.
          자동 글은 아래 요일 판에서만 본다 — 거기가 그 글들의 자리다. */
    const mine = list.filter((p) => !p.auto && !p.ruleId);
    res.json({ ok: true, posts: mine.map(pipeline.view) });
  } catch (e) { next(e); }
});

router.post('/api/threads/posts/:id', ...guard, async (req, res, next) => {
  try {
    const b = req.body || {};
    const parts = (b.parts || [])
      .map((t) => String(t == null ? '' : t).trim()).filter(Boolean);
    if (!parts.length) return fail(res, { message: '본문이 비어 있습니다.' });

    const patch = { parts, form: formOf(parts.length) };
    /* 첫 댓글도 고칠 수 있어야 한다. 리스트형은 알맹이가 댓글에 있어서
       본문만 고칠 수 있으면 반쪽짜리다.
       안 보내면 건드리지 않는다 — 빈 문자열은 「지우기」로 본다. */
    if (typeof b.replyText === 'string') {
      patch.replyText = b.replyText.trim();
    }
    const p = await store.updatePost(req.user.id, req.params.id, patch);
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

    /* ⚠️ **지웠는데 시간 되면 올라오는 것**이 제일 나쁘다.
          예약이 걸린 글은 Zernio 에서 먼저 빼야 한다. 예전엔 우리 쪽에서만
          지워서, 화면에서 사라진 글이 제 시각에 그대로 나갔다.
          Zernio 에 이미 없으면(404) 지운 셈으로 본다 — zernio.remove 가 봐준다. */
    const stuck = [];
    const okIds = [];
    for (const id of ids) {
      const post = await store.getPost(req.user.id, id);
      if (!post) continue;
      if (post.zernioId && post.status !== 'published') {
        const off = await dropSchedule(req.user.id, post);
        if (!off.ok) { stuck.push(off.why); continue; }
      }
      okIds.push(id);
    }
    if (!okIds.length && stuck.length) {
      return fail(res, {
        message: 'Zernio 에서 예약을 지우지 못했습니다: ' + stuck[0],
        hint: '먼저 지우면 시간이 돼도 안 올라갑니다. zernio.com 대시보드에서 직접 지운 뒤 다시 눌러주세요.',
      }, 502);
    }

    const out = await store.deletePosts(req.user.id, okIds);
    res.json({
      ok: true,
      deleted: out.deleted,
      /* 몇 개는 Zernio 에 남았다고 알려준다. 조용히 넘어가면 그게 나간다. */
      stuck: stuck.length,
      trash: await store.trashCount(req.user.id),
    });
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

    const send = await bodyToSend(req.user.id, post, ready.acc.id);
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

    /* ⚠️ 이미 예약된 글을 또 예약하면 옛 예약이 남아 **두 개가 나간다.**
          시각만 바꾸려고 다시 누르는 일이 흔하다. */
    if (post.zernioId) {
      const off = await dropSchedule(req.user.id, post);
      if (!off.ok) {
        return fail(res, {
          message: 'Zernio 에서 옛 예약을 지우지 못했습니다: ' + off.why,
          hint: '이대로 예약하면 두 번 올라갑니다. zernio.com 대시보드에서 직접 지운 뒤 다시 눌러주세요.',
        }, 502);
      }
      await store.updatePost(req.user.id, post.id, {
        status: 'draft', zernioId: null, scheduledFor: null,
      });
    }

    const ready = await readyToSend(req.user.id, post);
    if (!ready.ok) return fail(res, { message: ready.why });

    /* ⚠️ 같은 시각에 두 글이 나란히 올라간 일이 있다. 손으로 걸 때도 본다. */
    const near = await store.scheduledNear(req.user.id, ready.acc.id, when, post.id);
    if (near) {
      return fail(res, {
        message: '그 시각에 이미 예약된 글이 있습니다' +
          (near.topic ? ' (' + near.topic + ')' : '') + '.',
        hint: '같은 자리에 두 개가 나가면 도배로 보입니다. 시각을 조금 옮겨주세요.',
      }, 409);
    }

    const send = await bodyToSend(req.user.id, post, ready.acc.id);
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

    /* Zernio 쪽에서 못 지우면 우리 쪽도 풀지 않는다.
       화면에는 없는데 시간 되면 올라가버리는 게 제일 나쁘다. */
    if (post.zernioId) {
      const off = await dropSchedule(req.user.id, post);
      if (!off.ok) {
        return fail(res, {
          message: 'Zernio 에서 예약을 지우지 못했습니다: ' + off.why,
          hint: 'zernio.com 대시보드에서 직접 지워주세요. 그대로 두면 제 시각에 올라갑니다.',
        }, 502);
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
