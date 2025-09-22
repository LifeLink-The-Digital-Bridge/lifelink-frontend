import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
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
  getDonorByUserId,
  getRecipientByUserId,
  getMatchConfirmationStatus,
  fetchRecipientHistoryByMatchId,
  fetchDonorHistoryByMatchId,
} from "../api/matchingApi";
import { InfoRow } from "../../components/match/InfoRow";
import { ProfileCard } from "../../components/match/ProfileCard";
import { MatchInfoCard } from "../../components/match/MatchInfoCard";
import { YourDetailsCard } from "../../components/match/YourDetailsCard";
import { HistorySection } from "../../components/match/HistorySection";
import { MapSection } from "../../components/match/MapSection";

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

  const [match, setMatch] = useState<MatchDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmingMatch, setConfirmingMatch] = useState(false);
  const [navigatingToProfile, setNavigatingToProfile] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [donorProfile, setDonorProfile] = useState<UserProfile | null>(null);
  const [recipientProfile, setRecipientProfile] = useState<UserProfile | null>(
    null
  );

  const [donorCurrentData, setDonorCurrentData] = useState<any>(null);
  const [recipientCurrentData, setRecipientCurrentData] = useState<any>(null);

  const [donorHistoryData, setDonorHistoryData] = useState<any>(null);
  const [recipientHistoryData, setRecipientHistoryData] = useState<any>(null);

  const [loadingHistory, setLoadingHistory] = useState(false);
  const [yourDetails, setYourDetails] = useState<any>(null);
  const [loadingYourDetails, setLoadingYourDetails] = useState(false);

  const [currentLocation, setCurrentLocation] =
    useState<LocationCoordinates | null>(null);
  const [destinationLocation, setDestinationLocation] =
    useState<LocationCoordinates | null>(null);
  const [calculatedDistance, setCalculatedDistance] = useState<number | null>(
    null
  );
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const [currentGpsLocation, setCurrentGpsLocation] =
    useState<LocationCoordinates | null>(null);
  const [registeredLocation, setRegisteredLocation] =
    useState<LocationCoordinates | null>(null);
  const [otherPartyLocation, setOtherPartyLocation] =
    useState<LocationCoordinates | null>(null);
  const [allLocations, setAllLocations] = useState<LocationCoordinates[]>([]);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<
    "success" | "error" | "warning" | "info"
  >("info");

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
    const distance = R * c;
    return distance;
  };

  const isSignificantlyDifferent = (
    loc1: LocationCoordinates,
    loc2: LocationCoordinates,
    threshold = 0.1
  ) => {
    const distance = calculateDistance(
      loc1.latitude,
      loc1.longitude,
      loc2.latitude,
      loc2.longitude
    );
    return distance > threshold;
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

  const extractRegisteredLocation = (userData: any, userRole: string) => {
    if (!userData) return null;

    let coords = null;
    let address = "";

    if (userData.addresses && userData.addresses.length > 0) {
      const primaryAddress = userData.addresses[0];
      if (primaryAddress.latitude && primaryAddress.longitude) {
        coords = {
          latitude: parseFloat(primaryAddress.latitude),
          longitude: parseFloat(primaryAddress.longitude),
        };
        address = `${primaryAddress.addressLine || ""}, ${
          primaryAddress.city || ""
        }`
          .trim()
          .replace(/^,\s*/, "");
      }
    } else if (
      userData.usedLocationLatitude &&
      userData.usedLocationLongitude
    ) {
      coords = {
        latitude: parseFloat(userData.usedLocationLatitude),
        longitude: parseFloat(userData.usedLocationLongitude),
      };
      address = `${userData.usedLocationAddressLine || ""}, ${
        userData.usedLocationCity || ""
      }`
        .trim()
        .replace(/^,\s*/, "");
    }

    if (coords && !isNaN(coords.latitude) && !isNaN(coords.longitude)) {
      return {
        latitude: coords.latitude,
        longitude: coords.longitude,
        title: "Your Registered Location",
        description: "Location from your profile",
        address: address,
        type: "registered" as const,
      };
    }

    return null;
  };

  const getOtherPartyLocation = (
    matchData: MatchDetails,
    userRole: string,
    otherPartyData: any
  ): LocationCoordinates | null => {
    let coords = null;
    let title = "";
    let address = "";

    try {
      if (userRole === "donor") {
        title = `${recipientProfile?.name || "Recipient"}'s Location`;

        if (matchData.isConfirmed && otherPartyData) {
          if (otherPartyData.receiveRequestSnapshot) {
            const snapshot = otherPartyData.receiveRequestSnapshot;
            if (
              snapshot.usedLocationLatitude &&
              snapshot.usedLocationLongitude
            ) {
              coords = {
                latitude: parseFloat(snapshot.usedLocationLatitude),
                longitude: parseFloat(snapshot.usedLocationLongitude),
              };
              address = `${snapshot.usedLocationAddressLine || ""}, ${
                snapshot.usedLocationCity || ""
              }`
                .trim()
                .replace(/^,\s*/, "");
            }
          }
        } else if (yourDetails?.data) {
          if (
            yourDetails.data.usedLocationLatitude &&
            yourDetails.data.usedLocationLongitude
          ) {
            coords = {
              latitude: parseFloat(yourDetails.data.usedLocationLatitude),
              longitude: parseFloat(yourDetails.data.usedLocationLongitude),
            };
            address = `${yourDetails.data.usedLocationAddressLine || ""}, ${
              yourDetails.data.usedLocationCity || ""
            }`
              .trim()
              .replace(/^,\s*/, "");
          }
        }
      } else if (userRole === "recipient") {
        title = `${donorProfile?.name || "Donor"}'s Location`;

        if (matchData.isConfirmed && otherPartyData) {
          if (otherPartyData.donationSnapshot) {
            const snapshot = otherPartyData.donationSnapshot;
            if (
              snapshot.usedLocationLatitude &&
              snapshot.usedLocationLongitude
            ) {
              coords = {
                latitude: parseFloat(snapshot.usedLocationLatitude),
                longitude: parseFloat(snapshot.usedLocationLongitude),
              };
              address = `${snapshot.usedLocationAddressLine || ""}, ${
                snapshot.usedLocationCity || ""
              }`
                .trim()
                .replace(/^,\s*/, "");
            }
          }
        } else if (yourDetails?.data) {
          if (
            yourDetails.data.usedLocationLatitude &&
            yourDetails.data.usedLocationLongitude
          ) {
            coords = {
              latitude: parseFloat(yourDetails.data.usedLocationLatitude),
              longitude: parseFloat(yourDetails.data.usedLocationLongitude),
            };
            address = `${yourDetails.data.usedLocationAddressLine || ""}, ${
              yourDetails.data.usedLocationCity || ""
            }`
              .trim()
              .replace(/^,\s*/, "");
          }
        }
      }

      if (coords && !isNaN(coords.latitude) && !isNaN(coords.longitude)) {
        return {
          latitude: coords.latitude,
          longitude: coords.longitude,
          title: title,
          address: address,
          description: matchData.isConfirmed
            ? "Their registered location"
            : "Their current location",
          type: "other",
        };
      }
    } catch (error) {
      console.error("❌ Error extracting other party location:", error);
    }

    return null;
  };

  const getDestinationLocation = (
    matchData: MatchDetails,
    userRole: string,
    otherPartyData: any
  ) => {
    let destinationCoords: LocationCoordinates | null = null;
    let destinationTitle = "";

    console.log("🎯 DEBUG - getDestinationLocation called:", {
      userRole,
      isConfirmed: matchData.isConfirmed,
      hasOtherPartyData: !!otherPartyData,
      hasYourDetails: !!yourDetails,
      yourDetailsType: yourDetails?.type,
    });

    try {
      if (userRole === "donor") {
        destinationTitle = `${recipientProfile?.name || "Recipient"} Location`;

        if (matchData.isConfirmed && otherPartyData) {
          console.log("📍 Checking historical recipient data:", {
            hasReceiveRequestSnapshot: !!otherPartyData.receiveRequestSnapshot,
            otherPartyDataKeys: Object.keys(otherPartyData),
          });

          let coords = null;

          if (otherPartyData.receiveRequestSnapshot) {
            const snapshot = otherPartyData.receiveRequestSnapshot;
            if (
              snapshot.usedLocationLatitude &&
              snapshot.usedLocationLongitude
            ) {
              coords = {
                latitude: parseFloat(snapshot.usedLocationLatitude),
                longitude: parseFloat(snapshot.usedLocationLongitude),
                address: `${snapshot.usedLocationAddressLine || ""}, ${
                  snapshot.usedLocationCity || ""
                }`
                  .trim()
                  .replace(/^,\s*/, ""),
              };
            }
          }

          if (
            !coords &&
            otherPartyData.usedLocationLatitude &&
            otherPartyData.usedLocationLongitude
          ) {
            coords = {
              latitude: parseFloat(otherPartyData.usedLocationLatitude),
              longitude: parseFloat(otherPartyData.usedLocationLongitude),
              address: `${otherPartyData.usedLocationAddressLine || ""}, ${
                otherPartyData.usedLocationCity || ""
              }`
                .trim()
                .replace(/^,\s*/, ""),
            };
          }

          if (coords && !isNaN(coords.latitude) && !isNaN(coords.longitude)) {
            destinationCoords = {
              latitude: coords.latitude,
              longitude: coords.longitude,
              title: destinationTitle,
              address: coords.address,
            };
          }
        } else if (!matchData.isConfirmed && yourDetails?.data) {
          console.log("📍 Checking current recipient data from yourDetails:", {
            yourDetailsType: yourDetails.type,
            hasLatLng: !!(
              yourDetails.data.usedLocationLatitude &&
              yourDetails.data.usedLocationLongitude
            ),
          });

          if (
            yourDetails.data.usedLocationLatitude &&
            yourDetails.data.usedLocationLongitude
          ) {
            destinationCoords = {
              latitude: parseFloat(yourDetails.data.usedLocationLatitude),
              longitude: parseFloat(yourDetails.data.usedLocationLongitude),
              title: destinationTitle,
              address: `${yourDetails.data.usedLocationAddressLine || ""}, ${
                yourDetails.data.usedLocationCity || ""
              }`
                .trim()
                .replace(/^,\s*/, ""),
            };
          }
        }
      } else if (userRole === "recipient") {
        destinationTitle = `${donorProfile?.name || "Donor"} Location`;

        if (matchData.isConfirmed && otherPartyData) {
          console.log("📍 Checking historical donor data:", {
            hasDonationSnapshot: !!otherPartyData.donationSnapshot,
            otherPartyDataKeys: Object.keys(otherPartyData),
          });

          let coords = null;

          if (otherPartyData.donationSnapshot) {
            const snapshot = otherPartyData.donationSnapshot;
            if (
              snapshot.usedLocationLatitude &&
              snapshot.usedLocationLongitude
            ) {
              coords = {
                latitude: parseFloat(snapshot.usedLocationLatitude),
                longitude: parseFloat(snapshot.usedLocationLongitude),
                address: `${snapshot.usedLocationAddressLine || ""}, ${
                  snapshot.usedLocationCity || ""
                }`
                  .trim()
                  .replace(/^,\s*/, ""),
              };
            }
          }

          if (
            !coords &&
            otherPartyData.usedLocationLatitude &&
            otherPartyData.usedLocationLongitude
          ) {
            coords = {
              latitude: parseFloat(otherPartyData.usedLocationLatitude),
              longitude: parseFloat(otherPartyData.usedLocationLongitude),
              address: `${otherPartyData.usedLocationAddressLine || ""}, ${
                otherPartyData.usedLocationCity || ""
              }`
                .trim()
                .replace(/^,\s*/, ""),
            };
          }

          if (coords && !isNaN(coords.latitude) && !isNaN(coords.longitude)) {
            destinationCoords = {
              latitude: coords.latitude,
              longitude: coords.longitude,
              title: destinationTitle,
              address: coords.address,
            };
          }
        } else if (!matchData.isConfirmed && yourDetails?.data) {
          console.log("📍 Checking current donor data from yourDetails:", {
            yourDetailsType: yourDetails.type,
            hasLatLng: !!(
              yourDetails.data.usedLocationLatitude &&
              yourDetails.data.usedLocationLongitude
            ),
          });

          if (
            yourDetails.data.usedLocationLatitude &&
            yourDetails.data.usedLocationLongitude
          ) {
            destinationCoords = {
              latitude: parseFloat(yourDetails.data.usedLocationLatitude),
              longitude: parseFloat(yourDetails.data.usedLocationLongitude),
              title: destinationTitle,
              address: `${yourDetails.data.usedLocationAddressLine || ""}, ${
                yourDetails.data.usedLocationCity || ""
              }`
                .trim()
                .replace(/^,\s*/, ""),
            };
          }
        }
      }

      console.log("🗺️ Final destination coordinates:", {
        found: !!destinationCoords,
        coordinates: destinationCoords,
        title: destinationTitle,
      });
    } catch (error) {
      console.error("❌ Error extracting destination location:", error);
    }

    return destinationCoords;
  };

  const updateLocationData = () => {
    if (!match || !currentUserId) return;

    const userRole = getUserRoleInMatch();
    const otherPartyData =
      userRole === "donor"
        ? recipientHistoryData || recipientCurrentData
        : donorHistoryData || donorCurrentData;

    const currentUserData =
      userRole === "donor" ? donorCurrentData : recipientCurrentData;
    const registered = extractRegisteredLocation(currentUserData, userRole);
    setRegisteredLocation(registered);

    const otherLocation = getOtherPartyLocation(
      match,
      userRole,
      otherPartyData
    );
    setOtherPartyLocation(otherLocation);

    const locations: LocationCoordinates[] = [];

    if (otherLocation) {
      locations.push(otherLocation);
    }

    if (registered) {
      locations.push(registered);
    }

    if (currentGpsLocation) {
      if (
        !registered ||
        isSignificantlyDifferent(registered, currentGpsLocation)
      ) {
        locations.push(currentGpsLocation);
      }
    }

    setAllLocations(locations);

    if (registered && otherLocation) {
      const distanceFromRegistered = calculateDistance(
        registered.latitude,
        registered.longitude,
        otherLocation.latitude,
        otherLocation.longitude
      );

      let distanceFromCurrent = null;
      if (currentGpsLocation) {
        distanceFromCurrent = calculateDistance(
          currentGpsLocation.latitude,
          currentGpsLocation.longitude,
          otherLocation.latitude,
          otherLocation.longitude
        );
      }

      setCalculatedDistance(distanceFromRegistered);

      console.log("📏 Distance calculations:", {
        fromRegistered: distanceFromRegistered.toFixed(2) + "km",
        fromCurrent: distanceFromCurrent
          ? distanceFromCurrent.toFixed(2) + "km"
          : "N/A",
      });
    }
  };

  const loadHistoricalData = async (
    matchData: MatchDetails,
    userId: string | null
  ) => {
    if (!matchData?.isConfirmed || !userId) return;

    setLoadingHistory(true);
    try {
      const userRole =
        matchData.donorUserId === userId
          ? "donor"
          : matchData.recipientUserId === userId
          ? "recipient"
          : "unknown";

      if (userRole === "donor") {
        const recipientHistory = await fetchRecipientHistoryByMatchId(
          matchData.matchResultId
        );
        console.log("📜 Recipient history loaded:", recipientHistory);
        if (recipientHistory && recipientHistory.length > 0) {
          const structuredData = {
            ...recipientHistory[0],
            isHistoricalData: true,
            matchSpecific: true,
          };
          setRecipientHistoryData(structuredData);
        }
      } else if (userRole === "recipient") {
        const donorHistory = await fetchDonorHistoryByMatchId(
          matchData.matchResultId
        );
        console.log("📜 Donor history loaded:", donorHistory);
        if (donorHistory && donorHistory.length > 0) {
          const structuredData = {
            ...donorHistory[0],
            isHistoricalData: true,
            matchSpecific: true,
          };
          setDonorHistoryData(structuredData);
        }
      }
    } catch (error: any) {
      console.log(
        "Could not load match-specific historical data:",
        error.message
      );
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (
      match &&
      currentUserId &&
      donorProfile &&
      recipientProfile &&
      (yourDetails ||
        (match.isConfirmed && (donorHistoryData || recipientHistoryData)))
    ) {
      updateLocationData();
    }
  }, [
    match,
    currentUserId,
    donorProfile,
    recipientProfile,
    yourDetails,
    donorHistoryData,
    recipientHistoryData,
    currentLocation,
  ]);

  useEffect(() => {
    getCurrentUserLocation();
  }, []);

  const loadCurrentData = async (matchData: MatchDetails) => {
    if (matchData.isConfirmed) return;

    try {
      const [donorDetails, recipientDetails] = await Promise.all([
        getDonorByUserId(matchData.donorUserId),
        getRecipientByUserId(matchData.recipientUserId),
      ]);
      setDonorCurrentData(donorDetails);
      setRecipientCurrentData(recipientDetails);
      console.log("🔄 Current data loaded:", {
        donorDetails,
        recipientDetails,
      });
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
          const confirmed = await getMatchConfirmationStatus(
            parsedMatch.matchResultId
          );
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
        showAlert(
          "Error",
          error.message || "Failed to load match details",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    loadMatchDetails();
  }, [matchData]);

  const loadYourDetails = async (
    match: MatchDetails,
    userId: string | null
  ) => {
    if (!userId) return;

    setLoadingYourDetails(true);
    try {
      if (match.donorUserId === userId) {
        const requestDetails = await fetchRequestByIdWithAccess(
          match.receiveRequestId
        );
        setYourDetails({ type: "request", data: requestDetails });
        console.log("📝 Your details loaded (request):", requestDetails);
      } else if (match.recipientUserId === userId) {
        const donationDetails = await fetchDonationByIdWithAccess(
          match.donationId
        );
        setYourDetails({ type: "donation", data: donationDetails });
        console.log("📝 Your details loaded (donation):", donationDetails);
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
    return role === "donor"
      ? "Donor"
      : role === "recipient"
      ? "Recipient"
      : "Unknown";
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

  const viewUserProfile = async (userId: string, userName: string) => {
    setNavigatingToProfile(true);

    try {
      const otherPartyInfo = getOtherPartyInfo();

      setTimeout(() => {
        router.push({
          pathname: "/navigation/detailedProfile",
          params: {
            userProfile: JSON.stringify(otherPartyInfo?.profile),
            historicalData: JSON.stringify(otherPartyInfo?.data),
            matchData: JSON.stringify(yourDetails?.data),
            userRole: otherPartyInfo?.role,
            isHistorical: match?.isConfirmed.toString(),
            matchId: match?.matchResultId,
          },
        });
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
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => router.back()}
          >
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
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Feather name="arrow-left" size={20} color={theme.text} />
          </TouchableOpacity>

          <View style={styles.headerIconContainer}>
            <Feather name="link" size={28} color={theme.primary} />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Match Details</Text>
            <Text style={styles.headerSubtitle}>
              #{match.matchResultId.slice(0, 8)}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: match.isConfirmed
                  ? theme.success + "20"
                  : theme.error + "20",
                borderColor: match.isConfirmed
                  ? theme.success + "40"
                  : theme.error + "40",
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

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
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
              historicalData={otherPartyInfo.data}
              isHistorical={match.isConfirmed}
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
            otherPartyRole={
              otherPartyInfo?.role as "Donor" | "Recipient" | undefined
            }
            matchType={match?.matchType}
          />

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
          <View
            style={[styles.submitButtonContainer, { paddingHorizontal: 24 }]}
          >
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
                <Text style={styles.submitButtonText}>
                  {getConfirmationButtonText()}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}

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
      </View>
    </AppLayout>
  );
};

export default MatchDetailsScreen;
