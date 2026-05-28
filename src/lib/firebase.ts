import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDdjHPpk2d3YcetI0N_ce7XWd052J6eLa8",
  authDomain: "portfolio-f8246.firebaseapp.com",
  projectId: "portfolio-f8246",
  storageBucket: "portfolio-f8246.firebasestorage.app",
  messagingSenderId: "580496433779",
  appId: "1:580496433779:web:57c77fc6f0175fdc998006",
  measurementId: "G-1RZKHBSNTL"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 
export const auth = getAuth(app);
