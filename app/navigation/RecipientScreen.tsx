import React, { useEffect, useState, useRef } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuth } from "../../utils/auth-context";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import * as Location from "expo-location";
import { registerRecipient, addRecipientRole } from "../api/recipientApi";
import { refreshAuthTokens } from "../api/roleApi";
import { useTheme } from "../../utils/theme-context";
import { lightTheme, darkTheme } from "../../constants/styles/authStyles";
import { createUnifiedStyles } from "../../constants/styles/unifiedStyles";
import AppLayout from "@/components/AppLayout";

import { RecipientForm } from "../../components/recipient/RecipientForm";
import { ValidationAlert } from "../../components/common/ValidationAlert";
import { useRecipientFormState } from "../../hooks/useRecipientFormState";

const RecipientScreen: React.FC = () => {
  const { colorScheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams();
  const isDark = colorScheme === "dark";
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  const formState = useRecipientFormState();

  const [roleLoading, setRoleLoading] = useState<boolean>(true);
  const [locationLoading, setLocationLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [canGoBack, setCanGoBack] = useState<boolean>(false);
  const [manualLocationSet, setManualLocationSet] = useState<boolean>(false);
  const [hasExistingData, setHasExistingData] = useState<boolean>(false);
  const [hasLocationData, setHasLocationData] = useState<boolean>(false);

  const locationFetchAttempted = useRef<boolean>(false);
  const dataCheckCompleted = useRef<boolean>(false);

  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [alertTitle, setAlertTitle] = useState<string>("");
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<
    "success" | "error" | "warning" | "info"
  >("info");

  const showAlert = (
    title: string,
    message: string,
    type: "success" | "error" | "warning" | "info" = "info"
  ): void => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
  };

  useEffect(() => {
    if (dataCheckCompleted.current) return;

    const checkExistingData = async () => {
      try {
        const recipientData = await SecureStore.getItemAsync("recipientData");
        const hasData = !!recipientData;
        setHasExistingData(hasData);

        if (recipientData) {
          const recipient = JSON.parse(recipientData);
          const hasLocation = !!(
            (recipient.addresses?.[0]?.latitude &&
              recipient.addresses?.[0]?.longitude) ||
            (recipient.location?.latitude && recipient.location?.longitude)
          );
          setHasLocationData(hasLocation);
          console.log(
            "📍 Data check complete - hasData:",
            hasData,
            "hasLocation:",
            hasLocation
          );
        } else {
          setHasLocationData(false);
          console.log("📍 No existing data found");
        }
        dataCheckCompleted.current = true;
      } catch (error) {
        setHasExistingData(false);
        setHasLocationData(false);
        dataCheckCompleted.current = true;
      }
    };
    checkExistingData();
  }, []);

  useEffect(() => {
    if (
      params.fromMap === "true" &&
      params.selectedLatitude &&
      params.selectedLongitude
    ) {
      const lat = parseFloat(params.selectedLatitude as string);
      const lng = parseFloat(params.selectedLongitude as string);
      if (!isNaN(lat) && !isNaN(lng)) {
        console.log("🗺️ Manual location set from map");
        setManualLocationSet(true);
        locationFetchAttempted.current = true;
        formState.setLatitude(lat);
        formState.setLongitude(lng);
      }
    }
  }, [params.fromMap, params.selectedLatitude, params.selectedLongitude]);

  useEffect(() => {
    if (
      manualLocationSet &&
      params.selectedLatitude &&
      params.selectedLongitude
    ) {
      const expectedLat = parseFloat(params.selectedLatitude as string);
      const expectedLng = parseFloat(params.selectedLongitude as string);

      const currentLat = formState.latitude;
      const currentLng = formState.longitude;

      if (currentLat !== expectedLat || currentLng !== expectedLng) {
        console.log(
          "🔧 Database override detected - restoring manual coordinates"
        );
        console.log(
          "Expected:",
          expectedLat,
          expectedLng,
          "Got:",
          currentLat,
          currentLng
        );
        formState.setLatitude(expectedLat);
        formState.setLongitude(expectedLng);
      }

      const protectionInterval = setInterval(() => {
        const currentLat = formState.latitude;
        const currentLng = formState.longitude;

        if (currentLat !== expectedLat || currentLng !== expectedLng) {
          console.log("🔧 Continuous protection: Database override detected");
          formState.setLatitude(expectedLat);
          formState.setLongitude(expectedLng);
        }
      }, 100);

      setTimeout(() => clearInterval(protectionInterval), 5000);
      return () => clearInterval(protectionInterval);
    }
  }, [
    manualLocationSet,
    params.selectedLatitude,
    params.selectedLongitude,
    formState.latitude,
    formState.longitude,
  ]);

  useEffect(() => {
    const checkNavigation = () => {
      try {
        const navigationState = router.canGoBack?.();
        setCanGoBack(!!navigationState);
      } catch (error) {
        setCanGoBack(false);
      }
    };
    checkNavigation();
  }, [router]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("../(auth)/loginScreen");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const ensureRecipientRole = async (): Promise<void> => {
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
            SecureStore.setItemAsync("accessToken", newTokens.accessToken),
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
          error.message || "Unable to assign recipient role.",
          "error"
        );
        router.replace("/(auth)/loginScreen");
        return;
      } finally {
        setRoleLoading(false);
      }
    };
    ensureRecipientRole();
  }, [router]);

  useEffect(() => {
    if (locationFetchAttempted.current || !dataCheckCompleted.current) {
      return;
    }

    const shouldBlockAutoFetch =
      manualLocationSet ||
      hasExistingData ||
      hasLocationData ||
      (formState.latitude && formState.longitude);

    if (shouldBlockAutoFetch) {
      console.log("🚫 Auto-fetch BLOCKED - using existing data:", {
        manualLocationSet,
        hasExistingData,
        hasLocationData,
        hasFormLocation: !!(formState.latitude && formState.longitude),
      });
      locationFetchAttempted.current = true;
      return;
    }

    const initializeLocation = async () => {
      console.log("📍 Starting auto-fetch - no existing location data");
      locationFetchAttempted.current = true;
      setLocationLoading(true);

      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          showAlert(
            "Location Permission Denied",
            "Location access is required for registration.",
            "warning"
          );
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (!manualLocationSet && !hasExistingData && !hasLocationData) {
          formState.setLatitude(location.coords.latitude);
          formState.setLongitude(location.coords.longitude);
          console.log("✅ Auto-fetch completed and coordinates set");
        } else {
          console.log(
            "⚠️ Auto-fetch completed but coordinates not set due to existing data"
          );
        }
      } catch (error: any) {
        showAlert(
          "Location Error",
          "Unable to get current location. You can set it manually.",
          "warning"
        );
      } finally {
        setLocationLoading(false);
      }
    };

    initializeLocation();
  }, [
    dataCheckCompleted.current,
    hasExistingData,
    hasLocationData,
    manualLocationSet,
    formState.latitude,
    formState.longitude,
  ]);

  const handleResetLocation = () => {
    formState.setLatitude(null);
    formState.setLongitude(null);
    setManualLocationSet(false);
    setHasLocationData(false);
    locationFetchAttempted.current = false;
    dataCheckCompleted.current = false;
  };

  const handleBackPress = () => {
    if (canGoBack) {
      router.back();
    } else {
      router.replace("/(tabs)/receive");
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (!formState.isFormValid()) {
      showAlert(
        "Incomplete Form",
        "Please fill all required fields to continue.",
        "warning"
      );
      return;
    }

    setLoading(true);
    try {
      const addressData: any = {
        addressLine: formState.addressLine,
        landmark: formState.landmark,
        area: formState.area,
        city: formState.city,
        district: formState.district,
        state: formState.stateVal,
        country: formState.country,
        pincode: formState.pincode,
        latitude: formState.latitude || 0,
        longitude: formState.longitude || 0,
      };

      if (formState.addressId) {
        addressData.id = formState.addressId;
      }

      const payload = {
        availability: formState.availability,
        addresses: [addressData],
        medicalDetails: {
          hemoglobinLevel: formState.hemoglobinLevel
            ? Number(formState.hemoglobinLevel)
            : undefined,
          bloodPressure: formState.bloodPressure || undefined,
          diagnosis: formState.diagnosis,
          allergies: formState.allergies || undefined,
          currentMedications: formState.currentMedications || undefined,
          additionalNotes: formState.additionalNotes || undefined,
          hasInfectiousDiseases: formState.hasInfectiousDiseases,
          infectiousDiseaseDetails: formState.hasInfectiousDiseases
            ? formState.infectiousDiseaseDetails
            : undefined,
          creatinineLevel: formState.creatinineLevel
            ? Number(formState.creatinineLevel)
            : undefined,
          liverFunctionTests: formState.liverFunctionTests || undefined,
          cardiacStatus: formState.cardiacStatus || undefined,
          pulmonaryFunction: formState.pulmonaryFunction
            ? Number(formState.pulmonaryFunction)
            : undefined,
          overallHealthStatus: formState.overallHealthStatus || undefined,
        },
        eligibilityCriteria: {
          ageEligible: formState.age ? parseInt(formState.age) >= 18 : false,
          age: formState.age ? parseInt(formState.age) : undefined,
          dob: formState.dob || undefined,
          weightEligible: formState.weight
            ? parseFloat(formState.weight) >= 45
            : false,
          weight: formState.weight ? Number(formState.weight) : undefined,
          height: formState.height ? Number(formState.height) : undefined,
          bodyMassIndex: formState.bodyMassIndex
            ? Number(formState.bodyMassIndex)
            : undefined,
          bodySize: formState.bodySize || undefined,
          medicallyEligible: formState.medicallyEligible,
          legalClearance: formState.legalClearance,
          notes: formState.eligibilityNotes || undefined,
          lastReviewed:
            formState.lastReviewed || new Date().toISOString().slice(0, 10),
          isLivingDonor: false,
        },
        hlaProfile:
          formState.hlaA1 ||
          formState.hlaA2 ||
          formState.hlaB1 ||
          formState.hlaB2
            ? {
                hlaA1: formState.hlaA1 || undefined,
                hlaA2: formState.hlaA2 || undefined,
                hlaB1: formState.hlaB1 || undefined,
                hlaB2: formState.hlaB2 || undefined,
                hlaC1: formState.hlaC1 || undefined,
                hlaC2: formState.hlaC2 || undefined,
                hlaDR1: formState.hlaDR1 || undefined,
                hlaDR2: formState.hlaDR2 || undefined,
                hlaDQ1: formState.hlaDQ1 || undefined,
                hlaDQ2: formState.hlaDQ2 || undefined,
                hlaDP1: formState.hlaDP1 || undefined,
                hlaDP2: formState.hlaDP2 || undefined,
                testingDate: formState.testingDate || undefined,
                testingMethod: formState.testingMethod || undefined,
                laboratoryName: formState.laboratoryName || undefined,
                certificationNumber: formState.certificationNumber || undefined,
                hlaString: `${formState.hlaA1 || ""},${formState.hlaA2 || ""},${
                  formState.hlaB1 || ""
                },${formState.hlaB2 || ""},${formState.hlaC1 || ""},${
                  formState.hlaC2 || ""
                },${formState.hlaDR1 || ""},${formState.hlaDR2 || ""},${
                  formState.hlaDQ1 || ""
                },${formState.hlaDQ2 || ""},${formState.hlaDP1 || ""},${
                  formState.hlaDP2 || ""
                }`,
                isHighResolution: true,
              }
            : undefined,
        consentForm: {
          isConsented: formState.isConsented,
          consentedAt: formState.consentedAt || new Date().toISOString(),
        },
      };

      const response = await registerRecipient(payload);
      if (response?.id) {
        await SecureStore.setItemAsync("recipientId", response.id);
        await SecureStore.setItemAsync(
          "recipientData",
          JSON.stringify(response)
        );

        if (
          response.addresses &&
          response.addresses.length > 0 &&
          !formState.addressId
        ) {
          formState.setAddressId(response.addresses[0].id || null);
        }

        showAlert(
          "Registration Successful!",
          "Your recipient profile has been created successfully.",
          "success"
        );

        setTimeout(() => {
          router.replace("/(tabs)/receive");
        }, 2000);
      } else {
        throw new Error(
          "Registration succeeded but recipientId missing in response."
        );
      }
    } catch (error: any) {
      showAlert(
        "Registration Failed",
        error.message || "Something went wrong during registration.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  if (roleLoading || locationLoading) {
    const loadingMessage = roleLoading
      ? "Setting up recipient role..."
      : "Getting your location...";

    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>{loadingMessage}</Text>
      </View>
    );
  }

  return (
    <AppLayout>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <TouchableOpacity
              onPress={handleBackPress}
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
            onLocationPress={() =>
              router.push({
                pathname: "/navigation/mapScreen",
                params: {
                  latitude: formState.latitude?.toString() || "",
                  longitude: formState.longitude?.toString() || "",
                  returnScreen: "recipient",
                },
              })
            }
            onResetLocation={handleResetLocation}
            manualLocationSet={manualLocationSet}
          />
        </ScrollView>

        <View style={styles.submitButtonContainer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              !formState.isFormValid() || loading
                ? styles.submitButtonDisabled
                : null,
            ]}
            onPress={handleSubmit}
            disabled={!formState.isFormValid() || loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>Complete Registration</Text>
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
