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
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from '../context/ThemeContext';

const API_URL = "https://madbackend-production-e01c.up.railway.app"
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
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
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
          Authorization: `Bearer ${authState.user?.token}`,
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
          <Text style={styles.headerTitle}>Feedback</Text>
          <IconButton
            icon={isDarkMode ? "weather-sunny" : "weather-night"}
            iconColor="#ffffff"
            size={24}
            onPress={toggleTheme}
            style={styles.themeButton}
          />
        </View>
      </LinearGradient>

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
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },
  feedbackCard: {
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
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
    borderRadius: 12,
  },
  submitButtonContent: {
    paddingVertical: 8,
  },
});
