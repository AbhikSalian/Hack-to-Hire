// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyC1DVW7IGdhaLe_mmpgPuFb2NZHRSWzGAs",
//   authDomain: "hack-to-hire.firebaseapp.com",
//   projectId: "hack-to-hire",
//   storageBucket: "hack-to-hire.appspot.com",
//   messagingSenderId: "166434181364",
//   appId: "1:166434181364:web:bf4a816a1da1cac3244ea1",
//   measurementId: "G-LWZHJP2MRJ"
// };

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6sfdICEf8fbEoDh0I9Zu780zRBniYuNw",
  authDomain: "task-manager-ce02f.firebaseapp.com",
  projectId: "task-manager-ce02f",
  storageBucket: "task-manager-ce02f.appspot.com",
  messagingSenderId: "26997091343",
  appId: "1:26997091343:web:c4c4ffa39ecfbae720077a"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export{db,app,auth};