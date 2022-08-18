const { initializeApp, getApps } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyAyO5wSV8oT8qF8GYZJ50n4gXlTcdmvpyE",
  authDomain: "newcombintest.firebaseapp.com",
  projectId: "newcombintest",
  storageBucket: "newcombintest.appspot.com",
  messagingSenderId: "714223511086",
  appId: "1:714223511086:web:be688c816a209f665ea1bf"
};

if (getApps().length === 0) {
  initializeApp(firebaseConfig);
}

module.exports = {
  db: getFirestore()
}