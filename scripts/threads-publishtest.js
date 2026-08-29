/* ============================================================
 * scripts/threads-publishtest.js — 발행 흐름 시험
 *
 * 진짜 스레드에는 올리지 않는다. 흉내 내는 서버를 세워두고
 * 우리 코드가 제대로 부르는지, 실패를 제대로 다루는지만 본다.
 *
 *   node scripts/threads-publishtest.js
 * ============================================================ */

const http = require('http');

let pass = 0, fail = 0;
function t(name, got, want) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (ok) { pass++; console.log('  ✓ ' + name); }
  else { fail++; console.log('  ✗ ' + name + '\n      받음: ' + JSON.stringify(got) + '\n      기대: ' + JSON.stringify(want)); }
}

/* ── 흉내 내는 스레드 서버 ── */
const calls = [];
let mode = 'ok';
let seq = 0;

const server = http.createServer((req, res) => {
  let body = '';
  req.on('data', (d) => (body += d));
  req.on('end', () => {
    const params = new URLSearchParams(body);
    calls.push({ url: req.url, method: req.method, params: Object.fromEntries(params) });

    const send = (code, obj) => {
      res.writeHead(code, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(obj));
    };

    if (req.url.startsWith('/me')) return send(200, { id: '999', username: '루월당' });
    if (req.url.includes('fields=permalink')) return send(200, { permalink: 'https://www.threads.net/@x/post/abc' });

    if (req.url.endsWith('/threads')) {
      if (mode === 'badtoken') return send(401, { error: { message: 'Invalid access token', code: 190 } });
      if (mode === 'ratelimit') return send(429, { error: { message: 'rate limit reached' } });
      return send(200, { id: 'c' + (++seq) });
    }

    if (req.url.endsWith('/threads_publish')) {
      /* 2편에서 막히는 경우를 만든다 */
      if (mode === 'failsecond' && params.get('creation_id') === 'c2') {
        return send(400, { error: { message: 'something broke' } });
      }
      return send(200, { id: 'p' + params.get('creation_id').slice(1) });
    }
    send(404, { error: { message: 'unknown' } });
  });
});

server.listen(0, async () => {
  process.env.THREADS_API = 'http://127.0.0.1:' + server.address().port;
  /* 시험이 오래 걸리지 않게 기다리는 시간을 줄인다 */
  const pub = require('../services/threads/publish');

  console.log('\n── 계정 확인 ──');
  const me = await pub.whoami('tok');
  t('토큰으로 계정을 알아낸다', me, { id: '999', username: '루월당' });

  console.log('\n── 한 편 올리기 ──');
  calls.length = 0; seq = 0; mode = 'ok';
  const one = await pub.publishPost('tok', '999', ['안녕하세요']);
  t('글 id 를 받는다', one.rootId, 'p1');
  t('주소를 받아온다', one.permalink, 'https://www.threads.net/@x/post/abc');
  const made = calls.filter((c) => c.url.endsWith('/threads'))[0];
  t('본문을 그대로 보낸다', made.params.text, '안녕하세요');
  t('글 종류를 TEXT 로 보낸다', made.params.media_type, 'TEXT');
  t('토큰을 같이 보낸다', made.params.access_token, 'tok');
  t('첫 편은 답글이 아니다', made.params.reply_to_id, undefined);

  console.log('\n── 연재 3편 잇기 ──');
  calls.length = 0; seq = 0;
  const chain = await pub.publishPost('tok', '999', ['1편', '2편', '3편']);
  t('세 편 모두 올라간다', chain.ids, ['p1', 'p2', 'p3']);
  const creates = calls.filter((c) => c.url.endsWith('/threads'));
  t('2편은 1편에 답글로 붙는다', creates[1].params.reply_to_id, 'p1');
  t('3편은 2편에 답글로 붙는다', creates[2].params.reply_to_id, 'p2');
  t('맨 앞 글이 대표가 된다', chain.rootId, 'p1');

  console.log('\n── 중간에 막혔을 때 ──');
  calls.length = 0; seq = 0; mode = 'failsecond';
  let err = null;
  try { await pub.publishPost('tok', '999', ['1편', '2편', '3편']); } catch (e) { err = e; }
  t('오류를 던진다', !!err, true);
  t('어디까지 올렸는지 알려준다', err && err.publishedIds, ['p1']);
  t('몇 번째에서 막혔는지 알려준다', err && err.partIndex, 1);
  t('앞 편이 올라갔다고 말해준다', /앞의 1편은 이미 올라갔습니다/.test(err.message), true);

  console.log('\n── 토큰이 틀렸을 때 ──');
  mode = 'badtoken';
  err = null;
  try { await pub.publishPost('tok', '999', ['가']); } catch (e) { err = e; }
  t('토큰 문제라고 알려준다', /토큰이 만료되었거나 잘못됐습니다/.test(err.message), true);

  console.log('\n── 너무 자주 올렸을 때 ──');
  mode = 'ratelimit';
  err = null;
  try { await pub.publishPost('tok', '999', ['가']); } catch (e) { err = e; }
  t('하루 한도를 알려준다', /하루 250개/.test(err.message), true);

  server.close();
  console.log('\n' + (fail ? '✗ ' : '✓ ') + '통과 ' + pass + ' · 실패 ' + fail);
  process.exit(fail ? 1 : 0);
});
