import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { useTheme } from "../../utils/theme-context";
import { lightTheme, darkTheme } from "../../constants/styles/authStyles";
import { createUnifiedStyles } from "../../constants/styles/unifiedStyles";
import AppLayout from "@/components/AppLayout";
import { ValidationAlert } from "../../components/common/ValidationAlert";

import {
  fetchUserById,
  donorConfirmMatch,
  recipientConfirmMatch,
  fetchDonationByIdWithAccess,
  fetchRequestByIdWithAccess,
  getDonorByUserId,
  getRecipientByUserId,
  fetchDonorHistoryForRecipient,
  fetchRecipientHistoryForDonor,
  getMatchConfirmationStatus,
} from "../api/matchingApi";

import { InfoRow } from "../../components/match/InfoRow";
import { ProfileCard } from "../../components/match/ProfileCard";
import { MatchInfoCard } from "../../components/match/MatchInfoCard";
import { YourDetailsCard } from "../../components/match/YourDetailsCard";
import { HistorySection } from "../../components/match/HistorySection";

interface MatchDetails {
  matchResultId: string;
  donationId: string;
  receiveRequestId: string;
  donorUserId: string;
  recipientUserId: string;
  donationType?: string;
  requestType?: string;
  bloodType?: string;
  matchType: string;
  isConfirmed: boolean;
  donorConfirmed: boolean;
  recipientConfirmed: boolean;
  donorConfirmedAt?: string;
  recipientConfirmedAt?: string;
  confirmedAt?: string;
  matchedAt: string;
  distance?: number;
}

interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  profileImageUrl?: string;
  phone?: string;
  gender?: string;
}

const MatchDetailsScreen = () => {
  const { colorScheme } = useTheme();
  const { matchData } = useLocalSearchParams();
  const router = useRouter();
  const isDark = colorScheme === "dark";
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  const [match, setMatch] = useState<MatchDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmingMatch, setConfirmingMatch] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [donorProfile, setDonorProfile] = useState<UserProfile | null>(null);
  const [recipientProfile, setRecipientProfile] = useState<UserProfile | null>(null);

  const [donorCurrentData, setDonorCurrentData] = useState<any>(null);
  const [recipientCurrentData, setRecipientCurrentData] = useState<any>(null);

  const [donorHistoryData, setDonorHistoryData] = useState<any>(null);
  const [recipientHistoryData, setRecipientHistoryData] = useState<any>(null);

  const [loadingHistory, setLoadingHistory] = useState(false);
  const [yourDetails, setYourDetails] = useState<any>(null);
  const [loadingYourDetails, setLoadingYourDetails] = useState(false);

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

  const loadHistoricalData = async (matchData: MatchDetails, userId: string | null) => {
    if (!matchData?.isConfirmed || !userId) return;

    setLoadingHistory(true);
    try {
      const userRole = matchData.donorUserId === userId ? "donor" : 
                       matchData.recipientUserId === userId ? "recipient" : "unknown";

      if (userRole === "donor") {
        const recipientHistory = await fetchRecipientHistoryForDonor(matchData.recipientUserId);
        if (recipientHistory.length > 0) {
          setRecipientHistoryData(recipientHistory[0]);
        }
      } else if (userRole === "recipient") {
        const donorHistory = await fetchDonorHistoryForRecipient(matchData.donorUserId);
        if (donorHistory.length > 0) {
          setDonorHistoryData(donorHistory[0]);
        }
      }
    } catch (error: any) {
      showAlert("History Error", "Could not load historical data: " + error.message, "warning");
    } finally {
      setLoadingHistory(false);
    }
  };

  const loadCurrentData = async (matchData: MatchDetails) => {
    if (matchData.isConfirmed) return;

    try {
      const [donorDetails, recipientDetails] = await Promise.all([
        getDonorByUserId(matchData.donorUserId),
        getRecipientByUserId(matchData.recipientUserId),
      ]);
      setDonorCurrentData(donorDetails);
      setRecipientCurrentData(recipientDetails);
    } catch (error) {
      console.log("Could not fetch current donor/recipient details:", error);
    }
  };

  const handleConfirmMatch = async () => {
    if (!match || !currentUserId) return;
    setConfirmingMatch(true);
    try {
      let result;
      const userRole = getUserRoleInMatch();

      if (userRole === "donor") {
        result = await donorConfirmMatch(match.matchResultId);
      } else if (userRole === "recipient") {
        result = await recipientConfirmMatch(match.matchResultId);
      } else {
        throw new Error("You are not authorized to confirm this match");
      }

      showAlert("Match Confirmed", result, "success");

      const updatedMatch = { ...match };
      if (userRole === "donor") {
        updatedMatch.donorConfirmed = true;
        updatedMatch.donorConfirmedAt = new Date().toISOString();
      } else {
        updatedMatch.recipientConfirmed = true;
        updatedMatch.recipientConfirmedAt = new Date().toISOString();
      }

      if (updatedMatch.donorConfirmed && updatedMatch.recipientConfirmed) {
        updatedMatch.isConfirmed = true;
        setDonorCurrentData(null);
        setRecipientCurrentData(null);
        setTimeout(() => {
          loadHistoricalData(updatedMatch, currentUserId);
        }, 3000);
      }

      setMatch(updatedMatch);
    } catch (error: any) {
      showAlert("Confirmation Failed", error.message, "error");
    } finally {
      setConfirmingMatch(false);
    }
  };

  useEffect(() => {
    const loadMatchDetails = async () => {
      if (!matchData) return;
      try {
        setLoading(true);

        const parsedMatch = JSON.parse(matchData as string);

        try {
          const confirmed = await getMatchConfirmationStatus(parsedMatch.matchResultId);
          parsedMatch.isConfirmed = confirmed;
        } catch (error) {
          console.log("Could not verify match status, using passed data");
        }

        const userId = await SecureStore.getItemAsync("userId");
        setMatch(parsedMatch);
        setCurrentUserId(userId);

        const [donorProfile, recipientProfile] = await Promise.all([
          fetchUserById(parsedMatch.donorUserId),
          fetchUserById(parsedMatch.recipientUserId),
        ]);
        setDonorProfile(donorProfile);
        setRecipientProfile(recipientProfile);

        if (parsedMatch.isConfirmed) {
          await loadHistoricalData(parsedMatch, userId);
        } else {
          await loadCurrentData(parsedMatch);
        }

        await loadYourDetails(parsedMatch, userId);
      } catch (error: any) {
        showAlert("Error", error.message || "Failed to load match details", "error");
      } finally {
        setLoading(false);
      }
    };

    loadMatchDetails();
  }, [matchData]);

  const loadYourDetails = async (match: MatchDetails, userId: string | null) => {
    if (!userId) return;

    setLoadingYourDetails(true);
    try {
      if (match.donorUserId === userId) {
        const requestDetails = await fetchRequestByIdWithAccess(match.receiveRequestId);
        setYourDetails({ type: "request", data: requestDetails });
      } else if (match.recipientUserId === userId) {
        const donationDetails = await fetchDonationByIdWithAccess(match.donationId);
        setYourDetails({ type: "donation", data: donationDetails });
      }
    } catch (error: any) {
      setYourDetails(null);
    } finally {
      setLoadingYourDetails(false);
    }
  };

  const getUserRoleInMatch = (): "donor" | "recipient" | "unknown" => {
    if (!match || !currentUserId) return "unknown";
    if (currentUserId === match.donorUserId) return "donor";
    if (currentUserId === match.recipientUserId) return "recipient";
    return "unknown";
  };

  const getCurrentUserRole = (): string => {
    const role = getUserRoleInMatch();
    return role === "donor" ? "Donor" : role === "recipient" ? "Recipient" : "Unknown";
  };

  const getCurrentUserStatus = (): boolean => {
    if (!match || !currentUserId) return false;
    const role = getUserRoleInMatch();
    return role === "donor" ? match.donorConfirmed : match.recipientConfirmed;
  };

  const getOtherPartyStatus = (): boolean => {
    if (!match || !currentUserId) return false;
    const role = getUserRoleInMatch();
    return role === "donor" ? match.recipientConfirmed : match.donorConfirmed;
  };

  const canConfirmMatch = (): boolean => {
    if (!match || !currentUserId) return false;
    const userConfirmed = getCurrentUserStatus();
    const matchFullyConfirmed = match.isConfirmed;
    return !userConfirmed && !matchFullyConfirmed;
  };

  const getConfirmationButtonText = (): string => {
    return `Confirm as ${getCurrentUserRole()}`;
  };

  const getOtherPartyInfo = () => {
    if (!match || !currentUserId) return null;
    const userRole = getUserRoleInMatch();

    if (userRole === "donor") {
      return {
        userId: match.recipientUserId,
        role: "Recipient",
        profile: recipientProfile,
        data: match.isConfirmed ? recipientHistoryData : recipientCurrentData,
      };
    } else if (userRole === "recipient") {
      return {
        userId: match.donorUserId,
        role: "Donor",
        profile: donorProfile,
        data: match.isConfirmed ? donorHistoryData : donorCurrentData,
      };
    }
    return null;
  };

  const viewUserProfile = (userId: string, userName: string) => {
    const otherPartyInfo = getOtherPartyInfo();

    router.push({
      pathname: "/navigation/detailedProfile",
      params: {
        userProfile: JSON.stringify(otherPartyInfo?.profile),
        historicalData: JSON.stringify(otherPartyInfo?.data),
        userRole: otherPartyInfo?.role,
        isHistorical: match?.isConfirmed.toString(),
        matchId: match?.matchResultId,
      },
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <AppLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>Loading match details...</Text>
        </View>
      </AppLayout>
    );
  }

  if (!match) {
    return (
      <AppLayout>
        <View style={styles.promptContainer}>
          <Text style={styles.promptTitle}>Match Not Found</Text>
          <TouchableOpacity style={styles.registerButton} onPress={() => router.back()}>
            <Feather name="arrow-left" size={16} color="#fff" />
            <Text style={styles.registerButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </AppLayout>
    );
  }

  const otherPartyInfo = getOtherPartyInfo();
  const userRole = getUserRoleInMatch();

  return (
    <AppLayout>
      <View style={styles.container}>
        <View style={[styles.headerContainer, { paddingHorizontal: 24 }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={20} color={theme.text} />
          </TouchableOpacity>

          <View style={styles.headerIconContainer}>
            <Feather name="link" size={28} color={theme.primary} />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Match Details</Text>
            <Text style={styles.headerSubtitle}>#{match.matchResultId.slice(0, 8)}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: match.isConfirmed ? theme.success + "20" : theme.error + "20",
                borderColor: match.isConfirmed ? theme.success + "40" : theme.error + "40",
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: match.isConfirmed ? theme.success : theme.error },
              ]}
            >
              {match.isConfirmed ? "Confirmed" : "Pending"}
            </Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <MatchInfoCard
            match={match}
            currentUserRole={getCurrentUserRole()}
            getCurrentUserStatus={getCurrentUserStatus}
            getOtherPartyStatus={getOtherPartyStatus}
            otherPartyRole={otherPartyInfo?.role || "Other Party"}
            formatDate={formatDate}
          />

          <YourDetailsCard
            yourDetails={yourDetails}
            loadingYourDetails={loadingYourDetails}
            userRole={userRole}
          />

          {otherPartyInfo?.profile && (
            <ProfileCard
              user={otherPartyInfo.profile}
              title={otherPartyInfo.role}
              iconName={otherPartyInfo.role === "Donor" ? "heart" : "user"}
              onViewProfile={viewUserProfile}
              historicalData={otherPartyInfo.data}
              isHistorical={match.isConfirmed}
            />
          )}

          {!match.isConfirmed && (
            <HistorySection
              match={match}
              loadingHistory={loadingHistory}
              matchHistory={null}
              donorHistoryData={donorHistoryData}
              recipientHistoryData={recipientHistoryData}
              formatDate={formatDate}
            />
          )}
        </ScrollView>

        {canConfirmMatch() && (
          <View style={[styles.submitButtonContainer, { paddingHorizontal: 24 }]}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                confirmingMatch ? styles.submitButtonDisabled : null,
              ]}
              onPress={handleConfirmMatch}
              disabled={confirmingMatch}
              activeOpacity={0.8}
            >
              {confirmingMatch ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>{getConfirmationButtonText()}</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

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

export default MatchDetailsScreen;
