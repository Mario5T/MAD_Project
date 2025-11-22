import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CountdownTimer = ({ targetTime, label, icon, compact = false }) => {
    const theme = useTheme();
    const [timeLeft, setTimeLeft] = useState('');
    const [isPast, setIsPast] = useState(false);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const target = new Date(targetTime);
            const now = new Date();
            const diff = target - now;

            if (diff <= 0) {
                setIsPast(true);
                setTimeLeft('Passed');
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            if (hours > 0) {
                setTimeLeft(`in ${hours}h ${minutes}m`);
            } else if (minutes > 0) {
                setTimeLeft(`in ${minutes} min${minutes !== 1 ? 's' : ''}`);
            } else {
                setTimeLeft('now');
            }
        };

        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 60000); // Update every minute

        return () => clearInterval(interval);
    }, [targetTime]);

    if (compact) {
        return (
            <View style={styles.compactContainer}>
                {icon && <Icon name={icon} size={16} color={theme.colors.primary} style={styles.compactIcon} />}
                <Text style={[styles.compactText, { color: isPast ? theme.colors.error : theme.colors.primary }]}>
                    {timeLeft}
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {icon && (
                <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.primary}15` }]}>
                    <Icon name={icon} size={24} color={theme.colors.primary} />
                </View>
            )}
            <View style={styles.textContainer}>
                {label && (
                    <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>
                        {label}
                    </Text>
                )}
                <Text style={[styles.time, { color: isPast ? theme.colors.error : theme.colors.primary }]}>
                    {timeLeft}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
    },
    label: {
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 2,
    },
    time: {
        fontSize: 18,
        fontWeight: '700',
    },
    compactContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    compactIcon: {
        marginRight: 4,
    },
    compactText: {
        fontSize: 14,
        fontWeight: '600',
    },
});

export default CountdownTimer;
