import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../../utils/auth-context";
import AppLayout from "@/components/AppLayout";
import * as SecureStore from "expo-secure-store";
import { registerDonor } from "../api/donorApi";
import { addDonorRole, refreshAuthTokens } from "../api/roleApi";

import { DonorForm } from "../../components/donor/DonorForm";
import { SubmitButton } from "../../components/donor/SubmitButton";
import { LoadingScreen } from "../../components/donor/LoadingScreen";
import { ValidationAlert } from "../../components/common/ValidationAlert";

import { useDonorFormState } from "../../hooks/useDonorFormState";

const DonorScreen: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  
  const formState = useDonorFormState();

  const [roleLoading, setRoleLoading] = useState(true);
  const [loading, setLoading] = useState<boolean>(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info'>('info');

  const showAlert = (
    title: string,
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'info'
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
    const ensureDonorRole = async () => {
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
          error.message || "Failed to assign donor role. Please try logging in again.",
          "error"
        );
        router.replace("/(auth)/loginScreen");
        return;
      } finally {
        setRoleLoading(false);
      }
    };
    ensureDonorRole();
  }, []);

  const handleSubmit = async () => {
    if (!formState.isFormValid()) {
      showAlert("Incomplete Form", "Please fill all required fields to continue.", "warning");
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
          diseaseDescription: formState.hasDiseases ? formState.diseaseDescription : null,
          currentMedications: formState.takingMedication ? formState.currentMedications : null,
          lastMedicalCheckup: formState.lastMedicalCheckup,
          medicalHistory: formState.medicalHistory,
          hasInfectiousDiseases: formState.hasInfectiousDiseases,
          infectiousDiseaseDetails: formState.hasInfectiousDiseases ? formState.infectiousDiseaseDetails : null,
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
          recentTravel: !!formState.recentTravelDetails && formState.recentTravelDetails !== "No recent travel",
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
          hlaA1: "A*02:01",
          hlaA2: "A*24:02",
          hlaB1: "B*15:01",
          hlaB2: "B*44:03",
          hlaC1: "C*03:04",
          hlaC2: "C*16:01",
          hlaDR1: "DRB1*07:01",
          hlaDR2: "DRB1*15:01",
          hlaDQ1: "DQB1*02:02",
          hlaDQ2: "DQB1*06:02",
          hlaDP1: "DPB1*04:01",
          hlaDP2: "DPB1*14:01",
          testingDate: new Date().toISOString().slice(0, 10),
          testingMethod: "NGS_SEQUENCING",
          laboratoryName: "GeneTech Labs",
          certificationNumber: `CERT-${new Date().getFullYear()}-HLA-${Math.random()
            .toString(36)
            .substr(2, 6)
            .toUpperCase()}`,
          hlaString: "A*02:01,A*24:02,B*15:01,B*44:03,C*03:04,C*16:01,DRB1*07:01,DRB1*15:01,DQB1*02:02,DQB1*06:02,DPB1*04:01,DPB1*14:01",
          isHighResolution: true,
        },
      };

      const response = await registerDonor(payload);
      if (response && response.id) {
        await SecureStore.setItemAsync("donorId", response.id);
        await SecureStore.setItemAsync("donorData", JSON.stringify(response));
        showAlert(
          "Registration Successful!", 
          "Your donor registration has been completed successfully. Thank you for joining our community of life-savers!", 
          "success"
        );
        
        setTimeout(() => {
          router.replace("/(tabs)/donate");
        }, 2000);
      } else {
        throw new Error("Registration succeeded but donorId missing in response.");
      }
    } catch (error: any) {
      showAlert(
        "Registration Failed",
        error.message || "Something went wrong during registration. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  if (roleLoading) {
    return <LoadingScreen />;
  }

  return (
    <AppLayout title="Become a Donor">
      <DonorForm
        {...formState}
        onLocationPress={() => router.push("/navigation/mapScreen")}
      />

      <SubmitButton
        isFormValid={formState.isFormValid()}
        loading={loading}
        onSubmit={handleSubmit}
      />

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

export default DonorScreen;
