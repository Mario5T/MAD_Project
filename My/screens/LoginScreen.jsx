import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../context/AuthContext";

const API_URL = "http://10.254.201.15:3000/api/auth"; 
const PRIMARY_COLOR = "#00CED1";

const LoginScreen = ({ navigation }) => {
  const { setAuthState } = useContext(AuthContext);
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
      
      const res = await fetch(`${API_URL}/auth/login`, {
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
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={{ uri: "https://img.icons8.com/ios-filled/50/000000/back.png" }}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Login</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to access your account</Text>

        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, role === "student" && styles.activeToggle]}
            onPress={() => setRole("student")}
          >
            <Text
              style={[
                styles.toggleText,
                role === "student" && styles.activeToggleText,
              ]}
            >
              Student
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, role === "driver" && styles.activeToggle]}
            onPress={() => setRole("driver")}
          >
            <Text
              style={[
                styles.toggleText,
                role === "driver" && styles.activeToggleText,
              ]}
            >
              Driver
            </Text>
          </TouchableOpacity>
        </View>
        {role === "student" ? (
          <View style={styles.inputContainer}>
            <Image
              source={{ uri: "https://img.icons8.com/ios-filled/50/999999/email.png" }}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={setEmail}
            />
          </View>
        ) : (
          <View style={styles.inputContainer}>
            <Image
              source={{ uri: "https://img.icons8.com/ios-filled/50/999999/phone.png" }}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              value={phone}
              keyboardType="phone-pad"
              onChangeText={setPhone}
            />
          </View>
        )}

        <View style={styles.inputContainer}>
          <Image
            source={{ uri: "https://img.icons8.com/ios-filled/50/999999/password.png" }}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.disabledButton]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? "Please wait..." : "Login"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.switchModeButton}
          onPress={() => navigation.navigate("SignUp")}
        >
          <Text style={styles.switchModeText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: "#fff",
  },
  backButton: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },
  backIcon: { width: 20, height: 20 },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#333" },
  placeholder: { width: 40 },
  formContainer: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: "center", color: "#333" },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 30, textAlign: "center" },
  toggleContainer: { flexDirection: "row", justifyContent: "center", marginBottom: 25 },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  activeToggle: { backgroundColor: PRIMARY_COLOR },
  toggleText: { color: PRIMARY_COLOR, fontWeight: "600" },
  activeToggleText: { color: "#fff", fontWeight: "bold" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 10,
  },
  inputIcon: { width: 20, height: 20, marginRight: 10, opacity: 0.5 },
  input: { flex: 1, padding: 12, fontSize: 16, color: "#333" },
  submitButton: {
    backgroundColor: PRIMARY_COLOR,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  disabledButton: { backgroundColor: "#cccccc" },
  submitButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  switchModeButton: { alignItems: "center" },
  switchModeText: { color: PRIMARY_COLOR, fontSize: 14 },
});

export default LoginScreen;
