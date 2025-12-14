import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

interface FilterToggleProps {
    activeFilter: 'all' | 'donors' | 'recipients';
    onFilterChange: (filter: 'all' | 'donors' | 'recipients') => void;
    donorsCount: number;
    recipientsCount: number;
    theme: any;
}

export const FilterToggle: React.FC<FilterToggleProps> = ({
    activeFilter,
    onFilterChange,
    donorsCount,
    recipientsCount,
    theme,
}) => {
    const totalCount = donorsCount + recipientsCount;

    const filters = [
        { key: 'all' as const, label: 'All', count: totalCount, icon: 'users' },
        { key: 'donors' as const, label: 'Donors', count: donorsCount, icon: 'heart' },
        { key: 'recipients' as const, label: 'Recipients', count: recipientsCount, icon: 'user' },
    ];

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {filters.map((filter, index) => {
                const isActive = activeFilter === filter.key;
                const isFirst = index === 0;
                const isLast = index === filters.length - 1;

                return (
                    <TouchableOpacity
                        key={filter.key}
                        style={[
                            styles.filterButton,
                            {
                                backgroundColor: isActive ? theme.primary : theme.card,
                                borderColor: theme.border,
                                borderLeftWidth: isFirst ? 1 : 0,
                                borderRightWidth: 1,
                                borderTopWidth: 1,
                                borderBottomWidth: 1,
                                borderTopLeftRadius: isFirst ? wp('2%') : 0,
                                borderBottomLeftRadius: isFirst ? wp('2%') : 0,
                                borderTopRightRadius: isLast ? wp('2%') : 0,
                                borderBottomRightRadius: isLast ? wp('2%') : 0,
                            },
                        ]}
                        onPress={() => onFilterChange(filter.key)}
                        activeOpacity={0.7}
                    >
                        <Feather
                            name={filter.icon as any}
                            size={wp('4%')}
                            color={isActive ? '#fff' : theme.text}
                        />
                        <Text
                            style={[
                                styles.filterText,
                                {
                                    color: isActive ? '#fff' : theme.text,
                                    fontWeight: isActive ? '600' : '500',
                                },
                            ]}
                        >
                            {filter.label}
                        </Text>
                        <View
                            style={[
                                styles.countBadge,
                                {
                                    backgroundColor: isActive
                                        ? 'rgba(255, 255, 255, 0.25)'
                                        : theme.primary + '20',
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.countText,
                                    { color: isActive ? '#fff' : theme.primary },
                                ]}
                            >
                                {filter.count}
                            </Text>
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginBottom: hp('2%'),
        borderRadius: wp('2%'),
    },
    filterButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: hp('1.2%'),
        paddingHorizontal: wp('2%'),
        gap: wp('1.5%'),
    },
    filterText: {
        fontSize: wp('3.2%'),
    },
    countBadge: {
        minWidth: wp('5%'),
        height: wp('5%'),
        borderRadius: wp('2.5%'),
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: wp('1.5%'),
    },
    countText: {
        fontSize: wp('2.8%'),
        fontWeight: '600',
    },
});
