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
import { fetchDonorHistory, fetchRecipientHistory } from "../api/matchingApi";

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
  const [matchHistory, setMatchHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeSegment, setActiveSegment] = useState<"donations" | "history" | "reviews" | "receives">("donations");
  const [showThemeSettings, setShowThemeSettings] = useState(false);

  const loadDonations = useCallback(async () => {
    setDonationsLoading(true);
    try {
      setDonations([]);
    } catch (error) {
      const errorMessage = (error as any)?.message || '';
      if (!errorMessage.includes('401') && 
          !errorMessage.includes('404') && 
          !errorMessage.includes('Donor not found')) {
        console.error("Failed to fetch donations:", error);
      }
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
        setReceives(requests || []);
      } else {
        setReceives([]);
      }
    } catch (error) {
      const errorMessage = (error as any)?.message || '';
      if (!errorMessage.includes('401') && 
          !errorMessage.includes('404') && 
          !errorMessage.includes('Recipient not found') &&
          !errorMessage.includes('Failed to fetch recipient')) {
        console.error("Failed to fetch receives:", error);
      }
      setReceives([]);
    }
    setReceivesLoading(false);
  }, []);

  const loadMatchHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const userId = await SecureStore.getItemAsync('userId');
      if (!userId) return;

      const [donorHistory, recipientHistory] = await Promise.all([
        fetchDonorHistory(userId).catch(() => []),
        fetchRecipientHistory(userId).catch(() => [])
      ]);

      const combined = [
        ...donorHistory.map((h: any) => ({
          matchId: h.matchId,
          otherPartyName: h.recipientSnapshot?.userId || 'Unknown',
          otherPartyRole: 'Recipient' as const,
          matchType: h.matchType,
          matchedAt: h.matchedAt,
          isConfirmed: h.confirmed,
          donationOrRequestType: h.donationType
        })),
        ...recipientHistory.map((h: any) => ({
          matchId: h.matchId,
          otherPartyName: h.donorSnapshot?.userId || 'Unknown',
          otherPartyRole: 'Donor' as const,
          matchType: h.matchType,
          matchedAt: h.matchedAt,
          isConfirmed: h.confirmed,
          donationOrRequestType: h.requestType
        }))
      ];

      combined.sort((a, b) => new Date(b.matchedAt).getTime() - new Date(a.matchedAt).getTime());
      setMatchHistory(combined);
    } catch (error) {
      console.error('Failed to fetch match history:', error);
      setMatchHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([loadDonations(), loadReceives(), loadMatchHistory(), loadProfile?.()]);
    setRefreshing(false);
  }, [loadDonations, loadReceives, loadMatchHistory, loadProfile]);

  useEffect(() => {
    loadDonations();
    loadReceives();
    loadMatchHistory();
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
        segments={["donations", "history", "reviews", "receives"] as const}
        activeSegment={activeSegment}
        onSegmentChange={(segment) => setActiveSegment(segment as "donations" | "history" | "reviews" | "receives")}
        theme={currentTheme}
      />

      <ProfileContent
        activeSegment={activeSegment}
        theme={currentTheme}
        donationsLoading={donationsLoading}
        receivesLoading={receivesLoading}
        historyLoading={historyLoading}
        donations={donations}
        receives={receives}
        matchHistory={matchHistory}
        mockReviews={mockReviews}
        formatDate={formatDate}
      />

      <ProfileActions
        isOwnProfile={!!isOwnProfile}
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
