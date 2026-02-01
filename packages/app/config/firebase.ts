import { initializeApp, getApps, getApp } from 'firebase/app';

import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log('Firebase Config Check:', {
  hasApiKey: !!firebaseConfig.apiKey,
  hasAuthDomain: !!firebaseConfig.authDomain,
  platform: Platform.OS
});



const app = getApps().length
  ? getApp()
  : (firebaseConfig.apiKey ? initializeApp(firebaseConfig) : null);

// Initialize Auth with persistence
import {
  initializeAuth,
  getAuth,
  browserLocalPersistence
} from 'firebase/auth';
import { Platform } from 'react-native';

const getFirebaseAuth = (app: any) => {
  if (!app) return null;

  try {
    // If auth is already initialized, return it
    const existingAuth = getAuth(app);
    return existingAuth;
  } catch (e) {
    // Not initialized yet
  }

  if (Platform.OS !== 'web') {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    const { getReactNativePersistence } = require('firebase/auth');
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  } else {
    return getAuth(app);
  }
};

export const auth = getFirebaseAuth(app);
export const db = app ? getFirestore(app) : null;

// Web persistence setting
if (auth && Platform.OS === 'web') {
  auth.setPersistence(browserLocalPersistence).catch((error: any) => {
    console.error("Firebase persistence error:", error);
  });
}
