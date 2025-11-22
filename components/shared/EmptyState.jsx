import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import GradientButton from './GradientButton';

const EmptyState = ({
    icon = 'alert-circle-outline',
    title = 'No data available',
    description,
    actionLabel,
    onAction,
}) => {
    const theme = useTheme();

    return (
        <View style={styles.container}>
            <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.primary}10` }]}>
                <Icon name={icon} size={64} color={theme.colors.primary} />
            </View>

            <Text style={[styles.title, { color: theme.colors.onBackground }]}>
                {title}
            </Text>

            {description && (
                <Text style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
                    {description}
                </Text>
            )}

            {actionLabel && onAction && (
                <GradientButton
                    title={actionLabel}
                    onPress={onAction}
                    size="medium"
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 12,
    },
    description: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
        maxWidth: 280,
    },
});

export default EmptyState;
