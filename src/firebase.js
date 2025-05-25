import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDySJGzU-L3XNJL9sHXeNlJkH8uAB2eF8E",
  authDomain: "kanbanapp-c2299.firebaseapp.com",
  projectId: "kanbanapp-c2299",
  storageBucket: "kanbanapp-c2299.appspot.com",
  messagingSenderId: "658448368803",
  appId: "1:658448368803:web:12a12db25e5eef55ae6b16"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

