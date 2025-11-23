import { Client, StompSubscription } from "@stomp/stompjs";
import Constants from "expo-constants";
import { useCallback, useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { NotificationDTO } from "../utils/types/notification";

const getWebSocketUrl = () => {
    const baseUrl = Constants.expoConfig?.extra?.API_URL || "http://192.168.0.7:8080";
    const host = baseUrl.replace(/^https?:\/\//, '').replace(/:\d+.*$/, '');
    const protocol = baseUrl.startsWith('https') ? 'https' : 'http';
    const wsUrl = `${protocol}://${host}:8086/ws`;
    return wsUrl;
};

interface UseNotificationWebSocketProps {
    onNotificationReceived: (notification: NotificationDTO) => void;
    userId: string | null;
}

export const useNotificationWebSocket = ({
    onNotificationReceived,
    userId,
}: UseNotificationWebSocketProps) => {
    const [connected, setConnected] = useState(false);
    const clientRef = useRef<Client | null>(null);
    const subscriptionRef = useRef<StompSubscription | null>(null);

    const connect = useCallback(async () => {
        if (!userId) {
            return;
        }

        if (clientRef.current?.active) {
            return;
        }

        try {
            const wsUrl = getWebSocketUrl();

            const client = new Client({
                webSocketFactory: () => new SockJS(wsUrl),
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
                debug: (str) => {
                },
                onConnect: () => {
                    setConnected(true);

                    const destination = `/user/${userId}/queue/notifications`;

                    subscriptionRef.current = client.subscribe(
                        destination,
                        (message) => {
                            try {
                                const rawNotification = JSON.parse(message.body);
                                const notification: NotificationDTO = {
                                    ...rawNotification,
                                    isRead: rawNotification.isRead !== undefined ? rawNotification.isRead : (rawNotification.read !== undefined ? rawNotification.read : false)
                                };
                                onNotificationReceived(notification);
                            } catch (error) {
                            }
                        },
                        {
                            userId: userId,
                        }
                    );
                },
                onDisconnect: () => {
                    setConnected(false);
                },
                onStompError: (frame) => {
                    console.error("[WebSocket] STOMP error:", frame);
                    setConnected(false);
                },
                onWebSocketError: (error) => {
                    console.error("[WebSocket] WebSocket error:", error);
                    setConnected(false);
                },
            });

            clientRef.current = client;
            client.activate();
        } catch (error) {
            console.error("[WebSocket] Connection error:", error);
            setConnected(false);
        }
    }, [userId, onNotificationReceived]);

    const disconnect = useCallback(() => {
        console.log("[WebSocket] Disconnecting...");

        if (subscriptionRef.current) {
            subscriptionRef.current.unsubscribe();
            subscriptionRef.current = null;
        }

        if (clientRef.current) {
            clientRef.current.deactivate();
            clientRef.current = null;
        }

        setConnected(false);
    }, []);

    useEffect(() => {
        if (userId) {
            connect();
        }

        return () => {
            disconnect();
        };
    }, [userId, connect, disconnect]);

    return {
        connected,
        reconnect: connect,
        disconnect,
    };
};
