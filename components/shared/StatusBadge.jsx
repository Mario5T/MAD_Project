import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const StatusBadge = ({ status = 'available', label, icon, compact = false }) => {
    const theme = useTheme();

    const statusConfig = {
        available: {
            color: theme.colors.success || '#4caf50',
            icon: icon || 'check-circle',
            bgColor: 'rgba(76, 175, 80, 0.1)',
        },
        warning: {
            color: theme.colors.warning || '#ff9800',
            icon: icon || 'alert-circle',
            bgColor: 'rgba(255, 152, 0, 0.1)',
        },
        full: {
            color: theme.colors.error || '#ef4444',
            icon: icon || 'close-circle',
            bgColor: 'rgba(239, 68, 68, 0.1)',
        },
        offline: {
            color: theme.colors.onSurfaceVariant,
            icon: icon || 'minus-circle',
            bgColor: theme.colors.surfaceVariant,
        },
        active: {
            color: theme.colors.info || '#03a9f4',
            icon: icon || 'information',
            bgColor: 'rgba(3, 169, 244, 0.1)',
        },
    };

    const config = statusConfig[status] || statusConfig.available;

    if (compact) {
        return (
            <View style={[styles.compactBadge, { backgroundColor: config.bgColor }]}>
                {config.icon && (
                    <Icon name={config.icon} size={12} color={config.color} />
                )}
                <Text style={[styles.compactLabel, { color: config.color }]}>
                    {label}
                </Text>
            </View>
        );
    }

    return (
        <View style={[styles.badge, { backgroundColor: config.bgColor }]}>
            {config.icon && (
                <Icon name={config.icon} size={16} color={config.color} style={styles.icon} />
            )}
            <Text style={[styles.label, { color: config.color }]}>
                {label}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        alignSelf: 'flex-start',
    },
    icon: {
        marginRight: 6,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
    },
    compactBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    compactLabel: {
        fontSize: 12,
        fontWeight: '600',
    },
});

export default StatusBadge;
