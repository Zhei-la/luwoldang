/* ============================================================
 * scripts/threads-zerniotest.js — Zernio 연동 시험
 *
 * 진짜 Zernio 에는 보내지 않는다. 흉내 내는 서버를 세워두고
 * 우리 코드가 제대로 부르는지, 실패를 제대로 다루는지만 본다.
 *
 *   node scripts/threads-zerniotest.js
 * ============================================================ */

const http = require('http');

let pass = 0, fail = 0;
function t(name, got, want) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (ok) { pass++; console.log('  ✓ ' + name); }
  else { fail++; console.log('  ✗ ' + name + '\n      받음: ' + JSON.stringify(got) + '\n      기대: ' + JSON.stringify(want)); }
}

const calls = [];
let mode = 'ok';

const server = http.createServer((req, res) => {
  let body = '';
  req.on('data', (d) => (body += d));
  req.on('end', () => {
    let json = null;
    try { json = JSON.parse(body); } catch (e) {}
    calls.push({ url: req.url, method: req.method, auth: req.headers.authorization, body: json });

    const send = (code, obj) => {
      res.writeHead(code, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(obj));
    };

    if (mode === 'badkey') return send(401, { error: { message: 'unauthorized' } });

    if (req.url === '/accounts') {
      if (mode === 'noaccount') return send(200, { data: [] });
      return send(200, { data: [
        { id: 'a1', platform: 'threads', username: '루월당' },
        { id: 'a2', platform: 'instagram', username: '딴것' },
      ] });
    }
    if (req.url === '/posts' && req.method === 'POST') {
      if (mode === 'dupe') return send(409, { error: { message: 'duplicate' } });
      return send(200, { post: { _id: 'z1', platforms: [{ publishedUrl: 'https://threads.net/x' }] } });
    }
    if (req.url.startsWith('/posts/') && req.method === 'GET') {
      return send(200, { post: { status: 'published', platforms: [{ publishedUrl: 'https://threads.net/y' }] } });
    }
    if (req.url.startsWith('/posts/') && req.method === 'DELETE') return send(200, { ok: true });
    send(404, { error: { message: 'unknown' } });
  });
});

server.listen(0, async () => {
  process.env.ZERNIO_API = 'http://127.0.0.1:' + server.address().port;
  const z = require('../services/threads/zernio');

  console.log('\n── 계정 목록 ──');
  calls.length = 0;
  const accs = await z.listAccounts('zk_live_x');
  t('스레드 계정만 걸러낸다', accs.length, 1);
  t('계정 이름을 읽는다', accs[0].username, '루월당');
  t('열쇠를 헤더로 보낸다', calls[0].auth, 'Bearer zk_live_x');

  console.log('\n── 열쇠 확인 ──');
  const chk = await z.check('zk_live_x');
  t('된다고 알려준다', chk.ok, true);
  mode = 'noaccount';
  const chk2 = await z.check('zk_live_x');
  t('계정이 없으면 알려준다', /연결된 스레드 계정이 없습니다/.test(chk2.message), true);
  mode = 'ok';

  console.log('\n── 지금 올리기 ──');
  calls.length = 0;
  const out = await z.send({ apiKey: 'k', accountId: 'a1', parts: ['1편', '2편', '3편'], mode: 'publish' });
  t('글 번호를 받는다', out.id, 'z1');
  t('올라간 주소를 받는다', out.permalink, 'https://threads.net/x');
  const sent = calls[0].body;
  t('연재를 threadItems 로 보낸다', sent.platforms[0].platformSpecificData.threadItems.length, 3);
  t('첫 편이 본문이 된다', sent.content, '1편');
  t('스레드로 보낸다', sent.platforms[0].platform, 'threads');
  t('고른 계정으로 보낸다', sent.platforms[0].accountId, 'a1');
  t('지금 올리라고 표시한다', sent.publishNow, true);
  t('예약 시각은 안 보낸다', sent.scheduledFor, undefined);

  console.log('\n── 예약 ──');
  calls.length = 0;
  await z.send({ apiKey: 'k', accountId: 'a1', parts: ['가'], mode: 'schedule', scheduledFor: '2026-09-01T12:00:00Z' });
  const s2 = calls[0].body;
  t('예약 시각을 보낸다', s2.scheduledFor, '2026-09-01T12:00:00Z');
  t('한국 시간대로 보낸다', s2.timezone, 'Asia/Seoul');
  t('지금 올리라고 하지 않는다', s2.publishNow, undefined);

  console.log('\n── 예약 상태 확인 ──');
  const st = await z.getStatus('k', 'z1');
  t('올라갔는지 알려준다', st.status, 'published');
  t('주소도 알려준다', st.permalink, 'https://threads.net/y');

  console.log('\n── 막힐 때 ──');
  let err = null;
  try { await z.send({ apiKey: 'k', accountId: '', parts: ['가'], mode: 'publish' }); } catch (e) { err = e; }
  t('계정을 안 골랐으면 미리 막는다', /올릴 계정을 먼저 고르세요/.test(err.message), true);

  mode = 'dupe'; err = null;
  try { await z.send({ apiKey: 'k', accountId: 'a1', parts: ['가'], mode: 'publish' }); } catch (e) { err = e; }
  t('같은 글 24시간 규칙을 설명한다', /24시간 안에 이미 올라갔거나/.test(err.message), true);

  mode = 'badkey'; err = null;
  try { await z.listAccounts('k'); } catch (e) { err = e; }
  t('열쇠가 틀리면 알려준다', /열쇠가 맞지 않습니다/.test(err.message), true);
  t('공백 붙었는지 보라고 알려준다', /공백/.test(err.message), true);

  err = null;
  try { await z.listAccounts(''); } catch (e) { err = e; }
  t('열쇠가 없으면 미리 막는다', err.code, 'NO_KEY');

  console.log('\n' + (fail ? '✗ ' : '✓ ') + '통과 ' + pass + ' · 실패 ' + fail);
  process.exitCode = fail ? 1 : 0;
  server.close();
});
