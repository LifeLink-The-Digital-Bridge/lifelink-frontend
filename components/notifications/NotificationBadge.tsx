import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

interface NotificationBadgeProps {
    count: number;
    theme: any;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({ count, theme }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (count > 0) {
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.3,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [count]);

    if (count === 0) {
        return null;
    }

    const displayCount = count > 99 ? '99+' : count.toString();

    return (
        <Animated.View
            style={[
                styles.badge,
                { borderColor: theme.card, transform: [{ scale: scaleAnim }] },
            ]}
        >
            <Text style={styles.badgeText}>{displayCount}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    badge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#FF3B30',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5,
        borderWidth: 2,
    },
    badgeText: {
        color: '#fff',
        fontSize: wp('2.75%'),
        fontWeight: '700',
    },
});
