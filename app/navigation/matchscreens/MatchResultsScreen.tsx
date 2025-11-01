import { StatusHeader } from "@/components/common/StatusHeader";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AppLayout from "../../../components/AppLayout";
import { ValidationAlert } from "../../../components/common/ValidationAlert";
import { darkTheme, lightTheme } from "../../../constants/styles/authStyles";
import { createUnifiedStyles } from "../../../constants/styles/unifiedStyles";
import { useTheme } from "../../../utils/theme-context";
import {
  getMyMatchesAsDonor,
  getMyMatchesAsRecipient,
} from "../../api/matchingApi";
import { getStatusColor, formatStatusDisplay } from "../../../utils/statusHelpers";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const HEADER_HEIGHT = 135;

interface MatchResult {
  matchResultId: string;
  donationId: string;
  receiveRequestId: string;
  donorUserId: string;
  recipientUserId: string;
  donationType?: string;
  requestType?: string;
  bloodType?: string;
  matchType: string;
  status?: string;
  isConfirmed: boolean;
  donorConfirmed: boolean;
  recipientConfirmed: boolean;
  donorConfirmedAt?: string;
  recipientConfirmedAt?: string;
  matchedAt: string;
  distance?: number;
  expiredAt?: string;
  expiryReason?: string;
  completedAt?: string;
  canConfirmCompletion?: boolean;
}

type FilterType = "all" | "active" | "completed" | "cancelled";

const MatchResultsScreen = () => {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);
  const router = useRouter();

  const lastScrollY = useRef(0);
  const headerTranslateY = useRef(new Animated.Value(0)).current;

  const [donorMatches, setDonorMatches] = useState<MatchResult[]>([]);
  const [recipientMatches, setRecipientMatches] = useState<MatchResult[]>([]);
  const [activeTab, setActiveTab] = useState<"donor" | "recipient">("donor");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isDonor, setIsDonor] = useState(false);
  const [isRecipient, setIsRecipient] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error" | "warning" | "info">("info");

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

  const loadMatches = async () => {
    try {
      const userId = await SecureStore.getItemAsync("userId");
      const rolesString = await SecureStore.getItemAsync("roles");
      const roles = rolesString ? JSON.parse(rolesString) : [];

      setCurrentUserId(userId);

      let donorData: MatchResult[] = [];
      let recipientData: MatchResult[] = [];
      let hasDonorRole = false;
      let hasRecipientRole = false;

      if (roles.includes("DONOR")) {
        try {
          donorData = await getMyMatchesAsDonor();
          hasDonorRole = true;
        } catch (error: any) {
          if (error.message === "NOT_REGISTERED_AS_DONOR") {
            console.log("User not registered as donor");
          } else {
            throw error;
          }
        }
      }

      if (roles.includes("RECIPIENT")) {
        try {
          recipientData = await getMyMatchesAsRecipient();
          hasRecipientRole = true;
        } catch (error: any) {
          if (error.message === "NOT_REGISTERED_AS_RECIPIENT") {
            console.log("User not registered as recipient");
          } else {
            throw error;
          }
        }
      }

      setIsDonor(hasDonorRole);
      setIsRecipient(hasRecipientRole);
      setDonorMatches(donorData);
      setRecipientMatches(recipientData);

      if (hasDonorRole && !hasRecipientRole) {
        setActiveTab("donor");
      } else if (!hasDonorRole && hasRecipientRole) {
        setActiveTab("recipient");
      } else if (hasDonorRole && hasRecipientRole) {
        setActiveTab("donor");
      }

      if (!hasDonorRole && !hasRecipientRole) {
        showAlert(
          "No Role",
          "You need to register as a donor or recipient to view matches",
          "warning"
        );
      }
    } catch (error: any) {
      console.error("Error loading matches:", error);
      showAlert("Error", error.message || "Failed to load matches", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadMatches();
  };

  const handleMatchPress = (match: MatchResult) => {
    router.push({
      pathname: "/navigation/matchscreens/MatchDetailsScreen",
      params: { matchData: JSON.stringify(match) },
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isActiveMatch = (match: MatchResult) => {
    const activeStatuses = ["PENDING", "MATCHED", "CONFIRMED"];
    return activeStatuses.includes(match.status || "");
  };

  const isCompletedMatch = (match: MatchResult) => {
    return match.status === "COMPLETED";
  };

  const isCancelledMatch = (match: MatchResult) => {
    const cancelledStatuses = ["REJECTED", "EXPIRED", "CANCELLED_BY_DONOR", "CANCELLED_BY_RECIPIENT", "WITHDRAWN"];
    return cancelledStatuses.includes(match.status || "");
  };

  const getFilteredMatches = (matches: MatchResult[]) => {
    switch (filterType) {
      case "active":
        return matches.filter(isActiveMatch);
      case "completed":
        return matches.filter(isCompletedMatch);
      case "cancelled":
        return matches.filter(isCancelledMatch);
      default:
        return matches;
    }
  };

  const getCurrentMatches = () => {
    const matches = activeTab === "donor" ? donorMatches : recipientMatches;
    return getFilteredMatches(matches);
  };

  const getUserRoleInMatch = (match: MatchResult) => {
    if (currentUserId === match.donorUserId) return "donor";
    if (currentUserId === match.recipientUserId) return "recipient";
    return "unknown";
  };

  const getOtherPartyRole = (match: MatchResult) => {
    const userRole = getUserRoleInMatch(match);
    if (userRole === "donor") return "Recipient";
    if (userRole === "recipient") return "Donor";
    return "Other Party";
  };

  const getTotalMatchCount = () => {
    return donorMatches.length + recipientMatches.length;
  };

  const handleBackPress = () => {
    router.back();
  };

  if (loading) {
    return (
      <AppLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>Loading matches...</Text>
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
            title="Match Results"
            subtitle="View all donation matches"
            iconName="activity"
            statusText={`${getTotalMatchCount()} Matches`}
            showBackButton
            onBackPress={handleBackPress}
            theme={theme}
          />

          {(isDonor || isRecipient) && (
            <View
              style={{
                flexDirection: "row",
                marginHorizontal: wp("5%"),
                marginBottom: hp("2%"),
                backgroundColor: theme.card,
                borderRadius: 12,
                padding: 4,
              }}
            >
              {isDonor && (
                <TouchableOpacity
                  style={[
                    {
                      flex: 1,
                      paddingVertical: hp("1.5%"),
                      paddingHorizontal: wp("4%"),
                      borderRadius: 8,
                      alignItems: "center",
                    },
                    activeTab === "donor" ? { backgroundColor: theme.primary } : {},
                  ]}
                  onPress={() => setActiveTab("donor")}
                >
                  <Text
                    style={[
                      { fontSize: wp("3.5%"), fontWeight: "600" },
                      activeTab === "donor" ? { color: "#fff" } : { color: theme.text },
                    ]}
                  >
                    As Donor ({donorMatches.length})
                  </Text>
                </TouchableOpacity>
              )}
              {isRecipient && (
                <TouchableOpacity
                  style={[
                    {
                      flex: 1,
                      paddingVertical: hp("1.5%"),
                      paddingHorizontal: wp("4%"),
                      borderRadius: 8,
                      alignItems: "center",
                    },
                    activeTab === "recipient" ? { backgroundColor: theme.primary } : {},
                  ]}
                  onPress={() => setActiveTab("recipient")}
                >
                  <Text
                    style={[
                      { fontSize: wp("3.5%"), fontWeight: "600" },
                      activeTab === "recipient" ? { color: "#fff" } : { color: theme.text },
                    ]}
                  >
                    As Recipient ({recipientMatches.length})
                  </Text>
                </TouchableOpacity>
              )}
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
            paddingTop: HEADER_HEIGHT + hp("15%"),
            paddingHorizontal: wp("5%"),
            paddingBottom: hp("5%"),
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
        >
          {getCurrentMatches().length === 0 ? (
            <View style={styles.promptContainer}>
              <View style={styles.promptIconContainer}>
                <Feather name="search" size={wp("10%")} color={theme.textSecondary} />
              </View>
              <Text style={styles.promptTitle}>
                No {filterType !== "all" ? filterType : ""} Matches Found
              </Text>
              <Text style={styles.promptSubtitle}>
                {filterType === "all"
                  ? "We're actively looking for compatible matches for you."
                  : `You don't have any ${filterType} matches at the moment.`}
              </Text>
            </View>
          ) : (
            getCurrentMatches().map((match, index) => (
              <TouchableOpacity
                key={match.matchResultId || index}
                style={styles.card}
                onPress={() => handleMatchPress(match)}
                activeOpacity={0.7}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: hp("2%"),
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.headerTitle}>
                      Match with {getOtherPartyRole(match)}
                    </Text>
                    <Text style={styles.headerSubtitle}>
                      {match.donationType || match.requestType || "Unknown"} •{" "}
                      {match.bloodType || "Unknown Blood Type"}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor: getStatusColor(match.status || "PENDING", theme) + "20",
                        borderColor: getStatusColor(match.status || "PENDING", theme) + "40",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusColor(match.status || "PENDING", theme) },
                      ]}
                    >
                      {formatStatusDisplay(match.status || "PENDING").text}
                    </Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.labelText}>Your Role:</Text>
                  <Text style={styles.valueText}>
                    {getUserRoleInMatch(match) === "donor" ? "Donor" : "Recipient"}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.labelText}>Distance:</Text>
                  <Text style={styles.valueText}>
                    {match.distance ? `${match.distance.toFixed(1)} km` : "N/A"}
                  </Text>
                </View>

                <View style={[styles.infoRow, styles.lastInfoRow]}>
                  <Text style={styles.labelText}>Matched At:</Text>
                  <Text style={styles.valueText}>
                    {match.matchedAt ? formatDate(match.matchedAt) : "N/A"}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: hp("2%"),
                    paddingTop: hp("2%"),
                    borderTopWidth: 1,
                    borderTopColor: theme.border + "30",
                  }}
                >
                  <Feather name="eye" size={wp("4%")} color={theme.primary} />
                  <Text
                    style={[
                      styles.labelText,
                      { marginLeft: wp("2%"), color: theme.primary },
                    ]}
                  >
                    Tap to view details
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        <ValidationAlert
          visible={alertVisible}
          title={alertTitle}
          message={alertMessage}
          type={alertType}
          onClose={() => setAlertVisible(false)}
        />
      </View>
    </AppLayout>
  );
};

export default MatchResultsScreen;
