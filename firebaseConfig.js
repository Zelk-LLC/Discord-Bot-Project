const {initializeApp} = require('firebase/app');
const firebase = require('firebase')
require('firebase/firestore')
const {getFirestore} = require('firebase/firestore');


const firebaseConfig = {
    apiKey: "AIzaSyDxyvBI3C8neg-yoc2lwrPdJtOnNfMH2iE",
    authDomain: "scrip-database.firebaseapp.com",
    projectId: "scrip-database",
    storageBucket: "scrip-database.appspot.com",
    messagingSenderId: "44909120808",
    appId: "1:44909120808:web:eee4ed91540c49d9bc141d",
    measurementId: "G-E6PTD9KJK6"
}

const app = initializeApp(firebaseConfig);

const db = firestore.firestore();
module.exports = {
    firebaseConfig: firebaseConfig,
    app: app,
    db: db
 }


