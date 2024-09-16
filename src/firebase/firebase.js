// Import the functions needed from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
require('dotenv').config();

// Firebase configuration for the "task-manager-application-b016b" project
const firebaseConfig = {
  apiKey: firebase_api.env.API_KEY,
  authDomain: firebase_api.env.AUTH_DOMAIN,
  projectId: firebase_api.env.PROJECT_ID,
  storageBucket: firebase_api.env.STORAGE_BUCKET,
  messagingSenderId: firebase_api.env.MSG_SENDER_ID,
  appId: firebase_api.env.APP_ID,
};

// Initialize Firebase with the provided configuration
const app = initializeApp(firebaseConfig);

// Initialize Firestore database and Authentication services
const db = getFirestore(app);
const auth = getAuth(app);

// Export the initialized Firebase services for use in other parts of the application
export { db, app, auth };
