/* ============================================================
 * services/threads/pipeline.js — 만들기 흐름
 *
 *   주제 → 프롬프트 → Claude → 파싱 → 형태 바로잡기 → 지침 점검
 *
 * 여기서는 저장하지 않는다. 미리보기까지만 만들고,
 * 교육생이 고른 것만 저장한다. 그래야 만들수록 쌓이지 않는다.
 * 후킹 원장도 저장할 때만 기록한다 — 버린 글의 후킹은 다시 쓸 수 있어야 한다.
 * ============================================================ */

const store = require('./store');
const { buildPrompt, buildRewritePrompt } = require('./prompt');
const { runClaude } = require('./llm');
const { parseLoose, normalize } = require('./parse');
const { checkPost } = require('./guideline');
const { formOf, threadsLength, numberParts } = require('./length');
const { hookName } = require('./hooks');

/** 모델이 준 form 은 믿지 않는다. 편 개수로 다시 정한다. */
function fixShape(p) {
  const parts = (p.parts || []).map((t) => String(t == null ? '' : t).trim()).filter(Boolean);
  return {
    hooks: (p.hooks || []).map(Number).filter((n) => n >= 1 && n <= 26),
    postType: String(p.postType || '').trim(),
    form: formOf(parts.length),
    parts,
    replyType: p.replyType || 'none',
    cta: !!p.cta,
    cutNote: p.cutNote ? String(p.cutNote) : '',
  };
}

/** 미리보기 한 편에 필요한 것을 다 붙인다 */
function decorate(p, topic, situation) {
  const post = Object.assign({}, p, { topic, situation });
  const check = checkPost(post);
  const shown = post.form === 'chain' ? numberParts(post.parts) : post.parts;
  return Object.assign({}, post, {
    check,
    lengths: check.lengths,
    hookNames: post.hooks.map(hookName),
    preview: shown,
  });
}

/**
 * 주제 하나로 글을 만든다. 저장은 하지 않는다.
 * 반환 { topic, situation, hookScan, unusable, posts: [...], warning }
 */
async function generate(userId, topic, limit) {
  const settings = await store.getSettings(userId);
  const ledger = await store.getLedger(userId);

  const prompt = buildPrompt(topic, {
    ledger,
    facts: (settings.facts || []).map((f) => f.text || String(f)),
    voicePack: settings.voicePack,
    ctaLink: settings.ctaLink,
    limit,
  });

  const { text, usage } = await runClaude(settings.anthropicKey, prompt);

  const parsed = parseLoose(text);
  const norm = normalize(parsed.data);
  if (!norm.ok) {
    const e = new Error('AI 응답에서 글을 찾지 못했습니다. (' + norm.reason + ')');
    e.code = 'EMPTY';
    throw e;
  }

  const v = norm.value;
  const topicOut = v.topic || topic;
  const posts = v.posts.map(fixShape).filter((p) => p.parts.length)
    .map((p) => decorate(p, topicOut, v.situation));

  return {
    topic: topicOut,
    situation: v.situation,
    hookScan: v.hookScan,
    unusable: v.unusable,
    posts,
    warning: parsed.warning || null,
    usage,
  };
}

/**
 * 미리보기에서 고른 것만 저장한다.
 * 이때 후킹 원장에 기록하고, 한 묶음으로 남긴다.
 */
async function saveChosen(userId, batch, chosen) {
  const list = (chosen || []).map(fixShape).filter((p) => p.parts.length);
  if (!list.length) return { saved: 0, ids: [] };

  const withTopic = list.map((p) => Object.assign({}, p, {
    topic: batch.topic || '',
    situation: batch.situation || '',
    status: 'draft',
  }));

  const ids = await store.insertPosts(userId, withTopic);

  const hooks = [];
  for (const p of list) hooks.push.apply(hooks, p.hooks);
  await store.markHooksUsed(userId, hooks);

  await store.saveBatch(userId, {
    topic: batch.topic || '',
    situation: batch.situation || '',
    hookScan: batch.hookScan || [],
    unusable: batch.unusable || [],
    postIds: ids,
  });

  return { saved: ids.length, ids };
}

/** 저장된 글을 다른 버전으로 다시 쓴다 */
async function rewrite(userId, id) {
  const post = await store.getPost(userId, id);
  if (!post) {
    const e = new Error('글을 찾지 못했습니다.');
    e.code = 'NOT_FOUND';
    throw e;
  }
  const settings = await store.getSettings(userId);
  const prompt = buildRewritePrompt(post, settings.voicePack);
  const { text } = await runClaude(settings.anthropicKey, prompt, { maxTokens: 8000 });

  const parsed = parseLoose(text);
  const parts = (parsed.data && parsed.data.parts || [])
    .map((t) => String(t == null ? '' : t).trim()).filter(Boolean);
  if (!parts.length) {
    const e = new Error('다시 쓴 글이 비어 있습니다.');
    e.code = 'EMPTY';
    throw e;
  }

  return store.updatePost(userId, id, {
    parts,
    form: formOf(parts.length),
    cutNote: parsed.data.cutNote || post.cutNote || null,
  });
}

/** 저장된 글 하나를 화면에 보여줄 모양으로 */
function view(post) {
  const check = checkPost(post);
  const shown = post.form === 'chain' ? numberParts(post.parts) : post.parts;
  return Object.assign({}, post, {
    check,
    lengths: check.lengths,
    hookNames: (post.hooks || []).map(hookName),
    preview: shown,
  });
}

module.exports = { generate, saveChosen, rewrite, view, fixShape, decorate, threadsLength };
