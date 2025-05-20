import React, { useEffect, useState } from "react";
import {
  Alert,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { callSampleEndpoint } from "../../scripts/api/sampleApi";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import styles from "../../constants/styles/dashboardStyles";
import { addUserRole, refreshAuthTokens } from "../../scripts/api/roleApi";
import AppLayout from "../../components/AppLayout";
import ProfileCard from "../../components/ProfileCard";
import { AuthProvider, useAuth } from "../utils/auth-context";

const Dashboard = () => {
  const { logout, setIsAuthenticated } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    roles: "",
    userId: "",
    token: "",
    refreshToken: "",
    bloodGroup: "",
    lastDonation: "",
    location: "",
  });

  const { isAuthenticated } = useAuth();
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/navigation/loginScreen");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      const [username, email, roles, userId, token, refreshToken] =
        await Promise.all([
          SecureStore.getItemAsync("username"),
          SecureStore.getItemAsync("email"),
          SecureStore.getItemAsync("roles"),
          SecureStore.getItemAsync("userId"),
          SecureStore.getItemAsync("jwt"),
          SecureStore.getItemAsync("refreshToken"),
        ]);
      setUserData({
        username: username || "",
        email: email || "",
        roles: roles || "",
        userId: userId || "",
        token: token || "",
        refreshToken: refreshToken || "",
        bloodGroup: "",
        lastDonation: "",
        location: "",
      });
      setIsLoggedIn(!!token);
      setLoading(false);
    };
    loadUserData();
  }, []);
  const [donorId, setDonorId] = useState<string | null>(null);
  useEffect(() => {
    const fetchDonorId = async () => {
      const id = await SecureStore.getItemAsync("donorId");
      setDonorId(id);
    };
    fetchDonorId();
  }, []);

  const handleSample = async () => {
    try {
      const result = await callSampleEndpoint();
      Alert.alert("Sample Response", result);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const handleDonate = async () => {
    setActionLoading(true);
    try {
      let rolesString = await SecureStore.getItemAsync("roles");
      let roles: string[] = [];
      try {
        roles = rolesString ? JSON.parse(rolesString) : [];
      } catch {
        roles = [];
      }

      if (!roles.includes("DONOR")) {
        await addUserRole();
        const newTokens = await refreshAuthTokens();

        await Promise.all([
          SecureStore.setItemAsync("jwt", newTokens.accessToken),
          SecureStore.setItemAsync("refreshToken", newTokens.refreshToken),
          SecureStore.setItemAsync("email", newTokens.email),
          SecureStore.setItemAsync("username", newTokens.username),
          SecureStore.setItemAsync("roles", JSON.stringify(newTokens.roles)),
          SecureStore.setItemAsync("userId", newTokens.id),
          SecureStore.setItemAsync("gender", newTokens.gender),
          SecureStore.setItemAsync("dob", newTokens.dob),
        ]);

        roles = newTokens.roles;
        setIsAuthenticated(true);
      }

      const dob = await SecureStore.getItemAsync("dob");
      const gender = await SecureStore.getItemAsync("gender");
      if (!dob || !gender) {
        Alert.alert(
          "Profile Incomplete",
          "Date of birth or gender is missing from your profile. Please update your profile before registering as a donor."
        );
        setActionLoading(false);
        return;
      }

      router.push("/navigation/donorScreen");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0984e3" />
        <Text style={{ marginTop: 10, color: "#636e72" }}>
          Loading dashboard...
        </Text>
      </View>
    );
  }

  return (
    <AuthProvider>
      <AppLayout title="Dashboard">
        <ScrollView
          style={styles.bg}
          contentContainerStyle={styles.scrollContent}
        >
          <ProfileCard
            username={userData.username}
            email={userData.email}
            bloodGroup={userData.bloodGroup}
            lastDonation={userData.lastDonation}
            location={userData.location}
            onEdit={() => router.push("/dashboard")}
          />

          {isLoggedIn && (
            <>
              <TouchableOpacity
                style={styles.button}
                onPress={handleSample}
                activeOpacity={0.8}
              >
                <Feather name="activity" size={20} color="#fff" />
                <Text style={styles.buttonText}>Call Sample Endpoint</Text>
              </TouchableOpacity>

              {donorId ? (
                <>
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: "#0984e3" }]}
                    onPress={() => router.push("/navigation/donorScreen")}
                    activeOpacity={0.8}
                  >
                    <MaterialIcons
                      name="add-circle-outline"
                      size={20}
                      color="#fff"
                    />
                    <Text style={styles.buttonText}>Donate</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: "#00b894" }]}
                    onPress={() =>
                      router.push({
                        pathname: "/navigation/donorScreen",
                        params: { mode: "update" },
                      })
                    }
                    activeOpacity={0.8}
                  >
                    <Feather name="edit" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Update Donor Details</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "#00b894" }]}
                  onPress={() => router.push("/navigation/donorScreen")}
                  activeOpacity={0.8}
                >
                  <MaterialIcons name="person-add-alt" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Register as Donor</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#636e72" }]}
                onPress={() => router.push("/navigation/DonationStatusScreen")}
                activeOpacity={0.8}
              >
                <Feather name="list" size={20} color="#fff" />
                <Text style={styles.buttonText}>My Donations</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#d63031" }]}
                onPress={handleLogout}
                activeOpacity={0.8}
              >
                <Feather name="log-out" size={20} color="#fff" />
                <Text style={styles.buttonText}>Logout</Text>
              </TouchableOpacity>
            </>
          )}

          {!isLoggedIn && (
            <Text style={{ color: "red", marginTop: 20, textAlign: "center" }}>
              You must log in to access this feature.
            </Text>
          )}
        </ScrollView>
      </AppLayout>
    </AuthProvider>
  );
};

export default Dashboard;
