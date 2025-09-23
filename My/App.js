import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./navigation/AppNavigator";
import { AuthContext } from "./context/authContext"; // 
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    token: null,
  });

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        setAuthState({ isLoggedIn: true, token });
      }
    };
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthContext.Provider>
  );
}


