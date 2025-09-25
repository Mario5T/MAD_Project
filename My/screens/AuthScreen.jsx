import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { AuthContext } from "../context/AuthContext";

const API_URL = "http://50.50.48.13:3000/api/auth";
const PRIMARY_COLOR = "#00CED1";

const AuthScreen = ({ navigation }) => {
  const { setAuthState } = useContext(AuthContext);
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
      const endpoint = isLogin ? "/login" : "/signup";

      const payload =
        role === "student"
          ? { name: form.name, email: form.email, password: form.password, role }
          : { name: form.name, phone: form.phone, password: form.password, role };

      console.log("Sending payload:", JSON.stringify(payload));

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
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

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      if (isLogin) {
        if (!data.token) {
          throw new Error("No token received from server.");
        }
        setAuthState({ isLoggedIn: true, user: { token: data.token, role: data.role } });
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
      <StatusBar style="dark" />
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image 
            source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/back.png' }}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isLogin ? "Login" : "Sign Up"}</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.title}>{isLogin ? "Welcome Back" : "Create Account"}</Text>
        <Text style={styles.subtitle}>
          {isLogin 
            ? "Sign in to access your account" 
            : "Fill in your details to get started"}
        </Text>

        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, role === "student" && styles.activeToggle]}
            onPress={() => setRole("student")}
          >
            <Text style={[styles.toggleText, role === "student" && styles.activeToggleText]}>
              Student
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, role === "driver" && styles.activeToggle]}
            onPress={() => setRole("driver")}
          >
            <Text style={[styles.toggleText, role === "driver" && styles.activeToggleText]}>
              Driver
            </Text>
          </TouchableOpacity>
        </View>

        {!isLogin && (
          <View style={styles.inputContainer}>
            <Image 
              source={{ uri: 'https://img.icons8.com/ios-filled/50/999999/user.png' }}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={form.name}
              onChangeText={(t) => setForm({ ...form, name: t })}
            />
          </View>
        )}

        {role === "student" ? (
          <View style={styles.inputContainer}>
            <Image 
              source={{ uri: 'https://img.icons8.com/ios-filled/50/999999/email.png' }}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={(t) => setForm({ ...form, email: t })}
            />
          </View>
        ) : (
          <View style={styles.inputContainer}>
            <Image 
              source={{ uri: 'https://img.icons8.com/ios-filled/50/999999/phone.png' }}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              keyboardType="phone-pad"
              value={form.phone}
              onChangeText={(t) => setForm({ ...form, phone: t })}
            />
          </View>
        )}

        <View style={styles.inputContainer}>
          <Image 
            source={{ uri: 'https://img.icons8.com/ios-filled/50/999999/password.png' }}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={form.password}
            onChangeText={(t) => setForm({ ...form, password: t })}
          />
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.switchModeButton}
          onPress={() => {
            setIsLogin(!isLogin);
            setForm({ name: "", email: "", phone: "", password: "" });
          }}
        >
          <Text style={styles.switchModeText}>
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#fff',
  },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  backIcon: { width: 20, height: 20 },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#333" },
  placeholder: { width: 40 },
  formContainer: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: "center", color: "#333" },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 30, textAlign: "center" },
  toggleContainer: { flexDirection: "row", marginBottom: 25, justifyContent: "center" },
  toggleButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 5,
    backgroundColor: "#fff",
  },
  activeToggle: { backgroundColor: PRIMARY_COLOR },
  toggleText: { color: PRIMARY_COLOR, fontWeight: "600" },
  activeToggleText: { color: "#fff", fontWeight: "bold" },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
