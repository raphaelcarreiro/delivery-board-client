import firebase from 'firebase/app';
import 'firebase/messaging';

export const firebaseConfig = {
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: process.env.FIREBASE_AUTHDOMAIN,
  databaseURL: process.env.FIREBASE_DATABASEURL,
  projectId: process.env.FIREBASE_PROJECTID,
  storageBucket: process.env.FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.FIREBASE_SENDERID,
  appId: process.env.FIREBASE_APP_ID,
};

function getFirebaseMessaging() {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  return firebase.messaging();
}

export const firebaseMessagingIsSupported = firebase.messaging.isSupported;

export { getFirebaseMessaging };
