importScripts(
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js'
);

firebase.initializeApp({
  apiKey: 'AIzaSyBbVeYlGYd7Hnw5h6s6X9FsAUyIkFmspac',
  authDomain: 'modusplant-push-alarm-test.firebaseapp.com',
  projectId: 'modusplant-push-alarm-test',
  storageBucket: 'modusplant-push-alarm-test.firebasestorage.app',
  messagingSenderId: '564757083681',
  appId: '1:564757083681:web:0762b76e9534f977bb9560',
});

const messaging = firebase.messaging();

// 백그라운드 메시지 수신 (앱이 닫혀있거나 다른 탭에 있는 상태)
messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification ?? {};
  self.registration.showNotification(title ?? '', {
    body,
    icon: '/logo_favicon/favicon_v2_white.svg', // 알림에 표시할 아이콘 경로
  });
});
