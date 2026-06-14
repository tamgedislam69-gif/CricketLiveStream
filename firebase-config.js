import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBW6Rf4dYmZFsc8ZdFk41ga2TQCNfbw10N",
  authDomain: "cricketliveapp-ef634.firebaseapp.com",
  projectId: "cricketliveapp-ef634",
  storageBucket: "cricketliveapp-ef634.firebasestorage.app",
  messagingSenderId: "627452543521",
  appId: "1:627452543521:web:4a96f4a31654c872351968",
  measurementId: "G-01VFT36B98"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
