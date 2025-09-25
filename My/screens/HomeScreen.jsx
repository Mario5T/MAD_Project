import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  ImageBackground,
  Dimensions,
  TextInput
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";

const { width } = Dimensions.get('window');
const PRIMARY_COLOR = "#00CED1"; 

const HomeScreen = ({ navigation }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    const unsubscribe = navigation.addListener("focus", checkAuth);
    return unsubscribe;
  }, [navigation]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header with back button */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton}>
          <Image 
            source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/back.png' }}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Home</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search Section */}
      <View style={styles.searchSection}>
        <Text style={styles.searchTitle}>What do</Text>
        <Text style={styles.searchTitleBold}>You want?</Text>
        
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for services..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.searchIconContainer}>
            <Image 
              source={{ uri: 'https://img.icons8.com/ios-filled/50/00CED1/search.png' }}
              style={styles.searchIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <View style={styles.categoryRow}>
          <TouchableOpacity 
            style={styles.categoryItem}
            onPress={() => navigation.navigate("Food")}
          >
            <View style={styles.categoryIconContainer}>
              <Image 
                source={{ uri: 'https://img.icons8.com/ios-filled/50/00CED1/restaurant.png' }}
                style={styles.categoryIcon}
              />
            </View>
            <Text style={styles.categoryText}>Food Service</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.categoryItem}
            onPress={() => navigation.navigate("Bus")}
          >
            <View style={styles.categoryIconContainer}>
              <Image 
                source={{ uri: 'https://img.icons8.com/ios-filled/50/00CED1/bus.png' }}
                style={styles.categoryIcon}
              />
            </View>
            <Text style={styles.categoryText}>Booking Ride</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.categoryRow}>
          <TouchableOpacity 
            style={styles.categoryItem}
            onPress={() => {
              if (isLoggedIn) {
                navigation.navigate("Feedback");
              } else {
                navigation.navigate("Auth");
              }
            }}
          >
            <View style={styles.categoryIconContainer}>
              <Image 
                source={{ uri: 'https://img.icons8.com/ios-filled/50/00CED1/feedback.png' }}
                style={styles.categoryIcon}
              />
            </View>
            <Text style={styles.categoryText}>Feedback</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.categoryItem}
            onPress={() => {
              if (isLoggedIn) {
                navigation.navigate("Profile");
              } else {
                navigation.navigate("Auth");
              }
            }}
          >
            <View style={styles.categoryIconContainer}>
              <Image 
                source={{ uri: 'https://img.icons8.com/ios-filled/50/00CED1/user.png' }}
                style={styles.categoryIcon}
              />
            </View>
            <Text style={styles.categoryText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavContainer}>
        <TouchableOpacity style={styles.navItem}>
          <Image 
            source={{ uri: 'https://img.icons8.com/ios-filled/50/00CED1/home.png' }}
            style={[styles.navIcon, styles.activeNavIcon]}
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate("Favorites")}
        >
          <Image 
            source={{ uri: 'https://img.icons8.com/ios-filled/50/999999/star.png' }}
            style={styles.navIcon}
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate("Notifications")}
        >
          <Image 
            source={{ uri: 'https://img.icons8.com/ios-filled/50/999999/notification.png' }}
            style={styles.navIcon}
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => {
            if (isLoggedIn) {
              navigation.navigate("Profile");
            } else {
              navigation.navigate("Auth");
            }
          }}
        >
          <Image 
            source={{ uri: 'https://img.icons8.com/ios-filled/50/999999/user.png' }}
            style={styles.navIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#fff',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 20,
    height: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  placeholder: {
    width: 40,
  },
  searchSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  searchTitle: {
    fontSize: 22,
    color: '#333',
    marginBottom: 5,
  },
  searchTitleBold: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  searchIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    width: 20,
    height: 20,
  },
  categoriesContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  categoryItem: {
    width: width * 0.43,
    height: width * 0.35,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 206, 209, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryIcon: {
    width: 30,
    height: 30,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  bottomNavContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 40,
  },
  navIcon: {
    width: 24,
    height: 24,
  },
  activeNavIcon: {
    tintColor: PRIMARY_COLOR,
  },
});

export default HomeScreen;
