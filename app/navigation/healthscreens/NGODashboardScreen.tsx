import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { SidebarMenu } from "../../../components/dashboard/SidebarMenu";
import { HealthIdQrScannerModal } from "../../../components/health/HealthIdQrScannerModal";
import { useRole } from "../../../utils/role-context";
import { useTheme } from "../../../utils/theme-context";
import { extractHealthIdFromPayload, normalizeHealthIdInput } from "../../../utils/health-id";
import { darkTheme, lightTheme, createHealthStyles } from "../../../constants/styles/healthStyles";
import { healthApi, HealthIDDTO } from "../../api/healthApi";
import { getUsersByIds } from "../../api/userApi";

const HEADER_HEIGHT = 84;

export default function NGODashboardScreen() {
  const { isDark } = useTheme();
  const { isNGO } = useRole();
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createHealthStyles(theme);

  const [searchHealthId, setSearchHealthId] = useState("");
  const [loading, setLoading] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [scannerVisible, setScannerVisible] = useState(false);
  const [totalMigrants, setTotalMigrants] = useState(0);
  const [emergencyCases, setEmergencyCases] = useState(0);
  const [matchedMigrant, setMatchedMigrant] = useState<HealthIDDTO | null>(null);
  const [migrantName, setMigrantName] = useState("");

  const scrollY = useRef(new Animated.Value(0)).current;
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [0, -HEADER_HEIGHT],
    extrapolate: "clamp",
  });

  useEffect(() => {
    if (!isNGO) {
      return;
    }
    loadStats();
  }, [isNGO]);

  const loadStats = async () => {
    try {
      const ngoId = await SecureStore.getItemAsync("userId");
      if (!ngoId) return;
      const [count, emergencyRecords] = await Promise.all([
        healthApi.getNGOMigrantCount(ngoId),
        healthApi.getNGOEmergencyRecords(ngoId),
      ]);
      setTotalMigrants(count.totalMigrants || 0);
      setEmergencyCases((emergencyRecords || []).length);
    } catch (error) {
      console.error("Failed to load NGO stats", error);
    }
  };

  const handleSearch = async (overrideHealthId?: string) => {
    const healthId = normalizeHealthIdInput(overrideHealthId || searchHealthId);
    if (!healthId) {
      Alert.alert("Missing Health ID", "Please enter or scan a Health ID.");
      return;
    }

    setLoading(true);
    try {
      const migrant = await healthApi.getHealthIDByHealthId(healthId);
      setMatchedMigrant(migrant);
      setSearchHealthId(healthId);
      const users = await getUsersByIds([migrant.userId]);
      setMigrantName(users?.[0]?.name || users?.[0]?.username || "");
    } catch (error: any) {
      Alert.alert("Not Found", error?.message || "No migrant found with this Health ID");
      setMatchedMigrant(null);
      setMigrantName("");
    } finally {
      setLoading(false);
    }
  };

  const handleScanQr = () => {
    setScannerVisible(true);
  };

  const handleQrScanned = (payload: string) => {
    setScannerVisible(false);
    const extractedHealthId = extractHealthIdFromPayload(payload);

    if (!extractedHealthId) {
      Alert.alert(
        "Invalid QR Code",
        "Could not extract a valid Health ID from the scanned QR code.",
      );
      return;
    }

    handleSearch(extractedHealthId);
  };

  const handleSendRequest = async () => {
    if (!matchedMigrant?.userId || !matchedMigrant?.healthId) return;
    try {
      await healthApi.sendConnectionRequest(
        matchedMigrant.userId,
        "MIGRANT",
        "NGO_MIGRANT",
        `NGO support request for ${matchedMigrant.healthId}`,
        "NGO",
      );
      Alert.alert("Request Sent", "Connection request sent to migrant.");
    } catch (error: any) {
      Alert.alert("Request Failed", error?.message || "Unable to send connection request");
    }
  };

  const renderDetailRow = (label: string, value?: string | number | boolean | null) => {
    if (value === null || value === undefined || String(value).trim() === "") {
      return null;
    }
    return (
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{String(value)}</Text>
      </View>
    );
  };

  if (!isNGO) {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
          <FontAwesome5 name="shield-alt" size={64} color={theme.textSecondary} style={{ marginBottom: 16 }} />
          <Text style={[styles.cardTitle, { textAlign: "center", marginBottom: 8 }]}>NGO Access Required</Text>
          <Text style={[styles.cardSubtitle, { textAlign: "center", marginBottom: 24 }]}>You must be an NGO to access this dashboard.</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.back()}>
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
        <SidebarMenu isVisible={menuVisible} onClose={() => setMenuVisible(false)} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          backgroundColor: theme.card,
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
          paddingTop: 10,
          paddingHorizontal: 16,
          paddingBottom: 12,
          transform: [{ translateY: headerTranslateY }],
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => setMenuVisible(true)} style={{ marginRight: 10, padding: 4 }}>
            <MaterialIcons name="menu" size={22} color={theme.text} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={[styles.headerTitle, { fontSize: 19 }]}>NGO Dashboard</Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/navigation/notifications" as any)} style={{ padding: 4 }}>
            <MaterialIcons name="notifications-none" size={22} color={theme.text} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.ScrollView
        style={styles.container}
        contentContainerStyle={[styles.scrollContainer, { paddingTop: HEADER_HEIGHT + 8 }]}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
      >
        <View style={{ paddingHorizontal: 4, marginBottom: 10 }}>
          <Text style={[styles.headerSubtitle, { fontSize: 12 }]}>Search migrants and manage support connections</Text>
        </View>

        <TouchableOpacity
          style={[styles.card, { marginBottom: 12 }]}
          onPress={() => router.push("/navigation/healthscreens/NGOMigrantsScreen" as any)}
          activeOpacity={0.9}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View>
              <Text style={styles.statLabel}>Supported Migrants</Text>
              <Text style={styles.statValue}>{totalMigrants}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.statLabel}>Emergency Cases</Text>
              <Text style={[styles.statValue, { color: theme.error }]}>{emergencyCases}</Text>
            </View>
          </View>
          <Text style={[styles.cardSubtitle, { marginTop: 8 }]}>Tap to open migrant support management</Text>
        </TouchableOpacity>

        <View style={[styles.card, { marginBottom: 12 }]}> 
          <Text style={styles.cardTitle}>Search by Health ID</Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0, height: 46, marginRight: 8, paddingVertical: 10 }]}
              placeholder="HEALTH-XXXXXXXX"
              placeholderTextColor={theme.textSecondary}
              value={searchHealthId}
              onChangeText={setSearchHealthId}
              autoCapitalize="characters"
              selectionColor={theme.primary}
              underlineColorAndroid="transparent"
            />
            <TouchableOpacity
              style={[styles.button, { width: 40, height: 40, paddingHorizontal: 0, justifyContent: "center", marginVertical: 0 }]}
              onPress={() => handleSearch()}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <MaterialIcons name="search" size={18} color="#fff" />}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                styles.secondaryButton,
                { width: 40, height: 40, marginLeft: 8, paddingHorizontal: 0, justifyContent: "center", marginVertical: 0 },
              ]}
              onPress={handleScanQr}
              activeOpacity={0.85}
            >
              <MaterialIcons name="qr-code-scanner" size={17} color={theme.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {matchedMigrant && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Migrant Profile</Text>
            <Text style={[styles.cardSubtitle, { marginTop: 4 }]}>Health ID: {matchedMigrant.healthId}</Text>
            <View style={{ marginTop: 8 }}>
              {renderDetailRow("Blood Group", matchedMigrant.bloodGroup)}
              {renderDetailRow("Migrant Name", migrantName)}
              {renderDetailRow("Rh Factor", matchedMigrant.rhFactor)}
              {renderDetailRow("Allergies", matchedMigrant.allergies)}
              {renderDetailRow("Chronic Conditions", matchedMigrant.chronicConditions)}
              {renderDetailRow("Current Medications", matchedMigrant.currentMedications)}
              {renderDetailRow("Medical History", matchedMigrant.medicalHistory)}
              {renderDetailRow("Vaccination Status", matchedMigrant.vaccinationStatus)}
              {renderDetailRow("Current City", matchedMigrant.currentCity)}
              {renderDetailRow("Current State", matchedMigrant.currentState)}
              {renderDetailRow("Occupation", matchedMigrant.occupation)}
              {renderDetailRow("Preferred Language", matchedMigrant.preferredLanguage)}
              {renderDetailRow("Emergency Contact", matchedMigrant.emergencyContactName)}
              {renderDetailRow("Emergency Phone", matchedMigrant.emergencyContactPhone)}
            </View>

            <View style={{ flexDirection: "row", marginTop: 12 }}>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton, { flex: 1, marginRight: 8, minHeight: 42, marginVertical: 0 }]}
                onPress={() =>
                  router.push({
                    pathname: "/navigation/healthscreens/HealthRecordsScreen",
                    params: {
                      userId: matchedMigrant.userId,
                      healthId: matchedMigrant.healthId,
                    },
                  })
                }
              >
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>View Records</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, { flex: 1, marginLeft: 8, minHeight: 42, marginVertical: 0 }]} onPress={handleSendRequest}>
                <Text style={styles.buttonText}>Connect</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Animated.ScrollView>

      <SidebarMenu isVisible={menuVisible} onClose={() => setMenuVisible(false)} />
      <HealthIdQrScannerModal
        visible={scannerVisible}
        onClose={() => setScannerVisible(false)}
        onScanned={handleQrScanned}
      />
    </View>
  );
}
