/* ============================================================
 * services/manseLink.js — 만세력에서 넘어온 신청자 받기
 *
 * 만세력(사주 한 장)은 손님을 모으는 미끼다.
 * 손님이 거기서 무료로 사주를 보고 번호를 남기면,
 * 만세력이 우리 주소로 그 건을 넘겨준다.
 *
 * 넘어오는 것 (루월당_연동_기획서 3장)
 *   { type, id, createdAt, name, phone, memo,
 *     recruiter, recruiterName, from, marketingOptIn, program }
 *
 * 지켜야 할 것 세 가지 —
 *  1) 같은 id 가 다시 와도 두 번 들어가면 안 된다.
 *  2) recruiter(수강생 아이디) 를 우리 교육생에 붙여야 한다. 그래야 수당이 맞는다.
 *  3) 우리가 실패해도 만세력 쪽 접수는 이미 끝났다. 즉 놓치면 그 손님은 사라진다.
 *     그래서 붙일 교육생을 못 찾아도 버리지 않고 관리자 앞으로 남긴다.
 * ============================================================ */

const crypto = require('crypto');
const { pool } = require('../db');

/* ── 열쇠 ─────────────────────────────────────────── */

function newKey() {
  return 'mk_' + crypto.randomBytes(24).toString('hex');
}

/** 지금 쓰는 열쇠. 없으면 만들어 둔다. */
async function getKey() {
  const { rows } = await pool.query('SELECT * FROM manse_link WHERE id = 1');
  if (rows[0]) return rows[0];
  await pool.query(
    'INSERT INTO manse_link (id, hook_key) VALUES (1, $1) ON CONFLICT (id) DO NOTHING',
    [newKey()]
  );
  const again = await pool.query('SELECT * FROM manse_link WHERE id = 1');
  return again.rows[0];
}

/** 열쇠를 새로 만든다. 전에 쓰던 것은 그 즉시 막힌다. */
async function resetKey() {
  const k = newKey();
  await pool.query(
    `INSERT INTO manse_link (id, hook_key) VALUES (1, $1)
       ON CONFLICT (id) DO UPDATE SET hook_key = $1, created_at = NOW()`,
    [k]
  );
  return k;
}

/**
 * 열쇠가 맞는지.
 * 길이가 다르면 timingSafeEqual 이 던지므로 먼저 걸러낸다.
 * 글자 수로 답이 갈리지 않게 같은 길이일 때만 비교한다.
 */
async function keyOk(given) {
  const g = String(given || '');
  if (!g) return false;
  const row = await getKey();
  const want = String(row.hook_key || '');
  if (g.length !== want.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(g), Buffer.from(want));
  } catch (e) {
    return false;
  }
}

/* ── 들어온 값 다듬기 ─────────────────────────────── */

const cut = (v, n) => String(v == null ? '' : v).trim().slice(0, n);

/** 010-1234-5678 꼴로 맞춘다. 만세력도 이렇게 보내주지만 믿지 않는다. */
function tidyPhone(v) {
  const d = String(v == null ? '' : v).replace(/[^0-9]/g, '');
  if (d.length === 11 && d.startsWith('010')) return d.slice(0, 3) + '-' + d.slice(3, 7) + '-' + d.slice(7);
  if (d.length === 10) return d.slice(0, 3) + '-' + d.slice(3, 6) + '-' + d.slice(6);
  return cut(v, 40);
}

/**
 * 이 건을 누구 앞으로 둘지 정한다.
 *
 * 만세력의 수강생 아이디는 우리 slug 와 같게 쓰기로 했다.
 * 그래도 대소문자가 섞이거나 공백이 붙어 오는 일이 있어 느슨하게 맞춰본다.
 * 못 찾으면 관리자에게 보낸다 — 아무에게도 안 보이는 것이 제일 나쁘다.
 */
async function findTeacher(recruiter) {
  const r = cut(recruiter, 60).toLowerCase();
  if (r) {
    const { rows } = await pool.query(
      `SELECT id, name, slug FROM users
        WHERE LOWER(slug) = $1 AND status = 'approved'
        LIMIT 1`,
      [r]
    );
    if (rows[0]) return { teacher: rows[0], matched: true };
  }
  /* 못 찾았다. 관리자 앞으로 둔다. */
  const { rows } = await pool.query(
    `SELECT id, name, slug FROM users
      WHERE role = 'admin' AND status = 'approved'
      ORDER BY id LIMIT 1`
  );
  return { teacher: rows[0] || null, matched: false };
}

/**
 * 넘어온 건을 신청자로 넣는다.
 * 반환 { ok, leadId, dup, matched, teacher }
 *   dup 이면 이미 들어와 있던 것이다 (성공으로 본다).
 */
async function take(body) {
  const b = body || {};
  const manseId = cut(b.id, 80);
  const name = cut(b.name, 60);
  const phone = tidyPhone(b.phone);

  if (!manseId) return { ok: false, why: 'id 가 없습니다.' };
  if (!name && !phone) return { ok: false, why: '이름과 번호가 모두 비어 있습니다.' };

  /* 이미 들어온 건인지 먼저 본다 */
  const seen = await pool.query('SELECT id, teacher_id FROM leads WHERE manse_id = $1', [manseId]);
  if (seen.rows[0]) {
    return { ok: true, dup: true, leadId: seen.rows[0].id };
  }

  const found = await findTeacher(b.recruiter);
  if (!found.teacher) return { ok: false, why: '받을 계정이 없습니다.' };

  /* 어디서 왔는지 사람이 읽을 수 있게 적어둔다 */
  const bits = [];
  if (cut(b.memo, 500)) bits.push(cut(b.memo, 500));
  const who = cut(b.recruiterName, 60) || cut(b.recruiter, 60);
  if (who) bits.push('만세력 · ' + who + '님 링크로 들어옴');
  else bits.push('만세력 · 기본 페이지에서 들어옴');
  if (!found.matched && cut(b.recruiter, 60)) {
    bits.push('※ 「' + cut(b.recruiter, 60) + '」 와 맞는 교육생을 못 찾아 관리자 앞으로 두었습니다.');
  }
  if (b.marketingOptIn) bits.push('마케팅 수신 동의함');

  let row;
  try {
    row = await pool.query(
      `INSERT INTO leads (teacher_id, name, phone, memo, status, source, manse_id, recruiter)
       VALUES ($1,$2,$3,$4,'접수완료','만세력',$5,$6)
       RETURNING id`,
      [found.teacher.id, name || '이름 없음', phone, bits.join('\n'),
       manseId, cut(b.recruiter, 60) || null]
    );
  } catch (e) {
    /* 같은 순간에 두 번 들어오면 유일 색인에 걸린다. 그건 실패가 아니다. */
    if (e && e.code === '23505') {
      const again = await pool.query('SELECT id FROM leads WHERE manse_id = $1', [manseId]);
      return { ok: true, dup: true, leadId: again.rows[0] && again.rows[0].id };
    }
    throw e;
  }

  await pool.query(
    `INSERT INTO manse_link (id, hook_key, total, last_at)
     VALUES (1, $1, 1, NOW())
       ON CONFLICT (id) DO UPDATE SET total = manse_link.total + 1, last_at = NOW()`,
    [(await getKey()).hook_key]
  );

  return {
    ok: true, dup: false, leadId: row.rows[0].id,
    matched: found.matched, teacher: found.teacher,
  };
}

/**
 * 만세력의 수강생.json 에 그대로 붙여넣을 목록을 만든다.
 *
 * 아이디를 양쪽에서 손으로 맞추면 한 글자만 달라도 수당이 엉킨다.
 * 우리 slug 가 곧 그쪽 아이디가 되게 여기서 뽑아준다.
 */
async function studentJson() {
  const { rows } = await pool.query(
    `SELECT name, slug, site_name FROM users
      WHERE status = 'approved' AND slug IS NOT NULL AND slug <> ''
      ORDER BY name`
  );
  return {
    _안내: '루월당에서 뽑았습니다. 이 내용을 만세력 폴더의 수강생.json 에 그대로 넣으세요.',
    수강생: rows.map((r) => ({
      아이디: r.slug,
      이름: r.site_name || r.name || r.slug,
    })),
  };
}

module.exports = { getKey, resetKey, keyOk, take, studentJson, tidyPhone, findTeacher };
