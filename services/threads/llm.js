/* ============================================================
 * services/threads/llm.js — 글 만들기 (OpenAI)
 *
 * 원본은 Claude 로 만들었지만, 루월당 교육생은 이미 무료사주에
 * OpenAI 키를 넣어두었다. 키를 또 받게 하지 않으려고 그대로 쓴다.
 *   users.openai_key  ← 무료사주·PDF·추가질문이 쓰는 바로 그 키
 *
 * JSON 으로 받아야 하므로 response_format 을 지정한다.
 * 안 주면 앞뒤에 설명이 붙어 파싱이 훨씬 자주 깨진다.
 * ============================================================ */

const MODEL = process.env.THREADS_MODEL || process.env.AI_MODEL || 'gpt-4o';
const TIMEOUT_MS = Number(process.env.THREADS_TIMEOUT_MS || 300000);   // 5분

/** 키가 그럴듯한 모양인지만 본다. 맞는지는 불러봐야 안다. */
function looksLikeKey(k) {
  return typeof k === 'string' && /^sk-/.test(k.trim());
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

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);

  let res;
  try {
    res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + key,
      },
      body: JSON.stringify({
        model: o.model || MODEL,
        messages: [
          { role: 'system', content: '당신은 사주 콘텐츠를 쓰는 명리학자입니다. 요청받은 JSON 형식으로만 답합니다.' },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
        temperature: o.temperature == null ? 0.9 : o.temperature,
        /* ⚠️ 안 주면 기본 한도에서 잘려 뒤쪽 글이 통째로 사라진다.
              글 8개 × 3편 × 500자면 넉넉히 잡아야 한다. */
        max_tokens: o.maxTokens || 12000,
      }),
      signal: ctrl.signal,
    });
  } catch (e) {
    clearTimeout(timer);
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
    const body = await res.text().catch(() => '');
    const err = new Error(explain(res.status, body));
    err.code = 'API_' + res.status;
    throw err;
  }

  const json = await res.json();
  const text = ((json.choices || [])[0] || {}).message
    ? json.choices[0].message.content || ''
    : '';
  const finish = ((json.choices || [])[0] || {}).finish_reason;
  return { text, usage: json.usage || null, model: json.model || MODEL, finish };
}

/** API 오류를 교육생이 알아들을 말로 바꾼다 */
function explain(status, body) {
  if (status === 401) return 'OpenAI 키가 맞지 않습니다. 「무료사주 · API 설정」에서 키를 다시 확인해주세요.';
  if (status === 429 && /quota|billing/i.test(body)) {
    return 'OpenAI 계정에 잔액이 없습니다. platform.openai.com 에서 결제 수단을 확인해주세요.';
  }
  if (status === 429) return '요청이 너무 잦습니다. 1~2분 뒤에 다시 시도해주세요.';
  if (status === 404 && /model/i.test(body)) {
    return '이 키로는 ' + MODEL + ' 모델을 쓸 수 없습니다. OpenAI 계정 등급을 확인해주세요.';
  }
  if (status >= 500) return 'OpenAI 쪽에 문제가 있습니다. 잠시 뒤 다시 시도해주세요.';
  return 'OpenAI 오류 ' + status + ': ' + String(body).slice(0, 200);
}

/** 키가 진짜 되는지 가장 짧은 질문 하나로 확인 */
async function testKey(apiKey) {
  try {
    const r = await runAi(apiKey, '{"ok":true} 라고만 답해주세요.', { maxTokens: 20, temperature: 0 });
    return { ok: true, message: '연결됐습니다. (' + r.model + ')' };
  } catch (e) {
    return { ok: false, message: e.message };
  }
}

module.exports = { runAi, testKey, looksLikeKey, MODEL };
