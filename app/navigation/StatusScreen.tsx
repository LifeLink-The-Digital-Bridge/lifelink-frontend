import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
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
import { Feather } from "@expo/vector-icons";
import {
  getMyMatchesAsDonor,
  getMyMatchesAsRecipient,
  getMyDonations,
  getMyRequests,
  MatchResponse,
  DonationDTO,
  ReceiveRequestDTO,
} from "../api/matchingApi";
import { StatusHeader } from "@/components/common/StatusHeader";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const HEADER_HEIGHT = 180;

const StatusScreen = () => {
  const [donations, setDonations] = useState<DonationDTO[]>([]);
  const [requests, setRequests] = useState<ReceiveRequestDTO[]>([]);
  const [donorMatches, setDonorMatches] = useState<MatchResponse[]>([]);
  const [recipientMatches, setRecipientMatches] = useState<MatchResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"donations" | "requests">("donations");
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
      Alert.alert("Error", "Failed to load status data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    fetchData(true);
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
    } else {
      Alert.alert(
        "Donation Details",
        `Status: ${donation.status}\nType: ${donation.donationType}\nDate: ${new Date(donation.donationDate).toLocaleDateString()}`
      );
    }
  };

  const handleRequestPress = (request: ReceiveRequestDTO) => {
    const match = getMatchForRequest(request.id);
    if (match) {
      router.push({
        pathname: "/navigation/MatchDetailsScreen",
        params: { matchData: JSON.stringify(match) },
      });
    } else {
      Alert.alert(
        "Request Details",
        `Status: ${request.status}\nType: ${request.requestType}\nUrgency: ${request.urgencyLevel}\nDate: ${new Date(request.requestDate).toLocaleDateString()}`
      );
    }
  };

  const getTotalMatches = () => {
    return donorMatches.length + recipientMatches.length;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
      case "PENDING":
        return "#f59e0b";
      case "COMPLETED":
      case "FULFILLED":
      case "MATCHED":
        return theme.success;
      case "CANCELLED":
      case "EXPIRED":
      case "REJECTED":
        return theme.error;
      default:
        return theme.textSecondary;
    }
  };

  const renderDonationItem = (donation: DonationDTO) => {
    const match = getMatchForDonation(donation.id);
    const hasMatch = !!match;

    return (
      <TouchableOpacity
        key={donation.id}
        style={[styles.card, { marginBottom: hp("1.5%") }]}
        onPress={() => handleDonationPress(donation)}
        activeOpacity={0.7}
      >
        <View style={statusStyles.cardHeader}>
          <Text style={statusStyles.cardTitle}>{donation.donationType}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(donation.status) + "20", borderColor: getStatusColor(donation.status) + "40" },
            ]}
          >
            <Text style={[styles.statusText, { color: getStatusColor(donation.status) }]}>
              {donation.status}
            </Text>
          </View>
        </View>

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

  const renderRequestItem = (request: ReceiveRequestDTO) => {
    const match = getMatchForRequest(request.id);
    const hasMatch = !!match;

    return (
      <TouchableOpacity
        key={request.id}
        style={[styles.card, { marginBottom: hp("1.5%") }]}
        onPress={() => handleRequestPress(request)}
        activeOpacity={0.7}
      >
        <View style={statusStyles.cardHeader}>
          <Text style={statusStyles.cardTitle}>{request.requestType}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(request.status) + "20", borderColor: getStatusColor(request.status) + "40" },
            ]}
          >
            <Text style={[styles.statusText, { color: getStatusColor(request.status) }]}>
              {request.status}
            </Text>
          </View>
        </View>

        <Text style={statusStyles.cardSubtitle}>
          Date: {new Date(request.requestDate).toLocaleDateString()}
        </Text>

        <View
          style={[
            styles.statusBadge,
            { 
              backgroundColor: 
                request.urgencyLevel === "CRITICAL" ? theme.error + "20" :
                request.urgencyLevel === "HIGH" ? "#FF6B35" + "20" :
                request.urgencyLevel === "MEDIUM" ? "#f59e0b" + "20" : 
                theme.success + "20",
              borderColor:
                request.urgencyLevel === "CRITICAL" ? theme.error + "40" :
                request.urgencyLevel === "HIGH" ? "#FF6B35" + "40" :
                request.urgencyLevel === "MEDIUM" ? "#f59e0b" + "40" :
                theme.success + "40",
              marginTop: hp("1%"),
              alignSelf: "flex-start",
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              {
                color:
                  request.urgencyLevel === "CRITICAL" ? theme.error :
                  request.urgencyLevel === "HIGH" ? "#FF6B35" :
                  request.urgencyLevel === "MEDIUM" ? "#f59e0b" :
                  theme.success,
              },
            ]}
          >
            Urgency: {request.urgencyLevel}
          </Text>
        </View>

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
            subtitle="Track your donations & requests"
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
                style={[
                  statusStyles.tab,
                  activeTab === "donations" && statusStyles.activeTab,
                ]}
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
                style={[
                  statusStyles.tab,
                  activeTab === "requests" && statusStyles.activeTab,
                ]}
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
        </Animated.View>

        <ScrollView
          contentContainerStyle={{
            paddingTop: HEADER_HEIGHT + hp("8.75%"),
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
            donations.length > 0 ? (
              donations.map(renderDonationItem)
            ) : (
              <View style={statusStyles.emptyContainer}>
                <Feather name="heart" size={wp("12%")} color={theme.textSecondary} />
                <Text style={statusStyles.emptyText}>No donations found</Text>
                <Text style={statusStyles.emptySubtext}>
                  Register as a donor to start making donations
                </Text>
              </View>
            )
          ) : requests.length > 0 ? (
            requests.map(renderRequestItem)
          ) : (
            <View style={statusStyles.emptyContainer}>
              <Feather name="inbox" size={wp("12%")} color={theme.textSecondary} />
              <Text style={statusStyles.emptyText}>No requests found</Text>
              <Text style={statusStyles.emptySubtext}>
                Register as a recipient to create requests
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </Applayout>
  );
};

export default StatusScreen;
