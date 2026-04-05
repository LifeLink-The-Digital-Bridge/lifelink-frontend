import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../../../utils/theme-context";
import {
  lightTheme,
  darkTheme,
  createHealthStyles,
} from "../../../constants/styles/healthStyles";
import { healthApi } from "../../api/healthApi";

export default function EmergencyAccessScreen() {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createHealthStyles(theme);

  const [healthId, setHealthId] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [emergencyData, setEmergencyData] = useState<any>(null);
  const [verified, setVerified] = useState(false);

  const handleVerify = async () => {
    if (!healthId || !pin) {
      Alert.alert("Error", "Please enter both Health ID and PIN");
      return;
    }

    if (pin.length !== 6) {
      Alert.alert("Error", "PIN must be 6 digits");
      return;
    }

    setLoading(true);
    try {
      const isVerified = await healthApi.verifyEmergencyAccess(healthId, pin);
      
      if (isVerified) {
        const data = await healthApi.getHealthIDByHealthId(healthId);
        setEmergencyData(data);
        setVerified(true);
      } else {
        Alert.alert("Access Denied", "Invalid Health ID or PIN");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to verify emergency access");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setHealthId("");
    setPin("");
    setEmergencyData(null);
    setVerified(false);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: theme.emergencyRed }]}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <MaterialIcons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: "#fff", fontSize: 24 }]}>Emergency Access</Text>
          <Text style={[styles.headerSubtitle, { color: "#fff", opacity: 0.9, fontSize: 12 }]}>
            PIN-Protected Medical Information
          </Text>
        </View>
        <MaterialIcons name="emergency" size={26} color="#fff" />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
        {!verified ? (
          <>
            <View style={[styles.card, styles.emergencyCard]}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                <MaterialIcons name="warning" size={24} color={theme.emergencyRed} />
                <Text style={[styles.cardTitle, { marginLeft: 12, color: theme.emergencyRed }]}>
                  Emergency Use Only
                </Text>
              </View>
              <Text style={styles.cardSubtitle}>
                This feature is designed for emergency medical situations. Enter the patient's Health ID and emergency PIN to access critical medical information.
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Patient Health ID</Text>
              <TextInput
                style={[styles.input, { marginTop: 12 }]}
                placeholder="Enter Health ID (e.g., HEALTH-XXXXXXXX)"
                placeholderTextColor={theme.textSecondary}
                value={healthId}
                onChangeText={setHealthId}
                autoCapitalize="characters"
                maxLength={16}
              />

              <Text style={[styles.cardTitle, { marginTop: 20 }]}>Emergency PIN</Text>
              <TextInput
                style={[styles.input, { marginTop: 12 }]}
                placeholder="Enter 6-digit PIN"
                placeholderTextColor={theme.textSecondary}
                value={pin}
                onChangeText={setPin}
                keyboardType="number-pad"
                maxLength={6}
                secureTextEntry
              />

              <TouchableOpacity
                style={[styles.button, styles.emergencyButton, { marginTop: 24 }]}
                onPress={handleVerify}
                disabled={loading}
              >
                <MaterialIcons name="verified" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.buttonText}>
                  {loading ? "Verifying..." : "Verify Access"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.card}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialIcons name="info" size={20} color={theme.info} />
                <Text style={[styles.cardTitle, { marginLeft: 12 }]}>
                  How It Works
                </Text>
              </View>
              <Text style={[styles.cardSubtitle, { marginTop: 12, lineHeight: 22 }]}>
                1. Scan the patient's Health ID QR code or enter manually{"\n"}
                2. Ask the patient for their 6-digit emergency PIN{"\n"}
                3. Access critical medical information instantly{"\n"}
                4. All access is logged for security
              </Text>
            </View>
          </>
        ) : (
          <>
            <View style={[styles.card, { backgroundColor: theme.success + "15", borderColor: theme.success }]}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                <MaterialIcons name="check-circle" size={28} color={theme.success} />
                <Text style={[styles.cardTitle, { marginLeft: 12, color: theme.success }]}>
                  Access Granted
                </Text>
              </View>
              <Text style={styles.cardSubtitle}>
                Emergency medical information for {emergencyData?.healthId}
              </Text>
            </View>

            <View style={[styles.card, styles.emergencyCard]}>
              <Text style={[styles.cardTitle, { color: theme.emergencyRed }]}>
                Critical Information
              </Text>

              <View style={[styles.infoRow, { borderBottomColor: theme.emergencyRed + "30" }]}>
                <Text style={styles.infoLabel}>Blood Group</Text>
                <Text style={[styles.infoValue, { fontWeight: "700", color: theme.emergencyRed }]}>
                  {emergencyData?.bloodGroup || "Not specified"}
                </Text>
              </View>

              {emergencyData?.allergies && (
                <View style={[styles.infoRow, { borderBottomColor: theme.emergencyRed + "30" }]}>
                  <Text style={styles.infoLabel}>Allergies</Text>
                  <Text style={[styles.infoValue, { fontWeight: "700", color: theme.emergencyRed }]}>
                    {emergencyData.allergies}
                  </Text>
                </View>
              )}

              {emergencyData?.chronicConditions && (
                <View style={[styles.infoRow, { borderBottomColor: theme.emergencyRed + "30" }]}>
                  <Text style={styles.infoLabel}>Chronic Conditions</Text>
                  <Text style={[styles.infoValue, { fontWeight: "700", color: theme.emergencyRed }]}>
                    {emergencyData.chronicConditions}
                  </Text>
                </View>
              )}

              {emergencyData?.currentMedications && (
                <View style={[styles.infoRow, { borderBottomColor: theme.emergencyRed + "30" }]}>
                  <Text style={styles.infoLabel}>Current Medications</Text>
                  <Text style={[styles.infoValue, { fontWeight: "700", color: theme.emergencyRed }]}>
                    {emergencyData.currentMedications}
                  </Text>
                </View>
              )}

              {emergencyData?.bloodPressure && (
                <View style={[styles.infoRow, { borderBottomColor: theme.emergencyRed + "30" }]}>
                  <Text style={styles.infoLabel}>Blood Pressure</Text>
                  <Text style={[styles.infoValue, { fontWeight: "700", color: theme.emergencyRed }]}>
                    {emergencyData.bloodPressure}
                  </Text>
                </View>
              )}

              {(emergencyData?.hasDiabetes !== undefined && emergencyData?.hasDiabetes !== null) && (
                <View style={[styles.infoRow, { borderBottomColor: theme.emergencyRed + "30" }]}>
                  <Text style={styles.infoLabel}>Diabetes</Text>
                  <Text style={[styles.infoValue, { fontWeight: "700", color: theme.emergencyRed }]}>
                    {emergencyData.hasDiabetes ? "Yes" : "No"}
                  </Text>
                </View>
              )}

              {(emergencyData?.hasChronicDiseases !== undefined && emergencyData?.hasChronicDiseases !== null) && (
                <View style={[styles.infoRow, { borderBottomColor: theme.emergencyRed + "30" }]}>
                  <Text style={styles.infoLabel}>Chronic Disease Flag</Text>
                  <Text style={[styles.infoValue, { fontWeight: "700", color: theme.emergencyRed }]}>
                    {emergencyData.hasChronicDiseases ? "Yes" : "No"}
                  </Text>
                </View>
              )}

              {emergencyData?.hemoglobinLevel && (
                <View style={[styles.infoRow, { borderBottomColor: theme.emergencyRed + "30" }]}>
                  <Text style={styles.infoLabel}>Hemoglobin</Text>
                  <Text style={[styles.infoValue, { fontWeight: "700", color: theme.emergencyRed }]}>
                    {emergencyData.hemoglobinLevel}
                  </Text>
                </View>
              )}

              {emergencyData?.medicalHistory && (
                <View style={[styles.infoRow, { borderBottomColor: theme.emergencyRed + "30" }]}>
                  <Text style={styles.infoLabel}>Medical History</Text>
                  <Text style={[styles.infoValue, { fontWeight: "700", color: theme.emergencyRed }]}>
                    {emergencyData.medicalHistory}
                  </Text>
                </View>
              )}
            </View>

            {emergencyData?.emergencyContactName && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Emergency Contact</Text>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Name</Text>
                  <Text style={styles.infoValue}>{emergencyData.emergencyContactName}</Text>
                </View>

                {emergencyData?.emergencyContactPhone && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Phone</Text>
                    <Text style={styles.infoValue}>{emergencyData.emergencyContactPhone}</Text>
                  </View>
                )}
              </View>
            )}

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Additional Profile Information</Text>
              {emergencyData?.currentCity && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Current City</Text>
                  <Text style={styles.infoValue}>{emergencyData.currentCity}</Text>
                </View>
              )}
              {emergencyData?.currentState && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Current State</Text>
                  <Text style={styles.infoValue}>{emergencyData.currentState}</Text>
                </View>
              )}
              {emergencyData?.occupation && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Occupation</Text>
                  <Text style={styles.infoValue}>{emergencyData.occupation}</Text>
                </View>
              )}
              {emergencyData?.preferredLanguage && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Preferred Language</Text>
                  <Text style={styles.infoValue}>{emergencyData.preferredLanguage}</Text>
                </View>
              )}
              {emergencyData?.lastCheckupDate && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Last Checkup</Text>
                  <Text style={styles.infoValue}>
                    {new Date(emergencyData.lastCheckupDate).toLocaleString()}
                  </Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleReset}
            >
              <MaterialIcons name="refresh" size={20} color={theme.primary} style={{ marginRight: 8 }} />
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                New Emergency Access
              </Text>
            </TouchableOpacity>

            <View style={[styles.card, { backgroundColor: theme.warning + "15", borderColor: theme.warning }]}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialIcons name="security" size={20} color={theme.warning} />
                <Text style={[styles.cardTitle, { marginLeft: 12, color: theme.warning }]}>
                  Security Notice
                </Text>
              </View>
              <Text style={[styles.cardSubtitle, { marginTop: 8 }]}>
                This access has been logged for security purposes. Use this information only for emergency medical care.
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
