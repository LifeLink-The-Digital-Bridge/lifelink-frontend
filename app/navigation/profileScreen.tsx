import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { useProfile } from "../../hooks/useProfile";
import { useAuth } from "../../utils/auth-context";
import * as SecureStore from "expo-secure-store";
import styles from "../../constants/styles/profileStyles";
import { useState, useEffect, useCallback } from "react";
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
  const [activeSegment, setActiveSegment] = useState("donations");

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
    await Promise.all(
      keysToDelete.map((key) => SecureStore.deleteItemAsync(key))
    );
    await logout();
    router.replace("/(auth)/loginScreen");
  }, [logout, router]);
  const confirmLogout = useCallback(() => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: () => handleLogout(),
        },
      ],
      { cancelable: true }
    );
  }, [handleLogout]);

  const onFollow = useCallback(async () => {
    try {
      await handleFollow();
      Alert.alert("Success", "You are now following this user.");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to follow user");
    }
  }, [handleFollow]);

  const onUnfollow = useCallback(async () => {
    try {
      await handleUnfollow();
      Alert.alert("Success", "You have unfollowed this user.");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to unfollow user");
    }
  }, [handleUnfollow]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0984e3" />
        <Text style={{ marginTop: 10, color: "#636e72" }}>
          Loading profile...
        </Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Profile not found.</Text>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#d63031" }]}
          onPress={handleLogout}
        >
          <Feather name="log-out" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderContent = () => {
    switch (activeSegment) {
      case "donations":
        if (donationsLoading) {
          return (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#0984e3" />
              <Text style={{ marginTop: 10, color: "#636e72" }}>
                Loading donations...
              </Text>
            </View>
          );
        }
        if (!donations.length) {
          return (
            <View style={styles.contentItem}>
              <Text style={styles.contentItemText}>No donations found.</Text>
            </View>
          );
        }
        return (
          <>
            {donations.slice(0, 3).map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.contentItem}
                onPress={() => router.push("/navigation/DonationStatusScreen")}
              >
                <Text style={styles.contentItemTitle}>{item.donationType}</Text>
                <Text style={styles.contentItemText}>
                  Date: {formatDate(item.donationDate)}
                </Text>
                <Text style={styles.contentItemText}>
                  Status: {item.status}
                </Text>
                {item.quantity && (
                  <Text style={styles.contentItemText}>
                    Quantity: {item.quantity}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.seeAllButton}
              onPress={() => router.push("/navigation/DonationStatusScreen")}
            >
              <Text style={styles.seeAllButtonText}>See All Donations</Text>
            </TouchableOpacity>
          </>
        );
      case "reviews":
        return mockReviews.map((item) => (
          <View key={item.id} style={styles.contentItem}>
            <Text style={styles.contentItemTitle}>Review</Text>
            <Text style={styles.contentItemText}>{item.text}</Text>
            <Text style={styles.contentItemText}>
              Date: {formatDate(item.date)}
            </Text>
          </View>
        ));
      case "receives":
        if (receivesLoading) {
          return (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#0984e3" />
              <Text style={{ marginTop: 10, color: "#636e72" }}>
                Loading receives...
              </Text>
            </View>
          );
        }
        if (!receives.length) {
          return (
            <View style={styles.contentItem}>
              <Text style={styles.contentItemText}>
                No receive requests found.
              </Text>
            </View>
          );
        }
        return (
          <>
            {receives.slice(0, 3).map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.contentItem}
                onPress={() => router.push("/navigation/RecipientStatusScreen")}
              >
                <Text style={styles.contentItemTitle}>
                  {item.requestedOrgan || item.requestedBloodType}
                </Text>
                <Text style={styles.contentItemText}>
                  Date: {formatDate(item.requestDate)}
                </Text>
                <Text style={styles.contentItemText}>
                  Status: {item.status}
                </Text>
                {item.quantity && (
                  <Text style={styles.contentItemText}>
                    Quantity: {item.quantity}
                  </Text>
                )}
                {item.urgencyLevel && (
                  <Text style={styles.contentItemText}>
                    Urgency: {item.urgencyLevel}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.seeAllButton}
              onPress={() => router.push("/navigation/RecipientStatusScreen")}
            >
              <Text style={styles.seeAllButtonText}>See All Receives</Text>
            </TouchableOpacity>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          {profile.profileImageUrl ? (
            <Image
              source={{ uri: profile.profileImageUrl }}
              style={styles.profileImage}
            />
          ) : (
            <FontAwesome name="user-circle" size={100} color="#0984e3" />
          )}
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.username}>@{profile.username}</Text>
          <Text style={styles.email}>{profile.email}</Text>
          <Text style={styles.dob}>{formatDate(profile.dob ?? "")}</Text>
        </View>
      </View>

      <View style={styles.statRow}>
        <View style={styles.statItem}>
          <Feather
            name="users"
            size={20}
            color="#636e72"
            style={styles.statIcon}
          />
          <Text style={styles.statLabel}>Followers</Text>
          <Text style={styles.statValue}>{profile.followers ?? 0}</Text>
        </View>
        <View style={styles.statItem}>
          <Feather
            name="user-plus"
            size={20}
            color="#636e72"
            style={styles.statIcon}
          />
          <Text style={styles.statLabel}>Following</Text>
          <Text style={styles.statValue}>{profile.following ?? 0}</Text>
        </View>
      </View>

      <View style={styles.segmentedControl}>
        <TouchableOpacity
          style={[
            styles.segment,
            activeSegment === "donations" && styles.segmentActive,
          ]}
          onPress={() => setActiveSegment("donations")}
        >
          <Text
            style={[
              styles.segmentText,
              activeSegment === "donations" && styles.segmentTextActive,
            ]}
          >
            Donations
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.segment,
            activeSegment === "reviews" && styles.segmentActive,
          ]}
          onPress={() => setActiveSegment("reviews")}
        >
          <Text
            style={[
              styles.segmentText,
              activeSegment === "reviews" && styles.segmentTextActive,
            ]}
          >
            Reviews
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.segment,
            activeSegment === "receives" && styles.segmentActive,
          ]}
          onPress={() => setActiveSegment("receives")}
        >
          <Text
            style={[
              styles.segmentText,
              activeSegment === "receives" && styles.segmentTextActive,
            ]}
          >
            Receives
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentGrid}>{renderContent()}</View>

      <View style={styles.actionsContainer}>
        {isOwnProfile && (
          <>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: "#00b894" }]}
              onPress={() => router.push("/navigation/editProfile")}
            >
              <Feather name="edit" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: "#d63031" }]}
              onPress={confirmLogout}
            >
              <Feather name="log-out" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Logout</Text>
            </TouchableOpacity>
          </>
        )}
        {!isOwnProfile && (
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: isFollowing ? "#636e72" : "#0984e3" },
            ]}
            onPress={isFollowing ? onUnfollow : onFollow}
            disabled={followLoading}
          >
            <Feather
              name={isFollowing ? "user-minus" : "user-plus"}
              size={20}
              color="#fff"
            />
            <Text style={styles.actionButtonText}>
              {isFollowing ? "Unfollow" : "Follow"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
