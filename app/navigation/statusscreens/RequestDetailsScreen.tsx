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
import { getStatusColor, formatStatusDisplay, getUrgencyConfig } from "../../../utils/statusHelpers";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { InfoRow } from "../../../components/match/InfoRow";

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

const RequestDetailsScreen = () => {
  const { colorScheme } = useTheme();
  const { requestData } = useLocalSearchParams();
  const router = useRouter();
  const isDark = colorScheme === "dark";
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const request: ReceiveRequestDTO = requestData ? JSON.parse(requestData as string) : null;

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

  if (!request) {
    return (
      <AppLayout>
        <View style={styles.promptContainer}>
          <Text style={styles.promptTitle}>Request Not Found</Text>
          <TouchableOpacity style={styles.registerButton} onPress={() => router.back()}>
            <Feather name="arrow-left" size={16} color="#fff" />
            <Text style={styles.registerButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </AppLayout>
    );
  }

  const urgencyConfig = getUrgencyConfig(request.urgencyLevel, theme);

  return (
    <AppLayout>
      <View style={{ flex: 1 }}>
        <StatusHeader
          title="Request Details"
          subtitle={request.id.slice(0, 8)}
          iconName="clipboard"
          statusText={formatStatusDisplay(request.status).text}
          statusColor={getStatusColor(request.status, theme)}
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

            <InfoRow label="Request Type" value={request.requestType} />
            <InfoRow label="Status" value={request.status} />
            <InfoRow
              label="Urgency Level"
              value={urgencyConfig.text + " Priority"}
              valueColor={urgencyConfig.color}
            />
            <InfoRow
              label="Request Date"
              value={new Date(request.requestDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            />
            {request.requestedBloodType && (
              <InfoRow label="Blood Type Needed" value={request.requestedBloodType} />
            )}
            {request.quantity && <InfoRow label="Quantity Needed" value={`${request.quantity} units`} />}
            {request.requestedOrgan && <InfoRow label="Organ Needed" value={request.requestedOrgan} />}
            {request.requestedTissue && <InfoRow label="Tissue Needed" value={request.requestedTissue} />}
            {request.requestedStemCellType && (
              <InfoRow label="Stem Cell Type Needed" value={request.requestedStemCellType} />
            )}
            {request.notes && <InfoRow label="Notes" value={request.notes} isLast />}
          </View>

          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconContainer}>
                <Feather name="hash" size={18} color={theme.primary} />
              </View>
              <Text style={styles.sectionTitle}>Identifiers</Text>
            </View>

            {renderCopyableRow("Request ID", request.id)}
            {renderCopyableRow("Recipient ID", request.recipientId)}
            {request.locationId && renderCopyableRow("Location ID", request.locationId, true)}
          </View>

          {request.location && (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconContainer}>
                  <Feather name="map-pin" size={18} color={theme.primary} />
                </View>
                <Text style={styles.sectionTitle}>Location Details</Text>
              </View>

              {request.location.addressLine && (
                <InfoRow label="Address" value={request.location.addressLine} />
              )}
              {request.location.landmark && (
                <InfoRow label="Landmark" value={request.location.landmark} />
              )}
              {request.location.area && <InfoRow label="Area" value={request.location.area} />}
              {request.location.city && <InfoRow label="City" value={request.location.city} />}
              {request.location.district && (
                <InfoRow label="District" value={request.location.district} />
              )}
              {request.location.state && <InfoRow label="State" value={request.location.state} />}
              {request.location.country && (
                <InfoRow label="Country" value={request.location.country} />
              )}
              {request.location.pincode && (
                <InfoRow label="Pincode" value={request.location.pincode} />
              )}
              {request.location.latitude && request.location.longitude && (
                <InfoRow
                  label="Coordinates"
                  value={`${request.location.latitude.toFixed(6)}, ${request.location.longitude.toFixed(6)}`}
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

export default RequestDetailsScreen;
