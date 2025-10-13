import React, { useEffect, useState, useRef } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuth } from "../../utils/auth-context";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Animated,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { registerDonor, addDonorRole } from "../api/donorApi";
import { refreshAuthTokens } from "../api/roleApi";
import { useTheme } from "../../utils/theme-context";
import { lightTheme, darkTheme } from "../../constants/styles/authStyles";
import { createUnifiedStyles } from "../../constants/styles/unifiedStyles";
import { DonorForm } from "../../components/donor/DonorForm";
import { ValidationAlert } from "../../components/common/ValidationAlert";
import { useDonorFormState } from "../../hooks/useDonorFormState";
import * as Location from "expo-location";
import { StatusHeader } from "@/components/common/StatusHeader";
import AppLayout from "@/components/AppLayout";

const HEADER_HEIGHT = 140;

const DonorScreen: React.FC = () => {
  const { colorScheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams();
  const isDark = colorScheme === "dark";
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  const lastScrollY = useRef(0);
  const headerTranslateY = useRef(new Animated.Value(0)).current;

  const formState = useDonorFormState();

  const [roleLoading, setRoleLoading] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [canGoBack, setCanGoBack] = useState<boolean>(false);
  const [locationLoading, setLocationLoading] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
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
    if (dataCheckCompleted.current) return;

    const checkExistingData = async () => {
      try {
        const donorData = await SecureStore.getItemAsync("donorData");
        const hasData = !!donorData;
        setHasExistingData(hasData);

        if (donorData) {
          const donor = JSON.parse(donorData);
          const hasLocation = !!(
            (donor.addresses?.[0]?.latitude &&
              donor.addresses?.[0]?.longitude) ||
            (donor.location?.latitude && donor.location?.longitude)
          );
          setHasLocationData(hasLocation);
        } else {
          setHasLocationData(false);
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
        setManualLocationSet(true);
        locationFetchAttempted.current = true;
        formState.setLocation({ latitude: lat, longitude: lng });
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

      const currentLat = formState.location?.latitude;
      const currentLng = formState.location?.longitude;

      if (currentLat !== expectedLat || currentLng !== expectedLng) {
        formState.setLocation({
          latitude: expectedLat,
          longitude: expectedLng,
        });
      }

      const protectionInterval = setInterval(() => {
        const currentLat = formState.location?.latitude;
        const currentLng = formState.location?.longitude;

        if (currentLat !== expectedLat || currentLng !== expectedLng) {
          formState.setLocation({
            latitude: expectedLat,
            longitude: expectedLng,
          });
        }
      }, 100);

      setTimeout(() => clearInterval(protectionInterval), 5000);
      return () => clearInterval(protectionInterval);
    }
  }, [
    manualLocationSet,
    params.selectedLatitude,
    params.selectedLongitude,
    formState.location?.latitude,
    formState.location?.longitude,
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
          "Role Error",
          error.message || "Failed to assign donor role.",
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
    if (locationFetchAttempted.current || !dataCheckCompleted.current) {
      return;
    }

    const shouldBlockAutoFetch =
      manualLocationSet ||
      hasExistingData ||
      hasLocationData ||
      (formState.location?.latitude && formState.location?.longitude);

    if (shouldBlockAutoFetch) {
      locationFetchAttempted.current = true;
      return;
    }

    const initializeLocation = async () => {
      locationFetchAttempted.current = true;
      setLocationLoading(true);

      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocationError("Location permission denied.");
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
          formState.setLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        }
      } catch (error: any) {
        setLocationError("Unable to get current location.");
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
    formState.location?.latitude,
    formState.location?.longitude,
  ]);

  const handleResetLocation = () => {
    formState.setLocation(null);
    setManualLocationSet(false);
    setHasLocationData(false);
    locationFetchAttempted.current = false;
    dataCheckCompleted.current = false;
  };

  const handleBackPress = () => {
    router.replace("/(tabs)/donate");
  };

  const handleSubmit = async (): Promise<void> => {
    if (!formState.isFormValid()) {
      showAlert(
        "Incomplete Form",
        "Please fill all required fields.",
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

      const response = await registerDonor(payload);
      if (response?.id) {
        await SecureStore.setItemAsync("donorId", response.id);
        await SecureStore.setItemAsync("donorData", JSON.stringify(response));

        if (
          response.addresses &&
          response.addresses.length > 0 &&
          !formState.addressId
        ) {
          formState.setAddressId(response.addresses[0].id);
        }

        showAlert(
          "Registration Successful!",
          "Your donor registration has been completed successfully.",
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
        error.message || "Something went wrong during registration.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  if (roleLoading || locationLoading) {
    const loadingMessage = roleLoading
      ? "Setting up donor role..."
      : "Getting your location...";

    return (
      <AppLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>{loadingMessage}</Text>
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
            title="Donor Registration"
            subtitle="Complete your profile to help save lives"
            iconName="user-plus"
            statusText={formState.isFormValid() ? "✓ Ready" : "In Progress"}
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
          <DonorForm
            {...formState}
            onLocationPress={() =>
              router.push({
                pathname: "/navigation/mapScreen",
                params: {
                  latitude: formState.location?.latitude?.toString() || "",
                  longitude: formState.location?.longitude?.toString() || "",
                  returnScreen: "donor",
                },
              })
            }
            locationLoading={locationLoading}
            locationError={locationError}
            onResetLocation={handleResetLocation}
            manualLocationSet={manualLocationSet}
          />

          <View style={{ marginTop: 20 }}>
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

export default DonorScreen;
