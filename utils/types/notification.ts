export enum NotificationType {
  DONATION_CREATED = "DONATION_CREATED",
  REQUEST_CREATED = "REQUEST_CREATED",
  DONATION_CANCELLED = "DONATION_CANCELLED",
  REQUEST_CANCELLED = "REQUEST_CANCELLED",
  MATCH_FOUND = "MATCH_FOUND",
  SYSTEM = "SYSTEM",
}

export interface NotificationDTO {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface UnreadCountResponse {
  unreadCount: number;
}

export interface NotificationContextType {
  notifications: NotificationDTO[];
  unreadCount: number;
  loading: boolean;
  connected: boolean;
  refreshNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
}
