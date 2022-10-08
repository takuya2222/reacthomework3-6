import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAzRGzBV4tslMoRc8O4oUO6aRkhgnoGj4w",
  authDomain: "reacthomework3-48e57.firebaseapp.com",
  projectId: "reacthomework3-48e57",
  storageBucket: "reacthomework3-48e57.appspot.com",
  messagingSenderId: "288218993279",
  appId: "1:288218993279:web:63938e51c36e76ebbe654a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
const db = getFirestore(app);

export default db;