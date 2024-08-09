// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBAS_API,
  authDomain: "hspantryapp-cf6a9.firebaseapp.com",
  projectId: "hspantryapp-cf6a9",
  storageBucket: "hspantryapp-cf6a9.appspot.com",
  messagingSenderId: "100574577832",
  appId: "1:100574577832:web:a1a96fac3b2066ab862e9d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)
export {app, firestore}