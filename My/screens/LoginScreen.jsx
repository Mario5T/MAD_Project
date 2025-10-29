import React, { useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Alert,
  StatusBar,
} from "react-native";
import {
  Text,
  TextInput,
  Button,
  Card,
  Title,
  RadioButton,
  useTheme,
  Surface,
  ActivityIndicator
} from 'react-native-paper';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../context/AuthContext";

const API_URL = "https://mad-backend-5ijo.onrender.com"
const PRIMARY_COLOR = "#00CED1";

const LoginScreen = ({ navigation }) => {
  const { setAuthState } = useContext(AuthContext);
  const theme = useTheme();
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const payload =
        role === "student"
          ? { role, email, password }
          : { role, phone, password };

      console.log("Sending payload:", JSON.stringify(payload));
      
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text(); 
      console.log("RAW RESPONSE:", text);

      let data;
      try {
        if (text && !text.includes("<") && text.trim()) {
          data = JSON.parse(text);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (parseError) {
        console.error("Parse error:", parseError);
        throw new Error("Server returned an invalid response. Please try again later.");
      }

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (!data.token) {
        throw new Error("No token received from server.");
      }

      await AsyncStorage.setItem("token", data.token);
      setAuthState({ 
        isLoggedIn: true, 
        user: { 
          token: data.token, 
          role: data.role || role 
        } 
      });
      
      Alert.alert("Success", "Logged in successfully!");
      navigation.navigate("Home");
    } catch (error) {
      console.error("Login error:", error.message);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style="dark" />
      <Surface style={styles.headerContainer}>
        <Button
          mode="text"
          onPress={() => navigation.goBack()}
          icon="arrow-left"
          style={styles.backButton}
        >
        </Button>
        <Title style={[styles.headerTitle, { color: theme.colors.onSurface }]}>Login</Title>
        <View style={styles.placeholder} />
      </Surface>

      <Card style={styles.formContainer}>
        <Card.Content>
          <Title style={[styles.title, { color: theme.colors.onSurface }]}>Welcome Back</Title>
          <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>Sign in to access your account</Text>

          <View style={styles.toggleContainer}>
            <Text style={[styles.roleLabel, { color: theme.colors.onSurface }]}>Select Role:</Text>
            <RadioButton.Group onValueChange={setRole} value={role}>
              <View style={styles.radioRow}>
                <RadioButton value="student" />
                <Text style={[styles.radioLabel, { color: theme.colors.onSurface }]}>Student</Text>
              </View>
              <View style={styles.radioRow}>
                <RadioButton value="driver" />
                <Text style={[styles.radioLabel, { color: theme.colors.onSurface }]}>Driver</Text>
              </View>
            </RadioButton.Group>
          </View>
          {role === "student" ? (
            <TextInput
              mode="outlined"
              label="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              left={<TextInput.Icon icon="email" />}
              style={styles.input}
            />
          ) : (
            <TextInput
              mode="outlined"
              label="Phone"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              left={<TextInput.Icon icon="phone" />}
              style={styles.input}
            />
          )}

          <TextInput
            mode="outlined"
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            left={<TextInput.Icon icon="lock" />}
            style={styles.input}
          />
          
          <Button
            mode="contained"
            onPress={handleLogin}
            disabled={loading}
            loading={loading}
            style={styles.submitButton}
            contentStyle={styles.submitButtonContent}
          >
            {loading ? "Please wait..." : "Login"}
          </Button>
          
          <Button
            mode="text"
            onPress={() => navigation.navigate("SignUp")}
            style={styles.switchModeButton}
          >
            Don't have an account? Sign Up
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    elevation: 4,
  },
  backButton: { 
    width: 40, 
    height: 40,
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: "600",
  },
  placeholder: { 
    width: 40 
  },
  formContainer: { 
    flex: 1, 
    margin: 20,
    marginTop: 40,
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 10, 
    textAlign: "center",
  },
  subtitle: { 
    fontSize: 16, 
    marginBottom: 30, 
    textAlign: "center",
  },
  toggleContainer: { 
    marginBottom: 25,
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  radioLabel: {
    fontSize: 16,
    marginLeft: 8,
  },
  input: { 
    marginBottom: 15,
  },
  submitButton: {
    marginTop: 10,
    marginBottom: 20,
  },
  submitButtonContent: {
    paddingVertical: 8,
  },
  submitButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  switchModeButton: { alignItems: "center" },
  switchModeText: { color: PRIMARY_COLOR, fontSize: 14 },
});

export default LoginScreen;
