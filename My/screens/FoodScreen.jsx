import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";

const API_URL = "http://10.254.201.15:3000/api/menu";

const FoodScreen = () => {
  const [menuData, setMenuData] = useState(null);
  const [days, setDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenuData();
  }, []);

  const fetchMenuData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/all`);
      const data = await response.json();
      
      if (response.ok) {
        setMenuData(data);
        const dayKeys = Object.keys(data);
        setDays(dayKeys);
        setSelectedDay(dayKeys[0]);
      } else {
        console.error("Failed to fetch menu data:", data.error);
      }
    } catch (error) {
      console.error("Error fetching menu:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6c5ce7" />
        <Text>Loading menu...</Text>
      </View>
    );
  }

  if (!menuData || days.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No menu available</Text>
      </View>
    );
  }

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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
