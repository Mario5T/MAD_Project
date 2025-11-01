import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, Animated, Dimensions } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

const { width: screenWidth } = Dimensions.get('window');

// Skeleton loading component for web
export const SkeletonLoader = ({
  width = '100%',
  height = 20,
  style,
  variant = 'rounded',
  animation = 'pulse'
}) => {
  const [fadeAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    if (animation === 'pulse') {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0.5,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();

      return () => pulseAnimation.stop();
    }
  }, [fadeAnim, animation]);

  const skeletonStyle = [
    styles.skeleton,
    {
      width,
      height,
      borderRadius: variant === 'rounded' ? 8 : variant === 'circular' ? height / 2 : 0,
      opacity: fadeAnim,
    },
    style,
  ];

  return <View style={skeletonStyle} />;
};

// Skeleton for text lines
export const SkeletonText = ({
  lines = 1,
  width = '100%',
  spacing = 8,
  style,
  ...props
}) => {
  return (
    <View style={[styles.textSkeletonContainer, style]}>
      {Array.from({ length: lines }).map((_, index) => (
        <SkeletonLoader
          key={index}
          width={index === lines - 1 ? '60%' : width} // Last line shorter
          height={16}
          style={{ marginBottom: index < lines - 1 ? spacing : 0 }}
          {...props}
        />
      ))}
    </View>
  );
};

// Skeleton for cards
export const SkeletonCard = ({
  style,
  showAvatar = false,
  showImage = false,
  lines = 3
}) => {
  return (
    <View style={[styles.cardSkeleton, style]}>
      {showImage && (
        <SkeletonLoader
          width="100%"
          height={200}
          style={styles.cardImageSkeleton}
        />
      )}

      <View style={styles.cardContentSkeleton}>
        {showAvatar && (
          <View style={styles.cardHeaderSkeleton}>
            <SkeletonLoader variant="circular" width={40} height={40} />
            <View style={styles.cardTitleSkeleton}>
              <SkeletonText lines={1} width="60%" />
              <SkeletonText lines={1} width="40%" />
            </View>
          </View>
        )}

        <SkeletonText lines={lines} />
      </View>
    </View>
  );
};

// Enhanced loading spinner for web
export const WebLoadingSpinner = ({
  size = 'medium',
  color = '#00CED1',
  style,
  fullScreen = false
}) => {
  const spinnerSize = {
    small: 24,
    medium: 40,
    large: 64,
  }[size] || 40;

  if (fullScreen) {
    return (
      <View style={[styles.fullScreenLoader, style]}>
        <View style={styles.spinnerContainer}>
          <ActivityIndicator
            size={spinnerSize}
            color={color}
            style={styles.spinner}
          />
          <SkeletonText
            lines={1}
            width={120}
            style={styles.loadingText}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.inlineLoader, style]}>
      <ActivityIndicator size={spinnerSize} color={color} />
    </View>
  );
};

// Progressive loading component
export const ProgressiveLoader = ({
  isLoading,
  children,
  skeleton,
  delay = 200
}) => {
  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    let timeout;
    if (isLoading) {
      timeout = setTimeout(() => setShowSkeleton(true), delay);
    } else {
      setShowSkeleton(false);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isLoading, delay]);

  if (isLoading && showSkeleton) {
    return skeleton || <SkeletonCard />;
  }

  return children;
};

// Loading states for different content types
export const LoadingStates = {
  // List/Grid loading
  list: ({ itemCount = 5, showAvatar = false }) => (
    <View style={styles.listSkeleton}>
      {Array.from({ length: itemCount }).map((_, index) => (
        <SkeletonCard
          key={index}
          showAvatar={showAvatar}
          style={styles.listItemSkeleton}
        />
      ))}
    </View>
  ),

  // Profile loading
  profile: () => (
    <View style={styles.profileSkeleton}>
      <SkeletonCard style={styles.profileHeaderSkeleton}>
        <View style={styles.profileAvatarSkeleton}>
          <SkeletonLoader variant="circular" width={80} height={80} />
        </View>
        <SkeletonText lines={2} style={styles.profileInfoSkeleton} />
      </SkeletonCard>

      <SkeletonCard lines={3} style={styles.profileDetailsSkeleton} />
    </View>
  ),

  // Form loading
  form: ({ fieldCount = 4 }) => (
    <View style={styles.formSkeleton}>
      {Array.from({ length: fieldCount }).map((_, index) => (
        <View key={index} style={styles.formFieldSkeleton}>
          <SkeletonText lines={1} width="30%" style={styles.fieldLabelSkeleton} />
          <SkeletonLoader width="100%" height={40} style={styles.fieldInputSkeleton} />
        </View>
      ))}
    </View>
  ),
};

// Loading overlay for async actions
export const LoadingOverlay = ({
  isVisible,
  message = 'Loading...',
  style
}) => {
  if (!isVisible) return null;

  return (
    <View style={[styles.overlay, style]}>
      <View style={styles.overlayContent}>
        <WebLoadingSpinner size="large" />
        <SkeletonText
          lines={1}
          width={150}
          style={styles.overlayText}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#e5e7eb',
    opacity: 0.7,
  },

  textSkeletonContainer: {
    width: '100%',
  },

  cardSkeleton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },

  cardImageSkeleton: {
    marginBottom: 16,
    borderRadius: 8,
  },

  cardContentSkeleton: {
    gap: 12,
  },

  cardHeaderSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  cardTitleSkeleton: {
    flex: 1,
  },

  fullScreenLoader: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },

  spinnerContainer: {
    alignItems: 'center',
    gap: 16,
  },

  spinner: {
    // Spinner animation handled by ActivityIndicator
  },

  loadingText: {
    textAlign: 'center',
  },

  inlineLoader: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  listSkeleton: {
    gap: 16,
    padding: 16,
  },

  listItemSkeleton: {
    marginBottom: 0,
  },

  profileSkeleton: {
    padding: 20,
    gap: 20,
  },

  profileHeaderSkeleton: {
    alignItems: 'center',
    padding: 32,
  },

  profileAvatarSkeleton: {
    marginBottom: 20,
  },

  profileInfoSkeleton: {
    alignItems: 'center',
    gap: 8,
  },

  profileDetailsSkeleton: {
    padding: 24,
  },

  formSkeleton: {
    padding: 20,
    gap: 20,
  },

  formFieldSkeleton: {
    gap: 8,
  },

  fieldLabelSkeleton: {
    marginBottom: 8,
  },

  fieldInputSkeleton: {
    borderRadius: 8,
  },

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },

  overlayContent: {
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    gap: 16,
    minWidth: 200,
  },

  overlayText: {
    textAlign: 'center',
  },
});
