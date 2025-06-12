// firebaseConfig.js

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import 'firebase/compat/auth'
import { getFirestore } from 'firebase/firestore';

// ✅ Ta configuration Firebase (valide)
const firebaseConfig = {
  apiKey: "AIzaSyD1CyQqXP6shj9xw6H66eEb_XiwxqfIbo0",
  authDomain: "epf-projet.firebaseapp.com",
  projectId: "epf-projet",
  storageBucket: "epf-projet.appspot.com",
  messagingSenderId: "601153087074",
  appId: "1:601153087074:web:cd9143b8f3c34c5f55533b"
};

// ✅ Initialisation sécurisée (évite les doublons)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// ✅ Export des services Firebase à utiliser dans l'app
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };