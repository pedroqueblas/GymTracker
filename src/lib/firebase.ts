import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBDpguKoxT_nExlFK2Scn87CyueAMExdqs",
  authDomain: "gymlife-23a90.firebaseapp.com",
  projectId: "gymlife-23a90",
  storageBucket: "gymlife-23a90.firebasestorage.app",
  messagingSenderId: "908201033104",
  appId: "1:908201033104:web:87e2e1c306649ae04c0715",
  measurementId: "G-K7B0FZFJVZ"
};

// Initialize Firebase (Singleton pattern)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Analytics only on client side and if supported
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, db, analytics };
