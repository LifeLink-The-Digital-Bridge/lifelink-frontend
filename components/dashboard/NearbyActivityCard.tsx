import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../utils/responsive';
import { NearbyDonationActivityDTO, NearbyRequestActivityDTO } from '../../app/api/nearbyTypes';

interface NearbyActivityCardProps {
    activity: NearbyDonationActivityDTO | NearbyRequestActivityDTO;
    theme: any;
    type: 'donation' | 'request';
    onProfilePress?: (userId: string) => void;
}

const getDonationTypeIcon = (type: string) => {
    switch (type) {
        case 'BLOOD': return 'droplet';
        case 'ORGAN': return 'heart';
        case 'TISSUE': return 'layers';
        case 'STEM_CELL': return 'activity';
        default: return 'circle';
    }
};

const getDonationTypeColor = (type: string) => {
    switch (type) {
        case 'BLOOD': return '#E74C3C';
        case 'ORGAN': return '#3498DB';
        case 'TISSUE': return '#9B59B6';
        case 'STEM_CELL': return '#F39C12';
        default: return '#95A5A6';
    }
};

export const NearbyActivityCard: React.FC<NearbyActivityCardProps> = ({ activity, theme, type, onProfilePress }) => {
    const items = type === 'donation'
        ? (activity as NearbyDonationActivityDTO).pendingDonations
        : (activity as NearbyRequestActivityDTO).pendingRequests;

    const getItemType = (item: any) => {
        return type === 'donation' ? item.donationType : item.requestType;
    };

    const getItemDetails = (item: any) => {
        const details: string[] = [];

        if (item.bloodType) {
            details.push(item.bloodType.replace('_', ' '));
        }
        if (item.requestedBloodType) {
            details.push(item.requestedBloodType.replace('_', ' '));
        }
        if (item.organType) {
            details.push(item.organType);
        }
        if (item.requestedOrgan) {
            details.push(item.requestedOrgan);
        }
        if (item.tissueType) {
            details.push(item.tissueType);
        }
        if (item.requestedTissue) {
            details.push(item.requestedTissue);
        }
        if (item.stemCellType) {
            details.push(item.stemCellType.replace('_', ' '));
        }
        if (item.requestedStemCellType) {
            details.push(item.requestedStemCellType.replace('_', ' '));
        }
        if (item.urgencyLevel) {
            details.push(`${item.urgencyLevel} urgency`);
        }

        return details.length > 0 ? details.join(' • ') : null;
    };

    return (
        <View style={[styles.card, { backgroundColor: theme.card, shadowColor: theme.shadow }]}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => onProfilePress?.(activity.user.id)}
                    activeOpacity={0.7}
                    disabled={!onProfilePress}
                >
                    {activity.user.profileImageUrl ? (
                        <Image
                            source={{ uri: activity.user.profileImageUrl }}
                            style={styles.profileImage}
                        />
                    ) : (
                        <View style={[styles.profileImage, styles.profilePlaceholder, { backgroundColor: theme.primary + '20' }]}>
                            <Feather name="user" size={20} color={theme.primary} />
                        </View>
                    )}
                </TouchableOpacity>
                <View style={styles.userInfo}>
                    <Text style={[styles.name, { color: theme.text }]}>{activity.user.name}</Text>
                    <Text style={[styles.username, { color: theme.textSecondary }]}>@{activity.user.username}</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: type === 'donation' ? '#E74C3C20' : '#3498DB20' }]}>
                    <Text style={[styles.badgeText, { color: type === 'donation' ? '#E74C3C' : '#3498DB' }]}>
                        {type === 'donation' ? 'Donor' : 'Recipient'}
                    </Text>
                </View>
            </View>

            <View style={styles.itemsContainer}>
                {items.slice(0, 2).map((item: any, index: number) => {
                    const itemType = getItemType(item);
                    const itemDetails = getItemDetails(item);
                    return (
                        <View
                            key={index}
                            style={[styles.itemCard, { backgroundColor: getDonationTypeColor(itemType) + '10', borderColor: getDonationTypeColor(itemType) + '40' }]}
                        >
                            <View style={styles.itemHeader}>
                                <Feather
                                    name={getDonationTypeIcon(itemType)}
                                    size={18}
                                    color={getDonationTypeColor(itemType)}
                                />
                                <Text style={[styles.itemTypeText, { color: getDonationTypeColor(itemType) }]}>
                                    {itemType.replace('_', ' ')}
                                </Text>
                            </View>
                            {itemDetails && (
                                <Text style={[styles.itemDetailsText, { color: theme.textSecondary }]} numberOfLines={1}>
                                    {itemDetails}
                                </Text>
                            )}
                        </View>
                    );
                })}
                {items.length > 2 && (
                    <View style={[styles.moreCard, { backgroundColor: theme.primary + '10' }]}>
                        <Text style={[styles.moreText, { color: theme.primary }]}>
                            +{items.length - 2} more
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: wp('3%'),
        padding: wp('4%'),
        marginBottom: hp('1.5%'),
        elevation: 2,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp('1.5%'),
    },
    profileImage: {
        width: wp('11%'),
        height: wp('11%'),
        borderRadius: wp('5.5%'),
    },
    profilePlaceholder: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    userInfo: {
        flex: 1,
        marginLeft: wp('3%'),
    },
    name: {
        fontSize: wp('4%'),
        fontWeight: '600',
    },
    username: {
        fontSize: wp('3.2%'),
        marginTop: 2,
    },
    badge: {
        paddingHorizontal: wp('2.5%'),
        paddingVertical: hp('0.5%'),
        borderRadius: wp('2%'),
    },
    badgeText: {
        fontSize: wp('2.8%'),
        fontWeight: '600',
    },
    itemsContainer: {
        gap: wp('2%'),
    },
    itemCard: {
        borderRadius: wp('2%'),
        padding: wp('3%'),
        borderWidth: 1,
        marginBottom: hp('1%'),
    },
    itemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp('2%'),
        marginBottom: hp('0.5%'),
    },
    itemTypeText: {
        fontSize: wp('3.5%'),
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    itemDetailsText: {
        fontSize: wp('3%'),
        marginLeft: wp('6%'),
    },
    moreCard: {
        borderRadius: wp('2%'),
        padding: wp('2.5%'),
        alignItems: 'center',
        marginTop: hp('0.5%'),
    },
    moreText: {
        fontSize: wp('3%'),
        fontWeight: '500',
    },
});
