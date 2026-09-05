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
const dupe = require('./dupe');

/**
 * 올리기 전에 꼭 보는 것들. 화면과 서버가 같은 기준을 쓴다.
 *
 * opts.auto — 자동 규칙이 올리는 경우.
 *   사람이 직접 올릴 때는 **500자만** 막는다. 스레드가 안 받는 길이라 어쩔 수 없다.
 *   나머지 지침은 「고치면 좋은 것」으로 보여주고 판단은 사람이 한다 —
 *   다 지켜야만 올릴 수 있게 해두었더니 짧은 글 하나 시험해보는 것도 막혔다.
 *
 *   자동은 다르다. 사람이 안 보고 나가므로 지침을 다 지킨 글만 내보낸다.
 */
async function readyToSend(userId, post, opts) {
  const o = opts || {};
  /* 규칙이 계정을 집어 보내면 그 계정으로 나간다.
     안 집었으면 지금 고른 계정. 계정을 두세 개 돌리면 이게 갈려야 한다. */
  const acc = (o.accountId && await accounts.byId(userId, o.accountId))
    || await accounts.active(userId);
  const s = await store.getSettings(userId, acc ? acc.id : undefined);

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
  const auto = !!(opts && opts.auto);

  /* 길이는 누구든 막는다. 스레드가 안 받는다. */
  if (!check.passBlock) {
    const bad = check.rows.filter((r) => r.blocking && !r.ok);
    return { ok: false, why: bad[0].label + ' — ' + (bad[0].detail || '') };
  }
  /* 자동은 사람이 안 보고 나간다. 지침을 다 지킨 글만 내보낸다. */
  if (auto && !check.passHard) {
    return { ok: false, why: '지침에 걸립니다 — ' + check.advice.join(', ') };
  }

  /* ⚠️ 같은 글이 두 번 나가는 것을 막는다.
        규칙을 두 개 만들어 두면 둘 다 같은 운세 틀을 쓰고 날짜도 띠도
        계산값이라 같아서, 글자까지 거의 같은 글이 두 계정에 나갔다.
        여러 계정에 같은 글을 뿌리는 것은 스레드가 스팸으로 보는 모양이다.
        어느 길로 오든 여기서 걸린다. */
  try {
    /* 어느 계정으로 나갈지 알려줘야 「같은 계정인가」를 가릴 수 있다.
       원고에는 계정이 안 새겨져 있어서 여기서 붙여준다. */
    const twin = await dupe.findTwin(userId, Object.assign({}, post, { accountId: acc.id }));
    if (twin) return { ok: false, why: dupe.why(twin, acc.username) };
  } catch (e) {
    /* 못 봤다고 못 올리게 하면 더 답답하다. 검사만 건너뛴다. */
    console.error('[스레드] 같은 글 검사 실패:', e.message);
  }

  return { ok: true, acc: acc, advice: check.advice };
}

/**
 * 실제로 나갈 본문을 만든다 — 번호 붙이기 + 리스트 댓글 + 꼬리말 한 편.
 * 발행과 예약이 똑같이 써야 한다.
 */
async function bodyToSend(userId, post, accountId) {
  /* 꼬리말·링크는 계정마다 다르다. 그 계정 몫을 읽어야 한다. */
  const settings = await store.getSettings(userId, accountId);

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
async function scheduleAt(userId, post, when, opts) {
  const ready = await readyToSend(userId, post, opts);
  if (!ready.ok) {
    const e = new Error(ready.why);
    e.code = 'NOT_READY';
    throw e;
  }
  const send = await bodyToSend(userId, post, ready.acc.id);
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
