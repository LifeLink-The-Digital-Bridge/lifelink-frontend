import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  RefreshControl,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useAuth } from "../../utils/auth-context";
import { router } from "expo-router";
import { createUnifiedStyles } from "../../constants/styles/unifiedStyles";
import { createStatusStyles } from "../../constants/styles/statusStyles";
import { useTheme } from "../../utils/theme-context";
import { lightTheme, darkTheme } from "../../constants/styles/authStyles";
import Applayout from "../../components/AppLayout";
import { ValidationAlert } from "../../components/common/ValidationAlert";
import { Feather } from "@expo/vector-icons";
import {
  getMyMatchesAsDonor,
  getMyMatchesAsRecipient,
  MatchResponse,
} from "../api/matchingApi";
import {
  getMyDonations,
  canCancelDonation,
  cancelDonation,
  CancellationRequestDTO as DonationCancellationDTO,
} from "../api/donationApi";
import {
  getMyRequests,
  canCancelRequest,
  cancelRequest,
  CancellationRequestDTO as RequestCancellationDTO,
  ReceiveRequestDTO,
} from "../api/requestApi";
import { StatusHeader } from "@/components/common/StatusHeader";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { DonationCard } from "../../components/status/DonationCard";
import { RequestCard } from "../../components/status/RequestCard";
import { CancellationModal } from "../../components/status/CancellationModal";
import { EmptyState } from "../../components/status/EmptyState";

const HEADER_HEIGHT = 135;

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

type FilterType = "all" | "active" | "completed" | "cancelled";

const StatusScreen = () => {
  const [donations, setDonations] = useState<DonationDTO[]>([]);
  const [requests, setRequests] = useState<ReceiveRequestDTO[]>([]);
  const [donorMatches, setDonorMatches] = useState<MatchResponse[]>([]);
  const [recipientMatches, setRecipientMatches] = useState<MatchResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"donations" | "requests">("donations");
  const [filterType, setFilterType] = useState<FilterType>("all");

  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelAdditionalNotes, setCancelAdditionalNotes] = useState("");
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [selectedItemType, setSelectedItemType] = useState<"donation" | "request">("donation");
  const [cancelling, setCancelling] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error" | "warning" | "info">("info");

  const { isAuthenticated } = useAuth();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);
  const statusStyles = createStatusStyles(theme);

  const lastScrollY = useRef(0);
  const headerTranslateY = useRef(new Animated.Value(0)).current;

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

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/(auth)/loginScreen");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (isRefreshing = false) => {
    if (isRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const rolesString = await SecureStore.getItemAsync("roles");
      const roles: string[] = rolesString ? JSON.parse(rolesString) : [];

      let donationsData: DonationDTO[] = [];
      let requestsData: ReceiveRequestDTO[] = [];
      let donorMatchesData: MatchResponse[] = [];
      let recipientMatchesData: MatchResponse[] = [];

      if (roles.includes("DONOR")) {
        try {
          const [donationsResult, matchesResult] = await Promise.all([
            getMyDonations(),
            getMyMatchesAsDonor(),
          ]);

          donationsData = donationsResult;
          donorMatchesData = matchesResult;

          setDonations(donationsData);
          setDonorMatches(donorMatchesData);
        } catch (error: any) {
          if (error.message === "NOT_REGISTERED_AS_DONOR") {
            console.log("User not registered as donor");
          } else {
            console.error("Failed to fetch donor data:", error);
          }
          setDonations([]);
          setDonorMatches([]);
        }
      }

      if (roles.includes("RECIPIENT")) {
        try {
          const [requestsResult, matchesResult] = await Promise.all([
            getMyRequests(),
            getMyMatchesAsRecipient(),
          ]);

          requestsData = requestsResult;
          recipientMatchesData = matchesResult;

          setRequests(requestsData);
          setRecipientMatches(recipientMatchesData);
        } catch (error: any) {
          if (error.message === "NOT_REGISTERED_AS_RECIPIENT") {
            console.log("User not registered as recipient");
          } else {
            console.error("Failed to fetch recipient data:", error);
          }
          setRequests([]);
          setRecipientMatches([]);
        }
      }

      if (donationsData.length > 0 && requestsData.length === 0) {
        setActiveTab("donations");
      } else if (donationsData.length === 0 && requestsData.length > 0) {
        setActiveTab("requests");
      } else if (donationsData.length > 0) {
        setActiveTab("donations");
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      showAlert("Error", "Failed to load status data", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    fetchData(true);
  };

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

  const isActiveItem = (status: string) => {
    const activeStatuses = ["PENDING", "AVAILABLE", "ACTIVE", "MATCHED", "IN_PROGRESS"];
    return activeStatuses.includes(status);
  };

  const isCompletedItem = (status: string) => {
    return status === "COMPLETED" || status === "FULFILLED";
  };

  const isCancelledItem = (status: string) => {
    const cancelledStatuses = ["CANCELLED_BY_DONOR", "CANCELLED_BY_RECIPIENT", "CANCELLED_DUE_TO_MATCH_FAILURE", "EXPIRED", "WITHDRAWN"];
    return cancelledStatuses.includes(status);
  };

  const getFilteredDonations = () => {
    switch (filterType) {
      case "active":
        return donations.filter((d) => isActiveItem(d.status));
      case "completed":
        return donations.filter((d) => isCompletedItem(d.status));
      case "cancelled":
        return donations.filter((d) => isCancelledItem(d.status));
      default:
        return donations;
    }
  };

  const getFilteredRequests = () => {
    switch (filterType) {
      case "active":
        return requests.filter((r) => isActiveItem(r.status));
      case "completed":
        return requests.filter((r) => isCompletedItem(r.status));
      case "cancelled":
        return requests.filter((r) => isCancelledItem(r.status));
      default:
        return requests;
    }
  };

  const getMatchForDonation = (donationId: string): MatchResponse | undefined => {
    return donorMatches.find((match) => match.donationId === donationId);
  };

  const getMatchForRequest = (requestId: string): MatchResponse | undefined => {
    return recipientMatches.find((match) => match.receiveRequestId === requestId);
  };

  const handleViewMatches = () => {
    router.push("/navigation/MatchResultsScreen");
  };

  const handleDonationPress = (donation: DonationDTO) => {
    const match = getMatchForDonation(donation.id);
    if (match) {
      router.push({
        pathname: "/navigation/MatchDetailsScreen",
        params: { matchData: JSON.stringify(match) },
      });
    }
  };

  const handleRequestPress = (request: ReceiveRequestDTO) => {
    const match = getMatchForRequest(request.id);
    if (match) {
      router.push({
        pathname: "/navigation/MatchDetailsScreen",
        params: { matchData: JSON.stringify(match) },
      });
    }
  };

  const handleCancelPress = async (itemId: string, itemType: "donation" | "request") => {
    try {
      let canCancel = false;

      if (itemType === "donation") {
        canCancel = await canCancelDonation(itemId);
      } else {
        canCancel = await canCancelRequest(itemId);
      }

      if (!canCancel) {
        showAlert(
          "Cannot Cancel",
          itemType === "donation"
            ? "This donation cannot be cancelled. It may already be in progress or completed."
            : "This request cannot be cancelled. It may already be in progress or fulfilled.",
          "warning"
        );
        return;
      }

      setSelectedItemId(itemId);
      setSelectedItemType(itemType);
      setCancelModalVisible(true);
    } catch (error: any) {
      showAlert("Error", error.message || "Failed to check cancellation status", "error");
    }
  };

  const handleConfirmCancel = async () => {
    if (cancelReason.trim().length < 10) {
      showAlert(
        "Invalid Reason",
        "Please provide a reason with at least 10 characters",
        "warning"
      );
      return;
    }

    setCancelling(true);

    try {
      const cancellationData = {
        reason: cancelReason.trim(),
        additionalNotes: cancelAdditionalNotes.trim() || undefined,
      };

      if (selectedItemType === "donation") {
        const response = await cancelDonation(
          selectedItemId,
          cancellationData as DonationCancellationDTO
        );
        showAlert(
          "Donation Cancelled",
          `${response.message}\n\nExpired Matches: ${response.expiredMatchesCount}`,
          "success"
        );
      } else {
        const response = await cancelRequest(
          selectedItemId,
          cancellationData as RequestCancellationDTO
        );
        showAlert(
          "Request Cancelled",
          `${response.message}\n\nExpired Matches: ${response.expiredMatchesCount}`,
          "success"
        );
      }

      setCancelModalVisible(false);
      setCancelReason("");
      setCancelAdditionalNotes("");
      setSelectedItemId("");

      fetchData();
    } catch (error: any) {
      showAlert("Cancellation Failed", error.message || "Failed to cancel", "error");
    } finally {
      setCancelling(false);
    }
  };

  const getTotalMatches = () => {
    return donorMatches.length + recipientMatches.length;
  };

  if (loading) {
    return (
      <Applayout>
        <View style={statusStyles.centerContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={statusStyles.loadingText}>Loading status...</Text>
        </View>
      </Applayout>
    );
  }

  const filteredDonations = getFilteredDonations();
  const filteredRequests = getFilteredRequests();

  return (
    <Applayout>
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
            title="Activity Status"
            subtitle="Your donations & requests"
            iconName="activity"
            statusText={`${getTotalMatches()} Matches`}
            onStatusPress={handleViewMatches}
            showBackButton
            onBackPress={handleBackPress}
            theme={theme}
          />

          {(donations.length > 0 || requests.length > 0) && (
            <View style={statusStyles.tabContainer}>
              <TouchableOpacity
                style={[statusStyles.tab, activeTab === "donations" && statusStyles.activeTab]}
                onPress={() => setActiveTab("donations")}
              >
                <Text
                  style={[
                    statusStyles.tabText,
                    activeTab === "donations" && statusStyles.activeTabText,
                  ]}
                >
                  Donations ({donations.length})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[statusStyles.tab, activeTab === "requests" && statusStyles.activeTab]}
                onPress={() => setActiveTab("requests")}
              >
                <Text
                  style={[
                    statusStyles.tabText,
                    activeTab === "requests" && statusStyles.activeTabText,
                  ]}
                >
                  Requests ({requests.length})
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: wp("5%"),
              paddingBottom: hp("2%"),
              gap: wp("2%"),
            }}
          >
            {[
              { key: "all", label: "All", icon: "list" },
              { key: "active", label: "Active", icon: "activity" },
              { key: "completed", label: "Completed", icon: "check-circle" },
              { key: "cancelled", label: "Cancelled", icon: "x-circle" },
            ].map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={{
                  paddingVertical: hp("1%"),
                  paddingHorizontal: wp("4%"),
                  borderRadius: 20,
                  backgroundColor: filterType === filter.key ? theme.primary + "20" : theme.card,
                  borderWidth: 1,
                  borderColor: filterType === filter.key ? theme.primary : theme.border + "40",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: wp("1.5%"),
                }}
                onPress={() => setFilterType(filter.key as FilterType)}
              >
                <Feather
                  name={filter.icon as any}
                  size={wp("4%")}
                  color={filterType === filter.key ? theme.primary : theme.textSecondary}
                />
                <Text
                  style={{
                    fontSize: wp("3.5%"),
                    fontWeight: filterType === filter.key ? "600" : "400",
                    color: filterType === filter.key ? theme.primary : theme.text,
                  }}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        <ScrollView
          contentContainerStyle={{
            paddingTop: HEADER_HEIGHT + hp("17%"),
            paddingHorizontal: wp("5%"),
            paddingBottom: hp("5%"),
          }}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.primary]}
              tintColor={theme.primary}
            />
          }
        >
          {activeTab === "donations" ? (
            filteredDonations.length > 0 ? (
              filteredDonations.map((donation) => (
                <DonationCard
                  key={donation.id}
                  donation={donation}
                  hasMatch={!!getMatchForDonation(donation.id)}
                  theme={theme}
                  styles={styles}
                  statusStyles={statusStyles}
                  onPress={() => handleDonationPress(donation)}
                  onCancelPress={() => handleCancelPress(donation.id, "donation")}
                />
              ))
            ) : (
              <EmptyState type="donations" theme={theme} statusStyles={statusStyles} />
            )
          ) : filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                hasMatch={!!getMatchForRequest(request.id)}
                theme={theme}
                styles={styles}
                statusStyles={statusStyles}
                onPress={() => handleRequestPress(request)}
                onCancelPress={() => handleCancelPress(request.id, "request")}
              />
            ))
          ) : (
            <EmptyState type="requests" theme={theme} statusStyles={statusStyles} />
          )}
        </ScrollView>

        <CancellationModal
          visible={cancelModalVisible}
          itemType={selectedItemType}
          reason={cancelReason}
          additionalNotes={cancelAdditionalNotes}
          cancelling={cancelling}
          theme={theme}
          onClose={() => {
            setCancelModalVisible(false);
            setCancelReason("");
            setCancelAdditionalNotes("");
          }}
          onReasonChange={setCancelReason}
          onNotesChange={setCancelAdditionalNotes}
          onConfirm={handleConfirmCancel}
        />

        <ValidationAlert
          visible={alertVisible}
          title={alertTitle}
          message={alertMessage}
          type={alertType}
          onClose={() => setAlertVisible(false)}
        />
      </View>
    </Applayout>
  );
};

export default StatusScreen;
