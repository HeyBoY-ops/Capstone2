// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBXUHCCKguPCO-WAhv6evetJ2-gD0h9lxQ",
//   authDomain: "capstone2-login.firebaseapp.com",
//   projectId: "capstone2-login",
//   storageBucket: "capstone2-login.firebasestorage.app",
//   messagingSenderId: "444530390622",
//   appId: "1:444530390622:web:55b3a3ddb2fb956eb026cf"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// export const auth = getAuth(app);
// export const db = getFirestore(app); // Export the Firestore instance
// export default app;

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBXUHCCKguPCO-WAhv6evetJ2-gD0h9lxQ",
  authDomain: "capstone2-login.firebaseapp.com",
  projectId: "capstone2-login",
  storageBucket: "capstone2-login.appspot.com", // corrected from "firebasestorage.app"
  messagingSenderId: "444530390622",
  appId: "1:444530390622:web:55b3a3ddb2fb956eb026cf"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;