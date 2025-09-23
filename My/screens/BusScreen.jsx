import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking } from "react-native";
import MapView, { Marker } from "react-native-maps";

const BusScreen = () => {
  const schedule = [
    { id: "1", time: "8:30 AM", route: "Campus → Lohegaon" },
    { id: "2", time: "01:30 PM", route: "Lohegaon → Campus" },
    { id: "3", time: "5:30 PM", route: "Campus → Lohegaon" },
  ];

  const [busLocation, setBusLocation] = useState({
    latitude: 18.5793,
    longitude: 73.9089,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setBusLocation((prev) => ({
        ...prev,
        longitude: prev.longitude + 0.0001, 
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const driverContact = "tel:+911234567890";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shuttle Timings</Text>

      <FlatList
        data={schedule}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.scheduleItem}>
            <Text style={styles.time}>{item.time}</Text>
            <Text style={styles.route}>{item.route}</Text>
          </View>
        )}
        style={{ marginBottom: 20 }}
      />

      <Text style={styles.subtitle}>Live Bus Location</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: busLocation.latitude,
          longitude: busLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker coordinate={busLocation} title="Shuttle Bus" />
      </MapView>

      <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(driverContact)}>
        <Text style={styles.buttonText}>📞 Contact Driver</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BusScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#1976D2",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 10,
  },
  scheduleItem: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 6,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  time: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1976D2",
  },
  route: {
    fontSize: 14,
    color: "#555",
  },
  map: {
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#1976D2",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
