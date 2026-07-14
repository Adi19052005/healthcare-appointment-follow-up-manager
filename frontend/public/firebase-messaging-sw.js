self.addEventListener('push', function(event) {
  let data = {};
  try {
    data = event.data.json();
  } catch (e) {
    data = { title: 'Notification', body: event.data?.text() || '' };
  }

  const title = data.notification?.title || data.title || 'Notification';
  const body = data.notification?.body || data.body || '';
  const options = {
    body,
    data: data.data || {},
    vibrate: [100, 50, 100],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const url = event.notification?.data?.url || '/';
  event.waitUntil(clients.openWindow(url));
});
