import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
  RefreshControl,
  Animated,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../../utils/theme-context";
import { lightTheme, darkTheme } from "../../../constants/styles/authStyles";
import { createUnifiedStyles } from "../../../constants/styles/unifiedStyles";
import { getRecipientByUserId } from "../../api/recipientApi";
import { useAuth } from "../../../utils/auth-context";
import { ValidationAlert } from "../../../components/common/ValidationAlert";
import { useTabBar } from "../../../utils/tabbar-context";

import { RecipientProfile } from "../../../components/recipient/RecipientProfile";
import { RecipientActions } from "../../../components/recipient/RecipientActions";
import { RecipientRegistrationPrompt } from "../../../components/recipient/RecipientRegistrationPrompt";
import { StatusHeader } from "@/components/common/StatusHeader";
import ScrollableHeaderLayout from "@/components/common/ScrollableHeaderLayout";

const HEADER_HEIGHT = 120; // ✅ Matches DonorHub

const RecipientHubScreen = () => {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  const { hideTabBar, showTabBar } = useTabBar();
  const lastScrollY = useRef(0);
  const headerTranslateY = useRef(new Animated.Value(0)).current;

  const [loading, setLoading] = useState(true);
  const [recipient, setRecipient] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<
    "success" | "error" | "warning" | "info"
  >("info");

  const showAlert = (
    title: string,
    message: string,
    type: "success" | "error" | "warning" | "info" = "info"
  ) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("../(auth)/loginScreen");
    }
  }, [isAuthenticated]);

  const loadRecipientData = useCallback(async () => {
    setLoading(true);
    setRefreshing(true);
    try {
      const recipientData = await getRecipientByUserId();
      if (recipientData) {
        setRecipient(recipientData);
        await SecureStore.setItemAsync(
          "recipientData",
          JSON.stringify(recipientData)
        );
      } else {
        await SecureStore.deleteItemAsync("recipientData");
        setRecipient(null);
      }
    } catch (error: any) {
      if (
        !error.message?.includes("401") &&
        !error.message?.includes("404") &&
        !error.message?.includes("Recipient not found")
      ) {
        console.error("Failed to fetch recipient data:", error);
        showAlert(
          "Sync Error",
          "Failed to sync your recipient information. Please check your internet connection.",
          "warning"
        );
      }
      await SecureStore.deleteItemAsync("recipientData");
      setRecipient(null);
    }
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      const data = await SecureStore.getItemAsync("recipientData");
      if (data) {
        setRecipient(JSON.parse(data));
        setLoading(false);
        return;
      }
      await loadRecipientData();
    };
    loadInitialData();
  }, [loadRecipientData]);

  const handleUpdatePress = () => {
    router.push("/navigation/RecipientScreen");
  };

  const handleCreateRequestPress = () => {
    router.push("/navigation/RecipientRequestScreen");
  };

  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const diff = currentScrollY - lastScrollY.current;

    if (diff > 0 && currentScrollY > 50) {
      Animated.timing(headerTranslateY, {
        toValue: -HEADER_HEIGHT,
        duration: 200,
        useNativeDriver: true,
      }).start();
      hideTabBar();
    } else if (diff < 0 || currentScrollY <= 0) {
      Animated.timing(headerTranslateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      showTabBar();
    }

    lastScrollY.current = currentScrollY;
  };

  if (loading) {
    return (
      <ScrollableHeaderLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>
            Loading recipient information...
          </Text>
        </View>
      </ScrollableHeaderLayout>
    );
  }

  if (!recipient) {
    return (
      <ScrollableHeaderLayout>
        <RecipientRegistrationPrompt />
      </ScrollableHeaderLayout>
    );
  }

  return (
    <ScrollableHeaderLayout>
      {/* ✅ Container with overflow hidden */}
      <View style={{ flex: 1, overflow: "hidden" }}>
        {/* ✅ Header */}
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 999,
            transform: [{ translateY: headerTranslateY }],
            backgroundColor: theme.background,
          }}
        >
          <StatusHeader
            title="Recipient Dashboard"
            subtitle="Managing your healthcare needs"
            iconName="heart"
            statusText="Available"
            statusColor={theme.success}
            theme={theme}
          />
        </Animated.View>

        {/* ✅ ScrollView */}
        <ScrollView
          contentContainerStyle={{
            paddingTop: HEADER_HEIGHT + 10,
            paddingHorizontal: 20,
            paddingBottom: 140,
          }}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={loadRecipientData}
              tintColor={theme.primary}
              colors={[theme.primary]}
              progressViewOffset={HEADER_HEIGHT}
            />
          }
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
        >
          <RecipientProfile recipient={recipient} />

          <RecipientActions
            onUpdatePress={handleUpdatePress}
            onCreateRequestPress={handleCreateRequestPress}
          />
        </ScrollView>
      </View>

      <ValidationAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        type={alertType}
        onClose={() => setAlertVisible(false)}
      />
    </ScrollableHeaderLayout>
  );
};

export default RecipientHubScreen;
