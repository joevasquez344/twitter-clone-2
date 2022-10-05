// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import * as firebase from "firebase/app";
import { getFirestore } from "firebase/firestore/lite"; // <- needed if using firestore
import "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCkru6NdvFlTGpL-fd8bf9CYzN6y5G9qaE",
  authDomain: "twitter-clone-2-8cc40.firebaseapp.com",
  projectId: "twitter-clone-2-8cc40",
  storageBucket: "twitter-clone-2-8cc40.appspot.com",
  messagingSenderId: "901267939425",
  appId: "1:901267939425:web:d6e4ce5d4985426643ca20",
};

// react-redux-firebase config
const rrfConfig = {
  userProfile: "users",
  useFirestoreForProfile: true, // Firestore for Profile instead of Realtime DB
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// firebase.firestore() // <- needed if using firestore

const auth = getAuth(app);
const storage = getStorage(app);

export { firebase, db, auth, storage, rrfConfig };
