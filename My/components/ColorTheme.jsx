import { Platform } from 'react-native';

// Semantic color system for consistent theming across web and mobile
export const ColorTokens = {
  // Brand colors
  primary: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#00CED1', // Main brand color
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
  },

  // Neutral grays
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // Status colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
};

// Semantic color mappings for UI components
export const SemanticColors = {
  // Background colors
  background: {
    primary: ColorTokens.gray[50],
    secondary: '#ffffff',
    tertiary: ColorTokens.gray[100],
    elevated: '#ffffff',
  },

  // Text colors
  text: {
    primary: ColorTokens.gray[900],
    secondary: ColorTokens.gray[600],
    muted: ColorTokens.gray[500],
    inverse: '#ffffff',
    disabled: ColorTokens.gray[400],
  },

  // Border colors
  border: {
    primary: ColorTokens.gray[200],
    secondary: ColorTokens.gray[300],
    focus: ColorTokens.primary[500],
    error: ColorTokens.error[500],
  },

  // Interactive colors
  interactive: {
    primary: ColorTokens.primary[500],
    primaryHover: ColorTokens.primary[600],
    primaryPressed: ColorTokens.primary[700],
    secondary: ColorTokens.gray[100],
    secondaryHover: ColorTokens.gray[200],
    secondaryPressed: ColorTokens.gray[300],
  },

  // Status colors for UI elements
  status: {
    success: ColorTokens.success[500],
    successBackground: ColorTokens.success[50],
    warning: ColorTokens.warning[500],
    warningBackground: ColorTokens.warning[50],
    error: ColorTokens.error[500],
    errorBackground: ColorTokens.error[50],
    info: ColorTokens.info[500],
    infoBackground: ColorTokens.info[50],
  },
};

// Generate CSS custom properties (removed web-specific code)
export const generateCSSVariables = () => {
  return {};
};

// Hook for using theme colors in components
export const useThemeColors = () => {
  return {
    // Background colors
    bgPrimary: SemanticColors.background.primary,
    bgSecondary: SemanticColors.background.secondary,
    bgTertiary: SemanticColors.background.tertiary,
    bgElevated: SemanticColors.background.elevated,

    // Text colors
    textPrimary: SemanticColors.text.primary,
    textSecondary: SemanticColors.text.secondary,
    textMuted: SemanticColors.text.muted,
    textInverse: SemanticColors.text.inverse,
    textDisabled: SemanticColors.text.disabled,

    // Border colors
    borderPrimary: SemanticColors.border.primary,
    borderSecondary: SemanticColors.border.secondary,
    borderFocus: SemanticColors.border.focus,
    borderError: SemanticColors.border.error,

    // Interactive colors
    interactivePrimary: SemanticColors.interactive.primary,
    interactivePrimaryHover: SemanticColors.interactive.primaryHover,
    interactivePrimaryPressed: SemanticColors.interactive.primaryPressed,
    interactiveSecondary: SemanticColors.interactive.secondary,
    interactiveSecondaryHover: SemanticColors.interactive.secondaryHover,
    interactiveSecondaryPressed: SemanticColors.interactive.secondaryPressed,

    // Status colors
    success: SemanticColors.status.success,
    successBg: SemanticColors.status.successBackground,
    warning: SemanticColors.status.warning,
    warningBg: SemanticColors.status.warningBackground,
    error: SemanticColors.status.error,
    errorBg: SemanticColors.status.errorBackground,
    info: SemanticColors.status.info,
    infoBg: SemanticColors.status.infoBackground,

    // Brand colors (shortcuts)
    brand: ColorTokens.primary[500],
    brandLight: ColorTokens.primary[100],
    brandDark: ColorTokens.primary[700],
  };
};

// Utility function to get color with opacity
export const withOpacity = (color, opacity) => {
  return color; // For React Native, return as-is
};

// Predefined shadow styles
export const ShadowStyles = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
};

// Interactive styles (web-specific styles removed)
export const InteractiveStyles = {
  button: {},
  card: {},
  input: {},
};
