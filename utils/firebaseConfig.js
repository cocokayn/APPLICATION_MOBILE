import { initializeApp } from 'firebase/app';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { getFirestore } from 'firebase/firestore';

// ⚠️ Remplace par ta config
const firebaseConfig = {
  apiKey: "AIzaSyD1CyQqXP6shj9xw6H66eEb_XiwxqfIbo0",
  authDomain: "epf-projet.firebaseapp.com",
  projectId: "epf-projet",
  storageBucket: "epf-projet.appspot.com",
  messagingSenderId: "601153087074",
  appId: "1:601153087074:web:cd9143b8f3c34c5f55533b"
};

// Initialiser uniquement si pas déjà initialisé
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const app = initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = getFirestore(app);
export { firebase, auth,db };
