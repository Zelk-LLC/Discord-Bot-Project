const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs } = require('firebase/firestore/lite');
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDxyvBI3C8neg-yoc2lwrPdJtOnNfMH2iE",
  authDomain: "scrip-database.firebaseapp.com",
  projectId: "scrip-database",
  storageBucket: "scrip-database.appspot.com",
  messagingSenderId: "44909120808",
  appId: "1:44909120808:web:eee4ed91540c49d9bc141d",
  measurementId: "G-E6PTD9KJK6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = {
    firebaseConfig: firebaseConfig
    ,app: app
    ,db: db

};