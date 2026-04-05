import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { healthApi, HealthIDDTO, HealthRecordDTO, MigrantRiskScoreDTO } from "../../api/healthApi";
import { getUsersByIds } from "../../api/userApi";

const HEADER_HEIGHT = 84;

export default function DoctorDashboardScreen() {
  const { isDark } = useTheme();
  const { isDoctor } = useRole();
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createHealthStyles(theme);

  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [patientData, setPatientData] = useState<HealthIDDTO | null>(null);
  const [patientName, setPatientName] = useState("");
  const [patientRecords, setPatientRecords] = useState<HealthRecordDTO[]>([]);
  const [patientRisk, setPatientRisk] = useState<MigrantRiskScoreDTO | null>(null);
  const [totalPatients, setTotalPatients] = useState(0);
  const [emergencyCases, setEmergencyCases] = useState(0);
  const [menuVisible, setMenuVisible] = useState(false);
  const [scannerVisible, setScannerVisible] = useState(false);
  const [connectedHealthIds, setConnectedHealthIds] = useState<Set<string>>(new Set());

  const scrollY = useRef(new Animated.Value(0)).current;
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [0, -HEADER_HEIGHT],
    extrapolate: "clamp",
  });

  const isConnectedPatient = useMemo(() => {
    if (!patientData?.healthId) return false;
    return connectedHealthIds.has(patientData.healthId);
  }, [connectedHealthIds, patientData]);

  useEffect(() => {
    if (!isDoctor) {
      return;
    }
    loadDoctorStats();
  }, [isDoctor]);

  const loadDoctorStats = async () => {
    try {
      const storedUserId = await SecureStore.getItemAsync("userId");
      if (!storedUserId) return;

      const [count, emergencies, associations] = await Promise.all([
        healthApi.getDoctorPatientCount(storedUserId),
        healthApi.getDoctorEmergencyRecords(storedUserId),
        healthApi.getDoctorPatients(storedUserId),
      ]);
      setTotalPatients(count.totalPatients || 0);
      setEmergencyCases((emergencies || []).length);
      setConnectedHealthIds(new Set((associations || []).map((item: any) => String(item.patientHealthId))));
    } catch (error) {
      console.error("Failed to load doctor stats:", error);
    }
  };

  const handleSearch = async (overrideHealthId?: string) => {
    const query = normalizeHealthIdInput(overrideHealthId || searchQuery);
    if (!query) {
      Alert.alert("Missing Health ID", "Please enter or scan a Health ID.");
      return;
    }

    setLoading(true);
    try {
      const healthIdData = await healthApi.getHealthIDByHealthId(query);
      setPatientData(healthIdData);
      const records = await healthApi.getHealthRecordsByHealthId(query);
      setPatientRecords(records.slice(0, 5));
      setSearchQuery(query);
      const users = await getUsersByIds([healthIdData.userId]);
      const resolvedName = users?.[0]?.name || users?.[0]?.username || "";
      setPatientName(resolvedName);
      try {
        const risk = await healthApi.getLatestRiskScore(healthIdData.userId);
        setPatientRisk(risk);
      } catch (error) {
        setPatientRisk(null);
      }
    } catch {
      Alert.alert("Not Found", "No migrant found with this Health ID.");
      setPatientData(null);
      setPatientRecords([]);
      setPatientName("");
      setPatientRisk(null);
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

  const handleAddRecord = () => {
    if (!patientData || !isConnectedPatient) {
      return;
    }
    router.push({
      pathname: "/navigation/healthscreens/AddHealthRecordScreen",
      params: {
        healthId: patientData.healthId,
        userId: patientData.userId,
      },
    });
  };

  const handleSendConnectionRequest = async () => {
    if (!patientData?.userId || !patientData?.healthId) {
      return;
    }
    try {
      await healthApi.sendConnectionRequest(
        patientData.userId,
        "MIGRANT",
        "DOCTOR_PATIENT",
        `Doctor connection request for ${patientData.healthId}`,
        "DOCTOR",
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

  if (!isDoctor) {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
          <FontAwesome5 name="user-md" size={64} color={theme.textSecondary} style={{ marginBottom: 16 }} />
          <Text style={[styles.cardTitle, { textAlign: "center", marginBottom: 8 }]}>Doctor Access Required</Text>
          <Text style={[styles.cardSubtitle, { textAlign: "center", marginBottom: 24 }]}>You must be a doctor to access this dashboard.</Text>
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
            <Text style={[styles.headerTitle, { fontSize: 19 }]}>Doctor Dashboard</Text>
            <Text style={[styles.headerSubtitle, { fontSize: 12 }]}>Search migrants and manage connected records</Text>
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
        <TouchableOpacity
          style={[styles.card, { marginBottom: 12 }]}
          onPress={() => router.push("/navigation/healthscreens/DoctorPatientsScreen")}
          activeOpacity={0.9}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View>
              <Text style={styles.statLabel}>Connected Migrants</Text>
              <Text style={styles.statValue}>{totalPatients}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.statLabel}>Emergency Cases</Text>
              <Text style={[styles.statValue, { color: theme.error }]}>{emergencyCases}</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={[styles.card, { marginBottom: 12 }]}>
          <Text style={styles.cardTitle}>Search by Health ID</Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0, height: 46, marginRight: 8, paddingVertical: 10 }]}
              placeholder="HEALTH-XXXXXXXX"
              placeholderTextColor={theme.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
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
              {loading ? <ActivityIndicator color="#fff" /> : <MaterialIcons name="search" size={19} color="#fff" />}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton, { width: 40, height: 40, marginLeft: 8, paddingHorizontal: 0, justifyContent: "center", marginVertical: 0 }]}
              onPress={handleScanQr}
              activeOpacity={0.85}
            >
              <MaterialIcons name="qr-code-scanner" size={20} color={theme.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {patientData && (
          <View style={[styles.card, { marginBottom: 12 }]}> 
            <Text style={styles.cardTitle}>Migrant Profile</Text>
            <Text style={[styles.cardSubtitle, { marginTop: 4 }]}>Health ID: {patientData.healthId}</Text>
            <View style={{ marginTop: 8 }}>
              {renderDetailRow("Blood Group", patientData.bloodGroup)}
              {renderDetailRow("Patient Name", patientName)}
              {renderDetailRow("Rh Factor", patientData.rhFactor)}
              {renderDetailRow("Allergies", patientData.allergies)}
              {renderDetailRow("Chronic Conditions", patientData.chronicConditions)}
              {renderDetailRow("Current Medications", patientData.currentMedications)}
              {renderDetailRow("Vaccination Status", patientData.vaccinationStatus)}
              {renderDetailRow("Medical History", patientData.medicalHistory)}
              {renderDetailRow("Has Chronic Diseases", patientData.hasChronicDiseases === undefined ? null : patientData.hasChronicDiseases ? "Yes" : "No")}
              {renderDetailRow("Has Diabetes", patientData.hasDiabetes === undefined ? null : patientData.hasDiabetes ? "Yes" : "No")}
              {renderDetailRow("Blood Pressure", patientData.bloodPressure)}
              {renderDetailRow("Hemoglobin", patientData.hemoglobinLevel)}
              {renderDetailRow("Height (cm)", patientData.heightCm)}
              {renderDetailRow("Weight (kg)", patientData.weightKg)}
              {renderDetailRow("Current City", patientData.currentCity)}
              {renderDetailRow("Current State", patientData.currentState)}
              {renderDetailRow("Occupation", patientData.occupation)}
              {renderDetailRow("Preferred Language", patientData.preferredLanguage)}
              {renderDetailRow("Emergency Contact", patientData.emergencyContactName)}
              {renderDetailRow("Emergency Phone", patientData.emergencyContactPhone)}
              {renderDetailRow("Last Updated", patientData.updatedAt ? new Date(patientData.updatedAt).toLocaleString() : null)}
            </View>

            {patientRisk && (
              <View style={{ marginTop: 12, borderRadius: 10, borderWidth: 1, borderColor: theme.border, padding: 10, backgroundColor: theme.background }}>
                <Text style={styles.infoLabel}>Risk Score</Text>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
                  <Text style={[styles.infoValue, { fontSize: 20 }]}>{patientRisk.riskScore.toFixed(1)}</Text>
                  <View
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 10,
                      backgroundColor:
                        patientRisk.riskLevel === "HIGH"
                          ? theme.error + "20"
                          : patientRisk.riskLevel === "MEDIUM"
                          ? theme.warning + "20"
                          : theme.success + "20",
                    }}
                  >
                    <Text
                      style={{
                        color:
                          patientRisk.riskLevel === "HIGH"
                            ? theme.error
                            : patientRisk.riskLevel === "MEDIUM"
                            ? theme.warning
                            : theme.success,
                        fontSize: 12,
                        fontWeight: "700",
                      }}
                    >
                      {patientRisk.riskLevel}
                    </Text>
                  </View>
                </View>
                {patientRisk.topFactors?.[0] && (
                  <Text style={[styles.cardSubtitle, { marginTop: 6 }]}>Top factor: {patientRisk.topFactors[0]}</Text>
                )}
              </View>
            )}

            <View style={{ flexDirection: "row", marginTop: 12 }}>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton, { flex: 1, marginRight: 8, minHeight: 42, marginVertical: 0 }]}
                onPress={() =>
                  router.push({
                    pathname: "/navigation/healthscreens/HealthRecordsScreen",
                    params: { healthId: patientData.healthId, userId: patientData.userId },
                  })
                }
              >
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>View Records</Text>
              </TouchableOpacity>

              {isConnectedPatient ? (
                <TouchableOpacity style={[styles.button, { flex: 1, marginLeft: 8, minHeight: 42, marginVertical: 0 }]} onPress={handleAddRecord}>
                  <Text style={styles.buttonText}>Add Record</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={[styles.button, { flex: 1, marginLeft: 8, minHeight: 42, marginVertical: 0 }]} onPress={handleSendConnectionRequest}>
                  <Text style={styles.buttonText}>Connect</Text>
                </TouchableOpacity>
              )}
            </View>

            {!isConnectedPatient && (
              <Text style={[styles.cardSubtitle, { marginTop: 8 }]}>You can view profile/records without connection. Connection is required to add records.</Text>
            )}
          </View>
        )}

        {patientRecords.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Recent Records</Text>
            {patientRecords.map((record) => (
              <View key={record.id} style={{ marginTop: 10, backgroundColor: theme.background, borderRadius: 10, padding: 10 }}>
                <Text style={styles.infoValue}>{record.title}</Text>
                <Text style={styles.cardSubtitle}>{new Date(record.recordDate).toLocaleDateString()} • {record.recordType}</Text>
              </View>
            ))}
          </View>
        )}

        {!patientData && !loading && (
          <View style={styles.emptyState}>
            <FontAwesome5 name="user-md" size={72} color={theme.textSecondary} style={styles.emptyStateIcon} />
            <Text style={styles.emptyStateText}>Search a Migrant</Text>
            <Text style={styles.emptyStateSubtext}>Enter Health ID or tap QR to search.</Text>
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
