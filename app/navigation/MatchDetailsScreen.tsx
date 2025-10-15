import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Animated,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import * as Location from "expo-location";
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
  getMatchConfirmationStatus,
  getDonorSnapshotByDonation,
  getRecipientSnapshotByRequest,
} from "../api/matchingApi";
import { ProfileCard } from "../../components/match/ProfileCard";
import { MatchInfoCard } from "../../components/match/MatchInfoCard";
import { YourDetailsCard } from "../../components/match/YourDetailsCard";
import { MapSection } from "../../components/match/MapSection";
import { StatusHeader } from "@/components/common/StatusHeader";

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
        Alert.alert(
          "Permission Denied",
          "Location permission is required to show distance and directions."
        );
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
      Alert.alert("Location Error", "Could not get your current location.");
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
    if (otherLocation) locations.push(otherLocation);
    if (registered) locations.push(registered);
    if (currentGpsLocation) locations.push(currentGpsLocation);

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
    if (!userId) {
      console.log("No userId provided");
      return;
    }
    setLoadingYourDetails(true);
    try {
      let userRole: "donor" | "recipient" | "unknown" = "unknown";
      if (userId === matchData.donorUserId) {
        userRole = "donor";
      } else if (userId === matchData.recipientUserId) {
        userRole = "recipient";
      }

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

        let donorSnapshotData = null;
        let recipientSnapshotData = null;

        if (userId === parsedMatch.donorUserId) {
          recipientSnapshotData = await getRecipientSnapshotByRequest(parsedMatch.receiveRequestId);
        } else if (userId === parsedMatch.recipientUserId) {
          donorSnapshotData = await getDonorSnapshotByDonation(parsedMatch.donationId);
        }


        setDonorProfile(donorProfile);
        setRecipientProfile(recipientProfile);
        setDonorSnapshot(donorSnapshotData);
        setRecipientSnapshot(recipientSnapshotData);

        console.log("✅ Immutable snapshots loaded:", {
          donorSnapshot: !!donorSnapshotData,
          recipientSnapshot: !!recipientSnapshotData,
          donationId: parsedMatch.donationId,
          requestId: parsedMatch.receiveRequestId,
        });

        await loadYourDetails(parsedMatch, userId);
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
            statusText={match.isConfirmed ? "Confirmed" : "Pending"}
            statusColor={match.isConfirmed ? theme.success : theme.error}
            showBackButton
            onBackPress={handleBackPress}
            theme={theme}
          />
        </Animated.View>

        <ScrollView
          contentContainerStyle={{
            paddingTop: HEADER_HEIGHT + 10,
            paddingHorizontal: 20,
            paddingBottom: canConfirmMatch() ? 140 : 40,
          }}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
        >
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

          {canConfirmMatch() && (
            <View style={{ marginTop: 20 }}>
              <TouchableOpacity
                style={[styles.submitButton, confirmingMatch ? styles.submitButtonDisabled : null]}
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
        </ScrollView>
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
