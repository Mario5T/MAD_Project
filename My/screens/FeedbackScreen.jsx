import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { AuthContext } from "../context/AuthContext";

const API_URL = "http://192.168.128.139:3000";

const FeedbackScreen = ({ navigation }) => {
  const { authState } = useContext(AuthContext);
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    if (!auth.isLoggedIn) {
      Alert.alert("Login Required", "Please log in to submit feedback.");
      navigation.navigate("Auth");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ rating: Number(rating), comment }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to submit");

      Alert.alert("Success", "Feedback submitted!");
      setRating("");
      setComment("");
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feedback</Text>
      <TextInput
        style={styles.input}
        placeholder="Rating (1-5)"
        value={rating}
        onChangeText={setRating}
        keyboardType="numeric"
      />
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Comment"
        value={comment}
        onChangeText={setComment}
        multiline
      />
      <Button title="Submit Feedback" onPress={handleSubmit} />
    </View>
  );
};

export default FeedbackScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", marginBottom: 10, padding: 10, borderRadius: 8 },
});
