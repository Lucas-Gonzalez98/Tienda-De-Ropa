// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDdAL8SQZnAxy41jgqs3ekoJZx1yhzovgU",
    authDomain: "tienda-ropa-82bfd.firebaseapp.com",
    projectId: "tienda-ropa-82bfd",
    storageBucket: "tienda-ropa-82bfd.firebasestorage.app",
    messagingSenderId: "420021390633",
    appId: "1:420021390633:web:ee29b4e7d0ca03724dbb38",
    measurementId: "G-LZCXEE0G7H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { auth };
