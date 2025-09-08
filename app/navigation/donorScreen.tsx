import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../../utils/auth-context";
import { View, ScrollView, TouchableOpacity, Text, ActivityIndicator } from "react-native";
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
          recentTravel:
            !!formState.recentTravelDetails &&
            formState.recentTravelDetails !== "No recent travel",
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
          consentType: "BLOOD_DONATION",
        },
        addresses: [
          {
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
          },
        ],
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

      const response = await registerDonor(payload);
      if (response?.id) {
        await SecureStore.setItemAsync("donorId", response.id);
        await SecureStore.setItemAsync("donorData", JSON.stringify(response));
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
              onPress={() => router.back()}
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
              <Text style={styles.submitButtonText}>
                Complete Registration
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

export default DonorScreen;
