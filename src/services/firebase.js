import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD3rlRTXPIAUR6tA1dt6ViyjgF4xIYgFHc",
  authDomain: "accounts-a9.firebaseapp.com",
  projectId: "accounts-a9",
  storageBucket: "accounts-a9.appspot.com",
  messagingSenderId: "939100148340",
  appId: "1:939100148340:web:5fd17701bf57bfbb97f721",
  measurementId: "G-84NW93M39J"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();
const auth = firebase.auth();

export { firebase, firestore, auth };
