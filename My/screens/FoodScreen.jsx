import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
// import menuData from "../data/menu.json"; 

const FoodScreen = () => {
  const days = Object.keys(menuData);
  const [selectedDay, setSelectedDay] = useState(days[0]);

  const meals = menuData[selectedDay].meals;

  return (
    <View style={styles.container}>
      <FlatList
        data={days}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.dayButton,
              selectedDay === item && styles.dayButtonActive,
            ]}
            onPress={() => setSelectedDay(item)}
          >
            <Text
              style={[
                styles.dayText,
                selectedDay === item && styles.dayTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      <Text style={styles.dateText}>{menuData[selectedDay].date}</Text>

      <FlatList
        data={Object.entries(meals)}
        keyExtractor={([category]) => category}
        renderItem={({ item }) => {
          const [category, food] = item;
          return (
            <View style={styles.mealCard}>
              <Text style={styles.mealCategory}>{category}</Text>
              <Text style={styles.mealFood}>{food}</Text>
            </View>
          );
        }}
      />
    </View>
  );
};

export default FoodScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
    paddingHorizontal: 10,
  },
  dayButton: {
    padding: 10,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  dayButtonActive: {
    backgroundColor: "#6c5ce7",
  },
  dayText: {
    fontSize: 16,
    color: "#333",
  },
  dayTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  dateText: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 10,
    textAlign: "center",
    color: "#6c5ce7",
  },
  mealCard: {
    backgroundColor: "#f8f8f8",
    padding: 15,
    marginVertical: 6,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  mealCategory: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2d3436",
  },
  mealFood: {
    fontSize: 14,
    color: "#636e72",
  },
});
