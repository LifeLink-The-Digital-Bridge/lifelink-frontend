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
import { searchNgos, UserProfile } from "../../api/userApi";
import { healthApi } from "../../api/healthApi";
import * as SecureStore from "expo-secure-store";
import { useRole } from "../../../utils/role-context";
import { router } from "expo-router";
import { ValidationAlert } from "../../../components/common/ValidationAlert";

export default function NGOProfileListScreen() {
  const { colorScheme } = useTheme();
  const { primaryRole } = useRole();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  const styles = createHealthStyles(theme);

  const [ngos, setNgos] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedNgoId, setExpandedNgoId] = useState<string | null>(null);
  const [popup, setPopup] = useState<{ visible: boolean; title: string; message: string; type: "success" | "error" | "warning" | "info" }>({
    visible: false,
    title: "",
    message: "",
    type: "info",
  });

  useEffect(() => {
    loadNGOs();
  }, []);

  const loadNGOs = async () => {
    try {
      setLoading(true);
      const data = await searchNgos();
      setNgos(data);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to load NGOs");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNGOs();
    setRefreshing(false);
  };

  const handleConnect = async (ngo: UserProfile) => {
    try {
      const currentUserId = await SecureStore.getItemAsync("userId");
      if (!currentUserId) throw new Error("Not logged in");

      const currentRole = primaryRole || "MIGRANT";
      if (currentRole !== "MIGRANT") {
        throw new Error("Only migrants can request NGO support from this screen");
      }

      await healthApi.sendConnectionRequest(
        ngo.id,
        "NGO",
        "NGO_MIGRANT",
        undefined,
        "MIGRANT"
      );
      setPopup({
        visible: true,
        title: "Request Sent",
        message: `${ngo.name || ngo.username} will review your support request.`,
        type: "success",
      });
    } catch (error: any) {
      setPopup({
        visible: true,
        title: "Request Failed",
        message: error.message || "Failed to send request",
        type: "error",
      });
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
      <View style={[styles.header, { paddingTop: 44, paddingBottom: 10 }]}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
            <MaterialIcons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <View>
            <Text style={[styles.headerTitle, { fontSize: 20 }]}>Find NGOs</Text>
          </View>
        </View>
      </View>
      <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 2 }}>
        <Text style={[styles.headerSubtitle, { fontSize: 12 }]}>Discover support organizations</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {ngos.length === 0 ? (
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <MaterialIcons name="search-off" size={64} color={theme.textSecondary} />
            <Text style={{ color: theme.textSecondary, marginTop: 16, fontSize: 16 }}>
              No NGOs found.
            </Text>
          </View>
        ) : (
          ngos.map((ngo) => (
            <View key={ngo.id} style={styles.card}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{
                  width: 50, height: 50, borderRadius: 25, 
                  backgroundColor: theme.primary + "20", 
                  justifyContent: "center", alignItems: "center",
                  marginRight: 16
                }}>
                  {ngo.profileImageUrl ? (
                    <Image 
                      source={{ uri: ngo.profileImageUrl }} 
                      style={{ width: 50, height: 50, borderRadius: 25 }} 
                    />
                  ) : (
                    <FontAwesome5 name="shield-alt" size={24} color={theme.primary} />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{ngo.name || ngo.username}</Text>
                  <Text style={{ color: theme.textSecondary, marginTop: 4 }}>
                    <MaterialIcons name="verified" size={14} color={theme.success} /> Verified Organization
                  </Text>
                  {!!ngo.ngoDetails?.organizationType && (
                    <Text style={{ color: theme.textSecondary, marginTop: 4 }}>
                      Type: {ngo.ngoDetails.organizationType}
                    </Text>
                  )}
                </View>
              </View>

              <View style={{ flexDirection: "row", marginTop: 10 }}>
                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton, { flex: 1, minHeight: 36, marginVertical: 0, marginRight: 8, paddingVertical: 8, paddingHorizontal: 8 }]}
                  onPress={() =>
                    setExpandedNgoId((prev) => (prev === ngo.id ? null : ngo.id))
                  }
                  activeOpacity={0.85}
                >
                  <Text style={[styles.buttonText, styles.secondaryButtonText, { fontSize: 13 }]}>
                    {expandedNgoId === ngo.id ? "Hide Details" : "View Details"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, { flex: 1, minHeight: 36, marginVertical: 0, marginLeft: 8, paddingVertical: 8, paddingHorizontal: 8 }]}
                  onPress={() => handleConnect(ngo)}
                  activeOpacity={0.85}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                    <MaterialIcons name="handshake" size={16} color="#fff" style={{ marginRight: 6 }} />
                    <Text style={[styles.buttonText, { fontSize: 13 }]}>Request Support</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {expandedNgoId === ngo.id && (
                <View style={{ marginTop: 12 }}>
                  {!!ngo.ngoDetails?.organizationName && (
                    <Text style={styles.cardSubtitle}>
                      Organization: {ngo.ngoDetails.organizationName}
                    </Text>
                  )}
                  {!!ngo.ngoDetails?.registrationNumber && (
                    <Text style={styles.cardSubtitle}>
                      Registration No: {ngo.ngoDetails.registrationNumber}
                    </Text>
                  )}
                  {ngo.ngoDetails?.registrationYear !== undefined &&
                    ngo.ngoDetails?.registrationYear !== null && (
                    <Text style={styles.cardSubtitle}>
                      Registration Year: {ngo.ngoDetails.registrationYear}
                    </Text>
                  )}
                  {!!ngo.ngoDetails?.serviceAreas && (
                    <Text style={styles.cardSubtitle}>
                      Service Areas: {ngo.ngoDetails.serviceAreas}
                    </Text>
                  )}
                  {!!ngo.ngoDetails?.headOfficeAddress && (
                    <Text style={styles.cardSubtitle}>
                      Head Office: {ngo.ngoDetails.headOfficeAddress}
                    </Text>
                  )}
                  {ngo.ngoDetails?.totalVolunteers !== undefined &&
                    ngo.ngoDetails?.totalVolunteers !== null && (
                    <Text style={styles.cardSubtitle}>
                      Total Volunteers: {ngo.ngoDetails.totalVolunteers}
                    </Text>
                  )}
                  {!!ngo.ngoDetails?.website && (
                    <Text style={styles.cardSubtitle}>
                      Website: {ngo.ngoDetails.website}
                    </Text>
                  )}
                  {!!ngo.phone && (
                    <Text style={styles.cardSubtitle}>Phone: {ngo.phone}</Text>
                  )}
                  {!!ngo.email && (
                    <Text style={styles.cardSubtitle}>Email: {ngo.email}</Text>
                  )}
                </View>
              )}

            </View>
          ))
        )}
      </ScrollView>
      <ValidationAlert
        visible={popup.visible}
        title={popup.title}
        message={popup.message}
        type={popup.type}
        onClose={() => setPopup((prev) => ({ ...prev, visible: false }))}
      />
    </View>
  );
}
