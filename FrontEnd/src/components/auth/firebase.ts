// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDyPX9PphIV6_GHCbznGilEYB2wlC8jttU",
    authDomain: "tienda-ropa-12375.firebaseapp.com",
    projectId: "tienda-ropa-12375",
    storageBucket: "tienda-ropa-12375.firebasestorage.app",
    messagingSenderId: "313412113767",
    appId: "1:313412113767:web:d68ccf309e2b3506f18bc2",
    measurementId: "G-7NQ8HN7S90"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { auth };
