import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>RevTracker</Text>
      <Text style={styles.subtitle}>NST Campus Services</Text>
      
      <ScrollView style={styles.menuContainer}>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('Food')}
        >
          <Text style={styles.menuItemText}>Food Services</Text>
          <Text style={styles.menuItemDescription}>Check canteen menus and food availability</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('Bus')}
        >
          <Text style={styles.menuItemText}>Bus Schedule</Text>
          <Text style={styles.menuItemDescription}>View bus timings and track status</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('Feedback')}
        >
          <Text style={styles.menuItemText}>Feedback</Text>
          <Text style={styles.menuItemDescription}>Share your experience and suggestions</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1976D2',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 40,
  },
  menuContainer: {
    flex: 1,
  },
  menuItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItemText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#757575',
  },
});

export default HomeScreen;