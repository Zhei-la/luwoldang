/* ============================================================
 * scripts/threads-verify.js — 끝에서 끝까지 전체 검증
 *
 * threads-selftest 는 함수 하나하나를 본다. 이건 **진짜 데이터베이스에
 * 계정 둘을 만들어 놓고 실제 흐름을 태운다.** 모델과 Zernio 만 가짜다.
 *
 * ⚠️ 글은 한 줄도 안 올라간다. Zernio 는 부른 내용을 적어두기만 한다.
 *
 * 보는 것
 *   ① 오류 없이 도는가 — 여섯 틀이 다 만들어지는가
 *   ② 같은 자리에 두 개가 안 생기는가
 *   ③ 계정마다 제 설정으로, 제 계정에만 올라가는가
 *   ④ 글이 지침을 지키는가
 *   ⑤ 그 밖에 — 3일치·지운 자리·영어·번호·띠·첫 댓글·겹침 경고
 *
 * 쓰는 법
 *   DATABASE_URL=postgres://... node scripts/threads-verify.js
 *
 * ⚠️ **시험용 데이터베이스에만 쓰세요.** 사용자 번호 9990 의 글·규칙·계정을
 *    지웠다 만듭니다. 운영 DB 를 가리키면 그 사용자 것이 날아갑니다.
 * ============================================================ */
const path = require('path');
process.env.DATABASE_URL = process.env.DATABASE_URL
  || 'postgres://postgres@127.0.0.1:5433/luwoldang';
const ROOT = path.join(__dirname, '..');
const NL = String.fromCharCode(10);
const UID = 9990;

const Module = require('module');
const orig = Module.prototype.require;

let asked = [];       // 모델에 간 프롬프트
let zsent = [];       // Zernio 에 간 것
let zremoved = [];    // Zernio 에서 지운 것
let reply = null;     // 모델이 돌려줄 것 (함수면 프롬프트를 보고 정한다)

Module.prototype.require = function (id) {
  if (id === './llm') {
    return {
      runAi: async (k, p) => {
        asked.push(p);
        const r = typeof reply === 'function' ? reply(p) : reply;
        return { text: JSON.stringify(r), usage: {} };
      },
      MODELS: [], DEFAULT_MODEL: 'x',
    };
  }
  if (id === './zernio') {
    return {
      send: async (o) => {
        zsent.push({ apiKey: o.apiKey, accountId: o.accountId,
          parts: o.parts, when: o.scheduledFor });
        return { id: 'z' + zsent.length };
      },
      remove: async (key, pid) => { zremoved.push({ key, id: pid }); return {}; },
      getStatus: async () => ({ status: 'scheduled' }),
      listAccounts: async () => [], check: async () => ({ ok: true }),
    };
  }
  return orig.apply(this, arguments);
};

const { pool, initDb } = require(ROOT + '/db');
const store = require(ROOT + '/services/threads/store');
const rulesLib = require(ROOT + '/services/threads/rules');
const autopost = require(ROOT + '/services/threads/autopost');
const pipeline = require(ROOT + '/services/threads/pipeline');
const forms = require(ROOT + '/services/threads/forms');
const jiji = require(ROOT + '/services/threads/jiji');
const today = require(ROOT + '/services/threads/today');
const dupe = require(ROOT + '/services/threads/dupe');
const { checkPost } = require(ROOT + '/services/threads/guideline');

let pass = 0, fail = 0;
const fails = [];
function t(name, got, want) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (ok) pass++; else { fail++; fails.push(name); }
  console.log((ok ? '  OK   ' : '  FAIL ') + name +
    (ok ? '' : NL + '       받음: ' + JSON.stringify(got) + NL + '       기대: ' + JSON.stringify(want)));
}
function section(s) { console.log(NL + '-- ' + s + ' --'); }

/* ── 두 계정의 서로 다른 세팅 ── */
const A_TPL = ['안녕하세요 사주상담가 운결담 입니다', '',
  '오늘은 무료로 열어봅니다', '복채는 댓글 한 번이면 충분해요', '',
  '댓글에 생년월일시 남겨주세요'].join(NL);
const B_TPL = ['안녕 루사주야', '', '오늘 무료로 봐줌', '', '생년월일시 댓글에 남겨봐'].join(NL);

const A_DAILY = ['오늘 잘 갈리는 날', '', '9월 1일 오늘의 운세', '',
  '운 좋은 띠', '용띠'].join(NL);
const B_DAILY = ['오늘의 흐름임', '', '운 좋은 띠', '용띠'].join(NL);

const okPost = (body, rep) => ({ topic: 't', situation: '',
  posts: [{ hooks: [1], postType: '정보형', parts: [body], reply: rep || '' }] });
const BODY = ['경금 일간은 거절을 못 합니다', '', '그래서 일이 몰립니다', '',
  '한 박자 늦춰보세요'].join(NL);

async function clean() {
  const tables = ['th_skips', 'th_posts', 'th_trash', 'th_rules',
    'th_acct_settings', 'th_settings', 'th_accounts', 'th_runs', 'th_hooks', 'th_batches'];
  for (const tbl of tables) {
    try { await pool.query('DELETE FROM ' + tbl + ' WHERE user_id=$1', [UID]); } catch (e) {}
  }
}

(async () => {
  await initDb();
  await pool.query("INSERT INTO users (id, kakao_id) VALUES ($1,'verify') ON CONFLICT (id) DO NOTHING", [UID]);
  await clean();

  /* 계정 둘 — 열쇠도 다르다 */
  const acc = {};
  const rows = [['루사주', 'KEY_A', 'acct_a'], ['ai이안', 'KEY_B', 'acct_b']];
  for (const r of rows) {
    const q = await pool.query(
      'INSERT INTO th_accounts (user_id, zernio_key, account_id, username)' +
      ' VALUES ($1,$2,$3,$4) RETURNING id', [UID, r[1], r[2], r[0]]);
    acc[r[0]] = q.rows[0].id;
  }

  await store.saveSettings(UID, {
    intro: { name: '운결담', career: '10년차', sample: A_TPL },
    daily: { body: A_DAILY, tail: '', mode: 'single' },
    allowPublish: true, ctaLink: '',
  }, acc['루사주']);
  await store.saveSettings(UID, {
    intro: { name: '루사주', career: '5년차', sample: B_TPL },
    daily: { body: B_DAILY, tail: '', mode: 'single' },
    allowPublish: true, ctaLink: '',
  }, acc['ai이안']);

  /* ══════════ ③ 계정별로 갈리는가 ══════════ */
  section('3. 계정마다 제 설정으로');

  const sA = await store.getSettings(UID, acc['루사주']);
  const sB = await store.getSettings(UID, acc['ai이안']);
  t('A 는 A 인사글 틀', sA.intro.sample, A_TPL);
  t('B 는 B 인사글 틀', sB.intro.sample, B_TPL);
  t('A 는 A 운세 틀', sA.daily.body, A_DAILY);
  t('B 는 B 운세 틀', sB.daily.body, B_DAILY);
  t('두 설정이 다르다', sA.intro.sample === sB.intro.sample, false);

  await store.saveSettings(UID, { allowPublish: false }, acc['ai이안']);
  t('A 는 켜진 채', (await store.getSettings(UID, acc['루사주'])).allowPublish, true);
  t('B 만 꺼진다', (await store.getSettings(UID, acc['ai이안'])).allowPublish, false);
  await store.saveSettings(UID, { allowPublish: true }, acc['ai이안']);

  asked = []; reply = okPost(A_TPL);
  await pipeline.generate(UID, 'k', '무료사주 인사', 1,
    { form: forms.byId('intro'), accountId: acc['루사주'] });
  const pA = asked[0];
  asked = []; reply = okPost(B_TPL);
  await pipeline.generate(UID, 'k', '무료사주 인사', 1,
    { form: forms.byId('intro'), accountId: acc['ai이안'] });
  const pB = asked[0];
  t('A 프롬프트에 A 틀', pA.indexOf('복채는 댓글 한 번이면 충분해요') > 0, true);
  t('A 프롬프트에 B 틀 없음', pA.indexOf('안녕 루사주야') > 0, false);
  t('B 프롬프트에 B 틀', pB.indexOf('안녕 루사주야') > 0, true);
  t('B 프롬프트에 A 틀 없음', pB.indexOf('복채는 댓글 한 번이면 충분해요') > 0, false);

  /* ══════════ ③-2 제 계정에만 ══════════ */
  section('3-2. 제 계정에만 올라간다');

  const d1 = new Date(Date.now() + 26 * 3600 * 1000);
  const d2 = new Date(Date.now() + 27 * 3600 * 1000);
  const ruleA = await rulesLib.save(UID, null, { name: 'A규칙', enabled: true,
    mode: 'publish', forms: ['info'], jitterMin: 0, accountId: acc['루사주'],
    slots: [{ day: d1.getDay(), time: '09:00' }] });
  const ruleB = await rulesLib.save(UID, null, { name: 'B규칙', enabled: true,
    mode: 'publish', forms: ['info'], jitterMin: 0, accountId: acc['ai이안'],
    slots: [{ day: d2.getDay(), time: '21:00' }] });

  zsent = [];
  /* 어느 계정 몫인지 알아보려고 마지막 줄에 표시만 붙인다.
     ⚠️ 덩어리를 새로 만들면 빈 줄이 셋이 되어 지침에 걸린다. */
  reply = function (p) {
    return okPost(BODY + ' (' + (p.indexOf('안녕 루사주야') > 0 ? '루사주' : '운결담') + ' 몫)');
  };
  const outA = await autopost.runRule(Object.assign({}, ruleA, { userId: UID, openaiKey: 'k' }));
  const outB = await autopost.runRule(Object.assign({}, ruleB, { userId: UID, openaiKey: 'k' }));
  if (outA.errors.length || outB.errors.length) {
    console.log('       규칙 오류: ' + JSON.stringify(outA.errors.concat(outB.errors)));
  }

  const toA = zsent.filter((z) => z.apiKey === 'KEY_A');
  const toB = zsent.filter((z) => z.apiKey === 'KEY_B');
  t('둘 다 나갔다', zsent.length > 0, true);
  t('A 규칙은 A 열쇠로만', toA.every((z) => z.accountId === 'acct_a'), true);
  t('B 규칙은 B 열쇠로만', toB.every((z) => z.accountId === 'acct_b'), true);
  t('A 것이 B 로 안 샌다', toB.some((z) => z.apiKey === 'KEY_A'), false);
  t('열쇠와 계정이 짝이 맞다', zsent.every((z) =>
    (z.apiKey === 'KEY_A') === (z.accountId === 'acct_a')), true);

  const saved = await store.getPosts(UID);
  const byRule = (rid) => saved.filter((p) => p.ruleId === rid);
  t('A 글에 A 계정이 새겨진다',
    byRule(ruleA.id).every((p) => p.accountId === acc['루사주']), true);
  t('B 글에 B 계정이 새겨진다',
    byRule(ruleB.id).every((p) => p.accountId === acc['ai이안']), true);
  t('예약 수와 나간 수가 같다',
    zsent.length, saved.filter((p) => p.status === 'scheduled').length);

  /* ══════════ ② 중복 ══════════ */
  section('2. 같은 자리에 두 개가 안 생긴다');

  const before = (await store.getPosts(UID)).length;
  zsent = [];
  await autopost.runRule(Object.assign({}, ruleA, { userId: UID, openaiKey: 'k' }));
  t('같은 자리를 또 안 만든다', (await store.getPosts(UID)).length, before);
  t('예약도 또 안 건다', zsent.length, 0);

  const ruleC = await rulesLib.save(UID, null, { name: 'C규칙', enabled: true,
    mode: 'draft', forms: ['info'], jitterMin: 0, accountId: acc['루사주'],
    slots: [{ day: new Date(Date.now() + 50 * 3600 * 1000).getDay(), time: '11:00' }] });
  reply = okPost(BODY);
  const both = await Promise.all([
    autopost.runRule(Object.assign({}, ruleC, { userId: UID, openaiKey: 'k' })),
    autopost.runRule(Object.assign({}, ruleC, { userId: UID, openaiKey: 'k' })),
  ]);
  t('동시에 돌려도 한쪽만 돈다',
    both.filter((x) => x.skipped).length, 1);
  const slotsC = (await store.getPosts(UID)).filter((p) => p.ruleId === ruleC.id)
    .map((p) => p.slotAt);
  t('같은 시각이 두 번 없다', slotsC.length, new Set(slotsC).size);

  const anyScheduled = (await store.getPosts(UID)).find((p) => p.status === 'scheduled');
  t('예약된 글이 있다', !!anyScheduled, true);
  const otherAcct = !anyScheduled || anyScheduled.accountId === acc['루사주']
    ? acc['ai이안'] : acc['루사주'];
  if (anyScheduled) {
  t('그 시각쯤 예약을 찾아낸다',
    !!(await store.scheduledNear(UID, anyScheduled.accountId,
      new Date(new Date(anyScheduled.scheduledFor).getTime() + 60000), 'other')), true);
  t('멀면 안 찾는다',
    !!(await store.scheduledNear(UID, anyScheduled.accountId,
      new Date(new Date(anyScheduled.scheduledFor).getTime() + 30 * 60000), 'other')), false);
  t('다른 계정에는 안 걸린다',
    !!(await store.scheduledNear(UID, otherAcct,
      new Date(anyScheduled.scheduledFor), 'other')), false);

  }

  t('같은 글이 다른 계정으로 가면 잡는다',
    !!(await dupe.findTwin(UID, { parts: [BODY], replyText: '', accountId: acc['ai이안'] })), true);

  /* ══════════ ① 여섯 틀 ══════════ */
  section('1. 여섯 가지 틀이 다 돈다');
  for (const f of forms.FORMS) {
    reply = okPost(f.id === 'intro' ? A_TPL : (f.id === 'daily' ? A_DAILY : BODY));
    let out = null, err = null;
    try {
      out = await pipeline.generate(UID, 'k', f.id === 'daily' ? '오늘의 운세' : '재물운', 1,
        { form: f, at: new Date(Date.now() + 86400000), accountId: acc['루사주'] });
    } catch (e) { err = e.message; }
    t(f.label + ' — 글이 나온다', !!(out && out.posts && out.posts.length), true);
    if (err) console.log('       터짐: ' + err);
  }

  /* ══════════ ④ 글이 지침을 지키는가 ══════════ */
  section('4. 글이 지침을 지키는가');
  const shapes = {
    '정보형': ['정보형', BODY],
    '리스트형': ['정보형', ['말이 늦게 나오는 사람들이 있음', '',
      '1. 생각을 다 끝내고 말함', '2. 틀릴까 봐 한 번 더 봄', '',
      '인성이 두꺼우면 이렇게 나옴', '', '먼저 반만 말해봐'].join(NL)],
    '경고형': ['경고형', ['올해 역마가 강함', '', '자리를 옮기고 싶어짐', '',
      '지금 옮기면 두 번 옮김', '가을까지만 버텨봐'].join(NL)],
  };
  Object.keys(shapes).forEach((k) => {
    const ty = shapes[k][0];
    const body = shapes[k][1];
    const c = checkPost({ postType: ty, form: 'single', topic: '재물운', parts: [body] });
    t(k + ' 자동으로 나갈 수 있다', c.passHard, true);
    if (!c.passHard) console.log('       걸림: ' + c.advice.join(' / '));
  });
  t('인사글 나갈 수 있다',
    checkPost({ postType: '정보형', form: 'single', topic: '무료사주 인사', parts: [A_TPL] }).passHard, true);
  t('운세 나갈 수 있다',
    checkPost({ postType: '정보형', form: 'single', topic: '오늘의 운세', parts: [A_DAILY] }).passHard, true);
  t('알맹이 없는 글은 그대로 막힌다',
    checkPost({ postType: '정보형', form: 'single', topic: '재물운',
      parts: ['사주 보는 게 처음이신가요' + NL + NL + '한번 봐보세요'] }).passHard, false);

  const engRow = (x) => checkPost({ postType: '정보형', form: 'single', topic: '재물운',
    parts: [x] }).rows.find((r) => r.label === '영어 없이 한글로');
  t('영어는 막는다', engRow('Threads 에서 신청받음').ok, false);
  t('vs 는 봐준다', engRow('인성 vs 식상').ok, true);
  t('MBTI 는 봐준다', engRow('MBTI 별 연락 스타일임').ok, true);

  /* ══════════ ⑤ 그 밖에 ══════════ */
  section('5. 그 밖에 봐야 할 것');

  t('번호를 켜둔 글이 없다', (await store.getPosts(UID)).some((p) => p.numbered), false);
  t('나간 글에 1/2 가 없다',
    zsent.some((z) => z.parts.join(NL).indexOf('1/2') >= 0), false);

  t('앞으로 3일치를 본다', rulesLib.LOOKAHEAD_DAYS, 3);
  t('자리 계획이 다 나온다',
    rulesLib.plan(ruleA, 3).every((x) => x.sendAt instanceof Date), true);

  const victim = (await store.getPosts(UID)).find((p) => p.ruleId === ruleA.id);
  await store.skipSlot(UID, victim.ruleId, victim.slotAt, victim.topic);
  await store.deletePosts(UID, [victim.id]);
  reply = okPost(BODY); zsent = [];
  await autopost.runRule(Object.assign({}, ruleA, { userId: UID, openaiKey: 'k' }));
  t('지운 자리를 다시 안 채운다',
    (await store.getPosts(UID)).some((p) => p.slotAt === victim.slotAt), false);
  t('지운 자리에 예약도 안 건다', zsent.length, 0);

  let ttiOk = 0;
  for (let i = 0; i < 7; i++) {
    const d = today.forDate(new Date(Date.now() + i * 86400000));
    const p = d && d.dayBranch ? jiji.pick(d.dayBranch) : null;
    if (d && p && p.good.length && p.care.length) ttiOk++;
  }
  t('이레치 일진·띠가 다 나온다', ttiOk, 7);
  const gm = jiji.pick('미');
  t('계미일 좋은 띠', gm.good.map((x) => x.tti), ['말띠', '돼지띠', '토끼띠']);
  t('계미일 조심 띠', gm.care.map((x) => x.tti), ['소띠', '개띠', '쥐띠']);
  t('엉뚱한 띠를 잡아낸다', jiji.checkText('미', '용띠 원숭이띠').ok, false);

  reply = okPost(['말이 늦게 나오는 사람들이 있음', '', '경금 일간이 그렇습니다'].join(NL),
    '나머지는 여기 있습니다');
  const withReply = await pipeline.generate(UID, 'k', '재물운', 1,
    { form: forms.byId('list'), accountId: acc['루사주'] });
  t('첫 댓글이 담긴다', !!withReply.posts[0].replyText, true);

  const picked = new Set();
  for (let i = 0; i < 12; i++) {
    picked.add(autopost.pickTopic({ topics: [] }, i, forms.byId('info'), {}));
  }
  t('키워드가 비면 여러 주제가 나온다', picked.size > 3, true);
  t('빈 주제는 안 나온다', Array.from(picked).every((x) => !!x), true);

  /* ⚠️ 「올리기 허용」이 계정끼리 같이 켜지고 꺼지던 적이 있다.
        한쪽을 꺼도 다른 쪽은 그대로 나가야 한다. */
  const publish = require(ROOT + '/services/threads/publish');
  await store.saveSettings(UID, { allowPublish: false }, acc['ai이안']);
  /* ⚠️ 앞에서 쓴 BODY 를 그대로 쓰면 **같은 글 검사**에 걸린다.
        이미 예약된 글과 같으니 막는 게 맞다 — 여기서 볼 것은 그게 아니라
        「올리기 허용」이니, 겹치지 않는 글로 본다. */
  const FRESH_A = ['임수 일간은 미리 재봅니다', '', '그래서 늦게 움직입니다', '',
    '한 번은 그냥 저질러보세요'].join(NL);
  const FRESH_B = ['정화 일간은 오래 담아둡니다', '', '그러다 한 번에 터집니다', '',
    '작을 때 말해보세요'].join(NL);
  const aPost = { id: 'x1', parts: [FRESH_A], replyText: '', accountId: acc['루사주'] };
  const bPost = { id: 'x2', parts: [FRESH_B], replyText: '', accountId: acc['ai이안'] };
  t('허용한 계정은 나갈 수 있다',
    (await publish.readyToSend(UID, aPost, { auto: true, accountId: acc['루사주'] })).ok, true);
  t('끈 계정은 못 나간다',
    (await publish.readyToSend(UID, bPost, { auto: true, accountId: acc['ai이안'] })).ok, false);
  await store.saveSettings(UID, { allowPublish: true }, acc['ai이안']);
  t('다시 켜면 나갈 수 있다',
    (await publish.readyToSend(UID, bPost, { auto: true, accountId: acc['ai이안'] })).ok, true);

  /* 규칙이 계정을 집었으면 그 계정으로만 나간다 */
  const readyA = await publish.readyToSend(UID, aPost, { auto: true, accountId: acc['루사주'] });
  const readyB = await publish.readyToSend(UID, bPost, { auto: true, accountId: acc['ai이안'] });
  t('A 는 A 열쇠를 집는다', readyA.acc.key, 'KEY_A');
  t('B 는 B 열쇠를 집는다', readyB.acc.key, 'KEY_B');
  const clash = rulesLib.clashWarning(
    { id: 'x', enabled: true, accountId: 1, slots: [{ day: 1, time: '08:10' }] },
    [{ id: 'y', name: '둘째', enabled: true, accountId: 1, slots: [{ day: 1, time: '08:10' }] }]);
  t('같은 계정 같은 시각을 경고한다', clash.indexOf('두 개씩 올라갑니다') > 0, true);
  t('다른 계정은 경고 안 한다', rulesLib.clashWarning(
    { id: 'x', enabled: true, accountId: 1, slots: [{ day: 1, time: '08:10' }] },
    [{ id: 'y', enabled: true, accountId: 2, slots: [{ day: 1, time: '08:10' }] }]), '');

  await clean();
  await pool.query('DELETE FROM users WHERE id=$1', [UID]);

  console.log(NL + '============================');
  console.log((fail ? 'FAIL ' : 'OK   ') + '통과 ' + pass + ' · 실패 ' + fail);
  if (fail) console.log('실패한 것: ' + fails.join(' / '));
  console.log('올린 글: 0개 — Zernio 는 가짜입니다');
  process.exit(fail ? 1 : 0);
})().catch(function (e) { console.error('터짐:', e.stack); process.exit(1); });
