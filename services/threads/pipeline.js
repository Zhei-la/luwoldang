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
const { runAi } = require('./llm');
const { parseLoose, normalize } = require('./parse');
const copycheck = require('./copycheck');
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
async function generate(userId, openaiKey, topic, limit) {
  const settings = await store.getSettings(userId);
  const ledger = await store.getLedger(userId);

  const makePrompt = (extra) => buildPrompt(topic, {
    ledger,
    facts: (settings.facts || []).map((f) => f.text || String(f)),
    voicePack: settings.voicePack,
    ctaLink: settings.ctaLink,
    limit,
    extra,
  });

  const { text, usage } = await runAi(openaiKey, makePrompt(''));

  const parsed = parseLoose(text);
  const norm = normalize(parsed.data);
  if (!norm.ok) {
    const e = new Error('AI 응답에서 글을 찾지 못했습니다. (' + norm.reason + ')');
    e.code = 'EMPTY';
    throw e;
  }

  const v = norm.value;
  const topicOut = v.topic || topic;
  let posts = v.posts.map(fixShape).filter((p) => p.parts.length);

  /* 벤치마크를 베꼈는지 본다.
     「짜임새만 빌려라」라고 적어두는 것만으로는 안 지켜진다.
     눈앞에 원문이 있으면 모델은 그 문장을 가져다 쓴다. 그래서 기계로 잡는다. */
  let copyNote = null;
  const bad = copycheck.scan(posts);
  if (bad.length) {
    const keep = posts.filter((_, i) => !bad.some((b) => b.index === i));
    console.log('[스레드] 참고 글을 베낀 글 ' + bad.length + '편 — ' + bad[0].reason);

    if (keep.length) {
      // 멀쩡한 것이 남았으면 그것만 쓴다. 요금을 또 쓰지 않는다.
      posts = keep;
      copyNote = bad.length + '편이 참고 글과 겹쳐서 뺐습니다.';
    } else {
      // 전부 베꼈으면 한 번만 다시 만든다
      try {
        const again = await runAi(openaiKey, makePrompt(
          [ '', '[다시 씁니다] 방금 만든 글이 참고 자료를 그대로 가져다 썼습니다.',
            '걸린 이유: ' + bad[0].reason,
            '소재를 아예 새로 잡으세요. 다른 일간·다른 신살·다른 상황으로 가야 합니다.',
            '짜임새만 빌리고 문장은 처음부터 새로 쓰세요.' ].join(String.fromCharCode(10))));
        const re2 = normalize(parseLoose(again.text).data);
        if (re2.ok) {
          const fresh = re2.value.posts.map(fixShape).filter((p) => p.parts.length);
          const stillBad = copycheck.scan(fresh);
          posts = fresh.filter((_, i) => !stillBad.some((b) => b.index === i));
          copyNote = posts.length
            ? '참고 글과 겹쳐서 다시 만들었습니다.'
            : '참고 글과 겹쳐 전부 뺐습니다. 다른 주제로 다시 해보세요.';
        }
      } catch (e) {
        console.error('[스레드] 다시 만들기 실패:', e.message);
        copyNote = '참고 글과 겹쳐 전부 뺐습니다. 다른 주제로 다시 해보세요.';
      }
    }
  }

  posts = posts.map((p) => decorate(p, topicOut, v.situation));

  return {
    topic: topicOut,
    situation: v.situation,
    hookScan: v.hookScan,
    unusable: v.unusable,
    posts,
    warning: parsed.warning || copyNote || null,
    copyNote,
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
async function rewrite(userId, openaiKey, id) {
  const post = await store.getPost(userId, id);
  if (!post) {
    const e = new Error('글을 찾지 못했습니다.');
    e.code = 'NOT_FOUND';
    throw e;
  }
  const settings = await store.getSettings(userId);
  const prompt = buildRewritePrompt(post, settings.voicePack);
  const { text } = await runAi(openaiKey, prompt, { maxTokens: 8000 });

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
