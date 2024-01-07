// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


initializeApp(firebaseConfig);

export const FIREBASE_AUTH = getAuth();
export const FIREBASE_DB = getFirestore();
