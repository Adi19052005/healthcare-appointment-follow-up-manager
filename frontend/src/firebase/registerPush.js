import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean);

let messaging = null;

export function initFirebase() {
  if (!isFirebaseConfigured) {
    return null;
  }

  try {
    const app = initializeApp(firebaseConfig);
    messaging = getMessaging(app);
    return messaging;
  } catch (err) {
    console.warn('Firebase init skipped', err.message || err);
    return null;
  }
}

export async function registerForPush(userId) {
  if (!userId || !isFirebaseConfigured) return null;
  if (!messaging) initFirebase();
  if (!messaging) return null;

  try {
    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
    if (!vapidKey) return null;

    const currentToken = await getToken(messaging, { vapidKey });
    if (currentToken) {
      const endpoint = import.meta.env.VITE_NOTIFICATION_SERVICE_URL || '/api/notifications';
      if (!endpoint) return currentToken;

      await fetch(`${endpoint}/tokens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ token: currentToken, platform: 'web', userId }),
      });
      return currentToken;
    }
  } catch (err) {
    console.warn('Push registration skipped', err.message || err);
  }
  return null;
}

export function listenForeground(handler) {
  if (!messaging) initFirebase();
  if (!messaging) return () => {};
  return onMessage(messaging, (payload) => handler(payload));
}
