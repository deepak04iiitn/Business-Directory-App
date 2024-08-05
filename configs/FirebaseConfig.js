// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCm5i2VnAARMLBcojGkT0cigjIGsNAcsoM",
  authDomain: "bizfinder-fdd7a.firebaseapp.com",
  projectId: "bizfinder-fdd7a",
  storageBucket: "bizfinder-fdd7a.appspot.com",
  messagingSenderId: "662533013043",
  appId: "1:662533013043:web:66536890a8c1214f80ed46"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)