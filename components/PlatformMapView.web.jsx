import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
export const PlatformMapView = ({ children, style, ...props }) => (
  <View style={[styles.mapPlaceholder, style]}>
    <Text style={styles.placeholderText}>Map View (Web)</Text>
    {children}
  </View>
);

export const PlatformMarker = ({ coordinate, title, description }) => (
  <View style={styles.marker}>
    <Text style={styles.markerText}>📍 {title || 'Location'}</Text>
  </View>
);

const styles = StyleSheet.create({
  mapPlaceholder: {
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
  },
  marker: {
    padding: 8,
  },
  markerText: {
    fontSize: 14,
  },
});

export default PlatformMapView;
