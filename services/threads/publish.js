/* ============================================================
 * services/threads/publish.js — 실제로 내보내는 일
 *
 * 화면에서 누르는 「지금 올리기 · 예약」과 자동 규칙이 **같은 길**을 타야 한다.
 * 예전에는 이 두 함수가 라우트 안에 있어서 자동 규칙이 쓸 수가 없었다.
 * 한쪽만 고치면 예약한 글에는 꼬리말이 안 붙는 사고가 난다.
 * ============================================================ */

const store = require('./store');
const accounts = require('./accounts');
const zernio = require('./zernio');
const tail = require('./tail');
const { checkPost } = require('./guideline');
const { numberParts } = require('./length');

/** 올리기 전에 꼭 보는 것들. 화면과 서버가 같은 기준을 쓴다. */
async function readyToSend(userId, post) {
  const s = await store.getSettings(userId);
  const acc = await accounts.active(userId);

  if (!acc) {
    return { ok: false, why: '올릴 스레드 계정이 없습니다. 설정에서 먼저 등록해주세요.' };
  }
  if (!s.allowPublish) {
    return { ok: false, why: '올리기가 잠겨 있습니다. 설정에서 「스레드에 올리기 허용」을 켜주세요.' };
  }
  /* 화면과 같은 기준으로 본다. 편이 여럿인 것은 틀이 정한 것이다. */
  const check = checkPost(Object.assign({}, post, {
    allowChain: (post.parts || []).length > 1,
  }));
  if (!check.passHard) {
    const bad = check.rows.filter((r) => r.hard && !r.ok).map((r) => r.label).join(', ');
    return { ok: false, why: '지침에 걸립니다 — ' + bad };
  }
  return { ok: true, acc: acc };
}

/**
 * 실제로 나갈 본문을 만든다 — 번호 붙이기 + 리스트 댓글 + 꼬리말 한 편.
 * 발행과 예약이 똑같이 써야 한다.
 */
async function bodyToSend(userId, post) {
  const settings = await store.getSettings(userId);

  /* 번호(1/2 · 2/2)는 **이 글이 붙이기로 한 경우에만** 붙인다.
     예전에는 편이 셋 이상이면 무조건 붙었다. 그래서 원치 않는 사람에게도
     1/3 · 2/3 이 나갔다.
     ⚠️ 전역 설정이 아니라 글마다 본다. 운세만 나눠 올리고 나머지는
        한 편으로 쓰는 사람이 있기 때문이다. */
  const wantNum = !!post.numbered;
  let body = (wantNum && post.parts.length > 1) ? numberParts(post.parts) : post.parts;

  /* 리스트형의 댓글. 본문 바로 뒤에 답글 한 편으로 붙는다.
     ⚠️ 여기서 붙는 것은 연작이 아니다. numberParts 를 타지 않으므로
        1/2 같은 번호가 붙지 않는다. 본문 한 편 + 첫 댓글이다. */
  if (post.replyText && String(post.replyText).trim()) {
    body = body.concat([String(post.replyText).trim()]);
  }

  /* 이 글은 고정멘트를 빼기로 한 경우. */
  if (post.noTail) {
    return { parts: body, tail: { text: '', withLink: false, off: true } };
  }

  const t = await tail.build(userId, settings);
  return { parts: tail.attach(body, t.text), tail: t };
}

/**
 * 정한 시각에 올라가도록 Zernio 에 걸어둔다.
 * 성공하면 저장된 글을 돌려준다. 못 걸면 던진다.
 */
async function scheduleAt(userId, post, when) {
  const ready = await readyToSend(userId, post);
  if (!ready.ok) {
    const e = new Error(ready.why);
    e.code = 'NOT_READY';
    throw e;
  }
  const send = await bodyToSend(userId, post);
  const out = await zernio.send({
    apiKey: ready.acc.key,
    accountId: ready.acc.accountId,
    parts: send.parts,
    mode: 'schedule',
    scheduledFor: new Date(when).toISOString(),
  });
  return store.updatePost(userId, post.id, {
    status: 'scheduled',
    scheduledFor: new Date(when).toISOString(),
    zernioId: out.id,
    error: null,
    accountId: ready.acc.id,
    accountName: ready.acc.username,
    linkSent: send.tail.withLink,
  });
}

module.exports = { readyToSend, bodyToSend, scheduleAt };
