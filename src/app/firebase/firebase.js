import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration

// North Bay Firebase
const firebaseConfig = {
  apiKey: "<GOOGLE_API_KEY_REDACTED>",
  authDomain: "humber2025-de9cc.firebaseapp.com",
  projectId: "humber2025-de9cc",
  storageBucket: "humber2025-de9cc.firebasestorage.app",
  messagingSenderId: "820372592540",
  appId: "1:820372592540:web:a051c7dc5c527a494f5a59"
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