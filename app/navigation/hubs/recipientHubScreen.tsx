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
import { getRecipientByUserId } from "../../api/recipientApi";
import { useAuth } from "../../../utils/auth-context";
import { ValidationAlert } from "../../../components/common/ValidationAlert";

import { RecipientProfile } from "../../../components/recipient/RecipientProfile";
import { RecipientActions } from "../../../components/recipient/RecipientActions";
import { RecipientRegistrationPrompt } from "../../../components/recipient/RecipientRegistrationPrompt";

const RecipientHubScreen = () => {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

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
      console.error("Failed to fetch recipient data:", error);
      showAlert(
        "Sync Error",
        "Failed to sync your recipient information. Please check your internet connection.",
        "warning"
      );
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>Loading recipient information...</Text>
      </View>
    );
  }

  if (!recipient) {
    return <RecipientRegistrationPrompt />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadRecipientData}
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
            <Text style={styles.headerTitle}>Recipient Dashboard</Text>
            <Text style={styles.headerSubtitle}>
              Managing your healthcare needs
            </Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {recipient.availability === "AVAILABLE"
                ? "✓ Available"
                : recipient.availability}
            </Text>
          </View>
        </View>

        <RecipientProfile recipient={recipient} />

        <RecipientActions
          onUpdatePress={handleUpdatePress}
          onCreateRequestPress={handleCreateRequestPress}
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
};

export default RecipientHubScreen;
