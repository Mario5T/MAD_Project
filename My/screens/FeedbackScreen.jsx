import React, { useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  Platform
} from "react-native";
import {
  Text,
  TextInput,
  Button,
  Card,
  Title,
  IconButton,
  useTheme,
  Surface,
  Appbar
} from 'react-native-paper';
import { AuthContext } from "../context/AuthContext";

const API_URL = "https://mad-backend-5ijo.onrender.com"
const StarRating = ({ rating, setRating, theme }) => {
  const renderStars = () => {
    const stars = [];
    const maxRating = 5;
    
    for (let i = 1; i <= maxRating; i++) {
      stars.push(
        <IconButton
          key={i}
          icon={i <= Number(rating) ? "star" : "star-outline"}
          size={32}
          iconColor={i <= Number(rating) ? theme.colors.primary : theme.colors.onSurfaceVariant}
          onPress={() => setRating(i.toString())}
          style={styles.starButton}
        />
      );
    }
    
    return stars;
  };

  return (
    <View style={styles.ratingContainer}>
      <Text style={[styles.ratingLabel, { color: theme.colors.onSurface }]}>Your Rating:</Text>
      <View style={styles.starsRow}>
        {renderStars()}
      </View>
    </View>
  );
};

const FeedbackScreen = ({ navigation }) => {
  const { authState } = useContext(AuthContext);
  const theme = useTheme();
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
      const response = await fetch(`${API_URL}/api/feedback`, {
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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Feedback" />
      </Appbar.Header>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Card style={styles.feedbackCard}>
            <Card.Content>
              <Title style={[styles.title, { color: theme.colors.primary }]}>Share Your Feedback</Title>
              <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
                Help us improve our services by sharing your experience
              </Text>

              <StarRating rating={rating} setRating={setRating} theme={theme} />

              <TextInput
                mode="outlined"
                label="Comments"
                placeholder="Tell us about your experience..."
                value={comment}
                onChangeText={setComment}
                multiline
                numberOfLines={4}
                style={styles.commentInput}
              />

              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.submitButton}
                contentStyle={styles.submitButtonContent}
              >
                Submit Feedback
              </Button>
            </Card.Content>
          </Card>
        </ScrollView>
    </View>
  );
};

export default FeedbackScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  feedbackCard: {
    marginTop: 20,
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  ratingContainer: {
    marginBottom: 25,
    alignItems: "center",
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  starsRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  starButton: {
    margin: 0,
  },
  commentInput: {
    marginBottom: 20,
  },
  submitButton: {
    marginTop: 10,
  },
  submitButtonContent: {
    paddingVertical: 8,
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
