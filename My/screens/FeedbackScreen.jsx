import React from "react";
import { View, Text, StyleSheet } from "react-native";

const FeedbackScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feedback</Text>
      <Text>Coming soon...</Text>
    </View>
  );
};

export default FeedbackScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
