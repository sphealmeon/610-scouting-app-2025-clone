import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "<GOOGLE_API_KEY_REDACTED>",
//   authDomain: "isr1-4228a.firebaseapp.com",
//   projectId: "isr1-4228a",
//   storageBucket: "isr1-4228a.firebasestorage.app",
//   messagingSenderId: "694387931748",
//   appId: "1:694387931748:web:788da2edebffa3a28efd71"
// };
const firebaseConfig = {
  apiKey: "<GOOGLE_API_KEY_REDACTED>",
  authDomain: "week0-37766.firebaseapp.com",
  projectId: "week0-37766",
  storageBucket: "week0-37766.firebasestorage.app",
  messagingSenderId: "598831442662",
  appId: "1:598831442662:web:f9b6f61b762c7bec6f6927",
  measurementId: "G-FW6QKWXRNN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);