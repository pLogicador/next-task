import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCIk-pyWOeCGwSkXqD6O8MBdSIKiTddITE",
  authDomain: "tasknext-e6590.firebaseapp.com",
  projectId: "tasknext-e6590",
  storageBucket: "tasknext-e6590.firebasestorage.app",
  messagingSenderId: "487286225140",
  appId: "1:487286225140:web:695b0c2967eb91e79506a1",
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

export { db };
