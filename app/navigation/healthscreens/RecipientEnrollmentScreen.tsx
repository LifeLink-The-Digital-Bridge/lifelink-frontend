import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../../../utils/theme-context";
import {
  createHealthStyles,
  darkTheme,
  lightTheme,
} from "../../../constants/styles/healthStyles";
import { healthApi, HealthIDDTO } from "../../api/healthApi";
import { CustomAlert } from "../../../components/common/CustomAlert";

export default function RecipientEnrollmentScreen() {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createHealthStyles(theme);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [healthID, setHealthID] = useState<HealthIDDTO | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertConfirmText, setAlertConfirmText] = useState<string | undefined>(undefined);
  const [alertCancelText, setAlertCancelText] = useState<string | undefined>(undefined);
  const [alertOnConfirm, setAlertOnConfirm] = useState<(() => void) | undefined>(undefined);

  const [consentGiven, setConsentGiven] = useState(false);
  const [diagnosis, setDiagnosis] = useState("Needs evaluation");
  const [urgency, setUrgency] = useState("MEDIUM");
  const [bloodGlucoseLevel, setBloodGlucoseLevel] = useState("100");
  const [creatinineLevel, setCreatinineLevel] = useState("1.1");
  const [liverFunctionTests, setLiverFunctionTests] = useState("Normal");
  const [cardiacStatus, setCardiacStatus] = useState("Stable");
  const [pulmonaryFunction, setPulmonaryFunction] = useState("93");
  const [overallHealthStatus, setOverallHealthStatus] = useState("Stable");

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
    const loadPrefill = async () => {
      try {
        const storedUserId = await SecureStore.getItemAsync("userId");
        if (!storedUserId) {
          showAlert("Error", "User session missing. Please login again.", {
            onConfirm: () => router.back(),
          });
          return;
        }

        const health = await healthApi.getHealthIDByUserId(storedUserId);
        if (!health) {
          showAlert("Health ID Required", "Create Health ID before recipient enrollment.", {
            onConfirm: () => router.back(),
          });
          return;
        }

        setHealthID(health);
      } catch (error: any) {
        showAlert("Error", error.message || "Failed to load enrollment form.", {
          onConfirm: () => router.back(),
        });
      } finally {
        setLoading(false);
      }
    };

    loadPrefill();
  }, []);

  const submitEnrollment = async () => {
    if (!consentGiven) {
      showAlert("Consent Required", "Please provide consent before submitting.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        consentGiven,
        diagnosis,
        urgency,
        bloodGlucoseLevel: Number(bloodGlucoseLevel),
        creatinineLevel: Number(creatinineLevel),
        liverFunctionTests,
        cardiacStatus,
        pulmonaryFunction: Number(pulmonaryFunction),
        overallHealthStatus,
        addresses: [],
        hlaProfile: null,
      };

      const response = await healthApi.enrollAsRecipient(payload);
      const recipientId = response?.id || response?.userId || "";
      showAlert(
        "Enrolled",
        recipientId ? `Recipient profile created (${recipientId}).` : "Recipient profile created.",
        {
          onConfirm: () => router.back(),
        }
      );
    } catch (error: any) {
      showAlert("Enrollment Failed", error.message || "Could not enroll as recipient.");
    } finally {
      setSubmitting(false);
    }
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
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
            <MaterialIcons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Recipient Enrollment</Text>
            <Text style={styles.headerSubtitle}>Review and confirm prefilled details</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Prefilled Health Summary</Text>
          <Text style={styles.cardSubtitle}>Health ID: {healthID?.healthId}</Text>
          <Text style={styles.cardSubtitle}>Blood Group: {healthID?.bloodGroup || "N/A"}</Text>
          <Text style={styles.cardSubtitle}>Rh Factor: {healthID?.rhFactor || "N/A"}</Text>
          <Text style={styles.cardSubtitle}>Medical History: {healthID?.medicalHistory || "N/A"}</Text>
          <Text style={styles.cardSubtitle}>Hemoglobin: {healthID?.hemoglobinLevel ?? "N/A"}</Text>
          <Text style={styles.cardSubtitle}>Blood Pressure: {healthID?.bloodPressure || "N/A"}</Text>
          <Text style={styles.cardSubtitle}>Allergies: {healthID?.allergies || "None"}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Confirm Recipient Details</Text>

          <Text style={styles.cardSubtitle}>Diagnosis</Text>
          <TextInput
            style={styles.input}
            value={diagnosis}
            onChangeText={setDiagnosis}
            placeholder="Needs evaluation"
            placeholderTextColor={theme.textSecondary}
          />

          <Text style={styles.cardSubtitle}>Urgency (LOW/MEDIUM/HIGH)</Text>
          <TextInput
            style={styles.input}
            value={urgency}
            onChangeText={setUrgency}
            placeholder="MEDIUM"
            placeholderTextColor={theme.textSecondary}
          />

          <Text style={styles.cardSubtitle}>Blood Glucose Level</Text>
          <TextInput
            style={styles.input}
            value={bloodGlucoseLevel}
            onChangeText={setBloodGlucoseLevel}
            keyboardType="numeric"
            placeholder="100"
            placeholderTextColor={theme.textSecondary}
          />

          <Text style={styles.cardSubtitle}>Creatinine Level</Text>
          <TextInput
            style={styles.input}
            value={creatinineLevel}
            onChangeText={setCreatinineLevel}
            keyboardType="numeric"
            placeholder="1.1"
            placeholderTextColor={theme.textSecondary}
          />

          <Text style={styles.cardSubtitle}>Liver Function Tests</Text>
          <TextInput
            style={styles.input}
            value={liverFunctionTests}
            onChangeText={setLiverFunctionTests}
            placeholder="Normal"
            placeholderTextColor={theme.textSecondary}
          />

          <Text style={styles.cardSubtitle}>Cardiac Status</Text>
          <TextInput
            style={styles.input}
            value={cardiacStatus}
            onChangeText={setCardiacStatus}
            placeholder="Stable"
            placeholderTextColor={theme.textSecondary}
          />

          <Text style={styles.cardSubtitle}>Pulmonary Function</Text>
          <TextInput
            style={styles.input}
            value={pulmonaryFunction}
            onChangeText={setPulmonaryFunction}
            keyboardType="numeric"
            placeholder="93"
            placeholderTextColor={theme.textSecondary}
          />

          <Text style={styles.cardSubtitle}>Overall Health Status</Text>
          <TextInput
            style={styles.input}
            value={overallHealthStatus}
            onChangeText={setOverallHealthStatus}
            placeholder="Stable"
            placeholderTextColor={theme.textSecondary}
          />

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <Text style={[styles.cardSubtitle, { marginBottom: 0, flex: 1 }]}>I provide explicit consent for recipient enrollment</Text>
            <Switch value={consentGiven} onValueChange={setConsentGiven} />
          </View>

          <TouchableOpacity
            style={[styles.button, submitting && { opacity: 0.7 }]}
            onPress={submitEnrollment}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Submit Recipient Enrollment</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
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
