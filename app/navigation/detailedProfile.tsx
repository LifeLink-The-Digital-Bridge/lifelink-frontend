import React, { useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { useTheme } from "../../utils/theme-context";
import { lightTheme, darkTheme } from "../../constants/styles/authStyles";
import { createUnifiedStyles } from "../../constants/styles/unifiedStyles";
import AppLayout from "@/components/AppLayout";
import { InfoRow } from "../../components/match/InfoRow";
import { StatusHeader } from "@/components/common/StatusHeader";

const HEADER_HEIGHT = 120;

const DetailedProfileScreen = () => {
  const { colorScheme } = useTheme();
  const { userProfile, matchingServiceData, theirDonationOrRequest, userRole } =
    useLocalSearchParams();
  const router = useRouter();
  const isDark = colorScheme === "dark";
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  const lastScrollY = useRef(0);
  const headerTranslateY = useRef(new Animated.Value(0)).current;

  const profile = userProfile ? JSON.parse(userProfile as string) : null;
  const serviceData = matchingServiceData
    ? JSON.parse(matchingServiceData as string)
    : null;
  const theirDetails = theirDonationOrRequest
    ? JSON.parse(theirDonationOrRequest as string)
    : null;
  const role = userRole as string;

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

  const handleBackPress = () => {
    router.back();
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
  const isRecipient = role === "Recipient";

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
            title={`${role} Profile`}
            subtitle="Complete Information"
            iconName={isDonor ? "heart" : "user"}
            showBackButton
            onBackPress={handleBackPress}
            theme={theme}
          />
        </Animated.View>

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: HEADER_HEIGHT + 10 },
          ]}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
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
                    value={serviceData.status || "N/A"}
                    valueColor={
                      serviceData.status === "ACTIVE"
                        ? theme.success
                        : theme.text
                    }
                  />
                  <InfoRow
                    label="Registration Date"
                    value={
                      serviceData.registrationDate
                        ? new Date(
                            serviceData.registrationDate
                          ).toLocaleDateString()
                        : "N/A"
                    }
                    isLast
                  />
                </>
              ) : (
                <>
                  <InfoRow
                    label="Availability"
                    value={serviceData.availability || "N/A"}
                    valueColor={
                      serviceData.availability === "AVAILABLE"
                        ? theme.success
                        : theme.text
                    }
                    isLast
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
                value={
                  serviceData.medicalDetails.hemoglobinLevel
                    ? `${serviceData.medicalDetails.hemoglobinLevel} g/dL`
                    : "N/A"
                }
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
                    value={
                      serviceData.medicalDetails.hasDiseases ? "Yes" : "No"
                    }
                  />
                  <InfoRow
                    label="Taking Medication"
                    value={
                      serviceData.medicalDetails.takingMedication ? "Yes" : "No"
                    }
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
                    value={
                      serviceData.medicalDetails.currentMedications || "N/A"
                    }
                  />
                </>
              )}

              <InfoRow
                label="Creatinine Level"
                value={
                  serviceData.medicalDetails.creatinineLevel?.toString() ||
                  "N/A"
                }
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
                value={
                  serviceData.medicalDetails.pulmonaryFunction?.toString() ||
                  "N/A"
                }
                isLast
              />
            </View>
          )}

          {serviceData?.eligibilityCriteria && (
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
                value={serviceData.eligibilityCriteria.age?.toString() || "N/A"}
              />
              <InfoRow
                label="Date of Birth"
                value={
                  serviceData.eligibilityCriteria.dob
                    ? new Date(
                        serviceData.eligibilityCriteria.dob
                      ).toLocaleDateString()
                    : "N/A"
                }
              />
              <InfoRow
                label="Weight"
                value={
                  serviceData.eligibilityCriteria.weight
                    ? `${serviceData.eligibilityCriteria.weight} kg`
                    : "N/A"
                }
              />
              <InfoRow
                label="Height"
                value={
                  serviceData.eligibilityCriteria.height
                    ? `${serviceData.eligibilityCriteria.height} cm`
                    : "N/A"
                }
              />
              <InfoRow
                label="BMI"
                value={
                  serviceData.eligibilityCriteria.bodyMassIndex?.toString() ||
                  "N/A"
                }
              />
              <InfoRow
                label="Body Size"
                value={serviceData.eligibilityCriteria.bodySize || "N/A"}
              />

              {isDonor ? (
                <>
                  <InfoRow
                    label="Medical Clearance"
                    value={
                      serviceData.eligibilityCriteria.medicalClearance
                        ? "✓ Cleared"
                        : "⚠ Not Cleared"
                    }
                    valueColor={
                      serviceData.eligibilityCriteria.medicalClearance
                        ? theme.success
                        : theme.error
                    }
                  />
                  <InfoRow
                    label="Recent Tattoo/Piercing"
                    value={
                      serviceData.eligibilityCriteria.recentTattooOrPiercing
                        ? "Yes"
                        : "No"
                    }
                  />
                  <InfoRow
                    label="Recent Travel"
                    value={
                      serviceData.eligibilityCriteria.recentTravelDetails ||
                      "None"
                    }
                  />
                  <InfoRow
                    label="Chronic Diseases"
                    value={
                      serviceData.eligibilityCriteria.chronicDiseases || "None"
                    }
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
                    value={
                      serviceData.eligibilityCriteria.ageEligible ? "Yes" : "No"
                    }
                  />
                  <InfoRow
                    label="Weight Eligible"
                    value={
                      serviceData.eligibilityCriteria.weightEligible
                        ? "Yes"
                        : "No"
                    }
                  />
                  <InfoRow
                    label="Medically Eligible"
                    value={
                      serviceData.eligibilityCriteria.medicallyEligible
                        ? "✓ Eligible"
                        : "⚠ Not Eligible"
                    }
                    valueColor={
                      serviceData.eligibilityCriteria.medicallyEligible
                        ? theme.success
                        : theme.error
                    }
                  />
                  <InfoRow
                    label="Legal Clearance"
                    value={
                      serviceData.eligibilityCriteria.legalClearance
                        ? "Yes"
                        : "No"
                    }
                  />
                </>
              )}

              <InfoRow
                label="Living Donor"
                value={
                  serviceData.eligibilityCriteria.isLivingDonor ? "Yes" : "No"
                }
                isLast
              />
            </View>
          )}

          {serviceData?.hlaProfile && (
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
                value={`${serviceData.hlaProfile.hlaA1 || "N/A"}, ${
                  serviceData.hlaProfile.hlaA2 || "N/A"
                }`}
              />
              <InfoRow
                label="HLA-B"
                value={`${serviceData.hlaProfile.hlaB1 || "N/A"}, ${
                  serviceData.hlaProfile.hlaB2 || "N/A"
                }`}
              />
              <InfoRow
                label="HLA-C"
                value={`${serviceData.hlaProfile.hlaC1 || "N/A"}, ${
                  serviceData.hlaProfile.hlaC2 || "N/A"
                }`}
              />
              <InfoRow
                label="HLA-DP"
                value={`${serviceData.hlaProfile.hlaDP1 || "N/A"}, ${
                  serviceData.hlaProfile.hlaDP2 || "N/A"
                }`}
              />
              <InfoRow
                label="Testing Date"
                value={
                  serviceData.hlaProfile.testingDate
                    ? new Date(
                        serviceData.hlaProfile.testingDate
                      ).toLocaleDateString()
                    : "N/A"
                }
              />
              <InfoRow
                label="Laboratory"
                value={serviceData.hlaProfile.laboratoryName || "N/A"}
              />
              <InfoRow
                label="Certification"
                value={serviceData.hlaProfile.certificationNumber || "N/A"}
              />
              <InfoRow
                label="High Resolution"
                value={serviceData.hlaProfile.isHighResolution ? "Yes" : "No"}
                isLast
              />
            </View>
          )}

          {theirDetails && (
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

              {isDonor && (
                <>
                  <InfoRow
                    label="Donation Type"
                    value={theirDetails.donationType || "N/A"}
                  />
                  <InfoRow
                    label="Blood Type"
                    value={theirDetails.bloodType || "N/A"}
                  />
                  {theirDetails.organType && (
                    <InfoRow
                      label="Organ Type"
                      value={theirDetails.organType}
                    />
                  )}
                  <InfoRow
                    label="Quantity"
                    value={
                      theirDetails.quantity
                        ? `${theirDetails.quantity} units`
                        : "N/A"
                    }
                  />
                  <InfoRow
                    label="Status"
                    value={theirDetails.status || "N/A"}
                  />
                  <InfoRow
                    label="Donation Date"
                    value={
                      theirDetails.donationDate
                        ? new Date(
                            theirDetails.donationDate
                          ).toLocaleDateString()
                        : "N/A"
                    }
                    isLast
                  />
                </>
              )}

              {isRecipient && (
                <>
                  <InfoRow
                    label="Request Type"
                    value={theirDetails.requestType || "N/A"}
                  />
                  <InfoRow
                    label="Blood Type Needed"
                    value={theirDetails.requestedBloodType || "N/A"}
                  />
                  {theirDetails.requestedOrgan && (
                    <InfoRow
                      label="Organ Needed"
                      value={theirDetails.requestedOrgan}
                    />
                  )}
                  {theirDetails.requestedTissue && (
                    <InfoRow
                      label="Tissue Needed"
                      value={theirDetails.requestedTissue}
                    />
                  )}
                  {theirDetails.requestedStemCellType && (
                    <InfoRow
                      label="Stem Cell Type Needed"
                      value={theirDetails.requestedStemCellType}
                    />
                  )}
                  <InfoRow
                    label="Urgency Level"
                    value={theirDetails.urgencyLevel || "N/A"}
                    valueColor={
                      theirDetails.urgencyLevel === "CRITICAL"
                        ? theme.error
                        : theirDetails.urgencyLevel === "HIGH"
                        ? "#FF6B35"
                        : theirDetails.urgencyLevel === "MEDIUM"
                        ? "#FFA500"
                        : theme.success
                    }
                  />
                  <InfoRow
                    label="Quantity Needed"
                    value={theirDetails.quantity?.toString() || "N/A"}
                  />
                  <InfoRow
                    label="Status"
                    value={theirDetails.status || "N/A"}
                  />
                  <InfoRow
                    label="Request Date"
                    value={
                      theirDetails.requestDate
                        ? new Date(
                            theirDetails.requestDate
                          ).toLocaleDateString()
                        : "N/A"
                    }
                  />
                  {theirDetails.notes && (
                    <InfoRow label="Notes" value={theirDetails.notes} isLast />
                  )}
                </>
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
                  <InfoRow label="Area" value={location.area || "N/A"} />
                  <InfoRow label="City" value={location.city || "N/A"} />
                  <InfoRow label="State" value={location.state || "N/A"} />
                  <InfoRow label="Country" value={location.country || "N/A"} />
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
