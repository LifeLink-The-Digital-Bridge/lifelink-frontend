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
import { getMyDonations, getMyRequests, getMyMatchesAsDonor, getMyMatchesAsRecipient, MatchResponse } from "../api/matchingApi";

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

      // Fetch donations if user is a donor
      if (roles.includes("DONOR")) {
        try {
          const donationsData = await getMyDonations();
          setDonations(donationsData);
          
          // Fetch donor matches
          try {
            const matches = await getMyMatchesAsDonor();
            setDonorMatches(matches);
          } catch (error) {
            console.log("No donor matches found");
            setDonorMatches([]);
          }
        } catch (error: any) {
          if (error.message === 'NOT_REGISTERED_AS_DONOR') {
            console.log("User not registered as donor");
          } else {
            console.error("Failed to fetch donations:", error);
          }
          setDonations([]);
        }
      }

      // Fetch requests if user is a recipient
      if (roles.includes("RECIPIENT")) {
        try {
          const requestsData = await getMyRequests();
          setRequests(requestsData);
          
          // Fetch recipient matches
          try {
            const matches = await getMyMatchesAsRecipient();
            setRecipientMatches(matches);
          } catch (error) {
            console.log("No recipient matches found");
            setRecipientMatches([]);
          }
        } catch (error: any) {
          if (error.message === 'NOT_REGISTERED_AS_RECIPIENT') {
            console.log("User not registered as recipient");
          } else {
            console.error("Failed to fetch requests:", error);
          }
          setRequests([]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
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
  
    const getTotalMatches = () => {
    return donorMatches.length + recipientMatches.length;
  };

  const renderDonationItem = (donation: DonationItem) => {
    const match = getMatchForItem(donation.id, "donation");
    
    return (
      <View key={donation.id} style={styles.card}>
        <View style={statusStyles.cardHeader}>
          <Text style={statusStyles.cardTitle}>{donation.donationType}</Text>
          <View style={[styles.statusBadge, 
            donation.status === "PENDING" ? statusStyles.statusPending :
            donation.status === "COMPLETED" ? statusStyles.statusCompleted : statusStyles.statusRejected
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
          <TouchableOpacity 
            style={styles.matchButton}
            onPress={handleViewMatches}
          >
            <Feather name="users" size={16} color={theme.primary} />
            <Text style={styles.matchButtonText}>Matched - View Details</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderRequestItem = (request: RequestItem) => {
    const match = getMatchForItem(request.id, "request");
    
    return (
      <View key={request.id} style={styles.card}>
        <View style={statusStyles.cardHeader}>
          <Text style={statusStyles.cardTitle}>{request.requestType}</Text>
          <View style={[styles.statusBadge,
            request.status === "PENDING" ? statusStyles.statusPending :
            request.status === "FULFILLED" ? statusStyles.statusCompleted : statusStyles.statusRejected
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
          <TouchableOpacity 
            style={statusStyles.matchButton}
            onPress={handleViewMatches}
          >
            <Feather name="users" size={16} color={theme.primary} />
            <Text style={statusStyles.matchButtonText}>Matched - View Details</Text>
          </TouchableOpacity>
        )}
      </View>
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
          {/* Header */}
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
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {getTotalMatches()} Matches
              </Text>
            </View>
          </View>

          {/* Tab Selector */}
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

          {/* Content */}
          <View style={statusStyles.scrollContainer}>
            {activeTab === "donations" ? (
              donations.length > 0 ? (
                donations.map(renderDonationItem)
              ) : (
                <View style={statusStyles.emptyContainer}>
                  <Feather name="heart" size={48} color={theme.textSecondary} />
                  <Text style={statusStyles.emptyText}>No donations found</Text>
                  <Text style={statusStyles.emptySubtext}>Start by making your first donation</Text>
                </View>
              )
            ) : (
              requests.length > 0 ? (
                requests.map(renderRequestItem)
              ) : (
                <View style={statusStyles.emptyContainer}>
                  <Feather name="inbox" size={48} color={theme.textSecondary} />
                  <Text style={statusStyles.emptyText}>No requests found</Text>
                  <Text style={statusStyles.emptySubtext}>Create your first request</Text>
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