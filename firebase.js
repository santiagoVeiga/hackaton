// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCXLNHdAeb9BLhwnHngYrjAcAILluLh6mU",
  authDomain: "kudosdb-6cf6c.firebaseapp.com",
  projectId: "kudosdb-6cf6c",
  storageBucket: "kudosdb-6cf6c.firebasestorage.app",
  messagingSenderId: "753377450282",
  appId: "1:753377450282:web:2e9d899fd79f817f9ee653",
  measurementId: "G-0N2R35VX7F",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = db;
