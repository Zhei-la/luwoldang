/* ============================================================
 * services/threads/llm.js — 글 만들기 (OpenAI)
 *
 * 원본은 Claude 로 만들었지만, 루월당 교육생은 이미 무료사주에
 * OpenAI 키를 넣어두었다. 키를 또 받게 하지 않으려고 그대로 쓴다.
 *   users.openai_key  ← 무료사주·PDF·추가질문이 쓰는 바로 그 키
 *
 * JSON 으로 받아야 하므로 response_format 을 지정한다.
 * 안 주면 앞뒤에 설명이 붙어 파싱이 훨씬 자주 깨진다.
 *
 * ⚠️ 모델마다 받는 항목이 다르다. 새 계열(gpt-5·o 계열)은
 *    max_tokens 를 안 받고 max_completion_tokens 를 받으며,
 *    temperature 를 아예 거절한다. 계열로 한 번 갈라주고,
 *    그래도 거절당하면 그 항목만 빼고 한 번 더 부른다.
 *    모델 목록은 계속 바뀌므로 코드가 이름을 외우지 않게 했다.
 * ============================================================ */

const DEFAULT_MODEL = process.env.THREADS_MODEL || process.env.AI_MODEL || 'gpt-4o';
const TIMEOUT_MS = Number(process.env.THREADS_TIMEOUT_MS || 300000);   // 5분

/**
 * 설정 화면에 늘어놓는 목록.
 * 여기 없는 모델도 직접 적어서 쓸 수 있다 — 목록은 거들 뿐이다.
 * note 는 「무엇이 다른지」를 한 줄로. 값은 화면에 그대로 나간다.
 */
const MODELS = [
  {
    id: 'gpt-4.1',
    label: 'GPT-4.1',
    recommended: true,
    note: '시킨 대로 가장 잘 씁니다. 「한 편으로 끝내라」 「줄바꿈해라」 같은 규칙을 잘 지켜서 손볼 게 적습니다. 스레드 글에는 이게 제일 낫습니다.',
  },
  {
    id: 'gpt-4o',
    label: 'GPT-4o',
    note: '지금까지 쓰던 모델입니다. 문장은 매끄러운데 규칙을 자주 흘립니다. 글을 여러 편으로 쪼개거나 한 줄에 쭉 이어 쓰는 일이 여기서 나옵니다.',
  },
  {
    id: 'gpt-4.1-mini',
    label: 'GPT-4.1 mini',
    note: '싸고 빠릅니다. 값이 4.1 의 몇 분의 일입니다. 대신 사주 용어를 헐겁게 쓰는 일이 있어 만든 뒤 눈으로 한 번 봐야 합니다. 많이 돌려볼 때 씁니다.',
  },
  {
    id: 'gpt-4o-mini',
    label: 'GPT-4o mini',
    note: '제일 쌉니다. 연습용으로는 되는데 그대로 올릴 만한 글은 잘 안 나옵니다.',
  },
];

/** 키가 그럴듯한 모양인지만 본다. 맞는지는 불러봐야 안다. */
function looksLikeKey(k) {
  return typeof k === 'string' && /^sk-/.test(k.trim());
}

/** 쓸 모델을 정한다. 교육생이 고른 것 → 서버 기본값 순. */
function pickModel(model) {
  const m = String(model || '').trim();
  return m || DEFAULT_MODEL;
}

/**
 * 이 모델이 옛 계열인가 (max_tokens · temperature 를 받는가).
 * gpt-5·o1·o3·o4 처럼 숫자가 붙은 새 계열은 받지 않는다.
 */
function isLegacyParamModel(model) {
  return !/^(gpt-5|o\d)/i.test(String(model));
}

/** 모델에 맞는 요청 몸통을 만든다 */
function buildBody(model, prompt, o) {
  const body = {
    model,
    messages: [
      { role: 'system', content: '당신은 사주 콘텐츠를 쓰는 명리학자입니다. 요청받은 JSON 형식으로만 답합니다.' },
      { role: 'user', content: prompt },
    ],
    response_format: { type: 'json_object' },
  };

  /* ⚠️ 안 주면 기본 한도에서 잘려 뒤쪽 글이 통째로 사라진다.
        글 8개 × 500자면 넉넉히 잡아야 한다. */
  const cap = o.maxTokens || 12000;

  if (isLegacyParamModel(model)) {
    body.max_tokens = cap;
    body.temperature = o.temperature == null ? 0.9 : o.temperature;
  } else {
    body.max_completion_tokens = cap;
    // 새 계열은 temperature 를 거절한다. 아예 넣지 않는다.
  }
  return body;
}

/**
 * 400 이 「이 항목은 못 받는다」인지 보고, 뺄 항목 이름을 돌려준다.
 * 모델이 새로 나올 때마다 코드를 고치지 않으려고 응답을 읽어서 판단한다.
 */
function unsupportedParam(body) {
  const m = String(body).match(/'(max_tokens|max_completion_tokens|temperature|response_format)'/);
  return m ? m[1] : null;
}

async function callOnce(key, body, ctrl) {
  return fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + key,
    },
    body: JSON.stringify(body),
    signal: ctrl.signal,
  });
}

/**
 * OpenAI 에 물어보고 글자 그대로 돌려준다.
 * 실패하면 교육생이 뭘 해야 하는지 알 수 있는 문장으로 바꿔 던진다.
 */
async function runAi(apiKey, prompt, opts) {
  const o = opts || {};
  const key = String(apiKey || '').trim();
  if (!key) {
    const e = new Error('OpenAI 키가 없습니다. 「무료사주 · API 설정」에서 먼저 등록해주세요.');
    e.code = 'NO_KEY';
    throw e;
  }

  const model = pickModel(o.model);
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);

  let body = buildBody(model, prompt, o);
  let res;
  try {
    res = await callOnce(key, body, ctrl);

    /* 계열을 잘못 짚었으면 거절당한 항목만 빼고 한 번 더. */
    if (res.status === 400) {
      const text = await res.text().catch(() => '');
      const bad = unsupportedParam(text);
      if (bad) {
        if (bad === 'max_tokens') {
          body.max_completion_tokens = body.max_tokens;
          delete body.max_tokens;
        } else if (bad === 'max_completion_tokens') {
          body.max_tokens = body.max_completion_tokens;
          delete body.max_completion_tokens;
        } else {
          delete body[bad];
        }
        res = await callOnce(key, body, ctrl);
      } else {
        clearTimeout(timer);
        const err = new Error(explain(400, text, model));
        err.code = 'API_400';
        throw err;
      }
    }
  } catch (e) {
    clearTimeout(timer);
    if (e.code && String(e.code).startsWith('API_')) throw e;
    if (e.name === 'AbortError') {
      const err = new Error('생성이 ' + Math.round(TIMEOUT_MS / 1000) + '초를 넘겨 중단했습니다. 글 개수를 줄여보세요.');
      err.code = 'TIMEOUT';
      throw err;
    }
    const err = new Error('OpenAI 에 연결하지 못했습니다. 잠시 뒤 다시 시도해주세요.');
    err.code = 'NETWORK';
    throw err;
  }
  clearTimeout(timer);

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const err = new Error(explain(res.status, text, model));
    err.code = 'API_' + res.status;
    throw err;
  }

  const json = await res.json();
  const text = ((json.choices || [])[0] || {}).message
    ? json.choices[0].message.content || ''
    : '';
  const finish = ((json.choices || [])[0] || {}).finish_reason;
  return { text, usage: json.usage || null, model: json.model || model, finish };
}

/** API 오류를 교육생이 알아들을 말로 바꾼다 */
function explain(status, body, model) {
  const m = model || DEFAULT_MODEL;
  if (status === 401) return 'OpenAI 키가 맞지 않습니다. 「무료사주 · API 설정」에서 키를 다시 확인해주세요.';
  if (status === 429 && /quota|billing/i.test(body)) {
    return 'OpenAI 계정에 잔액이 없습니다. platform.openai.com 에서 결제 수단을 확인해주세요.';
  }
  if (status === 429) return '요청이 너무 잦습니다. 1~2분 뒤에 다시 시도해주세요.';
  if (status === 404 || (status === 400 && /model/i.test(body))) {
    return '이 키로는 ' + m + ' 모델을 쓸 수 없습니다. 모델 이름이 맞는지, OpenAI 계정 등급이 되는지 확인해주세요.';
  }
  if (status >= 500) return 'OpenAI 쪽에 문제가 있습니다. 잠시 뒤 다시 시도해주세요.';
  return 'OpenAI 오류 ' + status + ': ' + String(body).slice(0, 200);
}

/** 키와 모델이 진짜 되는지 가장 짧은 질문 하나로 확인 */
async function testKey(apiKey, model) {
  const m = pickModel(model);
  try {
    const r = await runAi(apiKey, '{"ok":true} 라고만 답해주세요.', {
      model: m, maxTokens: 20, temperature: 0,
    });
    return { ok: true, model: r.model, message: '연결됐습니다. (' + r.model + ')' };
  } catch (e) {
    return { ok: false, model: m, message: e.message };
  }
}

module.exports = {
  runAi, testKey, looksLikeKey, pickModel, MODELS, DEFAULT_MODEL,
  MODEL: DEFAULT_MODEL,                     // 예전 이름을 쓰는 곳이 남아 있어 같이 내보낸다
  buildBody, isLegacyParamModel, unsupportedParam,   // 자가 점검용
};
