import React, { useContext, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  Card,
  useTheme,
  Surface,
  IconButton,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CountdownTimer from '../components/shared/CountdownTimer';

const { width } = Dimensions.get('window');

const API_URL = "https://madbackend-production-e01c.up.railway.app";

const HomeScreen = ({ navigation }) => {
  const { authState } = useContext(AuthContext);
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  const isLoggedIn = authState.isLoggedIn;
  const userRole = authState.user?.role;
  const userName = authState.user?.name || 'User';

  const [nextMeal, setNextMeal] = useState(null);
  const [greeting, setGreeting] = useState('');

  // Get time-based greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  // Fetch next meal
  useEffect(() => {
    const fetchNextMeal = async () => {
      try {
        const response = await fetch(`${API_URL}/api/menu/all`);
        const data = await response.json();

        if (response.ok) {
          // Find today's meals
          const days = Object.keys(data);
          const today = days[0]; // Assuming first day is today
          const meals = data[today]?.meals;

          if (meals) {
            const now = new Date();
            const hour = now.getHours();

            // Determine next meal based on time
            let mealType = 'Lunch';
            let mealTime = new Date();

            if (hour < 9) {
              mealType = 'Breakfast';
              mealTime.setHours(8, 0, 0);
            } else if (hour < 13) {
              mealType = 'Lunch';
              mealTime.setHours(13, 0, 0);
            } else if (hour < 16) {
              mealType = 'Snacks';
              mealTime.setHours(16, 30, 0);
            } else if (hour < 20) {
              mealType = 'Dinner';
              mealTime.setHours(20, 0, 0);
            } else {
              // After dinner, show tomorrow's breakfast
              mealType = 'Breakfast';
              mealTime.setDate(mealTime.getDate() + 1);
              mealTime.setHours(8, 0, 0);
            }

            setNextMeal({
              type: mealType,
              items: meals[mealType] || 'Menu not available',
              time: mealTime,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching next meal:', error);
      }
    };

    fetchNextMeal();
  }, []);

  const cards = [
    {
      title: 'Menu',
      description: 'View and order from the cafeteria menu',
      icon: 'silverware-fork-knife',
      path: 'Food',
      colors: ['#ff6b00', '#ff9248'],
      iconBg: 'rgba(255, 107, 0, 0.1)',
    },
    {
      title: 'Shuttle',
      description: 'Track shuttle locations in real-time',
      icon: 'bus',
      path: 'Bus',
      colors: ['#0056b3', '#0088ff'],
      iconBg: 'rgba(0, 86, 179, 0.1)',
    },
    {
      title: 'Feedback',
      description: 'Share your thoughts and suggestions',
      icon: 'message-reply-text',
      path: 'Feedback',
      colors: ['#2e7d32', '#4caf50'],
      iconBg: 'rgba(76, 175, 80, 0.1)',
      requiresAuth: true,
    },
    {
      title: 'Profile',
      description: 'Manage your account settings',
      icon: 'account',
      path: 'Profile',
      colors: ['#7b1fa2', '#9c27b0'],
      iconBg: 'rgba(156, 39, 176, 0.1)',
      requiresAuth: true,
    },
  ];

  if (userRole === 'admin') {
    cards.splice(2, 0, {
      title: 'Upload',
      description: 'Upload menu files',
      icon: 'upload',
      path: 'Upload',
      colors: ['#d84315', '#ff6f00'],
      iconBg: 'rgba(255, 111, 0, 0.1)',
    });
  }

  const handleCardPress = (card) => {
    if (card.requiresAuth && !isLoggedIn) {
      navigation.navigate('Auth');
    } else {
      navigation.navigate(card.path);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      {/* Header */}
      <LinearGradient
        colors={isDarkMode ? ['#1e3a5f', '#2c5282'] : ['#0056b3', '#0088ff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.welcomeText}>
              {greeting}{isLoggedIn ? `, ${userName}` : ''}! ☀️
            </Text>
            <Text style={styles.userName}>RevRacker</Text>
          </View>
          <View style={styles.headerActions}>
            <IconButton
              icon={isDarkMode ? "weather-sunny" : "weather-night"}
              iconColor="#ffffff"
              size={24}
              onPress={toggleTheme}
              style={styles.themeButton}
            />
            {isLoggedIn && (
              <TouchableOpacity
                style={styles.profileButton}
                onPress={() => navigation.navigate('Profile')}
              >
                <Icon name="account-circle" size={40} color="#ffffff" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <Text style={styles.subtitle}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </Text>
      </LinearGradient>

      {/* What's Next Section */}
      {nextMeal && (
        <View style={styles.whatsNextSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
            📍 What's Next
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Food')}
          >
            <Card style={[styles.whatsNextCard, { backgroundColor: theme.colors.surface }]} mode="elevated" elevation={3}>
              <LinearGradient
                colors={
                  nextMeal.type === 'Breakfast' ? ['#ff9800', '#ffb74d'] :
                    nextMeal.type === 'Lunch' ? ['#4caf50', '#66bb6a'] :
                      nextMeal.type === 'Snacks' ? ['#ff6b00', '#ff9248'] :
                        ['#9c27b0', '#ba68c8']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.cardAccent}
              />

              <Card.Content style={styles.whatsNextContent}>
                <View style={styles.mealHeader}>
                  <View style={styles.mealInfo}>
                    <Text style={[styles.mealIcon, { fontSize: 32 }]}>
                      {nextMeal.type === 'Breakfast' ? '☀️' :
                        nextMeal.type === 'Lunch' ? '🍛' :
                          nextMeal.type === 'Snacks' ? '🍪' : '🌙'}
                    </Text>
                    <View>
                      <Text style={[styles.mealType, { color: theme.colors.onSurface }]}>
                        {nextMeal.type}
                      </Text>
                      <CountdownTimer
                        targetTime={nextMeal.time}
                        compact={true}
                      />
                    </View>
                  </View>
                  <Icon name="arrow-right" size={24} color={theme.colors.primary} />
                </View>

                <View style={[styles.mealItemsContainer, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}>
                  <Text style={[styles.mealItems, { color: theme.colors.onSurfaceVariant }]} numberOfLines={2}>
                    {nextMeal.items}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        </View>
      )}

      {/* Cards Grid */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.cardsContainer}
        showsVerticalScrollIndicator={false}
      >
        {cards.map((card, index) => (
          <TouchableOpacity
            key={card.title}
            activeOpacity={0.7}
            onPress={() => handleCardPress(card)}
            style={styles.cardWrapper}
          >
            <Card style={[styles.card, { backgroundColor: theme.colors.surface }]} mode="elevated">
              {/* Top accent line */}
              <LinearGradient
                colors={card.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.cardAccent}
              />

              <Card.Content style={styles.cardContent}>
                {/* Icon Container */}
                <View style={[styles.iconContainer, { backgroundColor: card.iconBg }]}>
                  <Icon name={card.icon} size={40} color={card.colors[0]} />
                </View>

                {/* Card Text */}
                <Text style={[styles.cardTitle, { color: theme.colors.onSurface }]}>{card.title}</Text>
                <Text style={[styles.cardDescription, { color: theme.colors.onSurfaceVariant }]}>{card.description}</Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <Surface style={[styles.bottomNav, { backgroundColor: theme.colors.surface }]} elevation={4}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Icon name="home" size={24} color={theme.colors.primary} />
          <Text style={[styles.navText, { color: theme.colors.primary }]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Food')}>
          <Icon name="silverware-fork-knife" size={24} color={theme.colors.onSurfaceVariant} />
          <Text style={[styles.navText, { color: theme.colors.onSurfaceVariant }]}>Menu</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Bus')}>
          <Icon name="bus" size={24} color={theme.colors.onSurfaceVariant} />
          <Text style={[styles.navText, { color: theme.colors.onSurfaceVariant }]}>Shuttle</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => isLoggedIn ? navigation.navigate('Profile') : navigation.navigate('Auth')}
        >
          <Icon name="account" size={24} color={theme.colors.onSurfaceVariant} />
          <Text style={[styles.navText, { color: theme.colors.onSurfaceVariant }]}>Profile</Text>
        </TouchableOpacity>
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  userName: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: '700',
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  themeButton: {
    margin: 0,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
    maxWidth: '90%',
  },
  whatsNextSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  whatsNextCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  whatsNextContent: {
    padding: 16,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mealIcon: {
    fontSize: 28,
  },
  mealType: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  mealItemsContainer: {
    padding: 12,
    borderRadius: 8,
  },
  mealItems: {
    fontSize: 14,
    lineHeight: 20,
  },
  scrollView: {
    flex: 1,
  },
  cardsContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  cardWrapper: {
    marginBottom: 20,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardAccent: {
    height: 4,
    width: '100%',
  },
  cardContent: {
    padding: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingBottom: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});

export default HomeScreen;
