/* ============================================================
 * services/threads/scheduler.js — 예약한 글을 때가 되면 올린다
 *
 * 1분마다 예약 시각이 지난 글을 찾아 올린다.
 * 브라우저가 아니라 서버에서 돌기 때문에, 창을 닫아도 올라간다.
 * (예전 도구는 브라우저에서 돌아서 창을 닫으면 아무 일도 안 일어났다)
 *
 * 지켜야 할 것
 *  - 같은 글을 두 번 올리지 않는다. 집어들 때 상태를 먼저 바꾼다.
 *  - 한 사람이 막혀도 다른 사람 것은 계속 올린다.
 *  - 컨테이너가 다시 떠도 예약은 DB 에 있으므로 그대로 이어진다.
 * ============================================================ */

const { pool } = require('../../db');
const { publishPost } = require('./publish');
const { numberParts } = require('./length');
const { checkPost } = require('./guideline');

const EVERY_MS = 60 * 1000;
let timer = null;
let running = false;

/** 때가 된 글을 집어든다. 집어들면서 바로 sending 으로 바꿔 두 번 올리는 걸 막는다. */
async function claimDue(limit) {
  const { rows } = await pool.query(
    `UPDATE th_posts SET status = 'sending'
      WHERE id IN (
        SELECT id FROM th_posts
         WHERE status = 'scheduled' AND scheduled_for <= NOW()
         ORDER BY scheduled_for
         LIMIT $1
         FOR UPDATE SKIP LOCKED
      )
      RETURNING *`,
    [limit || 5]
  );
  return rows;
}

async function settingsOf(userId) {
  const { rows } = await pool.query('SELECT * FROM th_settings WHERE user_id = $1', [userId]);
  return rows[0] || null;
}

async function sendOne(row) {
  const s = await settingsOf(row.user_id);

  /* 발행 잠금은 서버에서 본다. 화면만 막으면 우회된다. */
  if (!s || !s.allow_publish) {
    await pool.query(
      `UPDATE th_posts SET status='failed', error=$2 WHERE id=$1`,
      [row.id, '자동 발행이 꺼져 있습니다. 설정에서 켜주세요.']
    );
    return { ok: false };
  }
  if (!s.threads_token || !s.threads_user_id) {
    await pool.query(
      `UPDATE th_posts SET status='failed', error=$2 WHERE id=$1`,
      [row.id, '스레드 토큰이 등록되어 있지 않습니다.']
    );
    return { ok: false };
  }

  const parts = row.parts || [];
  const form = row.form;
  const shown = form === 'chain' ? numberParts(parts) : parts;

  /* 올리기 직전에 지침을 한 번 더 본다. 저장 뒤에 고쳤을 수 있다. */
  const check = checkPost({ postType: row.post_type, form, parts });
  if (!check.passHard) {
    const bad = check.rows.filter((r) => r.hard && !r.ok).map((r) => r.label).join(', ');
    await pool.query(
      `UPDATE th_posts SET status='failed', error=$2 WHERE id=$1`,
      [row.id, '지침에 걸려 올리지 않았습니다 — ' + bad]
    );
    return { ok: false };
  }

  try {
    const out = await publishPost(s.threads_token, s.threads_user_id, shown);
    await pool.query(
      `UPDATE th_posts
          SET status='published', zernio_id=$2, permalink=$3, published_at=NOW(), error=NULL
        WHERE id=$1`,
      [row.id, out.rootId, out.permalink]
    );
    return { ok: true };
  } catch (e) {
    await pool.query(
      `UPDATE th_posts SET status='failed', error=$2 WHERE id=$1`,
      [row.id, String(e.message || e).slice(0, 500)]
    );
    return { ok: false, error: e.message };
  }
}

async function tick() {
  if (running) return;                    // 앞 회차가 아직 돌고 있으면 건너뛴다
  running = true;
  try {
    const due = await claimDue(5);
    for (const row of due) {
      try { await sendOne(row); }
      catch (e) { console.error('[스레드] 발행 중 오류:', e.message); }
    }
    if (due.length) console.log('[스레드] 예약 발행 ' + due.length + '건 처리');
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
  console.log('[스레드] 예약 발행 감시 시작 (1분 주기)');
}

function stop() {
  if (timer) clearInterval(timer);
  timer = null;
}

module.exports = { start, stop, tick, sendOne, claimDue };
