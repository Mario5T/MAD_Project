import React, { useState, useEffect, useContext } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  RefreshControl,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from '../context/ThemeContext';
import { Button, Card, Surface, useTheme, Text, Appbar, IconButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

const API_URL = "https://mad-backend-5ijo.onrender.com"
const ProfileScreen = ({ navigation }) => {
  const { authState, setAuthState } = useContext(AuthContext);
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [userData, setUserData] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchUserProfile();
    fetchUserSessions();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        navigation.replace("Auth");
        return;
      }

      const response = await fetch(`${API_URL}/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data.user);
      } else {
        Alert.alert("Error", "Failed to fetch profile");
      }
    } catch (error) {
      Alert.alert("Error", "Network error");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSessions = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/auth/sessions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions || []);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.multiRemove(["token", "userRole"]);
            setAuthState({ isLoggedIn: false, user: null });
            navigation.replace("Home");
          },
        },
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchUserProfile(), fetchUserSessions()]);
    setRefreshing(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Unable to load profile</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchUserProfile}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
          <Text style={styles.headerTitle}>Profile</Text>
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
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Surface style={[styles.profileSection, { backgroundColor: theme.colors.surface }]} elevation={2}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://img.icons8.com/ios-filled/100/00CED1/user.png' }}
              style={[styles.avatar, { borderColor: theme.colors.primary }]}
            />
          </View>
          <View style={styles.infoContainer}>
            <Text style={[styles.name, { color: theme.colors.onSurface }]}>{userData.name}</Text>
            <Text style={[styles.role, { color: theme.colors.primary }]}>Role: {userData.role}</Text>
            <Text style={[styles.email, { color: theme.colors.onSurfaceVariant }]}>
              {userData.email || userData.phone}
            </Text>
          </View>
        </Surface>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Active Sessions</Text>
          {sessions.length > 0 ? (
            sessions.map((session, index) => (
              <Card key={index} style={styles.sessionItem}>
                <Card.Content>
                  <Text style={[styles.sessionInfo, { color: theme.colors.onSurfaceVariant }]}>
                    Device: {session.device || "Unknown"}
                  </Text>
                  <Text style={[styles.sessionInfo, { color: theme.colors.onSurfaceVariant }]}>
                    Last Active: {formatDate(session.lastActive)}
                  </Text>
                  <Text style={[styles.sessionInfo, { color: theme.colors.onSurfaceVariant }]}>
                    IP: {session.ip || "Unknown"}
                  </Text>
                </Card.Content>
              </Card>
            ))
          ) : (
            <Text style={[styles.noSessions, { color: theme.colors.onSurfaceVariant }]}>No active sessions found</Text>
          )}
        </View>

        <View style={styles.section}>
          <Button
            mode="contained"
            onPress={onRefresh}
            style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
            contentStyle={styles.actionButtonContent}
          >
            Refresh Data
          </Button>

          <Button
            mode="contained"
            onPress={handleLogout}
            style={[styles.logoutButton, { backgroundColor: theme.colors.error }]}
            contentStyle={styles.logoutButtonContent}
          >
            Logout
          </Button>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Account Information</Text>
          <Card>
            <Card.Content>
              <View style={[styles.infoItem, { borderBottomColor: theme.colors.outline }]}>
                <Text style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>Member Since:</Text>
                <Text style={[styles.infoValue, { color: theme.colors.onSurface }]}>
                  {new Date(userData.createdAt).toLocaleDateString()}
                </Text>
              </View>
              <View style={[styles.infoItem, { borderBottomColor: theme.colors.outline }]}>
                <Text style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>User ID:</Text>
                <Text style={[styles.infoValue, { color: theme.colors.onSurface }]}>{userData.id}</Text>
              </View>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
};

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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5", // Use static color for StyleSheet
  },
  profileSection: {
    padding: 20,
    margin: 20,
    marginTop: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#00CED1", // Use static color for StyleSheet
  },
  infoContainer: {
    alignItems: "center",
  },
  sessionItem: {
    marginBottom: 12,
    borderRadius: 12,
  },
  sessionInfo: {
    color: "#666", // Use static color for StyleSheet
    marginBottom: 4,
  },
  noSessions: {
    color: "#999", // Use static color for StyleSheet
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 24,
  },
  actionButton: {
    marginBottom: 12,
    borderRadius: 12,
  },
  actionButtonContent: {
    paddingVertical: 8,
  },
  logoutButton: {
    borderRadius: 12,
  },
  logoutButtonContent: {
    paddingVertical: 8,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee", // Use static color for StyleSheet
  },
  infoLabel: {
    color: "#666", // Use static color for StyleSheet
    fontWeight: "500",
  },
  infoValue: {
    color: "#333", // Use static color for StyleSheet
    fontWeight: "600",
  },
  retryButton: {
    backgroundColor: "#00CED1", // Use static color for StyleSheet
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    padding: 20,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#e74c3c",
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },
  role: {
    fontSize: 16,
    marginBottom: 4,
    textTransform: "capitalize",
    color: "#00CED1",
  },
  email: {
    fontSize: 14,
    color: "#666",
  },
});

export default ProfileScreen;
