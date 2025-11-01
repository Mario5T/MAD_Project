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
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from '../context/ThemeContext';
import { Appbar, useTheme, IconButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

const API_URL = "https://mad-backend-5ijo.onrender.com";
const PRIMARY_COLOR = "#00CED1";

const AuthScreen = ({ navigation }) => {
  const { setAuthState } = useContext(AuthContext);
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
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
    if (role === "admin" && !form.email) {
      Alert.alert("Validation Error", "Email is required for admin.");
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
          : role === "admin"
          ? { name: form.name, email: form.email, password: form.password, role }
          : { name: form.name, phone: form.phone, password: form.password, role };

      console.log("Sending payload:", JSON.stringify(payload));

      const response = await fetch(`${API_URL}/api/auth${endpoint}`, {
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
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("userRole", data.role);
        
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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <LinearGradient
        colors={isDarkMode ? ['#1e3a5f', '#2c5282'] : ['#0056b3', '#0088ff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <IconButton
            icon="arrow-left"
            iconColor="#ffffff"
            size={24}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
          <Text style={styles.headerTitle}>{isLogin ? "Login" : "Sign Up"}</Text>
          <IconButton
            icon={isDarkMode ? "weather-sunny" : "weather-night"}
            iconColor="#ffffff"
            size={24}
            onPress={toggleTheme}
            style={styles.themeButton}
          />
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.formContainer}>
        <Text style={[styles.title, { color: theme.colors.onBackground }]}>{isLogin ? "Welcome Back" : "Create Account"}</Text>
        <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
          {isLogin 
            ? "Sign in to access your account" 
            : "Fill in your details to get started"}
        </Text>

        <View style={styles.toggleContainerAdminStudentDriverContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton, 
              { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline },
              role === "student" && styles.activeToggle
            ]}
            onPress={() => setRole("student")}
          >
            <Text style={[styles.toggleText, role === "student" && styles.activeToggleText]}>
              Student
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline },
              role === "driver" && styles.activeToggle
            ]}
            onPress={() => setRole("driver")}
          >
            <Text style={[styles.toggleText, role === "driver" && styles.activeToggleText]}>
              Driver
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline },
              role === "admin" && styles.activeToggle
            ]}
            onPress={() => setRole("admin")}
          >
            <Text style={[styles.toggleText, role === "admin" && styles.activeToggleText]}>
              Admin
            </Text>
          </TouchableOpacity>
        </View>

        {!isLogin && (
          <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline }]}>
            <Image 
              source={{ uri: 'https://img.icons8.com/ios-filled/50/999999/user.png' }}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, { color: theme.colors.onSurface }]}
              placeholder="Name"
              placeholderTextColor={theme.colors.onSurfaceVariant}
              value={form.name}
              onChangeText={(t) => setForm({ ...form, name: t })}
            />
          </View>
        )}

        {role === "student" || role === "admin" ? (
          <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline }]}>
            <Image 
              source={{ uri: 'https://img.icons8.com/ios-filled/50/999999/email.png' }}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, { color: theme.colors.onSurface }]}
              placeholder="Email"
              placeholderTextColor={theme.colors.onSurfaceVariant}
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={(t) => setForm({ ...form, email: t })}
            />
          </View>
        ) : (
          <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline }]}>
            <Image 
              source={{ uri: 'https://img.icons8.com/ios-filled/50/999999/phone.png' }}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, { color: theme.colors.onSurface }]}
              placeholder="Phone"
              placeholderTextColor={theme.colors.onSurfaceVariant}
              keyboardType="phone-pad"
              value={form.phone}
              onChangeText={(t) => setForm({ ...form, phone: t })}
            />
          </View>
        )}

        <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline }]}>
          <Image 
            source={{ uri: 'https://img.icons8.com/ios-filled/50/999999/password.png' }}
            style={styles.inputIcon}
          />
          <TextInput
            style={[styles.input, { color: theme.colors.onSurface }]}
            placeholder="Password"
            placeholderTextColor={theme.colors.onSurfaceVariant}
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
      </ScrollView>
    </View>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    margin: 0,
  },
  themeButton: {
    margin: 0,
  },
  scrollView: { flex: 1 },
  formContainer: { flexGrow: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  subtitle: { fontSize: 16, marginBottom: 30, textAlign: "center" },
  toggleContainer: { flexDirection: "row", marginBottom: 25, justifyContent: "center" },
  toggleContainerAdminStudentDriverContainer: { flexDirection: "row", marginBottom: 25, justifyContent: "center" },
  toggleButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 5,
  },
  activeToggle: { backgroundColor: PRIMARY_COLOR },
  toggleText: { color: PRIMARY_COLOR, fontWeight: "600" },
  activeToggleText: { color: "#fff", fontWeight: "bold" },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  inputIcon: { width: 20, height: 20, marginRight: 10, opacity: 0.5 },
  input: { flex: 1, padding: 12, fontSize: 16 },
  submitButton: {
    backgroundColor: PRIMARY_COLOR,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  disabledButton: { opacity: 0.5 },
  submitButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  switchModeButton: { alignItems: "center" },
  switchModeText: { color: PRIMARY_COLOR, fontSize: 14 },
});
