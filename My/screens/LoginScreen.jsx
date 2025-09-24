import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.128.139:3000/api/auth";

const LoginScreen = ({ navigation }) => {
  const [role, setRole] = useState("student"); 
  const [email, setEmail] = useState(""); 
  const [phone, setPhone] = useState(""); 
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const payload =
        role === "student"
          ? { role, email, password }
          : { role, phone, password };

      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      console.log("RAW RESPONSE:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Backend did not return JSON. Check server response.");
      }

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }
      await AsyncStorage.setItem("token", data.token);

      Alert.alert("Success", "Logged in successfully!");
      navigation.navigate("Home");
    } catch (error) {
      console.error("Login error:", error.message);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
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
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
        />
      ) : (
        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={phone}
          keyboardType="phone-pad"
          onChangeText={setPhone}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },

  // Toggle styles
  toggleContainer: { flexDirection: "row", justifyContent: "center", marginBottom: 20 },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#1976D2",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  activeToggle: { backgroundColor: "#1976D2" },
  toggleText: { color: "#1976D2", fontWeight: "600" },
  activeToggleText: { color: "#fff", fontWeight: "bold" },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
  },
  button: { backgroundColor: "#1976D2", padding: 15, borderRadius: 8, marginBottom: 10 },
  buttonText: { color: "white", textAlign: "center", fontWeight: "bold" },
  link: { color: "#1976D2", textAlign: "center", marginTop: 10 },
});

export default LoginScreen;
