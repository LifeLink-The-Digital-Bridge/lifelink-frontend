import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { canShowCancelButton, getStatusInfo } from "../../utils/statusHelpers";
import { StatusBadge } from "./StatusBadge";
import { router } from "expo-router/build/exports";

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
}

interface DonationCardProps {
  donation: DonationDTO;
  hasMatch: boolean;
  theme: any;
  styles: any;
  statusStyles: any;
  onPress: () => void;
  onCancelPress: () => void;
}

export const DonationCard: React.FC<DonationCardProps> = ({
  donation,
  hasMatch,
  theme,
  styles,
  statusStyles,
  onPress,
  onCancelPress,
}) => {
  const showCancel = canShowCancelButton(donation.status);
  const statusInfo = getStatusInfo(donation.status);

  return (
    <TouchableOpacity
      style={[styles.card, { marginBottom: hp("1.5%") }]}
      onPress={() => {
        if (hasMatch) {
          onPress();
        } else {
          router.push({
            pathname: "/navigation/DonationDetailsScreen",
            params: { donationData: JSON.stringify(donation) },
          });
        }
      }}
      activeOpacity={0.7}
    >
      <View style={statusStyles.cardHeader}>
        <Text style={statusStyles.cardTitle}>{donation.donationType}</Text>
        <StatusBadge status={donation.status} theme={theme} />
      </View>

      <Text
        style={[
          statusStyles.cardSubtitle,
          { color: theme.textSecondary, fontStyle: "italic", marginBottom: hp("0.5%") },
        ]}
      >
        {statusInfo.description}
      </Text>

      <Text style={statusStyles.cardSubtitle}>
        Date: {new Date(donation.donationDate).toLocaleDateString()}
      </Text>

      {donation.bloodType && (
        <Text style={statusStyles.cardDetail}>Blood Type: {donation.bloodType}</Text>
      )}
      {donation.quantity && (
        <Text style={statusStyles.cardDetail}>Quantity: {donation.quantity} units</Text>
      )}
      {donation.organType && (
        <Text style={statusStyles.cardDetail}>Organ: {donation.organType}</Text>
      )}
      {donation.tissueType && (
        <Text style={statusStyles.cardDetail}>Tissue: {donation.tissueType}</Text>
      )}
      {donation.stemCellType && (
        <Text style={statusStyles.cardDetail}>Stem Cell: {donation.stemCellType}</Text>
      )}

      {showCancel && (
        <TouchableOpacity
          style={{
            backgroundColor: theme.error + "15",
            borderWidth: 1,
            borderColor: theme.error + "40",
            paddingVertical: hp("1%"),
            paddingHorizontal: wp("4%"),
            borderRadius: 8,
            marginTop: hp("1.5%"),
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={onCancelPress}
        >
          <Feather name="x-circle" size={wp("4%")} color={theme.error} />
          <Text
            style={{
              color: theme.error,
              fontSize: wp("3.5%"),
              fontWeight: "600",
              marginLeft: wp("2%"),
            }}
          >
            Cancel Donation
          </Text>
        </TouchableOpacity>
      )}

      {hasMatch && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: hp("1.5%"),
            paddingTop: hp("1.5%"),
            borderTopWidth: 1,
            borderTopColor: theme.border + "30",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Feather name="check-circle" size={wp("4%")} color={theme.success} />
            <Text
              style={{
                color: theme.success,
                fontSize: wp("3.5%"),
                fontWeight: "600",
                marginLeft: wp("2%"),
              }}
            >
              Matched
            </Text>
          </View>
          <Feather name="chevron-right" size={wp("5%")} color={theme.primary} />
        </View>
      )}
    </TouchableOpacity>
  );
};
