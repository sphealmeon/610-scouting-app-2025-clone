import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration

// North Bay Firebase
const firebaseConfig = {
  apiKey: "<GOOGLE_API_KEY_REDACTED>",
  authDomain: "northbay2025-579de.firebaseapp.com",
  projectId: "northbay2025-579de",
  storageBucket: "northbay2025-579de.firebasestorage.app",
  messagingSenderId: "269537278319",
  appId: "1:269537278319:web:a52ed74b8a67f2326f909a",
  measurementId: "G-46SKJ44HKN"
};
// const firebaseConfig = {
//   apiKey: "<GOOGLE_API_KEY_REDACTED>",
//   authDomain: "centennial2025-fe024.firebaseapp.com",
//   projectId: "centennial2025-fe024",
//   storageBucket: "centennial2025-fe024.firebasestorage.app",
//   messagingSenderId: "848980441429",
//   appId: "1:848980441429:web:5b279d9b35a8a0282197dc",
//   measurementId: "G-WS1CF9NVES"
// };


// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);