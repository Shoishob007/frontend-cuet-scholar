import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyALrfY-AgYFdzlbZJ3tzdHWg6m6vKE7hE0",
  authDomain: "cuetscholar.firebaseapp.com",
  projectId: "cuetscholar",
  storageBucket: "cuetscholar.appspot.com",
  messagingSenderId: "230865142420",
  appId: "1:230865142420:web:428177d1f6b8907ca5aa81",
  measurementId: "G-9PF97B67XX",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);
const auth = getAuth(app);

setPersistence(auth, browserSessionPersistence);

export { app, storage, db, auth };
