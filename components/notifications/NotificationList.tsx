import { Feather } from '@expo/vector-icons';
import { isAfter, isBefore, startOfToday, startOfYesterday } from 'date-fns';
import React from 'react';
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../utils/responsive';
import { createNotificationStyles } from '../../constants/styles/notificationStyles';
import { NotificationDTO } from '../../utils/types/notification';
import { NotificationItem } from './NotificationItem';

interface NotificationListProps {
    notifications: NotificationDTO[];
    theme: any;
    loading: boolean;
    onRefresh: () => void;
    onMarkAsRead: (id: string) => void;
    onDelete: (id: string) => void;
    onNotificationPress?: (notification: NotificationDTO) => void;
    refreshing?: boolean;
}

interface GroupedNotifications {
    title: string;
    data: NotificationDTO[];
}

const groupNotificationsByDate = (notifications: NotificationDTO[]): GroupedNotifications[] => {
    const today = startOfToday();
    const yesterday = startOfYesterday();

    const todayNotifs: NotificationDTO[] = [];
    const yesterdayNotifs: NotificationDTO[] = [];
    const earlierNotifs: NotificationDTO[] = [];

    notifications.forEach((notif) => {
        const notifDate = new Date(notif.createdAt);

        if (isAfter(notifDate, today)) {
            todayNotifs.push(notif);
        } else if (isAfter(notifDate, yesterday) && isBefore(notifDate, today)) {
            yesterdayNotifs.push(notif);
        } else {
            earlierNotifs.push(notif);
        }
    });

    const groups: GroupedNotifications[] = [];

    if (todayNotifs.length > 0) {
        groups.push({ title: 'Today', data: todayNotifs });
    }

    if (yesterdayNotifs.length > 0) {
        groups.push({ title: 'Yesterday', data: yesterdayNotifs });
    }

    if (earlierNotifs.length > 0) {
        groups.push({ title: 'Earlier', data: earlierNotifs });
    }

    return groups;
};

export const NotificationList: React.FC<NotificationListProps> = ({
    notifications,
    theme,
    loading,
    onRefresh,
    onMarkAsRead,
    onDelete,
    onNotificationPress,
    refreshing = false,
}) => {
    const styles = createNotificationStyles(theme);
    const groupedNotifications = groupNotificationsByDate(notifications);

    if (loading && notifications.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.primary} />
                <Text style={styles.loadingText}>Loading notifications...</Text>
            </View>
        );
    }

    if (notifications.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Feather
                    name="bell-off"
                    size={wp('15%')}
                    color={theme.textSecondary}
                    style={styles.emptyIcon}
                />
                <Text style={styles.emptyTitle}>No Notifications</Text>
                <Text style={styles.emptyMessage}>
                    You're all caught up! Check back later for updates.
                </Text>
            </View>
        );
    }

    const renderSectionHeader = (title: string) => (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{title}</Text>
        </View>
    );

    const renderItem = ({ item }: { item: NotificationDTO | string }) => {
        if (typeof item === 'string') {
            return renderSectionHeader(item);
        }

        return (
            <NotificationItem
                notification={item}
                theme={theme}
                onMarkAsRead={onMarkAsRead}
                onDelete={onDelete}
                onPress={onNotificationPress}
            />
        );
    };

    const flatData: (NotificationDTO | string)[] = [];
    groupedNotifications.forEach((group) => {
        flatData.push(group.title);
        flatData.push(...group.data);
    });

    return (
        <FlatList
            data={flatData}
            renderItem={renderItem}
            keyExtractor={(item, index) =>
                typeof item === 'string' ? `section-${item}-${index}` : item.id
            }
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor={theme.primary}
                    colors={[theme.primary]}
                />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: hp('1%'), paddingBottom: hp('10%') }}
        />
    );
};
