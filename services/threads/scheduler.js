/* ============================================================
 * services/threads/scheduler.js — 예약한 글이 올라갔는지 확인한다
 *
 * 예약 자체는 Zernio 가 맡는다. 정한 시각이 되면 Zernio 가 올린다.
 * 우리 서버가 꺼져 있어도, 다시 떠도 상관없다.
 *
 * 그래서 여기서 하는 일은 하나다 —
 * 예약해둔 글이 실제로 올라갔는지 물어보고 화면에 표시를 맞춘다.
 * 우리가 직접 올리지 않으므로 두 번 올라갈 걱정이 없다.
 * ============================================================ */

const { pool } = require('../../db');
const zernio = require('./zernio');
const autopost = require('./autopost');

const EVERY_MS = 5 * 60 * 1000;     // 5분마다. 급할 것 없다.
let timer = null;
let running = false;

/**
 * 예약해둔 것 중 시각이 지난 글.
 *
 * 열쇠는 그 글을 올린 계정에서 가져온다 (th_posts.account_id).
 * 예전에는 「지금 고른 계정」을 봤는데, 계정을 바꾸면 예약해둔 글이
 * 조회 대상에서 통째로 빠져 영영 「예약중」에 머물렀다.
 * 계정 칸이 비어 있는 옛 글은 그 사람의 아무 계정이나 써서 물어본다.
 */
function dueSql(extra, when) {
  return `SELECT * FROM (
            SELECT p.*, COALESCE(own.zernio_key, fa.zernio_key) AS zernio_key
              FROM th_posts p
              LEFT JOIN th_accounts own
                     ON own.id = p.account_id AND own.user_id = p.user_id
              /* 계정 칸이 빈 옛 글용 — 그 사람이 제일 먼저 등록한 계정.
                 id 가 SERIAL 이라 제일 작은 것이 제일 먼저 넣은 것이다. */
              LEFT JOIN (
                SELECT user_id, MIN(id) AS aid FROM th_accounts GROUP BY user_id
              ) f ON f.user_id = p.user_id
              LEFT JOIN th_accounts fa ON fa.id = f.aid
             WHERE p.status = 'scheduled'
               AND p.scheduled_for ${when || '<= NOW()'}
               AND p.zernio_id IS NOT NULL
               ${extra}
          ) q
          WHERE q.zernio_key IS NOT NULL
          ORDER BY q.scheduled_for`;
}

async function dueRows(limit) {
  const { rows } = await pool.query(dueSql('') + ' LIMIT $1', [limit || 20]);
  return rows;
}

/** 한 사람 것만. 화면을 열 때 바로 맞춰주려고 쓴다. */
async function dueRowsFor(userId, limit) {
  const { rows } = await pool.query(
    dueSql('AND p.user_id = $1') + ' LIMIT $2', [userId, limit || 20]
  );
  return rows;
}

/**
 * **아직 시각이 안 된** 예약들.
 *
 * ⚠️ 우리 화면에는 「예약해뒀습니다」인데 Zernio 에는 그 글이 없는 일이
 *    있었다. Zernio 대시보드에서 손으로 지웠거나, Zernio 쪽에서 없어진
 *    경우다. 그런데 우리는 **시각이 지난 뒤에야** 물어봤고, 물어보다
 *    404 가 나면 그냥 넘어가서 영영 「예약됨」으로 남았다.
 *    시간이 돼도 안 올라가는데 화면은 올라간다고 하고 있었다.
 *
 *    그래서 앞으로 올라갈 것도 미리 확인한다. 없어졌으면 그 자리에서
 *    「안 올라갑니다」로 바꿔 사람이 다시 걸 수 있게 한다.
 */
async function aheadRows(limit) {
  const { rows } = await pool.query(
    dueSql('', '> NOW()') + ' LIMIT $1', [limit || 10]);
  return rows;
}

async function aheadRowsFor(userId, limit) {
  const { rows } = await pool.query(
    dueSql('AND p.user_id = $1', '> NOW()') + ' LIMIT $2', [userId, limit || 10]);
  return rows;
}

async function checkOne(row) {
  try {
    const out = await zernio.getStatus(row.zernio_key, row.zernio_id);
    const st = String(out.status || '').toLowerCase();

    if (st === 'published' || st === 'posted' || st === 'success' || out.permalink) {
      await pool.query(
        `UPDATE th_posts SET status='published', permalink=$2, published_at=NOW(), error=NULL
          WHERE id=$1`,
        [row.id, out.permalink || null]
      );
      return 'published';
    }
    if (st === 'failed' || st === 'error') {
      await pool.query(
        `UPDATE th_posts SET status='failed', error=$2 WHERE id=$1`,
        [row.id, 'Zernio 에서 올리지 못했습니다. Zernio 대시보드를 확인해주세요.']
      );
      return 'failed';
    }
    return 'waiting';          /* 아직 처리 중이면 다음 회차에 다시 본다 */
  } catch (e) {
    /* ⚠️ **Zernio 에 그 글이 없다.** 대시보드에서 손으로 지웠거나
          Zernio 쪽에서 없어진 경우다. 예전엔 이걸 「물어보다 실패」로 보고
          그냥 넘어가서, 화면에는 「예약해뒀습니다」인데 시간이 돼도
          아무것도 안 올라가는 상태가 영영 남았다.
          없어졌으면 없어졌다고 화면에 적어야 사람이 다시 걸 수 있다. */
    if (e.code === 'ZERNIO_404') {
      await pool.query(
        `UPDATE th_posts SET status='failed', zernio_id=NULL, error=$2 WHERE id=$1`,
        [row.id, 'Zernio 에 이 예약이 없습니다. 지워졌거나 없어졌습니다 — ' +
          '이대로 두면 안 올라갑니다. 「시간 설정」으로 다시 걸어주세요.']
      );
      return 'gone';
    }
    /* 그 밖의 실패는 물어보다 못 물어본 것뿐이다. 글 상태는 안 건드린다 —
       Zernio 가 잠깐 느린 것을 「없어졌다」로 보면 멀쩡한 예약을 푼다. */
    return 'unknown';
  }
}

/**
 * 한 사람의 지난 예약을 지금 바로 확인한다.
 * 5분 주기만 믿으면 「시간이 지났는데 아직 예약중이네」 하는 순간이 생긴다.
 * 목록을 열 때 이걸 한 번 돌려서 화면과 실제를 맞춘다.
 */
async function checkUser(userId) {
  let changed = 0;
  try {
    const rows = await dueRowsFor(userId, 10);
    for (const r of rows) {
      const out = await checkOne(r);
      if (out === 'published' || out === 'failed' || out === 'gone') changed++;
    }
  } catch (e) {
    /* 확인에 실패해도 목록은 보여줘야 한다 */
  }
  /* ⚠️ 앞으로 올라갈 것도 본다. Zernio 에서 없어진 예약을 시각이 지난
        뒤에야 알면 늦다 — 그 날 글이 통째로 빠진 뒤다.
        목록을 열 때 몇 개만 훑는다. 많이 물어보면 화면이 느려진다. */
  try {
    for (const r of await aheadRowsFor(userId, 8)) {
      if ((await checkOne(r)) === 'gone') changed++;
    }
  } catch (e) { /* 못 물어봐도 목록은 보여준다 */ }
  return changed;
}

async function tick() {
  if (running) return;
  running = true;
  try {
    const rows = await dueRows(20);
    let done = 0;
    let gone = 0;
    for (const r of rows) {
      const out = await checkOne(r);
      if (out === 'published' || out === 'failed') done++;
      if (out === 'gone') gone++;
    }
    /* ⚠️ 앞으로 올라갈 것도 훑는다. Zernio 에서 없어진 예약을 시각이
          지난 뒤에야 알면 그 날 글이 통째로 빠진 뒤다. */
    for (const r of await aheadRows(10)) {
      if ((await checkOne(r)) === 'gone') gone++;
    }
    if (done) console.log('[스레드] 예약 글 ' + done + '건 상태 갱신');
    if (gone) console.log('[스레드] Zernio 에서 사라진 예약 ' + gone + '건 — 안 올라갑니다');
  } catch (e) {
    console.error('[스레드] 예약 확인 실패:', e.message);
  }

  /* 자동 규칙대로 앞으로 올릴 글을 미리 만들어 채운다.
     위 확인이 실패해도 이건 돌아야 한다 — 서로 다른 일이다. */
  try {
    const out = await autopost.tick();
    if (out.made) console.log('[스레드] 자동 규칙으로 ' + out.made + '개 만들어 걸었습니다');
    if (out.moved) console.log('[스레드] 지난 자리 ' + out.moved + '개를 다음 차례로 밀었습니다');
    if (out.errors.length) console.error('[스레드] 자동 규칙 오류:', out.errors.slice(0, 3).join(' / '));
  } catch (e) {
    console.error('[스레드] 자동 만들기 실패:', e.message);
  }

  running = false;
}

function start() {
  if (timer) return;
  timer = setInterval(tick, EVERY_MS);
  if (timer.unref) timer.unref();

  /* ⚠️ 예전엔 첫 바퀴가 **5분 뒤**에야 돌았다. 배포할 때마다 서버가
        다시 뜨므로, 배포가 잦은 날에는 한 바퀴도 못 돌고 계속 미뤄진다.
        「아직 한 번도 안 돌았습니다」가 그래서 떴다.
        뜨자마자 한 번 돈다. 20초는 DB·설정이 자리잡을 틈이다. */
  const first = setTimeout(() => {
    tick().catch((e) => console.error('[스레드] 첫 확인 실패:', e.message));
  }, 20 * 1000);
  if (first.unref) first.unref();

  console.log('[스레드] 예약 글 상태 확인 시작 (5분 주기)');
}

function stop() {
  if (timer) clearInterval(timer);
  timer = null;
}

module.exports = { start, stop, tick, checkOne, checkUser, dueRows, dueRowsFor, aheadRows, aheadRowsFor };
