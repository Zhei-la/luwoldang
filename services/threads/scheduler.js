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

const EVERY_MS = 5 * 60 * 1000;     // 5분마다. 급할 것 없다.
let timer = null;
let running = false;

/** 예약해둔 것 중 시각이 지난 글을 가져온다 */
async function dueRows(limit) {
  const { rows } = await pool.query(
    /* 열쇠는 계정 표에 있다. 그 글을 올린 계정이 아직 남아 있어야 물어볼 수 있다. */
    `SELECT p.*, a.zernio_key
       FROM th_posts p
       JOIN th_settings s ON s.user_id = p.user_id
       JOIN th_accounts a ON a.id = s.active_account
      WHERE p.status = 'scheduled'
        AND p.scheduled_for <= NOW()
        AND p.zernio_id IS NOT NULL
      ORDER BY p.scheduled_for
      LIMIT $1`,
    [limit || 20]
  );
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
    /* 물어보다 실패한 것뿐이다. 글 상태는 건드리지 않는다. */
    return 'unknown';
  }
}

async function tick() {
  if (running) return;
  running = true;
  try {
    const rows = await dueRows(20);
    let done = 0;
    for (const r of rows) {
      const out = await checkOne(r);
      if (out === 'published' || out === 'failed') done++;
    }
    if (done) console.log('[스레드] 예약 글 ' + done + '건 상태 갱신');
  } catch (e) {
    console.error('[스레드] 예약 확인 실패:', e.message);
  } finally {
    running = false;
  }
}

function start() {
  if (timer) return;
  timer = setInterval(tick, EVERY_MS);
  if (timer.unref) timer.unref();
  console.log('[스레드] 예약 글 상태 확인 시작 (5분 주기)');
}

function stop() {
  if (timer) clearInterval(timer);
  timer = null;
}

module.exports = { start, stop, tick, checkOne, dueRows };
