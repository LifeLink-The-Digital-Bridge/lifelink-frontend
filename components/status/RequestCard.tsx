import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { canShowCancelButton, getStatusInfo, getUrgencyConfig } from "../../utils/statusHelpers";
import { StatusBadge } from "./StatusBadge";
import { router } from "expo-router/build/exports";

interface ReceiveRequestDTO {
  id: string;
  recipientId: string;
  locationId?: string;
  requestType: string;
  requestedBloodType?: string;
  requestedOrgan?: string;
  requestedTissue?: string;
  requestedStemCellType?: string;
  urgencyLevel: string;
  quantity: number;
  requestDate: string;
  status: string;
  notes?: string;
}

interface RequestCardProps {
  request: ReceiveRequestDTO;
  hasMatch: boolean;
  theme: any;
  styles: any;
  statusStyles: any;
  onPress: () => void;
  onCancelPress: () => void;
}

export const RequestCard: React.FC<RequestCardProps> = ({
  request,
  hasMatch,
  theme,
  styles,
  statusStyles,
  onPress,
  onCancelPress,
}) => {
  const showCancel = canShowCancelButton(request.status);
  const statusInfo = getStatusInfo(request.status);
  const urgencyConfig = getUrgencyConfig(request.urgencyLevel, theme);

  return (
    <TouchableOpacity
      style={[styles.card, { marginBottom: hp("1.5%") }]}
      onPress={() => {
        if (hasMatch) {
          onPress();
        } else {
          router.push({
            pathname: "/navigation/RequestDetailsScreen",
            params: { requestData: JSON.stringify(request) },
          });
        }
      }}
      activeOpacity={0.7}
    >

      <View style={statusStyles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={statusStyles.cardTitle}>{request.requestType}</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: hp("0.5%"),
              gap: wp("1%"),
            }}
          >
            <Feather name={urgencyConfig.icon as any} size={wp("3.5%")} color={urgencyConfig.color} />
            <Text
              style={{
                fontSize: wp("3%"),
                color: urgencyConfig.color,
                fontWeight: "600",
              }}
            >
              {urgencyConfig.text} Priority
            </Text>
          </View>
        </View>
        <StatusBadge status={request.status} theme={theme} />
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
        Date: {new Date(request.requestDate).toLocaleDateString()}
      </Text>

      {request.requestedBloodType && (
        <Text style={statusStyles.cardDetail}>Blood Type: {request.requestedBloodType}</Text>
      )}
      {request.quantity && (
        <Text style={statusStyles.cardDetail}>Quantity: {request.quantity} units</Text>
      )}
      {request.requestedOrgan && (
        <Text style={statusStyles.cardDetail}>Organ: {request.requestedOrgan}</Text>
      )}
      {request.requestedTissue && (
        <Text style={statusStyles.cardDetail}>Tissue: {request.requestedTissue}</Text>
      )}
      {request.requestedStemCellType && (
        <Text style={statusStyles.cardDetail}>Stem Cell: {request.requestedStemCellType}</Text>
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
            Cancel Request
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
