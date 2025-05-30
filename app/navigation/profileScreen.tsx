import React, { useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useProfile } from "../../hooks/useProfile";
import { useAuth } from "../utils/auth-context";
import * as SecureStore from "expo-secure-store";
import styles from "../../constants/styles/profileStyles";

const mockDonations = [
  { id: 1, type: "Blood", date: "2024-06-01", status: "Completed" },
  { id: 2, type: "Organ", date: "2024-05-15", status: "Pending" },
];
const mockReviews = [
  { id: 1, text: "Great donor, very helpful!", date: "2024-06-02" },
  { id: 2, text: "Quick response, thank you!", date: "2024-05-20" },
];
const mockReceives = [
  { id: 1, type: "Blood", date: "2024-04-10", status: "Completed" },
  { id: 2, type: "Medicine", date: "2024-03-22", status: "Pending" },
];

const formatDate = (dateStr: string) => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
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
  } = useProfile();

  const [activeSegment, setActiveSegment] = useState("donations");

  const handleLogout = async () => {
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
    ];
    await Promise.all(keysToDelete.map((key) => SecureStore.deleteItemAsync(key)));
    await logout();
    router.replace("/(auth)/loginScreen");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0984e3" />
        <Text style={{ marginTop: 10, color: "#636e72" }}>Loading profile...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Profile not found.</Text>
      </View>
    );
  }

  const onFollow = async () => {
    try {
      await handleFollow();
      Alert.alert("Success", "You are now following this user.");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to follow user");
    }
  };

  const onUnfollow = async () => {
    try {
      await handleUnfollow();
      Alert.alert("Success", "You have unfollowed this user.");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to unfollow user");
    }
  };

  const renderContent = () => {
    switch (activeSegment) {
      case "donations":
        return mockDonations.map((item) => (
          <View key={item.id} style={styles.contentItem}>
            <Text style={styles.contentItemTitle}>{item.type}</Text>
            <Text style={styles.contentItemText}>Date: {formatDate(item.date)}</Text>
            <Text style={styles.contentItemText}>Status: {item.status}</Text>
          </View>
        ));
      case "reviews":
        return mockReviews.map((item) => (
          <View key={item.id} style={styles.contentItem}>
            <Text style={styles.contentItemTitle}>Review</Text>
            <Text style={styles.contentItemText}>{item.text}</Text>
            <Text style={styles.contentItemText}>Date: {formatDate(item.date)}</Text>
          </View>
        ));
      case "receives":
        return mockReceives.map((item) => (
          <View key={item.id} style={styles.contentItem}>
            <Text style={styles.contentItemTitle}>{item.type}</Text>
            <Text style={styles.contentItemText}>Date: {formatDate(item.date)}</Text>
            <Text style={styles.contentItemText}>Status: {item.status}</Text>
          </View>
        ));
      default:
        return null;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Profile Header: Pic on left, info on right */}
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

      {/* Followers and Following */}
      <View style={styles.statRow}>
        <View style={styles.statItem}>
          <Feather name="users" size={20} color="#636e72" style={styles.statIcon} />
          <Text style={styles.statLabel}>Followers</Text>
          <Text style={styles.statValue}>{profile.followers ?? 0}</Text>
        </View>
        <View style={styles.statItem}>
          <Feather name="user-plus" size={20} color="#636e72" style={styles.statIcon} />
          <Text style={styles.statLabel}>Following</Text>
          <Text style={styles.statValue}>{profile.following ?? 0}</Text>
        </View>
      </View>

      {/* Segmented Control */}
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

      {/* Content Grid */}
      <View style={styles.contentGrid}>
        {renderContent()}
      </View>

      {/* Actions */}
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
              onPress={handleLogout}
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
            <Feather name={isFollowing ? "user-minus" : "user-plus"} size={20} color="#fff" />
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
