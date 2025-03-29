import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration

// North Bay Firebase
const firebaseConfig = {
  apiKey: "<GOOGLE_API_KEY_REDACTED>",
  authDomain: "mcmaster2025-3d59d.firebaseapp.com",
  projectId: "mcmaster2025-3d59d",
  storageBucket: "mcmaster2025-3d59d.firebasestorage.app",
  messagingSenderId: "805365301289",
  appId: "1:805365301289:web:d51bae008d80204091dc38"
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