/* 루월당 알림 수신기 (서비스 워커)
   브라우저가 꺼져 있어도 이 파일이 알림을 받아 화면에 띄운다. */

self.addEventListener('install', (e) => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
  let d = { title: '루월당', body: '새 소식이 있습니다.', url: '/leads' };
  try { if (event.data) d = Object.assign(d, event.data.json()); } catch (e) {}

  event.waitUntil(
    self.registration.showNotification(d.title, {
      body: d.body,
      icon: '/img/push-icon.png',
      badge: '/img/push-icon.png',
      data: { url: d.url },
      tag: 'luwoldang-lead',
      renotify: true,
      vibrate: [80, 40, 80],
    })
  );
});

/* 알림을 누르면 해당 화면으로 이동 (이미 열려 있으면 그 창을 사용) */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/leads';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if (c.url.includes(url) && 'focus' in c) return c.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
