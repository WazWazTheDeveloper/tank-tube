// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBSRndol0xi8SUcQsHxOL9gXN9lY2aMh_o",
  authDomain: "tank-tube.firebaseapp.com",
  databaseURL:
    "https://tank-tube-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "tank-tube",
  storageBucket: "tank-tube.appspot.com",
  messagingSenderId: "743760378643",
  appId: "1:743760378643:web:ddeff94b828e7c547a78e6",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
