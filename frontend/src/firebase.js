import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDiP17txLvTtuO00LwnkkEIRIF5_nzKGsM",
  authDomain: "phishing-detection-websi-658f9.firebaseapp.com",
  projectId: "phishing-detection-websi-658f9",
  storageBucket: "phishing-detection-websi-658f9.firebasestorage.app",
  messagingSenderId: "710959249488",
  appId: "1:710959249488:web:c03299a2375a3d1ce87955"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
