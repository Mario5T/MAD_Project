import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const GradientButton = ({
    title,
    onPress,
    colors = ['#0056b3', '#0088ff'],
    icon,
    loading = false,
    disabled = false,
    size = 'medium',
}) => {
    const sizeStyles = {
        small: { height: 40, fontSize: 14, iconSize: 18, paddingHorizontal: 16 },
        medium: { height: 52, fontSize: 16, iconSize: 20, paddingHorizontal: 24 },
        large: { height: 60, fontSize: 18, iconSize: 24, paddingHorizontal: 32 },
    };

    const currentSize = sizeStyles[size] || sizeStyles.medium;

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            disabled={disabled || loading}
            style={styles.touchable}
        >
            <LinearGradient
                colors={disabled ? ['#cccccc', '#999999'] : colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                    styles.gradient,
                    { height: currentSize.height, paddingHorizontal: currentSize.paddingHorizontal },
                ]}
            >
                {loading ? (
                    <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                    <>
                        {icon && (
                            <Icon
                                name={icon}
                                size={currentSize.iconSize}
                                color="#ffffff"
                                style={styles.icon}
                            />
                        )}
                        <Text style={[styles.text, { fontSize: currentSize.fontSize }]}>
                            {title}
                        </Text>
                    </>
                )}
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    touchable: {
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    gradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
    },
    icon: {
        marginRight: 8,
    },
    text: {
        color: '#ffffff',
        fontWeight: '700',
    },
});

export default GradientButton;
