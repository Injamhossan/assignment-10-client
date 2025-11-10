// src/firebase/firebase.config.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// --- IMPORTANT ---
// Apni jodi ager step-e ekhono 'REACT_APP_' prefix babohar koren,
// tahole nicher line-guloke obosshoi 'VITE_' prefix diye poriborton korun.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// --- SHOTHIK LINE ---
// getAuth() function-ke 'app' instance-ti pass korun
export const auth = getAuth(app);

export default app;