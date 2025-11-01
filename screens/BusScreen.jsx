import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet, FlatList, Linking, Alert, ScrollView, ActivityIndicator, Platform } from "react-native";
import {
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  Surface,
  Text,
  IconButton,
  useTheme,
  Divider,
  Banner,
  Appbar
} from "react-native-paper";
import { LinearGradient } from 'expo-linear-gradient';
import { PlatformMapView, PlatformMarker } from "../components/PlatformMapView";
import { requestLocationPermission, getCurrentPosition, watchPosition } from "../utils/locationUtils";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from '../context/ThemeContext';

const BusScreen = ({ navigation }) => {
  const { authState } = useContext(AuthContext);
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const isDriver = authState?.user?.role === 'driver';
  
  const schedule = [
    { id: "1", time: "8:30 AM", route: "Campus → Lohegaon" },
    { id: "2", time: "01:30 PM", route: "Lohegaon → Campus" },
    { id: "3", time: "5:30 PM", route: "Campus → Lohegaon" },
  ];

  const [driverLocation, setDriverLocation] = useState({
    latitude: 18.5793,
    longitude: 73.9089,
  });
  const [locationPermission, setLocationPermission] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [locationSubscription, setLocationSubscription] = useState(null);
  const [registeredDrivers, setRegisteredDrivers] = useState([]);
  const [driversLoading, setDriversLoading] = useState(true);
  const [driversError, setDriversError] = useState(null);

  // Request location permissions and start tracking (only for drivers)
  useEffect(() => {
    if (isDriver) {
      requestLocationPermissionHandler();
    } else {
      setLocationError('Location tracking is only available for drivers');
    }
    
    // Cleanup on unmount
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [isDriver, locationSubscription]);

  // Fetch registered drivers on component mount
  useEffect(() => {
    fetchRegisteredDrivers();
  }, []);

  const requestLocationPermissionHandler = async () => {
    try {
      const { status } = await requestLocationPermission();
      
      if (status !== 'granted') {
        setLocationError('Location permission denied');
        Alert.alert(
          'Permission Required',
          'Location permission is required to show driver location on the map.',
          [{ text: 'OK' }]
        );
        return;
      }

      setLocationPermission(true);
      startLocationTracking();
    } catch (error) {
      setLocationError('Failed to request location permission');
      console.error('Location permission error:', error);
    }
  };

  const startLocationTracking = async () => {
    try {
      setIsTracking(true);
      
      // Get initial location
      const location = await getCurrentPosition();
      
      setDriverLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      // Start watching position changes
      const subscription = await watchPosition((location) => {
        setDriverLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      });

      // Store subscription for cleanup
      setLocationSubscription(subscription);
    } catch (error) {
      setLocationError('Failed to get location');
      setIsTracking(false);
      console.error('Location tracking error:', error);
      
      Alert.alert(
        'Location Error',
        'Unable to get current location. Please check your location settings.',
        [{ text: 'OK' }]
      );
    }
  };

  // Fetch registered drivers from backend
  const fetchRegisteredDrivers = async () => {
    try {
      setDriversLoading(true);
      setDriversError(null);
      
      const response = await fetch("https://mad-backend-5ijo.onrender.com/api/shuttle/", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRegisteredDrivers(data || []);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      setDriversError('Failed to load drivers');
      // Fallback to empty array or show error message
      setRegisteredDrivers([]);
    } finally {
      setDriversLoading(false);
    }
  };

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
          <Text style={styles.headerTitle}>Campus Shuttle</Text>
          <IconButton
            icon={isDarkMode ? "weather-sunny" : "weather-night"}
            iconColor="#ffffff"
            size={24}
            onPress={toggleTheme}
            style={styles.themeButton}
          />
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      {/* Schedule Card */}
      <Card style={styles.scheduleCard} elevation={3}>
        <Card.Title 
          title="Today's Schedule" 
          left={(props) => <IconButton {...props} icon="clock-outline" />}
        />
        <Card.Content>
          {schedule.map((item, index) => (
            <View key={item.id}>
              <View style={styles.scheduleRow}>
                <Chip 
                  mode="outlined" 
                  style={styles.timeChip}
                  textStyle={styles.timeText}
                >
                  {item.time}
                </Chip>
                <Text style={styles.routeText}>{item.route}</Text>
              </View>
              {index < schedule.length - 1 && <Divider style={styles.divider} />}
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Location Status Banner */}
      {!isDriver && (
        <Banner
          visible={true}
          actions={[]}
          icon="information-outline"
          style={styles.banner}
        >
          You are viewing the driver's location. Only drivers can share their live location.
        </Banner>
      )}

      {/* Location Card */}
      <Card style={styles.locationCard} elevation={3}>
        <Card.Title 
          title={isDriver ? 'Your Location (Driver)' : 'Driver Location'}
          subtitle={
            isDriver 
              ? (isTracking ? 'Live tracking active' : locationError || 'Location unavailable')
              : 'View only mode'
          }
          left={(props) => (
            <IconButton 
              {...props} 
              icon={isDriver ? "account-circle" : "map-marker"} 
              iconColor={isTracking ? theme.colors.primary : theme.colors.error}
            />
          )}
          right={(props) => (
            <Chip 
              mode="flat" 
              style={[
                styles.statusChip, 
                { backgroundColor: isTracking ? theme.colors.primaryContainer : theme.colors.errorContainer }
              ]}
              textStyle={{ color: isTracking ? theme.colors.onPrimaryContainer : theme.colors.onErrorContainer }}
            >
              {isTracking ? 'LIVE' : 'OFFLINE'}
            </Chip>
          )}
        />
        <Card.Content>
          <Surface style={styles.mapContainer} elevation={1}>
            <PlatformMapView
              style={styles.map}
              region={{
                latitude: driverLocation.latitude,
                longitude: driverLocation.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              showsUserLocation={isDriver && locationPermission}
              showsMyLocationButton={isDriver && locationPermission}
              followsUserLocation={isDriver && isTracking}
            >
              <PlatformMarker 
                coordinate={driverLocation} 
                title={isDriver ? "Your Location" : "Driver Location"}
                description={
                  isDriver 
                    ? (isTracking ? "Live location" : "Last known location")
                    : "Driver's current location"
                }
                pinColor={isDriver ? "#4CAF50" : theme.colors.primary}
              />
            </PlatformMapView>
          </Surface>
        </Card.Content>
      </Card>

      {/* Registered Drivers Card */}
      <Card style={styles.driversCard} elevation={2}>
        <Card.Title 
          title="Registered Drivers" 
          left={(props) => <IconButton {...props} icon="account-group" />}
          right={(props) => 
            driversLoading ? (
              <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginRight: 16 }} />
            ) : (
              <IconButton 
                {...props} 
                icon="refresh" 
                onPress={fetchRegisteredDrivers}
                size={20}
              />
            )
          }
        />
        <Card.Content>
          {driversLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.loadingText}>Loading drivers...</Text>
            </View>
          ) : driversError ? (
            <View style={styles.errorContainer}>
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {driversError}
              </Text>
              <Button 
                mode="outlined" 
                onPress={fetchRegisteredDrivers}
                style={styles.retryButton}
              >
                Retry
              </Button>
            </View>
          ) : registeredDrivers.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No registered drivers</Text>
            </View>
          ) : (
            registeredDrivers.map((driver, index) => (
              <View key={driver.id || driver._id}>
                <Surface style={styles.driverItem} elevation={1}>
                  <View style={styles.driverInfo}>
                    <View style={styles.driverHeader}>
                      <Text style={styles.driverName}>{driver.name || driver.fullName}</Text>
                      <Chip 
                        mode="flat" 
                        style={[
                          styles.driverStatusChip, 
                          { backgroundColor: driver.status === 'active' ? theme.colors.primaryContainer : theme.colors.surfaceVariant }
                        ]}
                        textStyle={{ 
                          color: driver.status === 'active' ? theme.colors.onPrimaryContainer : theme.colors.onSurfaceVariant,
                          fontSize: 10
                        }}
                      >
                        {(driver.status || 'offline').toUpperCase()}
                      </Chip>
                    </View>
                    <Text style={styles.driverRoute}>{driver.route || 'Campus ↔ Lohegaon'}</Text>
                    <View style={styles.phoneContainer}>
                      <IconButton 
                        icon="phone" 
                        size={16} 
                        onPress={() => Linking.openURL(`tel:${driver.phone || driver.phoneNumber}`)}
                        style={styles.phoneIcon}
                      />
                      <Text 
                        style={[styles.phoneNumber, { color: theme.colors.primary }]}
                        onPress={() => Linking.openURL(`tel:${driver.phone || driver.phoneNumber}`)}
                      >
                        {driver.phone || driver.phoneNumber || 'No phone number'}
                      </Text>
                    </View>
                  </View>
                </Surface>
                {index < registeredDrivers.length - 1 && <Divider style={styles.driverDivider} />}
              </View>
            ))
          )}
        </Card.Content>
      </Card>
      </ScrollView>
    </View>
  );
};

export default BusScreen;

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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  scheduleCard: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  timeChip: {
    marginRight: 12,
    minWidth: 80,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  routeText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    marginVertical: 8,
  },
  banner: {
    marginBottom: 20,
    borderRadius: 12,
  },
  locationCard: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  statusChip: {
    marginRight: 8,
  },
  mapContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  map: {
    height: 250,
    width: '100%',
  },
  driversCard: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  driverItem: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
  },
  driverInfo: {
    flex: 1,
  },
  driverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  driverStatusChip: {
    height: 24,
  },
  driverRoute: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 8,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneIcon: {
    margin: 0,
    marginRight: 4,
  },
  phoneNumber: {
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  driverDivider: {
    marginVertical: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    opacity: 0.7,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    marginTop: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
});
