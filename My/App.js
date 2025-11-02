import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from 'react-native-paper';
import AppNavigator from "./navigation/AppNavigator";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider, ThemeContext } from "./context/ThemeContext";

function AppContent() {
  const { theme } = React.useContext(ThemeContext);
  
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </PaperProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}



