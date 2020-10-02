import firebase from 'firebase/app';
import 'firebase/messaging';

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASEURL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDERID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function initialize() {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
}

function getFirebaseMessaging() {
  // initialize();
  return firebase.messaging();
}

function isSupported() {
  // initialize();
  return firebase.messaging.isSupported();
}

export { isSupported as firebaseMessagingIsSupported };
export { getFirebaseMessaging };
