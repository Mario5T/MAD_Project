import React from "react";
import { View, Text, StyleSheet } from "react-native";

const BusScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shuttle Timings</Text>
      <Text>Coming soon...</Text>
    </View>
  );
};

export default BusScreen;

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
