/* ============================================================
 * services/threads/llm.js — 글 만들기 (Anthropic API)
 *
 * 원본에는 Claude Code(claude CLI)로 만드는 길도 있었지만
 * 서버에는 claude 가 깔려 있지 않으므로 API 한 길만 남겼다.
 * 키는 교육생이 설정 화면에 직접 넣는다 — 무료사주 OpenAI 키와 같은 방식이다.
 * ============================================================ */

const MODEL = process.env.THREADS_MODEL || 'claude-sonnet-5';
const TIMEOUT_MS = Number(process.env.THREADS_TIMEOUT_MS || 300000);   // 5분

/** 키가 그럴듯한 모양인지만 본다. 맞는지는 불러봐야 안다. */
function looksLikeKey(k) {
  return typeof k === 'string' && /^sk-ant-/.test(k.trim());
}

/**
 * Claude 에 물어보고 글자 그대로 돌려준다.
 * 실패하면 교육생이 뭘 해야 하는지 알 수 있는 문장으로 바꿔 던진다.
 */
async function runClaude(apiKey, prompt, opts) {
  const o = opts || {};
  const key = String(apiKey || '').trim();
  if (!key) {
    const e = new Error('Claude API 키가 없습니다. 설정에서 먼저 넣어주세요.');
    e.code = 'NO_KEY';
    throw e;
  }

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);

  let res;
  try {
    res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: o.model || MODEL,
        max_tokens: o.maxTokens || 16000,
        messages: [{ role: 'user', content: prompt }],
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
    const err = new Error('Claude 에 연결하지 못했습니다. 잠시 뒤 다시 시도해주세요.');
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
  const text = (json.content || []).map((c) => c.text || '').join('');
  return { text, usage: json.usage || null, model: json.model || MODEL };
}

/** API 오류를 교육생이 알아들을 말로 바꾼다 */
function explain(status, body) {
  if (status === 401) return 'Claude API 키가 맞지 않습니다. 설정에서 키를 다시 확인해주세요.';
  if (status === 400 && /credit balance/i.test(body)) {
    return 'Claude 계정에 잔액이 없습니다. Anthropic 콘솔에서 결제 수단을 확인해주세요.';
  }
  if (status === 429) return '요청이 너무 잦습니다. 1~2분 뒤에 다시 시도해주세요.';
  if (status >= 500) return 'Claude 쪽에 문제가 있습니다. 잠시 뒤 다시 시도해주세요.';
  return 'Claude API 오류 ' + status + ': ' + String(body).slice(0, 200);
}

/** 설정 화면의 "연결 확인" — 가장 짧은 질문 하나로 키를 검사한다 */
async function testKey(apiKey) {
  try {
    await runClaude(apiKey, '안녕이라고만 답해주세요.', { maxTokens: 16 });
    return { ok: true, message: '연결됐습니다.' };
  } catch (e) {
    return { ok: false, message: e.message };
  }
}

module.exports = { runClaude, testKey, looksLikeKey, MODEL };
