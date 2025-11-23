import * as SecureStore from "expo-secure-store";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
    deleteNotification as apiDeleteNotification,
    markAllNotificationsAsRead as apiMarkAllAsRead,
    markNotificationAsRead as apiMarkAsRead,
    fetchAllNotifications,
    getUnreadCount,
} from "../app/api/notificationApi";
import { useNotificationWebSocket } from "../hooks/useNotificationWebSocket";
import { useAuth } from "./auth-context";
import { NotificationContextType, NotificationDTO } from "./types/notification";

const NotificationContext = createContext<NotificationContextType | undefined>(
    undefined
);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error(
            "useNotification must be used within a NotificationProvider"
        );
    }
    return context;
};

interface NotificationProviderProps {
    children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
    children,
}) => {
    const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [userId, setUserId] = useState<string | null>(null);

    const { isAuthenticated } = useAuth();

    // Handle login/logout state changes
    useEffect(() => {
        const handleAuthStateChange = async () => {
            if (isAuthenticated) {
                // User logged in - load ID and fetch notifications
                const id = await SecureStore.getItemAsync("userId");
                setUserId(id);
            } else {
                // User logged out - clear all state
                setUserId(null);
                setNotifications([]);
                setUnreadCount(0);
                setLoading(false);
            }
        };
        handleAuthStateChange();
    }, [isAuthenticated]);

    // Handle incoming WebSocket notifications
    const handleWebSocketNotification = useCallback(
        (notification: NotificationDTO) => {
            console.log("[NotificationContext] New notification via WebSocket:", notification);

            // Add new notification to the beginning of the list
            setNotifications((prev) => [notification, ...prev]);

            // Increment unread count if notification is unread
            if (!notification.isRead) {
                setUnreadCount((prev) => prev + 1);
            }
        },
        []
    );

    const { connected, reconnect } = useNotificationWebSocket({
        onNotificationReceived: handleWebSocketNotification,
        userId,
    });

    const refreshNotifications = useCallback(async () => {
        try {
            setLoading(true);
            const [notifs, count] = await Promise.all([
                fetchAllNotifications(),
                getUnreadCount(),
            ]);
            setNotifications(notifs);
            setUnreadCount(count);
        } catch (error) {
            console.error("[NotificationContext] Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const markAsRead = useCallback(
        async (notificationId: string) => {
            try {
                const updatedNotification = await apiMarkAsRead(notificationId);

                setNotifications((prev) =>
                    prev.map((notif) =>
                        notif.id === notificationId ? updatedNotification : notif
                    )
                );

                setNotifications((prev) => {
                    const wasUnread = prev.find(n => n.id === notificationId)?.isRead === false;
                    if (wasUnread) {
                        setUnreadCount((count) => Math.max(0, count - 1));
                    }
                    return prev;
                });

            } catch (error) {
                console.error("[NotificationContext] Error marking as read:", error);
                throw error;
            }
        },
        []
    );

    const markAllAsRead = useCallback(async () => {
        try {
            await apiMarkAllAsRead();

            setNotifications((prev) =>
                prev.map((notif) => ({ ...notif, isRead: true }))
            );

            setUnreadCount(0);
        } catch (error) {
            console.error("[NotificationContext] Error marking all as read:", error);
            throw error;
        }
    }, []);

    const deleteNotification = useCallback(async (notificationId: string) => {
        try {
            await apiDeleteNotification(notificationId);
            setNotifications((prev) => {
                const notification = prev.find((n) => n.id === notificationId);
                if (notification && !notification.isRead) {
                    setUnreadCount((count) => Math.max(0, count - 1));
                }
                return prev.filter((n) => n.id !== notificationId);
            });
        } catch (error) {
            console.error("[NotificationContext] Error deleting notification:", error);
            throw error;
        }
    }, []);

    useEffect(() => {
        if (userId) {
            refreshNotifications();
        }
    }, [userId, refreshNotifications]);

    const value: NotificationContextType = {
        notifications,
        unreadCount,
        loading,
        connected,
        refreshNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
