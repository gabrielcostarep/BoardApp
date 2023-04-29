import firebase from 'firebase/app'
import 'firebase/firestore'

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);


export default firebase;
