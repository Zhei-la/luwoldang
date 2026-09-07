/* ============================================================
 * scripts/threads-gonecheck.js — 없어진 예약과 겹친 자리
 *
 * 두 가지를 본다.
 *   ① Zernio 에 그 예약이 없어졌을 때 화면이 「안 올라갑니다」로 바뀌는가
 *      — 예전엔 「예약해뒀습니다」인 채로 시간이 지나도 아무 일이 없었다.
 *   ② 규칙 둘이 같은 계정 같은 시각을 잡았을 때 하나만 걸리는가
 *      — 예전엔 그 자리마다 글이 두 개씩 나갔다.
 *
 * 진짜 데이터베이스. Zernio 와 모델만 가짜. 글은 한 줄도 안 올라간다.
 *
 * 쓰는 법
 *   DATABASE_URL=postgres://... node scripts/threads-gonecheck.js
 *
 * ⚠️ 사용자 번호 9987 을 지웠다 만든다. 시험용 DB 에만 쓸 것.
 * ============================================================ */
const path = require('path');
process.env.DATABASE_URL = process.env.DATABASE_URL
  || 'postgres://postgres@127.0.0.1:5433/luwoldang';
const ROOT = path.join(__dirname, '..');
const NL = String.fromCharCode(10);
const UID = 9987;

const Module = require('module');
const orig = Module.prototype.require;

let missing = {};      // 이 zernio id 는 「없다」고 답한다
let zsent = [];
let turn = 0;

function notFound() {
  const e = new Error('Zernio 오류 404: Post not found');
  e.code = 'ZERNIO_404';
  return e;
}

Module.prototype.require = function (id) {
  if (id === './zernio') {
    return {
      send: async (o) => { zsent.push(o); return { id: 'z' + (zsent.length) }; },
      remove: async () => ({}),
      getStatus: async (key, pid) => {
        if (missing[pid]) throw notFound();
        return { status: 'scheduled', permalink: null };
      },
      listAccounts: async () => [], check: async () => ({ ok: true }),
    };
  }
  if (id === './llm') {
    /* ⚠️ 두 규칙이 **같은 글**을 내면 「같은 글 검사」에 먼저 걸려서,
          정작 보려던 「같은 시각 검사」가 안 돌아간다.
          실제로도 규칙이 다르면 글이 다르다. 다르게 낸다. */
    return { runAi: async () => {
      turn++;
      const body = turn === 1
        ? ['경금 일간은 거절을 못 합니다', '', '그래서 일이 몰립니다', '',
           '한 박자 늦춰보세요'].join(NL)
        : ['임수 일간은 미리 재봅니다', '', '그래서 늦게 움직입니다', '',
           '한 번은 그냥 저질러보세요'].join(NL);
      return { text: JSON.stringify({ topic: 't', situation: '',
        posts: [{ hooks: [1], postType: '정보형', parts: [body], reply: '' }] }), usage: {} };
    }, MODELS: [], DEFAULT_MODEL: 'x' };
  }
  return orig.apply(this, arguments);
};

const { pool, initDb } = require(ROOT + '/db');
const store = require(ROOT + '/services/threads/store');
const rulesLib = require(ROOT + '/services/threads/rules');
const autopost = require(ROOT + '/services/threads/autopost');
const scheduler = require(ROOT + '/services/threads/scheduler');

let pass = 0, fail = 0;
function t(name, got, want) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (ok) pass++; else fail++;
  console.log((ok ? '  OK   ' : '  FAIL ') + name +
    (ok ? '' : NL + '       받음: ' + JSON.stringify(got) + NL + '       기대: ' + JSON.stringify(want)));
}
function section(s) { console.log(NL + '-- ' + s + ' --'); }

async function clean() {
  for (const tbl of ['th_skips', 'th_posts', 'th_trash', 'th_rules',
    'th_acct_settings', 'th_settings', 'th_accounts']) {
    try { await pool.query('DELETE FROM ' + tbl + ' WHERE user_id=$1', [UID]); } catch (e) {}
  }
}

(async () => {
  await initDb();
  await pool.query("INSERT INTO users (id, kakao_id) VALUES ($1,'gone') ON CONFLICT (id) DO NOTHING", [UID]);
  await clean();

  const q = await pool.query(
    'INSERT INTO th_accounts (user_id, zernio_key, account_id, username)' +
    ' VALUES ($1,$2,$3,$4) RETURNING id', [UID, 'KEY_A', 'acct_a', '루사주']);
  const aid = q.rows[0].id;
  await store.saveSettings(UID, { allowPublish: true, ctaLink: '' }, aid);

  /* ══ ① Zernio 에서 사라진 예약 ══ */
  section('1. Zernio 에서 사라진 예약');

  /* 앞으로 올라갈 예약 하나를 손으로 만든다 */
  const soon = new Date(Date.now() + 6 * 3600 * 1000);
  await pool.query(
    "INSERT INTO th_posts (id,user_id,topic,status,account_id,scheduled_for,zernio_id,parts)" +
    " VALUES ($1,$2,'재물운','scheduled',$3,$4,$5,$6)",
    ['gone1', UID, aid, soon.toISOString(), 'zLIVE', JSON.stringify(['글'])]);
  await pool.query(
    "INSERT INTO th_posts (id,user_id,topic,status,account_id,scheduled_for,zernio_id,parts)" +
    " VALUES ($1,$2,'연애운','scheduled',$3,$4,$5,$6)",
    ['gone2', UID, aid, new Date(soon.getTime() + 7200000).toISOString(), 'zDEAD',
      JSON.stringify(['글'])]);

  missing = { zDEAD: true };

  t('아직 시각이 안 된 것도 훑는다', (await scheduler.aheadRowsFor(UID, 10)).length, 2);
  const changed = await scheduler.checkUser(UID);
  t('사라진 것을 하나 찾아낸다', changed, 1);

  const live = await store.getPost(UID, 'gone1');
  const dead = await store.getPost(UID, 'gone2');
  t('살아 있는 예약은 그대로', live.status, 'scheduled');
  t('살아 있는 예약의 번호도 그대로', live.zernioId, 'zLIVE');
  t('사라진 예약은 안 올라간다고 바뀐다', dead.status, 'failed');
  t('그 번호는 지운다', dead.zernioId, undefined);
  t('무슨 일인지 적어준다',
    String(dead.error || '').indexOf('Zernio 에 이 예약이 없습니다') === 0, true);
  t('어떻게 하라고 알려준다',
    String(dead.error || '').indexOf('다시 걸어주세요') > 0, true);

  /* ⚠️ Zernio 가 잠깐 느린 것을 「없어졌다」로 보면 멀쩡한 예약을 푼다 */
  missing = {};
  await pool.query("UPDATE th_posts SET status='scheduled', zernio_id='zDEAD' WHERE id='gone2'");
  const zern = require(ROOT + '/services/threads/zernio');
  const realGet = zern.getStatus;
  zern.getStatus = async () => { const e = new Error('연결 실패'); e.code = 'NETWORK'; throw e; };
  await scheduler.checkUser(UID);
  zern.getStatus = realGet;
  t('못 물어본 것뿐이면 안 건드린다',
    (await store.getPost(UID, 'gone2')).status, 'scheduled');

  /* ══ ② 규칙 둘이 같은 계정 같은 시각 ══ */
  section('2. 규칙 둘이 같은 자리를 잡으면');

  await pool.query('DELETE FROM th_posts WHERE user_id=$1', [UID]);
  const day = new Date(Date.now() + 30 * 3600 * 1000).getDay();
  const r1 = await rulesLib.save(UID, null, { name: '첫째', enabled: true, mode: 'publish',
    forms: ['info'], jitterMin: 0, accountId: aid, slots: [{ day, time: '05:03' }] });
  const r2 = await rulesLib.save(UID, null, { name: '둘째', enabled: true, mode: 'publish',
    forms: ['info'], jitterMin: 0, accountId: aid, slots: [{ day, time: '05:03' }] });

  /* 화면이 먼저 경고하는가 */
  const warn = rulesLib.clashWarning(r1, [r1, r2]);
  t('규칙 화면이 미리 경고한다', warn.indexOf('두 개씩 올라갑니다') > 0, true);
  t('어느 자리인지 짚어준다', warn.indexOf('05:03') > 0, true);

  zsent = [];
  const o1 = await autopost.runRule(Object.assign({}, r1, { userId: UID, openaiKey: 'k' }));
  const o2 = await autopost.runRule(Object.assign({}, r2, { userId: UID, openaiKey: 'k' }));

  const sched = (await store.getPosts(UID)).filter((p) => p.status === 'scheduled');
  const times = sched.map((p) => new Date(p.scheduledFor).toISOString());
  t('첫째 규칙은 걸린다', o1.made.length > 0, true);
  t('둘째 규칙은 그 자리를 못 건다', zsent.length, 1);
  t('같은 시각에 예약이 하나뿐', times.length, new Set(times).size);
  t('예약된 것은 하나', sched.length, 1);
  /* 둘째 글은 원고로 남는다 — 버리지는 않는다 */
  const drafts = (await store.getPosts(UID)).filter((p) => p.status === 'draft');
  t('못 건 글은 원고로 남는다', drafts.length > 0, true);
  t('왜 못 걸었는지 알려준다',
    o2.errors.some((e) => e.indexOf('이 시각에 이미 예약된 글이 있습니다') > 0), true);

  await clean();
  await pool.query('DELETE FROM users WHERE id=$1', [UID]);

  console.log(NL + '============================');
  console.log((fail ? 'FAIL ' : 'OK   ') + '통과 ' + pass + ' · 실패 ' + fail);
  console.log('올린 글: 0개 — Zernio 는 가짜입니다');
  process.exit(fail ? 1 : 0);
})().catch(function (e) { console.error('터짐:', e.stack); process.exit(1); });
