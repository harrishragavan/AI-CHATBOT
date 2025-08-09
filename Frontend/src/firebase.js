// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB6p_Hjb-MG4lpBQqClMOmuHSZ7GqGL_-A",
  authDomain: "chatbot-efec8.firebaseapp.com",
  projectId: "chatbot-efec8",
  storageBucket: "chatbot-efec8.appspot.com",
  messagingSenderId: "363038804794",
  appId: "1:363038804794:web:7b9cf924f1bd0b5860de03",
  measurementId: "G-0VFMQGBZJX"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
