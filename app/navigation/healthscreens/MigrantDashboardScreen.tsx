import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { MaterialIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { useTheme } from "../../../utils/theme-context";
import { useRole } from "../../../utils/role-context";
import { addDonorRole, addRecipientRole, refreshAuthTokens } from "../../api/roleApi";
import {
  lightTheme,
  darkTheme,
  createHealthStyles,
} from "../../../constants/styles/healthStyles";
import { healthApi, HealthIDDTO, HealthRecordDTO, MigrantRiskScoreDTO } from "../../api/healthApi";
import { SidebarMenu } from "../../../components/dashboard/SidebarMenu";
import { CustomAlert } from "../../../components/common/CustomAlert";

export default function MigrantDashboardScreen() {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createHealthStyles(theme);
  const { refreshRoles, isDonor, isRecipient } = useRole();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [healthID, setHealthID] = useState<HealthIDDTO | null>(null);
  const [recentRecords, setRecentRecords] = useState<HealthRecordDTO[]>([]);
  const [riskStatus, setRiskStatus] = useState<MigrantRiskScoreDTO | null>(null);
  const [riskLoading, setRiskLoading] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [menuVisible, setMenuVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertConfirmText, setAlertConfirmText] = useState<string | undefined>(undefined);
  const [alertCancelText, setAlertCancelText] = useState<string | undefined>(undefined);
  const [alertOnConfirm, setAlertOnConfirm] = useState<(() => void) | undefined>(undefined);

  const closeAlert = () => {
    setAlertVisible(false);
    setAlertOnConfirm(undefined);
    setAlertConfirmText(undefined);
    setAlertCancelText(undefined);
  };

  const showAlert = (
    title: string,
    message: string,
    options?: {
      confirmText?: string;
      cancelText?: string;
      onConfirm?: () => void;
    }
  ) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertConfirmText(options?.confirmText);
    setAlertCancelText(options?.cancelText);
    setAlertOnConfirm(() => options?.onConfirm);
    setAlertVisible(true);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const storedUserId = await SecureStore.getItemAsync("userId");
      if (!storedUserId) return;

      setUserId(storedUserId);
      let loadedHealthId: HealthIDDTO | null = null;

      try {
        const healthIdData = await healthApi.getHealthIDByUserId(storedUserId);
        loadedHealthId = healthIdData;
        setHealthID(healthIdData);
      } catch {
        console.log("Health ID not found, needs to be created");
        setHealthID(null);
      }

      try {
        const records = await healthApi.getHealthRecordsByUserId(storedUserId);
        setRecentRecords(records.slice(0, 5));
      } catch {
        console.log("No health records found");
        setRecentRecords([]);
      }

      setRiskLoading(true);
      if (loadedHealthId) {
        try {
          const latestRisk = await healthApi.getLatestRiskScore(storedUserId);
          setRiskStatus(latestRisk);
        } catch {
          setRiskStatus(null);
        }
      } else {
        setRiskStatus(null);
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setRiskLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const persistAuthRefresh = async (response: any) => {
    await Promise.all([
      SecureStore.setItemAsync("jwt", response.accessToken),
      SecureStore.setItemAsync("accessToken", response.accessToken),
      SecureStore.setItemAsync("refreshToken", response.refreshToken),
      SecureStore.setItemAsync("roles", JSON.stringify(response.roles || [])),
      SecureStore.setItemAsync("userId", response.id),
      SecureStore.setItemAsync("email", response.email || ""),
      SecureStore.setItemAsync("username", response.username || ""),
      SecureStore.setItemAsync("gender", response.gender || ""),
      SecureStore.setItemAsync("dob", response.dob || ""),
    ]);
  };

  const handleEnrollAsDonor = async () => {
    if (!healthID) {
      showAlert("Error", "Please create a Health ID first.");
      return;
    }
    showAlert(
      "Enroll as Donor",
      "Do you want to enroll as an Organ/Blood Donor using your Health ID profile?",
      {
        cancelText: "Cancel",
        confirmText: "Continue",
        onConfirm: async () => {
          try {
            setLoading(true);
            await addDonorRole();
            const response = await refreshAuthTokens();
            await persistAuthRefresh(response);
            await refreshRoles();
            router.push("/navigation/healthscreens/DonorEnrollmentScreen" as any);
          } catch (error: any) {
            showAlert("Enrollment Setup Failed", error.message || "Could not prepare donor enrollment.");
          } finally {
            setLoading(false);
          }
        },
      }
    );
  };

  const handleEnrollAsRecipient = async () => {
    if (!healthID) {
      showAlert("Error", "Please create a Health ID first.");
      return;
    }
    showAlert(
      "Enroll as Recipient",
      "Do you want to enroll as a Recipient using your Health ID profile?",
      {
        cancelText: "Cancel",
        confirmText: "Continue",
        onConfirm: async () => {
          try {
            setLoading(true);
            await addRecipientRole();
            const response = await refreshAuthTokens();
            await persistAuthRefresh(response);
            await refreshRoles();
            router.push("/navigation/healthscreens/RecipientEnrollmentScreen" as any);
          } catch (error: any) {
            showAlert("Enrollment Setup Failed", error.message || "Could not prepare recipient enrollment.");
          } finally {
            setLoading(false);
          }
        },
      }
    );
  };

  const getRiskStyles = (riskLevel?: string) => {
    if (riskLevel === "HIGH") {
      return {
        color: theme.error,
        background: theme.error + "20",
        label: "High Risk",
      };
    }
    if (riskLevel === "MEDIUM") {
      return {
        color: theme.warning,
        background: theme.warning + "20",
        label: "Needs Attention",
      };
    }
    return {
      color: theme.success,
      background: theme.success + "20",
      label: "Stable",
    };
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => setMenuVisible(true)} style={{ marginRight: 10, padding: 4 }}>
            <MaterialIcons name="menu" size={22} color={theme.text} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={[styles.headerTitle, { fontSize: 21 }]}>Health Dashboard</Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/navigation/notifications" as any)} style={{ padding: 4 }}>
            <MaterialIcons name="notifications-none" size={22} color={theme.text} />
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 6 }}>
          <Text style={[styles.headerSubtitle, { fontSize: 12 }]}>Manage your health records and ID</Text>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {healthID ? (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: theme.healthPrimary + "15", borderColor: theme.healthPrimary }]}
            onPress={() => router.push("/navigation/healthscreens/HealthIDScreen")}
          >
            <View style={styles.cardHeader}>
              <FontAwesome5 name="id-card" size={24} color={theme.healthPrimary} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.cardTitle, { color: theme.healthPrimary }]}>
                  Health ID
                </Text>
                <Text style={styles.cardSubtitle}>
                  {healthID.healthId}
                </Text>
              </View>
              <MaterialIcons name="qr-code-2" size={32} color={theme.healthPrimary} />
            </View>
            <Text style={[styles.cardSubtitle, { marginTop: 8 }]}>
              Tap to view QR code and emergency details
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.card, styles.emergencyCard]}
            onPress={() => router.push("/navigation/healthscreens/HealthIDScreen")}
          >
            <View style={styles.cardHeader}>
              <MaterialIcons name="warning" size={24} color={theme.emergencyRed} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.cardTitle, { color: theme.emergencyRed }]}>
                  Create Health ID
                </Text>
                <Text style={styles.cardSubtitle}>
                  You do not have a Health ID yet
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            router.push({
              pathname: "/navigation/healthscreens/MigrantHealthStatusScreen",
              params: { userId },
            } as any)
          }
          activeOpacity={0.9}
        >
          <View style={styles.cardHeader}>
            <MaterialIcons name="monitor-heart" size={24} color={theme.primary} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.cardTitle}>Current Health Status</Text>
              <Text style={styles.cardSubtitle}>Tap to view missing health data, improvements, and AI guidance</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={theme.textSecondary} />
          </View>

          {riskLoading ? (
            <View style={{ marginTop: 6, flexDirection: "row", alignItems: "center" }}>
              <ActivityIndicator size="small" color={theme.primary} />
              <Text style={[styles.cardSubtitle, { marginBottom: 0, marginLeft: 8 }]}>Analyzing your latest status...</Text>
            </View>
          ) : healthID && riskStatus ? (
            <View style={{ marginTop: 6 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={styles.infoLabel}>Risk Score</Text>
                <Text style={[styles.infoValue, { fontSize: 20 }]}>{riskStatus.riskScore.toFixed(1)}</Text>
              </View>
              <View style={{ marginTop: 8, alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, backgroundColor: getRiskStyles(riskStatus.riskLevel).background }}>
                <Text style={{ color: getRiskStyles(riskStatus.riskLevel).color, fontWeight: "700", fontSize: 12 }}>
                  {getRiskStyles(riskStatus.riskLevel).label}
                </Text>
              </View>
              {riskStatus.topFactors?.[0] ? (
                <Text style={[styles.cardSubtitle, { marginTop: 8, marginBottom: 0 }]}>Top factor: {riskStatus.topFactors[0]}</Text>
              ) : null}
            </View>
          ) : healthID ? (
            <Text style={[styles.cardSubtitle, { marginTop: 6, marginBottom: 0 }]}>
              Status is not generated yet. Open this section to analyze your profile now.
            </Text>
          ) : (
            <Text style={[styles.cardSubtitle, { marginTop: 6, marginBottom: 0 }]}>
              Create your Health ID first to generate your current health status.
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/navigation/healthscreens/HealthRecordsScreen")}
          activeOpacity={0.9}
        >
          <View style={styles.cardHeader}>
            <MaterialIcons name="medical-services" size={22} color={theme.primary} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.cardTitle}>Health Records</Text>
              <Text style={styles.cardSubtitle}>Total records available in your timeline</Text>
            </View>
            <Text style={[styles.statValue, { fontSize: 26 }]}>{recentRecords.length}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/navigation/healthscreens/EmergencyAccessScreen")}
          activeOpacity={0.9}
        >
          <View style={styles.cardHeader}>
            <FontAwesome5 name="procedures" size={20} color={theme.success} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.cardTitle}>Emergency Cases</Text>
              <Text style={styles.cardSubtitle}>Emergency-tagged records in your timeline</Text>
            </View>
            <Text style={[styles.statValue, { fontSize: 26, color: theme.success }]}>
              {recentRecords.filter((r) => r.isEmergency).length}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>

        <TouchableOpacity
          style={[styles.card, { paddingVertical: 16 }]}
          onPress={() => router.push("/navigation/healthscreens/HealthRecordsScreen")}
        >
          <View style={styles.cardHeader}>
            <Ionicons name="document-text" size={24} color={theme.primary} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.cardTitle}>View Health Records</Text>
              <Text style={styles.cardSubtitle}>
                Complete timeline of your medical history
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={theme.textSecondary} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { paddingVertical: 16 }]}
          onPress={() => router.push("/navigation/healthscreens/EmergencyAccessScreen")}
        >
          <View style={styles.cardHeader}>
            <MaterialIcons name="local-hospital" size={24} color={theme.emergencyRed} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.cardTitle}>Emergency Access</Text>
              <Text style={styles.cardSubtitle}>
                PIN-protected emergency medical info
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={theme.textSecondary} />
          </View>
        </TouchableOpacity>

        {healthID && (!isDonor || !isRecipient) && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Enrollment Programs</Text>
            </View>

            {!isDonor && (
              <TouchableOpacity
                style={[styles.card, { paddingVertical: 16 }]}
                onPress={handleEnrollAsDonor}
              >
                <View style={styles.cardHeader}>
                  <FontAwesome5 name="hand-holding-heart" size={22} color={theme.success} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[styles.cardTitle, { color: theme.success }]}>Register as Donor</Text>
                    <Text style={styles.cardSubtitle}>
                      Use your Health ID to sign up as an organ/blood donor
                    </Text>
                  </View>
                  <MaterialIcons name="add-circle" size={24} color={theme.success} />
                </View>
              </TouchableOpacity>
            )}

            {!isRecipient && (
              <TouchableOpacity
                style={[styles.card, { paddingVertical: 16 }]}
                onPress={handleEnrollAsRecipient}
              >
                <View style={styles.cardHeader}>
                  <FontAwesome5 name="hands" size={22} color={theme.info} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[styles.cardTitle, { color: theme.info }]}>Register as Recipient</Text>
                    <Text style={styles.cardSubtitle}>
                      Need an organ or blood? Enroll as a recipient now
                    </Text>
                  </View>
                  <MaterialIcons name="add-circle" size={24} color={theme.info} />
                </View>
              </TouchableOpacity>
            )}
          </>
        )}

        {recentRecords.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Records</Text>
              <TouchableOpacity onPress={() => router.push("/navigation/healthscreens/HealthRecordsScreen")}>
                <Text style={styles.sectionAction}>View All</Text>
              </TouchableOpacity>
            </View>

            {recentRecords.map((record) => (
              <View key={record.id} style={styles.card}>
                <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{record.title}</Text>
                    <Text style={styles.cardSubtitle}>
                      {new Date(record.recordDate).toLocaleDateString()} • {record.recordType}
                    </Text>
                    {record.doctorName && (
                      <Text style={[styles.cardSubtitle, { marginTop: 4 }]}>
                        Dr. {record.doctorName}
                      </Text>
                    )}
                  </View>
                  {record.isEmergency && (
                    <View style={[styles.badge, styles.emergencyBadge]}>
                      <Text style={[styles.badgeText, styles.emergencyBadgeText]}>
                        Emergency
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </>
        )}

        {healthID && (
          <TouchableOpacity
            style={[styles.button, styles.emergencyButton, { marginTop: 20, marginBottom: 20 }]}
            onPress={() => router.push("/navigation/healthscreens/EmergencyAccessScreen")}
          >
            <MaterialIcons name="emergency" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Emergency Mode</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      <SidebarMenu isVisible={menuVisible} onClose={() => setMenuVisible(false)} />
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={closeAlert}
        onConfirm={alertOnConfirm}
        confirmText={alertConfirmText}
        cancelText={alertCancelText}
      />
    </View>
  );
}
