import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Switch,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import * as DocumentPicker from "expo-document-picker";
import { useTheme } from "../../../utils/theme-context";
import {
  lightTheme,
  darkTheme,
  createHealthStyles,
} from "../../../constants/styles/healthStyles";
import { healthApi } from "../../api/healthApi";
import { useRole } from "../../../utils/role-context";
import { CustomAlert } from "../../../components/common/CustomAlert";

const RECORD_TYPES = [
  "CONSULTATION",
  "PRESCRIPTION",
  "LAB_TEST",
  "DIAGNOSIS",
  "VACCINATION",
  "CHECKUP",
  "EMERGENCY",
  "SURGERY",
  "ADMISSION",
  "DISCHARGE",
  "OTHER",
] as const;

export default function AddHealthRecordScreen() {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createHealthStyles(theme);
  const params = useLocalSearchParams<{ userId?: string; healthId?: string; recordId?: string }>();
  const { isDoctor } = useRole();

  const [submitting, setSubmitting] = useState(false);
  const [loadingRecord, setLoadingRecord] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [selectedDocumentName, setSelectedDocumentName] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertConfirmText, setAlertConfirmText] = useState<string | undefined>(undefined);
  const [alertCancelText, setAlertCancelText] = useState<string | undefined>(undefined);
  const [alertOnConfirm, setAlertOnConfirm] = useState<(() => void) | undefined>(undefined);
  const [form, setForm] = useState({
    recordType: "CONSULTATION",
    title: "",
    description: "",
    diagnosis: "",
    prescription: "",
    testResults: "",
    doctorName: "",
    hospitalName: "",
    hospitalLocation: "",
    recordDate: new Date().toISOString().slice(0, 10),
    notes: "",
    isEmergency: false,
    documentUrl: "",
  });

  const targetUserId = useMemo(() => (params.userId ? String(params.userId) : ""), [params.userId]);
  const targetHealthId = useMemo(() => (params.healthId ? String(params.healthId) : ""), [params.healthId]);
  const targetRecordId = useMemo(() => (params.recordId ? String(params.recordId) : ""), [params.recordId]);

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
    if (targetRecordId) {
      loadRecordForEdit();
    }
  }, [targetRecordId]);

  const loadRecordForEdit = async () => {
    try {
      setLoadingRecord(true);
      const record = await healthApi.getHealthRecordById(targetRecordId);
      setForm({
        recordType: record.recordType,
        title: record.title || "",
        description: record.description || "",
        diagnosis: record.diagnosis || "",
        prescription: record.prescription || "",
        testResults: record.testResults || "",
        doctorName: record.doctorName || "",
        hospitalName: record.hospitalName || "",
        hospitalLocation: record.hospitalLocation || "",
        recordDate: record.recordDate ? String(record.recordDate).slice(0, 10) : new Date().toISOString().slice(0, 10),
        notes: record.notes || "",
        isEmergency: !!record.isEmergency,
        documentUrl: record.documentUrl || "",
      });
      setSelectedDocumentName(record.documentUrl ? "Existing document attached" : "");
    } catch (error: any) {
      showAlert("Failed", error?.message || "Unable to load record for editing");
      router.back();
    } finally {
      setLoadingRecord(false);
    }
  };

  const handleUploadDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/jpeg", "image/png"],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled || !result.assets.length) {
        return;
      }

      const asset = result.assets[0];
      setUploadingDocument(true);
      const uploadResponse = await healthApi.uploadHealthRecordDocument({
        uri: asset.uri,
        name: asset.name || `health-doc-${Date.now()}`,
        type: asset.mimeType || "application/octet-stream",
      });

      setForm((prev) => ({ ...prev, documentUrl: uploadResponse.documentUrl }));
      setSelectedDocumentName(asset.name || uploadResponse.fileName);
      showAlert("Uploaded", "Document uploaded and attached successfully.");
    } catch (error: any) {
      showAlert("Upload Failed", error?.message || "Unable to upload document");
    } finally {
      setUploadingDocument(false);
    }
  };

  const onSubmit = async () => {
    if (!isDoctor) {
      showAlert("Access Denied", "Only doctors can create or update health records.");
      return;
    }

    if (!form.title.trim()) {
      showAlert("Required", "Title is required.");
      return;
    }

    if (!form.recordDate.trim()) {
      showAlert("Required", "Record date is required (YYYY-MM-DD).");
      return;
    }

    if (form.recordType === "CONSULTATION") {
      if (!form.description.trim()) {
        showAlert("Required", "Consultation description is required.");
        return;
      }
      if (!form.diagnosis.trim()) {
        showAlert("Required", "Consultation diagnosis is required.");
        return;
      }
    }

    if (form.recordType === "PRESCRIPTION" && !form.prescription.trim()) {
      showAlert("Required", "Prescription details are required.");
      return;
    }

    if (form.recordType === "LAB_TEST" && !form.testResults.trim()) {
      showAlert("Required", "Lab test results are required.");
      return;
    }

    try {
      setSubmitting(true);
      const currentDoctorId = await SecureStore.getItemAsync("userId");
      if (!currentDoctorId) {
        showAlert("Error", "User not found. Please login again.");
        return;
      }

      const patientUserId = targetUserId || currentDoctorId;
      const payload = {
        userId: patientUserId,
        healthId: targetHealthId || undefined,
        recordType: form.recordType,
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        diagnosis: form.diagnosis.trim() || undefined,
        prescription: form.prescription.trim() || undefined,
        testResults: form.testResults.trim() || undefined,
        doctorName: form.doctorName.trim() || undefined,
        doctorId: currentDoctorId,
        hospitalName: form.hospitalName.trim() || undefined,
        hospitalLocation: form.hospitalLocation.trim() || undefined,
        recordDate: form.recordDate,
        notes: form.notes.trim() || undefined,
        isEmergency: form.isEmergency,
        documentUrl: form.documentUrl.trim() || undefined,
      };

      if (targetRecordId) {
        await healthApi.updateHealthRecord(targetRecordId, payload);
      } else {
        await healthApi.createHealthRecord(payload);
      }

      showAlert(
        "Success",
        targetRecordId ? "Health record updated successfully." : "Health record created successfully.",
        {
          onConfirm: () => {
            router.replace({
              pathname: "/navigation/healthscreens/HealthRecordsScreen",
              params: {
                ...(targetUserId ? { userId: targetUserId } : {}),
                ...(targetHealthId ? { healthId: targetHealthId } : {}),
              },
            });
          },
        }
      );
    } catch (error: any) {
      showAlert("Failed", error?.message || "Failed to create health record");
    } finally {
      setSubmitting(false);
    }
  };

  const isConsultation = form.recordType === "CONSULTATION";
  const isPrescription = form.recordType === "PRESCRIPTION";
  const isLabTest = form.recordType === "LAB_TEST";
  const labelStyle = { color: theme.text, marginTop: 10, marginBottom: 6, fontWeight: "600" as const };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
          <MaterialIcons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{targetRecordId ? "Update Health Record" : "Add Health Record"}</Text>
          <Text style={styles.headerSubtitle}>{targetRecordId ? "Edit medical entry" : "Create a new medical entry"}</Text>
        </View>
      </View>

      {!isDoctor ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 24 }}>
          <MaterialIcons name="lock" size={48} color={theme.textSecondary} />
          <Text style={[styles.cardTitle, { marginTop: 12, textAlign: "center" }]}>Doctor Access Required</Text>
          <Text style={[styles.cardSubtitle, { textAlign: "center", marginTop: 8 }]}>
            Only doctors can create or update health records.
          </Text>
          <TouchableOpacity style={[styles.button, { marginTop: 20 }]} onPress={() => router.back()}>
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      ) : (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Record Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
            {RECORD_TYPES.map((type) => {
              const selected = form.recordType === type;
              return (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.badge,
                    {
                      marginRight: 8,
                      backgroundColor: selected ? theme.primary : theme.border + "40",
                    },
                  ]}
                  onPress={() => setForm((p) => ({ ...p, recordType: type }))}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      { color: selected ? "#fff" : theme.text, fontSize: 11 },
                    ]}
                  >
                    {type.replace("_", " ")}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <Text style={labelStyle}>Title</Text>
          <TextInput
            style={[styles.input, { marginTop: 14 }]}
            placeholder="Title *"
            placeholderTextColor={theme.textSecondary}
            value={form.title}
            onChangeText={(v) => setForm((p) => ({ ...p, title: v }))}
          />

          <Text style={labelStyle}>Record Date</Text>
          <TextInput
            style={styles.input}
            placeholder="Record Date (YYYY-MM-DD) *"
            placeholderTextColor={theme.textSecondary}
            value={form.recordDate}
            onChangeText={(v) => setForm((p) => ({ ...p, recordDate: v }))}
          />

          <Text style={labelStyle}>{isConsultation ? "Clinical Description" : "Description"}</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            placeholder={isConsultation ? "Clinical Description *" : "Description"}
            placeholderTextColor={theme.textSecondary}
            value={form.description}
            onChangeText={(v) => setForm((p) => ({ ...p, description: v }))}
          />

          {(isConsultation || isPrescription) && (
            <>
            <Text style={labelStyle}>Diagnosis</Text>
            <TextInput
              style={styles.input}
              placeholder={isConsultation ? "Diagnosis *" : "Diagnosis"}
              placeholderTextColor={theme.textSecondary}
              value={form.diagnosis}
              onChangeText={(v) => setForm((p) => ({ ...p, diagnosis: v }))}
            />
            </>
          )}

          {isPrescription && (
            <>
            <Text style={labelStyle}>Prescription Details</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              multiline
              placeholder="Prescription Details *"
              placeholderTextColor={theme.textSecondary}
              value={form.prescription}
              onChangeText={(v) => setForm((p) => ({ ...p, prescription: v }))}
            />
            </>
          )}

          {isLabTest && (
            <>
            <Text style={labelStyle}>Lab Test Results</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              multiline
              placeholder="Lab Test Results *"
              placeholderTextColor={theme.textSecondary}
              value={form.testResults}
              onChangeText={(v) => setForm((p) => ({ ...p, testResults: v }))}
            />
            </>
          )}

          {!isConsultation && !isPrescription && !isLabTest && (
            <>
              <Text style={labelStyle}>Diagnosis</Text>
              <TextInput
                style={styles.input}
                placeholder="Diagnosis"
                placeholderTextColor={theme.textSecondary}
                value={form.diagnosis}
                onChangeText={(v) => setForm((p) => ({ ...p, diagnosis: v }))}
              />
              <Text style={labelStyle}>Prescription</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                multiline
                placeholder="Prescription"
                placeholderTextColor={theme.textSecondary}
                value={form.prescription}
                onChangeText={(v) => setForm((p) => ({ ...p, prescription: v }))}
              />
              <Text style={labelStyle}>Test Results</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                multiline
                placeholder="Test Results"
                placeholderTextColor={theme.textSecondary}
                value={form.testResults}
                onChangeText={(v) => setForm((p) => ({ ...p, testResults: v }))}
              />
            </>
          )}

          <Text style={labelStyle}>Doctor Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Doctor Name"
            placeholderTextColor={theme.textSecondary}
            value={form.doctorName}
            onChangeText={(v) => setForm((p) => ({ ...p, doctorName: v }))}
          />

          <Text style={labelStyle}>Hospital Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Hospital Name"
            placeholderTextColor={theme.textSecondary}
            value={form.hospitalName}
            onChangeText={(v) => setForm((p) => ({ ...p, hospitalName: v }))}
          />

          <Text style={labelStyle}>Hospital Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Hospital Location"
            placeholderTextColor={theme.textSecondary}
            value={form.hospitalLocation}
            onChangeText={(v) => setForm((p) => ({ ...p, hospitalLocation: v }))}
          />

          <Text style={labelStyle}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            placeholder="Notes"
            placeholderTextColor={theme.textSecondary}
            value={form.notes}
            onChangeText={(v) => setForm((p) => ({ ...p, notes: v }))}
          />

          <View style={{ marginTop: 8, marginBottom: 8 }}>
            <Text style={[styles.infoLabel, { marginBottom: 8 }]}>Document (PDF/JPG/PNG)</Text>
            <TouchableOpacity
              style={[styles.button, uploadingDocument && { opacity: 0.7 }]}
              disabled={uploadingDocument}
              onPress={handleUploadDocument}
            >
              {uploadingDocument ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Upload Document</Text>
              )}
            </TouchableOpacity>
            {!!selectedDocumentName && (
              <Text style={[styles.timelineDescription, { marginTop: 8 }]}>
                Attached: {selectedDocumentName}
              </Text>
            )}
            {!selectedDocumentName && !!form.documentUrl && (
              <Text style={[styles.timelineDescription, { marginTop: 8 }]}>
                Attached document URL is available
              </Text>
            )}
          </View>

          <View
            style={{
              marginTop: 4,
              marginBottom: 8,
              paddingVertical: 10,
              paddingHorizontal: 12,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: theme.border,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={{ color: theme.text, fontWeight: "600" }}>Emergency Case</Text>
              <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 2 }}>
                Mark this record for emergency visibility.
              </Text>
            </View>
            <Switch
              value={form.isEmergency}
              onValueChange={(value) => setForm((p) => ({ ...p, isEmergency: value }))}
              trackColor={{ false: theme.border, true: theme.error + "80" }}
              thumbColor={form.isEmergency ? theme.error : "#f4f3f4"}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, { marginTop: 10 }, (submitting || loadingRecord) && { opacity: 0.7 }]}
            disabled={submitting || loadingRecord}
            onPress={onSubmit}
          >
            {submitting || loadingRecord ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{targetRecordId ? "Update Health Record" : "Save Health Record"}</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
      )}

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
