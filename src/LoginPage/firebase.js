import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBXUHCCKguPCO-WAhv6evetJ2-gD0h9lxQ",
  authDomain: "capstone2-login.firebaseapp.com",
  projectId: "capstone2-login",
  storageBucket: "capstone2-login.appspot.com",
  messagingSenderId: "444530390622",
  appId: "1:444530390622:web:55b3a3ddb2fb956eb026cf"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;