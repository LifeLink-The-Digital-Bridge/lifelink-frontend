import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
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
import { registerDonor } from "../api/donorApi";
import { addDonorRole } from "../api/donorApi";
import { refreshAuthTokens } from "../api/roleApi";
import { useTheme } from "../../utils/theme-context";
import { lightTheme, darkTheme } from "../../constants/styles/authStyles";
import { createUnifiedStyles } from "../../constants/styles/unifiedStyles";

import { DonorForm } from "../../components/donor/DonorForm";
import { ValidationAlert } from "../../components/common/ValidationAlert";
import { useDonorFormState } from "../../hooks/useDonorFormState";
import AppLayout from "@/components/AppLayout";
import * as Location from "expo-location";

const DonorScreen: React.FC = () => {
  const { colorScheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const isDark = colorScheme === "dark";
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  const formState = useDonorFormState();

  const [roleLoading, setRoleLoading] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [canGoBack, setCanGoBack] = useState<boolean>(false);

  const [locationLoading, setLocationLoading] = useState<boolean>(true);
  const [locationError, setLocationError] = useState<string | null>(null);

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
    const ensureDonorRole = async (): Promise<void> => {
      setRoleLoading(true);
      try {
        let rolesString = await SecureStore.getItemAsync("roles");
        let roles: string[] = [];
        try {
          roles = rolesString ? JSON.parse(rolesString) : [];
        } catch {
          roles = [];
        }
        if (!roles.includes("DONOR")) {
          await addDonorRole();
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
          "Role Error",
          error.message ||
            "Failed to assign donor role. Please try logging in again.",
          "error"
        );
        router.replace("/(auth)/loginScreen");
        return;
      } finally {
        setRoleLoading(false);
      }
    };
    ensureDonorRole();
  }, [router]);

  useEffect(() => {
    const initializeLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocationError("Location permission denied. Please enable location permissions in settings.");
          showAlert(
            "Location Permission Denied",
            "Location access is required for registration. Please enable location permissions in settings.",
            "warning"
          );
          setLocationLoading(false);
          return;
        }

        if (!formState.location) {
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
          formState.setLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });

          console.log("✅ Location auto-fetched for donor:", {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        }
      } catch (error: any) {
        console.error("Location error:", error);
        setLocationError("Unable to get your current location. You can still set it manually using the map.");
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
  }, [formState.location]);

  const handleBackPress = () => {
    if (canGoBack) {
      router.back();
    } else {
      router.replace("/(tabs)/donate");
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
        latitude: formState.location?.latitude || 0,
        longitude: formState.location?.longitude || 0,
      };

      if (formState.addressId) {
        addressData.id = formState.addressId;
        console.log('✅ Including existing address ID:', formState.addressId);
      } else {
        console.log('➕ Creating new address (no existing ID)');
      }

      const payload = {
        registrationDate: new Date().toISOString().slice(0, 10),
        status: "ACTIVE",
        medicalDetails: {
          hemoglobinLevel: Number(formState.hemoglobinLevel),
          bloodPressure: formState.bloodPressure,
          hasDiseases: formState.hasDiseases,
          takingMedication: formState.takingMedication,
          diseaseDescription: formState.hasDiseases
            ? formState.diseaseDescription
            : null,
          currentMedications: formState.takingMedication
            ? formState.currentMedications
            : null,
          lastMedicalCheckup: formState.lastMedicalCheckup,
          medicalHistory: formState.medicalHistory,
          hasInfectiousDiseases: formState.hasInfectiousDiseases,
          infectiousDiseaseDetails: formState.hasInfectiousDiseases
            ? formState.infectiousDiseaseDetails
            : null,
          creatinineLevel: Number(formState.creatinineLevel),
          liverFunctionTests: formState.liverFunctionTests,
          cardiacStatus: formState.cardiacStatus,
          pulmonaryFunction: Number(formState.pulmonaryFunction),
          overallHealthStatus: formState.overallHealthStatus,
        },
        eligibilityCriteria: {
          ageEligible: formState.age !== null ? formState.age >= 18 : false,
          age: formState.age !== null ? formState.age : 0,
          dob: formState.dob,
          weightEligible: formState.weightEligible,
          weight: Number(formState.weight),
          medicalClearance: formState.medicalClearance,
          recentTattooOrPiercing: formState.recentTattooOrPiercing,
          recentTravelDetails: formState.recentTravelDetails,
          recentVaccination: formState.recentVaccination,
          recentSurgery: formState.recentSurgery,
          chronicDiseases: formState.chronicDiseases,
          allergies: formState.allergies,
          lastDonationDate: formState.lastDonationDate || null,
          height: Number(formState.height),
          bodyMassIndex: Number(formState.bodyMassIndex),
          bodySize: formState.bodySize,
          isLivingDonor: formState.isLivingDonor,
        },
        consentForm: {
          userId: formState.userId,
          isConsented: formState.isConsented,
          consentedAt: new Date().toISOString(),
        },
        addresses: [addressData],
        hlaProfile: {
          hlaA1: formState.hlaA1,
          hlaA2: formState.hlaA2,
          hlaB1: formState.hlaB1,
          hlaB2: formState.hlaB2,
          hlaC1: formState.hlaC1,
          hlaC2: formState.hlaC2,
          hlaDR1: formState.hlaDR1,
          hlaDR2: formState.hlaDR2,
          hlaDQ1: formState.hlaDQ1,
          hlaDQ2: formState.hlaDQ2,
          hlaDP1: formState.hlaDP1,
          hlaDP2: formState.hlaDP2,
          testingDate: formState.testingDate,
          testingMethod: formState.testingMethod,
          laboratoryName: formState.laboratoryName,
          certificationNumber: formState.certificationNumber,
          hlaString: `${formState.hlaA1},${formState.hlaA2},${formState.hlaB1},${formState.hlaB2},${formState.hlaC1},${formState.hlaC2},${formState.hlaDR1},${formState.hlaDR2},${formState.hlaDQ1},${formState.hlaDQ2},${formState.hlaDP1},${formState.hlaDP2}`,
          isHighResolution: true,
        },
      };

      console.log('📤 Sending payload with address:', JSON.stringify(addressData, null, 2));

      const response = await registerDonor(payload);
      if (response?.id) {
        await SecureStore.setItemAsync("donorId", response.id);
        await SecureStore.setItemAsync("donorData", JSON.stringify(response));
        
        if (response.addresses && response.addresses.length > 0 && !formState.addressId) {
          formState.setAddressId(response.addresses[0].id);
          console.log('✅ New address ID saved:', response.addresses[0].id);
        }
        
        showAlert(
          "Registration Successful!",
          "Your donor registration has been completed successfully. HLA typing will be conducted during your first medical screening.",
          "success"
        );

        setTimeout(() => {
          router.replace("/(tabs)/donate");
        }, 2000);
      } else {
        throw new Error(
          "Registration succeeded but donorId missing in response."
        );
      }
    } catch (error: any) {
      showAlert(
        "Registration Failed",
        error.message ||
          "Something went wrong during registration. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  if (roleLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>Setting up donor role...</Text>
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
              <Feather name="user-plus" size={28} color={theme.primary} />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Donor Registration</Text>
              <Text style={styles.headerSubtitle}>
                Complete your profile to help save lives
              </Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {formState.isFormValid() ? "✓ Ready" : "In Progress"}
              </Text>
            </View>
          </View>

          <DonorForm
            {...formState}
            onLocationPress={() => router.push("/navigation/mapScreen")}
            locationLoading={locationLoading}
            locationError={locationError}
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

export default DonorScreen;
