import React, { useState } from "react";
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
import AppLayout from "../../components/AppLayout";
import styles from "../../constants/styles/loginStyles";

const RecipientRequestScreen = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    requestedBloodType: "",
    requestedOrgan: "",
    urgencyLevel: "HIGH",
    quantity: "",
    requestDate: "",
    status: "PENDING",
    notes: "",
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (
      !form.requestedBloodType ||
      !form.requestedOrgan ||
      !form.quantity ||
      !form.requestDate
    ) {
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

  return (
    <AppLayout title="Create Request">
      <ScrollView contentContainerStyle={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Blood Type (e.g., A_POSITIVE)"
          value={form.requestedBloodType}
          onChangeText={(text) => handleChange("requestedBloodType", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Organ Needed (e.g., KIDNEY)"
          value={form.requestedOrgan}
          onChangeText={(text) => handleChange("requestedOrgan", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Urgency Level (e.g., HIGH)"
          value={form.urgencyLevel}
          onChangeText={(text) => handleChange("urgencyLevel", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Quantity (e.g., 1.0)"
          value={form.quantity}
          onChangeText={(text) => handleChange("quantity", text)}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Request Date (YYYY-MM-DD)"
          value={form.requestDate}
          onChangeText={(text) => handleChange("requestDate", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Notes (optional)"
          value={form.notes}
          onChangeText={(text) => handleChange("notes", text)}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}
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
