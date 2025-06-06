// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD1CyQqXP6shj9xw6H66eEb_XiwxqfIbo0",
  authDomain: "epf-projet.firebaseapp.com",
  projectId: "epf-projet",
  storageBucket: "epf-projet.firebasestorage.app",
  messagingSenderId: "601153087074",
  appId: "1:601153087074:web:cd9143b8f3c34c5f55533b",
  measurementId: "G-FRWGVC6QQ5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);