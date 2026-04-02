import { getMessaging, getToken } from 'firebase/messaging';
import { getApps, initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // measurementId: "",
};

// 이미 초기화된 앱이 있으면 재사용 (Next.js HMR 환경에서 중복 초기화 방지)
export const firebaseApp = getApps().length
  ? getApps()[0]
  : initializeApp(firebaseConfig);

export async function getFCMToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  const messaging = getMessaging(firebaseApp);

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return null;

  return getToken(messaging, {
    vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
    serviceWorkerRegistration: await navigator.serviceWorker.register(
      '/firebase-messaging-sw.js'
    ),
  });
}
