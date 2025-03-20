import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration

// Centennial Firebase
const firebaseConfig = {
  apiKey: "<GOOGLE_API_KEY_REDACTED>",
  authDomain: "northbay2025-579de.firebaseapp.com",
  projectId: "northbay2025-579de",
  storageBucket: "northbay2025-579de.firebasestorage.app",
  messagingSenderId: "269537278319",
  appId: "1:269537278319:web:a52ed74b8a67f2326f909a",
  measurementId: "G-46SKJ44HKN"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);