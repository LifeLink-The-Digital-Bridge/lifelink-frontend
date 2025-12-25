import AppLayout from '@/components/AppLayout';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../utils/responsive';
import { CustomAlert } from '../../components/common/CustomAlert';
import { TopBar } from '../../components/common/TopBar';
import { NotificationList } from '../../components/notifications/NotificationList';
import { darkTheme, lightTheme } from '../../constants/styles/authStyles';
import { createNotificationStyles } from '../../constants/styles/notificationStyles';
import { useNotification } from '../../utils/notification-context';
import { useTheme } from '../../utils/theme-context';
import { NotificationDTO } from '../../utils/types/notification';

const Notifications = () => {
    const { colorScheme } = useTheme();
    const router = useRouter();
    const isDark = colorScheme === 'dark';
    const theme = isDark ? darkTheme : lightTheme;
    const styles = createNotificationStyles(theme);

    const {
        notifications,
        unreadCount,
        loading,
        connected,
        refreshNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
    } = useNotification();

    const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
    const [refreshing, setRefreshing] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        title: '',
        message: '',
        onConfirm: () => { },
        confirmText: 'OK',
        cancelText: undefined as string | undefined,
    });

    const filteredNotifications = activeTab === 'all'
        ? notifications
        : notifications.filter(n => !n.isRead);

    const handleRefresh = async () => {
        setRefreshing(true);
        await refreshNotifications();
        setRefreshing(false);
    };

    const handleMarkAllAsRead = () => {
        setAlertConfig({
            title: 'Mark All as Read',
            message: 'Are you sure you want to mark all notifications as read?',
            confirmText: 'Mark All',
            cancelText: 'Cancel',
            onConfirm: async () => {
                try {
                    await markAllAsRead();
                } catch (error) {
                    setAlertConfig({
                        title: 'Error',
                        message: 'Failed to mark all notifications as read',
                        confirmText: 'OK',
                        cancelText: undefined,
                        onConfirm: () => { },
                    });
                    setAlertVisible(true);
                }
            },
        });
        setAlertVisible(true);
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            await markAsRead(id);
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteNotification(id);
        } catch (error) {
            setAlertConfig({
                title: 'Error',
                message: 'Failed to delete notification',
                confirmText: 'OK',
                cancelText: undefined,
                onConfirm: () => { },
            });
            setAlertVisible(true);
        }
    };

    const handleNotificationPress = (notification: NotificationDTO) => {
        // Handle navigation based on notification type
        console.log('Notification pressed:', notification);
    };

    const headerStyles = StyleSheet.create({
        headerContainer: {
            backgroundColor: theme.card,
            paddingTop: hp('2%'),
            paddingBottom: hp('1%'),
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
        },
        topRow: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: wp('4.5%'),
            marginBottom: hp('1.5%'),
        },
        backButton: {
            width: wp('10%'),
            height: wp('10%'),
            borderRadius: wp('5%'),
            backgroundColor: theme.primary + '20',
            justifyContent: 'center',
            alignItems: 'center',
        },
        titleContainer: {
            flex: 1,
            marginLeft: wp('3%'),
        },
        title: {
            fontSize: wp('5.5%'),
            fontWeight: '700',
            color: theme.text,
        },
        markAllButton: {
            backgroundColor: theme.primary + '20',
            paddingVertical: hp('1%'),
            paddingHorizontal: wp('3%'),
            borderRadius: wp('2%'),
        },
        markAllText: {
            color: theme.primary,
            fontSize: wp('3.5%'),
            fontWeight: '600',
        },
    });

    return (
        <AppLayout>
            <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
                <StatusBar
                    barStyle={isDark ? 'light-content' : 'dark-content'}
                    backgroundColor={theme.background}
                />

                <TopBar
                    theme={theme}
                    onMenuPress={() => router.back()}
                    onBellPress={() => { }}
                    showBackButton={true}
                    onBack={() => router.back()}
                />

                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Notifications</Text>
                    {unreadCount > 0 && (
                        <TouchableOpacity
                            style={styles.markAllButton}
                            onPress={handleMarkAllAsRead}
                        >
                            <Text style={styles.markAllText}>Mark all read</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'all' ? styles.activeTab : styles.inactiveTab]}
                        onPress={() => setActiveTab('all')}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === 'all' ? styles.activeTabText : styles.inactiveTabText,
                            ]}
                        >
                            All ({notifications.length})
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'unread' ? styles.activeTab : styles.inactiveTab]}
                        onPress={() => setActiveTab('unread')}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === 'unread' ? styles.activeTabText : styles.inactiveTabText,
                            ]}
                        >
                            Unread ({unreadCount})
                        </Text>
                    </TouchableOpacity>
                </View>

                {__DEV__ && (
                    <View style={styles.connectionStatus}>
                        <View
                            style={[
                                styles.connectionDot,
                                connected ? styles.connectedDot : styles.disconnectedDot,
                            ]}
                        />
                        <Text style={styles.connectionText}>
                            {connected ? 'Live updates active' : 'Reconnecting...'}
                        </Text>
                    </View>
                )}

                <NotificationList
                    notifications={filteredNotifications}
                    theme={theme}
                    loading={loading}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    onMarkAsRead={handleMarkAsRead}
                    onDelete={handleDelete}
                    onNotificationPress={handleNotificationPress}
                />

                <CustomAlert
                    visible={alertVisible}
                    title={alertConfig.title}
                    message={alertConfig.message}
                    onClose={() => setAlertVisible(false)}
                    onConfirm={alertConfig.onConfirm}
                    confirmText={alertConfig.confirmText}
                    cancelText={alertConfig.cancelText}
                />
            </SafeAreaView>
        </AppLayout>

    );
};

export default Notifications;
