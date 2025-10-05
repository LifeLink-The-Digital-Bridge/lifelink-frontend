import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Animated,
} from "react-native";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useAuth } from "../../utils/auth-context";
import { useTheme } from "../../utils/theme-context";
import { lightTheme, darkTheme } from "../../constants/styles/authStyles";
import { createUnifiedStyles } from "../../constants/styles/unifiedStyles";
import {
  createReceiveRequest,
  RequestType,
  BloodType,
  OrganType,
  TissueType,
  StemCellType,
  UrgencyLevel,
} from "../api/recipientApi";
import AppLayout from "../../components/AppLayout";
import { ValidationAlert } from "../../components/common/ValidationAlert";
import { RequestTypeSelector } from "../../components/request/RequestTypeSelector";
import { RequestDetailsForm } from "../../components/request/RequestDetailsForm";
import { LocationSelector } from "@/components/request/LocationSelector";
import { StatusHeader } from "@/components/common/StatusHeader";

const HEADER_HEIGHT = 120;

const RecipientRequestScreen = () => {
  const { colorScheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const isDark = colorScheme === "dark";
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  const lastScrollY = useRef(0);
  const headerTranslateY = useRef(new Animated.Value(0)).current;

  const [loading, setLoading] = useState(false);
  const [roleLoading, setRoleLoading] = useState(true);
  const [recipientId, setRecipientId] = useState("");
  const [locationId, setLocationId] = useState("");

  const [requestType, setRequestType] = useState<RequestType>("BLOOD");
  const [requestedBloodType, setRequestedBloodType] = useState<BloodType | "">(
    ""
  );
  const [requestedOrgan, setRequestedOrgan] = useState<OrganType | "">("");
  const [requestedTissue, setRequestedTissue] = useState<TissueType | "">("");
  const [requestedStemCellType, setRequestedStemCellType] = useState<
    StemCellType | ""
  >("");
  const [urgencyLevel, setUrgencyLevel] = useState<UrgencyLevel>("HIGH");
  const [quantity, setQuantity] = useState("");
  const [requestDate, setRequestDate] = useState("");
  const [notes, setNotes] = useState("");

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<
    "success" | "error" | "warning" | "info"
  >("info");

  const showAlert = (
    title: string,
    message: string,
    type: "success" | "error" | "warning" | "info" = "info"
  ) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
  };

  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const diff = currentScrollY - lastScrollY.current;

    if (diff > 0 && currentScrollY > 50) {
      Animated.timing(headerTranslateY, {
        toValue: -HEADER_HEIGHT,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else if (diff < 0 || currentScrollY <= 0) {
      Animated.timing(headerTranslateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }

    lastScrollY.current = currentScrollY;
  };

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
          showAlert(
            "Not a Recipient",
            "You must register as a recipient before making a request.",
            "warning"
          );
          router.replace("/navigation/RecipientScreen");
          return;
        }

        const id = await SecureStore.getItemAsync("recipientId");
        if (id) setRecipientId(id);

        const recipientDataStr = await SecureStore.getItemAsync(
          "recipientData"
        );
        if (recipientDataStr) {
          try {
            const recipientData = JSON.parse(recipientDataStr);
            if (recipientData?.addresses?.[0]?.id) {
              setLocationId(recipientData.addresses[0].id);
            }
          } catch (e) {
            console.error("Error parsing recipient data:", e);
          }
        }
      } catch (error: any) {
        showAlert(
          "Role Error",
          error.message || "Failed to check recipient role",
          "error"
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
    setRequestDate(today.toISOString().slice(0, 10));
  }, []);

  const isFormValid = () => {
    if (!recipientId || !locationId || !quantity || !requestDate) return false;

    switch (requestType) {
      case "BLOOD":
        return !!requestedBloodType;
      case "ORGAN":
        return !!requestedOrgan;
      case "TISSUE":
        return !!requestedTissue;
      case "STEM_CELL":
        return !!requestedStemCellType;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      showAlert(
        "Validation Error",
        "Please fill in all required fields.",
        "warning"
      );
      return;
    }

    setLoading(true);
    try {
      const payload: any = {
        recipientId,
        locationId,
        requestType,
        urgencyLevel,
        quantity: parseFloat(quantity),
        requestDate,
        notes: notes || undefined,
      };

      switch (requestType) {
        case "BLOOD":
          payload.requestedBloodType = requestedBloodType;
          break;
        case "ORGAN":
          payload.requestedOrgan = requestedOrgan;
          break;
        case "TISSUE":
          payload.requestedTissue = requestedTissue;
          break;
        case "STEM_CELL":
          payload.requestedStemCellType = requestedStemCellType;
          break;
      }

      await createReceiveRequest(payload);
      showAlert("Success", "Request created successfully!", "success");

      setTimeout(() => {
        router.back();
      }, 2000);
    } catch (error: any) {
      showAlert("Error", error.message || "Failed to create request", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleBackPress = () => {
    router.replace("/(tabs)/receive");
  };

  if (roleLoading) {
    return (
      <AppLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <View style={{ flex: 1, overflow: "hidden" }}>
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 999,
            transform: [{ translateY: headerTranslateY }],
            backgroundColor: theme.background,
          }}
        >
          <StatusHeader
            title="Create Request"
            subtitle="Request medical assistance"
            iconName="plus-circle"
            statusText={isFormValid() ? "✓ Ready" : "In Progress"}
            showBackButton
            onBackPress={handleBackPress}
            theme={theme}
          />
        </Animated.View>

        <ScrollView
          contentContainerStyle={{
            paddingTop: HEADER_HEIGHT + 10,
            paddingHorizontal: 20,
            paddingBottom: 140,
          }}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
        >
          <RequestTypeSelector
            requestType={requestType}
            setRequestType={setRequestType}
          />
          <LocationSelector
            selectedLocationId={locationId}
            onLocationSelect={setLocationId}
            recipientId={recipientId}
          />

          <RequestDetailsForm
            requestType={requestType}
            requestedBloodType={requestedBloodType}
            setRequestedBloodType={setRequestedBloodType}
            requestedOrgan={requestedOrgan}
            setRequestedOrgan={setRequestedOrgan}
            requestedTissue={requestedTissue}
            setRequestedTissue={setRequestedTissue}
            requestedStemCellType={requestedStemCellType}
            setRequestedStemCellType={setRequestedStemCellType}
            urgencyLevel={urgencyLevel}
            setUrgencyLevel={setUrgencyLevel}
            quantity={quantity}
            setQuantity={setQuantity}
            notes={notes}
            setNotes={setNotes}
          />

          <View style={styles.sectionContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Request Date</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={theme.textSecondary}
                value={requestDate}
                onChangeText={setRequestDate}
              />
            </View>
          </View>

          <View style={{ marginTop: 20 }}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                !isFormValid() || loading ? styles.submitButtonDisabled : null,
              ]}
              onPress={handleSubmit}
              disabled={!isFormValid() || loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>Submit Request</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      <ValidationAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        type={alertType}
        onClose={() => setAlertVisible(false)}
      />
    </AppLayout>
  );
};

export default RecipientRequestScreen;
