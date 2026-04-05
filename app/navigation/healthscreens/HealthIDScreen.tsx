import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Switch,
} from "react-native";
import { router } from "expo-router";
import { MaterialIcons, FontAwesome5, Feather } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import * as Clipboard from "expo-clipboard";
import QRCode from "react-native-qrcode-svg";
import { CustomPicker } from "../../../components/common/CustomPicker";
import { CustomDatePicker } from "../../../components/common/DatePicker";
import { CustomAlert } from "../../../components/common/CustomAlert";
import { useTheme } from "../../../utils/theme-context";
import { useRole } from "../../../utils/role-context";
import {
  lightTheme,
  darkTheme,
  createHealthStyles,
} from "../../../constants/styles/healthStyles";
import { healthApi, HealthIDDTO } from "../../api/healthApi";
import {
  validateHemoglobin,
  validateHeight,
  validateWeight,
} from "../../../utils/medicalValidation";
import {
  validateBloodPressure,
  getBloodPressureCategory,
} from "../../../utils/bloodPressureValidator";

const BLOOD_GROUPS = [
  { label: "A+", value: "A+" },
  { label: "A-", value: "A-" },
  { label: "B+", value: "B+" },
  { label: "B-", value: "B-" },
  { label: "AB+", value: "AB+" },
  { label: "AB-", value: "AB-" },
  { label: "O+", value: "O+" },
  { label: "O-", value: "O-" },
];

const RH_FACTORS = [
  { label: "Positive (+)", value: "+" },
  { label: "Negative (-)", value: "-" },
];

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
].map((s) => ({ label: s, value: s }));

const LANGUAGES = [
  "Hindi", "English", "Malayalam", "Tamil", "Telugu", "Kannada",
  "Bengali", "Marathi", "Gujarati", "Punjabi", "Odia", "Urdu",
].map((l) => ({ label: l, value: l }));

export default function HealthIDScreen() {
  const { isDark } = useTheme();
  const { isMigrant, isDoctor, isNGO } = useRole();
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createHealthStyles(theme);

  const [loading, setLoading] = useState(true);
  const [healthID, setHealthID] = useState<HealthIDDTO | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [showQR, setShowQR] = useState(true);
  const [userId, setUserId] = useState("");
  const [creating, setCreating] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const [formData, setFormData] = useState({
    bloodGroup: "",
    rhFactor: "",
    allergies: "",
    chronicConditions: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyPin: "",
    heightCm: "",
    weightKg: "",
    currentMedications: "",
    vaccinationStatus: "",
    medicalHistory: "",
    hasChronicDiseases: false,
    hasDiabetes: false,
    bloodPressure: "",
    hemoglobinLevel: "",
    lastCheckupDate: "",
    currentCity: "",
    currentState: "",
    occupation: "",
    preferredLanguage: "",
  });

  const [touched, setTouched] = useState<{ [key: string]: boolean }>({
    bloodGroup: false,
    rhFactor: false,
    hemoglobinLevel: false,
    bloodPressure: false,
    heightCm: false,
    weightKg: false,
    lastCheckupDate: false,
    currentCity: false,
    currentState: false,
    occupation: false,
    preferredLanguage: false,
    emergencyPin: false,
    emergencyContactPhone: false,
  });

  const bpValidation = validateBloodPressure(formData.bloodPressure);
  const hbValidation = validateHemoglobin(formData.hemoglobinLevel, "");
  const heightValidation = validateHeight(formData.heightCm);
  const weightValidation = validateWeight(formData.weightKg);

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const alertModal = (
    <CustomAlert
      visible={alertVisible}
      title={alertTitle}
      message={alertMessage}
      onClose={() => setAlertVisible(false)}
    />
  );

  const touch = (field: string) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  useEffect(() => {
    loadHealthID();
  }, []);

  const loadHealthID = async () => {
    try {
      const uid = await SecureStore.getItemAsync("userId");
      if (!uid) return;
      setUserId(uid);
      const data = await healthApi.getHealthIDByUserId(uid);
      setHealthID(data);
    } catch {
      setHealthID(null);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): string | null => {
    if (!formData.bloodGroup) return "Blood Group is required.";
    if (!formData.rhFactor) return "Rh Factor is required.";
    if (!formData.currentCity.trim()) return "Current City is required.";
    if (!formData.currentState) return "Current State is required.";
    if (!formData.occupation.trim()) return "Occupation is required.";
    if (!formData.preferredLanguage) return "Preferred Language is required.";
    if (!formData.emergencyPin.trim()) return "Emergency PIN is required.";
    if (!/^\d{6}$/.test(formData.emergencyPin.trim())) return "Emergency PIN must be exactly 6 digits.";

    if (formData.bloodPressure && !bpValidation.isValid) return bpValidation.message;
    if (formData.hemoglobinLevel && !hbValidation.isValid) return hbValidation.message;
    if (formData.heightCm && !heightValidation.isValid) return heightValidation.message;
    if (formData.weightKg && !weightValidation.isValid) return weightValidation.message;

    const hasName = !!formData.emergencyContactName.trim();
    const hasPhone = !!formData.emergencyContactPhone.trim();
    if (hasName && !hasPhone) return "Emergency contact phone is required when name is provided.";
    if (hasPhone && !hasName) return "Emergency contact name is required when phone is provided.";
    if (hasPhone && !/^\d{10}$/.test(formData.emergencyContactPhone.trim()))
      return "Emergency contact phone must be a valid 10-digit number.";

    return null;
  };

  const handleCreateHealthID = async () => {
    if (!userId) {
      showAlert("Error", "User not found. Please login again.");
      return;
    }
    setTouched({
      bloodGroup: true, rhFactor: true, hemoglobinLevel: true,
      bloodPressure: true, heightCm: true, weightKg: true,
      currentCity: true, currentState: true, occupation: true,
      preferredLanguage: true, emergencyPin: true, emergencyContactPhone: true,
    });

    const error = validateForm();
    if (error) {
      showAlert("Validation Error", error);
      return;
    }

    try {
      setCreating(true);
      const payload = {
        userId,
        bloodGroup: formData.bloodGroup,
        rhFactor: formData.rhFactor,
        allergies: formData.allergies.trim() || undefined,
        chronicConditions: formData.chronicConditions.trim() || undefined,
        emergencyContactName: formData.emergencyContactName.trim() || undefined,
        emergencyContactPhone: formData.emergencyContactPhone.trim() || undefined,
        emergencyPin: formData.emergencyPin.trim(),
        heightCm: formData.heightCm ? parseFloat(formData.heightCm) : undefined,
        weightKg: formData.weightKg ? parseFloat(formData.weightKg) : undefined,
        currentMedications: formData.currentMedications.trim() || undefined,
        vaccinationStatus: formData.vaccinationStatus.trim() || undefined,
        medicalHistory: formData.medicalHistory.trim() || undefined,
        hasChronicDiseases: formData.hasChronicDiseases,
        hasDiabetes: formData.hasDiabetes,
        bloodPressure: formData.bloodPressure.trim() || undefined,
        hemoglobinLevel: formData.hemoglobinLevel ? parseFloat(formData.hemoglobinLevel) : undefined,
        lastCheckupDate: formData.lastCheckupDate || undefined,
        currentCity: formData.currentCity.trim() || undefined,
        currentState: formData.currentState || undefined,
        occupation: formData.occupation.trim() || undefined,
        preferredLanguage: formData.preferredLanguage || undefined,
      };

      const saved = healthID && editMode
        ? await healthApi.updateHealthID(healthID.healthId, payload)
        : await healthApi.createHealthID(payload);

      setHealthID(saved);
      setEditMode(false);
      showAlert("Success", healthID && editMode ? "Health ID updated successfully." : "Health ID created successfully.");
    } catch (error: any) {
      showAlert("Failed", error?.message || "Unable to save Health ID");
    } finally {
      setCreating(false);
    }
  };

  const openEditMode = () => {
    if (!healthID) {
      return;
    }

    const normalizedRh = (() => {
      const value = String(healthID.rhFactor || "").toUpperCase();
      if (value === "POSITIVE" || value === "POS" || value === "RH+" || value === "+") return "+";
      if (value === "NEGATIVE" || value === "NEG" || value === "RH-" || value === "-") return "-";
      return healthID.rhFactor || "";
    })();

    setFormData({
      bloodGroup: healthID.bloodGroup || "",
      rhFactor: normalizedRh,
      allergies: healthID.allergies || "",
      chronicConditions: healthID.chronicConditions || "",
      emergencyContactName: healthID.emergencyContactName || "",
      emergencyContactPhone: healthID.emergencyContactPhone || "",
      emergencyPin: "",
      heightCm: healthID.heightCm != null ? String(healthID.heightCm) : "",
      weightKg: healthID.weightKg != null ? String(healthID.weightKg) : "",
      currentMedications: healthID.currentMedications || "",
      vaccinationStatus: healthID.vaccinationStatus || "",
      medicalHistory: healthID.medicalHistory || "",
      hasChronicDiseases: !!healthID.hasChronicDiseases,
      hasDiabetes: !!healthID.hasDiabetes,
      bloodPressure: healthID.bloodPressure || "",
      hemoglobinLevel: healthID.hemoglobinLevel != null ? String(healthID.hemoglobinLevel) : "",
      lastCheckupDate: healthID.lastCheckupDate ? String(healthID.lastCheckupDate).slice(0, 10) : "",
      currentCity: healthID.currentCity || "",
      currentState: healthID.currentState || "",
      occupation: healthID.occupation || "",
      preferredLanguage: healthID.preferredLanguage || "",
    });

    setTouched({
      bloodGroup: false,
      rhFactor: false,
      hemoglobinLevel: false,
      bloodPressure: false,
      heightCm: false,
      weightKg: false,
      lastCheckupDate: false,
      currentCity: false,
      currentState: false,
      occupation: false,
      preferredLanguage: false,
      emergencyPin: false,
      emergencyContactPhone: false,
    });
    setEditMode(true);
  };

  const copyHealthID = async () => {
    if (healthID) {
      await Clipboard.setStringAsync(healthID.healthId);
      showAlert("Copied", "Health ID copied to clipboard");
    }
  };

  const shareQR = () => {
    showAlert(
      "Share Health ID",
      "Show this QR code to healthcare providers for instant access to your health records."
    );
  };

  const InlineError = ({ msg }: { msg: string }) => (
    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
      <Feather name="alert-circle" size={12} color={theme.error} />
      <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>{msg}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        {alertModal}
      </View>
    );
  }

  if (!isMigrant || isDoctor || isNGO) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
            <MaterialIcons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Your Health ID</Text>
            <Text style={styles.headerSubtitle}>Access Restricted</Text>
          </View>
        </View>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
          <FontAwesome5 name="id-card" size={56} color={theme.textSecondary} />
          <Text style={[styles.cardTitle, { marginTop: 16, textAlign: "center" }]}>Migrant Access Required</Text>
          <Text style={[styles.cardSubtitle, { textAlign: "center", marginTop: 8 }]}>
            Only migrant users can create and manage Health ID.
          </Text>
        </View>
        {alertModal}
      </View>
    );
  }

  if (!healthID || editMode) {
    const isUpdating = !!healthID && editMode;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
            <MaterialIcons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Your Health ID</Text>
            <Text style={styles.headerSubtitle}>{isUpdating ? "Update your Health ID" : "Create your Health ID"}</Text>
          </View>
        </View>

        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
          <View style={styles.card}>
            <MaterialIcons name="qr-code-2" size={36} color={theme.healthPrimary} />
            <Text style={[styles.cardTitle, { marginTop: 10 }]}>{isUpdating ? "Update Health ID" : "Create Health ID"}</Text>
            <Text style={[styles.cardSubtitle, { marginBottom: 20 }]}>
              {isUpdating ? "Update your details and save changes." : "Fill the details below to generate your Health ID."}
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Blood Group <Text style={{ color: theme.error }}>*</Text>
              </Text>
              <CustomPicker
                selectedValue={formData.bloodGroup}
                onValueChange={(v) => { setFormData((p) => ({ ...p, bloodGroup: v })); touch("bloodGroup"); }}
                items={BLOOD_GROUPS}
                placeholder="Select Blood Group"
                style={touched.bloodGroup && !formData.bloodGroup ? { borderColor: theme.error, borderWidth: 2 } : {}}
              />
              {touched.bloodGroup && !formData.bloodGroup && <InlineError msg="Blood group is required" />}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Rh Factor <Text style={{ color: theme.error }}>*</Text>
              </Text>
              <CustomPicker
                selectedValue={formData.rhFactor}
                onValueChange={(v) => { setFormData((p) => ({ ...p, rhFactor: v })); touch("rhFactor"); }}
                items={RH_FACTORS}
                placeholder="Select Rh Factor"
                style={touched.rhFactor && !formData.rhFactor ? { borderColor: theme.error, borderWidth: 2 } : {}}
              />
              {touched.rhFactor && !formData.rhFactor && <InlineError msg="Rh factor is required" />}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Blood Pressure (mmHg)</Text>
              <TextInput
                style={[
                  styles.input,
                  formData.bloodPressure && !bpValidation.isValid
                    ? { borderColor: theme.error, borderWidth: 2 }
                    : {},
                ]}
                placeholder="120/80"
                placeholderTextColor={theme.textSecondary}
                value={formData.bloodPressure}
                onChangeText={(v) => setFormData((p) => ({ ...p, bloodPressure: v }))}
                onBlur={() => touch("bloodPressure")}
                keyboardType="numbers-and-punctuation"
              />
              {formData.bloodPressure && !bpValidation.isValid && (
                <InlineError msg={bpValidation.message} />
              )}
              {bpValidation.isValid && bpValidation.systolic && bpValidation.diastolic && (
                <Text style={{ fontSize: 12, color: theme.success, marginTop: 4 }}>
                  ✓ {getBloodPressureCategory(bpValidation.systolic, bpValidation.diastolic)}
                </Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Hemoglobin Level (g/dL)</Text>
              <TextInput
                style={[
                  styles.input,
                  formData.hemoglobinLevel && !hbValidation.isValid
                    ? { borderColor: theme.error, borderWidth: 2 }
                    : {},
                ]}
                placeholder="13.5"
                placeholderTextColor={theme.textSecondary}
                value={formData.hemoglobinLevel}
                onChangeText={(v) => setFormData((p) => ({ ...p, hemoglobinLevel: v }))}
                onBlur={() => touch("hemoglobinLevel")}
                keyboardType="decimal-pad"
              />
              {formData.hemoglobinLevel && !hbValidation.isValid && (
                <InlineError msg={hbValidation.message} />
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Height (cm)</Text>
              <TextInput
                style={[
                  styles.input,
                  formData.heightCm && !heightValidation.isValid
                    ? { borderColor: theme.error, borderWidth: 2 }
                    : {},
                ]}
                placeholder="170"
                placeholderTextColor={theme.textSecondary}
                value={formData.heightCm}
                onChangeText={(v) => setFormData((p) => ({ ...p, heightCm: v }))}
                onBlur={() => touch("heightCm")}
                keyboardType="decimal-pad"
              />
              {formData.heightCm && !heightValidation.isValid && (
                <InlineError msg={heightValidation.message} />
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Weight (kg)</Text>
              <TextInput
                style={[
                  styles.input,
                  formData.weightKg && !weightValidation.isValid
                    ? { borderColor: theme.error, borderWidth: 2 }
                    : {},
                ]}
                placeholder="70"
                placeholderTextColor={theme.textSecondary}
                value={formData.weightKg}
                onChangeText={(v) => setFormData((p) => ({ ...p, weightKg: v }))}
                onBlur={() => touch("weightKg")}
                keyboardType="decimal-pad"
              />
              {formData.weightKg && !weightValidation.isValid && (
                <InlineError msg={weightValidation.message} />
              )}
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Has Diabetes?</Text>
              <Switch
                value={formData.hasDiabetes}
                onValueChange={(v) => setFormData((p) => ({ ...p, hasDiabetes: v }))}
                thumbColor={theme.primary}
                trackColor={{ false: theme.border, true: theme.primary + "50" }}
              />
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Has Chronic Diseases?</Text>
              <Switch
                value={formData.hasChronicDiseases}
                onValueChange={(v) => setFormData((p) => ({ ...p, hasChronicDiseases: v }))}
                thumbColor={theme.primary}
                trackColor={{ false: theme.border, true: theme.primary + "50" }}
              />
            </View>

            {formData.hasChronicDiseases && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Chronic Conditions</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  multiline
                  numberOfLines={3}
                  placeholder="Describe chronic conditions..."
                  placeholderTextColor={theme.textSecondary}
                  value={formData.chronicConditions}
                  onChangeText={(v) => setFormData((p) => ({ ...p, chronicConditions: v }))}
                />
              </View>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Last Medical Checkup</Text>
              <CustomDatePicker
                selectedDate={formData.lastCheckupDate}
                onDateChange={(v) => { setFormData((p) => ({ ...p, lastCheckupDate: v })); touch("lastCheckupDate"); }}
                placeholder="Select Date"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Medical History</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                multiline
                numberOfLines={4}
                placeholder="Previous surgeries, diagnoses, etc."
                placeholderTextColor={theme.textSecondary}
                value={formData.medicalHistory}
                onChangeText={(v) => setFormData((p) => ({ ...p, medicalHistory: v }))}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Allergies</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Penicillin, Peanuts (optional)"
                placeholderTextColor={theme.textSecondary}
                value={formData.allergies}
                onChangeText={(v) => setFormData((p) => ({ ...p, allergies: v }))}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Current Medications</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                multiline
                numberOfLines={3}
                placeholder="List current medications..."
                placeholderTextColor={theme.textSecondary}
                value={formData.currentMedications}
                onChangeText={(v) => setFormData((p) => ({ ...p, currentMedications: v }))}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Current City <Text style={{ color: theme.error }}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  touched.currentCity && !formData.currentCity.trim()
                    ? { borderColor: theme.error, borderWidth: 2 }
                    : {},
                ]}
                placeholder="e.g. Mumbai"
                placeholderTextColor={theme.textSecondary}
                value={formData.currentCity}
                onChangeText={(v) => setFormData((p) => ({ ...p, currentCity: v }))}
                onBlur={() => touch("currentCity")}
              />
              {touched.currentCity && !formData.currentCity.trim() && (
                <InlineError msg="Current city is required" />
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Current State <Text style={{ color: theme.error }}>*</Text>
              </Text>
              <CustomPicker
                selectedValue={formData.currentState}
                onValueChange={(v) => { setFormData((p) => ({ ...p, currentState: v })); touch("currentState"); }}
                items={INDIAN_STATES}
                placeholder="Select State"
                style={touched.currentState && !formData.currentState ? { borderColor: theme.error, borderWidth: 2 } : {}}
              />
              {touched.currentState && !formData.currentState && (
                <InlineError msg="Current state is required" />
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Occupation <Text style={{ color: theme.error }}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  touched.occupation && !formData.occupation.trim()
                    ? { borderColor: theme.error, borderWidth: 2 }
                    : {},
                ]}
                placeholder="e.g. Construction Worker"
                placeholderTextColor={theme.textSecondary}
                value={formData.occupation}
                onChangeText={(v) => setFormData((p) => ({ ...p, occupation: v }))}
                onBlur={() => touch("occupation")}
              />
              {touched.occupation && !formData.occupation.trim() && (
                <InlineError msg="Occupation is required" />
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Preferred Language <Text style={{ color: theme.error }}>*</Text>
              </Text>
              <CustomPicker
                selectedValue={formData.preferredLanguage}
                onValueChange={(v) => { setFormData((p) => ({ ...p, preferredLanguage: v })); touch("preferredLanguage"); }}
                items={LANGUAGES}
                placeholder="Select Language"
                style={touched.preferredLanguage && !formData.preferredLanguage ? { borderColor: theme.error, borderWidth: 2 } : {}}
              />
              {touched.preferredLanguage && !formData.preferredLanguage && (
                <InlineError msg="Preferred language is required" />
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Emergency Contact Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Contact person's name (optional)"
                placeholderTextColor={theme.textSecondary}
                value={formData.emergencyContactName}
                onChangeText={(v) => setFormData((p) => ({ ...p, emergencyContactName: v }))}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Emergency Contact Phone</Text>
              <TextInput
                style={[
                  styles.input,
                  touched.emergencyContactPhone &&
                  formData.emergencyContactPhone &&
                  !/^\d{10}$/.test(formData.emergencyContactPhone.trim())
                    ? { borderColor: theme.error, borderWidth: 2 }
                    : {},
                ]}
                placeholder="10-digit phone number (optional)"
                placeholderTextColor={theme.textSecondary}
                value={formData.emergencyContactPhone}
                onChangeText={(v) => setFormData((p) => ({ ...p, emergencyContactPhone: v }))}
                onBlur={() => touch("emergencyContactPhone")}
                keyboardType="phone-pad"
                maxLength={10}
              />
              {touched.emergencyContactPhone &&
                formData.emergencyContactPhone &&
                !/^\d{10}$/.test(formData.emergencyContactPhone.trim()) && (
                  <InlineError msg="Must be a valid 10-digit number" />
                )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Emergency PIN <Text style={{ color: theme.error }}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  touched.emergencyPin && formData.emergencyPin.length > 0 && !/^\d{6}$/.test(formData.emergencyPin)
                    ? { borderColor: theme.error, borderWidth: 2 }
                    : {},
                ]}
                placeholder="6-digit PIN"
                placeholderTextColor={theme.textSecondary}
                value={formData.emergencyPin}
                onChangeText={(v) => setFormData((p) => ({ ...p, emergencyPin: v }))}
                onBlur={() => touch("emergencyPin")}
                secureTextEntry
                keyboardType="number-pad"
                maxLength={6}
              />
              {touched.emergencyPin && formData.emergencyPin.length > 0 && !/^\d{6}$/.test(formData.emergencyPin) && (
                <InlineError msg="PIN must be exactly 6 digits" />
              )}
              {touched.emergencyPin && !formData.emergencyPin && (
                <InlineError msg="Emergency PIN is required" />
              )}
            </View>

            <TouchableOpacity
              style={[styles.button, creating && { opacity: 0.7 }, { marginTop: 10 }]}
              disabled={creating}
              onPress={handleCreateHealthID}
            >
              {creating ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>{isUpdating ? "Update Health ID" : "Create Health ID"}</Text>
              )}
            </TouchableOpacity>
            {isUpdating && (
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton, { marginTop: 10 }]}
                onPress={() => setEditMode(false)}
              >
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
        {alertModal}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
          <MaterialIcons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Your Health ID</Text>
          <Text style={styles.headerSubtitle}>Your Digital Health Identity</Text>
        </View>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
        <View style={[styles.card, { backgroundColor: theme.healthPrimary + "10", borderColor: theme.healthPrimary }]}>
          <Text style={[styles.cardTitle, { textAlign: "center", color: theme.healthPrimary }]}>
            Your Health ID
          </Text>
          <TouchableOpacity onPress={copyHealthID}>
            <Text style={[styles.healthIdText, { textAlign: "center" }]}>{healthID.healthId}</Text>
          </TouchableOpacity>
          <Text style={[styles.cardSubtitle, { textAlign: "center", marginTop: 8 }]}>Tap to copy</Text>
        </View>

        {showQR && (
          <View style={styles.qrContainer}>
            <QRCode value={healthID.healthId} size={250} backgroundColor="white" color="black" />
            <Text style={[styles.cardSubtitle, { marginTop: 16, textAlign: "center" }]}>
              Scan this QR code for quick access
            </Text>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Emergency Information</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Blood Group</Text>
            <Text style={styles.infoValue}>{healthID.bloodGroup} {healthID.rhFactor}</Text>
          </View>
          {healthID.hemoglobinLevel && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Hemoglobin</Text>
              <Text style={styles.infoValue}>{healthID.hemoglobinLevel} g/dL</Text>
            </View>
          )}
          {(healthID.heightCm || healthID.weightKg) && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>H / W</Text>
              <Text style={styles.infoValue}>
                {healthID.heightCm ? `${healthID.heightCm}cm` : "-"} / {healthID.weightKg ? `${healthID.weightKg}kg` : "-"}
              </Text>
            </View>
          )}
          {healthID.bloodPressure && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Blood Pressure</Text>
              <Text style={styles.infoValue}>{healthID.bloodPressure}</Text>
            </View>
          )}
          {healthID.medicalHistory && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Medical History</Text>
              <Text style={styles.infoValue}>{healthID.medicalHistory}</Text>
            </View>
          )}
          {healthID.allergies && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Allergies</Text>
              <Text style={styles.infoValue}>{healthID.allergies}</Text>
            </View>
          )}
          {healthID.chronicConditions && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Chronic Conditions</Text>
              <Text style={styles.infoValue}>{healthID.chronicConditions}</Text>
            </View>
          )}
          {healthID.currentMedications && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Medications</Text>
              <Text style={styles.infoValue}>{healthID.currentMedications}</Text>
            </View>
          )}
          {healthID.emergencyContactName && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Emergency Contact</Text>
              <Text style={styles.infoValue}>{healthID.emergencyContactName}</Text>
            </View>
          )}
          {healthID.emergencyContactPhone && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Contact Phone</Text>
              <Text style={styles.infoValue}>{healthID.emergencyContactPhone}</Text>
            </View>
          )}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Updated At</Text>
            <Text style={styles.infoValue}>
              {healthID.updatedAt ? new Date(healthID.updatedAt).toLocaleString() : "-"}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <TouchableOpacity style={[styles.button, { marginVertical: 8 }]} onPress={openEditMode}>
            <MaterialIcons name="edit" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Update Health ID</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { marginVertical: 8 }]} onPress={shareQR}>
            <MaterialIcons name="share" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Share QR Code</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              styles.secondaryButton,
              {
                marginVertical: 8,
                backgroundColor: theme.card,
                borderWidth: 1,
                borderColor: theme.border,
                shadowOpacity: 0,
                shadowRadius: 0,
                elevation: 0,
              },
            ]}
            onPress={() => setShowQR(!showQR)}
          >
            <MaterialIcons
              name={showQR ? "visibility-off" : "visibility"}
              size={20}
              color={theme.primary}
              style={{ marginRight: 8 }}
            />
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              {showQR ? "Hide QR Code" : "Show QR Code"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, styles.emergencyCard]}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            <MaterialIcons name="warning" size={24} color={theme.emergencyRed} />
            <Text style={[styles.cardTitle, { marginLeft: 12, color: theme.emergencyRed }]}>
              Emergency Access
            </Text>
          </View>
          <Text style={styles.cardSubtitle}>
            Your Health ID is protected by a PIN for emergency access. Healthcare providers can access your critical information using this PIN.
          </Text>
          <TouchableOpacity
            style={[styles.button, styles.emergencyButton, { marginTop: 16 }]}
            onPress={() => router.push("/navigation/healthscreens/EmergencyAccessScreen")}
          >
            <MaterialIcons name="emergency" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Emergency Mode</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <FontAwesome5 name="info-circle" size={20} color={theme.info} />
            <Text style={[styles.cardTitle, { marginLeft: 12, flex: 1 }]}>About Health ID</Text>
          </View>
          <Text style={[styles.cardSubtitle, { marginTop: 12, lineHeight: 22 }]}>
            Your Health ID is a unique identifier that provides quick access to your medical records. It is designed for migrant workers to maintain portable health records across locations.
          </Text>
        </View>
      </ScrollView>

      {alertModal}
    </View>
  );
}
