import * as Location from 'expo-location';

export const requestLocationPermission = async () => {
  return await Location.requestForegroundPermissionsAsync();
};

export const getCurrentPosition = async () => {
  return await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });
};

export const watchPosition = async (callback) => {
  return await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      timeInterval: 5000,
      distanceInterval: 10,
    },
    callback
  );
};
