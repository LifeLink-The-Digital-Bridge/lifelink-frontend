import { Feather } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { createNotificationStyles } from '../../constants/styles/notificationStyles';
import { NotificationDTO, NotificationType } from '../../utils/types/notification';
import { CustomAlert } from '../common/CustomAlert';

interface NotificationItemProps {
    notification: NotificationDTO;
    theme: any;
    onMarkAsRead: (id: string) => void;
    onDelete: (id: string) => void;
    onPress?: (notification: NotificationDTO) => void;
}

const getNotificationIcon = (type: NotificationType): string => {
    switch (type) {
        case NotificationType.DONATION_CREATED:
            return 'heart';
        case NotificationType.REQUEST_CREATED:
            return 'plus-circle';
        case NotificationType.DONATION_CANCELLED:
            return 'x-circle';
        case NotificationType.REQUEST_CANCELLED:
            return 'x-circle';
        case NotificationType.MATCH_FOUND:
            return 'check-circle';
        case NotificationType.SYSTEM:
            return 'info';
        default:
            return 'bell';
    }
};

const getNotificationColor = (type: NotificationType, theme: any): string => {
    switch (type) {
        case NotificationType.DONATION_CREATED:
            return '#FF3B30';
        case NotificationType.REQUEST_CREATED:
            return '#007AFF';
        case NotificationType.DONATION_CANCELLED:
            return '#FF9500';
        case NotificationType.REQUEST_CANCELLED:
            return '#FF9500';
        case NotificationType.MATCH_FOUND:
            return '#34C759';
        case NotificationType.SYSTEM:
            return theme.primary;
        default:
            return theme.primary;
    }
};

export const NotificationItem: React.FC<NotificationItemProps> = ({
    notification,
    theme,
    onMarkAsRead,
    onDelete,
    onPress,
}) => {
    const styles = createNotificationStyles(theme);
    const iconName = getNotificationIcon(notification.type);
    const iconColor = getNotificationColor(notification.type, theme);
    const [deleteAlertVisible, setDeleteAlertVisible] = useState(false);

    const handlePress = () => {
        if (!notification.isRead) {
            onMarkAsRead(notification.id);
        }
        if (onPress) {
            onPress(notification);
        }
    };

    const handleDelete = () => {
        setDeleteAlertVisible(true);
    };

    const confirmDelete = () => {
        onDelete(notification.id);
        setDeleteAlertVisible(false);
    };

    const formatTimestamp = (timestamp: string) => {
        try {
            const date = new Date(timestamp);
            return formatDistanceToNow(date, { addSuffix: true });
        } catch {
            return timestamp;
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.notificationItem,
                !notification.isRead && styles.unreadItem,
            ]}
            onPress={handlePress}
            activeOpacity={0.7}
        >
            <View style={styles.notificationHeader}>
                <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
                    <Feather name={iconName as any} size={wp('5%')} color={iconColor} />
                </View>

                <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                    <Text style={styles.notificationMessage} numberOfLines={3}>
                        {notification.message}
                    </Text>
                </View>
            </View>

            <View style={styles.notificationFooter}>
                <Text style={styles.timestamp}>
                    {formatTimestamp(notification.createdAt)}
                </Text>

                <View style={styles.actionButtons}>
                    {(!notification.isRead && !(notification as any).read) && (
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => onMarkAsRead(notification.id)}
                        >
                            <Feather name="check" size={wp('4%')} color={theme.primary} />
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleDelete}
                    >
                        <Feather name="trash-2" size={wp('4%')} color={theme.primary} />
                    </TouchableOpacity>
                </View>
            </View>

            {(!notification.isRead && !(notification as any).read) && (
                <View style={[styles.unreadDot, { position: 'absolute', top: wp('4%'), right: wp('4%') }]} />
            )}

            <CustomAlert
                visible={deleteAlertVisible}
                title="Delete Notification"
                message="Are you sure you want to delete this notification?"
                onClose={() => setDeleteAlertVisible(false)}
                onConfirm={confirmDelete}
                confirmText="Delete"
                cancelText="Cancel"
            />
        </TouchableOpacity>
    );
};
