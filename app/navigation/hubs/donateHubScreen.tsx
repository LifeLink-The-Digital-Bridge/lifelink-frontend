import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
  RefreshControl,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../../utils/theme-context";
import { lightTheme, darkTheme } from "../../../constants/styles/authStyles";
import { createUnifiedStyles } from "../../../constants/styles/unifiedStyles";
import { fetchDonorData, fetchDonorByUserId } from "../../api/donorApi";
import { useAuth } from "../../../utils/auth-context";
import { DonorRegistrationPrompt } from "../../../components/donor/DonorRegistrationPrompt";
import { DonateProfile } from "../../../components/donor/DonateProfile";
import { DonateActions } from "../../../components/donor/DonateActions";
import { ValidationAlert } from "../../../components/common/ValidationAlert";

export default function DonateHubScreen() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

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
          await SecureStore.setItemAsync("donorData", JSON.stringify(donorData));
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
    router.push("/navigation/donorScreen");
  };

  const handleContinuePress = () => {
    router.push("/navigation/donateScreen");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>Loading donor information...</Text>
      </View>
    );
  }

  if (!donorData) {
    return <DonorRegistrationPrompt />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadDonorData}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <View style={styles.headerIconContainer}>
            <Feather name="heart" size={28} color={theme.primary} />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Donor Dashboard</Text>
            <Text style={styles.headerSubtitle}>
              Ready to make a difference
            </Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {donorData.status === "ACTIVE" ? "✓ Active" : donorData.status}
            </Text>
          </View>
        </View>

        <DonateProfile donorData={donorData} />

        <DonateActions
          onUpdatePress={handleUpdatePress}
          onContinuePress={handleContinuePress}
        />
      </ScrollView>

      <ValidationAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        type={alertType}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
}
