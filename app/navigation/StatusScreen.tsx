import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
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
  fetchDonationByIdWithAccess,
  fetchRequestByIdWithAccess,
  MatchResponse 
} from "../api/matchingApi";

interface DonationItem {
  id: string;
  donationType: string;
  donationDate: string;
  status: string;
  quantity?: number;
  bloodType?: string;
  organType?: string;
  tissueType?: string;
  stemCellType?: string;
}

interface RequestItem {
  id: string;
  requestType: string;
  requestDate: string;
  status: string;
  quantity?: number;
  bloodType?: string;
  organType?: string;
  tissueType?: string;
  stemCellType?: string;
}

const StatusScreen = () => {
  const [donations, setDonations] = useState<DonationItem[]>([]);
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [donorMatches, setDonorMatches] = useState<MatchResponse[]>([]);
  const [recipientMatches, setRecipientMatches] = useState<MatchResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"donations" | "requests">("donations");
  const { isAuthenticated } = useAuth();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);
  const statusStyles = createStatusStyles(theme);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/(auth)/loginScreen");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const rolesString = await SecureStore.getItemAsync("roles");
      const roles: string[] = rolesString ? JSON.parse(rolesString) : [];

      let donationsData: DonationItem[] = [];
      let requestsData: RequestItem[] = [];

      if (roles.includes("DONOR")) {
        try {
          const matches = await getMyMatchesAsDonor();
          setDonorMatches(matches);

          const donationPromises = matches.map(async (match) => {
            try {
              const donation = await fetchDonationByIdWithAccess(match.donationId);
              return {
                id: donation.id || match.donationId,
                donationType: donation.donationType || match.donationType || 'N/A',
                donationDate: donation.donationDate || match.matchedAt,
                status: donation.status || 'MATCHED',
                quantity: donation.quantity,
                bloodType: donation.bloodType || match.bloodType,
                organType: donation.organType,
                tissueType: donation.tissueType,
                stemCellType: donation.stemCellType,
              };
            } catch (error) {
              console.log(`Could not fetch donation ${match.donationId}:`, error);
              return {
                id: match.donationId,
                donationType: match.donationType || 'N/A',
                donationDate: match.matchedAt,
                status: 'MATCHED',
                bloodType: match.bloodType,
              };
            }
          });

          donationsData = await Promise.all(donationPromises);
          setDonations(donationsData);
        } catch (error: any) {
          if (error.message === 'NOT_REGISTERED_AS_DONOR') {
            console.log("User not registered as donor");
          } else {
            console.error("Failed to fetch donor data:", error);
          }
          setDonorMatches([]);
          setDonations([]);
        }
      }

      if (roles.includes("RECIPIENT")) {
        try {
          const matches = await getMyMatchesAsRecipient();
          setRecipientMatches(matches);

          const requestPromises = matches.map(async (match) => {
            try {
              const request = await fetchRequestByIdWithAccess(match.receiveRequestId);
              return {
                id: request.id || match.receiveRequestId,
                requestType: request.requestType || match.requestType || 'N/A',
                requestDate: request.requestDate || match.matchedAt,
                status: request.status || 'MATCHED',
                quantity: request.quantity,
                bloodType: request.requestedBloodType || match.bloodType,
                organType: request.requestedOrgan,
                tissueType: request.requestedTissue,
                stemCellType: request.requestedStemCellType,
              };
            } catch (error) {
              console.log(`Could not fetch request ${match.receiveRequestId}:`, error);
              return {
                id: match.receiveRequestId,
                requestType: match.requestType || 'N/A',
                requestDate: match.matchedAt,
                status: 'MATCHED',
                bloodType: match.bloodType,
              };
            }
          });

          requestsData = await Promise.all(requestPromises);
          setRequests(requestsData);
        } catch (error: any) {
          if (error.message === 'NOT_REGISTERED_AS_RECIPIENT') {
            console.log("User not registered as recipient");
          } else {
            console.error("Failed to fetch recipient data:", error);
          }
          setRecipientMatches([]);
          setRequests([]);
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
    }
    setLoading(false);
  };

  const getMatchForItem = (itemId: string, type: "donation" | "request") => {
    if (type === "donation") {
      return donorMatches.find(match => match.donationId === itemId);
    } else {
      return recipientMatches.find(match => match.receiveRequestId === itemId);
    }
  };

  const handleViewMatches = () => {
    router.push("/navigation/MatchResultsScreen");
  };

  const handleItemPress = (itemId: string, type: "donation" | "request") => {
    const match = getMatchForItem(itemId, type);
    if (match) {
      router.push({
        pathname: '/navigation/MatchDetailsScreen',
        params: { matchData: JSON.stringify(match) }
      });
    }
  };

  const getTotalMatches = () => {
    return donorMatches.length + recipientMatches.length;
  };

  const renderDonationItem = (donation: DonationItem) => {
    const match = getMatchForItem(donation.id, "donation");

    return (
      <TouchableOpacity 
        key={donation.id} 
        style={styles.card}
        onPress={() => handleItemPress(donation.id, "donation")}
        activeOpacity={0.7}
      >
        <View style={statusStyles.cardHeader}>
          <Text style={statusStyles.cardTitle}>{donation.donationType}</Text>
          <View style={[styles.statusBadge,
            donation.status === "PENDING" ? statusStyles.statusPending :
            donation.status === "COMPLETED" || donation.status === "MATCHED" ? statusStyles.statusCompleted : 
            statusStyles.statusRejected
          ]}>
            <Text style={styles.statusText}>{donation.status}</Text>
          </View>
        </View>

        <Text style={statusStyles.cardSubtitle}>
          Date: {new Date(donation.donationDate).toLocaleDateString()}
        </Text>

        {donation.quantity && (
          <Text style={statusStyles.cardDetail}>Quantity: {donation.quantity}</Text>
        )}
        {donation.bloodType && (
          <Text style={statusStyles.cardDetail}>Blood Type: {donation.bloodType}</Text>
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

        {match && (
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 12,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: theme.border + '30'
          }}>
            <Feather name="users" size={16} color={theme.success} />
            <Text style={{
              color: theme.success,
              fontSize: 14,
              fontWeight: '600',
              marginLeft: 8
            }}>
              Matched - Tap to view details
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderRequestItem = (request: RequestItem) => {
    const match = getMatchForItem(request.id, "request");

    return (
      <TouchableOpacity 
        key={request.id} 
        style={styles.card}
        onPress={() => handleItemPress(request.id, "request")}
        activeOpacity={0.7}
      >
        <View style={statusStyles.cardHeader}>
          <Text style={statusStyles.cardTitle}>{request.requestType}</Text>
          <View style={[styles.statusBadge,
            request.status === "PENDING" ? statusStyles.statusPending :
            request.status === "FULFILLED" || request.status === "MATCHED" ? statusStyles.statusCompleted : 
            statusStyles.statusRejected
          ]}>
            <Text style={styles.statusText}>{request.status}</Text>
          </View>
        </View>

        <Text style={statusStyles.cardSubtitle}>
          Date: {new Date(request.requestDate).toLocaleDateString()}
        </Text>

        {request.quantity && (
          <Text style={statusStyles.cardDetail}>Quantity: {request.quantity}</Text>
        )}
        {request.bloodType && (
          <Text style={statusStyles.cardDetail}>Blood Type: {request.bloodType}</Text>
        )}
        {request.organType && (
          <Text style={statusStyles.cardDetail}>Organ: {request.organType}</Text>
        )}
        {request.tissueType && (
          <Text style={statusStyles.cardDetail}>Tissue: {request.tissueType}</Text>
        )}
        {request.stemCellType && (
          <Text style={statusStyles.cardDetail}>Stem Cell: {request.stemCellType}</Text>
        )}

        {match && (
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 12,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: theme.border + '30'
          }}>
            <Feather name="users" size={16} color={theme.success} />
            <Text style={{
              color: theme.success,
              fontSize: 14,
              fontWeight: '600',
              marginLeft: 8
            }}>
              Matched - Tap to view details
            </Text>
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
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <View style={styles.headerIconContainer}>
              <Feather name="activity" size={28} color={theme.primary} />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Activity Status</Text>
              <Text style={styles.headerSubtitle}>
                Track your donations & requests
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.statusBadge}
              onPress={handleViewMatches}
            >
              <Text style={styles.statusText}>
                {getTotalMatches()} Matches
              </Text>
            </TouchableOpacity>
          </View>

          {(donations.length > 0 || requests.length > 0) && (
            <View style={statusStyles.tabContainer}>
              <TouchableOpacity
                style={[statusStyles.tab, activeTab === "donations" && statusStyles.activeTab]}
                onPress={() => setActiveTab("donations")}
              >
                <Text style={[statusStyles.tabText, activeTab === "donations" && statusStyles.activeTabText]}>
                  Donations ({donations.length})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[statusStyles.tab, activeTab === "requests" && statusStyles.activeTab]}
                onPress={() => setActiveTab("requests")}
              >
                <Text style={[statusStyles.tabText, activeTab === "requests" && statusStyles.activeTabText]}>
                  Requests ({requests.length})
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={statusStyles.scrollContainer}>
            {activeTab === "donations" ? (
              donations.length > 0 ? (
                donations.map(renderDonationItem)
              ) : (
                <View style={statusStyles.emptyContainer}>
                  <Feather name="heart" size={48} color={theme.textSecondary} />
                  <Text style={statusStyles.emptyText}>No donations found</Text>
                  <Text style={statusStyles.emptySubtext}>
                    Register as a donor to start making donations
                  </Text>
                </View>
              )
            ) : (
              requests.length > 0 ? (
                requests.map(renderRequestItem)
              ) : (
                <View style={statusStyles.emptyContainer}>
                  <Feather name="inbox" size={48} color={theme.textSecondary} />
                  <Text style={statusStyles.emptyText}>No requests found</Text>
                  <Text style={statusStyles.emptySubtext}>
                    Register as a recipient to create requests
                  </Text>
                </View>
              )
            )}
          </View>
        </ScrollView>
      </View>
    </Applayout>
  );
};

export default StatusScreen;
