import React, { useState, useEffect, useContext } from "react";
import { View, FlatList, StyleSheet, Platform, ScrollView } from "react-native";
import {
  Text,
  Card,
  Title,
  Chip,
  ActivityIndicator,
  useTheme,
  Surface,
  Appbar,
  IconButton
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemeContext } from '../context/ThemeContext';

const API_URL = "https://madbackend-production-e01c.up.railway.app"
const FoodScreen = ({ navigation }) => {
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
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
          <Text style={styles.headerTitle}>Food Menu</Text>
          <IconButton
            icon={isDarkMode ? "weather-sunny" : "weather-night"}
            iconColor="#ffffff"
            size={24}
            onPress={toggleTheme}
            style={styles.themeButton}
          />
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Surface style={styles.daySelector} elevation={2}>
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

        <Card style={styles.dateCard} mode="elevated">
          <Card.Content>
            <Title style={[styles.dateText, { color: theme.colors.primary }]}>
              📅 {menuData[selectedDay].date}
            </Title>
          </Card.Content>
        </Card>

        {Object.entries(meals).map(([category, food]) => (
          <Card key={category} style={styles.mealCard} mode="elevated">
            <Card.Content>
              <Title style={[styles.mealCategory, { color: theme.colors.onSurface }]}>
                {category}
              </Title>
              <Text style={[styles.mealFood, { color: theme.colors.onSurfaceVariant }]}>
                {food}
              </Text>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  daySelector: {
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 16,
  },
  dayChip: {
    marginRight: 8,
  },
  dateCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  dateText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  mealCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
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
