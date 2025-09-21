import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { useTheme } from "../../utils/theme-context";
import { lightTheme, darkTheme } from "../../constants/styles/authStyles";
import { createUnifiedStyles } from "../../constants/styles/unifiedStyles";
import AppLayout from "@/components/AppLayout";
import { InfoRow } from "../../components/match/InfoRow";
import { LocationDetails } from "../../components/match/LocationDetails";

const DetailedProfileScreen = () => {
  const { colorScheme } = useTheme();
  const { userProfile, historicalData, matchData, userRole, isHistorical } =
    useLocalSearchParams();
  const router = useRouter();
  const isDark = colorScheme === "dark";
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  const profile = userProfile ? JSON.parse(userProfile as string) : null;
  const historyData = historicalData
    ? JSON.parse(historicalData as string)
    : null;
  const matchDetails = matchData ? JSON.parse(matchData as string) : null;
  const role = userRole as string;
  const isHistoricalView = isHistorical === "true";

  const formatArrayDate = (dateArray: number[]) => {
    if (!Array.isArray(dateArray) || dateArray.length < 3) return "N/A";
    const [year, month, day] = dateArray;
    return new Date(year, month - 1, day).toLocaleDateString();
  };

  if (!profile) {
    return (
      <AppLayout>
        <View style={styles.promptContainer}>
          <Text style={styles.promptTitle}>Profile Not Found</Text>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={16} color="#fff" />
            <Text style={styles.registerButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </AppLayout>
    );
  }

  const isDonor = role === "Donor";

  let medicalDetails,
    eligibilityCriteria,
    hlaProfile,
    donationData,
    requestData,
    locationData;

  console.log("DEBUG - DetailedProfile Raw data:", {
    historyData,
    isHistoricalView,
    hasHistoryData: !!historyData,
    historyDataKeys: historyData ? Object.keys(historyData) : [],
    isMatchSpecific: historyData?.matchSpecific,
    isDonor,
    role,
  });

  if (isHistoricalView && historyData) {
    medicalDetails = historyData.medicalDetailsSnapshot;
    eligibilityCriteria = historyData.eligibilityCriteriaSnapshot;
    hlaProfile = historyData.hlaProfileSnapshot;

    if (isDonor) {
      donationData = historyData.donationSnapshot;
      locationData = donationData;
    } else {
      requestData = historyData.receiveRequestSnapshot;
      locationData = requestData;
    }

    console.log("DEBUG - Historical data extracted:", {
      hasMedicalDetails: !!medicalDetails,
      hasEligibilityCriteria: !!eligibilityCriteria,
      hasHlaProfile: !!hlaProfile,
      hasDonationData: !!donationData,
      hasRequestData: !!requestData,
      requestDataType: requestData?.requestType,
      requestDataTissue: requestData?.requestedTissue,
    });
  } else if (historyData && !isHistoricalView) {
    medicalDetails = historyData.medicalDetails;
    eligibilityCriteria = historyData.eligibilityCriteria;
    hlaProfile = historyData.hlaProfile;

    if (isDonor) {
      donationData = matchDetails;
      locationData = matchDetails;
    } else {
      requestData = matchDetails;
      locationData = matchDetails;
    }

    console.log("DEBUG - Live data extracted:", {
      hasMedicalDetails: !!medicalDetails,
      hasEligibilityCriteria: !!eligibilityCriteria,
      hasHlaProfile: !!hlaProfile,
      hasDonationData: !!donationData,
      hasRequestData: !!requestData,
    });
  }

  console.log("DEBUG - Final data extraction result:", {
    isHistoricalView,
    isDonor,
    hasMedicalDetails: !!medicalDetails,
    hasEligibilityCriteria: !!eligibilityCriteria,
    hasHlaProfile: !!hlaProfile,
    hasDonationData: !!donationData,
    hasRequestData: !!requestData,
    hasLocationData: !!locationData,
    requestDataType: requestData?.requestType,
    requestDataTissue: requestData?.requestedTissue,
    requestDataUrgency: requestData?.urgencyLevel,
    locationDataKeys: locationData ? Object.keys(locationData) : [],
  });

  return (
    <AppLayout>
      <View style={styles.container}>
        <View style={[styles.headerContainer, { paddingHorizontal: 24 }]}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Feather name="arrow-left" size={20} color={theme.text} />
          </TouchableOpacity>
          <View style={styles.headerIconContainer}>
            <Feather
              name={isDonor ? "heart" : "user"}
              size={28}
              color={theme.primary}
            />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Complete {role} Profile</Text>
            <Text style={styles.headerSubtitle}>
              {isHistoricalView ? "At Time of Match" : "Current Data"}
            </Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.sectionContainer, { paddingHorizontal: 24 }]}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconContainer}>
                <FontAwesome name="user" size={18} color={theme.primary} />
              </View>
              <Text style={styles.sectionTitle}>Personal Information</Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              {profile.profileImageUrl ? (
                <Image
                  source={{ uri: profile.profileImageUrl }}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    marginRight: 16,
                  }}
                />
              ) : (
                <View
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: theme.primary + "20",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 16,
                  }}
                >
                  <FontAwesome name="user" size={32} color={theme.primary} />
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={[styles.headerTitle, { fontSize: 22 }]}>
                  {profile.name}
                </Text>
                <Text style={[styles.headerSubtitle, { fontSize: 16 }]}>
                  @{profile.username}
                </Text>
              </View>
            </View>

            <InfoRow label="Email" value={profile.email} />
            {profile.phone && <InfoRow label="Phone" value={profile.phone} />}
            {profile.gender && (
              <InfoRow label="Gender" value={profile.gender} isLast />
            )}
          </View>

          {medicalDetails && (
            <View style={[styles.sectionContainer, { paddingHorizontal: 24 }]}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconContainer}>
                  <Feather name="activity" size={18} color={theme.primary} />
                </View>
                <Text style={styles.sectionTitle}>Medical Details</Text>
              </View>

              <InfoRow
                label="Hemoglobin Level"
                value={medicalDetails.hemoglobinLevel?.toString() || "N/A"}
              />
              <InfoRow
                label="Blood Pressure"
                value={medicalDetails.bloodPressure || "N/A"}
              />
              <InfoRow
                label="Overall Health Status"
                value={medicalDetails.overallHealthStatus || "N/A"}
              />

              {isDonor ? (
                <>
                  <InfoRow
                    label="Last Medical Checkup"
                    value={
                      medicalDetails.lastMedicalCheckup
                        ? Array.isArray(medicalDetails.lastMedicalCheckup)
                          ? formatArrayDate(medicalDetails.lastMedicalCheckup)
                          : new Date(
                              medicalDetails.lastMedicalCheckup
                            ).toLocaleDateString()
                        : "N/A"
                    }
                  />
                  <InfoRow
                    label="Medical History"
                    value={medicalDetails.medicalHistory || "N/A"}
                  />
                  <InfoRow
                    label="Has Diseases"
                    value={medicalDetails.hasDiseases ? "Yes" : "No"}
                  />
                  <InfoRow
                    label="Taking Medication"
                    value={medicalDetails.takingMedication ? "Yes" : "No"}
                  />
                </>
              ) : (
                <>
                  <InfoRow
                    label="Diagnosis"
                    value={medicalDetails.diagnosis || "N/A"}
                  />
                  <InfoRow
                    label="Allergies"
                    value={medicalDetails.allergies || "N/A"}
                  />
                  <InfoRow
                    label="Current Medications"
                    value={medicalDetails.currentMedications || "N/A"}
                  />
                  {medicalDetails.additionalNotes && (
                    <InfoRow
                      label="Additional Notes"
                      value={medicalDetails.additionalNotes}
                    />
                  )}
                </>
              )}

              <InfoRow
                label="Creatinine Level"
                value={medicalDetails.creatinineLevel?.toString() || "N/A"}
              />
              <InfoRow
                label="Liver Function Tests"
                value={medicalDetails.liverFunctionTests || "N/A"}
              />
              <InfoRow
                label="Cardiac Status"
                value={medicalDetails.cardiacStatus || "N/A"}
              />
              <InfoRow
                label="Pulmonary Function"
                value={medicalDetails.pulmonaryFunction?.toString() || "N/A"}
                isLast
              />
            </View>
          )}

          {eligibilityCriteria && (
            <View style={[styles.sectionContainer, { paddingHorizontal: 24 }]}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconContainer}>
                  <Feather
                    name="check-circle"
                    size={18}
                    color={theme.primary}
                  />
                </View>
                <Text style={styles.sectionTitle}>
                  Eligibility & Physical Info
                </Text>
              </View>

              <InfoRow
                label="Age"
                value={eligibilityCriteria.age?.toString() || "N/A"}
              />
              <InfoRow
                label="Date of Birth"
                value={
                  Array.isArray(eligibilityCriteria.dob)
                    ? formatArrayDate(eligibilityCriteria.dob)
                    : eligibilityCriteria.dob || "N/A"
                }
              />
              <InfoRow
                label="Weight"
                value={
                  eligibilityCriteria.weight
                    ? `${eligibilityCriteria.weight} kg`
                    : "N/A"
                }
              />
              <InfoRow
                label="Height"
                value={
                  eligibilityCriteria.height
                    ? `${eligibilityCriteria.height} cm`
                    : "N/A"
                }
              />
              <InfoRow
                label="BMI"
                value={eligibilityCriteria.bodyMassIndex?.toString() || "N/A"}
              />
              <InfoRow
                label="Body Size"
                value={eligibilityCriteria.bodySize || "N/A"}
              />

              <InfoRow
                label={isDonor ? "Medical Clearance" : "Medical Eligibility"}
                value={
                  isDonor
                    ? eligibilityCriteria.medicalClearance
                      ? "✓ Cleared"
                      : "⚠ Not Cleared"
                    : eligibilityCriteria.medicallyEligible
                    ? "✓ Eligible"
                    : "⚠ Not Eligible"
                }
                valueColor={
                  (
                    isDonor
                      ? eligibilityCriteria.medicalClearance
                      : eligibilityCriteria.medicallyEligible
                  )
                    ? theme.success
                    : theme.error
                }
              />

              {isDonor && (
                <>
                  <InfoRow
                    label="Recent Tattoo/Piercing"
                    value={
                      eligibilityCriteria.recentTattooOrPiercing ? "Yes" : "No"
                    }
                  />
                  <InfoRow
                    label="Recent Travel"
                    value={eligibilityCriteria.recentTravelDetails || "None"}
                  />
                  <InfoRow
                    label="Chronic Diseases"
                    value={eligibilityCriteria.chronicDiseases || "None"}
                  />
                  <InfoRow
                    label="Allergies"
                    value={eligibilityCriteria.allergies || "None"}
                  />
                </>
              )}

              <InfoRow
                label="Living Donor"
                value={eligibilityCriteria.isLivingDonor ? "Yes" : "No"}
                isLast
              />
            </View>
          )}

          {hlaProfile && (
            <View style={[styles.sectionContainer, { paddingHorizontal: 24 }]}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconContainer}>
                  <Feather name="layers" size={18} color={theme.primary} />
                </View>
                <Text style={styles.sectionTitle}>
                  HLA Compatibility Profile
                </Text>
              </View>

              <InfoRow
                label="HLA-A"
                value={`${hlaProfile.hlaA1 || "N/A"}, ${
                  hlaProfile.hlaA2 || "N/A"
                }`}
              />
              <InfoRow
                label="HLA-B"
                value={`${hlaProfile.hlaB1 || "N/A"}, ${
                  hlaProfile.hlaB2 || "N/A"
                }`}
              />
              <InfoRow
                label="HLA-C"
                value={`${hlaProfile.hlaC1 || "N/A"}, ${
                  hlaProfile.hlaC2 || "N/A"
                }`}
              />
              <InfoRow
                label="HLA-DP"
                value={`${hlaProfile.hlaDP1 || "N/A"}, ${
                  hlaProfile.hlaDP2 || "N/A"
                }`}
              />

              <InfoRow
                label="Testing Date"
                value={
                  Array.isArray(hlaProfile.testingDate)
                    ? formatArrayDate(hlaProfile.testingDate)
                    : hlaProfile.testingDate || "N/A"
                }
              />
              <InfoRow
                label="Laboratory"
                value={hlaProfile.laboratoryName || "N/A"}
              />
              <InfoRow
                label="Certification"
                value={hlaProfile.certificationNumber || "N/A"}
              />
              <InfoRow
                label="High Resolution"
                value={hlaProfile.isHighResolution ? "Yes" : "No"}
                isLast
              />
            </View>
          )}

          {(donationData || requestData) && (
            <View style={[styles.sectionContainer, { paddingHorizontal: 24 }]}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconContainer}>
                  <Feather
                    name={isDonor ? "heart" : "clipboard"}
                    size={18}
                    color={theme.primary}
                  />
                </View>
                <Text style={styles.sectionTitle}>
                  {isDonor ? "Donation Details" : "Request Details"}
                </Text>
              </View>

              {isDonor && donationData ? (
                <>
                  <InfoRow
                    label="Donation Type"
                    value={donationData.donationType || "N/A"}
                  />
                  <InfoRow
                    label="Blood Type"
                    value={donationData.bloodType || "N/A"}
                  />
                  {donationData.organType && (
                    <InfoRow
                      label="Organ Type"
                      value={donationData.organType}
                    />
                  )}
                  {donationData.tissueType && (
                    <InfoRow
                      label="Tissue Type"
                      value={donationData.tissueType}
                    />
                  )}
                  {donationData.stemCellType && (
                    <InfoRow
                      label="Stem Cell Type"
                      value={donationData.stemCellType}
                    />
                  )}
                  <InfoRow
                    label="Status"
                    value={donationData.status || "N/A"}
                  />
                  <InfoRow
                    label="Quantity"
                    value={
                      donationData.quantity
                        ? `${donationData.quantity} units`
                        : "N/A"
                    }
                  />
                  {donationData.organQuality && (
                    <InfoRow
                      label="Organ Quality"
                      value={donationData.organQuality}
                    />
                  )}
                  {donationData.organWeight && (
                    <InfoRow
                      label="Organ Weight"
                      value={`${donationData.organWeight}g`}
                    />
                  )}
                  <InfoRow
                    label="Donation Date"
                    value={
                      Array.isArray(donationData.donationDate)
                        ? formatArrayDate(donationData.donationDate)
                        : donationData.donationDate
                        ? new Date(
                            donationData.donationDate
                          ).toLocaleDateString()
                        : "N/A"
                    }
                    isLast
                  />
                </>
              ) : (
                requestData && (
                  <>
                    <InfoRow
                      label="Request Type"
                      value={requestData.requestType || "N/A"}
                    />
                    <InfoRow
                      label="Blood Type Needed"
                      value={requestData.requestedBloodType || "N/A"}
                    />
                    {requestData.requestedOrgan && (
                      <InfoRow
                        label="Organ Needed"
                        value={requestData.requestedOrgan}
                      />
                    )}
                    {requestData.requestedTissue && (
                      <InfoRow
                        label="Tissue Needed"
                        value={requestData.requestedTissue}
                      />
                    )}
                    {requestData.requestedStemCellType && (
                      <InfoRow
                        label="Stem Cell Type Needed"
                        value={requestData.requestedStemCellType}
                      />
                    )}
                    <InfoRow
                      label="Urgency Level"
                      value={requestData.urgencyLevel || "N/A"}
                      valueColor={
                        requestData.urgencyLevel === "CRITICAL"
                          ? theme.error
                          : requestData.urgencyLevel === "HIGH"
                          ? "#FF6B35"
                          : requestData.urgencyLevel === "MEDIUM"
                          ? "#FFA500"
                          : theme.success
                      }
                    />
                    <InfoRow
                      label="Quantity Needed"
                      value={requestData.quantity?.toString() || "N/A"}
                    />
                    <InfoRow
                      label="Request Date"
                      value={
                        requestData.requestDate
                          ? new Date(
                              requestData.requestDate
                            ).toLocaleDateString()
                          : "N/A"
                      }
                    />
                    {requestData.notes && (
                      <InfoRow label="Notes" value={requestData.notes} isLast />
                    )}
                  </>
                )
              )}
            </View>
          )}

          <LocationDetails data={locationData} />
        </ScrollView>
      </View>
    </AppLayout>
  );
};

export default DetailedProfileScreen;
