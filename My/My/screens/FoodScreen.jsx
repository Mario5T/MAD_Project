import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Platform } from "react-native";
import {
  Text,
  Card,
  Title,
  Chip,
  ActivityIndicator,
  useTheme,
  Surface,
  Appbar
} from 'react-native-paper';

const API_URL = "https://mad-backend-5ijo.onrender.com"
const FoodScreen = ({ navigation }) => {
  const theme = useTheme();
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
      const response = await fetch(`${API_URL}/api/menu/all`);
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
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" animating={true} color={theme.colors.primary} />
        <Text style={{ color: theme.colors.onBackground, marginTop: 16 }}>Loading menu...</Text>
      </View>
    );
  }

  if (!menuData || days.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.onBackground }}>No menu available</Text>
      </View>
    );
  }

  const meals = menuData[selectedDay].meals;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Food Menu" />
      </Appbar.Header>

        <Surface style={styles.daySelector}>
          <FlatList
            data={days}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Chip
                mode={selectedDay === item ? 'flat' : 'outlined'}
                selected={selectedDay === item}
                onPress={() => setSelectedDay(item)}
                style={styles.dayChip}
                textStyle={{ color: selectedDay === item ? theme.colors.onPrimary : theme.colors.onSurface }}
              >
                {item}
              </Chip>
            )}
          />
        </Surface>

        <Title style={[styles.dateText, { color: theme.colors.primary }]}>
          {menuData[selectedDay].date}
        </Title>

        <FlatList
          data={Object.entries(meals)}
          keyExtractor={([category]) => category}
          renderItem={({ item }) => {
            const [category, food] = item;
            return (
              <Card style={styles.mealCard} mode="elevated">
                <Card.Content>
                  <Title style={[styles.mealCategory, { color: theme.colors.onSurface }]}>
                    {category}
                  </Title>
                  <Text style={[styles.mealFood, { color: theme.colors.onSurfaceVariant }]}>
                    {food}
                  </Text>
                </Card.Content>
              </Card>
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
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  daySelector: {
    paddingVertical: 16,
    paddingHorizontal: 10,
    elevation: 2,
  },
  dayChip: {
    marginRight: 8,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 16,
    textAlign: "center",
  },
  mealCard: {
    marginVertical: 6,
    marginHorizontal: 16,
  },
  mealCategory: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  mealFood: {
    fontSize: 14,
  },
});
