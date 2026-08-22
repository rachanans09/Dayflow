import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDiAZ09C_bFXsBdAT2F1vsAH1EriayZTjY",
  authDomain: "dayflow-hrms-110d8.firebaseapp.com",
  projectId: "dayflow-hrms-110d8",
  storageBucket: "dayflow-hrms-110d8.firebasestorage.app",
  messagingSenderId: "802659926986",
  appId: "1:802659926986:web:a8ffdd1a4f627559380533"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;

