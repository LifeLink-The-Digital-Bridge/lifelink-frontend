import AppLayout from "@/components/AppLayout";
import { StatusHeader } from "@/components/common/StatusHeader";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { darkTheme, lightTheme } from "../../../constants/styles/authStyles";
import { createUnifiedStyles } from "../../../constants/styles/unifiedStyles";
import { useTheme } from "../../../utils/theme-context";
import { getStatusColor, formatStatusDisplay } from "../../../utils/statusHelpers";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { InfoRow } from "../../../components/match/InfoRow";

interface DonationDTO {
  id: string;
  donorId: string;
  donationType: string;
  donationDate: string;
  status: string;
  bloodType?: string;
  quantity?: number;
  organType?: string;
  tissueType?: string;
  stemCellType?: string;
  organQuality?: string;
  organViabilityExpiry?: string;
  coldIschemiaTime?: number;
  organPerfused?: boolean;
  organWeight?: number;
  organSize?: string;
  functionalAssessment?: string;
  hasAbnormalities?: boolean;
  abnormalityDescription?: string;
  location?: {
    locationId: string;
    addressLine?: string;
    landmark?: string;
    area?: string;
    city?: string;
    district?: string;
    state?: string;
    country?: string;
    pincode?: string;
    latitude?: number;
    longitude?: number;
  };
}

const DonationDetailsScreen = () => {
  const { colorScheme } = useTheme();
  const { donationData } = useLocalSearchParams();
  const router = useRouter();
  const isDark = colorScheme === "dark";
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const donation: DonationDTO = donationData ? JSON.parse(donationData as string) : null;

  const copyToClipboard = async (id: string, label: string) => {
    try {
      await Clipboard.setStringAsync(id);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
      Alert.alert("Copied", `${label} copied to clipboard`);
    } catch (error) {
      Alert.alert("Error", "Failed to copy to clipboard");
    }
  };

  const renderCopyableRow = (label: string, id: string, isLast: boolean = false) => {
    const isCopied = copiedId === id;
    
    return (
      <View
        style={[
          {
            flexDirection: "row",
            paddingVertical: 12,
            borderBottomWidth: isLast ? 0 : 1,
            borderBottomColor: theme.border,
            alignItems: "center",
          }
        ]}
      >
        <Text style={[styles.text, { flex: 0.4, color: theme.textSecondary }]}>
          {label}
        </Text>
        <View style={{ flex: 0.6, flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }}>
          <Text
            style={[
              styles.text,
              {
                color: theme.text,
                fontWeight: "500",
                marginRight: 8,
                flex: 1,
              }
            ]}
            numberOfLines={1}
          >
            {id}
          </Text>
          <TouchableOpacity
            onPress={() => copyToClipboard(id, label)}
            style={{
              backgroundColor: isCopied ? theme.success + "20" : theme.primary + "20",
              borderRadius: 6,
              padding: 6,
            }}
            activeOpacity={0.7}
          >
            <Feather
              name={isCopied ? "check" : "copy"}
              size={14}
              color={isCopied ? theme.success : theme.primary}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (!donation) {
    return (
      <AppLayout>
        <View style={styles.promptContainer}>
          <Text style={styles.promptTitle}>Donation Not Found</Text>
          <TouchableOpacity style={styles.registerButton} onPress={() => router.back()}>
            <Feather name="arrow-left" size={16} color="#fff" />
            <Text style={styles.registerButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <View style={{ flex: 1 }}>
        <StatusHeader
          title="Donation Details"
          subtitle={donation.id.slice(0, 8)}
          iconName="heart"
          statusText={formatStatusDisplay(donation.status).text}
          statusColor={getStatusColor(donation.status, theme)}
          showBackButton
          onBackPress={() => router.back()}
          theme={theme}
        />

        <ScrollView
          contentContainerStyle={{
            paddingTop: hp("2%"),
            paddingHorizontal: wp("5%"),
            paddingBottom: hp("5%"),
          }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconContainer}>
                <Feather name="info" size={18} color={theme.primary} />
              </View>
              <Text style={styles.sectionTitle}>Basic Information</Text>
            </View>

            <InfoRow label="Donation Type" value={donation.donationType} />
            <InfoRow label="Status" value={donation.status} />
            <InfoRow
              label="Donation Date"
              value={new Date(donation.donationDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            />
            {donation.bloodType && <InfoRow label="Blood Type" value={donation.bloodType} />}
            {donation.quantity && <InfoRow label="Quantity" value={`${donation.quantity} units`} />}
            {donation.organType && <InfoRow label="Organ Type" value={donation.organType} />}
            {donation.tissueType && <InfoRow label="Tissue Type" value={donation.tissueType} />}
            {donation.stemCellType && <InfoRow label="Stem Cell Type" value={donation.stemCellType} isLast />}
          </View>

          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconContainer}>
                <Feather name="hash" size={18} color={theme.primary} />
              </View>
              <Text style={styles.sectionTitle}>Identifiers</Text>
            </View>

            {renderCopyableRow("Donation ID", donation.id)}
            {renderCopyableRow("Donor ID", donation.donorId)}
            {donation.location?.locationId && renderCopyableRow("Location ID", donation.location.locationId, true)}
          </View>

          {donation.location && (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconContainer}>
                  <Feather name="map-pin" size={18} color={theme.primary} />
                </View>
                <Text style={styles.sectionTitle}>Location Details</Text>
              </View>

              {donation.location.addressLine && (
                <InfoRow label="Address" value={donation.location.addressLine} />
              )}
              {donation.location.landmark && (
                <InfoRow label="Landmark" value={donation.location.landmark} />
              )}
              {donation.location.area && <InfoRow label="Area" value={donation.location.area} />}
              {donation.location.city && <InfoRow label="City" value={donation.location.city} />}
              {donation.location.district && (
                <InfoRow label="District" value={donation.location.district} />
              )}
              {donation.location.state && <InfoRow label="State" value={donation.location.state} />}
              {donation.location.country && (
                <InfoRow label="Country" value={donation.location.country} />
              )}
              {donation.location.pincode && (
                <InfoRow label="Pincode" value={donation.location.pincode} />
              )}
              {donation.location.latitude && donation.location.longitude && (
                <InfoRow
                  label="Coordinates"
                  value={`${donation.location.latitude.toFixed(6)}, ${donation.location.longitude.toFixed(6)}`}
                  isLast
                />
              )}
            </View>
          )}

          {donation.organType && (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconContainer}>
                  <Feather name="activity" size={18} color={theme.primary} />
                </View>
                <Text style={styles.sectionTitle}>Organ Details</Text>
              </View>

              {donation.organQuality && (
                <InfoRow label="Organ Quality" value={donation.organQuality} />
              )}
              {donation.organViabilityExpiry && (
                <InfoRow
                  label="Viability Expiry"
                  value={new Date(donation.organViabilityExpiry).toLocaleString()}
                />
              )}
              {donation.coldIschemiaTime && (
                <InfoRow label="Cold Ischemia Time" value={`${donation.coldIschemiaTime} hours`} />
              )}
              {donation.organPerfused !== undefined && (
                <InfoRow label="Organ Perfused" value={donation.organPerfused ? "Yes" : "No"} />
              )}
              {donation.organWeight && (
                <InfoRow label="Organ Weight" value={`${donation.organWeight} grams`} />
              )}
              {donation.organSize && <InfoRow label="Organ Size" value={donation.organSize} />}
              {donation.functionalAssessment && (
                <InfoRow label="Functional Assessment" value={donation.functionalAssessment} />
              )}
              {donation.hasAbnormalities !== undefined && (
                <InfoRow
                  label="Has Abnormalities"
                  value={donation.hasAbnormalities ? "Yes" : "No"}
                  valueColor={donation.hasAbnormalities ? theme.error : theme.success}
                />
              )}
              {donation.abnormalityDescription && (
                <InfoRow
                  label="Abnormality Details"
                  value={donation.abnormalityDescription}
                  isLast
                />
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </AppLayout>
  );
};

export default DonationDetailsScreen;
