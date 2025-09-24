// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAP8IgU6ppiXyavAVzGvxWqJHL5sUBgEUM",
  authDomain: "revracker.firebaseapp.com",
  projectId: "revracker",
  storageBucket: "revracker.firebasestorage.app",
  messagingSenderId: "797264725566",
  appId: "1:797264725566:web:e2281c0866045d0a9f336f",
  measurementId: "G-XH566N5Q16"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);
export default app;
export { auth }