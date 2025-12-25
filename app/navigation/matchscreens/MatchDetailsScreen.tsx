import AppLayout from "@/components/AppLayout";
import { StatusHeader } from "@/components/common/StatusHeader";
import { Feather } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../../utils/responsive';
import { ValidationAlert } from "../../../components/common/ValidationAlert";
import { ActionButtons } from "../../../components/match/ActionButtons";
import { CompletionModal } from "../../../components/match/CompletionModal";
import { MapSection } from "../../../components/match/MapSection";
import { MatchInfoCard } from "../../../components/match/MatchInfoCard";
import { ProfileCard } from "../../../components/match/ProfileCard";
import { RejectModal } from "../../../components/match/RejectModal";
import { WithdrawModal } from "../../../components/match/WithdrawModal";
import { YourDetailsCard } from "../../../components/match/YourDetailsCard";
import { darkTheme, lightTheme } from "../../../constants/styles/authStyles";
import { createUnifiedStyles } from "../../../constants/styles/unifiedStyles";
import { formatStatusDisplay, getStatusColor } from "../../../utils/statusHelpers";
import { useTheme } from "../../../utils/theme-context";
import {
  canConfirmCompletion,
  CompletionConfirmationDTO,
  donorConfirmMatch,
  donorRejectMatch,
  donorWithdrawConfirmation,
  fetchDonationByIdWithAccess,
  fetchRequestByIdWithAccess,
  fetchUserById,
  getDonorSnapshotByDonation,
  getMatchConfirmationStatus,
  getRecipientSnapshotByRequest,
  recipientConfirmCompletion,
  recipientConfirmMatch,
  recipientRejectMatch,
  recipientWithdrawConfirmation,
} from "../../api/matchingApi";

const HEADER_HEIGHT = 120;

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
  matchedAt: string;
  distance?: number;
  status?: string;
  expiredAt?: string;
  expiryReason?: string;
  completedAt?: string;
  canConfirmCompletion?: boolean;

  // New fields from MatchResponse
  compatibilityScore?: number;
  bloodCompatibilityScore?: number;
  locationCompatibilityScore?: number;
  medicalCompatibilityScore?: number;
  urgencyPriorityScore?: number;
  matchReason?: string;
  priorityRank?: number;

  receivedDate?: string;
  completionNotes?: string;
  recipientRating?: number;
  hospitalName?: string;

  confirmationExpiresAt?: string;
  firstConfirmer?: string;
  firstConfirmedAt?: string;

  withdrawnBy?: string;
  withdrawnAt?: string;
  withdrawalReason?: string;

  withdrawalGracePeriodExpiresAt?: string;
  reconfirmationWindowExpiresAt?: string;
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

interface LocationCoordinates {
  latitude: number;
  longitude: number;
  address?: string;
  title: string;
  description?: string;
  type?: "registered" | "current" | "other";
}

const MatchDetailsScreen = () => {
  const { colorScheme } = useTheme();
  const { matchData } = useLocalSearchParams();
  const router = useRouter();
  const isDark = colorScheme === "dark";
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  const lastScrollY = useRef(0);
  const headerTranslateY = useRef(new Animated.Value(0)).current;

  const [match, setMatch] = useState<MatchDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmingMatch, setConfirmingMatch] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [navigatingToProfile, setNavigatingToProfile] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [donorProfile, setDonorProfile] = useState<UserProfile | null>(null);
  const [recipientProfile, setRecipientProfile] = useState<UserProfile | null>(null);

  const [donorSnapshot, setDonorSnapshot] = useState<any>(null);
  const [recipientSnapshot, setRecipientSnapshot] = useState<any>(null);

  const [yourDetails, setYourDetails] = useState<any>(null);
  const [loadingYourDetails, setLoadingYourDetails] = useState(false);

  const [currentGpsLocation, setCurrentGpsLocation] = useState<LocationCoordinates | null>(null);
  const [registeredLocation, setRegisteredLocation] = useState<LocationCoordinates | null>(null);
  const [otherPartyLocation, setOtherPartyLocation] = useState<LocationCoordinates | null>(null);
  const [allLocations, setAllLocations] = useState<LocationCoordinates[]>([]);
  const [calculatedDistance, setCalculatedDistance] = useState<number | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error" | "warning" | "info">("info");

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawReason, setWithdrawReason] = useState("");

  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completionData, setCompletionData] = useState<CompletionConfirmationDTO>({
    receivedDate: new Date().toISOString().split('T')[0],
    notes: "",
    rating: 5,
    hospitalName: "",
  });

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

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getCurrentUserLocation = async () => {
    setLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationPermission(false);
        return;
      }

      setLocationPermission(true);
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const gpsLocation: LocationCoordinates = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        title: "Your Current Location",
        description: "Your live GPS location",
        type: "current",
      };

      setCurrentGpsLocation(gpsLocation);
    } catch (error) {
      console.error("Error getting location:", error);
    } finally {
      setLoadingLocation(false);
    }
  };

  const extractRegisteredLocation = (userData: any): LocationCoordinates | null => {
    if (!userData || !userData.locations || userData.locations.length === 0) {
      return null;
    }

    const location = userData.locations[0];
    if (location.latitude && location.longitude) {
      return {
        latitude: parseFloat(location.latitude.toString()),
        longitude: parseFloat(location.longitude.toString()),
        title: "Your Registered Location",
        description: "Location from your profile at match time",
        address: `${location.addressLine || ""}, ${location.city || ""}`.trim().replace(/^,\s*/, ""),
        type: "registered",
      };
    }

    return null;
  };

  const getOtherPartyLocation = (
    otherPartyData: any,
    otherPartyRole: string
  ): LocationCoordinates | null => {
    if (!otherPartyData || !otherPartyData.locations || otherPartyData.locations.length === 0) {
      return null;
    }

    const location = otherPartyData.locations[0];
    if (location.latitude && location.longitude) {
      return {
        latitude: parseFloat(location.latitude.toString()),
        longitude: parseFloat(location.longitude.toString()),
        title: `${otherPartyRole} Location`,
        address: `${location.addressLine || ""}, ${location.city || ""}`.trim().replace(/^,\s*/, ""),
        description: "Their registered location at match time",
        type: "other",
      };
    }

    return null;
  };

  const updateLocationData = () => {
    if (!match || !currentUserId) return;

    const userRole = getUserRoleInMatch();
    const currentUserData = userRole === "donor" ? donorSnapshot : recipientSnapshot;
    const otherPartyData = userRole === "donor" ? recipientSnapshot : donorSnapshot;
    const otherPartyRole = userRole === "donor" ? "Recipient" : "Donor";

    const registered = extractRegisteredLocation(currentUserData);
    setRegisteredLocation(registered);

    const otherLocation = getOtherPartyLocation(otherPartyData, otherPartyRole);
    setOtherPartyLocation(otherLocation);

    const locations: LocationCoordinates[] = [];
    if (registered) locations.push(registered);
    if (currentGpsLocation) locations.push(currentGpsLocation);
    if (otherLocation) locations.push(otherLocation);

    setAllLocations(locations);

    if (registered && otherLocation) {
      const distance = calculateDistance(
        registered.latitude,
        registered.longitude,
        otherLocation.latitude,
        otherLocation.longitude
      );
      setCalculatedDistance(distance);
    }
  };

  const getUserRoleInMatch = (): "donor" | "recipient" | "unknown" => {
    if (!match || !currentUserId) return "unknown";
    if (currentUserId === match.donorUserId) return "donor";
    if (currentUserId === match.recipientUserId) return "recipient";
    return "unknown";
  };

  const loadYourDetails = async (matchData: MatchDetails, userId: string | null) => {
    if (!userId) return;
    setLoadingYourDetails(true);
    try {
      const isDonor = userId === matchData.donorUserId;
      const isRecipient = userId === matchData.recipientUserId;

      if (isDonor) {
        const donationDetails = await fetchDonationByIdWithAccess(matchData.donationId);
        setYourDetails({ type: "donation", data: donationDetails });
      } else if (isRecipient) {
        const requestDetails = await fetchRequestByIdWithAccess(matchData.receiveRequestId);
        setYourDetails({ type: "request", data: requestDetails });
      }
    } catch (error: any) {
      console.error("Error loading your details:", error);
      setYourDetails(null);
    } finally {
      setLoadingYourDetails(false);
    }
  };

  const handleConfirmMatch = async () => {
    if (!match || !currentUserId) return;
    setConfirmingMatch(true);
    try {
      let result: string;
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
        updatedMatch.status = updatedMatch.recipientConfirmed ? "CONFIRMED" : "DONOR_CONFIRMED";
      } else {
        updatedMatch.recipientConfirmed = true;
        updatedMatch.recipientConfirmedAt = new Date().toISOString();
        updatedMatch.status = updatedMatch.donorConfirmed ? "CONFIRMED" : "RECIPIENT_CONFIRMED";
      }

      if (updatedMatch.donorConfirmed && updatedMatch.recipientConfirmed) {
        updatedMatch.isConfirmed = true;
        updatedMatch.status = "CONFIRMED";
      }

      setMatch(updatedMatch);
    } catch (error: any) {
      showAlert("Confirmation Failed", error.message || "Failed to confirm match", "error");
    } finally {
      setConfirmingMatch(false);
    }
  };

  const handleReject = async () => {
    if (!match || !currentUserId || rejectReason.trim().length < 10) {
      showAlert("Invalid Reason", "Please provide a reason with at least 10 characters", "warning");
      return;
    }
    setActionLoading(true);
    try {
      const userRole = getUserRoleInMatch();
      let result: string;

      if (userRole === "donor") {
        result = await donorRejectMatch(match.matchResultId, rejectReason.trim());
      } else if (userRole === "recipient") {
        result = await recipientRejectMatch(match.matchResultId, rejectReason.trim());
      } else {
        throw new Error("You are not authorized to reject this match");
      }

      showAlert("Match Rejected", result, "success");

      setMatch((prev) => prev ? { ...prev, status: "REJECTED" } : prev);
      setShowRejectModal(false);
      setRejectReason("");

      setTimeout(() => router.back(), 2000);
    } catch (error: any) {
      showAlert("Rejection Failed", error.message || "Failed to reject match", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!match || !currentUserId || withdrawReason.trim().length < 10) {
      showAlert("Invalid Reason", "Please provide a reason with at least 10 characters", "warning");
      return;
    }
    setActionLoading(true);
    try {
      const userRole = getUserRoleInMatch();
      let result: string;

      if (userRole === "donor") {
        result = await donorWithdrawConfirmation(match.matchResultId, withdrawReason.trim());
      } else if (userRole === "recipient") {
        result = await recipientWithdrawConfirmation(match.matchResultId, withdrawReason.trim());
      } else {
        throw new Error("You are not authorized to withdraw from this match");
      }

      showAlert("Withdrawn Successfully", result, "success");

      setMatch((prev) => {
        if (!prev) return prev;

        if (userRole === "donor") {
          if (prev.recipientConfirmed) {
            return {
              ...prev,
              donorConfirmed: false,
              donorConfirmedAt: undefined,
              status: "RECIPIENT_CONFIRMED",
              isConfirmed: false
            };
          } else {
            return {
              ...prev,
              donorConfirmed: false,
              donorConfirmedAt: undefined,
              status: "PENDING",
              isConfirmed: false
            };
          }
        } else {
          if (prev.donorConfirmed) {
            return {
              ...prev,
              recipientConfirmed: false,
              recipientConfirmedAt: undefined,
              status: "DONOR_CONFIRMED",
              isConfirmed: false
            };
          } else {
            return {
              ...prev,
              recipientConfirmed: false,
              recipientConfirmedAt: undefined,
              status: "PENDING",
              isConfirmed: false
            };
          }
        }
      });

      setShowWithdrawModal(false);
      setWithdrawReason("");
    } catch (error: any) {
      showAlert("Withdrawal Failed", error.message || "Failed to withdraw confirmation", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmCompletion = async () => {
    if (!match || !currentUserId) return;
    if (!completionData.receivedDate || (completionData.notes?.trim().length || 0) < 10) {
      showAlert("Invalid Data", "Please provide received date and notes (min 10 characters)", "warning");
      return;
    }
    setActionLoading(true);
    try {
      const result = await recipientConfirmCompletion(match.matchResultId, completionData);
      showAlert("Completion Confirmed", result, "success");

      setMatch((prev) => prev ? { ...prev, completedAt: new Date().toISOString() } : prev);
      setShowCompletionModal(false);
      setCompletionData({
        receivedDate: new Date().toISOString().split('T')[0],
        notes: "",
        rating: 5,
        hospitalName: "",
      });
    } catch (error: any) {
      showAlert("Completion Failed", error.message || "Failed to confirm completion", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const checkCanConfirmCompletion = async () => {
    if (!match || !currentUserId || getUserRoleInMatch() !== "recipient") return;
    try {
      const result = await canConfirmCompletion(match.matchResultId);
      setMatch((prev) => prev ? { ...prev, canConfirmCompletion: result.canConfirm } : prev);
    } catch (error) {
      console.error("Error checking completion eligibility:", error);
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

        let donorSnapshotData = null;
        let recipientSnapshotData = null;

        try {
          donorSnapshotData = await getDonorSnapshotByDonation(parsedMatch.donationId);
        } catch (error) {
          console.error("Failed to load donor snapshot:", error);
        }

        try {
          recipientSnapshotData = await getRecipientSnapshotByRequest(parsedMatch.receiveRequestId);
        } catch (error) {
          console.error("Failed to load recipient snapshot:", error);
        }

        setDonorProfile(donorProfile);
        setRecipientProfile(recipientProfile);
        setDonorSnapshot(donorSnapshotData);
        setRecipientSnapshot(recipientSnapshotData);

        await loadYourDetails(parsedMatch, userId);
        await checkCanConfirmCompletion();
      } catch (error: any) {
        showAlert("Error", error.message || "Failed to load match details", "error");
      } finally {
        setLoading(false);
      }
    };

    loadMatchDetails();
  }, [matchData]);

  useEffect(() => {
    if (match && currentUserId && donorProfile && recipientProfile && (donorSnapshot || recipientSnapshot)) {
      updateLocationData();
    }
  }, [match, currentUserId, donorProfile, recipientProfile, donorSnapshot, recipientSnapshot, currentGpsLocation]);

  useEffect(() => {
    getCurrentUserLocation();
  }, []);

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
    const isTerminalStatus = ["REJECTED", "EXPIRED", "CANCELLED_BY_DONOR", "CANCELLED_BY_RECIPIENT", "CONFIRMED"].includes(match.status || "");
    return !userConfirmed && !isTerminalStatus;
  };

  const canRejectMatch = (): boolean => {
    if (!match || !currentUserId) return false;

    if (match.status === "COMPLETED") return false;

    const terminalStatuses = [
      "REJECTED",
      "EXPIRED",
      "CANCELLED_BY_DONOR",
      "CANCELLED_BY_RECIPIENT"
    ];

    if (terminalStatuses.includes(match.status || "")) return false;

    if (match.status === "CONFIRMED") {
      const userRole = getUserRoleInMatch();
      const confirmedAt = userRole === "donor"
        ? match.donorConfirmedAt
        : match.recipientConfirmedAt;

      if (!confirmedAt) return false;

      const gracePeriodExpiry = new Date(confirmedAt).getTime() + (2 * 60 * 60 * 1000);
      return Date.now() < gracePeriodExpiry;
    }

    return true;
  };

  const canWithdrawMatch = (): boolean => {
    if (!match || !currentUserId) return false;

    if (match.status === "COMPLETED") return false;

    const userConfirmed = getCurrentUserStatus();
    const validStatuses = ["DONOR_CONFIRMED", "RECIPIENT_CONFIRMED", "CONFIRMED"];

    if (!validStatuses.includes(match.status || "")) return false;
    if (!userConfirmed) return false;

    const userRole = getUserRoleInMatch();
    const confirmedAt = userRole === "donor"
      ? match.donorConfirmedAt
      : match.recipientConfirmedAt;

    if (!confirmedAt) return false;

    const gracePeriodExpiry = new Date(confirmedAt).getTime() + (2 * 60 * 60 * 1000);
    return Date.now() < gracePeriodExpiry;
  };

  const canShowCompletionButton = (): boolean => {
    if (!match || !currentUserId) return false;
    return getUserRoleInMatch() === "recipient" &&
      match.status === "CONFIRMED" &&
      !match.completedAt &&
      match.canConfirmCompletion === true;
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
        data: recipientSnapshot,
      };
    } else if (userRole === "recipient") {
      return {
        userId: match.donorUserId,
        role: "Donor",
        profile: donorProfile,
        data: donorSnapshot,
      };
    }
    return null;
  };

  const viewUserProfile = async (userId: string, userName: string) => {
    if (!match) return;

    setNavigatingToProfile(true);

    try {
      const otherPartyInfo = getOtherPartyInfo();

      let theirDetails = null;

      if (otherPartyInfo?.role === "Donor") {
        theirDetails = await fetchDonationByIdWithAccess(match.donationId);
      } else if (otherPartyInfo?.role === "Recipient") {
        theirDetails = await fetchRequestByIdWithAccess(match.receiveRequestId);
      }

      setTimeout(() => {
        router.push({
          pathname: "/navigation/matchscreens/detailedProfile",
          params: {
            userProfile: JSON.stringify(otherPartyInfo?.profile),
            matchingServiceData: JSON.stringify(otherPartyInfo?.data),
            theirDonationOrRequest: JSON.stringify(theirDetails),
            userRole: otherPartyInfo?.role,
          },
        });
        setNavigatingToProfile(false);
      }, 100);
    } catch (error) {
      console.error("Error navigating to profile:", error);
      setNavigatingToProfile(false);
    }
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

  const handleBackPress = () => {
    router.back();
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
            title="Match Details"
            subtitle={match.matchResultId.slice(0, 8)}
            iconName="link"
            statusText={formatStatusDisplay(match.status || "PENDING").text}
            statusColor={getStatusColor(match.status || "PENDING", theme)}
            showBackButton
            onBackPress={handleBackPress}
            theme={theme}
          />
        </Animated.View>

        <ScrollView
          contentContainerStyle={{
            paddingTop: HEADER_HEIGHT + 10,
            paddingHorizontal: wp("5%"),
            paddingBottom: hp("20%"),
          }}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
        >
          {match.status === "COMPLETED" && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Completion Details</Text>
              <View style={styles.card}>
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionContainer}>Hospital</Text>
                  <Text style={styles.sectionContainer}>{match.hospitalName || "Not specified"}</Text>
                </View>
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionContainer}>Received Date</Text>
                  <Text style={styles.sectionContainer}>{match.receivedDate || "Not specified"}</Text>
                </View>
                {match.recipientRating && (
                  <View style={styles.sectionContainer}>
                    <Text style={styles.sectionContainer}>Rating</Text>
                    <View style={{ flexDirection: 'row' }}>
                      {[...Array(5)].map((_, i) => (
                        <Feather
                          key={i}
                          name="star"
                          size={16}
                          color={i < (match.recipientRating || 0) ? "#FFD700" : theme.border}
                          style={{ marginLeft: 2 }}
                        />
                      ))}
                    </View>
                  </View>
                )}
                {match.completionNotes && (
                  <View style={[styles.sectionContainer, { flexDirection: 'column', alignItems: 'flex-start', gap: 8 }]}>
                    <Text style={styles.sectionContainer}>Notes</Text>
                    <Text style={styles.sectionContainer}>{match.completionNotes}</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {match.status === "COMPLETED" && (
            <View
              style={{
                backgroundColor: (theme as any).success + "15",
                padding: wp("4%"),
                borderRadius: wp("3%"),
                borderWidth: 1,
                borderColor: (theme as any).success + "30",
                flexDirection: "row",
                alignItems: "center",
                marginTop: hp("2%"),
                marginBottom: hp("2%"),
              }}
            >
              <Feather name="info" size={20} color={(theme as any).success} />
              <Text
                style={{
                  color: (theme as any).success,
                  fontSize: wp("3.5%"),
                  fontWeight: "600",
                  marginLeft: wp("2%"),
                  flex: 1,
                }}
              >
                This is historical data. The match has been completed.
              </Text>
            </View>
          )}

          <MatchInfoCard
            match={match}
            currentUserRole={getCurrentUserRole()}
            getCurrentUserStatus={getCurrentUserStatus}
            getOtherPartyStatus={getOtherPartyStatus}
            otherPartyRole={otherPartyInfo?.role || "Other Party"}
            formatDate={formatDate}
          />

          {otherPartyInfo?.profile && (
            <ProfileCard
              user={otherPartyInfo.profile}
              title={otherPartyInfo.role}
              iconName={otherPartyInfo.role === "Donor" ? "heart" : "user"}
              onViewProfile={viewUserProfile}
              matchingServiceData={otherPartyInfo.data}
              isHistorical={true}
            />
          )}

          <YourDetailsCard
            yourDetails={yourDetails}
            loadingYourDetails={loadingYourDetails}
            userRole={userRole}
          />


          <MapSection
            allLocations={allLocations}
            registeredLocation={registeredLocation}
            currentGpsLocation={currentGpsLocation}
            otherPartyLocation={otherPartyLocation}
            calculatedDistance={calculatedDistance}
            locationPermission={locationPermission}
            loadingLocation={loadingLocation}
            onRequestLocation={getCurrentUserLocation}
            calculateDistance={calculateDistance}
            currentUserRole={getUserRoleInMatch()}
            otherPartyRole={otherPartyInfo?.role as "Donor" | "Recipient" | undefined}
            matchType={match?.matchType}
          />

          <ActionButtons
            canConfirmMatch={canConfirmMatch()}
            canRejectMatch={canRejectMatch()}
            canWithdrawMatch={canWithdrawMatch()}
            canShowCompletion={canShowCompletionButton()}
            confirmingMatch={confirmingMatch}
            actionLoading={actionLoading}
            confirmButtonText={getConfirmationButtonText()}
            theme={theme}
            styles={styles}
            onConfirm={handleConfirmMatch}
            onReject={() => setShowRejectModal(true)}
            onWithdraw={() => setShowWithdrawModal(true)}
            onComplete={() => setShowCompletionModal(true)}
          />
        </ScrollView>

        <RejectModal
          visible={showRejectModal}
          reason={rejectReason}
          actionLoading={actionLoading}
          theme={theme}
          onClose={() => {
            setShowRejectModal(false);
            setRejectReason("");
          }}
          onReasonChange={setRejectReason}
          onConfirm={handleReject}
        />

        <WithdrawModal
          visible={showWithdrawModal}
          reason={withdrawReason}
          actionLoading={actionLoading}
          theme={theme}
          onClose={() => {
            setShowWithdrawModal(false);
            setWithdrawReason("");
          }}
          onReasonChange={setWithdrawReason}
          onConfirm={handleWithdraw}
        />

        <CompletionModal
          visible={showCompletionModal}
          data={completionData}
          actionLoading={actionLoading}
          theme={theme}
          onClose={() => {
            setShowCompletionModal(false);
            setCompletionData({
              receivedDate: new Date().toISOString().split('T')[0],
              notes: "",
              rating: 5,
              hospitalName: "",
            });
          }}
          onDataChange={setCompletionData}
          onConfirm={handleConfirmCompletion}
        />
      </View>

      {navigatingToProfile && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <View
            style={{
              backgroundColor: theme.background,
              padding: 24,
              borderRadius: 12,
              alignItems: "center",
              minWidth: 200,
            }}
          >
            <ActivityIndicator size="large" color={theme.primary} />
            <Text
              style={{
                color: theme.text,
                marginTop: 12,
                fontSize: 16,
                fontWeight: "500",
              }}
            >
              Loading Profile...
            </Text>
          </View>
        </View>
      )}

      <ValidationAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        type={alertType}
        onClose={() => setAlertVisible(false)}
      />
    </AppLayout>
  );
};

export default MatchDetailsScreen;
