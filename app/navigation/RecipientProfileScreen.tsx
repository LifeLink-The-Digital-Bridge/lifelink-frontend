import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, ScrollView, Alert } from "react-native";
import { getRecipientByUserId } from "../../scripts/api/recipientApi";
import styles from "../../constants/styles/profileStyles";
import AppLayout from "../../components/AppLayout";

const RecipientProfileScreen = () => {
  const [loading, setLoading] = useState(true);
  const [recipient, setRecipient] = useState<any>(null);

  useEffect(() => {
    const loadRecipient = async () => {
      try {
        const data = await getRecipientByUserId();
        setRecipient(data);
      } catch (error) {
        Alert.alert("Error", "Failed to load recipient profile");
      } finally {
        setLoading(false);
      }
    };
    loadRecipient();
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0984e3" />
          <Text style={styles.errorText}>Loading profile...</Text>
        </View>
      </AppLayout>
    );
  }

  if (!recipient) {
    return (
      <AppLayout>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Recipient profile not found.</Text>
        </View>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Recipient Profile">
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.contentItem}>
          <Text style={styles.contentItemTitle}>
            Status: {recipient.availability}
          </Text>
          <Text style={styles.contentItemText}>
            Organ Needed: {recipient.organNeeded || "Not specified"}
          </Text>
          <Text style={styles.contentItemText}>
            Location: {recipient.location?.addressLine},{" "}
            {recipient.location?.city}
          </Text>
        </View>
        <View style={styles.contentItem}>
          <Text style={styles.contentItemTitle}>Medical Details</Text>
          <Text style={styles.contentItemText}>
            Diagnosis: {recipient.medicalDetails?.diagnosis}
          </Text>
          <Text style={styles.contentItemText}>
            Allergies: {recipient.medicalDetails?.allergies || "None"}
          </Text>
        </View>
      </ScrollView>
    </AppLayout>
  );
};

export default RecipientProfileScreen;
