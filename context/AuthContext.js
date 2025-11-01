import { createContext, useState, useEffect } from "react";
import { auth } from "../firenase.js";
import { onAuthStateChanged, signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    user: null,
  });

  useEffect(() => {
    // Wait a bit for Firebase to be properly initialized
    const initAuth = async () => {
      try {
        const checkStoredAuth = async () => {
          try {
            const token = await AsyncStorage.getItem("token");
            const userRole = await AsyncStorage.getItem("userRole");

            if (token && userRole) {
              setAuthState({
                isLoggedIn: true,
                user: { token, role: userRole }
              });
            }
          } catch (error) {
            console.error("Error checking stored auth:", error);
          }
        };

        await checkStoredAuth();

        // Set up Firebase auth state listener
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            setAuthState({ isLoggedIn: true, user });
          } else {
            checkStoredAuth();
          }
        });

        return unsubscribe;
      } catch (error) {
        console.error("Auth initialization error:", error);
        return () => {};
      }
    };

    const unsubscribePromise = initAuth();

    return () => {
      unsubscribePromise.then(unsubscribe => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      });
    };
  }, []);

  const logout = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);

      // Clear local storage
      await AsyncStorage.multiRemove(["token", "userRole"]);

      // Reset auth state
      setAuthState({
        isLoggedIn: false,
        user: null,
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ authState, setAuthState, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
