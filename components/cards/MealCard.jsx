import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const MealCard = ({
    mealType = 'lunch',
    items,
    timing,
    date,
    onPress,
    isToday = false,
}) => {
    const theme = useTheme();

    const mealConfig = {
        breakfast: {
            icon: 'weather-sunny',
            label: 'Breakfast',
            colors: ['#ff9800', '#ffb74d'],
            emoji: '☀️',
        },
        lunch: {
            icon: 'silverware-fork-knife',
            label: 'Lunch',
            colors: ['#4caf50', '#66bb6a'],
            emoji: '🍛',
        },
        dinner: {
            icon: 'moon-waning-crescent',
            label: 'Dinner',
            colors: ['#9c27b0', '#ba68c8'],
            emoji: '🌙',
        },
        snacks: {
            icon: 'food-apple',
            label: 'Snacks',
            colors: ['#ff6b00', '#ff9248'],
            emoji: '🍪',
        },
    };

    const config = mealConfig[mealType.toLowerCase()] || mealConfig.lunch;

    const CardWrapper = onPress ? TouchableOpacity : View;
    const cardProps = onPress ? { activeOpacity: 0.7, onPress } : {};

    return (
        <CardWrapper {...cardProps}>
            <Card
                style={[
                    styles.card,
                    { backgroundColor: theme.colors.surface },
                    isToday && styles.todayCard,
                ]}
                mode="elevated"
                elevation={isToday ? 4 : 2}
            >
                <LinearGradient
                    colors={config.colors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.accent}
                />

                <Card.Content style={styles.content}>
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <View
                                style={[
                                    styles.iconContainer,
                                    { backgroundColor: `${config.colors[0]}15` },
                                ]}
                            >
                                <Text style={styles.emoji}>{config.emoji}</Text>
                            </View>
                            <View style={styles.titleContainer}>
                                <Text style={[styles.mealLabel, { color: theme.colors.onSurface }]}>
                                    {config.label}
                                </Text>
                                {timing && (
                                    <Text style={[styles.timing, { color: theme.colors.onSurfaceVariant }]}>
                                        ⏰ {timing}
                                    </Text>
                                )}
                            </View>
                        </View>
                        {isToday && (
                            <View style={[styles.todayBadge, { backgroundColor: `${config.colors[0]}20` }]}>
                                <Text style={[styles.todayText, { color: config.colors[0] }]}>
                                    Today
                                </Text>
                            </View>
                        )}
                    </View>
                    {date && (
                        <Text style={[styles.date, { color: theme.colors.onSurfaceVariant }]}>
                            📅 {date}
                        </Text>
                    )}
                    <View style={styles.itemsContainer}>
                        <Text style={[styles.items, { color: theme.colors.onSurface }]}>
                            {items}
                        </Text>
                    </View>
                </Card.Content>
            </Card>
        </CardWrapper>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
    },
    todayCard: {
        borderWidth: 2,
        borderColor: 'rgba(0, 136, 255, 0.3)',
    },
    accent: {
        height: 4,
        width: '100%',
    },
    content: {
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    emoji: {
        fontSize: 24,
    },
    titleContainer: {
        flex: 1,
    },
    mealLabel: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 2,
    },
    timing: {
        fontSize: 13,
        fontWeight: '500',
    },
    todayBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    todayText: {
        fontSize: 12,
        fontWeight: '700',
    },
    date: {
        fontSize: 13,
        fontWeight: '500',
        marginBottom: 12,
    },
    itemsContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
        padding: 12,
        borderRadius: 8,
    },
    items: {
        fontSize: 15,
        lineHeight: 22,
    },
});

export default MealCard;
