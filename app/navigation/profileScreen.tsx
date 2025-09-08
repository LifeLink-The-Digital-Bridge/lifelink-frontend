import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { ProfileHeader } from "../../components/profile/ProfileHeader";
import { ThemeSettings } from "../../components/profile/ThemeSettings";
import { SegmentedControl } from "../../components/profile/SegmentedControl";
import { ProfileContent } from "../../components/profile/ProfileContent";
import { ProfileActions } from "../../components/profile/ProfileActions";
import { useProfile } from "../../hooks/useProfile";
import { useAuth } from "../../utils/auth-context";
import { useTheme } from "../../utils/theme-context";
import {
  lightTheme,
  darkTheme,
  createAuthStyles,
} from "../../constants/styles/authStyles";
import * as SecureStore from "expo-secure-store";

import {
  getRecipientByUserId,
  getRecipientRequests,
  ReceiveRequestDTO,
} from "../api/recipientApi";

const mockReviews = [
  { id: 1, text: "Great donor, very helpful!", date: "2024-06-02" },
  { id: 2, text: "Quick response, thank you!", date: "2024-05-20" },
];

const formatDate = (dateStr: string) => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const { logout } = useAuth();
  const { theme, isDark, setTheme } = useTheme();
  const currentTheme = isDark ? darkTheme : lightTheme;
  const styles = createAuthStyles(currentTheme);

  const {
    profile,
    loading,
    followLoading,
    isFollowing,
    isOwnProfile,
    handleFollow,
    handleUnfollow,
    loadProfile,
  } = useProfile();

  const [donations, setDonations] = useState<any[]>([]);
  const [donationsLoading, setDonationsLoading] = useState(false);
  const [receives, setReceives] = useState<ReceiveRequestDTO[]>([]);
  const [receivesLoading, setReceivesLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeSegment, setActiveSegment] = useState<"donations" | "reviews" | "receives">("donations");
  const [showThemeSettings, setShowThemeSettings] = useState(false);

  const loadDonations = useCallback(async () => {
    setDonationsLoading(true);
    try {
      // Use StatusScreen for detailed donation view
      setDonations([]);
    } catch (error) {
      console.error("Failed to fetch donations:", error);
      setDonations([]);
    }
    setDonationsLoading(false);
  }, []);

  const loadReceives = useCallback(async () => {
    setReceivesLoading(true);
    try {
      const recipient = await getRecipientByUserId();
      if (recipient?.id) {
        const requests = await getRecipientRequests(recipient.id);
        setReceives(requests);
      } else {
        setReceives([]);
      }
    } catch (error) {
      console.error("Failed to fetch receives:", error);
      setReceives([]);
    }
    setReceivesLoading(false);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([loadDonations(), loadReceives(), loadProfile?.()]);
    setRefreshing(false);
  }, [loadDonations, loadReceives, loadProfile]);

  useEffect(() => {
    loadDonations();
    loadReceives();
  }, []);

  const handleLogout = useCallback(async () => {
    const keysToDelete = [
      "jwt",
      "refreshToken",
      "userId",
      "email",
      "username",
      "roles",
      "gender",
      "dob",
      "donorId",
      "donorData",
      "recipientData",
    ];
    await Promise.all(keysToDelete.map((key) => SecureStore.deleteItemAsync(key)));
    await logout();
    router.replace("/(auth)/loginScreen");
  }, [logout, router]);

  const confirmLogout = useCallback(() => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => handleLogout() },
      ],
      { cancelable: true }
    );
  }, [handleLogout]);

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    setShowThemeSettings(false);
  };

  const getThemeDisplayName = (themeValue: string) => {
    switch (themeValue) {
      case "light":
        return "Light Mode";
      case "dark":
        return "Dark Mode";
      case "system":
        return "System Default";
      default:
        return "System Default";
    }
  };



  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={currentTheme.primary} />
        <Text style={{ marginTop: 10, color: currentTheme.textSecondary }}>
          Loading profile...
        </Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: currentTheme.error, fontSize: 16, marginBottom: 20 }}>
          Profile not found.
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: currentTheme.error }]}
          onPress={handleLogout}
        >
          <Feather name="log-out" size={20} color="#fff" />
          <Text style={[styles.buttonText, { marginLeft: 8 }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <ProfileHeader 
        profile={profile} 
        theme={currentTheme} 
        formatDate={formatDate} 
      />

      {isOwnProfile && (
        <ThemeSettings
          theme={currentTheme}
          currentTheme={theme}
          showThemeSettings={showThemeSettings}
          setShowThemeSettings={setShowThemeSettings}
          handleThemeChange={handleThemeChange}
          getThemeDisplayName={getThemeDisplayName}
          isDark={isDark}
        />
      )}

      <SegmentedControl
        segments={["donations", "reviews", "receives"] as const}
        activeSegment={activeSegment}
        onSegmentChange={(segment) => setActiveSegment(segment as "donations" | "reviews" | "receives")}
        theme={currentTheme}
      />

      <ProfileContent
        activeSegment={activeSegment}
        theme={currentTheme}
        donationsLoading={donationsLoading}
        receivesLoading={receivesLoading}
        donations={donations}
        receives={receives}
        mockReviews={mockReviews}
        formatDate={formatDate}
      />

      <ProfileActions
        isOwnProfile={isOwnProfile}
        isFollowing={isFollowing}
        followLoading={followLoading}
        theme={currentTheme}
        handleFollow={handleFollow}
        handleUnfollow={handleUnfollow}
        confirmLogout={confirmLogout}
      />
    </ScrollView>
  );
};

export default ProfileScreen;
