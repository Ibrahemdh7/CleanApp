// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC1JYvX63g_uI0qwV-vvlepHIp0JI7X1U4",
  authDomain: "foumn-d0af0.firebaseapp.com",
  projectId: "foumn-d0af0",
  storageBucket: "foumn-d0af0.appspot.com",
  messagingSenderId: "851666297259",
  appId: "1:851666297259:web:2727beac48eeaf010432ee",
  measurementId: "G-X8NMVKYN76" 
};

initializeApp(firebaseConfig);

export const FIREBASE_AUTH = getAuth();
export const FIREBASE_DB = getFirestore();
