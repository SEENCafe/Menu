import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js';
import { firebaseConfig } from './firebase-config.js';

export const isFirebaseConfigured = firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith('YOUR_');

export const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;
export const db = isFirebaseConfigured ? getFirestore(app) : null;
export const auth = isFirebaseConfigured ? getAuth(app) : null;

export const MENU_COLLECTION = 'menu';
export const MENU_DOC_ID = 'live';
