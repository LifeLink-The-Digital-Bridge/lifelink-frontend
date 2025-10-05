import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Animated,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../../utils/auth-context";
import { useTheme } from "../../utils/theme-context";
import { useTabBar } from "../../utils/tabbar-context";
import { lightTheme, darkTheme } from "../../constants/styles/authStyles";
import { createDashboardStyles } from "../../constants/styles/dashboardStyles";
import ScrollableHeaderLayout from "../../components/common/ScrollableHeaderLayout";

import { TopBar } from "../../components/common/TopBar";
import { SidebarMenu } from "../../components/dashboard/SidebarMenu";
import { WelcomeSection } from "../../components/dashboard/WelcomeSection";
import { ChatBot } from "../../components/dashboard/ChatBot";

const TOPBAR_HEIGHT = 90;

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const { colorScheme } = useTheme();
  const { hideTabBar, showTabBar } = useTabBar();

  const isDark = colorScheme === "dark";
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createDashboardStyles(theme);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    roles: "",
    userId: "",
  });
  const [showChatIcon, setShowChatIcon] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);

  const [validationAlertVisible, setValidationAlertVisible] = useState(false);
  const [validationAlertMessage, setValidationAlertMessage] = useState("");
  const [validationAlertTitle, setValidationAlertTitle] = useState("");

  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const topBarTranslateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("../(auth)/loginScreen");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        const [username, email, roles, userId] = await Promise.all([
          SecureStore.getItemAsync("username"),
          SecureStore.getItemAsync("email"),
          SecureStore.getItemAsync("roles"),
          SecureStore.getItemAsync("userId"),
        ]);

        setUserData({
          username: username || "",
          email: email || "",
          roles: roles || "",
          userId: userId || "",
        });
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const currentScrollY = event.nativeEvent.contentOffset.y;
        const diff = currentScrollY - lastScrollY.current;

        if (diff > 0 && currentScrollY > 50) {
          Animated.timing(topBarTranslateY, {
            toValue: -TOPBAR_HEIGHT,
            duration: 200,
            useNativeDriver: true,
          }).start();
          hideTabBar();
        } else if (diff < 0 || currentScrollY <= 0) {
          Animated.timing(topBarTranslateY, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
          showTabBar();
        }

        setShowChatIcon(currentScrollY <= 10);
        lastScrollY.current = currentScrollY;
      },
    }
  );

  const showValidationAlert = (title: string, message: string) => {
    setValidationAlertTitle(title);
    setValidationAlertMessage(message);
    setValidationAlertVisible(true);
  };

  const handleChatBotPress = () => {
    showValidationAlert("Chat Bot", "Chat functionality coming soon!");
  };

  const handleBellPress = () => {
    showValidationAlert("Notifications", "No new notifications at the moment");
  };

  const alertStyles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    container: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 24,
      width: "100%",
      maxWidth: 340,
      alignItems: "center",
    },
    iconContainer: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.primary + "20",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 8,
      textAlign: "center",
    },
    message: {
      fontSize: 15,
      color: theme.textSecondary,
      textAlign: "center",
      marginBottom: 24,
      lineHeight: 22,
    },
    button: {
      backgroundColor: theme.primary,
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 10,
      width: "100%",
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
      textAlign: "center",
    },
  });

  if (loading) {
    return (
      <ScrollableHeaderLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </ScrollableHeaderLayout>
    );
  }

  return (
    <ScrollableHeaderLayout>
      <View style={{ flex: 1, overflow: "hidden" }}>
        <SidebarMenu
          isVisible={menuVisible}
          onClose={() => setMenuVisible(false)}
        />

        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            transform: [{ translateY: topBarTranslateY }],
          }}
        >
          <TopBar
            theme={theme}
            onMenuPress={() => setMenuVisible(true)}
            onBellPress={handleBellPress}
          />
        </Animated.View>

        <ScrollView
          contentContainerStyle={{
            paddingTop: TOPBAR_HEIGHT,
            paddingBottom: 120,
            paddingHorizontal: 18,
          }}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          <WelcomeSection username={userData.username} />
        </ScrollView>

        <ChatBot visible={showChatIcon} onPress={handleChatBotPress} />

        <Modal
          visible={validationAlertVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setValidationAlertVisible(false)}
        >
          <TouchableOpacity
            style={alertStyles.overlay}
            activeOpacity={1}
            onPress={() => setValidationAlertVisible(false)}
          >
            <TouchableOpacity style={alertStyles.container} activeOpacity={1}>
              <View style={alertStyles.iconContainer}>
                <Feather name="bell" size={28} color={theme.primary} />
              </View>
              <Text style={alertStyles.title}>{validationAlertTitle}</Text>
              <Text style={alertStyles.message}>{validationAlertMessage}</Text>
              <TouchableOpacity
                style={alertStyles.button}
                onPress={() => setValidationAlertVisible(false)}
              >
                <Text style={alertStyles.buttonText}>Got it</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      </View>
    </ScrollableHeaderLayout>
  );
};

export default Dashboard;
