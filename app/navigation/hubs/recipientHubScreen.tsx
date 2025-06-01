import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import AppLayout from "../../../components/AppLayout";
import styles from "../../../constants/styles/profileStyles";
import * as SecureStore from "expo-secure-store";
import { useAuth } from "../../utils/auth-context";
import {
  addRecipientRole,
  refreshAuthTokens,
} from "../../../scripts/api/roleApi";
import { getRecipientByUserId } from "../../../scripts/api/recipientApi";

const RecipientHubScreen = () => {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(true);
  const [recipient, setRecipient] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("../(auth)/loginScreen");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const loadRecipientData = async () => {
      try {
        const data = await getRecipientByUserId();
        setRecipient(data);
      } catch (error) {
        Alert.alert("Error", "Failed to load recipient data");
      } finally {
        setLoading(false);
      }
    };
    if (!roleLoading) loadRecipientData();
  }, [roleLoading]);

  if (loading || roleLoading) {
    return (
      <AppLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0984e3" />
          <Text style={styles.errorText}>Loading recipient...</Text>
        </View>
      </AppLayout>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: "#00b894" }]}
        onPress={() => router.push("/navigation/RecipientProfileScreen")}
      >
        <Feather name="user" size={20} color="#fff" />
        <Text style={styles.actionButtonText}>Recipient Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: "#0984e3" }]}
        onPress={() => router.push("/navigation/RecipientRequestScreen")}
      >
        <Feather name="plus-circle" size={20} color="#fff" />
        <Text style={styles.actionButtonText}>Create Request</Text>
      </TouchableOpacity>
      {recipient && (
        <View style={styles.contentItem}>
          <Text style={styles.contentItemTitle}>
            Status: {recipient.availability}
          </Text>
          <Text style={styles.contentItemText}>
            Organ Needed: {recipient.location ? "Registered" : "Not Registered"}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default RecipientHubScreen;
