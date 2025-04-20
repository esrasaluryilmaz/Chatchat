// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//! auth importlari
import { getAuth, GoogleAuthProvider } from "firebase/auth";

//! database import
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAI9_JuT4DkSrhUTh-_QFqTV5gPXYiwWII",
  authDomain: "chat-f4408.firebaseapp.com",
  projectId: "chat-f4408",
  storageBucket: "chat-f4408.firebasestorage.app",
  messagingSenderId: "402486741387",
  appId: "1:402486741387:web:289fb7f4d3fd7e07b4c78e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//! google saglayicisini kur
export const provider = new GoogleAuthProvider();

//! auth hizmetini referansini al
export const auth = getAuth(app);

//! database hizmetinin referansini al
export const db = getFirestore(app);
