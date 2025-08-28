import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Animated,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { useAuth } from "../../utils/auth-context";
import { useTheme } from "../../utils/theme-context";
import { lightTheme, darkTheme } from "../../constants/styles/authStyles";
import { createDashboardStyles } from "../../constants/styles/dashboardStyles";
import { fetchDonorByUserId, fetchDonorData } from "../api/donorApi";

import { TopBar } from "../../components/dashboard/TopBar";
import { SidebarMenu } from "../../components/dashboard/SidebarMenu";
import { WelcomeSection } from "../../components/dashboard/WelcomeSection";
import { ChatBot } from "../../components/dashboard/ChatBot";
import { ValidationAlert } from "../../components/common/ValidationAlert";

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createDashboardStyles(theme);
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [donorId, setDonorId] = useState<string | null>(null);
  const [donorData, setDonorData] = useState<any>(null);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    roles: "",
    userId: "",
    token: "",
    refreshToken: "",
  });
  const [showChatIcon, setShowChatIcon] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  
  const [validationAlertVisible, setValidationAlertVisible] = useState(false);
  const [validationAlertMessage, setValidationAlertMessage] = useState("");
  const [validationAlertTitle, setValidationAlertTitle] = useState("");
  const [validationAlertType, setValidationAlertType] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("../(auth)/loginScreen");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        const [username, email, roles, userId, token, refreshToken] =
          await Promise.all([
            SecureStore.getItemAsync("username"),
            SecureStore.getItemAsync("email"),
            SecureStore.getItemAsync("roles"),
            SecureStore.getItemAsync("userId"),
            SecureStore.getItemAsync("jwt"),
            SecureStore.getItemAsync("refreshToken"),
          ]);
        
        setUserData({
          username: username || "",
          email: email || "",
          roles: roles || "",
          userId: userId || "",
          token: token || "",
          refreshToken: refreshToken || "",
        });
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  useEffect(() => {
    const checkDonorStatus = async () => {
      if (!userData.userId) return;
      
      try {
        let donorId = await SecureStore.getItemAsync("donorId");
        
        if (!donorId) {
          try {
            const donorData = await fetchDonorByUserId();
            if (donorData && donorData.id) {
              donorId = donorData.id;
              if (typeof donorId === "string") {
                await SecureStore.setItemAsync("donorId", donorId);
              }
              setDonorId(donorId);
              setDonorData(donorData);
              console.log('Donor profile loaded successfully');
            }
          } catch (fetchError) {
            console.log('User has not registered as a donor yet');
            setDonorId(null);
            setDonorData(null);
          }
        } else {
          try {
            const donorData = await fetchDonorData();
            setDonorData(donorData);
            setDonorId(donorId);
          } catch (fetchError) {
            console.log('Could not fetch existing donor data');
            await SecureStore.deleteItemAsync("donorId");
            setDonorId(null);
            setDonorData(null);
          }
        }
      } catch (error) {
        console.error('Unexpected error in checkDonorStatus:', error);
      }
    };
    
    checkDonorStatus();
  }, [userData.userId]);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: { nativeEvent: { contentOffset: { y: number } } }) => {
        const y = event.nativeEvent.contentOffset.y;
        setShowChatIcon(y <= 10);
      },
    }
  );

  const showValidationAlert = (
    title: string, 
    message: string, 
    type: 'success' | 'error' | 'warning' | 'info' = 'info'
  ) => {
    setValidationAlertTitle(title);
    setValidationAlertMessage(message);
    setValidationAlertType(type);
    setValidationAlertVisible(true);
  };

  const handleChatBotPress = () => {
    showValidationAlert("Chat Bot", "Chat functionality coming soon!", "info");
  };

  const handleBellPress = () => {
    showValidationAlert("Notifications", "No new notifications at the moment", "info");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>
          Loading dashboard...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SidebarMenu 
        isVisible={menuVisible}
        onClose={() => setMenuVisible(false)}
      />

      <TopBar 
        onMenuPress={() => setMenuVisible(true)}
        onBellPress={handleBellPress}
      />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <WelcomeSection username={userData.username} />
      </ScrollView>

      <ChatBot 
        visible={showChatIcon}
        onPress={handleChatBotPress}
      />

      <ValidationAlert
        visible={validationAlertVisible}
        title={validationAlertTitle}
        message={validationAlertMessage}
        type={validationAlertType}
        onClose={() => setValidationAlertVisible(false)}
      />
    </View>
  );
};

export default Dashboard;
