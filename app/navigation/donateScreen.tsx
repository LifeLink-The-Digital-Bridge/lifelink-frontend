import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../../utils/auth-context";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { useTheme } from "../../utils/theme-context";
import { lightTheme, darkTheme } from "../../constants/styles/authStyles";
import { createDonationStyles } from "../../constants/styles/donationStyles";
import { registerDonation } from "../api/donationApi";

import { CustomAlert } from "../../components/common/CustomAlert";
import { ValidationMessage } from "../../components/common/validationMessage";
import { DonationTypeSelector } from "../../components/donation/DonationTypeSelector";
import { BloodTypeSelector } from "../../components/donation/BloodTypeSelector";
import { OrganDetailsForm } from "../../components/donation/OrganDetailsForm";
import { TissueDetailsForm } from "../../components/donation/TissueDetailsForm";
import { StemCellDetailsForm } from "../../components/donation/StemCellDetailsForm";
import AppLayout from "@/components/AppLayout";

const DonationScreen = () => {
  const { colorScheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const isDark = colorScheme === "dark";
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createDonationStyles(theme);

  const [loading, setLoading] = useState(false);
  const [donorId, setDonorId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [donationType, setDonationType] = useState("BLOOD");
  const [donationDate, setDonationDate] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [quantity, setQuantity] = useState("");

  const [organType, setOrganType] = useState("");
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

  const [tissueType, setTissueType] = useState("");
  const [stemCellType, setStemCellType] = useState("");

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");

  const [validationError, setValidationError] = useState("");
  const [validationSuccess, setValidationSuccess] = useState("");

  const showAlert = (
    title: string,
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
  };

  const handleTypeChange = () => {
    setQuantity("");
    setOrganType("");
    setTissueType("");
    setStemCellType("");
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
    setValidationError("");
    setValidationSuccess("");
  };

  useEffect(() => {
    const today = new Date();
    setDonationDate(today.toISOString().slice(0, 10));

    const fetchData = async () => {
      const id = await SecureStore.getItemAsync("donorId");
      if (id) setDonorId(id);

      const donorDataStr = await SecureStore.getItemAsync("donorData");
      if (donorDataStr) {
        try {
          const donorData = JSON.parse(donorDataStr);
          if (donorData?.addresses?.[0]?.id) {
            setLocationId(donorData.addresses[0].id);
          }
        } catch (e) {
          console.error("Error parsing donor data:", e);
        }
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
    setValidationError("");
    setValidationSuccess("");

    if (!isFormValid()) {
      setValidationError(
        "Please fill all required fields to submit your donation."
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
      setValidationSuccess(
        "Donation submitted successfully! Thank you for your generous contribution."
      );

      setTimeout(() => {
        showAlert(
          "Donation Successful!",
          "Your donation has been recorded successfully. You will receive confirmation details shortly.",
          "success"
        );
      }, 1000);

      setTimeout(() => {
        router.replace("/(tabs)/donate");
      }, 3000);
    } catch (error: any) {
      setValidationError(
        error.message ||
          "Something went wrong while submitting your donation. Please try again."
      );
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

  return (
    <AppLayout hideHeader>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Feather name="arrow-left" size={20} color={theme.text} />
            </TouchableOpacity>

            <View style={styles.headerIconContainer}>
              <Feather name="gift" size={28} color={theme.primary} />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Make Donation</Text>
              <Text style={styles.headerSubtitle}>
                Help save lives with your contribution
              </Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {isFormValid() ? "✓ Ready" : "In Progress"}
              </Text>
            </View>
          </View>

          <ValidationMessage error={validationError} />
          <ValidationMessage success={validationSuccess} />

          <DonationTypeSelector
            donationType={donationType}
            setDonationType={setDonationType}
            onTypeChange={handleTypeChange}
          />

          <BloodTypeSelector
            bloodType={bloodType}
            setBloodType={setBloodType}
          />

          {donationType === "BLOOD" && (
            <View style={styles.formSection}>
              <View style={styles.sectionHeader}>
                <Feather name="droplet" size={20} color={theme.primary} />
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

          <TouchableOpacity
            style={[
              styles.submitButton,
              !isFormValid() || loading ? styles.submitButtonDisabled : {},
            ]}
            onPress={handleSubmit}
            disabled={!isFormValid() || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>
                {alertType === "success"
                  ? "Donation Submitted!"
                  : "Submit Donation"}
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>

        <CustomAlert
          visible={alertVisible}
          title={alertTitle}
          message={alertMessage}
          onClose={() => setAlertVisible(false)}
          confirmText="OK"
        />
      </View>
    </AppLayout>
  );
};

export default DonationScreen;
