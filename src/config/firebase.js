import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyASrQiIuAynmvRcLmYdE-1-IOjcrR7P5Kw",
    authDomain: "braintease-565c4.firebaseapp.com",
    projectId: "braintease-565c4",
    storageBucket: "braintease-565c4.appspot.com",
    messagingSenderId: "675998124735",
    appId: "1:675998124735:web:09d18c9aef045b29ff540a",
    measurementId: "G-MNZ390F9Z0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);