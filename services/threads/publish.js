/* ============================================================
 * services/threads/publish.js — 스레드에 실제로 올리기
 *
 * 공식 Threads API(graph.threads.net)로 서버에서 올린다.
 * 기존 도구가 교육생에게 알려주던 그 장기 토큰을 그대로 쓴다.
 *
 * 올리는 순서 (한 편마다 두 번 부른다)
 *   1) 담을 그릇 만들기   POST /{id}/threads          → creation_id
 *   2) 실제로 올리기      POST /{id}/threads_publish  → 글 id
 *
 * 연재는 앞 편의 글 id 를 reply_to_id 로 넘겨 답글로 잇는다.
 *
 * ⚠️ 그릇을 만들고 바로 올리면 가끔 아직 준비가 안 됐다고 한다.
 *    잠깐 기다렸다 다시 시도한다.
 * ============================================================ */

/* 시험할 때만 다른 주소를 보게 한다. 평소에는 공식 주소를 쓴다. */
const API = process.env.THREADS_API || 'https://graph.threads.net/v1.0';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function call(path, params, opts) {
  const o = opts || {};
  const url = API + path;
  const body = new URLSearchParams(params);

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), o.timeout || 30000);
  let res;
  try {
    res = await fetch(url, {
      method: o.method || 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: o.method === 'GET' ? undefined : body,
      signal: ctrl.signal,
    });
  } catch (e) {
    clearTimeout(timer);
    const err = new Error(e.name === 'AbortError'
      ? '스레드가 제때 답하지 않았습니다.'
      : '스레드에 연결하지 못했습니다.');
    err.code = 'NETWORK';
    throw err;
  }
  clearTimeout(timer);

  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch (e) { /* 그대로 둔다 */ }

  if (!res.ok) {
    const err = new Error(explain(res.status, json, text));
    err.code = 'THREADS_' + res.status;
    err.raw = (json && json.error) || text.slice(0, 300);
    throw err;
  }
  return json || {};
}

/** 스레드가 주는 오류를 교육생 말로 */
function explain(status, json, text) {
  const e = (json && json.error) || {};
  const m = String(e.message || text || '');

  if (status === 401 || /access token/i.test(m) || e.code === 190) {
    return '스레드 토큰이 만료되었거나 잘못됐습니다. 설정에서 토큰을 다시 등록해주세요. (장기 토큰은 60일마다 갱신해야 합니다)';
  }
  if (/rate limit|too many/i.test(m) || status === 429) {
    return '스레드가 잠시 막았습니다. 하루 250개까지 올릴 수 있습니다. 시간을 두고 다시 시도해주세요.';
  }
  if (/permission|scope/i.test(m)) {
    return '토큰에 글쓰기 권한이 없습니다. threads_basic 과 threads_content_publish 권한이 있어야 합니다.';
  }
  return '스레드 오류: ' + m.slice(0, 200);
}

/** 토큰이 누구 것인지 확인한다. 등록할 때 한 번 부른다. */
async function whoami(token) {
  const json = await call('/me?fields=id,username&access_token=' + encodeURIComponent(token), {}, { method: 'GET' });
  return { id: json.id, username: json.username || '' };
}

/**
 * 한 편을 올린다.
 * replyTo 가 있으면 그 글의 답글로 붙는다.
 */
async function publishOne(token, userId, text, replyTo) {
  const params = {
    media_type: 'TEXT',
    text: text,
    access_token: token,
  };
  if (replyTo) params.reply_to_id = replyTo;

  const made = await call('/' + userId + '/threads', params);
  if (!made.id) {
    const e = new Error('스레드가 글 그릇을 만들지 못했습니다.');
    e.code = 'NO_CONTAINER';
    throw e;
  }

  /* 그릇이 준비될 때까지 잠깐. 바로 올리면 가끔 실패한다. */
  let last = null;
  for (const wait of [1200, 2500, 5000]) {
    await sleep(wait);
    try {
      const out = await call('/' + userId + '/threads_publish', {
        creation_id: made.id,
        access_token: token,
      });
      if (out.id) return out.id;
    } catch (e) {
      last = e;
      /* 준비가 덜 된 것 말고 다른 오류면 더 기다려도 소용없다 */
      if (!/not ready|processing|media/i.test(String(e.raw && e.raw.message || e.message))) throw e;
    }
  }
  throw last || new Error('스레드가 글을 올리지 못했습니다.');
}

/**
 * 글 하나(여러 편일 수 있다)를 통째로 올린다.
 * 1편을 올리고, 나머지는 앞 편에 답글로 잇는다.
 *
 * 중간에 실패하면 이미 올라간 편은 그대로 둔다 —
 * 지우면 사람들이 이미 본 글이 사라져 더 이상하다.
 * 어디까지 올렸는지 돌려줘서 화면에 알려준다.
 */
async function publishPost(token, userId, parts) {
  const ids = [];
  let rootId = null;

  for (let i = 0; i < parts.length; i++) {
    try {
      const id = await publishOne(token, userId, parts[i], i === 0 ? null : ids[i - 1]);
      ids.push(id);
      if (i === 0) rootId = id;
    } catch (e) {
      e.publishedIds = ids;
      e.partIndex = i;
      if (ids.length) {
        e.message = (i + 1) + '번째 편에서 막혔습니다. 앞의 ' + ids.length +
                    '편은 이미 올라갔습니다.\n' + e.message;
      }
      throw e;
    }
  }

  return { rootId, ids, permalink: await permalinkOf(token, rootId) };
}

/** 올린 글의 주소를 물어본다. 못 받아와도 발행 자체는 성공이니 조용히 넘어간다. */
async function permalinkOf(token, id) {
  if (!id) return null;
  try {
    const j = await call('/' + id + '?fields=permalink&access_token=' + encodeURIComponent(token),
                         {}, { method: 'GET', timeout: 10000 });
    return j.permalink || null;
  } catch (e) {
    return null;
  }
}

module.exports = { whoami, publishOne, publishPost, permalinkOf, API };
