import { createContext, useState, useEffect } from "react";
import { auth } from "../firenase";
import { onAuthStateChanged } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    user: null,
  });

  useEffect(() => {
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

    checkStoredAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthState({ isLoggedIn: true, user });
      } else {

        checkStoredAuth();
      }
    });
    
    return unsubscribe; 
  }, []);

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};
