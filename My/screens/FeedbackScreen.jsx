import React, { useState, useContext } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ScrollView,
  Image
} from "react-native";
import { AuthContext } from "../context/AuthContext";

const API_URL = "http://10.254.201.15:3000";

const StarRating = ({ rating, setRating }) => {
  const renderStars = () => {
    const stars = [];
    const maxRating = 5;
    
    for (let i = 1; i <= maxRating; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => setRating(i.toString())}
          style={styles.starContainer}
        >
          <Image
            source={{ 
              uri: i <= Number(rating) 
                ? 'https://img.icons8.com/color/48/000000/filled-star.png' 
                : 'https://img.icons8.com/color/48/000000/star.png' 
            }}
            style={styles.starImage}
          />
        </TouchableOpacity>
      );
    }
    
    return stars;
  };

  return (
    <View style={styles.ratingContainer}>
      <Text style={styles.ratingLabel}>Your Rating:</Text>
      <View style={styles.starsRow}>
        {renderStars()}
      </View>
    </View>
  );
};

const FeedbackScreen = ({ navigation }) => {
  const { authState } = useContext(AuthContext);
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    if (!authState.isLoggedIn) {
      Alert.alert("Login Required", "Please log in to submit feedback.");
      navigation.navigate("Auth");
      return;
    }

    if (!rating) {
      Alert.alert("Missing Rating", "Please select a rating before submitting.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.user?.uid}`,
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
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Share Your Feedback</Text>
          <Text style={styles.subtitle}>
            Help us improve our services by sharing your experience
          </Text>
        </View>

        <StarRating rating={rating} setRating={setRating} />
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Comments</Text>
          <TextInput
            style={styles.commentInput}
            placeholder="Tell us about your experience..."
            value={comment}
            onChangeText={setComment}
            multiline
            placeholderTextColor="#999"
          />
        </View>
        
        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>Submit Feedback</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default FeedbackScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "#f9f9f9",
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
    alignItems: "center",
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 10,
    color: "#1976D2",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#757575",
    textAlign: "center",
  },
  ratingContainer: {
    marginBottom: 25,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  starsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  starContainer: {
    padding: 5,
  },
  starImage: {
    width: 40,
    height: 40,
  },
  inputContainer: {
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  commentInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    height: 120,
    textAlignVertical: "top",
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  submitButton: {
    backgroundColor: "#1976D2",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
