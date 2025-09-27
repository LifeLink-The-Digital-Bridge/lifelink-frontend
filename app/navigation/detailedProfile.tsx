import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { useTheme } from "../../utils/theme-context";
import { lightTheme, darkTheme } from "../../constants/styles/authStyles";
import { createUnifiedStyles } from "../../constants/styles/unifiedStyles";
import AppLayout from "@/components/AppLayout";
import { InfoRow } from "../../components/match/InfoRow";

const DetailedProfileScreen = () => {
  const { colorScheme } = useTheme();
  const { userProfile, matchingServiceData, matchData, userRole } = useLocalSearchParams();
  const router = useRouter();
  const isDark = colorScheme === "dark";
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  const profile = userProfile ? JSON.parse(userProfile as string) : null;
  const serviceData = matchingServiceData ? JSON.parse(matchingServiceData as string) : null;
  const matchDetails = matchData ? JSON.parse(matchData as string) : null;
  const role = userRole as string;

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
            <Text style={styles.headerTitle}>{role} Profile</Text>
            <Text style={styles.headerSubtitle}>Complete Information</Text>
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
            {profile.gender && <InfoRow label="Gender" value={profile.gender} isLast />}
          </View>

          {serviceData && (
            <View style={[styles.sectionContainer, { paddingHorizontal: 24 }]}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconContainer}>
                  <Feather name="info" size={18} color={theme.primary} />
                </View>
                <Text style={styles.sectionTitle}>
                  {isDonor ? "Donor Status" : "Recipient Status"}
                </Text>
              </View>

              {isDonor ? (
                <>
                  <InfoRow 
                    label="Status" 
                    value={serviceData.status || 'N/A'}
                    valueColor={serviceData.status === 'ACTIVE' ? theme.success : theme.text}
                  />
                  <InfoRow 
                    label="Registration Date" 
                    value={serviceData.registrationDate ? 
                      new Date(serviceData.registrationDate).toLocaleDateString() : 'N/A'
                    }
                    isLast
                  />
                </>
              ) : (
                <>
                  <InfoRow 
                    label="Availability" 
                    value={serviceData.availability || 'N/A'}
                    valueColor={serviceData.availability === 'AVAILABLE' ? theme.success : theme.text}
                  />
                </>
              )}
            </View>
          )}

          {serviceData?.medicalDetails && (
            <View style={[styles.sectionContainer, { paddingHorizontal: 24 }]}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconContainer}>
                  <Feather name="activity" size={18} color={theme.primary} />
                </View>
                <Text style={styles.sectionTitle}>Medical Details</Text>
              </View>

              <InfoRow
                label="Hemoglobin Level"
                value={serviceData.medicalDetails.hemoglobinLevel ? 
                  `${serviceData.medicalDetails.hemoglobinLevel} g/dL` : "N/A"}
              />
              <InfoRow
                label="Blood Pressure"
                value={serviceData.medicalDetails.bloodPressure || "N/A"}
              />
              <InfoRow
                label="Overall Health Status"
                value={serviceData.medicalDetails.overallHealthStatus || "N/A"}
              />

              {isDonor ? (
                <>
                  <InfoRow
                    label="Medical History"
                    value={serviceData.medicalDetails.medicalHistory || "N/A"}
                  />
                  <InfoRow
                    label="Has Diseases"
                    value={serviceData.medicalDetails.hasDiseases ? "Yes" : "No"}
                  />
                  <InfoRow
                    label="Taking Medication"
                    value={serviceData.medicalDetails.takingMedication ? "Yes" : "No"}
                  />
                </>
              ) : (
                <>
                  <InfoRow
                    label="Diagnosis"
                    value={serviceData.medicalDetails.diagnosis || "N/A"}
                  />
                  <InfoRow
                    label="Allergies"
                    value={serviceData.medicalDetails.allergies || "N/A"}
                  />
                  <InfoRow
                    label="Current Medications"
                    value={serviceData.medicalDetails.currentMedications || "N/A"}
                  />
                </>
              )}

              <InfoRow
                label="Creatinine Level"
                value={serviceData.medicalDetails.creatinineLevel?.toString() || "N/A"}
              />
              <InfoRow
                label="Liver Function Tests"
                value={serviceData.medicalDetails.liverFunctionTests || "N/A"}
              />
              <InfoRow
                label="Cardiac Status"
                value={serviceData.medicalDetails.cardiacStatus || "N/A"}
              />
              <InfoRow
                label="Pulmonary Function"
                value={serviceData.medicalDetails.pulmonaryFunction?.toString() || "N/A"}
                isLast
              />
            </View>
          )}

          {serviceData?.eligibilityCriteria && (
            <View style={[styles.sectionContainer, { paddingHorizontal: 24 }]}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconContainer}>
                  <Feather name="check-circle" size={18} color={theme.primary} />
                </View>
                <Text style={styles.sectionTitle}>Eligibility & Physical Info</Text>
              </View>

              <InfoRow
                label="Age"
                value={serviceData.eligibilityCriteria.age?.toString() || "N/A"}
              />
              <InfoRow
                label="Date of Birth"
                value={serviceData.eligibilityCriteria.dob ? 
                  new Date(serviceData.eligibilityCriteria.dob).toLocaleDateString() : "N/A"}
              />
              <InfoRow
                label="Weight"
                value={serviceData.eligibilityCriteria.weight ? 
                  `${serviceData.eligibilityCriteria.weight} kg` : "N/A"}
              />
              <InfoRow
                label="Height"
                value={serviceData.eligibilityCriteria.height ? 
                  `${serviceData.eligibilityCriteria.height} cm` : "N/A"}
              />
              <InfoRow
                label="BMI"
                value={serviceData.eligibilityCriteria.bodyMassIndex?.toString() || "N/A"}
              />
              <InfoRow
                label="Body Size"
                value={serviceData.eligibilityCriteria.bodySize || "N/A"}
              />

              {isDonor ? (
                <>
                  <InfoRow
                    label="Medical Clearance"
                    value={serviceData.eligibilityCriteria.medicalClearance ? 
                      "✓ Cleared" : "⚠ Not Cleared"}
                    valueColor={serviceData.eligibilityCriteria.medicalClearance ? 
                      theme.success : theme.error}
                  />
                  <InfoRow
                    label="Recent Tattoo/Piercing"
                    value={serviceData.eligibilityCriteria.recentTattooOrPiercing ? "Yes" : "No"}
                  />
                  <InfoRow
                    label="Recent Travel"
                    value={serviceData.eligibilityCriteria.recentTravelDetails || "None"}
                  />
                  <InfoRow
                    label="Chronic Diseases"
                    value={serviceData.eligibilityCriteria.chronicDiseases || "None"}
                  />
                  <InfoRow
                    label="Allergies"
                    value={serviceData.eligibilityCriteria.allergies || "None"}
                  />
                </>
              ) : (
                <>
                  <InfoRow
                    label="Age Eligible"
                    value={serviceData.eligibilityCriteria.ageEligible ? "Yes" : "No"}
                  />
                  <InfoRow
                    label="Weight Eligible"
                    value={serviceData.eligibilityCriteria.weightEligible ? "Yes" : "No"}
                  />
                  <InfoRow
                    label="Medically Eligible"
                    value={serviceData.eligibilityCriteria.medicallyEligible ? 
                      "✓ Eligible" : "⚠ Not Eligible"}
                    valueColor={serviceData.eligibilityCriteria.medicallyEligible ? 
                      theme.success : theme.error}
                  />
                  <InfoRow
                    label="Legal Clearance"
                    value={serviceData.eligibilityCriteria.legalClearance ? "Yes" : "No"}
                  />
                </>
              )}

              <InfoRow
                label="Living Donor"
                value={serviceData.eligibilityCriteria.isLivingDonor ? "Yes" : "No"}
                isLast
              />
            </View>
          )}

          {serviceData?.hlaProfiles && serviceData.hlaProfiles.length > 0 && (
            <View style={[styles.sectionContainer, { paddingHorizontal: 24 }]}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconContainer}>
                  <Feather name="layers" size={18} color={theme.primary} />
                </View>
                <Text style={styles.sectionTitle}>HLA Compatibility Profile</Text>
              </View>

              {serviceData.hlaProfiles.map((hlaProfile: any, index: number) => (
                <View key={index}>
                  <InfoRow
                    label="HLA-A"
                    value={`${hlaProfile.hlaA1 || "N/A"}, ${hlaProfile.hlaA2 || "N/A"}`}
                  />
                  <InfoRow
                    label="HLA-B"
                    value={`${hlaProfile.hlaB1 || "N/A"}, ${hlaProfile.hlaB2 || "N/A"}`}
                  />
                  <InfoRow
                    label="HLA-C"
                    value={`${hlaProfile.hlaC1 || "N/A"}, ${hlaProfile.hlaC2 || "N/A"}`}
                  />
                  <InfoRow
                    label="HLA-DP"
                    value={`${hlaProfile.hlaDP1 || "N/A"}, ${hlaProfile.hlaDP2 || "N/A"}`}
                  />
                  <InfoRow
                    label="Testing Date"
                    value={hlaProfile.testingDate ? 
                      new Date(hlaProfile.testingDate).toLocaleDateString() : "N/A"}
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
                    isLast={index === serviceData.hlaProfiles.length - 1}
                  />
                </View>
              ))}
            </View>
          )}

          {matchDetails?.data && (
            <View style={[styles.sectionContainer, { paddingHorizontal: 24 }]}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconContainer}>
                  <Feather
                    name={isDonor ? "clipboard" : "heart"}
                    size={18}
                    color={theme.primary}
                  />
                </View>
                <Text style={styles.sectionTitle}>
                  {isDonor ? "Request Details" : "Donation Details"}
                </Text>
              </View>

              {isDonor && matchDetails.type === "request" ? (
                <>
                  <InfoRow
                    label="Request Type"
                    value={matchDetails.data.requestType || "N/A"}
                  />
                  <InfoRow
                    label="Blood Type Needed"
                    value={matchDetails.data.requestedBloodType || "N/A"}
                  />
                  {matchDetails.data.requestedOrgan && (
                    <InfoRow
                      label="Organ Needed"
                      value={matchDetails.data.requestedOrgan}
                    />
                  )}
                  <InfoRow
                    label="Urgency Level"
                    value={matchDetails.data.urgencyLevel || "N/A"}
                    valueColor={
                      matchDetails.data.urgencyLevel === "CRITICAL" ? theme.error :
                      matchDetails.data.urgencyLevel === "HIGH" ? "#FF6B35" :
                      matchDetails.data.urgencyLevel === "MEDIUM" ? "#FFA500" : theme.success
                    }
                  />
                  <InfoRow
                    label="Quantity Needed"
                    value={matchDetails.data.quantity?.toString() || "N/A"}
                  />
                  <InfoRow
                    label="Status"
                    value={matchDetails.data.status || "N/A"}
                  />
                  <InfoRow
                    label="Request Date"
                    value={matchDetails.data.requestDate ? 
                      new Date(matchDetails.data.requestDate).toLocaleDateString() : "N/A"}
                  />
                  {matchDetails.data.notes && (
                    <InfoRow label="Notes" value={matchDetails.data.notes} />
                  )}
                </>
              ) : (
                matchDetails.type === "donation" && (
                  <>
                    <InfoRow
                      label="Donation Type"
                      value={matchDetails.data.donationType || "N/A"}
                    />
                    <InfoRow
                      label="Blood Type"
                      value={matchDetails.data.bloodType || "N/A"}
                    />
                    <InfoRow
                      label="Quantity"
                      value={matchDetails.data.quantity ? 
                        `${matchDetails.data.quantity} units` : "N/A"}
                    />
                    <InfoRow
                      label="Status"
                      value={matchDetails.data.status || "N/A"}
                    />
                    <InfoRow
                      label="Donation Date"
                      value={matchDetails.data.donationDate ? 
                        new Date(matchDetails.data.donationDate).toLocaleDateString() : "N/A"}
                      isLast
                    />
                  </>
                )
              )}
            </View>
          )}

          {serviceData?.locations && serviceData.locations.length > 0 && (
            <View style={[styles.sectionContainer, { paddingHorizontal: 24 }]}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconContainer}>
                  <Feather name="map-pin" size={18} color={theme.primary} />
                </View>
                <Text style={styles.sectionTitle}>Location Information</Text>
              </View>

              {serviceData.locations.map((location: any, index: number) => (
                <View key={index}>
                  <InfoRow
                    label="Address"
                    value={location.addressLine || "N/A"}
                  />
                  <InfoRow
                    label="Landmark"
                    value={location.landmark || "N/A"}
                  />
                  <InfoRow
                    label="Area"
                    value={location.area || "N/A"}
                  />
                  <InfoRow
                    label="City"
                    value={location.city || "N/A"}
                  />
                  <InfoRow
                    label="State"
                    value={location.state || "N/A"}
                  />
                  <InfoRow
                    label="Country"
                    value={location.country || "N/A"}
                  />
                  <InfoRow
                    label="Pincode"
                    value={location.pincode || "N/A"}
                    isLast={index === serviceData.locations.length - 1}
                  />
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </AppLayout>
  );
};

export default DetailedProfileScreen;
