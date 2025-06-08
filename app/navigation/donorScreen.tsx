import React, { useEffect, useState } from "react";
import {
  Alert,
  Text,
  Button,
  View,
  ScrollView,
  TextInput,
  Switch,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { AuthProvider, useAuth } from "../utils/auth-context";
import { router, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import styles from "../../constants/styles/dashboardStyles";
import { registerDonor } from "../../scripts/api/donorApi";
import { addDonorRole, refreshAuthTokens } from "../../scripts/api/roleApi";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import AppLayout from "@/components/AppLayout";

const calculateAge = (dobString: string): number => {
  const today = new Date();
  const dob = new Date(dobString);
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};

const DonorScreen: React.FC = () => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("../(auth)/loginScreen");
    }
  }, [isAuthenticated]);
  const [roleLoading, setRoleLoading] = useState(true);
  useEffect(() => {
    const ensureDonorRole = async () => {
      setRoleLoading(true);
      try {
        let rolesString = await SecureStore.getItemAsync("roles");
        let roles: string[] = [];
        try {
          roles = rolesString ? JSON.parse(rolesString) : [];
        } catch {
          roles = [];
        }

        if (!roles.includes("DONOR")) {
          await addDonorRole();
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
          error.message || "Failed to assign donor role"
        );
        router.replace("/(auth)/loginScreen");
        return;
      } finally {
        setRoleLoading(false);
      }
    };

    ensureDonorRole();
  }, []);

  const [loading, setLoading] = useState<boolean>(false);

  const [donorData, setDonorData] = useState<any>(null);

  const [hemoglobinLevel, setHemoglobinLevel] = useState<string>("");
  const [bloodPressure, setBloodPressure] = useState<string>("");
  const [hasDiseases, setHasDiseases] = useState<boolean>(false);
  const [takingMedication, setTakingMedication] = useState<boolean>(false);
  const [diseaseDescription, setDiseaseDescription] = useState<string>("");
  const [recentlyIll, setRecentlyIll] = useState<boolean>(false);
  const [isPregnant, setIsPregnant] = useState<boolean>(false);

  const [dob, setDob] = useState<string>("");
  const [age, setAge] = useState<number | null>(null);
  const [weight, setWeight] = useState<string>("");
  const [weightEligible, setWeightEligible] = useState<boolean>(false);
  const [medicalClearance, setMedicalClearance] = useState<boolean>(false);
  const [recentTattooOrPiercing, setRecentTattooOrPiercing] =
    useState<boolean>(false);
  const [recentTravel, setRecentTravel] = useState<boolean>(false);
  const [recentTravelDetails, setRecentTravelDetails] = useState<string>("");
  const [recentVaccination, setRecentVaccination] = useState<boolean>(false);
  const [recentSurgery, setRecentSurgery] = useState<boolean>(false);
  const [chronicDiseases, setChronicDiseases] = useState<string>("");
  const [allergies, setAllergies] = useState<string>("");
  const [lastDonationDate, setLastDonationDate] = useState<string>("");

  const [isConsented, setIsConsented] = useState<boolean>(false);

  const [city, setCity] = useState<string>("");
  const [stateVal, setStateVal] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [pincode, setPincode] = useState<string>("");

  const [addressLine, setAddressLine] = useState<string>("");
  const [landmark, setLandmark] = useState<string>("");
  const [area, setArea] = useState<string>("");
  const [district, setDistrict] = useState<string>("");

  const [gender, setGender] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [mapRegion, setMapRegion] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | null>(null);

  const [marker, setMarker] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationError("Permission to access location was denied");
        setLocationLoading(false);
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      const region = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setMapRegion(region);
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

  useEffect(() => {
    const loadDonorData = async () => {
      const data = await SecureStore.getItemAsync("donorData");
      if (data) {
        const donor = JSON.parse(data);
        setDonorData(donor);

        setHemoglobinLevel(
          donor.medicalDetails?.hemoglobinLevel?.toString() ?? ""
        );
        setBloodPressure(donor.medicalDetails?.bloodPressure ?? "");
        setHasDiseases(donor.medicalDetails?.hasDiseases ?? false);
        setTakingMedication(donor.medicalDetails?.takingMedication ?? false);
        setDiseaseDescription(donor.medicalDetails?.diseaseDescription ?? "");
        setRecentlyIll(donor.medicalDetails?.recentlyIll ?? false);
        setIsPregnant(donor.medicalDetails?.isPregnant ?? false);

        setDob(donor.eligibilityCriteria?.dob ?? "");
        setAge(donor.eligibilityCriteria?.age ?? null);
        setWeight(
          donor.eligibilityCriteria && donor.eligibilityCriteria.weight != null
            ? donor.eligibilityCriteria.weight.toString()
            : ""
        );
        setWeightEligible(donor.eligibilityCriteria?.weightEligible ?? false);
        setMedicalClearance(
          donor.eligibilityCriteria?.medicalClearance ?? false
        );
        setRecentTattooOrPiercing(
          donor.eligibilityCriteria?.recentTattooOrPiercing ?? false
        );
        setRecentTravel(donor.eligibilityCriteria?.recentTravel ?? false);
        setRecentTravelDetails(
          donor.eligibilityCriteria?.recentTravelDetails ?? ""
        );
        setRecentVaccination(
          donor.eligibilityCriteria?.recentVaccination ?? false
        );
        setRecentSurgery(donor.eligibilityCriteria?.recentSurgery ?? false);
        setChronicDiseases(donor.eligibilityCriteria?.chronicDiseases ?? "");
        setAllergies(donor.eligibilityCriteria?.allergies ?? "");
        setLastDonationDate(donor.eligibilityCriteria?.lastDonationDate ?? "");

        setIsConsented(donor.consentForm?.isConsented ?? false);

        setCity(donor.location?.city ?? "");
        setStateVal(donor.location?.state ?? "");
        setCountry(donor.location?.country ?? "");
        setPincode(donor.location?.pincode ?? "");
      }
    };
    loadDonorData();
  }, []);

  useEffect(() => {
    const w = parseFloat(weight);
    setWeightEligible(!isNaN(w) && w >= 50);
  }, [weight]);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedGender = await SecureStore.getItemAsync("gender");
      if (storedGender) setGender(storedGender);
      const storedUserId = await SecureStore.getItemAsync("userId");
      if (storedUserId) setUserId(storedUserId);
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchDob = async () => {
      const storedDob = await SecureStore.getItemAsync("dob");
      if (storedDob) {
        setDob(storedDob);
        setAge(calculateAge(storedDob));
      }
    };
    fetchDob();
  }, []);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const router = useRouter();
  const params = useLocalSearchParams();
  useEffect(() => {
    if (params.latitude && params.longitude) {
      setLocation({
        latitude: Number(params.latitude),
        longitude: Number(params.longitude),
      });
    }
  }, [params.latitude, params.longitude]);

  const isFormValid = (): boolean => {
    if (
      !hemoglobinLevel ||
      isNaN(Number(hemoglobinLevel)) ||
      !bloodPressure ||
      !weight ||
      isNaN(Number(weight)) ||
      (hasDiseases && !diseaseDescription) ||
      !isConsented ||
      !dob ||
      !age ||
      !addressLine ||
      !landmark ||
      !area ||
      !district ||
      !city ||
      !stateVal ||
      !country ||
      !pincode
    ) {
      return false;
    }
    return true;
  };

  const isFormChanged = () => {
    if (!donorData) return true;

    const current = {
      medicalDetails: {
        hemoglobinLevel: Number(hemoglobinLevel),
        bloodPressure,
        hasDiseases,
        takingMedication,
        diseaseDescription,
        recentlyIll,
        ...(gender && gender.toUpperCase() === "FEMALE" && { isPregnant }),
      },
      eligibilityCriteria: {
        ageEligible: age !== null ? age >= 18 : false,
        age,
        dob,
        weightEligible,
        weight: Number(weight),
        medicalClearance,
        recentTattooOrPiercing,
        recentTravel,
        recentTravelDetails,
        recentVaccination,
        recentSurgery,
        chronicDiseases,
        allergies,
        lastDonationDate: lastDonationDate || null,
      },
      consentForm: {
        userId,
        isConsented,
        consentType: "BLOOD_DONATION",
      },
      location: {
        city,
        state: stateVal,
        country,
        pincode,
      },
    };

    return (
      JSON.stringify(current) !==
      JSON.stringify({
        medicalDetails: donorData.medicalDetails,
        eligibilityCriteria: donorData.eligibilityCriteria,
        consentForm: {
          userId: donorData.consentForm.userId,
          isConsented: donorData.consentForm.isConsented,
          consentType: donorData.consentForm.consentType,
        },
        location: donorData.location,
      })
    );
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      Alert.alert("Incomplete Form", "Please fill all required fields.");
      return;
    }
    setLoading(true);
    try {
      if (!isFormChanged()) {
        Alert.alert(
          "No changes detected",
          "Using previously saved donor details."
        );
        router.replace("/navigation/donateScreen");
        return;
      }

      const payload = {
        registrationDate: new Date().toISOString().slice(0, 10),
        status: "ACTIVE",
        medicalDetails: {
          hemoglobinLevel: Number(hemoglobinLevel),
          bloodPressure,
          hasDiseases,
          takingMedication,
          diseaseDescription,
          recentlyIll,
          ...(gender && gender.toUpperCase() === "FEMALE" && { isPregnant }),
        },
        eligibilityCriteria: {
          ageEligible: age !== null ? age >= 18 : false,
          age,
          dob,
          weightEligible,
          weight: Number(weight),
          medicalClearance,
          recentTattooOrPiercing,
          recentTravel,
          recentTravelDetails,
          recentVaccination,
          recentSurgery,
          chronicDiseases,
          allergies,
          lastDonationDate: lastDonationDate || null,
        },
        consentForm: {
          userId,
          isConsented,
          consentedAt: new Date().toISOString(),
          consentType: "BLOOD_DONATION",
        },
        location: {
          addressLine: addressLine || "",
          landmark: landmark || "",
          area: area || "",
          district: district || "",
          city: city || "",
          state: stateVal || "",
          country: country || "",
          pincode: pincode || "",
          latitude: location?.latitude || 0,
          longitude: location?.longitude || 0,
        },
      };

      const response = await registerDonor(payload);
      if (response && response.id) {
        await SecureStore.setItemAsync("donorId", response.id);
        await SecureStore.setItemAsync("donorData", JSON.stringify(response));
        Alert.alert("Success", "Your donor details have been saved!");
        router.replace("/navigation/donateScreen");
      } else {
        throw new Error(
          "Registration succeeded but donorId missing in response."
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

  return (
    <AuthProvider>
      <AppLayout title="Become a Donor">
        <ScrollView
          style={styles.bg}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.sectionTitle}>Medical Details</Text>
          <TextInput
            style={styles.input}
            placeholder="Hemoglobin Level (g/dL)"
            keyboardType="numeric"
            value={hemoglobinLevel}
            onChangeText={setHemoglobinLevel}
          />
          <TextInput
            style={styles.input}
            placeholder="Blood Pressure (e.g., 120/80)"
            value={bloodPressure}
            onChangeText={setBloodPressure}
          />
          <View style={styles.switchRow}>
            <Text style={styles.label}>Any diseases?</Text>
            <Switch value={hasDiseases} onValueChange={setHasDiseases} />
          </View>
          {hasDiseases && (
            <TextInput
              style={styles.input}
              placeholder="Describe diseases"
              value={diseaseDescription}
              onChangeText={setDiseaseDescription}
            />
          )}
          <View style={styles.switchRow}>
            <Text style={styles.label}>Taking Medication?</Text>
            <Switch
              value={takingMedication}
              onValueChange={setTakingMedication}
            />
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.label}>Recently Ill?</Text>
            <Switch value={recentlyIll} onValueChange={setRecentlyIll} />
          </View>
          {gender && gender.toUpperCase() === "FEMALE" && (
            <View style={styles.switchRow}>
              <Text style={styles.label}>Currently Pregnant?</Text>
              <Switch value={isPregnant} onValueChange={setIsPregnant} />
            </View>
          )}

          <Text style={styles.sectionTitle}>Eligibility Criteria</Text>
          <TextInput
            value={dob}
            editable={false}
            style={{
              backgroundColor: "#f1f2f6",
              color: "#636e72",
              marginBottom: 8,
            }}
          />
          {age !== null && (
            <Text style={{ color: age >= 18 ? "green" : "red" }}>
              Age: {age} ({age >= 18 ? "Eligible" : "Not eligible"})
            </Text>
          )}
          <TextInput
            style={styles.input}
            placeholder="Weight (kg)"
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
          />
          <Text
            style={{
              color: weight ? (weightEligible ? "green" : "red") : "#636e72",
              marginBottom: 8,
            }}
          >
            {weight
              ? weightEligible
                ? "Eligible for donation (weight ≥ 50kg)"
                : "Not eligible (weight < 50kg)"
              : ""}
          </Text>
          <View style={styles.switchRow}>
            <Text style={styles.label}>Medical Clearance?</Text>
            <Switch
              value={medicalClearance}
              onValueChange={setMedicalClearance}
            />
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.label}>Recent Tattoo or Piercing?</Text>
            <Switch
              value={recentTattooOrPiercing}
              onValueChange={setRecentTattooOrPiercing}
            />
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.label}>Recent Travel?</Text>
            <Switch value={recentTravel} onValueChange={setRecentTravel} />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Recent Travel Details"
            value={recentTravelDetails}
            onChangeText={setRecentTravelDetails}
          />
          <View style={styles.switchRow}>
            <Text style={styles.label}>Recent Vaccination?</Text>
            <Switch
              value={recentVaccination}
              onValueChange={setRecentVaccination}
            />
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.label}>Recent Surgery?</Text>
            <Switch value={recentSurgery} onValueChange={setRecentSurgery} />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Chronic Diseases (if any)"
            value={chronicDiseases}
            onChangeText={setChronicDiseases}
          />
          <TextInput
            style={styles.input}
            placeholder="Allergies (if any)"
            value={allergies}
            onChangeText={setAllergies}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Donation Date (YYYY-MM-DD, optional)"
            value={lastDonationDate}
            onChangeText={setLastDonationDate}
          />

          <Text style={styles.sectionTitle}>Consent</Text>
          <View style={styles.switchRow}>
            <Text style={styles.label}>I consent to donate blood</Text>
            <Switch value={isConsented} onValueChange={setIsConsented} />
          </View>

          <Text style={styles.sectionTitle}>Location</Text>
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
            {location && (
              <Text>
                Selected: {location.latitude}, {location.longitude}
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor:
                  isFormValid() && !loading ? "#00b894" : "#b2bec3",
              },
            ]}
            onPress={handleSubmit}
            disabled={!isFormValid() || loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Save Donor Details</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </AppLayout>
    </AuthProvider>
  );
};

export default DonorScreen;
