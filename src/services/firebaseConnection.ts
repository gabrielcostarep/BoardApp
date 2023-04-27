import firebase from 'firebase/app'
import 'firebase/firestore'

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyADY3paDdcoWwypnnWS1KXhKj2TZuK9kbg",
  authDomain: "boardapp-4068e.firebaseapp.com",
  projectId: "boardapp-4068e",
  storageBucket: "boardapp-4068e.appspot.com",
  messagingSenderId: "1052464381365",
  appId: "1:1052464381365:web:fdb2ad1a2be7b98a5c2dfc",
  measurementId: "G-NHG588CZ9W"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);


export default firebase;