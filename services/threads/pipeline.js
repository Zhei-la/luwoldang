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
const { buildPrompt, buildRewritePrompt, buildFixPrompt } = require('./prompt');
const { runAi } = require('./llm');
const { parseLoose, normalize } = require('./parse');
const copycheck = require('./copycheck');
const { checkPost } = require('./guideline');
const { formOf, threadsLength } = require('./length');
const { hookName } = require('./hooks');
const dailyshape = require('./dailyshape');
const jiji = require('./jiji');
const today = require('./today');

/**
 * 모델이 준 form 은 믿지 않는다. 편 개수로 다시 정한다.
 *
 * ⚠️ 연작은 만들지 않는다. 프롬프트에 「무조건 single」이라고 적어도
 *    모델은 종종 2~3편을 돌려준다. 그러면 formOf 가 chain 으로 잡고
 *    1/3 · 2/3 · 3/3 번호가 붙어 나간다. 나눠 올리면 뒷편을 안 보므로
 *    첫 편만 남긴다. 덜 중요한 것을 버리라는 지침과 같은 뜻이다.
 */
function fixShape(p, opts) {
  const o = opts || {};
  /* 이어붙이기를 켠 사람만 여러 편을 쓸 수 있다. 기본은 한 편이다. */
  const max = o.chain && o.chain.on
    ? Math.max(2, Math.min(5, Number(o.chain.max) || 2))
    : 1;
  const all = (p.parts || []).map((t) => String(t == null ? '' : t).trim()).filter(Boolean);
  const parts = all.slice(0, max);
  if (all.length > max) {
    console.warn('[스레드] 모델이 ' + all.length + '편을 줬습니다. ' + max + '편만 씁니다.');
  }
  return {
    hooks: (p.hooks || []).map(Number).filter((n) => n >= 1 && n <= 26),
    postType: String(p.postType || '').trim(),
    form: formOf(parts.length),
    parts,
    /* 댓글은 연작이 아니다. 본문은 한 편 그대로 두고 따로 담는다. */
    replyText: String(p.reply == null ? (p.replyText || '') : p.reply).trim(),
    replyType: p.replyType || 'none',
    /* ⚠️ 번호(1/2 · 2/2)는 안 붙인다. 끌 방법이 없어 운세 글 끝에
          「1/2」가 달려 나갔다. 여기서 늘 꺼둔다. */
    numbered: false,
    cta: !!p.cta,
    cutNote: '',
  };
}

/** 미리보기 한 편에 필요한 것을 다 붙인다 */
function decorate(p, topic, situation, opts) {
  const o = opts || {};
  const post = Object.assign({}, p, {
    topic, situation,
    /* 이어붙이기를 켠 사람은 여러 편이 규칙 위반이 아니다 */
    allowChain: !!(o.chain && o.chain.on),
  });
  const check = checkPost(post);
  /* 번호(1/2)는 안 붙인다 — 미리보기가 나가는 글 그대로여야 한다 */
  return Object.assign({}, post, {
    check,
    lengths: check.lengths,
    hookNames: post.hooks.map(hookName),
    preview: post.parts,
  });
}

/**
 * 주제 하나로 글을 만든다. 저장은 하지 않는다.
 * 반환 { topic, situation, hookScan, unusable, posts: [...], warning }
 */
async function generate(userId, openaiKey, topic, limit, opts) {
  const o = opts || {};
  /* 말투·인사글·운세 틀은 계정마다 다르다.
     규칙이 계정을 집어 보내면 그 계정 몫으로 읽는다. */
  const settings = await store.getSettings(userId, o.accountId);
  const ledger = await store.getLedger(userId);

  /* ⚠️ 이 셋은 makePrompt 보다 **위에** 있어야 한다.
        아래에 두었다가 「Cannot access 'dailyChain' before initialization」로
        글 만들기가 통째로 죽은 적이 있다. 한자리에 모아둔다. */
  const daily = settings.daily;
  const wantsDaily = !!(o.form && o.form.id === 'daily');
  /* 운세 틀이 「두 편으로 나눔」이면, 이 글만은 두 편을 쓸 수 있어야 한다.
     짧아도 나누는 게 그 계정의 모양이다. */
  const dailyChain = wantsDaily && daily && daily.mode === 'chain' && String(daily.tail || '').trim()
    /* ⚠️ numbered 는 뺐다. 「1/2 · 2/2」가 늘 붙었고 끌 방법이 없었다. */
    ? { on: true, max: 2 }
    : null;

  /* 이 종류 글의 본보기. 말투만으로는 **짜임새**가 안 잡힌다 —
     무료사주 안내글과 리스트형은 여는 법도 닫는 법도 다르다.
     틀을 안 정한 글(사람이 손으로 만드는 자리)은 정보형 것을 쓴다. */
  const wantKind = (o.form && o.form.id) || 'info';
  const sample = (settings.samples || []).find((x) => x && x.kind === wantKind) || null;
  const sampleLabel = o.form ? o.form.label : '';

  const makePrompt = (extra) => buildPrompt(topic, {
    sample,
    sampleLabel,
    ledger,
    facts: (settings.facts || []).map((f) => f.text || String(f)),
    voicePack: require('./voice').resolve(settings),
    ctaLink: settings.ctaLink,
    intro: settings.intro,
    /* 운세 틀일 때만 운세 샘플을 싣는다. 늘 실으면 다른 글까지 운세처럼 나온다. */
    wantsDaily,
    daily,
    chain: dailyChain,
    /* 댓글을 받을지 말지를 사람이 정할 수 있다. null 이면 글마다 알아서 고른다. */
    askComments: o.askComments == null ? null : !!o.askComments,
    limit,
    /* 스케줄러가 「이번 글은 이 모양으로」를 정해 보낼 때가 있다 */
    extra: [
      /* 「오늘의 운세」처럼 날짜가 걸린 틀은, 지금이 아니라 **올라갈 날**의
         날짜와 일진을 계산해서 넣어준다. 모델에게 물으면 지어낸다. */
      o.form && o.form.needsDate ? require('./today').block(o.at) : '',
      require('./forms').block(o.form),
      extra,
    ].filter(Boolean).join(String.fromCharCode(10)),
  });

  const model = settings.model;
  const { text, usage } = await runAi(openaiKey, makePrompt(''), { model });

  const parsed = parseLoose(text);
  const norm = normalize(parsed.data);
  if (!norm.ok) {
    const e = new Error('AI 응답에서 글을 찾지 못했습니다. (' + norm.reason + ')');
    e.code = 'EMPTY';
    throw e;
  }

  const v = norm.value;
  const topicOut = v.topic || topic;
  /* 예전에는 설정에 전역 「이어붙이기」 스위치가 있었다. 리스트형이 스케줄러에
     생기면서 같은 일을 두 군데서 하게 되어 없앴다. 이제 나누는 것은
     **틀이 정한다** — 운세 틀의 두 편, 리스트형의 본문+댓글. */
  const shapeOpts = { chain: dailyChain };
  let posts = v.posts.map((x) => fixShape(x, shapeOpts)).filter((p) => p.parts.length);

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
            '짜임새만 빌리고 문장은 처음부터 새로 쓰세요.' ].join(String.fromCharCode(10))), { model });
        const re2 = normalize(parseLoose(again.text).data);
        if (re2.ok) {
          const fresh = re2.value.posts.map((x) => fixShape(x, shapeOpts)).filter((p) => p.parts.length);
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

  /* ── 운세는 틀대로 나왔는지 확인한다 ────────────────
     ⚠️ 프롬프트에 「짜임새를 그대로」라고 적어두는 것만으로는 안 지켜진다.
        틀에 「🐑 양띠」만 있어도 모델은 「🐵 원숭이띠 — 오늘은 …」로
        살을 붙이고 말투까지 바꾼다. 매일 나가는 글이라 모양이 바뀌면
        매일 오던 사람이 어디를 봐야 할지 모른다.
        그래서 어긋나면 **무엇이 어긋났는지 짚어** 한 번만 다시 시킨다. */
  let shapeNote = null;
  if (wantsDaily && daily && String(daily.body || daily.sample || '').trim() && posts.length) {
    const tplBody = String(daily.body || daily.sample || '').trim();
    const tplTail = String(daily.tail || '').trim();
    const first = posts[0];
    const gripes = [];

    const c1 = dailyshape.check(tplBody, (first.parts || [])[0] || '');
    if (!c1.ok) gripes.push('1편 — ' + c1.why);

    /* ⚠️ 띠는 일지에서 계산해 정해준 것이다. 그런데 모델은 목록을 앞에
          두고도 엉뚱한 띠를 넣는다. 계미일에 용띠·원숭이띠가 나왔었다 —
          미(未)와 아무 관계도 없는 지지라 아는 사람이 보면 바로 티가 난다.
          날짜가 걸린 틀에서만 본다. */
    if (o.form && o.form.needsDate) {
      const t = today.forDate(o.at);
      if (t && t.dayBranch) {
        const whole = (first.parts || []).join(String.fromCharCode(10)) +
          String.fromCharCode(10) + (first.replyText || '');
        const cT = jiji.checkText(t.dayBranch, whole);
        if (!cT.ok) gripes.push('띠 — ' + cT.why);
      }
    }

    if (dailyshape.needsTwo(daily)) {
      if ((first.parts || []).length < 2) {
        gripes.push('두 편으로 나눠 올리는 틀인데 한 편만 왔습니다. ' +
          'parts 에 두 편을 담으세요. 길이를 보고 합치지 마세요.');
      } else {
        const c2 = dailyshape.check(tplTail, first.parts[1]);
        if (!c2.ok) gripes.push('2편 — ' + c2.why);
      }
    } else if (daily.mode === 'reply' && tplTail && !String(first.replyText || '').trim()) {
      gripes.push('본문 + 첫 댓글로 올리는 틀인데 댓글이 비었습니다. reply 를 채우세요.');
    }

    if (gripes.length) {
      console.log('[스레드] 운세가 틀과 다릅니다 — ' + gripes[0]);
      try {
        const again = await runAi(openaiKey, makePrompt(
          ['', '[다시 씁니다] 방금 만든 운세가 **내 틀과 다르게** 나왔습니다.']
            .concat(gripes.map((g) => '- ' + g))
            .concat([
              '위 「내 오늘의 운세 틀」을 그대로 두고 날짜와 운세만 갈아끼우세요.',
              '새로 쓰지 마세요. 서식을 채우는 것입니다.',
            ]).join(String.fromCharCode(10))), { model });
        const re3 = normalize(parseLoose(again.text).data);
        if (re3.ok) {
          const fresh = re3.value.posts.map((x) => fixShape(x, shapeOpts)).filter((p) => p.parts.length);
          /* 다시 만든 것이 더 나을 때만 바꾼다. 더 어긋났으면 그냥 둔다. */
          if (fresh.length &&
              dailyshape.check(tplBody, fresh[0].parts[0] || '').ok) {
            posts = fresh;
            shapeNote = '운세를 틀에 맞춰 다시 만들었습니다.';
          } else {
            shapeNote = '운세가 틀과 조금 다릅니다 — ' + gripes[0];
          }
        }
      } catch (e) {
        console.error('[스레드] 운세 다시 만들기 실패:', e.message);
        shapeNote = '운세가 틀과 조금 다릅니다 — ' + gripes[0];
      }
    }
  }

  /* ⚠️ 번호(1/2 · 2/2)는 안 붙인다. 옛 글과 자리를 맞추려고 칸은 남기되
        늘 꺼둔다 — 붙일 방법이 없어야 다시 새지 않는다. */
  posts = posts.map((p) => decorate(
    Object.assign({}, p, { numbered: false }),
    topicOut, v.situation, shapeOpts
  ));

  /* 지침에 걸린 글은 사람 손에 넘기지 말고 여기서 고쳐 온다.
     「고쳐야 올릴 수 있습니다」를 띄워놓고 고칠 칸도 안 주면 막다른 길이다.
     무엇이 왜 걸렸는지는 이미 알고 있으니 그대로 돌려주고 다시 받는다. */
  let fixNote = null;
  try {
    const fixed = await repair(openaiKey, model, posts, settings);
    if (fixed.changed) {
      posts = fixed.posts.map((p) => decorate(p, topicOut, v.situation, shapeOpts));
      const left = posts.filter((p) => !p.check.passHard).length;
      fixNote = left
        ? fixed.changed + '개를 고쳐 만들었습니다. ' + left + '개는 아직 걸립니다.'
        : fixed.changed + '개가 지침에 걸려서 고쳐 만들었습니다.';
    }
  } catch (e) {
    console.error('[스레드] 고쳐 만들기 실패:', e.message);
  }

  return {
    topic: topicOut,
    situation: v.situation,
    hookScan: v.hookScan,
    unusable: v.unusable,
    posts,
    warning: parsed.warning || copyNote || shapeNote || fixNote || null,
    copyNote,
    shapeNote,
    fixNote,
    usage,
  };
}

/**
 * 하드 규칙에 걸린 글만 골라 한 번에 고쳐 온다.
 * 호출은 한 번뿐이다 — 글마다 부르면 요금이 몇 배가 된다.
 *
 * 반환 { posts, changed } — changed 는 실제로 갈아끼운 개수
 */
async function repair(openaiKey, model, decorated, settings) {
  const items = [];
  decorated.forEach((p, i) => {
    if (p.check && p.check.passHard) return;
    const problems = (p.check.rows || [])
      .filter((r) => !r.ok && r.hard)
      .map((r) => r.label + (r.detail ? ' — ' + r.detail : ''));
    if (problems.length) items.push({ n: i + 1, parts: p.parts, problems });
  });
  if (!items.length) return { posts: decorated, changed: 0 };

  const { text } = await runAi(openaiKey, buildFixPrompt(items, require('./voice').resolve(settings)), {
    model,
    maxTokens: 6000,
    temperature: 0.4,      // 고치는 일이다. 새로 지어내면 안 된다.
  });

  const data = parseLoose(text).data || {};
  const got = Array.isArray(data.posts) ? data.posts : [];
  const out = decorated.slice();
  let changed = 0;

  got.forEach((g) => {
    const idx = Number(g && g.n) - 1;
    if (!(idx >= 0 && idx < out.length)) return;
    const parts = (Array.isArray(g.parts) ? g.parts : [])
      .map((t) => String(t == null ? '' : t).trim()).filter(Boolean).slice(0, 1);
    if (!parts.length) return;
    /* 고친 글이 더 나쁘면 쓰지 않는다. 원래 것을 그대로 둔다. */
    const before = (out[idx].check.rows || []).filter((r) => !r.ok && r.hard).length;
    const after = (checkPost(Object.assign({}, out[idx], { parts })).rows || [])
      .filter((r) => !r.ok && r.hard).length;
    if (after >= before) return;
    out[idx] = Object.assign({}, out[idx], { parts });
    changed++;
  });

  return { posts: out, changed };
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
  const prompt = buildRewritePrompt(post, require('./voice').resolve(settings));
  const { text } = await runAi(openaiKey, prompt, { maxTokens: 8000, model: settings.model });

  const parsed = parseLoose(text);
  const all = (parsed.data && parsed.data.parts || [])
    .map((t) => String(t == null ? '' : t).trim()).filter(Boolean);
  if (!all.length) {
    const e = new Error('다시 쓴 글이 비어 있습니다.');
    e.code = 'EMPTY';
    throw e;
  }
  // 여기서도 연작은 만들지 않는다. fixShape 와 같은 이유다.
  const parts = all.slice(0, 1);

  return store.updatePost(userId, id, {
    parts,
    form: formOf(parts.length),
    cutNote: parsed.data.cutNote || post.cutNote || null,
  });
}

/** 저장된 글 하나를 화면에 보여줄 모양으로 */
function view(post) {
  /* 편이 여럿이면 틀이 그렇게 정한 것이다 (운세 두 편 등).
     사람이 실수로 나눈 것이 아니므로 「한 편으로 끝남」으로 막지 않는다. */
  const check = checkPost(Object.assign({}, post, {
    allowChain: (post.parts || []).length > 1,
  }));
  /* 번호(1/2)는 안 붙인다 — 미리보기가 나가는 글 그대로여야 한다 */
  return Object.assign({}, post, {
    check,
    lengths: check.lengths,
    hookNames: (post.hooks || []).map(hookName),
    preview: post.parts,
  });
}

module.exports = { generate, saveChosen, rewrite, view, fixShape, decorate, threadsLength };
