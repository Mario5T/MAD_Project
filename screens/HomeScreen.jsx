import React, { useContext } from "react";
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

const { width } = Dimensions.get('window'); 

const HomeScreen = ({ navigation }) => {
  const { authState } = useContext(AuthContext);
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  const isLoggedIn = authState.isLoggedIn;
  const userRole = authState.user?.role;
  const userName = authState.user?.name || 'User';

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
          Access all campus services from one convenient dashboard
        </Text>
      </LinearGradient>
      
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
