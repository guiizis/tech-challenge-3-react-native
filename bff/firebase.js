const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "..", ".env.local") });

const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

const firebaseApp = initializeApp({
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
});

const db = getFirestore(firebaseApp);

module.exports = { db };
