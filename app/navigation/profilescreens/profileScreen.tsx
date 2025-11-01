import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Alert,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Animated,
  BackHandler,
} from "react-native";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { TopBar } from "../../../components/common/TopBar";
import { ProfileHeader } from "../../../components/profile/ProfileHeader";
import { ProfileTabs } from "../../../components/profile/ProfileTabs";
import { ProfileContent } from "../../../components/profile/ProfileContent";
import { ProfileActions } from "../../../components/profile/ProfileActions";
import { ThemeModal } from "../../../components/profile/ThemeModal";
import { SidebarMenu } from "../../../components/dashboard/SidebarMenu";
import { useProfile } from "../../../hooks/useProfile";
import { useAuth } from "../../../utils/auth-context";
import { useTheme } from "../../../utils/theme-context";
import { useTabBar } from "../../../utils/tabbar-context";
import { lightTheme, darkTheme } from "../../../constants/styles/authStyles";
import { createProfileStyles } from "../../../constants/styles/profileStyles";
import * as SecureStore from "expo-secure-store";
import { getMyDonations, fetchDonationsByUserId } from "../../api/donationApi";
import {
  getFollowersCount,
  getFollowingCount,
  getUserProfile,
  UserProfile,
} from "../../api/userApi";
import {
  getMyRequests,
  fetchRequestsByUserId,
  ReceiveRequestDTO,
} from "../../api/requestApi";
import ScrollableHeaderLayout from "../../../components/common/ScrollableHeaderLayout";

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

const TOPBAR_HEIGHT = 90;

const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const { logout } = useAuth();
  const { theme, isDark, setTheme } = useTheme();
  const { hideTabBar, showTabBar } = useTabBar();
  const currentTheme = isDark ? darkTheme : lightTheme;
  const styles = createProfileStyles(currentTheme);
  const params = useLocalSearchParams();
  const searchedUsername = params.username as string | undefined;
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const [ownProfileCounts, setOwnProfileCounts] = useState<{
    followersCount?: number;
    followingCount?: number;
  }>({});

  const [currentUser, setCurrentUser] = useState<string>("");
  const [viewingProfile, setViewingProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [bellAlertVisible, setBellAlertVisible] = useState(false);
  const [profileNotFound, setProfileNotFound] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const topBarTranslateY = useRef(new Animated.Value(0)).current;

  const {
    profile,
    loading,
    followLoading,
    isFollowing,
    handleFollow,
    handleUnfollow,
    loadProfile,
  } = useProfile();

  const [donations, setDonations] = useState<any[]>([]);
  const [donationsLoading, setDonationsLoading] = useState(false);
  const [receives, setReceives] = useState<ReceiveRequestDTO[]>([]);
  const [receivesLoading, setReceivesLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"donations" | "reviews" | "receives">("donations");
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [canViewProfile, setCanViewProfile] = useState<boolean>(false);
  const [checkingAccess, setCheckingAccess] = useState<boolean>(false);

  const isOwnProfile = !searchedUsername || searchedUsername === currentUser;
  const displayProfile = isOwnProfile
    ? profile
      ? { ...profile, ...ownProfileCounts }
      : null
    : viewingProfile;

  const alertStyles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    container: {
      backgroundColor: currentTheme.card,
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
      backgroundColor: currentTheme.primary + "20",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: "700",
      color: currentTheme.text,
      marginBottom: 8,
      textAlign: "center",
    },
    message: {
      fontSize: 15,
      color: currentTheme.textSecondary,
      textAlign: "center",
      marginBottom: 24,
      lineHeight: 22,
    },
    button: {
      backgroundColor: currentTheme.primary,
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

  useFocusEffect(
    useCallback(() => {
      if (!searchedUsername) {
        setViewingProfile(null);
        setProfileNotFound(false);
        if (loadProfile) {
          loadProfile();
        }
      }
    }, [searchedUsername, loadProfile])
  );

  useEffect(() => {
    const loadCurrentUser = async () => {
      const username = await SecureStore.getItemAsync("username");
      if (username) {
        setCurrentUser(username);
      }
    };
    loadCurrentUser();
  }, []);

  const loadOwnProfileCounts = useCallback(async () => {
    if (!profile?.id) return;

    try {
      const [followersCount, followingCount] = await Promise.all([
        getFollowersCount(profile.id),
        getFollowingCount(profile.id),
      ]);

      setOwnProfileCounts({ followersCount, followingCount });
    } catch (error) {
      console.error("Error loading own profile counts:", error);
    }
  }, [profile?.id]);

  useEffect(() => {
    if (isOwnProfile && profile && profile.id) {
      loadOwnProfileCounts();
    }
  }, [isOwnProfile, profile?.id, loadOwnProfileCounts]);

  useEffect(() => {
    if (searchedUsername && searchedUsername !== currentUser) {
      loadOtherUserProfile(searchedUsername);
    }
  }, [searchedUsername, currentUser]);

  const loadOtherUserProfile = async (username: string) => {
    setProfileLoading(true);
    setProfileNotFound(false);
    try {
      const userProfile = await getUserProfile(username);

      const [followersCount, followingCount] = await Promise.all([
        getFollowersCount(userProfile.id),
        getFollowingCount(userProfile.id),
      ]);

      setViewingProfile({
        ...userProfile,
        followersCount,
        followingCount,
      });
    } catch (error) {
      console.error("Error loading user profile:", error);
      setProfileNotFound(true);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    if (isOwnProfile) {
      if (!loading && !profile) {
        setProfileNotFound(true);
      } else if (profile) {
        setCanViewProfile(true);
        setCheckingAccess(false);
        setProfileNotFound(false);
      }
      return;
    }

    if (!displayProfile) {
      setCanViewProfile(false);
      setCheckingAccess(false);
      return;
    }

    setCheckingAccess(true);

    const checkProfileAccess = async () => {
      try {
        const visibility = displayProfile.profileVisibility;

        if (visibility === "PUBLIC") {
          setCanViewProfile(true);
        } else if (visibility === "PRIVATE") {
          setCanViewProfile(false);
        } else if (visibility === "FOLLOWERS_ONLY") {
          setCanViewProfile(true);
        }
      } catch (error) {
        console.error("Error checking profile access:", error);
        setCanViewProfile(false);
      } finally {
        setCheckingAccess(false);
      }
    };

    checkProfileAccess();
  }, [displayProfile, isOwnProfile, profile, loading]);

  const loadDonations = useCallback(async () => {
    setDonationsLoading(true);
    try {
      const donationsList = await getMyDonations();
      setDonations(donationsList || []);
    } catch (error) {
      const errorMessage = (error as any)?.message || "";
      if (
        !errorMessage.includes("401") &&
        !errorMessage.includes("404") &&
        !errorMessage.includes("Donor not found")
      ) {
        console.error("Failed to fetch donations:", error);
      }
      setDonations([]);
    } finally {
      setDonationsLoading(false);
    }
  }, []);

  const loadOtherUserDonations = useCallback(
    async (userId: string) => {
      if (!canViewProfile && !checkingAccess) return;

      setDonationsLoading(true);
      try {
        const donations = await fetchDonationsByUserId(userId);
        setDonations(donations || []);
      } catch (error) {
        console.error("Error loading other user donations:", error);
        setDonations([]);
      } finally {
        setDonationsLoading(false);
      }
    },
    [canViewProfile, checkingAccess]
  );

  const loadReceives = useCallback(async () => {
    setReceivesLoading(true);
    try {
      const requests = await getMyRequests();
      setReceives(requests || []);
    } catch (error) {
      const errorMessage = (error as any)?.message || "";
      if (
        !errorMessage.includes("401") &&
        !errorMessage.includes("404") &&
        !errorMessage.includes("Recipient not found")
      ) {
        console.error("Failed to fetch receives:", error);
      }
      setReceives([]);
    } finally {
      setReceivesLoading(false);
    }
  }, []);

  const loadOtherUserRequests = useCallback(
    async (userId: string) => {
      if (!canViewProfile && !checkingAccess) return;

      setReceivesLoading(true);
      try {
        const requests = await fetchRequestsByUserId(userId);
        setReceives(requests || []);
      } catch (error) {
        console.error("Error loading other user requests:", error);
        setReceives([]);
      } finally {
        setReceivesLoading(false);
      }
    },
    [canViewProfile, checkingAccess]
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (isOwnProfile) {
      await Promise.all([
        loadDonations(),
        loadReceives(),
        loadProfile?.(),
        loadOwnProfileCounts(),
      ]);
    } else if (viewingProfile) {
      await loadOtherUserProfile(viewingProfile.username);
      if (canViewProfile) {
        await Promise.all([
          loadOtherUserDonations(viewingProfile.id),
          loadOtherUserRequests(viewingProfile.id),
        ]);
      }
    }
    setRefreshing(false);
  }, [
    isOwnProfile,
    canViewProfile,
    viewingProfile,
    loadDonations,
    loadReceives,
    loadProfile,
    loadOwnProfileCounts,
  ]);

  const donationsLoadedRef = useRef(false);
  const receivesLoadedRef = useRef(false);

  useEffect(() => {
    if (isOwnProfile) {
      if (!donationsLoadedRef.current) {
        loadDonations();
        donationsLoadedRef.current = true;
      }
      if (!receivesLoadedRef.current) {
        loadReceives();
        receivesLoadedRef.current = true;
      }
    } else if (displayProfile && canViewProfile && !checkingAccess) {
      if (!donationsLoadedRef.current) {
        loadOtherUserDonations(displayProfile.id);
        donationsLoadedRef.current = true;
      }
      if (!receivesLoadedRef.current) {
        loadOtherUserRequests(displayProfile.id);
        receivesLoadedRef.current = true;
      }
    }
  }, [isOwnProfile, canViewProfile, checkingAccess, displayProfile?.id]);

  useEffect(() => {
    donationsLoadedRef.current = false;
    receivesLoadedRef.current = false;
  }, [displayProfile?.id, isOwnProfile]);

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

        lastScrollY.current = currentScrollY;
      },
    }
  );

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
      'locationId',
      'addresses',
      'selectedAddress',
      'userLocation'
    ];
    await Promise.all(
      keysToDelete.map((key) => SecureStore.deleteItemAsync(key))
    );
    await logout();
    router.replace("/(auth)/loginScreen");
  }, [logout, router]);

  const confirmLogout = useCallback(() => {
    setShowThemeModal(false);
    setShowLogoutConfirm(true);
  }, []);

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    setShowThemeModal(false);
  };

  const handleBellPress = () => {
    setBellAlertVisible(true);
  };

  const handleBackPress = useCallback(() => {
    if (searchedUsername) {
      setViewingProfile(null);
      setProfileNotFound(false);
      setDonations([]);
      setReceives([]);
      router.replace("/(tabs)/profile");
      return true;
    }
    return false;
  }, [searchedUsername, router]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    return () => backHandler.remove();
  }, [handleBackPress]);

  useEffect(() => {
    if (profileNotFound && isOwnProfile && !loading) {
      const timeoutId = setTimeout(() => {
        Alert.alert(
          "Session Expired",
          "Your profile could not be loaded. Please login again.",
          [
            {
              text: "OK",
              onPress: () => handleLogout(),
            },
          ],
          { cancelable: false }
        );
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [profileNotFound, isOwnProfile, loading, handleLogout]);

  if (loading || profileLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={currentTheme.primary} />
        <Text style={{ marginTop: 10, color: currentTheme.textSecondary }}>
          Loading profile...
        </Text>
      </View>
    );
  }

  if (profileNotFound && !isOwnProfile) {
    return (
      <View style={styles.container}>
        <View
          style={[
            alertStyles.overlay,
            { backgroundColor: currentTheme.background },
          ]}
        >
          <View style={alertStyles.container}>
            <View
              style={[
                alertStyles.iconContainer,
                { backgroundColor: currentTheme.error + "20" },
              ]}
            >
              <Feather name="user-x" size={32} color={currentTheme.error} />
            </View>
            <Text style={alertStyles.title}>User Not Found</Text>
            <Text style={alertStyles.message}>
              The user you're looking for doesn't exist or has been removed
            </Text>
            <TouchableOpacity
              style={[
                alertStyles.button,
                {
                  backgroundColor: currentTheme.error,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                },
              ]}
              onPress={handleBackPress}
            >
              <Feather name="arrow-left" size={18} color="#fff" />
              <Text style={[alertStyles.buttonText, { marginLeft: 8 }]}>
                Go Back
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  if (!displayProfile) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={currentTheme.primary} />
      </View>
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
            theme={currentTheme}
            onMenuPress={() => setMenuVisible(true)}
            onBellPress={handleBellPress}
            showBackButton={!isOwnProfile}
            showSettingsButton={false}
            onBack={handleBackPress}
            onSettingsPress={() => setShowThemeModal(true)}
          />
        </Animated.View>
        <ScrollView
          contentContainerStyle={{
            paddingTop: TOPBAR_HEIGHT,
            paddingBottom: 120,
          }}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[currentTheme.primary]}
              progressViewOffset={TOPBAR_HEIGHT}
            />
          }
        >
          <ProfileHeader
            profile={displayProfile}
            theme={currentTheme}
            formatDate={formatDate}
            isOwnProfile={isOwnProfile}
            onSettingsPress={() => setShowThemeModal(true)}
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

          <ProfileTabs
            tabs={["donations", "reviews", "receives"]}
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab as any)}
            theme={currentTheme}
          />

          <ProfileContent
            activeTab={activeTab}
            theme={currentTheme}
            isOwnProfile={isOwnProfile}
            canViewProfile={canViewProfile}
            checkingAccess={checkingAccess}
            donationsLoading={donationsLoading}
            receivesLoading={receivesLoading}
            donations={donations}
            receives={receives}
            mockReviews={mockReviews}
            formatDate={formatDate}
          />
        </ScrollView>
        {isOwnProfile && (
          <ThemeModal
            visible={showThemeModal}
            onClose={() => setShowThemeModal(false)}
            theme={currentTheme}
            currentTheme={theme}
            onThemeChange={handleThemeChange}
            isDark={isDark}
            onLogout={confirmLogout}
          />
        )}

        <Modal
          visible={showLogoutConfirm}
          transparent
          animationType="fade"
          onRequestClose={() => setShowLogoutConfirm(false)}
        >
          <View style={alertStyles.overlay}>
            <View style={[alertStyles.container, { minWidth: 300 }]}>
              <View
                style={[
                  alertStyles.iconContainer,
                  { backgroundColor: currentTheme.error + "20" },
                ]}
              >
                <Feather name="log-out" size={28} color={currentTheme.error} />
              </View>
              <Text style={alertStyles.title}>Confirm Logout</Text>
              <Text style={alertStyles.message}>
                Are you sure you want to logout? You will need to sign in again to access your account.
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  gap: 12,
                  width: "100%",
                }}
              >
                <TouchableOpacity
                  style={[
                    alertStyles.button,
                    {
                      flex: 1,
                      backgroundColor: "transparent",
                      borderWidth: 1,
                      borderColor: currentTheme.border,
                    },
                  ]}
                  onPress={() => setShowLogoutConfirm(false)}
                >
                  <Text style={[alertStyles.buttonText, { color: currentTheme.text }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    alertStyles.button,
                    {
                      flex: 1,
                      backgroundColor: currentTheme.error,
                    },
                  ]}
                  onPress={() => {
                    setShowLogoutConfirm(false);
                    handleLogout();
                  }}
                >
                  <Text style={alertStyles.buttonText}>Logout</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          visible={bellAlertVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setBellAlertVisible(false)}
        >
          <TouchableOpacity
            style={alertStyles.overlay}
            activeOpacity={1}
            onPress={() => setBellAlertVisible(false)}
          >
            <TouchableOpacity style={alertStyles.container} activeOpacity={1}>
              <View style={alertStyles.iconContainer}>
                <Feather name="bell" size={28} color={currentTheme.primary} />
              </View>
              <Text style={alertStyles.title}>Notifications</Text>
              <Text style={alertStyles.message}>
                No new notifications at the moment
              </Text>
              <TouchableOpacity
                style={alertStyles.button}
                onPress={() => setBellAlertVisible(false)}
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

export default ProfileScreen;
