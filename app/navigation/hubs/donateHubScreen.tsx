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
import { useTheme } from "../../../utils/theme-context";
import { lightTheme, darkTheme } from "../../../constants/styles/authStyles";
import { createUnifiedStyles } from "../../../constants/styles/unifiedStyles";
import { fetchDonorData, fetchDonorByUserId } from "../../api/donorApi";
import { useAuth } from "../../../utils/auth-context";
import { DonorRegistrationPrompt } from "../../../components/donor/DonorRegistrationPrompt";
import { DonateProfile } from "../../../components/donor/DonateProfile";
import { DonateActions } from "../../../components/donor/DonateActions";
import { ValidationAlert } from "../../../components/common/ValidationAlert";
import { StatusHeader } from "@/components/common/StatusHeader";
import { useTabBar } from "../../../utils/tabbar-context";
import ScrollableHeaderLayout from "@/components/common/ScrollableHeaderLayout";

const HEADER_HEIGHT = 120;

export default function DonateHubScreen() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  const { hideTabBar, showTabBar } = useTabBar();
  const lastScrollY = useRef(0);
  const headerTranslateY = useRef(new Animated.Value(0)).current;

  const [loading, setLoading] = useState(true);
  const [donorData, setDonorData] = useState<any>(null);
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<
    "success" | "error" | "warning" | "info"
  >("info");
  const { isAuthenticated } = useAuth();

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

  const loadDonorData = useCallback(async () => {
    setLoading(true);
    setRefreshing(true);
    try {
      let donorData = await fetchDonorByUserId();

      if (donorData && donorData.id) {
        await SecureStore.setItemAsync("donorId", donorData.id);
        await SecureStore.setItemAsync("donorData", JSON.stringify(donorData));
        setDonorData(donorData);
      } else {
        const cachedDonorId = await SecureStore.getItemAsync("donorId");
        if (cachedDonorId) {
          donorData = await fetchDonorData();
          if (donorData) {
            setDonorData(donorData);
            await SecureStore.setItemAsync(
              "donorData",
              JSON.stringify(donorData)
            );
          } else {
            await SecureStore.deleteItemAsync("donorData");
            await SecureStore.deleteItemAsync("donorId");
            setDonorData(null);
          }
        } else {
          await SecureStore.deleteItemAsync("donorData");
          setDonorData(null);
        }
      }
    } catch (error: any) {
      console.error("Failed to fetch donor data:", error);
      if (
        !error.message?.includes("401") &&
        !error.message?.includes("404") &&
        !error.message?.includes("Donor not found")
      ) {
        showAlert(
          "Sync Error",
          "Failed to sync your donor information. Please check your internet connection.",
          "warning"
        );
      }
      await SecureStore.deleteItemAsync("donorData");
      setDonorData(null);
    }
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      const data = await SecureStore.getItemAsync("donorData");
      if (data) {
        setDonorData(JSON.parse(data));
        setLoading(false);
        return;
      }
      await loadDonorData();
    };
    loadInitialData();
  }, [loadDonorData]);

  const handleUpdatePress = () => {
    router.push("/navigation/donorscreens/donorScreen");
  };

  const handleContinuePress = () => {
    router.push("/navigation/donorscreens/donateScreen");
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
          <Text style={styles.loadingText}>Loading donor information...</Text>
        </View>
      </ScrollableHeaderLayout>
    );
  }

  if (!donorData) {
    return (
      <ScrollableHeaderLayout>
        <DonorRegistrationPrompt />
      </ScrollableHeaderLayout>
    );
  }

  return (
    <ScrollableHeaderLayout>
      <View style={{ flex: 1, overflow: "hidden" }}>
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
            title="Donor Dashboard"
            subtitle="Ready to make a difference"
            iconName="heart"
            statusText={donorData?.status === "ACTIVE" ? "Active" : "Inactive"}
            statusColor={
              donorData?.status === "ACTIVE" ? theme.success : theme.error
            }
            theme={theme}
          />
        </Animated.View>

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
              onRefresh={loadDonorData}
              tintColor={theme.primary}
              colors={[theme.primary]}
              progressViewOffset={HEADER_HEIGHT}
            />
          }
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
        >
          <DonateProfile donorData={donorData} />
          <DonateActions
            onUpdatePress={handleUpdatePress}
            onContinuePress={handleContinuePress}
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
}
