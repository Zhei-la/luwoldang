/* ============================================================
 * scripts/threads-local.js — 내 PC 에서 글을 만들어 채운다
 *
 * OpenAI 를 **한 번도 안 부른다.** 내 컴퓨터에 깔린 Claude Code 로 쓴다.
 * 이미 Claude 를 쓰고 있는데 API 요금을 또 내는 게 아까워서 만들었다.
 *
 * 하는 일
 *   ① 규칙이 잡아둔 자리 중 **빈 자리**를 찾는다
 *   ② 그 자리 글을 Claude Code 로 만든다 (한 편에 30초쯤)
 *   ③ 데이터베이스에 넣는다 — 웹 화면에 바로 뜬다
 *   ④ 「바로 예약까지」 규칙이면 Zernio 에 예약까지 건다
 *
 * 서버(Railway)는 그대로 둔다. 예약 확인·발행·띠 계산은 서버가 계속 한다.
 * 서버의 **글 만들기만** 꺼둔다 (Railway 변수 THREADS_AUTOGEN=off).
 * 그러면 요금이 한 푼도 안 나간다.
 *
 * ── 쓰는 법 ──────────────────────────────────────
 *   1) 프로젝트 폴더에 .env 를 만들고 한 줄 적는다
 *        DATABASE_URL=postgresql://...   ← Railway 의 Postgres 공개 주소
 *   2) 이 명령을 돌린다
 *        node scripts/threads-local.js
 *   3) 며칠에 한 번 돌리면 된다. 3일치를 미리 채우므로
 *      PC 를 며칠 꺼둬도 그 사이 글은 그대로 올라간다.
 *
 *   자동으로 돌리고 싶으면 윈도우 「작업 스케줄러」에 threads-local.bat 을
 *   건다. 만드는 법은 --help 로 볼 수 있다.
 *
 * ⚠️ 이건 **내 PC 에서만** 돈다. 서버에는 Claude Code 가 없다.
 * ============================================================ */

/* 글쓰기는 Claude Code 로. require 보다 먼저 정해야 한다. */
process.env.THREADS_ENGINE = 'claude';
/* 이 스크립트 자신은 서버의 「만들기 끄기」에 걸리면 안 된다 */
process.env.THREADS_AUTOGEN = 'on';

const path = require('path');
const fs = require('fs');

/* .env 를 손으로 읽는다. dotenv 를 새로 깔게 하지 않으려고. */
(function loadEnv() {
  const file = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(file)) return;
  fs.readFileSync(file, 'utf8').split(/\r?\n/).forEach((line) => {
    const t = line.trim();
    if (!t || t[0] === '#') return;
    const at = t.indexOf('=');
    if (at < 1) return;
    const k = t.slice(0, at).trim();
    const v = t.slice(at + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[k]) process.env[k] = v;
  });
})();

const NL = String.fromCharCode(10);

if (process.argv.indexOf('--help') >= 0 || process.argv.indexOf('-h') >= 0) {
  console.log([
    '',
    '  내 PC 에서 스레드 글을 만들어 채웁니다. OpenAI 요금이 안 나갑니다.',
    '',
    '  준비',
    '    1. Claude Code 가 깔려 있어야 합니다 —  claude --version',
    '    2. 프로젝트 폴더에 .env 파일을 만들고 한 줄 적습니다',
    '         DATABASE_URL=postgresql://...',
    '       Railway → Postgres → Variables → DATABASE_PUBLIC_URL 을 복사하세요.',
    '    3. Railway 의 웹 서비스 Variables 에 한 줄 더 넣습니다',
    '         THREADS_AUTOGEN=off',
    '       (서버가 OpenAI 로 글을 만들지 않게 막는 스위치입니다)',
    '',
    '  돌리기',
    '    node scripts/threads-local.js            빈 자리를 채웁니다',
    '    node scripts/threads-local.js --dry      만들지 않고 무엇을 할지만 봅니다',
    '    node scripts/threads-local.js --user 3   그 사람 것만',
    '',
    '  자동으로 돌리기 (윈도우)',
    '    threads-local.bat 을 「작업 스케줄러」에 겁니다.',
    '      제어판 → 작업 스케줄러 → 작업 만들기',
    '      트리거: 매일 오전 9시   동작: threads-local.bat',
    '    3일치를 미리 채우므로 하루에 한 번이면 넉넉합니다.',
    '',
  ].join(NL));
  process.exit(0);
}

if (!process.env.DATABASE_URL) {
  console.error([
    '',
    '  DATABASE_URL 이 없습니다.',
    '',
    '  프로젝트 폴더에 .env 파일을 만들고 이렇게 한 줄 적어주세요.',
    '    DATABASE_URL=postgresql://...',
    '',
    '  Railway → Postgres → Variables → DATABASE_PUBLIC_URL 을 복사하시면 됩니다.',
    '  (내부 주소 DATABASE_URL 말고 **공개 주소** 여야 내 PC 에서 닿습니다)',
    '',
  ].join(NL));
  process.exit(1);
}

const ROOT = path.join(__dirname, '..');
const { pool } = require(ROOT + '/db');
const rulesLib = require(ROOT + '/services/threads/rules');
const autopost = require(ROOT + '/services/threads/autopost');
const claude = require(ROOT + '/services/threads/llm-claude');

const DRY = process.argv.indexOf('--dry') >= 0;
const userAt = process.argv.indexOf('--user');
const ONLY_USER = userAt >= 0 ? Number(process.argv[userAt + 1]) : null;

function line(s) { console.log(s); }
function stamp() {
  const d = new Date(Date.now() + 9 * 3600 * 1000);
  return d.toISOString().slice(0, 16).replace('T', ' ');
}

(async () => {
  line('');
  line('  ┌─ 내 PC 에서 스레드 글 만들기 ' + stamp() + ' (한국 시각)');
  line('  │  글쓰기: Claude Code   ·   OpenAI 호출: 0회');
  line('  └─────────────────────────────────────────────');
  line('');

  /* Claude Code 가 되는지 먼저 본다. 안 되면 여기서 멈추는 게 낫다 —
     자리마다 실패하면 무엇이 문제인지 알기 어렵다. */
  process.stdout.write('  Claude Code 확인 중… ');
  const ok = await claude.check();
  if (!ok.ok) {
    line('안 됩니다.');
    line('    ' + ok.message);
    line('');
    line('  「claude --version」 이 되는지 먼저 확인해주세요.');
    process.exit(1);
  }
  line('됩니다.');

  const list = await rulesLib.active();
  const mine = ONLY_USER ? list.filter((r) => r.userId === ONLY_USER) : list;
  line('  켜져 있는 규칙 ' + mine.length + '개');
  line('');

  if (!mine.length) {
    line('  채울 규칙이 없습니다. 웹에서 규칙을 켜고 자리를 정해주세요.');
    await pool.end();
    return;
  }

  let made = 0, moved = 0, caught = 0;
  const errors = [];

  for (const rule of mine) {
    const who = (rule.name || rule.id) + (rule.accountId ? ' (계정 ' + rule.accountId + ')' : '');

    if (DRY) {
      /* 무엇을 할지만 본다. 요금도 시간도 안 든다. */
      const plan = rulesLib.plan(rule, rulesLib.LOOKAHEAD_DAYS);
      line('  ' + who + ' — 앞으로 ' + rulesLib.LOOKAHEAD_DAYS + '일에 자리 ' + plan.length + '개');
      plan.forEach((x) => {
        const t = new Date(new Date(x.sendAt).getTime() + 9 * 3600 * 1000);
        line('      ' + t.toISOString().slice(5, 16).replace('T', ' ') +
          (x.slot.form ? '  · ' + x.slot.form : ''));
      });
      continue;
    }

    process.stdout.write('  ' + who + ' … ');
    try {
      /* ⚠️ openaiKey 는 넘기지 않는다. Claude Code 는 열쇠가 필요 없다. */
      const r = await autopost.runRule(rule);
      made += r.made.length;
      moved += r.moved || 0;
      caught += r.caught || 0;
      line(r.made.length + '개 만듦' +
        (r.moved ? ' · ' + r.moved + '개 밀어냄' : '') +
        (r.caught ? ' · ' + r.caught + '개 예약 걸음' : ''));
      r.errors.forEach((e) => errors.push(who + ': ' + e));
    } catch (e) {
      line('실패 — ' + e.message);
      errors.push(who + ': ' + e.message);
    }
  }

  line('');
  if (DRY) {
    line('  (--dry 라서 아무것도 만들지 않았습니다)');
  } else {
    line('  ── 끝 ──');
    line('  만든 글 ' + made + '개 · 예약 건 것 ' + caught + '개 · 밀어낸 것 ' + moved + '개');
    line('  OpenAI 요금: 0원');
    if (errors.length) {
      line('');
      line('  못 한 것 ' + errors.length + '개:');
      errors.slice(0, 8).forEach((e) => line('    · ' + e));
    }
    line('');
    line('  웹에서 확인: https://www.luwolsaju.com/threads');
  }
  line('');

  await pool.end();
})().catch(async (e) => {
  console.error('');
  console.error('  터졌습니다: ' + e.message);
  if (/getaddrinfo|ECONNREFUSED|ETIMEDOUT|SASL|password/i.test(e.message)) {
    console.error('');
    console.error('  데이터베이스에 못 닿는 것 같습니다.');
    console.error('  .env 의 DATABASE_URL 이 Railway 의 **공개 주소**(DATABASE_PUBLIC_URL)인지 봐주세요.');
  }
  console.error('');
  try { await pool.end(); } catch (x) { /* 이미 닫혔으면 그만 */ }
  process.exit(1);
});
