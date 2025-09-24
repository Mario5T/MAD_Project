import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { AuthContext } from "../context/AuthContext";

const API_URL = "http://20.2.0.23.181:3000/api/auth";

const AuthScreen = ({ navigation }) => {
  const { setAuth } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [role, setRole] = useState("student");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleSubmit = async () => {
    if (!form.password) {
      Alert.alert("Validation Error", "Please fill in all required fields.");
      return;
    }

    if (role === "student" && !form.email) {
      Alert.alert("Validation Error", "Email is required for student.");
      return;
    }
    if (role === "driver" && !form.phone) {
      Alert.alert("Validation Error", "Phone is required for driver.");
      return;
    }
    if (!isLogin && !form.name) {
      Alert.alert("Validation Error", "Name is required for signup.");
      return;
    }

    try {
      setLoading(true);
      const endpoint = isLogin ? "/auth/login" : "/auth/signup";

      const payload =
        role === "student"
          ? { name: form.name, email: form.email, password: form.password, role }
          : { name: form.name, phone: form.phone, password: form.password, role };

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong");

      if (isLogin) {
        setAuth({ isLoggedIn: true, token: data.token, role: data.role });
        navigation.replace("Home");
      } else {
        Alert.alert("Signup Successful", "You can now log in.");
        setIsLogin(true);
        setForm({ name: "", email: "", phone: "", password: "" });
      }
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? "Login" : "Signup"}</Text>

      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, role === "student" && styles.activeToggle]}
          onPress={() => setRole("student")}
        >
          <Text style={styles.toggleText}>Student</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, role === "driver" && styles.activeToggle]}
          onPress={() => setRole("driver")}
        >
          <Text style={styles.toggleText}>Driver</Text>
        </TouchableOpacity>
      </View>

      {/* Name (only on signup) */}
      {!isLogin && (
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={form.name}
          onChangeText={(t) => setForm({ ...form, name: t })}
        />
      )}

      {/* Student → Email, Driver → Phone */}
      {role === "student" ? (
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.email}
          onChangeText={(t) => setForm({ ...form, email: t })}
        />
      ) : (
        <TextInput
          style={styles.input}
          placeholder="Phone"
          keyboardType="phone-pad"
          value={form.phone}
          onChangeText={(t) => setForm({ ...form, phone: t })}
        />
      )}

      {/* Password (always shown) */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={form.password}
        onChangeText={(t) => setForm({ ...form, password: t })}
      />

      <Button
        title={loading ? "Please wait..." : isLogin ? "Login" : "Signup"}
        onPress={handleSubmit}
        disabled={loading}
      />

      <View style={{ marginTop: 15 }}>
        <Button
          title={isLogin ? "Need an account? Signup" : "Already have an account? Login"}
          onPress={() => setIsLogin(!isLogin)}
        />
      </View>
    </View>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
  },
  toggleContainer: {
    flexDirection: "row",
    marginBottom: 15,
    justifyContent: "center",
  },
  toggleButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    borderRadius: 6,
    marginHorizontal: 5,
  },
  activeToggle: {
    backgroundColor: "#1976D2",
  },
  toggleText: {
    color: "white",
    fontWeight: "bold",
  },
});
