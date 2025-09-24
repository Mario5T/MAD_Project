import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker"; 
import { AuthContext } from "../context/AuthContext";

const API_URL = "http://localhost:3000"; // ⚠️ Use 10.0.2.2 for Android Emulator instead of localhost

const AuthScreen = ({ navigation }) => {
  const { setAuth } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "student",
  });

  const handleSubmit = async () => {
    if (!form.email || !form.password || (!isLogin && !form.name)) {
      Alert.alert("Validation Error", "Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      const endpoint = isLogin ? "/auth/login" : "/auth/signup";
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong");

      if (isLogin) {
        setAuth({ isLoggedIn: true, token: data.token, role: data.role });
        navigation.goBack();
      } else {
        Alert.alert("Signup Successful", "You can now log in.");
        setIsLogin(true);
        setForm({ name: "", email: "", phone: "", password: "", role: "student" });
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
        keyboardType="email-address"
        autoCapitalize="none"
        value={form.email}
        onChangeText={(t) => setForm({ ...form, email: t })}
      />

      {!isLogin && (
        <TextInput
          style={styles.input}
          placeholder="Phone (for drivers)"
          keyboardType="phone-pad"
          value={form.phone}
          onChangeText={(t) => setForm({ ...form, phone: t })}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={form.password}
        onChangeText={(t) => setForm({ ...form, password: t })}
      />

      {!isLogin && (
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Select Role:</Text>
          <Picker
            selectedValue={form.role}
            onValueChange={(value) => setForm({ ...form, role: value })}
            style={styles.picker}
          >
            <Picker.Item label="Student" value="student" />
            <Picker.Item label="Driver" value="driver" />
          </Picker>
        </View>
      )}

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
  pickerContainer: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  label: { padding: 8, fontWeight: "600" },
  picker: { height: 50, width: "100%" },
});
