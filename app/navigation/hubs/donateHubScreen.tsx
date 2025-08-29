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
import { Feather } from '@expo/vector-icons';
import { useTheme } from "../../../utils/theme-context";
import { lightTheme, darkTheme } from "../../../constants/styles/authStyles";
import { createDonateHubStyles } from "../../../constants/styles/donateHubStyles";
import { fetchDonorData } from "../../api/donorApi";
import { DonorRegistrationPrompt } from "../../../components/donor/DonorRegistrationPrompt";
import { DonateProfile } from "../../../components/donor/DonateProfile";
import { DonateActions } from "../../../components/donor/DonateActions";
import { ValidationAlert } from "../../../components/common/ValidationAlert";

export default function DonateHubScreen() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createDonateHubStyles(theme);
  
  const [loading, setLoading] = useState(true);
  const [donorData, setDonorData] = useState<any>(null);
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info'>('info');

  const showAlert = (
    title: string,
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'info'
  ) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
  };

  const loadDonorData = useCallback(async () => {
    setLoading(true);
    setRefreshing(true);
    try {
      const donorData = await fetchDonorData();
      if (donorData) {
        setDonorData(donorData);
        await SecureStore.setItemAsync("donorData", JSON.stringify(donorData));
      } else {
        await SecureStore.deleteItemAsync("donorData");
        setDonorData(null);
      }
    } catch (error: any) {
      console.error("Failed to fetch donor data:", error);
      showAlert(
        "Sync Error", 
        "Failed to sync your donor information. Please check your internet connection.", 
        "warning"
      );
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
            <Text style={styles.headerSubtitle}>Ready to make a difference</Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {donorData.status === 'ACTIVE' ? '✓ Active' : donorData.status}
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
