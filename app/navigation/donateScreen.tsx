import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../../utils/auth-context";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Animated,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { useTheme } from "../../utils/theme-context";
import { lightTheme, darkTheme } from "../../constants/styles/authStyles";
import { createUnifiedStyles } from "../../constants/styles/unifiedStyles";
import {
  registerDonation,
  DonationType,
  BloodType,
  OrganType,
  TissueType,
  StemCellType,
} from "../api/donationApi";
import { ValidationAlert } from "../../components/common/ValidationAlert";
import { DonationTypeSelector } from "../../components/donation/DonationTypeSelector";
import { BloodTypeSelector } from "../../components/donation/BloodTypeSelector";
import { OrganDetailsForm } from "../../components/donation/OrganDetailsForm";
import { TissueDetailsForm } from "../../components/donation/TissueDetailsForm";
import { StemCellDetailsForm } from "../../components/donation/StemCellDetailsForm";
import AppLayout from "@/components/AppLayout";
import { LocationSelector } from "@/components/donation/LocationSelector";
import { StatusHeader } from "@/components/common/StatusHeader";
import { fetchDonorByUserId } from "../api/donorApi";

const HEADER_HEIGHT = 180;

const DonationScreen = () => {
  const { colorScheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const isDark = colorScheme === "dark";
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  const lastScrollY = useRef(0);
  const headerTranslateY = useRef(new Animated.Value(0)).current;

  const [loading, setLoading] = useState(false);
  const [checkingHLA, setCheckingHLA] = useState(false);
  const [donorId, setDonorId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [donationType, setDonationType] = useState<DonationType>("BLOOD");
  const [donationDate, setDonationDate] = useState("");
  const [bloodType, setBloodType] = useState<BloodType>("" as BloodType);
  const [quantity, setQuantity] = useState("");
  const [hlaProfile, setHlaProfile] = useState<any>(null);

  const [organType, setOrganType] = useState<OrganType | "">("" as OrganType);
  const [isCompatible, setIsCompatible] = useState(false);
  const [organQuality, setOrganQuality] = useState("");
  const [organViabilityExpiry, setOrganViabilityExpiry] = useState("");
  const [coldIschemiaTime, setColdIschemiaTime] = useState("");
  const [organPerfused, setOrganPerfused] = useState(false);
  const [organWeight, setOrganWeight] = useState("");
  const [organSize, setOrganSize] = useState("");
  const [functionalAssessment, setFunctionalAssessment] = useState("");
  const [hasAbnormalities, setHasAbnormalities] = useState(false);
  const [abnormalityDescription, setAbnormalityDescription] = useState("");

  const [tissueType, setTissueType] = useState<TissueType | "">(
    "" as TissueType
  );
  const [stemCellType, setStemCellType] = useState<StemCellType | "">(
    "" as StemCellType
  );

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

  const handleTypeChange = (newType: DonationType) => {
    if (newType !== "BLOOD" && !hlaProfile) {
      showAlert(
        "HLA Profile Required",
        "Organ, Tissue, and Stem Cell donations require an HLA profile. Please complete your donor registration first.",
        "warning"
      );
      return;
    }

    setDonationType(newType);
    setQuantity("");
    setOrganType("" as OrganType);
    setTissueType("" as TissueType);
    setStemCellType("" as StemCellType);
    setOrganQuality("");
    setOrganViabilityExpiry("");
    setColdIschemiaTime("");
    setOrganWeight("");
    setOrganSize("");
    setFunctionalAssessment("");
    setAbnormalityDescription("");
    setIsCompatible(false);
    setOrganPerfused(false);
    setHasAbnormalities(false);
  };

  useEffect(() => {
    const today = new Date();
    setDonationDate(today.toISOString().slice(0, 10));

    const fetchData = async () => {
      setCheckingHLA(true);
      try {
        const donorData = await fetchDonorByUserId();

        if (donorData && donorData.id) {
          setDonorId(donorData.id);
          setHlaProfile(donorData.hlaProfile || null);

          await SecureStore.setItemAsync("donorId", donorData.id);
          await SecureStore.setItemAsync("donorData", JSON.stringify(donorData));
        } else {
          console.log("No donor data found for current user");
        }
      } catch (error) {
        console.error("Error fetching donor data:", error);
      } finally {
        setCheckingHLA(false);
      }
    };

    fetchData();
  }, []);


  const isFormValid = () => {
    if (
      !donorId ||
      !donationType ||
      !donationDate ||
      !locationId ||
      !bloodType
    ) {
      return false;
    }

    if (donationType !== "BLOOD" && !hlaProfile) {
      return false;
    }

    switch (donationType) {
      case "BLOOD":
        return !!quantity;
      case "ORGAN":
        return !!(
          organType &&
          organQuality &&
          organWeight &&
          organSize &&
          functionalAssessment
        );
      case "TISSUE":
        return !!(tissueType && quantity);
      case "STEM_CELL":
        return !!(stemCellType && quantity);
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (donationType !== "BLOOD" && !hlaProfile) {
      showAlert(
        "Profile Incomplete",
        "You need to complete your HLA profile before donating organs, tissue, or stem cells. Please update your donor registration.",
        "error"
      );
      return;
    }

    if (!isFormValid()) {
      showAlert(
        "Validation Error",
        "Please fill all required fields to submit your donation.",
        "warning"
      );
      return;
    }

    setLoading(true);
    try {
      const payload: any = {
        donorId,
        donationType,
        donationDate,
        locationId,
        bloodType,
      };

      switch (donationType) {
        case "BLOOD":
          payload.quantity = Number(quantity);
          break;
        case "ORGAN":
          payload.organType = organType;
          payload.isCompatible = isCompatible;
          payload.organQuality = organQuality;
          payload.organViabilityExpiry = organViabilityExpiry;
          payload.coldIschemiaTime = Number(coldIschemiaTime);
          payload.organPerfused = organPerfused;
          payload.organWeight = Number(organWeight);
          payload.organSize = organSize;
          payload.functionalAssessment = functionalAssessment;
          payload.hasAbnormalities = hasAbnormalities;
          if (hasAbnormalities) {
            payload.abnormalityDescription = abnormalityDescription;
          }
          break;
        case "TISSUE":
          payload.tissueType = tissueType;
          payload.quantity = Number(quantity);
          break;
        case "STEM_CELL":
          payload.stemCellType = stemCellType;
          payload.quantity = Number(quantity);
          break;
      }

      const response = await registerDonation(payload);
      showAlert(
        "Donation Successful!",
        "Your donation has been recorded successfully. You will receive confirmation details shortly.",
        "success"
      );

      setTimeout(() => {
        router.replace("/(tabs)/donate");
      }, 2000);
    } catch (error: any) {
      showAlert(
        "Donation Failed",
        error.message ||
        "Unable to process your donation at this time. Please check your connection and try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackPress = () => {
    router.replace("/(tabs)/donate");
  };

  if (checkingHLA) {
    return (
      <AppLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>Checking profile...</Text>
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
            title="Make Donation"
            subtitle="Help save lives with your contribution"
            iconName="gift"
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
          <DonationTypeSelector
            donationType={donationType}
            setDonationType={setDonationType}
            onTypeChange={handleTypeChange}
            hlaProfile={hlaProfile}
          />
          <LocationSelector
            selectedLocationId={locationId}
            onLocationSelect={setLocationId}
            donorId={donorId}
          />
          <BloodTypeSelector
            bloodType={bloodType}
            setBloodType={setBloodType}
          />

          {donationType === "BLOOD" && (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconContainer}>
                  <Feather name="droplet" size={18} color={theme.primary} />
                </View>
                <Text style={styles.sectionTitle}>Blood Details</Text>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Quantity (liters, e.g., 0.5)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.5"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="numeric"
                  value={quantity}
                  onChangeText={setQuantity}
                />
              </View>
            </View>
          )}

          {donationType === "ORGAN" && (
            <OrganDetailsForm
              organType={organType}
              setOrganType={setOrganType}
              isCompatible={isCompatible}
              setIsCompatible={setIsCompatible}
              organQuality={organQuality}
              setOrganQuality={setOrganQuality}
              organViabilityExpiry={organViabilityExpiry}
              setOrganViabilityExpiry={setOrganViabilityExpiry}
              coldIschemiaTime={coldIschemiaTime}
              setColdIschemiaTime={setColdIschemiaTime}
              organPerfused={organPerfused}
              setOrganPerfused={setOrganPerfused}
              organWeight={organWeight}
              setOrganWeight={setOrganWeight}
              organSize={organSize}
              setOrganSize={setOrganSize}
              functionalAssessment={functionalAssessment}
              setFunctionalAssessment={setFunctionalAssessment}
              hasAbnormalities={hasAbnormalities}
              setHasAbnormalities={setHasAbnormalities}
              abnormalityDescription={abnormalityDescription}
              setAbnormalityDescription={setAbnormalityDescription}
            />
          )}

          {donationType === "TISSUE" && (
            <TissueDetailsForm
              tissueType={tissueType}
              setTissueType={setTissueType}
              quantity={quantity}
              setQuantity={setQuantity}
            />
          )}

          {donationType === "STEM_CELL" && (
            <StemCellDetailsForm
              stemCellType={stemCellType}
              setStemCellType={setStemCellType}
              quantity={quantity}
              setQuantity={setQuantity}
            />
          )}

          <View style={{ marginTop: 20 }}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                !isFormValid() || loading ? styles.submitButtonDisabled : {},
              ]}
              onPress={handleSubmit}
              disabled={!isFormValid() || loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>Submit Donation</Text>
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

export default DonationScreen;
