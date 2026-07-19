/**
 * push.js — 브라우저 알림(웹 푸시)
 *
 *   손님이 사주를 신청하면 교육생의 휴대폰·컴퓨터로 알림을 보낸다.
 *   기기마다 구독 정보가 하나씩 저장되고, 여러 기기를 함께 쓸 수 있다.
 *
 *   필요한 환경변수 (Railway Variables)
 *     VAPID_PUBLIC_KEY   알림 인증용 공개키
 *     VAPID_PRIVATE_KEY  알림 인증용 비밀키
 *     VAPID_SUBJECT      연락처 (mailto:주소 형태, 없으면 기본값 사용)
 */

const { pool } = require('../db');

let webpush = null;
let ready = false;

try {
  webpush = require('web-push');
  const pub = process.env.VAPID_PUBLIC_KEY;
  const key = process.env.VAPID_PRIVATE_KEY;
  if (pub && key) {
    webpush.setVapidDetails(
      process.env.VAPID_SUBJECT || 'mailto:saju_moon@luwolsaju.com',
      pub, key
    );
    ready = true;
  } else {
    console.log('[알림] VAPID 키가 없어 브라우저 알림이 꺼져 있습니다.');
  }
} catch (e) {
  console.log('[알림] web-push 를 불러오지 못했습니다:', e.message);
}

/** 알림 기능을 쓸 수 있는 상태인지 */
function pushReady() { return ready; }

/** 브라우저에 넘겨줄 공개키 */
function publicKey() { return process.env.VAPID_PUBLIC_KEY || ''; }

/** 이 교육생이 알림을 켜 둔 기기 수 */
async function subCount(teacherId) {
  try {
    const { rows } = await pool.query(
      'SELECT COUNT(*)::int AS n FROM push_subs WHERE teacher_id = $1', [teacherId]
    );
    return rows[0].n;
  } catch (e) { return 0; }
}

/** 기기 등록 (이미 있으면 소유자만 갱신) */
async function saveSub(teacherId, sub) {
  if (!sub || !sub.endpoint || !sub.keys) throw new Error('구독 정보가 올바르지 않습니다.');
  await pool.query(
    `INSERT INTO push_subs (teacher_id, endpoint, p256dh, auth)
     VALUES ($1,$2,$3,$4)
     ON CONFLICT (endpoint) DO UPDATE
       SET teacher_id = EXCLUDED.teacher_id,
           p256dh = EXCLUDED.p256dh,
           auth = EXCLUDED.auth`,
    [teacherId, sub.endpoint, sub.keys.p256dh, sub.keys.auth]
  );
}

/** 기기 해제 */
async function removeSub(endpoint) {
  await pool.query('DELETE FROM push_subs WHERE endpoint = $1', [endpoint]);
}

/**
 * 알림 보내기 — 실패해도 화면 동작에는 영향이 없도록 조용히 처리한다.
 * @param {number} teacherId 받는 교육생
 * @param {object} msg { title, body, url }
 */
async function notify(teacherId, msg) {
  if (!ready || !teacherId) return 0;

  let rows = [];
  try {
    const r = await pool.query(
      'SELECT endpoint, p256dh, auth FROM push_subs WHERE teacher_id = $1', [teacherId]
    );
    rows = r.rows;
  } catch (e) { return 0; }
  if (!rows.length) return 0;

  const payload = JSON.stringify({
    title: msg.title || '루월당',
    body: msg.body || '',
    url: msg.url || '/leads',
    // 알림마다 다른 표시를 달아준다 — 같으면 새 알림이 앞 알림을 덮어써서
    // 신청이 여러 건 들어와도 하나만 보인다
    tag: msg.tag || ('luwoldang-' + Date.now()),
  });

  // 안드로이드는 절전(Doze) 상태에서 우선순위가 보통인 알림을 모아뒀다가 나중에 준다.
  // 폰이 자고 있어도 바로 깨우도록 높음으로 보낸다.
  const opts = { TTL: 86400, urgency: 'high' };

  let sent = 0;
  await Promise.all(rows.map(async (s) => {
    try {
      await webpush.sendNotification(
        { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
        payload,
        opts
      );
      sent++;
    } catch (e) {
      // 404·410 은 기기에서 알림을 끈 경우 → 정리한다
      if (e.statusCode === 404 || e.statusCode === 410) {
        await pool.query('DELETE FROM push_subs WHERE endpoint = $1', [s.endpoint]).catch(() => {});
      } else {
        let host = '';
        try { host = new URL(s.endpoint).host; } catch (x) {}
        console.error('[알림] 발송 실패:', host, e.statusCode || e.message);
      }
    }
  }));

  if (sent) console.log(`[알림] ${sent}개 기기로 발송: ${msg.title}`);
  return sent;
}

module.exports = { pushReady, publicKey, subCount, saveSub, removeSub, notify };
