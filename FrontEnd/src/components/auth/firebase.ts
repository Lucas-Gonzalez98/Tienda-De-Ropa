// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDrLI_1Gm0-mMAg36d2maOCdO_AwmTWqYI",
    authDomain: "tienda-ropa-f352a.firebaseapp.com",
    projectId: "tienda-ropa-f352a",
    storageBucket: "tienda-ropa-f352a.firebasestorage.app",
    messagingSenderId: "223914939112",
    appId: "1:223914939112:web:e856cee0c319047c98ef5d",
    measurementId: "G-2F0BQG1R47"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { auth };
