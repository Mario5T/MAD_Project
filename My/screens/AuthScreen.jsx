import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { AuthContext } from "../context/authContext";

const API_URL = "http://localhost:3000"; 

const AuthScreen = ({ navigation }) => {
  const { setAuth } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", role: "student" });

  const handleSubmit = async () => {
    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/signup";
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed");

      if (isLogin) {
        setAuth({ isLoggedIn: true, token: data.token, role: data.role });
        navigation.goBack();
      } else {
        Alert.alert("Signup Successful", "You can now log in.");
        setIsLogin(true);
      }
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? "Login" : "Signup"}</Text>

      {!isLogin && (
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={form.name}
          onChangeText={(t) => setForm({ ...form, name: t })}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={form.email}
        onChangeText={(t) => setForm({ ...form, email: t })}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone (for drivers)"
        value={form.phone}
        onChangeText={(t) => setForm({ ...form, phone: t })}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={form.password}
        onChangeText={(t) => setForm({ ...form, password: t })}
      />

      {!isLogin && (
        <TextInput
          style={styles.input}
          placeholder="Role (student/driver)"
          value={form.role}
          onChangeText={(t) => setForm({ ...form, role: t })}
        />
      )}

      <Button title={isLogin ? "Login" : "Signup"} onPress={handleSubmit} />
      <Button
        title={isLogin ? "Need an account? Signup" : "Already have an account? Login"}
        onPress={() => setIsLogin(!isLogin)}
      />
    </View>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", marginBottom: 10, padding: 10, borderRadius: 8 },
});
