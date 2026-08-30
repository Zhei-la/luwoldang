/* ============================================================
 * services/guestSite.js — 손님 주소와 루월당 주소를 가른다
 *
 * 주소가 두 개인데 가리키는 프로그램은 하나다.
 *
 *   www.luwolsaju.com   교육생이 들어오는 곳. 대시보드가 다 열린다.
 *   saju.pe.kr          손님에게 뿌리는 곳. 만세력·무료사주만 열린다.
 *
 * ⚠️ 막지 않으면 손님이 주소 뒤를 지우고 saju.pe.kr 만 쳤을 때
 *    루월당 로그인 화면이 그대로 보인다. 그러면 주소를 나눈 뜻이 없다.
 *
 * 손님 주소는 환경변수 MSITE_HOST 로 정한다. 비워두면 이 갈래가
 * 통째로 꺼지고 예전과 똑같이 돈다.
 * ============================================================ */

/** 손님에게 뿌리는 주소. 없으면 빈 문자열. */
function host() {
  return String(process.env.MSITE_HOST || '')
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/\/+$/, '')
    .toLowerCase();
}

/** 지금 들어온 요청이 손님 주소로 왔는가 */
function isGuest(req) {
  const h = host();
  if (!h) return false;
  const now = String((req && req.hostname) || '').toLowerCase();
  if (!now) return false;
  /* www 를 붙여 들어와도 같은 곳으로 본다 */
  return now === h || now === 'www.' + h || 'www.' + now === h;
}

/** 손님에게 보여줄 링크를 만들 때 쓰는 앞자리 */
function base(req) {
  const h = host();
  if (h) return 'https://' + h;
  const proto = (req && req.get && req.get('x-forwarded-proto')) || (req && req.protocol) || 'https';
  const now = (req && req.get && req.get('host')) || '';
  return now ? proto + '://' + now : (process.env.BASE_URL || '');
}

/**
 * 루월당 주소로 들어온 손님 화면을 손님 주소로 넘긴다.
 *
 * 링크 만드는 자리만 고쳐서는 부족하다. 이미 스레드·문자·북마크로
 * 퍼져 있는 옛 주소(luwolsaju.com/아무개)는 그대로 열려서
 * 주소창에 루월당이 그대로 보인다. 그래서 열릴 때 넘겨준다.
 *
 * @returns {boolean} 넘겼으면 true. true 면 호출한 쪽은 바로 끝내야 한다.
 */
function bounce(req, res) {
  const h = host();
  if (!h) return false;              // 손님 주소를 안 정했으면 아무것도 안 한다
  if (isGuest(req)) return false;    // 이미 손님 주소면 그대로 둔다
  /* POST 는 307 로 넘겨야 보낸 값이 살아서 따라간다 */
  const code = req.method === 'GET' || req.method === 'HEAD' ? 301 : 307;
  res.redirect(code, 'https://' + h + req.originalUrl);
  return true;
}

/**
 * 손님 주소에서 열면 안 되는 곳으로 왔을 때 보여줄 화면.
 *
 * 루월당이라는 말이 한 글자도 나오면 안 된다.
 * 링크도 걸지 않는다 — 눌러서 다른 데로 새게 두지 않는다.
 */
function block(req, res) {
  res.status(404).type('html').send(`<!DOCTYPE html>
<html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>주소를 다시 확인해주세요</title>
<style>
  html,body{margin:0;height:100%}
  body{background:#FBF8F2;color:#241F18;display:flex;align-items:center;justify-content:center;
    font-family:'Pretendard','Apple SD Gothic Neo','Malgun Gothic',-apple-system,sans-serif;
    padding:24px;word-break:keep-all}
  .b{max-width:420px;text-align:center}
  .m{width:52px;height:52px;border-radius:15px;background:#241F18;color:#fff;margin:0 auto 20px;
    display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:800;
    font-family:serif}
  h1{font-size:20px;font-weight:800;margin:0 0 10px;line-height:1.5}
  p{font-size:14.5px;line-height:1.9;color:#7C7566;margin:0}
</style></head><body>
  <div class="b">
    <div class="m">命</div>
    <h1>주소를 다시 확인해주세요</h1>
    <p>받으신 링크를 그대로 눌러 들어와 주세요.<br>
      주소 뒷부분이 빠지면 이 화면이 나옵니다.</p>
  </div>
</body></html>`);
}

module.exports = { host, isGuest, base, block, bounce };
