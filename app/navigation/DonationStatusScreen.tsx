import React, { useEffect, useState } from "react";
import { View, Alert, Text, ScrollView, ActivityIndicator } from "react-native";
import * as SecureStore from "expo-secure-store";
import { fetchDonationsByDonorId, Donation } from "../../scripts/api/donationStatusApi";
import { AuthProvider } from "../utils/auth-context";
import AppLayout from "../../components/AppLayout";
import { useAuth } from "../utils/auth-context";
import { router } from "expo-router";
import donationStatusStyles from "../../constants/styles/donationStatusStyles";

const DonationStatusScreen = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/navigation/loginScreen");
    }
  }, [isAuthenticated]);
  useEffect(() => {
    const checkDonorRole = async () => {
      setRoleLoading(true);
      try {
        const rolesString = await SecureStore.getItemAsync("roles");
        let roles: string[] = [];
        try {
          roles = rolesString ? JSON.parse(rolesString) : [];
        } catch {
          roles = [];
        }
        if (!roles.includes("DONOR")) {
          Alert.alert(
            "Not a Donor",
            "You must register as a donor before making a donation."
          );
          router.replace("/navigation/donorScreen");
          return;
        }
      } catch (error: any) {
        Alert.alert(
          "Role Error",
          error.message || "Failed to check donor role"
        );
        router.replace("/navigation/loginScreen");
        return;
      } finally {
        setRoleLoading(false);
      }
    };

    checkDonorRole();
  }, []);
  useEffect(() => {
    const fetchDonations = async () => {
      setLoading(true);
      const donorId = await SecureStore.getItemAsync("donorId");
      if (!donorId) {
        setDonations([]);
        setLoading(false);
        return;
      }
      try {
        const data = await fetchDonationsByDonorId(donorId);
        setDonations(data);
      } catch (err) {
        setDonations([]);
      }
      setLoading(false);
    };
    fetchDonations();
  }, []);

  if (loading) {
    return (
      <View style={donationStatusStyles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading donation status...</Text>
      </View>
    );
  }

  if (!donations.length) {
    return (
      <View style={donationStatusStyles.center}>
        <Text>No donation requests found.</Text>
      </View>
    );
  }

  return (
    <AuthProvider>
      <AppLayout>
        <ScrollView style={donationStatusStyles.container}>
          {donations.map((donation, idx) => (
            <View key={idx} style={donationStatusStyles.card}>
              <Text style={donationStatusStyles.type}>
                {donation.donationType}
              </Text>
              <Text style={donationStatusStyles.label}>
                Date:{" "}
                <Text style={donationStatusStyles.value}>
                  {donation.donationDate}
                </Text>
              </Text>
              <Text style={donationStatusStyles.label}>
                Status:{" "}
                <Text
                  style={[
                    donationStatusStyles.status,
                    donation.status === "PENDING"
                      ? donationStatusStyles.statusPending
                      : donation.status === "COMPLETED"
                      ? donationStatusStyles.statusCompleted
                      : donationStatusStyles.statusRejected,
                  ]}
                >
                  {donation.status}
                </Text>
              </Text>
              {donation.quantity && (
                <Text style={donationStatusStyles.label}>
                  Quantity:{" "}
                  <Text style={donationStatusStyles.value}>
                    {donation.quantity}
                  </Text>
                </Text>
              )}
              {donation.bloodType && (
                <Text style={donationStatusStyles.label}>
                  Blood Type:{" "}
                  <Text style={donationStatusStyles.value}>
                    {donation.bloodType}
                  </Text>
                </Text>
              )}
              {donation.organType && (
                <Text style={donationStatusStyles.label}>
                  Organ:{" "}
                  <Text style={donationStatusStyles.value}>
                    {donation.organType}
                  </Text>
                </Text>
              )}
              {donation.tissueType && (
                <Text style={donationStatusStyles.label}>
                  Tissue:{" "}
                  <Text style={donationStatusStyles.value}>
                    {donation.tissueType}
                  </Text>
                </Text>
              )}
              {donation.stemCellType && (
                <Text style={donationStatusStyles.label}>
                  Stem Cell:{" "}
                  <Text style={donationStatusStyles.value}>
                    {donation.stemCellType}
                  </Text>
                </Text>
              )}
            </View>
          ))}
        </ScrollView>
      </AppLayout>
    </AuthProvider>
  );
};

export default DonationStatusScreen;
