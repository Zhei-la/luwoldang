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
    noTail: !!r.no_tail,
    cutNote: r.cut_note || undefined,
    replyText: r.reply_text || '',
    numbered: !!r.numbered,
    ruleId: r.rule_id || undefined,
    slotAt: r.slot_at ? new Date(r.slot_at).toISOString() : undefined,
    status: r.status,
    scheduledFor: r.scheduled_for ? new Date(r.scheduled_for).toISOString() : undefined,
    zernioId: r.zernio_id || undefined,
    accountId: r.account_id || undefined,
    accountName: r.account_name || undefined,
    linkSent: !!r.link_sent,
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
            reply_type, cta, cut_note, status, auto, no_tail, reply_text, rule_id, slot_at, numbered)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`,
        [
          id, userId, p.topic || '', p.situation || '',
          JSON.stringify(p.hooks || []), p.postType || '', p.form || 'single',
          JSON.stringify(p.parts || []), p.replyType || null, !!p.cta,
          p.cutNote || null, p.status || 'draft', !!p.auto, !!p.noTail,
          p.replyText || null, p.ruleId || null, p.slotAt || null, !!p.numbered,
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
  noTail: ['no_tail', (v) => !!v],
  cutNote: ['cut_note', (v) => v],
  replyText: ['reply_text', (v) => String(v == null ? '' : v)],
  numbered: ['numbered', (v) => !!v],
  /* 언제 올라갈 자리인지. 스케줄러가 지난 자리를 밀 때, 사람이 시각을
     고칠 때, 자리를 취소할 때 이걸 바꾼다. */
  slotAt: ['slot_at', (v) => v],
  ruleId: ['rule_id', (v) => v],
  status: ['status', (v) => v],
  scheduledFor: ['scheduled_for', (v) => v],
  zernioId: ['zernio_id', (v) => v],
  linkSent: ['link_sent', (v) => !!v],
  accountId: ['account_id', (v) => v],
  accountName: ['account_name', (v) => v],
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
  dailyLine: '',
  ctaPerWeek: 2,
  zernioKey: '',
  zernioAccountId: '',
  zernioUsername: '',
  allowPublish: false,      // 발행은 기본 잠금
  model: '',                // 비우면 서버 기본값을 쓴다
  voiceMode: '',            // 'mine' 또는 프리셋 이름. 비우면 기본 말투
  voicePack: null,
  intro: null,              // 인사글 재료 { name, career, sample }
  daily: null,              // 오늘의 운세 틀 { sample, asReply }
  samples: [],              // 종류별 본보기 글 [{ kind, text }]
  chain: null,              // 이어붙이기 { on, max, numbered }
  facts: [],
};

/* 계정마다 달라야 하는 것들.
 *
 * ⚠️ 예전엔 설정이 사람 하나에 한 벌이었다. 계정을 바꿔도 앞 계정의
 *    말투·인사글·운세 틀이 그대로 떴다. 계정마다 성격이 다르다.
 *
 * 여기 없는 것(열쇠·올리기 허용·모델·사실)은 사람 단위로 둔다 —
 * 요금과 안전에 걸린 것이라 계정마다 갈라두면 오히려 헷갈린다. */
const PER_ACCOUNT = ['ctaLink', 'dailyLine', 'ctaPerWeek', 'voiceMode', 'voicePack',
  'intro', 'daily', 'samples', 'allowPublish'];

const ACCT_COLS = {
  ctaLink: 'cta_link',
  dailyLine: 'daily_line',
  ctaPerWeek: 'cta_per_week',
  voiceMode: 'voice_mode',
  voicePack: 'voice_pack',
  intro: 'intro',
  daily: 'daily',
  samples: 'samples',
  allowPublish: 'allow_publish',
};

/** 지금 고른 계정. 안 골랐으면 가장 먼저 등록한 것. */
async function currentAccountId(userId) {
  const { rows } = await pool.query(
    `SELECT a.id, (a.id = s.active_account) AS chosen
       FROM th_accounts a
       LEFT JOIN th_settings s ON s.user_id = a.user_id
      WHERE a.user_id = $1
      ORDER BY chosen DESC NULLS LAST, a.created_at
      LIMIT 1`,
    [userId]
  );
  return rows[0] ? rows[0].id : null;
}

/**
 * 이 계정 몫의 설정을 읽는다. 없으면 만든다.
 *
 * 처음 만들 때는 **사람 단위 설정을 그대로 옮겨 담는다.** 이미 한 계정
 * 분량을 다 채워둔 사람이 있어서, 빈 칸으로 시작하면 다 날아간 것처럼 보인다.
 */
async function acctRow(userId, accountId, base) {
  const { rows } = await pool.query(
    'SELECT * FROM th_acct_settings WHERE user_id = $1 AND account_id = $2',
    [userId, accountId]
  );
  if (rows[0]) return rows[0];

  await pool.query(
    `INSERT INTO th_acct_settings
       (user_id, account_id, cta_link, daily_line, cta_per_week, voice_mode, voice_pack,
        intro, daily, allow_publish, seeded)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,TRUE)
     ON CONFLICT (user_id, account_id) DO NOTHING`,
    [userId, accountId,
      base.ctaLink || '', base.dailyLine || '', base.ctaPerWeek,
      base.voiceMode || '',
      base.voicePack ? JSON.stringify(base.voicePack) : null,
      base.intro ? JSON.stringify(base.intro) : null,
      base.daily ? JSON.stringify(base.daily) : null,
      !!base.allowPublish]
  );
  const again = await pool.query(
    'SELECT * FROM th_acct_settings WHERE user_id = $1 AND account_id = $2',
    [userId, accountId]
  );
  return again.rows[0] || null;
}

/**
 * 설정을 읽는다.
 *
 * accountId 를 주면 그 계정 몫으로, 안 주면 지금 고른 계정 몫으로 읽는다.
 * 계정이 하나도 없으면 사람 단위 설정을 그대로 쓴다.
 */
async function getSettings(userId, accountId) {
  const base = await userSettings(userId);
  const id = accountId === undefined ? await currentAccountId(userId) : accountId;
  if (!id) return base;

  const row = await acctRow(userId, id, base);
  if (!row) return base;

  return Object.assign({}, base, {
    accountId: id,
    ctaLink: row.cta_link || '',
    dailyLine: row.daily_line || '',
    ctaPerWeek: row.cta_per_week == null ? 2 : Number(row.cta_per_week),
    voiceMode: row.voice_mode || '',
    voicePack: row.voice_pack || null,
    intro: row.intro || null,
    daily: row.daily || null,
    samples: row.samples || [],
    /* NULL 이면 아직 안 정한 것이다 — 사람 몫 값을 그대로 쓴다.
       false 로 읽어버리면 이미 켜둔 사람이 갑자기 잠긴다. */
    allowPublish: row.allow_publish == null ? base.allowPublish : !!row.allow_publish,
  });
}

async function userSettings(userId) {
  const { rows } = await pool.query('SELECT * FROM th_settings WHERE user_id = $1', [userId]);
  const r = rows[0];
  if (!r) return Object.assign({}, DEFAULT_SETTINGS);
  return {
    ctaLink: r.cta_link || '',
    dailyLine: r.daily_line || '',
    ctaPerWeek: r.cta_per_week == null ? 2 : Number(r.cta_per_week),
    zernioKey: r.zernio_key || '',
    zernioAccountId: r.zernio_account_id || '',
    zernioUsername: r.threads_username || '',
    allowPublish: !!r.allow_publish,
    model: r.ai_model || '',
    voiceMode: r.voice_mode || '',
    voicePack: r.voice_pack || null,
    intro: r.intro || null,
    daily: r.daily || null,
    chain: r.chain || null,
    samples: [],
    facts: r.facts || [],
  };
}

const SETTING_COLS = {
  ctaLink: ['cta_link', (v) => String(v || '')],
  dailyLine: ['daily_line', (v) => String(v || '')],
  /* 3번을 넘기면 광고 계정으로 몰린다. 화면에서도 막지만 여기서 한 번 더 조인다. */
  ctaPerWeek: ['cta_per_week', (v) => Math.max(0, Math.min(3, Number(v) || 0))],
  zernioKey: ['zernio_key', (v) => String(v || '')],
  zernioAccountId: ['zernio_account_id', (v) => String(v || '')],
  zernioUsername: ['threads_username', (v) => String(v || '')],
  allowPublish: ['allow_publish', (v) => !!v],
  /* 모델 이름은 그대로 담는다. 되는지 안 되는지는 「연결 확인」이 판단한다. */
  model: ['ai_model', (v) => String(v || '').trim().slice(0, 60)],
  voiceMode: ['voice_mode', (v) => String(v || '').trim().slice(0, 40)],
  voicePack: ['voice_pack', (v) => (v ? JSON.stringify(v) : null)],
  intro: ['intro', (v) => (v ? JSON.stringify(v) : null)],
  daily: ['daily', (v) => (v ? JSON.stringify(v) : null)],
  /* 다섯 칸까지. 그 이상은 프롬프트만 길어지고 나아지지 않는다. */
  samples: ['samples', (v) => JSON.stringify(
    (Array.isArray(v) ? v : []).slice(0, 5)
      .map((x) => ({ kind: String((x && x.kind) || '').slice(0, 20),
        text: String((x && x.text) || '').slice(0, 3000) }))
      .filter((x) => x.text.trim())
  )],
  chain: ['chain', (v) => (v ? JSON.stringify(v) : null)],
  facts: ['facts', (v) => JSON.stringify(v || [])],
};

async function saveSettings(userId, patch, accountId) {
  await pool.query(
    'INSERT INTO th_settings (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING',
    [userId]
  );
  const p = patch || {};
  const id = accountId === undefined ? await currentAccountId(userId) : accountId;

  /* 계정 몫과 사람 몫을 갈라 담는다. 계정이 없으면 예전처럼 다 사람 몫으로. */
  const mine = {};
  const acct = {};
  Object.keys(p).forEach((k) => {
    if (id && PER_ACCOUNT.indexOf(k) >= 0) acct[k] = p[k];
    else mine[k] = p[k];
  });

  const sets = [];
  const args = [userId];
  for (const key of Object.keys(mine)) {
    const map = SETTING_COLS[key];
    if (!map) continue;
    args.push(map[1](mine[key]));
    sets.push(map[0] + ' = $' + args.length);
  }
  if (sets.length) {
    await pool.query('UPDATE th_settings SET ' + sets.join(', ') + ' WHERE user_id = $1', args);
  }

  if (id && Object.keys(acct).length) {
    /* 줄이 없을 수 있다. 먼저 만들어두고(사람 몫을 옮겨 담아) 고친다. */
    await acctRow(userId, id, await userSettings(userId));
    const aSets = [];
    const aArgs = [userId, id];
    for (const key of Object.keys(acct)) {
      const col = ACCT_COLS[key];
      if (!col) continue;
      const map = SETTING_COLS[key];
      aArgs.push(map[1](acct[key]));
      aSets.push(col + ' = $' + aArgs.length);
    }
    if (aSets.length) {
      await pool.query(
        'UPDATE th_acct_settings SET ' + aSets.join(', ') +
        ' WHERE user_id = $1 AND account_id = $2', aArgs);
    }
  }
  return getSettings(userId, id === null ? undefined : id);
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

/**
 * 이 계정에 **이 시각쯤 이미 예약된 다른 글**이 있나.
 *
 * ⚠️ 같은 시각에 두 글이 나란히 올라간 일이 있다. 규칙을 두 개 두면
 *    각자 자기 자리를 채우는데, 그 자리가 같은 시각이면 둘 다 나간다.
 *    자리 주인(rule_id)이 달라서 유니크 색인에도 안 걸린다.
 *    **읽는 사람 눈에는 그냥 도배다.** 나가기 전에 여기서 막는다.
 *
 * 어긋내기(jitter) 때문에 분 단위로 조금씩 밀리므로 앞뒤 몇 분을 같이 본다.
 */
const SAME_SLOT_MIN = 3;

async function scheduledNear(userId, accountId, when, exceptId) {
  const at = new Date(when);
  if (isNaN(at.getTime())) return null;
  const { rows } = await pool.query(
    `SELECT id, topic, scheduled_for, account_name
       FROM th_posts
      WHERE user_id = $1
        AND status = 'scheduled'
        AND account_id IS NOT DISTINCT FROM $2
        AND id <> COALESCE($3, '')
        AND scheduled_for BETWEEN $4 AND $5
      ORDER BY scheduled_for
      LIMIT 1`,
    [userId, accountId == null ? null : accountId, exceptId || null,
      new Date(at.getTime() - SAME_SLOT_MIN * 60000).toISOString(),
      new Date(at.getTime() + SAME_SLOT_MIN * 60000).toISOString()]
  );
  if (!rows.length) return null;
  return {
    id: rows[0].id,
    topic: rows[0].topic || '',
    at: rows[0].scheduled_for,
    accountName: rows[0].account_name || '',
  };
}

module.exports = {
  scheduledNear, SAME_SLOT_MIN,
  newId, DAILY_LIMIT,
  getPosts, getPost, insertPosts, updatePost,
  deletePosts, restoreLatest, trashCount,
  saveBatch,
  getLedger, markHooksUsed,
  getSettings, saveSettings, currentAccountId,
  countToday, markRun,
};
