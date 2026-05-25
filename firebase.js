// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBk0EIJ4IJpxv3f-Odkx4c__OtK3bmtz50",
  authDomain: "reactnative-a55ad.firebaseapp.com",
  projectId: "reactnative-a55ad",
  storageBucket: "reactnative-a55ad.firebasestorage.app",
  messagingSenderId: "336506130237",
  appId: "1:336506130237:web:a12598957499c8af5dbf54",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app)
export { app, database, auth, storage };
