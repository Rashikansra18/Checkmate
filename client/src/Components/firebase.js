// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDTfG9HCgYoPZ_3mbXOJQTs7TnFTvC5_y0",
    authDomain: "plagiarism-9424b.firebaseapp.com",
    projectId: "plagiarism-9424b",
    storageBucket: "plagiarism-9424b.firebasestorage.app",
    messagingSenderId: "417003928656",
    appId: "1:417003928656:web:7c6b17ec89e58040002555",
    measurementId: "G-Q21CT1JHHZ"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();