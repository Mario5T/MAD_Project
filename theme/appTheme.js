// Modern theme configuration based on web-frontend design
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#0056b3',
    primaryLight: '#4285f4',
    primaryDark: '#003b7a',
    secondary: '#ff6b00',
    secondaryLight: '#ff9248',
    secondaryDark: '#c43c00',
    background: '#f8f9fa',
    surface: '#ffffff',
    surfaceVariant: '#f3f4f6',
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onBackground: '#212121',
    onSurface: '#212121',
    onSurfaceVariant: '#5f6368',
    outline: '#e5e7eb',
    success: '#4caf50',
    warning: '#ff9800',
    error: '#ef4444',
    info: '#03a9f4',
  },
  roundness: 12,
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#90caf9',
    primaryLight: '#e3f2fd',
    primaryDark: '#42a5f5',
    secondary: '#f48fb1',
    secondaryLight: '#f8bbd0',
    secondaryDark: '#c2185b',
    background: '#121212',
    surface: '#1e1e1e',
    surfaceVariant: '#2c2c2c',
    onPrimary: '#000000',
    onSecondary: '#000000',
    onBackground: '#ffffff',
    onSurface: '#ffffff',
    onSurfaceVariant: '#b0bec5',
    outline: '#3a3a3a',
    success: '#66bb6a',
    warning: '#ffa726',
    error: '#ef5350',
    info: '#29b6f6',
  },
  roundness: 12,
};

// Gradient colors
export const gradients = {
  primary: ['#0056b3', '#0088ff'],
  secondary: ['#ff6b00', '#ff9248'],
  success: ['#4caf50', '#66bb6a'],
  warning: ['#ff9800', '#ffa726'],
  error: ['#ef4444', '#f87171'],
  info: ['#03a9f4', '#29b6f6'],
  breakfast: ['#ff9800', '#ffb74d'],
  lunch: ['#4caf50', '#66bb6a'],
  dinner: ['#9c27b0', '#ba68c8'],
};

// Shadow styles
export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryTint: {
    shadowColor: '#0056b3',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

export default lightTheme;
