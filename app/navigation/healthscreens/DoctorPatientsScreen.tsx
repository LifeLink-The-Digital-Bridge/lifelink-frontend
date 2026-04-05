import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from "react-native";
import { router } from "expo-router";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { useTheme } from "../../../utils/theme-context";
import {
  darkTheme,
  lightTheme,
  createHealthStyles,
} from "../../../constants/styles/healthStyles";
import { healthApi, HealthIDDTO, HealthRecordDTO } from "../../api/healthApi";
import { getUsersByIds } from "../../api/userApi";
import { SidebarMenu } from "../../../components/dashboard/SidebarMenu";
import { CustomAlert } from "../../../components/common/CustomAlert";

type DoctorPatientCard = {
  associationId: string;
  patientUserId: string;
  patientName?: string;
  patientHealthId: string;
  firstConsultationDate?: string;
  lastConsultationDate?: string;
  totalConsultations?: number;
  notes?: string;
  healthID?: HealthIDDTO;
  records: HealthRecordDTO[];
};

export default function DoctorPatientsScreen() {
  const { colorScheme } = useTheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  const styles = createHealthStyles(theme);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [patients, setPatients] = useState<DoctorPatientCard[]>([]);
  const [expandedPatientId, setExpandedPatientId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [showEmergencyOnly, setShowEmergencyOnly] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  useEffect(() => {
    loadDoctorPatients();
  }, []);

  const loadDoctorPatients = async () => {
    try {
      setLoading(true);
      const doctorId = await SecureStore.getItemAsync("userId");
      if (!doctorId) {
        throw new Error("Doctor session not found");
      }

      const associations = await healthApi.getDoctorPatients(doctorId);
      const mapped: DoctorPatientCard[] = await Promise.all(
        associations.map(async (association: any) => {
          const [healthID, records] = await Promise.all([
            healthApi.getHealthIDByHealthId(String(association.patientHealthId)),
            healthApi.getHealthRecordsByHealthId(String(association.patientHealthId)),
          ]);

          return {
            associationId: String(association.id),
            patientUserId: String(association.patientUserId),
            patientHealthId: String(association.patientHealthId),
            firstConsultationDate: association.firstConsultationDate,
            lastConsultationDate: association.lastConsultationDate,
            totalConsultations: association.totalConsultations,
            notes: association.notes,
            healthID,
            records,
          } as DoctorPatientCard;
        })
      );

      const patientIds = Array.from(new Set(mapped.map((patient) => patient.patientUserId)));
      const users = patientIds.length > 0 ? await getUsersByIds(patientIds) : [];
      const userNameMap = users.reduce<Record<string, string>>((acc, user) => {
        acc[user.id] = user.name || user.username || user.id;
        return acc;
      }, {});

      const enriched = mapped.map((patient) => ({
        ...patient,
        patientName: userNameMap[patient.patientUserId] || "Unknown Migrant",
      }));

      setPatients(enriched);
    } catch (error: any) {
      showAlert("Error", error.message || "Failed to load monitored migrants");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDoctorPatients();
  };

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const emergencyCount = patient.records.filter((record) => record.isEmergency).length;
      if (showEmergencyOnly && emergencyCount === 0) {
        return false;
      }
      if (!searchText.trim()) {
        return true;
      }
      const query = searchText.trim().toLowerCase();
      return (
        (patient.patientName || "").toLowerCase().includes(query) ||
        (patient.patientHealthId || "").toLowerCase().includes(query) ||
        (patient.healthID?.currentCity || "").toLowerCase().includes(query)
      );
    });
  }, [patients, searchText, showEmergencyOnly]);

  const renderDetailRow = (label: string, value?: string | number | null) => {
    if (value === null || value === undefined || String(value).trim() === "") {
      return null;
    }
    return (
      <View style={[styles.infoRow, { alignItems: "flex-start", paddingVertical: 12 }]}>
        <Text style={[styles.infoLabel, { flex: 0.52, paddingRight: 16, lineHeight: 22 }]}>{label}</Text>
        <Text style={[styles.infoValue, { flex: 0.48, textAlign: "left", lineHeight: 22, paddingLeft: 8 }]}>
          {String(value)}
        </Text>
      </View>
    );
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
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => setMenuVisible(true)} style={{ marginRight: 10, padding: 4 }}>
            <MaterialIcons name="menu" size={22} color={theme.text} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={[styles.headerTitle, { fontSize: 21 }]}>Monitored Migrants</Text>
            <Text style={[styles.headerSubtitle, { fontSize: 12 }]}>Connected patients and records</Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/navigation/notifications" as any)} style={{ padding: 4 }}>
            <MaterialIcons name="notifications-none" size={22} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={[styles.card, { marginBottom: 12 }]}>
          <Text style={styles.cardTitle}>Filter Patients</Text>
          <TextInput
            style={[styles.input, { marginTop: 10 }]}
            placeholder="Search by patient name, Health ID or city"
            placeholderTextColor={theme.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
          />
          <View style={{ flexDirection: "row", marginTop: 2 }}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.secondaryButton,
                { flex: 1, marginRight: 8, minHeight: 34, marginVertical: 0, paddingVertical: 8 },
              ]}
              onPress={() => setShowEmergencyOnly(false)}
            >
              <Text style={[styles.buttonText, styles.secondaryButtonText, { fontSize: 13 }]}>All Patients</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                { flex: 1, marginLeft: 8, minHeight: 34, marginVertical: 0, paddingVertical: 8, backgroundColor: theme.error },
              ]}
              onPress={() => setShowEmergencyOnly(true)}
            >
              <Text style={[styles.buttonText, { fontSize: 13 }]}>Emergency Only</Text>
            </TouchableOpacity>
          </View>
        </View>

        {filteredPatients.length === 0 ? (
          <View style={styles.emptyState}>
            <FontAwesome5 name="user-md" size={72} color={theme.textSecondary} style={styles.emptyStateIcon} />
            <Text style={styles.emptyStateText}>No matching migrants</Text>
            <Text style={styles.emptyStateSubtext}>
              Try changing filters or search text.
            </Text>
          </View>
        ) : (
          filteredPatients.map((patient) => {
            const emergencyCount = patient.records.filter((r) => r.isEmergency).length;
            const latest = patient.records[0];

            return (
              <TouchableOpacity
                key={patient.associationId}
                style={styles.card}
                activeOpacity={0.9}
                onPress={() =>
                  setExpandedPatientId((prev) =>
                    prev === patient.associationId ? null : patient.associationId
                  )
                }
              >
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>
                      {patient.healthID?.healthId || patient.patientHealthId}
                    </Text>
                    <Text style={styles.cardSubtitle}>
                      Patient Name: {patient.patientName || "Unknown Migrant"}
                    </Text>
                    <Text style={styles.cardSubtitle}>
                      Blood Group: {patient.healthID?.bloodGroup || "-"} {patient.healthID?.rhFactor || ""}
                    </Text>
                    <Text style={styles.cardSubtitle}>
                      Consultations: {patient.totalConsultations || 0}
                    </Text>
                    <Text style={styles.cardSubtitle}>
                      Last Consultation:{" "}
                      {patient.lastConsultationDate
                        ? new Date(patient.lastConsultationDate).toLocaleString()
                        : "-"}
                    </Text>
                    <Text style={[styles.cardSubtitle, { marginTop: 4 }]}>
                      {expandedPatientId === patient.associationId ? "Tap to collapse details" : "Tap to expand details"}
                    </Text>
                  </View>
                  <View style={[styles.badge, emergencyCount > 0 ? styles.emergencyBadge : { backgroundColor: theme.success + "20" }]}>
                    <Text style={[styles.badgeText, emergencyCount > 0 ? styles.emergencyBadgeText : { color: theme.success }]}>
                      Emergency: {emergencyCount}
                    </Text>
                  </View>
                </View>

                {latest && (
                  <View style={{ marginBottom: 12 }}>
                    <Text style={styles.infoLabel}>Latest Record</Text>
                    <Text style={styles.infoValue}>{latest.title}</Text>
                    <Text style={styles.cardSubtitle}>
                      {new Date(latest.recordDate).toLocaleDateString()} • Updated{" "}
                      {latest.updatedAt ? new Date(latest.updatedAt).toLocaleString() : "-"}
                    </Text>
                  </View>
                )}

                {expandedPatientId === patient.associationId && (
                  <View
                    style={{
                      marginBottom: 12,
                      borderTopWidth: 1,
                      borderTopColor: theme.border,
                      paddingTop: 14,
                    }}
                  >
                    <Text style={[styles.cardTitle, { fontSize: 16, marginBottom: 12 }]}>Migrant Health ID Details</Text>
                    {renderDetailRow("Blood Group", patient.healthID?.bloodGroup)}
                    {renderDetailRow("Rh Factor", patient.healthID?.rhFactor)}
                    {renderDetailRow("Allergies", patient.healthID?.allergies)}
                    {renderDetailRow("Chronic Conditions", patient.healthID?.chronicConditions)}
                    {renderDetailRow("Current Medications", patient.healthID?.currentMedications)}
                    {renderDetailRow("Vaccination Status", patient.healthID?.vaccinationStatus)}
                    {renderDetailRow("Medical History", patient.healthID?.medicalHistory)}
                    {renderDetailRow(
                      "Has Chronic Diseases",
                      patient.healthID?.hasChronicDiseases === undefined
                        ? null
                        : patient.healthID?.hasChronicDiseases
                        ? "Yes"
                        : "No"
                    )}
                    {renderDetailRow(
                      "Has Diabetes",
                      patient.healthID?.hasDiabetes === undefined
                        ? null
                        : patient.healthID?.hasDiabetes
                        ? "Yes"
                        : "No"
                    )}
                    {renderDetailRow("Blood Pressure", patient.healthID?.bloodPressure)}
                    {renderDetailRow("Hemoglobin Level", patient.healthID?.hemoglobinLevel)}
                    {renderDetailRow("Height (cm)", patient.healthID?.heightCm)}
                    {renderDetailRow("Weight (kg)", patient.healthID?.weightKg)}
                    {renderDetailRow("Current City", patient.healthID?.currentCity)}
                    {renderDetailRow("Current State", patient.healthID?.currentState)}
                    {renderDetailRow("Occupation", patient.healthID?.occupation)}
                    {renderDetailRow("Preferred Language", patient.healthID?.preferredLanguage)}
                    {renderDetailRow("Emergency Contact Name", patient.healthID?.emergencyContactName)}
                    {renderDetailRow("Emergency Contact Phone", patient.healthID?.emergencyContactPhone)}
                    {renderDetailRow(
                      "Health ID Updated At",
                      patient.healthID?.updatedAt
                        ? new Date(patient.healthID.updatedAt).toLocaleString()
                        : null
                    )}
                  </View>
                )}

                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    style={[styles.button, { flex: 1, marginRight: 8, minHeight: 34, marginVertical: 0, paddingVertical: 8 }]}
                    onPress={() =>
                      router.push({
                        pathname: "/navigation/healthscreens/HealthRecordsScreen",
                        params: {
                          userId: patient.patientUserId,
                          healthId: patient.patientHealthId,
                        },
                      })
                    }
                  >
                    <Text style={[styles.buttonText, { fontSize: 13 }]}>View Records</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.secondaryButton, { flex: 1, marginLeft: 8, minHeight: 34, marginVertical: 0, paddingVertical: 8 }]}
                    onPress={() =>
                      router.push({
                        pathname: "/navigation/healthscreens/AddHealthRecordScreen",
                        params: {
                          userId: patient.patientUserId,
                          healthId: patient.patientHealthId,
                        },
                      })
                    }
                  >
                    <Text style={[styles.buttonText, styles.secondaryButtonText, { fontSize: 13 }]}>Add Record</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />

      <SidebarMenu isVisible={menuVisible} onClose={() => setMenuVisible(false)} />
    </View>
  );
}
