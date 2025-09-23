import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert 
} from "react-native";

const FeedbackScreen = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (rating === 0 || comment.trim() === "") {
      Alert.alert("Incomplete", "Please provide both rating and feedback.");
      return;
    }

    console.log("Feedback Submitted:", { rating, comment });

    Alert.alert("Thank you!", "Your feedback has been submitted.");
    setRating(0);
    setComment("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Food Feedback</Text>
      <Text style={styles.subtitle}>How was your meal today?</Text>

      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((num) => (
          <TouchableOpacity 
            key={num} 
            onPress={() => setRating(num)}
          >
            <Text style={[styles.star, rating >= num && styles.starSelected]}>
              ★
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Write your feedback here..."
        value={comment}
        onChangeText={setComment}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Feedback</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FeedbackScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#1976D2",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  star: {
    fontSize: 32,
    color: "#ccc",
    marginHorizontal: 5,
  },
  starSelected: {
    color: "#FFD700", 
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    height: 120,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#1976D2",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
