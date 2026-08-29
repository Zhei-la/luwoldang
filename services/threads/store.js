/* ============================================================
 * services/threads/store.js — 스레드 자동화 저장소
 *
 * 원본은 1인용이라 data/*.json 파일에 담았다.
 * 루월당은 교육생이 여럿이므로 전부 Postgres 로 옮기고
 * 모든 조회·저장에 user_id 를 붙인다.
 *
 * ⚠️ 여기 있는 함수는 예외 없이 첫 인자가 userId 다.
 *    빠뜨리면 남의 글이 보인다.
 * ============================================================ */

const crypto = require('crypto');
const { pool } = require('../../db');

function newId() {
  return crypto.randomBytes(6).toString('hex');
}

/* ── 글 ───────────────────────────────────────────── */

/** DB 한 줄을 화면이 쓰는 모양으로 바꾼다 */
function rowToPost(r) {
  return {
    id: r.id,
    topic: r.topic,
    situation: r.situation,
    hooks: r.hooks || [],
    postType: r.post_type,
    form: r.form,
    parts: r.parts || [],
    replyType: r.reply_type || undefined,
    cta: !!r.cta,
    cutNote: r.cut_note || undefined,
    status: r.status,
    scheduledFor: r.scheduled_for ? new Date(r.scheduled_for).toISOString() : undefined,
    zernioId: r.zernio_id || undefined,
    permalink: r.permalink || undefined,
    publishedAt: r.published_at ? new Date(r.published_at).toISOString() : undefined,
    savedAt: r.saved_at ? new Date(r.saved_at).toISOString() : undefined,
    error: r.error || undefined,
    auto: !!r.auto,
    createdAt: r.created_at ? new Date(r.created_at).toISOString() : undefined,
  };
}

async function getPosts(userId, opts) {
  const o = opts || {};
  const where = ['user_id = $1'];
  const args = [userId];
  if (o.status) { args.push(o.status); where.push('status = $' + args.length); }
  const { rows } = await pool.query(
    'SELECT * FROM th_posts WHERE ' + where.join(' AND ') + ' ORDER BY created_at DESC, id DESC',
    args
  );
  return rows.map(rowToPost);
}

async function getPost(userId, id) {
  const { rows } = await pool.query(
    'SELECT * FROM th_posts WHERE user_id = $1 AND id = $2',
    [userId, id]
  );
  return rows[0] ? rowToPost(rows[0]) : null;
}

/** 새 글 여러 개를 한 번에 넣는다 */
async function insertPosts(userId, list) {
  if (!list.length) return [];
  const made = [];
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const p of list) {
      const id = p.id || newId();
      await client.query(
        `INSERT INTO th_posts
           (id, user_id, topic, situation, hooks, post_type, form, parts,
            reply_type, cta, cut_note, status, auto)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
        [
          id, userId, p.topic || '', p.situation || '',
          JSON.stringify(p.hooks || []), p.postType || '', p.form || 'single',
          JSON.stringify(p.parts || []), p.replyType || null, !!p.cta,
          p.cutNote || null, p.status || 'draft', !!p.auto,
        ]
      );
      made.push(id);
    }
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
  return made;
}

/** 고칠 수 있는 칸만 골라 바꾼다 */
const PATCHABLE = {
  parts: ['parts', (v) => JSON.stringify(v)],
  form: ['form', (v) => v],
  postType: ['post_type', (v) => v],
  cta: ['cta', (v) => !!v],
  cutNote: ['cut_note', (v) => v],
  status: ['status', (v) => v],
  scheduledFor: ['scheduled_for', (v) => v],
  zernioId: ['zernio_id', (v) => v],
  permalink: ['permalink', (v) => v],
  publishedAt: ['published_at', (v) => v],
  savedAt: ['saved_at', (v) => v],
  error: ['error', (v) => v],
};

async function updatePost(userId, id, patch) {
  const sets = [];
  const args = [userId, id];
  for (const key of Object.keys(patch || {})) {
    const map = PATCHABLE[key];
    if (!map) continue;
    args.push(map[1](patch[key]));
    sets.push(map[0] + ' = $' + args.length);
  }
  if (!sets.length) return getPost(userId, id);
  await pool.query(
    'UPDATE th_posts SET ' + sets.join(', ') + ' WHERE user_id = $1 AND id = $2',
    args
  );
  return getPost(userId, id);
}

/* ── 휴지통 ───────────────────────────────────────── */

/**
 * 지운 글은 바로 없애지 않고 휴지통에 한 묶음으로 담는다.
 * 일괄 삭제가 중간에 죽어 27개만 지워지던 사고가 있어 한 번에 처리한다.
 */
async function deletePosts(userId, ids) {
  if (!ids || !ids.length) return { deleted: 0 };
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(
      'SELECT * FROM th_posts WHERE user_id = $1 AND id = ANY($2)',
      [userId, ids]
    );
    if (rows.length) {
      await client.query(
        'INSERT INTO th_trash (user_id, posts) VALUES ($1, $2)',
        [userId, JSON.stringify(rows.map(rowToPost))]
      );
      await client.query('DELETE FROM th_posts WHERE user_id = $1 AND id = ANY($2)', [userId, ids]);
      /* 최근 20묶음만 남긴다 */
      await client.query(
        `DELETE FROM th_trash WHERE user_id = $1 AND id NOT IN (
           SELECT id FROM th_trash WHERE user_id = $1 ORDER BY deleted_at DESC LIMIT 20)`,
        [userId]
      );
    }
    await client.query('COMMIT');
    return { deleted: rows.length };
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

/** 가장 최근에 버린 묶음을 되살린다 */
async function restoreLatest(userId) {
  const { rows } = await pool.query(
    'SELECT * FROM th_trash WHERE user_id = $1 ORDER BY deleted_at DESC LIMIT 1',
    [userId]
  );
  if (!rows[0]) return { restored: 0 };
  const posts = rows[0].posts || [];
  await insertPosts(userId, posts);
  await pool.query('DELETE FROM th_trash WHERE id = $1', [rows[0].id]);
  return { restored: posts.length };
}

async function trashCount(userId) {
  const { rows } = await pool.query(
    'SELECT COUNT(*)::int AS n FROM th_trash WHERE user_id = $1',
    [userId]
  );
  return rows[0] ? rows[0].n : 0;
}

/* ── 묶음(생성 배치) ──────────────────────────────── */

async function saveBatch(userId, b) {
  const id = b.id || newId();
  await pool.query(
    `INSERT INTO th_batches (id, user_id, topic, situation, hook_scan, unusable, post_ids)
     VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    [
      id, userId, b.topic || '', b.situation || '',
      JSON.stringify(b.hookScan || []), JSON.stringify(b.unusable || []),
      JSON.stringify(b.postIds || []),
    ]
  );
  return id;
}

/* ── 후킹 원장 ────────────────────────────────────── */

/**
 * 어떤 후킹을 언제 몇 번 썼는지. 이게 소재 재고다.
 * 최근에 쓴 건 프롬프트에서 후순위로 밀린다.
 */
async function getLedger(userId) {
  const { rows } = await pool.query(
    'SELECT hook_id, last_used, used_count FROM th_hooks WHERE user_id = $1',
    [userId]
  );
  const out = {};
  for (const r of rows) {
    out[r.hook_id] = {
      lastUsed: r.last_used ? new Date(r.last_used).toISOString().slice(0, 10) : '',
      count: r.used_count,
    };
  }
  return out;
}

/** 저장할 때만 기록한다. 버린 글의 후킹은 다시 쓸 수 있어야 한다. */
async function markHooksUsed(userId, ids) {
  const uniq = [...new Set((ids || []).map(Number).filter((n) => n >= 1 && n <= 26))];
  if (!uniq.length) return;
  for (const id of uniq) {
    await pool.query(
      `INSERT INTO th_hooks (user_id, hook_id, last_used, used_count)
       VALUES ($1, $2, NOW(), 1)
       ON CONFLICT (user_id, hook_id)
       DO UPDATE SET last_used = NOW(), used_count = th_hooks.used_count + 1`,
      [userId, id]
    );
  }
}

/* ── 설정 ─────────────────────────────────────────── */

const DEFAULT_SETTINGS = {
  ctaLink: '',
  zernioKey: '',
  zernioAccountId: '',
  zernioUsername: '',
  allowPublish: false,      // 발행은 기본 잠금
  voicePack: null,
  facts: [],
};

async function getSettings(userId) {
  const { rows } = await pool.query('SELECT * FROM th_settings WHERE user_id = $1', [userId]);
  const r = rows[0];
  if (!r) return Object.assign({}, DEFAULT_SETTINGS);
  return {
    ctaLink: r.cta_link || '',
    zernioKey: r.zernio_key || '',
    zernioAccountId: r.zernio_account_id || '',
    zernioUsername: r.threads_username || '',
    allowPublish: !!r.allow_publish,
    voicePack: r.voice_pack || null,
    facts: r.facts || [],
  };
}

const SETTING_COLS = {
  ctaLink: ['cta_link', (v) => String(v || '')],
  zernioKey: ['zernio_key', (v) => String(v || '')],
  zernioAccountId: ['zernio_account_id', (v) => String(v || '')],
  zernioUsername: ['threads_username', (v) => String(v || '')],
  allowPublish: ['allow_publish', (v) => !!v],
  voicePack: ['voice_pack', (v) => (v ? JSON.stringify(v) : null)],
  facts: ['facts', (v) => JSON.stringify(v || [])],
};

async function saveSettings(userId, patch) {
  await pool.query(
    'INSERT INTO th_settings (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING',
    [userId]
  );
  const sets = [];
  const args = [userId];
  for (const key of Object.keys(patch || {})) {
    const map = SETTING_COLS[key];
    if (!map) continue;
    args.push(map[1](patch[key]));
    sets.push(map[0] + ' = $' + args.length);
  }
  if (sets.length) {
    await pool.query('UPDATE th_settings SET ' + sets.join(', ') + ' WHERE user_id = $1', args);
  }
  return getSettings(userId);
}

/* ── 하루 사용량 ──────────────────────────────────── */

/**
 * 생성은 교육생 본인 API 키로 나가지만, 실수로 수백 번 돌리면
 * 본인 요금이 그대로 나간다. 하루 상한을 둬서 사고를 막는다.
 */
const DAILY_LIMIT = Number(process.env.THREADS_DAILY_LIMIT || 40);

async function countToday(userId) {
  const { rows } = await pool.query(
    `SELECT COUNT(*)::int AS n FROM th_runs
      WHERE user_id = $1 AND ran_at > NOW() - INTERVAL '1 day'`,
    [userId]
  );
  return rows[0] ? rows[0].n : 0;
}

async function markRun(userId, topic) {
  await pool.query('INSERT INTO th_runs (user_id, topic) VALUES ($1, $2)', [userId, topic || '']);
}

module.exports = {
  newId, DAILY_LIMIT,
  getPosts, getPost, insertPosts, updatePost,
  deletePosts, restoreLatest, trashCount,
  saveBatch,
  getLedger, markHooksUsed,
  getSettings, saveSettings,
  countToday, markRun,
};
