/* ============================================================
 * services/threads/accounts.js — 올릴 스레드 계정들
 *
 * 계정을 여러 개 등록해두고 골라서 쓴다.
 * 열쇠는 계정마다 따로 담는다 — Zernio 계정을 여러 개 쓰는 분도 있고,
 * 한 열쇠에 계정이 여러 개 붙어 있는 경우도 있다. 둘 다 된다.
 *
 * 고른 계정 하나가 "지금 올릴 곳" 이다. 발행·예약은 여기를 본다.
 * ============================================================ */

const { pool } = require('../../db');

/** 등록해둔 계정 목록. 지금 쓰는 것에 active 표시가 붙는다. */
async function list(userId) {
  const { rows } = await pool.query(
    `SELECT a.id, a.account_id, a.username, a.created_at,
            (a.id = s.active_account) AS active
       FROM th_accounts a
       LEFT JOIN th_settings s ON s.user_id = a.user_id
      WHERE a.user_id = $1
      ORDER BY a.created_at`,
    [userId]
  );
  return rows.map((r) => ({
    id: r.id,
    accountId: r.account_id,
    username: r.username || '',
    active: !!r.active,
  }));
}

/** 계정 하나를 번호로 집어 온다. 규칙마다 나갈 계정이 다를 수 있다. */
async function byId(userId, id) {
  if (!id) return null;
  const { rows } = await pool.query(
    'SELECT * FROM th_accounts WHERE user_id = $1 AND id = $2',
    [userId, id]
  );
  const r = rows[0];
  if (!r) return null;
  return { id: r.id, key: r.zernio_key, accountId: r.account_id, username: r.username || '' };
}

/**
 * 지금 올릴 계정.
 * 정해둔 게 없으면 제일 먼저 등록한 것을 쓴다 —
 * 계정이 있는데 "고르지 않았다"고 막으면 답답하다.
 */
async function active(userId) {
  const { rows } = await pool.query(
    `SELECT a.*, (a.id = s.active_account) AS chosen
       FROM th_accounts a
       LEFT JOIN th_settings s ON s.user_id = a.user_id
      WHERE a.user_id = $1
      ORDER BY chosen DESC NULLS LAST, a.created_at
      LIMIT 1`,
    [userId]
  );
  const r = rows[0];
  if (!r) return null;
  return {
    id: r.id,
    key: r.zernio_key,
    accountId: r.account_id,
    username: r.username || '',
  };
}

/** 같은 계정을 또 넣으면 열쇠만 새로 고친다 */
async function add(userId, key, accountId, username) {
  const { rows } = await pool.query(
    `INSERT INTO th_accounts (user_id, zernio_key, account_id, username)
     VALUES ($1,$2,$3,$4)
     ON CONFLICT (user_id, account_id)
     DO UPDATE SET zernio_key = EXCLUDED.zernio_key, username = EXCLUDED.username
     RETURNING id`,
    [userId, key, String(accountId), username || '']
  );
  const id = rows[0].id;

  /* 처음 등록한 계정은 바로 쓰게 정해둔다 */
  await pool.query(
    `INSERT INTO th_settings (user_id, active_account) VALUES ($1, $2)
     ON CONFLICT (user_id) DO UPDATE
        SET active_account = COALESCE(th_settings.active_account, $2)`,
    [userId, id]
  );
  return id;
}

/** 올릴 계정을 바꾼다 */
async function setActive(userId, id) {
  const { rows } = await pool.query(
    'SELECT id FROM th_accounts WHERE user_id = $1 AND id = $2',
    [userId, id]
  );
  if (!rows[0]) return false;
  await pool.query(
    `INSERT INTO th_settings (user_id, active_account) VALUES ($1,$2)
     ON CONFLICT (user_id) DO UPDATE SET active_account = $2`,
    [userId, id]
  );
  return true;
}

/** 계정을 뺀다. 쓰던 계정이면 남은 것 중 하나로 옮긴다. */
async function remove(userId, id) {
  await pool.query('DELETE FROM th_accounts WHERE user_id = $1 AND id = $2', [userId, id]);
  await pool.query(
    `UPDATE th_settings
        SET active_account = (SELECT id FROM th_accounts
                               WHERE user_id = $1 ORDER BY created_at LIMIT 1)
      WHERE user_id = $1 AND active_account = $2`,
    [userId, id]
  );
}

async function count(userId) {
  const { rows } = await pool.query(
    'SELECT COUNT(*)::int AS n FROM th_accounts WHERE user_id = $1',
    [userId]
  );
  return rows[0] ? rows[0].n : 0;
}

module.exports = { list, active, byId, add, setActive, remove, count };
