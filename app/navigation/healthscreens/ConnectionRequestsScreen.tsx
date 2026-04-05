import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useTheme } from "../../../utils/theme-context";
import { lightTheme, darkTheme, createHealthStyles } from "../../../constants/styles/healthStyles";
import { getUsersByIds, UserProfile } from "../../api/userApi";
import { healthApi, ConnectionRequestDTO, HealthIDDTO } from "../../api/healthApi";
import * as SecureStore from "expo-secure-store";
import { SidebarMenu } from "../../../components/dashboard/SidebarMenu";
import { router } from "expo-router";

export default function ConnectionRequestsScreen() {
  const { colorScheme } = useTheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  const styles = createHealthStyles(theme);

  const [requests, setRequests] = useState<ConnectionRequestDTO[]>([]);
  const [profiles, setProfiles] = useState<Record<string, UserProfile>>({});
  const [healthProfiles, setHealthProfiles] = useState<Record<string, HealthIDDTO>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const currentUserId = await SecureStore.getItemAsync("userId");
      if (!currentUserId) return;

      const incomingRequests = await healthApi.getIncomingRequests(currentUserId);
      const pendingRequests = incomingRequests.filter(req => req.status === "PENDING");
      setRequests(pendingRequests);

      if (pendingRequests.length > 0) {
        const userIds = pendingRequests.map(req => req.requesterUserId);
        const uniqueIds = Array.from(new Set(userIds));
        const fetchedUsers = await getUsersByIds(uniqueIds);
        
        const profileMap: Record<string, UserProfile> = {};
        fetchedUsers.forEach(u => {
          profileMap[u.id] = u;
        });
        setProfiles(profileMap);

        const migrantIds = pendingRequests
          .filter((req) => req.requesterRole === "MIGRANT")
          .map((req) => req.requesterUserId);
        const uniqueMigrantIds = Array.from(new Set(migrantIds));
        const healthResults = await Promise.all(
          uniqueMigrantIds.map(async (uid) => {
            try {
              const data = await healthApi.getHealthIDByUserId(uid);
              return { uid, data };
            } catch {
              return { uid, data: null };
            }
          })
        );
        const healthMap: Record<string, HealthIDDTO> = {};
        healthResults.forEach((item) => {
          if (item.data) {
            healthMap[item.uid] = item.data;
          }
        });
        setHealthProfiles(healthMap);
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRequests();
    setRefreshing(false);
  };

  const handleAction = async (requestId: string, action: "ACCEPT" | "REJECT") => {
    try {
      const currentUserId = await SecureStore.getItemAsync("userId");
      if (!currentUserId) throw new Error("Not logged in");

      if (action === "ACCEPT") {
        await healthApi.acceptConnectionRequest(requestId, currentUserId);
        Alert.alert("Success", "Connection request accepted!");
      } else {
        await healthApi.rejectConnectionRequest(requestId, currentUserId);
        Alert.alert("Rejected", "Connection request rejected.");
      }
      
      setRequests(prev => prev.filter(req => req.id !== requestId));
    } catch (error: any) {
      Alert.alert("Error", error.message || `Failed to ${action.toLowerCase()} request`);
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>

            <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
              <MaterialIcons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>
            <View>
              <Text style={[styles.headerTitle, { fontSize: 24 }]}>Requests</Text>
              <Text style={[styles.headerSubtitle, { fontSize: 12 }]}>Manage incoming connections</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {requests.length === 0 ? (
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <MaterialIcons name="inbox" size={64} color={theme.textSecondary} />
            <Text style={{ color: theme.textSecondary, marginTop: 16, fontSize: 16 }}>
              No pending connection requests.
            </Text>
          </View>
        ) : (
          requests.map((request) => {
            const profile = profiles[request.requesterUserId];
            const health = healthProfiles[request.requesterUserId];
            
            return (
              <View key={request.id} style={styles.card}>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                  <View style={{
                    width: 50, height: 50, borderRadius: 25, 
                    backgroundColor: theme.primary + "20", 
                    justifyContent: "center", alignItems: "center",
                    marginRight: 16
                  }}>
                    {profile?.profileImageUrl ? (
                      <Image 
                        source={{ uri: profile.profileImageUrl }} 
                        style={{ width: 50, height: 50, borderRadius: 25 }} 
                      />
                    ) : (
                      <FontAwesome5 name="user" size={24} color={theme.primary} />
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>
                      {profile ? (profile.name || profile.username) : "Unknown User"}
                    </Text>
                    <Text style={{ color: theme.textSecondary, marginTop: 4 }}>
                      Role: {request.requesterRole}
                    </Text>
                  </View>
                </View>

                {request.requesterRole === "MIGRANT" && health && (
                  <View style={{ backgroundColor: theme.background, padding: 10, borderRadius: 10, borderWidth: 1, borderColor: theme.border, marginBottom: 12 }}>
                    <Text style={[styles.infoLabel, { marginBottom: 4 }]}>Migrant Basic Details</Text>
                    <Text style={styles.cardSubtitle}>Health ID: {health.healthId}</Text>
                    <Text style={styles.cardSubtitle}>Blood Group: {health.bloodGroup || "-"}</Text>
                    {health.currentCity ? <Text style={styles.cardSubtitle}>City: {health.currentCity}</Text> : null}
                    {health.currentState ? <Text style={styles.cardSubtitle}>State: {health.currentState}</Text> : null}
                    {health.occupation ? <Text style={styles.cardSubtitle}>Occupation: {health.occupation}</Text> : null}
                    {health.allergies ? <Text style={styles.cardSubtitle}>Allergies: {health.allergies}</Text> : null}
                  </View>
                )}
                
                {request.message && (
                  <View style={{ backgroundColor: theme.card, padding: 12, borderRadius: 8, marginBottom: 16, borderWidth: 1, borderColor: theme.border }}>
                    <Text style={{ color: theme.text, fontStyle: "italic" }}>"{request.message}"</Text>
                  </View>
                )}

                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <TouchableOpacity
                    style={[styles.button, { flex: 1, marginRight: 8, backgroundColor: theme.error }]}
                    onPress={() => handleAction(request.id, "REJECT")}
                  >
                    <Text style={styles.buttonText}>Reject</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.button, { flex: 1, marginLeft: 8, backgroundColor: theme.success }]}
                    onPress={() => handleAction(request.id, "ACCEPT")}
                  >
                    <Text style={styles.buttonText}>Accept</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
      <SidebarMenu isVisible={menuVisible} onClose={() => setMenuVisible(false)} />
    </View>
  );
}
