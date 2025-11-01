import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Platform,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Appbar, useTheme, IconButton } from 'react-native-paper';

const API_URL = "https://mad-backend-5ijo.onrender.com"

const UploadScreen = ({ navigation }) => {
  const { authState } = useContext(AuthContext);
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  if (authState.user?.role !== "admin") {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Access denied. Admin only.</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        
        const fileData = {
          name: selectedAsset.name,
          size: selectedAsset.size,
          uri: selectedAsset.uri,
          mimeType: selectedAsset.mimeType,
          type: "success"
        };
        
        setSelectedFile(fileData);
        Alert.alert("File Selected", `Selected: ${selectedAsset.name}`);
      } else if (result.canceled) {
      } else {
        Alert.alert("Error", "File picker failed to select file");
      }
    } catch (error) {
      Alert.alert("Error", "File picker error: " + error.message);
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) {
      Alert.alert("Error", "Please select a file first");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      
      formData.append("menuFile", {
        uri: selectedFile.uri,
        name: selectedFile.name,
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const response = await fetch(`${API_URL}/api/menu/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authState.user?.token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      Alert.alert("Success", "Menu uploaded successfully!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);

    } catch (error) {
      Alert.alert("Upload Failed", error.message);
    } finally {
      setLoading(false);
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
          <Text style={styles.headerTitle}>Upload Menu</Text>
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
        <View style={styles.mainCard}>
          <View style={styles.instructionsSection}>
            <Text style={styles.instructionsTitle}>
              📋 Upload Weekly Menu
            </Text>
            <Text style={styles.instructionsText}>
              Select an Excel file (.xlsx) containing the weekly food menu with days, dates, and meal categories.
            </Text>
          </View>

          <TouchableOpacity
                onPress={pickDocument}
                disabled={loading}
                style={[
                  styles.fileSelectionCard,
                  selectedFile ? styles.fileSelectedCard : styles.fileUnselectedCard
                ]}
              >
                <Text style={styles.fileIcon}>
                  {selectedFile ? '📄' : '📁'}
                </Text>
                <Text style={[
                  styles.fileSelectionTitle,
                  selectedFile ? styles.fileSelectedTitle : styles.fileUnselectedTitle
                ]}>
                  {selectedFile ? 'File Selected!' : 'Select Excel File'}
                </Text>
                <Text style={styles.fileSelectionSubtitle}>
                  {selectedFile ? 'Tap to change file' : 'Tap to browse files'}
                </Text>
              </TouchableOpacity>

              {selectedFile && (
                <View style={styles.fileInfoCard}>
                  <Text style={styles.fileInfoTitle}>
                    📎 {selectedFile.name}
                  </Text>
                  <Text style={styles.fileInfoSize}>
                    Size: {Math.round(selectedFile.size / 1024)} KB
                  </Text>
                </View>
              )}

          <TouchableOpacity
            onPress={uploadFile}
            disabled={loading || !selectedFile}
            style={[
              styles.uploadButton,
              (loading || !selectedFile) && styles.uploadButtonDisabled
            ]}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="white" size="small" />
                <Text style={styles.loadingText}>Uploading...</Text>
              </View>
            ) : (
              <Text style={styles.uploadButtonText}>
                🚀 Upload Menu
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.formatGuideCard}>
          <View style={styles.formatGuideHeader}>
            <Text style={styles.formatGuideTitle}>
              📊 Expected Excel Format
            </Text>
          </View>
          <View style={styles.formatGuideContent}>
            <View style={styles.formatGuideItem}>
              <Text style={styles.formatGuideBullet}>•</Text>
              <Text style={styles.formatGuideText}>
                <Text style={styles.formatGuideBold}>Row 1:</Text> Days of the week (Monday, Tuesday, etc.)
              </Text>
            </View>
            <View style={styles.formatGuideItem}>
              <Text style={styles.formatGuideBullet}>•</Text>
              <Text style={styles.formatGuideText}>
                <Text style={styles.formatGuideBold}>Row 2:</Text> Dates for each day
              </Text>
            </View>
            <View style={styles.formatGuideItem}>
              <Text style={styles.formatGuideBullet}>•</Text>
              <Text style={styles.formatGuideText}>
                <Text style={styles.formatGuideBold}>Row 3+:</Text> Meal categories and food items
              </Text>
            </View>
          </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    fontSize: 18,
    color: '#e74c3c',
    marginBottom: 20,
    fontWeight: '600',
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#3498db',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  mainCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  instructionsSection: {
    marginBottom: 24,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
  },
  fileSelectionCard: {
    borderWidth: 2,
    borderStyle: 'dashed',
    marginBottom: 16,
    padding: 24,
    alignItems: 'center',
    borderRadius: 12,
  },
  fileUnselectedCard: {
    borderColor: '#d1d5db',
    backgroundColor: '#f9fafb',
  },
  fileSelectedCard: {
    borderColor: '#86efac',
    backgroundColor: '#f0fdf4',
  },
  fileIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  fileSelectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  fileUnselectedTitle: {
    color: '#374151',
  },
  fileSelectedTitle: {
    color: '#15803d',
  },
  fileSelectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  fileInfoCard: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  fileInfoTitle: {
    color: '#1e40af',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  fileInfoSize: {
    color: '#2563eb',
    fontSize: 14,
  },
  uploadButton: {
    padding: 16,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#f97316',
  },
  uploadButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 12,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  formatGuideCard: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  formatGuideHeader: {
    marginBottom: 16,
  },
  formatGuideTitle: {
    color: '#1e40af',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  formatGuideContent: {
    gap: 8,
  },
  formatGuideItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  formatGuideBullet: {
    color: '#2563eb',
    marginRight: 8,
    fontSize: 16,
  },
  formatGuideText: {
    color: '#1e40af',
    flex: 1,
    fontSize: 14,
  },
  formatGuideBold: {
    fontWeight: '600',
  },
});

export default UploadScreen;
