// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence, browserLocalPersistence, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAP8IgU6ppiXyavAVzGvxWqJHL5sUBgEUM",
  authDomain: "revracker.firebaseapp.com",
  projectId: "revracker",
  storageBucket: "revracker.firebasestorage.app",
  messagingSenderId: "797264725566",
  appId: "1:797264725566:web:e2281c0866045d0a9f336f",
  measurementId: "G-XH566N5Q16"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with platform-specific configuration
let auth;

try {
  if (typeof window !== 'undefined' && window.document) {
    // Web environment - use browser persistence
    auth = getAuth(app);
    // Set persistence for web
    setPersistence(auth, browserLocalPersistence).catch(err => {
      console.warn('Failed to set browser persistence:', err);
    });
  } else {
    // React Native environment - use AsyncStorage persistence
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  }
} catch (error) {
  console.error('Firebase Auth initialization error:', error);

  // Fallback to basic auth initialization
  if (typeof window !== 'undefined' && window.document) {
    // Web fallback
    auth = getAuth(app);
  } else {
    // React Native fallback
    try {
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
      });
    } catch (fallbackError) {
      console.error('Firebase Auth fallback failed:', fallbackError);
      // Last resort - just get the auth instance
      auth = getAuth(app);
    }
  }
}

export const db = getFirestore(app);
export default app;
export { auth };