import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { createReceiveRequest } from "../../scripts/api/recipientApi";
import * as SecureStore from "expo-secure-store";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "../utils/auth-context";
import AppLayout from "../../components/AppLayout";
import styles from "../../constants/styles/dashboardStyles";

const BLOOD_TYPES = [
  "A_POSITIVE",
  "A_NEGATIVE",
  "B_POSITIVE",
  "B_NEGATIVE",
  "O_POSITIVE",
  "O_NEGATIVE",
  "AB_POSITIVE",
  "AB_NEGATIVE",
];
const ORGAN_TYPES = [
  "HEART",
  "LIVER",
  "KIDNEY",
  "LUNG",
  "PANCREAS",
  "INTESTINE",
];

const RecipientRequestScreen = () => {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [roleLoading, setRoleLoading] = useState(true);
  const [recipientId, setRecipientId] = useState("");
  const [form, setForm] = useState({
    requestedBloodType: "",
    requestedOrgan: "",
    urgencyLevel: "HIGH",
    quantity: "",
    requestDate: "",
    status: "PENDING",
    notes: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("../(auth)/loginScreen");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const checkRecipientRole = async () => {
      setRoleLoading(true);
      try {
        const rolesString = await SecureStore.getItemAsync("roles");
        let roles: string[] = [];
        try {
          roles = rolesString ? JSON.parse(rolesString) : [];
        } catch {
          roles = [];
        }

        if (!roles.includes("RECIPIENT")) {
          Alert.alert(
            "Not a Recipient",
            "You must register as a recipient before making a request."
          );
          router.replace("/navigation/RecipientScreen");
          return;
        }
        const id = await SecureStore.getItemAsync("recipientId");
        if (id) setRecipientId(id);
      } catch (error: any) {
        Alert.alert(
          "Role Error",
          error.message || "Failed to check recipient role"
        );
        router.replace("../(auth)/loginScreen");
        return;
      } finally {
        setRoleLoading(false);
      }
    };
    checkRecipientRole();
  }, []);

  useEffect(() => {
    const today = new Date();
    setForm((prev) => ({
      ...prev,
      requestDate: today.toISOString().slice(0, 10),
    }));
  }, []);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const isFormValid = () => {
    return (
      !!form.requestedBloodType &&
      !!form.requestedOrgan &&
      !!form.quantity &&
      !!form.requestDate
    );
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      Alert.alert("Validation Error", "Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      await createReceiveRequest({
        requestedBloodType: form.requestedBloodType,
        requestedOrgan: form.requestedOrgan,
        urgencyLevel: form.urgencyLevel,
        quantity: parseFloat(form.quantity),
        requestDate: form.requestDate,
        status: form.status,
        notes: form.notes,
      });
      Alert.alert("Success", "Request created successfully!");
      router.back();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to create request");
    } finally {
      setLoading(false);
    }
  };

  if (roleLoading) {
    return (
      <AppLayout title="Create Request">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0984e3" />
          <Text>Loading...</Text>
        </View>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Create Request">
      <ScrollView
        style={styles.bg}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionTitle}>Create a Request</Text>

        <Text style={styles.label}>Blood Type</Text>
        <View style={styles.input}>
          <Picker
            selectedValue={form.requestedBloodType}
            onValueChange={(value) => handleChange("requestedBloodType", value)}
          >
            <Picker.Item label="Select Blood Type" value="" />
            {BLOOD_TYPES.map((bt) => (
              <Picker.Item
                label={bt
                  .replace("_POSITIVE", "+")
                  .replace("_NEGATIVE", "-")
                  .replace("_", " ")}
                value={bt}
                key={bt}
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Organ Needed</Text>
        <View style={styles.input}>
          <Picker
            selectedValue={form.requestedOrgan}
            onValueChange={(value) => handleChange("requestedOrgan", value)}
          >
            <Picker.Item label="Select Organ" value="" />
            {ORGAN_TYPES.map((ot) => (
              <Picker.Item
                label={ot.charAt(0) + ot.slice(1).toLowerCase()}
                value={ot}
                key={ot}
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Urgency Level</Text>
        <View style={styles.input}>
          <Picker
            selectedValue={form.urgencyLevel}
            onValueChange={(value) => handleChange("urgencyLevel", value)}
          >
            <Picker.Item label="High" value="HIGH" />
            <Picker.Item label="Medium" value="MEDIUM" />
            <Picker.Item label="Low" value="LOW" />
          </Picker>
        </View>

        <Text style={styles.label}>Quantity</Text>
        <TextInput
          style={styles.input}
          placeholder="Quantity (e.g., 1.0)"
          keyboardType="numeric"
          value={form.quantity}
          onChangeText={(text) => handleChange("quantity", text)}
        />

        <Text style={styles.label}>Request Date</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={form.requestDate}
          onChangeText={(text) => handleChange("requestDate", text)}
        />

        <Text style={styles.label}>Status</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: "#f1f2f6", color: "#636e72" },
          ]}
          value={form.status}
          editable={false}
        />

        <Text style={styles.label}>Notes (optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Notes"
          value={form.notes}
          onChangeText={(text) => handleChange("notes", text)}
        />

        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor:
                isFormValid() && !loading ? "#0984e3" : "#b2bec3",
            },
          ]}
          onPress={handleSubmit}
          disabled={!isFormValid() || loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Submit Request</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </AppLayout>
  );
};

export default RecipientRequestScreen;
