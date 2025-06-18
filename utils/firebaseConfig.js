// firebaseConfig.js

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import 'firebase/compat/auth';
import { getFirestore } from 'firebase/firestore';
import firebase from 'firebase/compat/app';
import { updatePassword } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../utils/firebaseConfig'; // <-- assure-toi que le fichier exporte `storage`

const firebaseConfig = {
  apiKey: "AIzaSyD1CyQqXP6shj9xw6H66eEb_XiwxqfIbo0",
  authDomain: "epf-projet.firebaseapp.com",
  projectId: "epf-projet",
  storageBucket: "epf-projet.appspot.com",
  messagingSenderId: "601153087074",
  appId: "1:601153087074:web:cd9143b8f3c34c5f55533b"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, db as firestore }; // ✅ ICI
