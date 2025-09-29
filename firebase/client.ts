// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: "interviewready-4e175.firebaseapp.com",
    projectId: "interviewready-4e175",
    storageBucket: "interviewready-4e175.firebasestorage.app",
    messagingSenderId: "861174176675",
    appId: "1:861174176675:web:062e319d59c57fb73a9816",
    measurementId: "G-YCN9TLZ9X4"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

// Initialize Analytics only on client side
let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export { analytics };