// Import the functions needed from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Firebase configuration for your web app
// Replace these with your Firebase project's configuration details
// Note: Keep the API keys and other sensitive information secure

// Uncomment and use the appropriate configuration as needed

// Firebase configuration for the "hack-to-hire" project
// const firebaseConfig = {
//   apiKey: "AIzaSyC1DVW7IGdhaLe_mmpgPuFb2NZHRSWzGAs",
//   authDomain: "hack-to-hire.firebaseapp.com",
//   projectId: "hack-to-hire",
//   storageBucket: "hack-to-hire.appspot.com",
//   messagingSenderId: "166434181364",
//   appId: "1:166434181364:web:bf4a816a1da1cac3244ea1",
//   measurementId: "G-LWZHJP2MRJ"
// };

// Firebase configuration for the "task-manager-ce02f" project
// const firebaseConfig = {
//   apiKey: "AIzaSyA6sfdICEf8fbEoDh0I9Zu780zRBniYuNw",
//   authDomain: "task-manager-ce02f.firebaseapp.com",
//   projectId: "task-manager-ce02f",
//   storageBucket: "task-manager-ce02f.appspot.com",
//   messagingSenderId: "26997091343",
//   appId: "1:26997091343:web:c4c4ffa39ecfbae720077a"
// };

// Firebase configuration for the "task-manager-app-e2dab" project
// const firebaseConfig = {
//   apiKey: "AIzaSyC47t9re6uhwc_bGqaqFBzdUeM2mk-R360",
//   authDomain: "task-manager-app-e2dab.firebaseapp.com",
//   projectId: "task-manager-app-e2dab",
//   storageBucket: "task-manager-app-e2dab.appspot.com",
//   messagingSenderId: "334558603716",
//   appId: "1:334558603716:web:9feaa911a8844c43fb9c91"
// };

// Firebase configuration for the "task-manager-application-b016b" project
const firebaseConfig = {
  apiKey: "AIzaSyA3LDrI6sbyv2enuLUz9Y8I91WC5kGkVBE",
  authDomain: "task-manager-application-b016b.firebaseapp.com",
  projectId: "task-manager-application-b016b",
  storageBucket: "task-manager-application-b016b.appspot.com",
  messagingSenderId: "961920185063",
  appId: "1:961920185063:web:75f1fa6c86b25133f46842",
};

// Initialize Firebase with the provided configuration
const app = initializeApp(firebaseConfig);

// Initialize Firestore database and Authentication services
const db = getFirestore(app);
const auth = getAuth(app);

// Export the initialized Firebase services for use in other parts of the application
export { db, app, auth };
