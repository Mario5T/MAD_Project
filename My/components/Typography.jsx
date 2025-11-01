import React from 'react';
import { Text, StyleSheet, Platform, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';

const { width: screenWidth } = Dimensions.get('window');

// Typography variants for consistent styling
export const TypographyVariants = {
  // Display and Headings
  display: {
    fontSize: screenWidth < 640 ? 48 : screenWidth < 1024 ? 56 : 64,
    fontWeight: '800',
    lineHeight: screenWidth < 640 ? 52 : screenWidth < 1024 ? 60 : 68,
    letterSpacing: -0.025,
  },

  h1: {
    fontSize: screenWidth < 640 ? 32 : screenWidth < 1024 ? 40 : 48,
    fontWeight: '700',
    lineHeight: screenWidth < 640 ? 36 : screenWidth < 1024 ? 44 : 52,
    letterSpacing: -0.025,
  },

  h2: {
    fontSize: screenWidth < 640 ? 28 : screenWidth < 1024 ? 32 : 36,
    fontWeight: '600',
    lineHeight: screenWidth < 640 ? 32 : screenWidth < 1024 ? 36 : 40,
    letterSpacing: -0.025,
  },

  h3: {
    fontSize: screenWidth < 640 ? 24 : screenWidth < 1024 ? 28 : 32,
    fontWeight: '600',
    lineHeight: screenWidth < 640 ? 28 : screenWidth < 1024 ? 32 : 36,
  },

  h4: {
    fontSize: screenWidth < 640 ? 20 : screenWidth < 1024 ? 24 : 26,
    fontWeight: '600',
    lineHeight: screenWidth < 640 ? 24 : screenWidth < 1024 ? 28 : 30,
  },

  h5: {
    fontSize: screenWidth < 640 ? 18 : screenWidth < 1024 ? 20 : 22,
    fontWeight: '600',
    lineHeight: screenWidth < 640 ? 22 : screenWidth < 1024 ? 24 : 26,
  },

  h6: {
    fontSize: screenWidth < 640 ? 16 : screenWidth < 1024 ? 18 : 20,
    fontWeight: '600',
    lineHeight: screenWidth < 640 ? 20 : screenWidth < 1024 ? 22 : 24,
  },

  // Body text
  bodyLarge: {
    fontSize: screenWidth < 640 ? 16 : screenWidth < 1024 ? 17 : 18,
    fontWeight: '400',
    lineHeight: screenWidth < 640 ? 24 : screenWidth < 1024 ? 26 : 28,
  },

  body: {
    fontSize: screenWidth < 640 ? 14 : screenWidth < 1024 ? 15 : 16,
    fontWeight: '400',
    lineHeight: screenWidth < 640 ? 20 : screenWidth < 1024 ? 22 : 24,
  },

  bodySmall: {
    fontSize: screenWidth < 640 ? 12 : screenWidth < 1024 ? 13 : 14,
    fontWeight: '400',
    lineHeight: screenWidth < 640 ? 16 : screenWidth < 1024 ? 18 : 20,
  },

  // Labels and captions
  labelLarge: {
    fontSize: screenWidth < 640 ? 14 : screenWidth < 1024 ? 15 : 16,
    fontWeight: '500',
    lineHeight: screenWidth < 640 ? 18 : screenWidth < 1024 ? 20 : 22,
    letterSpacing: 0.1,
  },

  label: {
    fontSize: screenWidth < 640 ? 12 : screenWidth < 1024 ? 13 : 14,
    fontWeight: '500',
    lineHeight: screenWidth < 640 ? 16 : screenWidth < 1024 ? 18 : 20,
    letterSpacing: 0.5,
  },

  labelSmall: {
    fontSize: screenWidth < 640 ? 10 : screenWidth < 1024 ? 11 : 12,
    fontWeight: '500',
    lineHeight: screenWidth < 640 ? 14 : screenWidth < 1024 ? 16 : 18,
    letterSpacing: 0.5,
  },

  caption: {
    fontSize: screenWidth < 640 ? 11 : screenWidth < 1024 ? 12 : 13,
    fontWeight: '400',
    lineHeight: screenWidth < 640 ? 14 : screenWidth < 1024 ? 16 : 18,
    letterSpacing: 0.33,
  },

  overline: {
    fontSize: screenWidth < 640 ? 10 : screenWidth < 1024 ? 11 : 12,
    fontWeight: '500',
    lineHeight: screenWidth < 640 ? 12 : screenWidth < 1024 ? 14 : 16,
    letterSpacing: 0.83,
    textTransform: 'uppercase',
  },
};

// Color system for web typography
export const TypographyColors = {
  primary: '#1f2937',      // Dark gray for main text
  secondary: '#6b7280',    // Medium gray for secondary text
  muted: '#9ca3af',        // Light gray for muted text
  accent: '#00CED1',       // Brand color for highlights
  success: '#10b981',      // Green for success states
  warning: '#f59e0b',      // Orange for warnings
  error: '#ef4444',        // Red for errors
  info: '#3b82f6',         // Blue for info
};

// Typography component with responsive styling
const Typography = ({
  variant = 'body',
  color = 'primary',
  align = 'left',
  style,
  children,
  ...props
}) => {
  const theme = useTheme();

  const baseStyle = [
    TypographyVariants[variant],
    {
      color: TypographyColors[color] || theme.colors.onSurface,
      textAlign: align,
    },
    style,
  ];

  return (
    <Text style={baseStyle} {...props}>
      {children}
    </Text>
  );
};

// Pre-configured typography components for common use cases
export const Display = (props) => <Typography variant="display" {...props} />;
export const H1 = (props) => <Typography variant="h1" {...props} />;
export const H2 = (props) => <Typography variant="h2" {...props} />;
export const H3 = (props) => <Typography variant="h3" {...props} />;
export const H4 = (props) => <Typography variant="h4" {...props} />;
export const H5 = (props) => <Typography variant="h5" {...props} />;
export const H6 = (props) => <Typography variant="h6" {...props} />;

export const BodyLarge = (props) => <Typography variant="bodyLarge" {...props} />;
export const Body = (props) => <Typography variant="body" {...props} />;
export const BodySmall = (props) => <Typography variant="bodySmall" {...props} />;

export const LabelLarge = (props) => <Typography variant="labelLarge" {...props} />;
export const Label = (props) => <Typography variant="label" {...props} />;
export const LabelSmall = (props) => <Typography variant="labelSmall" {...props} />;

export const Caption = (props) => <Typography variant="caption" {...props} />;
export const Overline = (props) => <Typography variant="overline" {...props} />;

// Special components for specific use cases
export const BrandTitle = ({ children, ...props }) => (
  <Typography
    variant="h4"
    color="accent"
    webStyle={styles.brandTitle}
    {...props}
  >
    {children}
  </Typography>
);

export const ErrorText = ({ children, ...props }) => (
  <Typography
    variant="bodySmall"
    color="error"
    {...props}
  >
    {children}
  </Typography>
);

export const SuccessText = ({ children, ...props }) => (
  <Typography
    variant="bodySmall"
    color="success"
    {...props}
  >
    {children}
  </Typography>
);

export const CardTitle = ({ children, ...props }) => (
  <Typography
    variant="h6"
    color="primary"
    {...props}
  >
    {children}
  </Typography>
);

export const CardSubtitle = ({ children, ...props }) => (
  <Typography
    variant="bodySmall"
    color="secondary"
    {...props}
  >
    {children}
  </Typography>
);

const styles = StyleSheet.create({
  brandTitle: {
    fontWeight: '700',
    color: '#00CED1',
  },
});

export default Typography;
