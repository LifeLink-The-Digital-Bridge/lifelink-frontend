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
import { ValidationAlert } from "../../components/common/ValidationAlert";
import { MapSection } from "../../components/match/MapSection";
import { MatchInfoCard } from "../../components/match/MatchInfoCard";
import { ProfileCard } from "../../components/match/ProfileCard";
import { YourDetailsCard } from "../../components/match/YourDetailsCard";
import { ActionButtons } from "../../components/match/ActionButtons";
import { RejectModal } from "../../components/match/RejectModal";
import { WithdrawModal } from "../../components/match/WithdrawModal";
import { CompletionModal } from "../../components/match/CompletionModal";
import { darkTheme, lightTheme } from "../../constants/styles/authStyles";
import { createUnifiedStyles } from "../../constants/styles/unifiedStyles";
import { useTheme } from "../../utils/theme-context";
import { getStatusColor, formatStatusDisplay } from "../../utils/statusHelpers";
import {
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
  canConfirmCompletion,
  CompletionConfirmationDTO,
  getMatchById,
} from "../api/matchingApi";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

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
  withdrawnBy?: string;
  withdrawnAt?: string;
  withdrawalReason?: string;
  confirmationExpiresAt?: string;
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

  const [gracePeriodTimer, setGracePeriodTimer] = useState<string>('');
  const [reconfirmTimer, setReconfirmTimer] = useState<string>('');
  const [confirmationTimer, setConfirmationTimer] = useState<string>('');

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
      const userRole = getUserRoleInMatch();

      if (userRole === "donor") {
        const donationDetails = await fetchDonationByIdWithAccess(matchData.donationId);
        setYourDetails({ type: "donation", data: donationDetails });
      } else if (userRole === "recipient") {
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

  const refreshMatchDetails = async () => {
    if (!match) return;
    try {
      const updatedMatch = await getMatchById(match.matchResultId);
      setMatch(updatedMatch as MatchDetails);
    } catch (error) {
      console.error("Error refreshing match:", error);
    }
  };

  const handleConfirm = async () => {
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
      await refreshMatchDetails();
    } catch (error: any) {
      const errorMessage = error.message;
      
      if (errorMessage.includes('GRACE_PERIOD_EXPIRED')) {
        showAlert(
          'Action Not Allowed',
          'The grace period has expired. Please contact support.',
          'warning'
        );
      } else if (errorMessage.includes('RECONFIRMATION_EXPIRED')) {
        showAlert(
          'Re-confirmation Expired',
          'The 2-hour re-confirmation window has expired.',
          'warning'
        );
      } else if (errorMessage.includes('ALREADY_CONFIRMED')) {
        showAlert('Already Confirmed', errorMessage, 'info');
      } else {
        showAlert("Confirmation Failed", errorMessage || "Failed to confirm match", "error");
      }
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
      await refreshMatchDetails();
      setShowRejectModal(false);
      setRejectReason("");

      setTimeout(() => router.back(), 2000);
    } catch (error: any) {
      const errorMessage = error.message;
      
      if (errorMessage.includes('GRACE_PERIOD_EXPIRED')) {
        showAlert(
          'Action Not Allowed',
          'The grace period has expired. Please contact support.',
          'warning'
        );
      } else {
        showAlert("Rejection Failed", errorMessage || "Failed to reject match", "error");
      }
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
      await refreshMatchDetails();
      setShowWithdrawModal(false);
      setWithdrawReason("");
    } catch (error: any) {
      const errorMessage = error.message;
      
      if (errorMessage.includes('GRACE_PERIOD_EXPIRED')) {
        showAlert(
          'Action Not Allowed',
          'The grace period has expired. Please contact support.',
          'warning'
        );
      } else {
        showAlert("Withdrawal Failed", errorMessage || "Failed to withdraw confirmation", "error");
      }
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

      await refreshMatchDetails();
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

  useEffect(() => {
    if (!match) return;
    
    const interval = setInterval(() => {
      const now = Date.now();
      
      if (match.status === 'CONFIRMED' && match.withdrawalGracePeriodExpiresAt) {
        const expiryTime = new Date(match.withdrawalGracePeriodExpiresAt).getTime();
        const diff = expiryTime - now;
        
        if (diff > 0) {
          const hours = Math.floor(diff / (60 * 60 * 1000));
          const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
          const seconds = Math.floor((diff % (60 * 1000)) / 1000);
          setGracePeriodTimer(`${hours}h ${minutes}m ${seconds}s to withdraw`);
        } else {
          setGracePeriodTimer('Grace period expired');
        }
      } else {
        setGracePeriodTimer('');
      }
      
      if (match.status === 'WITHDRAWN' && match.reconfirmationWindowExpiresAt) {
        const expiryTime = new Date(match.reconfirmationWindowExpiresAt).getTime();
        const diff = expiryTime - now;
        
        if (diff > 0) {
          const hours = Math.floor(diff / (60 * 60 * 1000));
          const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
          const seconds = Math.floor((diff % (60 * 1000)) / 1000);
          setReconfirmTimer(`${hours}h ${minutes}m ${seconds}s to re-confirm`);
        } else {
          setReconfirmTimer('Re-confirmation window expired');
        }
      } else {
        setReconfirmTimer('');
      }
      
      if ((match.status === 'DONOR_CONFIRMED' || match.status === 'RECIPIENT_CONFIRMED') 
          && match.confirmationExpiresAt) {
        const expiryTime = new Date(match.confirmationExpiresAt).getTime();
        const diff = expiryTime - now;
        
        if (diff > 0) {
          const hours = Math.floor(diff / (60 * 60 * 1000));
          setConfirmationTimer(`${hours} hours for other party to confirm`);
        } else {
          setConfirmationTimer('');
        }
      } else {
        setConfirmationTimer('');
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [match]);

  useEffect(() => {
    if (!match) return;
    
    const pollInterval = setInterval(async () => {
      try {
        const updatedMatch = await getMatchById(match.matchResultId);
        setMatch(updatedMatch as MatchDetails);
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 30000);
    
    return () => clearInterval(pollInterval);
  }, [match?.matchResultId]);

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
    const isTerminalStatus = [
      "REJECTED",
      "EXPIRED",
      "WITHDRAWN",
      "CANCELLED_BY_DONOR",
      "CANCELLED_BY_RECIPIENT",
      "CONFIRMED"
    ].includes(match.status || "");
    return !userConfirmed && !isTerminalStatus;
  };

  const canRejectMatch = (): boolean => {
    if (!match || !currentUserId) return false;
    
    const isTerminalStatus = [
      "REJECTED", 
      "EXPIRED", 
      "WITHDRAWN",
      "CANCELLED_BY_DONOR", 
      "CANCELLED_BY_RECIPIENT"
    ].includes(match.status || "");
    
    return !isTerminalStatus || match.status === "CONFIRMED";
  };

  const canWithdrawMatch = (): boolean => {
    if (!match || !currentUserId) return false;
    const userConfirmed = getCurrentUserStatus();
    const validStatuses = ["DONOR_CONFIRMED", "RECIPIENT_CONFIRMED", "CONFIRMED"];
    return userConfirmed && validStatuses.includes(match.status || "");
  };

  const canReconfirmMatch = (): boolean => {
    if (!match || !currentUserId || match.status !== 'WITHDRAWN') return false;
    
    const userRole = getUserRoleInMatch();
    const withdrawnBy = match.withdrawnBy;
    
    if ((userRole === 'donor' && withdrawnBy !== 'DONOR') || 
        (userRole === 'recipient' && withdrawnBy !== 'RECIPIENT')) {
      return false;
    }
    
    if (!match.reconfirmationWindowExpiresAt) return false;
    
    const expiryTime = new Date(match.reconfirmationWindowExpiresAt).getTime();
    return Date.now() < expiryTime;
  };

  const canShowCompletionButton = (): boolean => {
    if (!match || !currentUserId) return false;
    return getUserRoleInMatch() === "recipient" &&
      match.status === "CONFIRMED" &&
      !match.completedAt &&
      match.canConfirmCompletion !== false;
  };

  const getConfirmationButtonText = (): string => {
    if (match?.status === 'WITHDRAWN') {
      return `Re-confirm as ${getCurrentUserRole()}`;
    }
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
          pathname: "/navigation/detailedProfile",
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
          {gracePeriodTimer && match.status === 'CONFIRMED' && (
            <View style={{
              backgroundColor: (theme as any).warning + '20',
              padding: wp("3%"),
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: hp("2%"),
              borderLeftWidth: 4,
              borderLeftColor: (theme as any).warning,
            }}>
              <Feather name="clock" size={20} color={(theme as any).warning} />
              <Text style={{ color: (theme as any).warning, marginLeft: 8, flex: 1 }}>{gracePeriodTimer}</Text>
            </View>
          )}

          {reconfirmTimer && match.status === 'WITHDRAWN' && (
            <View style={{
              backgroundColor: (theme as any).info + '20',
              padding: wp("3%"),
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: hp("2%"),
              borderLeftWidth: 4,
              borderLeftColor: (theme as any).info,
            }}>
              <Feather name="alert-circle" size={20} color={(theme as any).info} />
              <Text style={{ color: (theme as any).info, marginLeft: 8, flex: 1 }}>{reconfirmTimer}</Text>
            </View>
          )}

          {confirmationTimer && (match.status === 'DONOR_CONFIRMED' || match.status === 'RECIPIENT_CONFIRMED') && (
            <View style={{
              backgroundColor: theme.primary + '20',
              padding: wp("3%"),
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: hp("2%"),
              borderLeftWidth: 4,
              borderLeftColor: theme.primary,
            }}>
              <Feather name="info" size={20} color={theme.primary} />
              <Text style={{ color: theme.primary, marginLeft: 8, flex: 1 }}>{confirmationTimer}</Text>
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
            canReconfirmMatch={canReconfirmMatch()}
            canShowCompletion={canShowCompletionButton()}
            confirmingMatch={confirmingMatch}
            actionLoading={actionLoading}
            confirmButtonText={getConfirmationButtonText()}
            theme={theme}
            styles={styles}
            onConfirm={handleConfirm}
            onReconfirm={handleConfirm}
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
