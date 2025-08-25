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
} from "react-native";
import styles from "../../../constants/styles/dashboardStyles";
import { fetchDonorData } from "../../api/donorApi";

export default function DonateHubScreen() {
  const [loading, setLoading] = useState(true);
  const [donorData, setDonorData] = useState<any>(null);
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const loadDonorData = useCallback(async () => {
    setLoading(true);
    setRefreshing(true);
    try {
      const donorData = await fetchDonorData();
      if (donorData) {
        setDonorData(donorData);
        await SecureStore.setItemAsync("donorData", JSON.stringify(donorData));
      } else {
        await SecureStore.deleteItemAsync("donorData");
      }
    } catch (error) {
      console.error("Failed to fetch donor data:", error);
    }
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      const data = await SecureStore.getItemAsync("donorData");
      if (data) {
        setDonorData(JSON.parse(data));
        setLoading(false);
        return;
      }
      await loadDonorData();
    };
    loadInitialData();
  }, [loadDonorData]);

  if (loading) {
    return <ActivityIndicator />;
  }

  if (!donorData) {
    return (
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadDonorData}
          />
        }
      >
        <Text style={{ fontSize: 18, marginBottom: 16 }}>
          You are not registered as a donor.
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#0984e3" }]}
          onPress={() => router.replace("/navigation/donorScreen")}
        >
          <Text style={styles.buttonText}>Register as Donor</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ padding: 16 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={loadDonorData}
        />
      }
    >
      <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 8 }}>
        Your Donor Details
      </Text>
      <View style={[styles.card, { marginBottom: 16 }]}>
        <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
          Registration Date:{" "}
          <Text style={{ fontWeight: "normal" }}>
            {donorData.registrationDate || "N/A"}
          </Text>
        </Text>
        <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
          Status:{" "}
          <Text style={{ fontWeight: "normal" }}>
            {donorData.status || "N/A"}
          </Text>
        </Text>
        {donorData.location && (
          <>
            <Text
              style={{ fontWeight: "bold", marginTop: 12, marginBottom: 4 }}
            >
              Location Details:
            </Text>
            <Text>
              Address:{" "}
              {donorData.location.addressLine ||
                donorData.location.landmark ||
                donorData.location.area ||
                "N/A"}
            </Text>
            {donorData.location.addressLine && (
              <Text>Address Line: {donorData.location.addressLine}</Text>
            )}
            {donorData.location.landmark && (
              <Text>Landmark: {donorData.location.landmark}</Text>
            )}
            {donorData.location.area && (
              <Text>Area: {donorData.location.area}</Text>
            )}
            {donorData.location.district && (
              <Text>District: {donorData.location.district}</Text>
            )}
            <Text>
              City: {donorData.location.city || "N/A"}, State:{" "}
              {donorData.location.state || "N/A"}, Country:{" "}
              {donorData.location.country || "N/A"}
            </Text>
            <Text>Pincode: {donorData.location.pincode || "N/A"}</Text>
            {donorData.location.latitude && donorData.location.longitude && (
              <Text>
                Coordinates: {donorData.location.latitude.toFixed(4)},{" "}
                {donorData.location.longitude.toFixed(4)}
              </Text>
            )}
          </>
        )}
        {donorData.medicalDetails && (
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
              Hemoglobin: {donorData.medicalDetails.hemoglobinLevel || "N/A"}
            </Text>
            <Text>
              Blood Pressure: {donorData.medicalDetails.bloodPressure || "N/A"}
            </Text>
            <Text>
              Has Diseases:{" "}
              {donorData.medicalDetails.hasDiseases ? "Yes" : "No"}
            </Text>
            <Text>
              Taking Medication:{" "}
              {donorData.medicalDetails.takingMedication ? "Yes" : "No"}
            </Text>
          </>
        )}
        {donorData.eligibilityCriteria && (
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
            <Text>Age: {donorData.eligibilityCriteria.age || "N/A"}</Text>
            <Text>
              Weight: {donorData.eligibilityCriteria.weight || "N/A"} kg
            </Text>
            <Text>
              Medical Clearance:{" "}
              {donorData.eligibilityCriteria.medicalClearance ? "Yes" : "No"}
            </Text>
            <Text>
              Recent Tattoo/Piercing:{" "}
              {donorData.eligibilityCriteria.recentTattooOrPiercing
                ? "Yes"
                : "No"}
            </Text>
            <Text>
              Recent Travel:{" "}
              {donorData.eligibilityCriteria.recentTravelDetails || "N/A"}
            </Text>
            <Text>
              Last Donation:{" "}
              {donorData.eligibilityCriteria.lastDonationDate || "N/A"}
            </Text>
          </>
        )}
        {donorData.consentForm && (
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
              Consented: {donorData.consentForm.isConsented ? "Yes" : "No"}
            </Text>
            <Text>
              Consented At: {donorData.consentForm.consentedAt || "N/A"}
            </Text>
          </>
        )}
      </View>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#00b894" }]}
        onPress={() => router.push("/navigation/donorScreen")}
      >
        <Text style={styles.buttonText}>Update Donor Details</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#0984e3", marginTop: 12 }]}
        onPress={() => router.push("/navigation/donateScreen")}
      >
        <Text style={styles.buttonText}>Continue to Donate</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
