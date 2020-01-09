importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('../firebase-messaging-sw.js')
    .then(function(registration) {
      console.log('Registration successful, scope is:', registration.scope);
    })
    .catch(function(err) {
      console.log('Service worker registration failed, error:', err);
    });
}

const config = {
  messagingSenderId: '372525900715',
};

firebase.initializeApp(config);

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  console.log('Handling background message ', payload);

  return self.registration.showNotification(payload.data.title, {
    body: payload.data.body,
    icon: payload.data.icon,
    data: payload.data.link,
  });
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(self.clients.openWindow(event.notification.data));
});
