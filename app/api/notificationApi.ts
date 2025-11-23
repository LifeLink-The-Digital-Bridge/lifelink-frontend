import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { NotificationDTO, UnreadCountResponse } from "../../utils/types/notification";

const BASE_URL = Constants.expoConfig?.extra?.API_URL;

const normalizeNotification = (data: any): NotificationDTO => {
    return {
        ...data,
        isRead: data.isRead !== undefined ? data.isRead : (data.read !== undefined ? data.read : false)
    };
};

export const fetchAllNotifications = async (): Promise<NotificationDTO[]> => {
    const token = await SecureStore.getItemAsync("jwt");
    const userId = await SecureStore.getItemAsync("userId");

    if (!token || !userId) {
        throw new Error("Not authenticated");
    }

    const response = await fetch(`${BASE_URL}/notifications`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            id: userId,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch notifications");
    }

    const data = await response.json();
    return data.map(normalizeNotification);
};

export const fetchUnreadNotifications = async (): Promise<NotificationDTO[]> => {
    const token = await SecureStore.getItemAsync("jwt");
    const userId = await SecureStore.getItemAsync("userId");

    if (!token || !userId) {
        throw new Error("Not authenticated");
    }

    const response = await fetch(`${BASE_URL}/notifications/unread`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            id: userId,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch unread notifications");
    }

    const data = await response.json();
    return data.map(normalizeNotification);
};

export const getUnreadCount = async (): Promise<number> => {
    const token = await SecureStore.getItemAsync("jwt");
    const userId = await SecureStore.getItemAsync("userId");

    if (!token || !userId) {
        throw new Error("Not authenticated");
    }

    const response = await fetch(`${BASE_URL}/notifications/unread/count`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            id: userId,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch unread count");
    }

    const data: UnreadCountResponse = await response.json();
    return data.unreadCount;
};

export const markNotificationAsRead = async (
    notificationId: string
): Promise<NotificationDTO> => {
    const token = await SecureStore.getItemAsync("jwt");
    const userId = await SecureStore.getItemAsync("userId");

    if (!token || !userId) {
        throw new Error("Not authenticated");
    }

    const response = await fetch(
        `${BASE_URL}/notifications/${notificationId}/read`,
        {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                id: userId,
            },
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error("Failed to mark notification as read");
    }

    const updatedNotification = await response.json();
    const normalized = normalizeNotification(updatedNotification);

    return normalized;
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
    const token = await SecureStore.getItemAsync("jwt");
    const userId = await SecureStore.getItemAsync("userId");

    if (!token || !userId) {
        throw new Error("Not authenticated");
    }

    const response = await fetch(`${BASE_URL}/notifications/read-all`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            id: userId,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to mark all notifications as read");
    }
};

export const deleteNotification = async (
    notificationId: string
): Promise<void> => {
    const token = await SecureStore.getItemAsync("jwt");
    const userId = await SecureStore.getItemAsync("userId");

    if (!token || !userId) {
        throw new Error("Not authenticated");
    }

    const response = await fetch(`${BASE_URL}/notifications/${notificationId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            id: userId,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to delete notification");
    }
};
