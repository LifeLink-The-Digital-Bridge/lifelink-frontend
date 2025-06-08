import React, { useEffect, useState } from "react";
import {
  Alert,
  Text,
  View,
  ScrollView,
  TextInput,
  Switch,
  TouchableOpacity,
  ActivityIndicator,
  Button,
} from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import styles from "../../constants/styles/dashboardStyles";
import { registerRecipient } from "../../scripts/api/recipientApi";
import { addRecipientRole, refreshAuthTokens } from "../../scripts/api/roleApi";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import AppLayout from "@/components/AppLayout";
import { useAuth } from "../utils/auth-context";
import { Picker } from "@react-native-picker/picker";

const RecipientScreen: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [roleLoading, setRoleLoading] = useState(true);
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("../(auth)/loginScreen");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const ensureRecipientRole = async () => {
      setRoleLoading(true);
      try {
        let rolesString = await SecureStore.getItemAsync("roles");
        let roles: string[] = [];
        try {
          roles = rolesString ? JSON.parse(rolesString) : [];
        } catch {
          roles = [];
        }
        if (!roles.includes("RECIPIENT")) {
          await addRecipientRole();
          const newTokens = await refreshAuthTokens();
          await Promise.all([
            SecureStore.setItemAsync("jwt", newTokens.accessToken),
            SecureStore.setItemAsync("refreshToken", newTokens.refreshToken),
            SecureStore.setItemAsync("email", newTokens.email),
            SecureStore.setItemAsync("username", newTokens.username),
            SecureStore.setItemAsync("roles", JSON.stringify(newTokens.roles)),
            SecureStore.setItemAsync("userId", newTokens.id),
            SecureStore.setItemAsync("gender", newTokens.gender),
            SecureStore.setItemAsync("dob", newTokens.dob),
          ]);
        }
      } catch (error: any) {
        Alert.alert(
          "Role Error",
          error.message || "Failed to assign recipient role"
        );
        router.replace("/(auth)/loginScreen");
        return;
      } finally {
        setRoleLoading(false);
      }
    };
    ensureRecipientRole();
  }, []);

  const [loading, setLoading] = useState(false);
  const [recipientData, setRecipientData] = useState<any>(null);

  const [mapRegion, setMapRegion] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);

  const [availability, setAvailability] = useState("AVAILABLE");
  const [diagnosis, setDiagnosis] = useState("");
  const [allergies, setAllergies] = useState("");
  const [currentMedications, setCurrentMedications] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [medicallyEligible, setMedicallyEligible] = useState(true);
  const [legalClearance, setLegalClearance] = useState(true);
  const [eligibilityNotes, setEligibilityNotes] = useState("");
  const [lastReviewed, setLastReviewed] = useState("");
  const [isConsented, setIsConsented] = useState(false);
  const [consentedAt, setConsentedAt] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [landmark, setLandmark] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [country, setCountry] = useState("");
  const [pincode, setPincode] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  useEffect(() => {
    const loadRecipientData = async () => {
      const data = await SecureStore.getItemAsync("recipientData");
      if (data) {
        const recipient = JSON.parse(data);
        setRecipientData(recipient);
        setAvailability(recipient.availability || "AVAILABLE");
        setDiagnosis(recipient.medicalDetails?.diagnosis || "");
        setAllergies(recipient.medicalDetails?.allergies || "");
        setCurrentMedications(
          recipient.medicalDetails?.currentMedications || ""
        );
        setAdditionalNotes(recipient.medicalDetails?.additionalNotes || "");
        setMedicallyEligible(
          recipient.eligibilityCriteria?.medicallyEligible ?? true
        );
        setLegalClearance(
          recipient.eligibilityCriteria?.legalClearance ?? true
        );
        setEligibilityNotes(recipient.eligibilityCriteria?.notes || "");
        setLastReviewed(recipient.eligibilityCriteria?.lastReviewed || "");
        setIsConsented(recipient.consentForm?.isConsented ?? false);
        setConsentedAt(recipient.consentForm?.consentedAt || "");
        setAddressLine(recipient.location?.addressLine || "");
        setLandmark(recipient.location?.landmark || "");
        setArea(recipient.location?.area || "");
        setCity(recipient.location?.city || "");
        setDistrict(recipient.location?.district || "");
        setStateVal(recipient.location?.state || "");
        setCountry(recipient.location?.country || "");
        setPincode(recipient.location?.pincode || "");
        setLatitude(recipient.location?.latitude || null);
        setLongitude(recipient.location?.longitude || null);
      }
    };
    loadRecipientData();
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationError("Permission to access location was denied");
        setLocationLoading(false);
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLatitude(loc.coords.latitude);
      setLongitude(loc.coords.longitude);
      setMapRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setMarker({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      setLocationLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (marker) {
      (async () => {
        let [place] = await Location.reverseGeocodeAsync(marker);
        setCity(place.city || "");
        setStateVal(place.region || "");
        setCountry(place.country || "");
        setPincode(place.postalCode || "");
      })();
    }
  }, [marker]);

  const isFormValid = (): boolean => {
    return (
      !!diagnosis &&
      !!addressLine &&
      !!city &&
      !!stateVal &&
      !!country &&
      !!pincode &&
      isConsented &&
      latitude !== null &&
      longitude !== null
    );
  };
  const BLOOD_TYPES = [
    "A_POSITIVE",
    "A_NEGATIVE",
    "B_POSITIVE",
    "B_NEGATIVE",
    "O_POSITIVE",
    "O_NEGATIVE",
    "AB_POSITIVE",
    "AB_NEGATIVE",
  ];
  const ORGAN_TYPES = [
    "HEART",
    "LIVER",
    "KIDNEY",
    "LUNG",
    "PANCREAS",
    "INTESTINE",
  ];
  const handleSubmit = async () => {
    if (!isFormValid()) {
      Alert.alert(
        "Incomplete Form",
        "Please fill all required fields and consent."
      );
      return;
    }
    setLoading(true);
    try {
      const userId = await SecureStore.getItemAsync("userId");
      if (!userId) {
        Alert.alert("Error", "User ID not found. Please log in again.");
        setLoading(false);
        return;
      }
      const payload = {
        availability,
        location: {
          addressLine,
          landmark,
          area,
          city,
          district,
          state: stateVal,
          country,
          pincode,
          latitude: latitude!,
          longitude: longitude!,
        },
        medicalDetails: {
          diagnosis,
          allergies,
          currentMedications,
          additionalNotes,
        },
        eligibilityCriteria: {
          medicallyEligible,
          legalClearance,
          notes: eligibilityNotes,
          lastReviewed: lastReviewed || new Date().toISOString().slice(0, 10),
        },
        consentForm: {
          userId,
          isConsented,
          consentedAt: consentedAt || new Date().toISOString(),
        },
      };
      const response = await registerRecipient(payload);
      if (response && response.id) {
        await SecureStore.setItemAsync("recipientId", response.id);
        await SecureStore.setItemAsync(
          "recipientData",
          JSON.stringify(response)
        );
        Alert.alert("Success", "Your recipient details have been saved!");
        router.replace("/navigation/RecipientRequestScreen");
      } else {
        throw new Error(
          "Registration succeeded but recipientId missing in response."
        );
      }
    } catch (error: any) {
      Alert.alert(
        "Registration Failed",
        error.message || "Something went wrong!"
      );
    } finally {
      setLoading(false);
    }
  };

  if (roleLoading || locationLoading) {
    return (
      <AppLayout title="Become a Recipient">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0984e3" />
          <Text>Loading...</Text>
        </View>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Become a Recipient">
      <ScrollView
        style={styles.bg}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionTitle}>Recipient Registration</Text>

        <TextInput
          style={styles.input}
          placeholder="Diagnosis"
          value={diagnosis}
          onChangeText={setDiagnosis}
        />
        <TextInput
          style={styles.input}
          placeholder="Allergies"
          value={allergies}
          onChangeText={setAllergies}
        />
        <TextInput
          style={styles.input}
          placeholder="Current Medications"
          value={currentMedications}
          onChangeText={setCurrentMedications}
        />
        <TextInput
          style={styles.input}
          placeholder="Additional Notes"
          value={additionalNotes}
          onChangeText={setAdditionalNotes}
        />
        <View style={styles.switchRow}>
          <Text style={styles.label}>Medically Eligible?</Text>
          <Switch
            value={medicallyEligible}
            onValueChange={setMedicallyEligible}
          />
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.label}>Legal Clearance?</Text>
          <Switch value={legalClearance} onValueChange={setLegalClearance} />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Eligibility Notes"
          value={eligibilityNotes}
          onChangeText={setEligibilityNotes}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Reviewed (YYYY-MM-DD)"
          value={lastReviewed}
          onChangeText={setLastReviewed}
        />
        <View style={styles.switchRow}>
          <Text style={styles.label}>Consent to be a recipient?</Text>
          <Switch value={isConsented} onValueChange={setIsConsented} />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Address Line"
          value={addressLine}
          onChangeText={setAddressLine}
        />
        <TextInput
          style={styles.input}
          placeholder="Landmark"
          value={landmark}
          onChangeText={setLandmark}
        />
        <TextInput
          style={styles.input}
          placeholder="Area"
          value={area}
          onChangeText={setArea}
        />
        <TextInput
          style={styles.input}
          placeholder="District"
          value={district}
          onChangeText={setDistrict}
        />
        <TextInput
          style={styles.input}
          placeholder="City"
          value={city}
          onChangeText={setCity}
        />
        <TextInput
          style={styles.input}
          placeholder="State"
          value={stateVal}
          onChangeText={setStateVal}
        />
        <TextInput
          style={styles.input}
          placeholder="Country"
          value={country}
          onChangeText={setCountry}
        />
        <TextInput
          style={styles.input}
          placeholder="Pincode"
          value={pincode}
          onChangeText={setPincode}
        />
        <View>
          <Button
            title={location ? "Change Location" : "Pick Location on Map"}
            onPress={() => router.push("/navigation/mapScreen")}
          />
          {latitude !== null && longitude !== null && (
            <Text>
              Selected: {latitude}, {longitude}
            </Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Save Recipient Details</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </AppLayout>
  );
};

export default RecipientScreen;
