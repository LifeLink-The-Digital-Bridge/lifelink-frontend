import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../../utils/auth-context";
import { View, ScrollView, TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import * as Location from "expo-location";
import { useTheme } from "../../utils/theme-context";
import { lightTheme, darkTheme } from "../../constants/styles/authStyles";
import { createUnifiedStyles } from "../../constants/styles/unifiedStyles";
import { registerRecipient } from "../api/recipientApi";
import { addRecipientRole, refreshAuthTokens } from "../api/roleApi";
import { ValidationAlert } from "../../components/common/ValidationAlert";
import AppLayout from "@/components/AppLayout";

import { RecipientForm } from "../../components/recipient/RecipientForm";
import { useRecipientFormState } from "../../hooks/useRecipientFormState";

const RecipientScreen: React.FC = () => {
  const { colorScheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const isDark = colorScheme === "dark";
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  const formState = useRecipientFormState();

  const [roleLoading, setRoleLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(true);

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

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("../(auth)/loginScreen");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const ensureRecipientRole = async () => {
      setRoleLoading(true);
      try {
        let rolesString = await SecureStore.getItemAsync("roles");
        let roles: string[] = [];
        try {
          roles = rolesString ? JSON.parse(rolesString) : [];
        } catch {
          roles = [];
        }
        if (!roles.includes("RECIPIENT")) {
          await addRecipientRole();
          const newTokens = await refreshAuthTokens();
          await Promise.all([
            SecureStore.setItemAsync("jwt", newTokens.accessToken),
            SecureStore.setItemAsync("refreshToken", newTokens.refreshToken),
            SecureStore.setItemAsync("email", newTokens.email),
            SecureStore.setItemAsync("username", newTokens.username),
            SecureStore.setItemAsync("roles", JSON.stringify(newTokens.roles)),
            SecureStore.setItemAsync("userId", newTokens.id),
            SecureStore.setItemAsync("gender", newTokens.gender),
            SecureStore.setItemAsync("dob", newTokens.dob),
          ]);
        }
      } catch (error: any) {
        showAlert(
          "Role Assignment Failed",
          error.message ||
            "Unable to assign recipient role. Please try logging in again.",
          "error"
        );
        router.replace("/(auth)/loginScreen");
        return;
      } finally {
        setRoleLoading(false);
      }
    };
    ensureRecipientRole();
  }, []);

  useEffect(() => {
    const initializeLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          showAlert(
            "Location Permission Denied",
            "Location access is required for registration. Please enable location permissions in settings.",
            "warning"
          );
          setLocationLoading(false);
          return;
        }

        if (!formState.latitude && !formState.longitude) {
          const getLocationWithTimeout = (
            timeoutMs = 10000
          ): Promise<Location.LocationObject> => {
            return Promise.race([
              Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
              }),
              new Promise<never>((_, reject) =>
                setTimeout(
                  () => reject(new Error("Location request timeout")),
                  timeoutMs
                )
              ),
            ]);
          };

          let location = await getLocationWithTimeout();
          formState.setLatitude(location.coords.latitude);
          formState.setLongitude(location.coords.longitude);
        }
      } catch (error: any) {
        console.error("Location error:", error);
        showAlert(
          "Location Error",
          "Unable to get your current location. You can still set it manually using the map.",
          "warning"
        );
      } finally {
        setLocationLoading(false);
      }
    };

    initializeLocation();
  }, [formState.latitude, formState.longitude]);

  const validateForm = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!formState.diagnosis.trim()) {
      errors.push("Medical diagnosis is required");
    }
    if (!formState.addressLine.trim()) {
      errors.push("Address line is required");
    }
    if (!formState.city.trim()) {
      errors.push("City is required");
    }
    if (!formState.stateVal.trim()) {
      errors.push("State is required");
    }
    if (!formState.country.trim()) {
      errors.push("Country is required");
    }
    if (!formState.pincode.trim()) {
      errors.push("Pincode is required");
    }
    if (!formState.isConsented) {
      errors.push("Consent is required to proceed");
    }
    if (formState.latitude === null || formState.longitude === null) {
      errors.push("Location coordinates are required");
    }
    if (formState.age && parseInt(formState.age) < 18) {
      errors.push("Age must be 18 or above");
    }
    if (formState.weight && parseFloat(formState.weight) < 30) {
      errors.push("Weight seems too low, please verify");
    }

    return { isValid: errors.length === 0, errors };
  };

  const handleSubmit = async () => {
    const validation = validateForm();

    if (!validation.isValid) {
      showAlert(
        "Form Validation Failed",
        `Please fix the following issues:\n\n• ${validation.errors.join(
          "\n• "
        )}`,
        "warning"
      );
      return;
    }

    formState.setLoading(true);

    try {
      const userId = await SecureStore.getItemAsync("userId");
      if (!userId) {
        throw new Error("User session expired. Please log in again.");
      }

      const payload = {
        availability: formState.availability,
        addresses: [
          {
            addressLine: formState.addressLine.trim(),
            landmark: formState.landmark?.trim() || "",
            area: formState.area?.trim() || "",
            city: formState.city.trim(),
            district: formState.district?.trim() || "",
            state: formState.stateVal.trim(),
            country: formState.country.trim(),
            pincode: formState.pincode.trim(),
            latitude: formState.latitude!,
            longitude: formState.longitude!,
          },
        ],
        medicalDetails: {
          diagnosis: formState.diagnosis.trim(),
          allergies: formState.allergies?.trim() || undefined,
          currentMedications: formState.currentMedications?.trim() || undefined,
          additionalNotes: formState.additionalNotes?.trim() || undefined,
          hemoglobinLevel: formState.hemoglobinLevel
            ? parseFloat(formState.hemoglobinLevel)
            : undefined,
          bloodPressure: formState.bloodPressure?.trim() || undefined,
          hasInfectiousDiseases: formState.hasInfectiousDiseases,
          infectiousDiseaseDetails: formState.hasInfectiousDiseases
            ? formState.infectiousDiseaseDetails?.trim()
            : undefined,
          creatinineLevel: formState.creatinineLevel
            ? parseFloat(formState.creatinineLevel)
            : undefined,
          liverFunctionTests: formState.liverFunctionTests?.trim() || undefined,
          cardiacStatus: formState.cardiacStatus?.trim() || undefined,
          pulmonaryFunction: formState.pulmonaryFunction
            ? parseFloat(formState.pulmonaryFunction)
            : undefined,
          overallHealthStatus:
            formState.overallHealthStatus?.trim() || undefined,
        },
        eligibilityCriteria: {
          ageEligible: formState.age ? parseInt(formState.age) >= 18 : false,
          age: formState.age ? parseInt(formState.age) : undefined,
          dob: formState.dob?.trim() || undefined,
          weightEligible: formState.weight
            ? parseFloat(formState.weight) >= 45
            : false,
          weight: formState.weight ? parseFloat(formState.weight) : undefined,
          height: formState.height ? parseFloat(formState.height) : undefined,
          bodyMassIndex: formState.bodyMassIndex
            ? parseFloat(formState.bodyMassIndex)
            : undefined,
          bodySize: formState.bodySize?.trim() || undefined,
          medicallyEligible: formState.medicallyEligible,
          legalClearance: formState.legalClearance,
          notes: formState.eligibilityNotes?.trim() || undefined,
          lastReviewed:
            formState.lastReviewed?.trim() ||
            new Date().toISOString().slice(0, 10),
          isLivingDonor: false,
        },
        consentForm: {
          isConsented: formState.isConsented,
          consentedAt: formState.consentedAt || new Date().toISOString(),
        },
        hlaProfile:
          formState.hlaA1 ||
          formState.hlaA2 ||
          formState.hlaB1 ||
          formState.hlaB2
            ? {
                hlaA1: formState.hlaA1?.trim() || undefined,
                hlaA2: formState.hlaA2?.trim() || undefined,
                hlaB1: formState.hlaB1?.trim() || undefined,
                hlaB2: formState.hlaB2?.trim() || undefined,
                hlaC1: formState.hlaC1?.trim() || undefined,
                hlaC2: formState.hlaC2?.trim() || undefined,
                hlaDR1: formState.hlaDR1?.trim() || undefined,
                hlaDR2: formState.hlaDR2?.trim() || undefined,
                hlaDQ1: formState.hlaDQ1?.trim() || undefined,
                hlaDQ2: formState.hlaDQ2?.trim() || undefined,
                hlaDP1: formState.hlaDP1?.trim() || undefined,
                hlaDP2: formState.hlaDP2?.trim() || undefined,
                testingDate: formState.testingDate?.trim() || undefined,
                testingMethod: formState.testingMethod?.trim() || undefined,
                laboratoryName: formState.laboratoryName?.trim() || undefined,
                certificationNumber:
                  formState.certificationNumber?.trim() || undefined,
                hlaString: `${formState.hlaA1 || "N/A"},${
                  formState.hlaA2 || "N/A"
                },${formState.hlaB1 || "N/A"},${formState.hlaB2 || "N/A"},${
                  formState.hlaC1 || "N/A"
                },${formState.hlaC2 || "N/A"},${formState.hlaDR1 || "N/A"},${
                  formState.hlaDR2 || "N/A"
                },${formState.hlaDQ1 || "N/A"},${formState.hlaDQ2 || "N/A"},${
                  formState.hlaDP1 || "N/A"
                },${formState.hlaDP2 || "N/A"}`,
                isHighResolution: true,
              }
            : undefined,
      };

      const response = await registerRecipient(payload);

      if (response && response.id) {
        await Promise.all([
          SecureStore.setItemAsync("recipientId", response.id),
          SecureStore.setItemAsync("recipientData", JSON.stringify(response)),
        ]);

        showAlert(
          "Registration Successful!",
          "Your recipient profile has been created successfully. You can now create medical requests and receive notifications for matching donations.",
          "success"
        );

        setTimeout(() => {
          router.replace("/(tabs)/receive");
        }, 2500);
      } else {
        throw new Error(
          "Registration completed but recipient ID is missing from response."
        );
      }
    } catch (error: any) {
      console.error("Registration error:", error);

      let errorMessage = "Registration failed. Please try again.";

      if (error.message?.includes("network")) {
        errorMessage =
          "Network error. Please check your internet connection and try again.";
      } else if (error.message?.includes("timeout")) {
        errorMessage =
          "Request timeout. Please check your connection and try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      showAlert("Registration Failed", errorMessage, "error");
    } finally {
      formState.setLoading(false);
    }
  };

  if (roleLoading || locationLoading) {
    const loadingMessage = roleLoading
      ? "Setting up recipient role..."
      : locationLoading
      ? "Getting your location..."
      : "Loading...";

    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>{loadingMessage}</Text>
      </View>
    );
  }

  return (
    <AppLayout hideHeader>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerContainer}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Feather name="arrow-left" size={20} color={theme.text} />
            </TouchableOpacity>

            <View style={styles.headerIconContainer}>
              <Feather name="user-check" size={28} color={theme.primary} />
            </View>

            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Recipient Registration</Text>
              <Text style={styles.headerSubtitle}>
                Complete your medical profile
              </Text>
            </View>

            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {formState.isFormValid() ? "✓ Ready" : "In Progress"}
              </Text>
            </View>
          </View>

          <RecipientForm
            {...formState}
            onLocationPress={() => router.push("/navigation/mapScreen")}
          />
        </ScrollView>

        <View style={styles.submitButtonContainer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              !formState.isFormValid() || formState.loading
                ? styles.submitButtonDisabled
                : null,
            ]}
            onPress={handleSubmit}
            disabled={!formState.isFormValid() || formState.loading}
            activeOpacity={0.8}
          >
            {formState.loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>
                {formState.isFormValid()
                  ? "Complete Registration"
                  : "Please Complete Form"}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <ValidationAlert
          visible={alertVisible}
          title={alertTitle}
          message={alertMessage}
          type={alertType}
          onClose={() => setAlertVisible(false)}
        />
      </View>
    </AppLayout>
  );
};

export default RecipientScreen;
