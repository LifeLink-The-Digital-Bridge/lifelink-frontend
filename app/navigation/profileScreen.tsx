import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather, FontAwesome } from "@expo/vector-icons";
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
  fetchDonationsByDonorId,
  Donation,
} from "../api/donationStatusApi";
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

  const [donations, setDonations] = useState<Donation[]>([]);
  const [donationsLoading, setDonationsLoading] = useState(false);
  const [receives, setReceives] = useState<ReceiveRequestDTO[]>([]);
  const [receivesLoading, setReceivesLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeSegment, setActiveSegment] = useState<"donations" | "reviews" | "receives">("donations");
  const [showThemeSettings, setShowThemeSettings] = useState(false);

  const loadDonations = useCallback(async () => {
    const donorId = await SecureStore.getItemAsync("donorId");
    if (!donorId) return;
    setDonationsLoading(true);
    try {
      const data = await fetchDonationsByDonorId(donorId);
      setDonations(data);
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

  const renderContent = () => {
    switch (activeSegment) {
      case "donations":
        if (donationsLoading) {
          return (
            <View style={{ padding: 20, alignItems: "center" }}>
              <ActivityIndicator size="small" color={currentTheme.primary} />
              <Text style={{ marginTop: 10, color: currentTheme.textSecondary }}>
                Loading donations...
              </Text>
            </View>
          );
        }
        if (!donations.length) {
          return (
            <View style={{ padding: 20, alignItems: "center" }}>
              <Text style={{ color: currentTheme.textSecondary }}>
                No donations found.
              </Text>
            </View>
          );
        }
        return (
          <>
            {donations.slice(0, 3).map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.input, { marginBottom: 12 }]}
                onPress={() => router.push("/navigation/DonationStatusScreen")}
              >
                <Text style={{ color: currentTheme.text, fontWeight: "600", marginBottom: 4 }}>
                  {item.donationType}
                </Text>
                <Text style={{ color: currentTheme.textSecondary, marginBottom: 2 }}>
                  Date: {formatDate(item.donationDate)}
                </Text>
                <Text style={{ color: currentTheme.textSecondary, marginBottom: 2 }}>
                  Status: {item.status}
                </Text>
                {item.quantity && (
                  <Text style={{ color: currentTheme.textSecondary }}>
                    Quantity: {item.quantity}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.button, styles.secondary]}
              onPress={() => router.push("/navigation/DonationStatusScreen")}
            >
              <Text style={styles.secondaryText}>See All Donations</Text>
            </TouchableOpacity>
          </>
        );

      case "reviews":
        return (
          <>
            {mockReviews.map((review) => (
              <View key={review.id} style={[styles.input, { marginBottom: 12 }]}>
                <Text style={{ color: currentTheme.text }}>{review.text}</Text>
                <Text style={{ color: currentTheme.textSecondary, fontSize: 12 }}>
                  {formatDate(review.date)}
                </Text>
              </View>
            ))}
          </>
        );

      case "receives":
        if (receivesLoading) {
          return (
            <View style={{ padding: 20, alignItems: "center" }}>
              <ActivityIndicator size="small" color={currentTheme.primary} />
              <Text style={{ marginTop: 10, color: currentTheme.textSecondary }}>
                Loading requests...
              </Text>
            </View>
          );
        }
        if (!receives.length) {
          return (
            <View style={{ padding: 20, alignItems: "center" }}>
              <Text style={{ color: currentTheme.textSecondary }}>No receive requests found.</Text>
            </View>
          );
        }
        return (
          <>
            {receives.slice(0, 3).map((req, idx) => (
              <View key={idx} style={[styles.input, { marginBottom: 12 }]}>
                <Text style={{ color: currentTheme.text, fontWeight: "600", marginBottom: 4 }}>
                  {req.bloodType || "Unknown Type"}
                </Text>
                <Text style={{ color: currentTheme.textSecondary }}>
                  Date: {formatDate(req.requestDate)}
                </Text>
                <Text style={{ color: currentTheme.textSecondary }}>
                  Status: {req.status}
                </Text>
              </View>
            ))}
          </>
        );

      default:
        return null;
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
      <View style={[styles.headerContainer, { flexDirection: "row" }]}>
        <View style={{ alignItems: "center", marginRight: 20 }}>
          {profile.profileImageUrl ? (
            <Image source={{ uri: profile.profileImageUrl }} style={styles.profileImage} />
          ) : (
            <FontAwesome name="user-circle" size={100} color={currentTheme.primary} />
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>@{profile.username}</Text>
          <Text style={styles.subtitle}>{profile.email}</Text>
          <Text style={styles.subtitle}>{formatDate(profile.dob ?? "")}</Text>

          <View style={{ flexDirection: "row", marginTop: 16 }}>
            <View style={{ marginRight: 24 }}>
              <Text style={[styles.subtitle, { fontSize: 12 }]}>Followers</Text>
              <Text style={{ color: currentTheme.text, fontWeight: "600" }}>
                {profile.followers ?? 0}
              </Text>
            </View>
            <View>
              <Text style={[styles.subtitle, { fontSize: 12 }]}>Following</Text>
              <Text style={{ color: currentTheme.text, fontWeight: "600" }}>
                {profile.following ?? 0}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Theme Settings (Only Own Profile) */}
      {isOwnProfile && (
        <View style={styles.formSection}>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowThemeSettings(!showThemeSettings)}
          >
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Feather
                  name={isDark ? "moon" : "sun"}
                  size={20}
                  color={currentTheme.text}
                  style={{ marginRight: 12 }}
                />
                <View>
                  <Text style={{ color: currentTheme.text, fontSize: 16, fontWeight: "500" }}>
                    Theme Settings
                  </Text>
                  <Text style={{ color: currentTheme.textSecondary, fontSize: 14 }}>
                    Current: {getThemeDisplayName(theme)}
                  </Text>
                </View>
              </View>
              <Feather
                name={showThemeSettings ? "chevron-up" : "chevron-down"}
                size={20}
                color={currentTheme.textSecondary}
              />
            </View>
          </TouchableOpacity>

          {showThemeSettings && (
            <View style={{ marginTop: 8 }}>
              {(["light", "dark", "system"] as const).map((themeOption) => (
                <TouchableOpacity
                  key={themeOption}
                  style={[
                    styles.input,
                    { marginBottom: 8 },
                    theme === themeOption && { borderColor: currentTheme.primary, borderWidth: 3 },
                  ]}
                  onPress={() => handleThemeChange(themeOption)}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Feather
                        name={
                          themeOption === "light"
                            ? "sun"
                            : themeOption === "dark"
                            ? "moon"
                            : "smartphone"
                        }
                        size={18}
                        color={currentTheme.text}
                        style={{ marginRight: 12 }}
                      />
                      <Text style={{ color: currentTheme.text, fontSize: 15 }}>
                        {getThemeDisplayName(themeOption)}
                      </Text>
                    </View>
                    {theme === themeOption && (
                      <Feather name="check" size={18} color={currentTheme.primary} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Segmented Control */}
      <View style={{ flexDirection: "row", marginBottom: 20, marginHorizontal: 24 }}>
        {(["donations", "reviews", "receives"] as const).map((segment) => (
          <TouchableOpacity
            key={segment}
            style={{
              flex: 1,
              paddingVertical: 12,
              paddingHorizontal: 16,
              backgroundColor: activeSegment === segment ? currentTheme.primary : currentTheme.card,
              borderRadius: 8,
              marginHorizontal: 4,
              alignItems: "center",
            }}
            onPress={() => setActiveSegment(segment)}
          >
            <Text
              style={{
                color: activeSegment === segment ? "#fff" : currentTheme.text,
                fontWeight: "600",
                textTransform: "capitalize",
              }}
            >
              {segment}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Segment Content */}
      <View style={{ paddingHorizontal: 24 }}>{renderContent()}</View>

      {/* Action Buttons */}
      <View style={{ paddingHorizontal: 24, paddingBottom: 40 }}>
        {isOwnProfile ? (
          <>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: currentTheme.success, marginBottom: 12 }]}
              onPress={() => router.push("/navigation/editProfile")}
            >
              <Feather name="edit" size={20} color="#fff" />
              <Text style={[styles.buttonText, { marginLeft: 8 }]}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: currentTheme.error }]}
              onPress={confirmLogout}
            >
              <Feather name="log-out" size={20} color="#fff" />
              <Text style={[styles.buttonText, { marginLeft: 8 }]}>Logout</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: isFollowing ? currentTheme.textSecondary : currentTheme.primary },
            ]}
            onPress={isFollowing ? handleUnfollow : handleFollow}
            disabled={followLoading}
          >
            <Feather
              name={isFollowing ? "user-minus" : "user-plus"}
              size={20}
              color="#fff"
            />
            <Text style={[styles.buttonText, { marginLeft: 8 }]}>
              {isFollowing ? "Unfollow" : "Follow"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
