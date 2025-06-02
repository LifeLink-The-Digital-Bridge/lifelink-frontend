import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import styles from "../../../constants/styles/dashboardStyles";
import { getRecipientByUserId } from "../../../scripts/api/recipientApi";
import { useAuth } from "../../utils/auth-context";

const RecipientHubScreen = () => {
  const [loading, setLoading] = useState(true);
  const [recipient, setRecipient] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("../(auth)/loginScreen");
    }
  }, [isAuthenticated]);

  const loadRecipientData = useCallback(async () => {
    setLoading(true);
    setRefreshing(true);
    try {
      const recipientData = await getRecipientByUserId();
      if (recipientData) {
        setRecipient(recipientData);
        await SecureStore.setItemAsync("recipientData", JSON.stringify(recipientData));
      } else {
        await SecureStore.deleteItemAsync("recipientData");
      }
    } catch (error) {
      console.error("Failed to fetch recipient data:", error);
    }
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      const data = await SecureStore.getItemAsync("recipientData");
      if (data) {
        setRecipient(JSON.parse(data));
        setLoading(false);
        return;
      }
      await loadRecipientData();
    };
    loadInitialData();
  }, [loadRecipientData]);

  if (loading) {
    return <ActivityIndicator />;
  }

  if (!recipient) {
    return (
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadRecipientData} />
        }
      >
        <Text style={{ fontSize: 18, marginBottom: 16 }}>
          You are not registered as a recipient.
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#0984e3" }]}
          onPress={() => router.push("/navigation/RecipientScreen")}
        >
          <Text style={styles.buttonText}>Register as Recipient</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ padding: 16 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={loadRecipientData} />
      }
    >
      <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 8 }}>
        Your Recipient Details
      </Text>
      <View style={[styles.card, { marginBottom: 16 }]}>
        <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
          Status:{" "}
          <Text style={{ fontWeight: "normal" }}>
            {recipient.availability || "N/A"}
          </Text>
        </Text>
        {recipient.location && (
          <>
            <Text style={{ fontWeight: "bold", marginTop: 12, marginBottom: 4 }}>
              Location Details:
            </Text>
            <Text>
              Address:{" "}
              {recipient.location.addressLine ||
                recipient.location.landmark ||
                recipient.location.area ||
                "N/A"}
            </Text>
            {recipient.location.addressLine && (
              <Text>Address Line: {recipient.location.addressLine}</Text>
            )}
            {recipient.location.landmark && (
              <Text>Landmark: {recipient.location.landmark}</Text>
            )}
            {recipient.location.area && (
              <Text>Area: {recipient.location.area}</Text>
            )}
            {recipient.location.district && (
              <Text>District: {recipient.location.district}</Text>
            )}
            <Text>
              City: {recipient.location.city || "N/A"}, State:{" "}
              {recipient.location.state || "N/A"}, Country:{" "}
              {recipient.location.country || "N/A"}
            </Text>
            <Text>Pincode: {recipient.location.pincode || "N/A"}</Text>
            {recipient.location.latitude && recipient.location.longitude && (
              <Text>
                Coordinates: {recipient.location.latitude.toFixed(4)},{" "}
                {recipient.location.longitude.toFixed(4)}
              </Text>
            )}
          </>
        )}
        {recipient.medicalDetails && (
          <>
            <Text
              style={{
                fontWeight: "bold",
                marginTop: 12,
                marginBottom: 4,
              }}
            >
              Medical Details:
            </Text>
            <Text>
              Diagnosis: {recipient.medicalDetails.diagnosis || "N/A"}
            </Text>
            <Text>
              Allergies: {recipient.medicalDetails.allergies || "None"}
            </Text>
            <Text>
              Medications: {recipient.medicalDetails.currentMedications || "N/A"}
            </Text>
            <Text>
              Notes: {recipient.medicalDetails.additionalNotes || "N/A"}
            </Text>
          </>
        )}
        {recipient.eligibilityCriteria && (
          <>
            <Text
              style={{
                fontWeight: "bold",
                marginTop: 12,
                marginBottom: 4,
              }}
            >
              Eligibility:
            </Text>
            <Text>
              Medically Eligible:{" "}
              {recipient.eligibilityCriteria.medicallyEligible ? "Yes" : "No"}
            </Text>
            <Text>
              Legal Clearance:{" "}
              {recipient.eligibilityCriteria.legalClearance ? "Yes" : "No"}
            </Text>
            <Text>
              Notes: {recipient.eligibilityCriteria.notes || "N/A"}
            </Text>
            <Text>
              Last Reviewed: {recipient.eligibilityCriteria.lastReviewed || "N/A"}
            </Text>
          </>
        )}
        {recipient.consentForm && (
          <>
            <Text
              style={{
                fontWeight: "bold",
                marginTop: 12,
                marginBottom: 4,
              }}
            >
              Consent:
            </Text>
            <Text>
              Consented: {recipient.consentForm.isConsented ? "Yes" : "No"}
            </Text>
            <Text>
              Consented At: {recipient.consentForm.consentedAt || "N/A"}
            </Text>
          </>
        )}
      </View>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#00b894" }]}
        onPress={() => router.push("/navigation/RecipientScreen")}
      >
        <Text style={styles.buttonText}>Update Recipient Details</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#0984e3", marginTop: 12 }]}
        onPress={() => router.push("/navigation/RecipientScreen")}
      >
        <Text style={styles.buttonText}>Create New Request</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default RecipientHubScreen;
