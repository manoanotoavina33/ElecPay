importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyD1odjbJDUst_PPpZEns-KJNH_QZ54OL-g',
  authDomain: 'electricitedeslocataires.firebaseapp.com',
  projectId: 'electricitedeslocataires',
  storageBucket: 'electricitedeslocataires.firebasestorage.app',
  messagingSenderId: '481744311990',
  appId: '1:481744311990:web:7a2878b000211eee78b817',
  measurementId: 'G-XV58Y4DC9W'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow('/');
    })
  );
});
