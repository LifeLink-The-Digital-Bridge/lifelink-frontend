import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Animated,
} from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { useAuth } from "../utils/auth-context";
import { fetchDonorByUserId, fetchDonorData } from "@/scripts/api/donorApi";

const Dashboard = () => {
  const { logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [donorId, setDonorId] = useState<string | null>(null);
  const [donorData, setDonorData] = useState<any>(null);
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
    donations: 0,
    followers: 0,
    following: 0,
    score: 0,
    reviews: 0,
  });
  const [showChatIcon, setShowChatIcon] = useState(true);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("../(auth)/loginScreen");
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
        donations: 0,
        followers: 0,
        following: 0,
        score: 0,
        reviews: 0,
      });
      setLoading(false);
    };
    loadUserData();
  }, []);

  useEffect(() => {
    const checkDonorStatus = async () => {
      let donorId = await SecureStore.getItemAsync("donorId");
      if (!donorId) {
        const donorData = await fetchDonorByUserId();
        if (donorData) {
          donorId = donorData.id;
          await SecureStore.setItemAsync("donorId", donorId ?? "");
          setDonorId(donorId);
          setDonorData(donorData);
        }
      } else {
        const donorData = await fetchDonorData();
        setDonorData(donorData);
      }
    };
    if (userData.userId) {
      checkDonorStatus();
    }
  }, [userData.userId]);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: { nativeEvent: { contentOffset: { y: number } } }) => {
        const y = event.nativeEvent.contentOffset.y;
        setShowChatIcon(y <= 10);
      },
    }
  );

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
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 80 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.topBar}>
          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={22} color="#636e72" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#b2bec3"
            />
          </View>
          <TouchableOpacity style={styles.bellButton}>
            <Feather name="bell" size={24} color="#0984e3" />
          </TouchableOpacity>
        </View>
        <Text style={styles.welcomeText}>
          Welcome, <Text style={{ fontWeight: "bold" }}>{userData.username}</Text> 👋
        </Text>
        <Text style={styles.subText}>We're glad to have you here!</Text>
        
      </ScrollView>
      {showChatIcon && (
        <View style={styles.chatBotIcon}>
          <TouchableOpacity
            style={styles.chatBotButton}
            onPress={() => alert("Open chat with bot")}
          >
            <Feather name="message-circle" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f8fa", padding: 18 },
  topBar: { flexDirection: "row", alignItems: "center", marginBottom: 18 },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#f1f2f6",
    borderRadius: 10,
    alignItems: "center",
    paddingHorizontal: 12,
    height: 42,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#222",
  },
  bellButton: {
    marginLeft: 16,
    backgroundColor: "#e3eafc",
    borderRadius: 24,
    padding: 8,
  },
  welcomeText: {
    fontSize: 22,
    color: "#0984e3",
    marginBottom: 4,
    marginTop: 8,
  },
  subText: {
    fontSize: 16,
    color: "#636e72",
    marginBottom: 18,
  },
  reviewPlaceholder: {
    minHeight: 80,
    backgroundColor: "#fff",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f6f8fa",
  },
chatBotIcon: {
  position: "absolute",
  bottom: 40, 
  right: 20,
  zIndex: 999,
},

  chatBotButton: {
    backgroundColor: "#0984e3",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
});

export default Dashboard;
