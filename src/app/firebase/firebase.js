import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "<GOOGLE_API_KEY_REDACTED>",
    authDomain: "tester-6164e.firebaseapp.com",
    projectId: "tester-6164e",
    storageBucket: "tester-6164e.firebasestorage.app",
    messagingSenderId: "715056047",
    appId: "1:715056047:web:30151e5f3adec43d50855a"
  };

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);