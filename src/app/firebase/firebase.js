import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "<GOOGLE_API_KEY_REDACTED>",
  authDomain: "caph2025.firebaseapp.com",
  projectId: "caph2025",
  storageBucket: "caph2025.firebasestorage.app",
  messagingSenderId: "88225754422",
  appId: "1:88225754422:web:8a489e4223a7a017fc5797",
  measurementId: "G-9HYBNV0EQ0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);