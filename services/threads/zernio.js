/* ============================================================
 * services/threads/zernio.js — 스레드에 올리는 곳
 *
 * 스레드에 직접 붙으려면 페이스북 개발자 계정을 만들고 앱을 등록하고
 * 심사를 받아야 한다. 토큰도 60일마다 다시 받아야 한다.
 * Zernio 가 그걸 대신 해준다. 교육생은 가입하고 로그인만 하면 된다.
 *
 * 연재는 threadItems 로 보내면 Zernio 가 순서대로 이어 단다.
 * 예약도 Zernio 가 맡는다 — 우리 서버가 꺼져 있어도 제 시각에 올라간다.
 *
 * 발행 방식을 바꾸려면 이 파일만 고치면 된다.
 * ============================================================ */

/* 시험할 때만 다른 주소를 보게 한다 */
const API = process.env.ZERNIO_API || 'https://zernio.com/api/v1';
const TIMEOUT_MS = Number(process.env.ZERNIO_TIMEOUT_MS || 30000);

async function request(method, path, apiKey, body) {
  const key = String(apiKey || '').trim();
  if (!key) {
    const e = new Error('Zernio 열쇠가 없습니다. 설정에서 먼저 넣어주세요.');
    e.code = 'NO_KEY';
    throw e;
  }

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);

  let res;
  try {
    res = await fetch(API + path, {
      method: method,
      headers: Object.assign(
        { Authorization: 'Bearer ' + key },
        body ? { 'Content-Type': 'application/json' } : {}
      ),
      body: body ? JSON.stringify(body) : undefined,
      signal: ctrl.signal,
    });
  } catch (e) {
    clearTimeout(timer);
    const err = new Error(e.name === 'AbortError'
      ? 'Zernio 가 제때 답하지 않았습니다. 잠시 뒤 다시 시도해주세요.'
      : 'Zernio 에 연결하지 못했습니다.');
    err.code = 'NETWORK';
    throw err;
  }
  clearTimeout(timer);

  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch (e) { json = { raw: text }; }

  if (!res.ok) {
    const err = new Error(explain(res.status, json, text));
    err.code = 'ZERNIO_' + res.status;
    throw err;
  }
  return json;
}

/** Zernio 오류를 교육생 말로 */
function explain(status, json, text) {
  if (status === 409) {
    return '같은 내용이 24시간 안에 이미 올라갔거나 예약돼 있습니다. ' +
           '내용을 조금 바꾸시거나 하루 뒤에 올려주세요. (스레드 규칙입니다)';
  }
  if (status === 401 || status === 403) {
    return 'Zernio 열쇠가 맞지 않습니다. 설정에서 열쇠를 다시 확인해주세요. ' +
           '복사할 때 앞뒤에 공백이 붙지 않았는지도 봐주세요.';
  }
  if (status === 429) return 'Zernio 가 잠시 막았습니다. 잠시 뒤 다시 시도해주세요.';
  if (status >= 500) return 'Zernio 쪽에 문제가 있습니다. 잠시 뒤 다시 시도해주세요.';
  const m = (json && (json.error && json.error.message || json.message)) || text || '';
  return 'Zernio 오류 ' + status + ': ' + String(m).slice(0, 200);
}

/**
 * 연결해둔 계정을 가져온다.
 * 스레드 말고 다른 것도 섞여 올 수 있어 스레드만 걸러낸다.
 */
async function listAccounts(apiKey) {
  const j = await request('GET', '/accounts', apiKey);
  const list = j.data || j.accounts || j;
  return (Array.isArray(list) ? list : [])
    .map((a) => ({
      id: a.id || a._id || a.accountId,
      platform: a.platform,
      username: a.username || a.name || '',
    }))
    .filter((a) => a.id && (!a.platform || String(a.platform).toLowerCase() === 'threads'));
}

/**
 * 스레드로 보낸다.
 *   publish  — 지금 올린다
 *   schedule — 정한 시각에 올린다 (Zernio 가 맡는다)
 *   draft    — Zernio 에 임시저장만
 */
async function send(opts) {
  const parts = (opts.parts || []).filter(Boolean);
  if (!parts.length) throw new Error('올릴 내용이 없습니다.');
  if (!opts.accountId) {
    const e = new Error('올릴 계정을 먼저 고르세요.');
    e.code = 'NO_ACCOUNT';
    throw e;
  }

  const payload = {
    content: parts[0],
    platforms: [{
      platform: 'threads',
      accountId: opts.accountId,
      platformSpecificData: {
        threadItems: parts.map((content) => ({ content: content })),
      },
    }],
  };

  if (opts.mode === 'publish') payload.publishNow = true;
  if (opts.mode === 'schedule') {
    if (!opts.scheduledFor) throw new Error('예약 시각이 없습니다.');
    payload.scheduledFor = opts.scheduledFor;
    payload.timezone = process.env.TZ_NAME || 'Asia/Seoul';
  }

  const res = await request('POST', '/posts', opts.apiKey, payload);
  const node = (res && (res.post || res.data)) || res;
  const id = node && (node._id || node.id);
  if (!id) {
    throw new Error('보내긴 했는데 Zernio 응답에서 글 번호를 찾지 못했습니다. ' +
                    'Zernio 대시보드에서 올라갔는지 확인해주세요.');
  }
  return { id: String(id), permalink: permalinkOf(node) };
}

function permalinkOf(node) {
  if (!node) return null;
  const p = (node.platforms || [])[0] || {};
  return p.publishedUrl || p.permalink || node.permalink || null;
}

/** 예약한 글이 실제로 올라갔는지 확인한다 */
async function getStatus(apiKey, postId) {
  const j = await request('GET', '/posts/' + encodeURIComponent(postId), apiKey);
  const node = (j && (j.post || j.data)) || j;
  return {
    status: node && node.status,
    permalink: permalinkOf(node),
  };
}

/** 예약을 물린다 */
async function remove(apiKey, postId) {
  return request('DELETE', '/posts/' + encodeURIComponent(postId), apiKey);
}

/** 열쇠가 되는지 + 연결된 계정이 있는지 한 번에 본다 */
async function check(apiKey) {
  try {
    const accounts = await listAccounts(apiKey);
    return {
      ok: true,
      accounts: accounts,
      message: accounts.length
        ? '연결됐습니다. 스레드 계정 ' + accounts.length + '개를 찾았습니다.'
        : '열쇠는 맞습니다. 다만 Zernio 에 연결된 스레드 계정이 없습니다. ' +
          'zernio.com 의 Connections 에서 스레드를 먼저 이어주세요.',
    };
  } catch (e) {
    return { ok: false, accounts: [], message: e.message };
  }
}

module.exports = { listAccounts, send, getStatus, remove, check, API };
