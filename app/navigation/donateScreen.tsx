import React, { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { DonationRequest } from "../../scripts/api/donationApi";
import { BackHandler } from "react-native";
import {
  BloodType,
  OrganType,
  TissueType,
  StemCellType,
} from "../../scripts/api/donationApi";
import { AuthProvider } from "../utils/auth-context";
import { useAuth } from "../utils/auth-context";
import { router } from "expo-router";

import {
  Alert,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import styles from "../../constants/styles/dashboardStyles";
import { registerDonation } from "../../scripts/api/donationApi";
import AppLayout from "@/components/AppLayout";

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
const TISSUE_TYPES = ["BONE", "SKIN", "CORNEA", "VEIN", "TENDON", "LIGAMENT"];
const STEM_CELL_TYPES = ["PERIPHERAL_BLOOD", "BONE_MARROW", "CORD_BLOOD"];

const DonationScreen = () => {
  const [loading, setLoading] = useState(false);
  const [donorId, setDonorId] = useState("");
  const [locationId, setLocationId] = useState<number | null>(null);

  const [donationType, setDonationType] = useState<
    "BLOOD" | "ORGAN" | "TISSUE" | "STEM_CELL"
  >("BLOOD");
  const [donationDate, setDonationDate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [isCompatible, setIsCompatible] = useState(false);
  const [bloodType, setBloodType] = useState<BloodType | "">("");
  const [organType, setOrganType] = useState<OrganType | "">("");
  const [tissueType, setTissueType] = useState<TissueType | "">("");
  const [stemCellType, setStemCellType] = useState<StemCellType | "">("");
  const { isAuthenticated } = useAuth();
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("../(auth)/loginScreen");
    }
  }, [isAuthenticated]);
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        router.replace("/(tabs)");
        return true;  
      }
    );
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    const checkDonorRole = async () => {
      setRoleLoading(true);
      try {
        const rolesString = await SecureStore.getItemAsync("roles");
        let roles: string[] = [];
        try {
          roles = rolesString ? JSON.parse(rolesString) : [];
        } catch {
          roles = [];
        }

        if (!roles.includes("DONOR")) {
          Alert.alert(
            "Not a Donor",
            "You must register as a donor before making a donation."
          );
          router.replace("/navigation/donorScreen");
          return;
        }
      } catch (error: any) {
        Alert.alert(
          "Role Error",
          error.message || "Failed to check donor role"
        );
        router.replace("../(auth)/loginScreen");
        return;
      } finally {
        setRoleLoading(false);
      }
    };

    checkDonorRole();
  }, []);

  useEffect(() => {
    const today = new Date();
    setDonationDate(today.toISOString().slice(0, 10));

    const fetchData = async () => {
      const id = await SecureStore.getItemAsync("donorId");
      if (id) setDonorId(id);

      const donorDataStr = await SecureStore.getItemAsync("donorData");
      if (donorDataStr) {
        try {
          const donorData = JSON.parse(donorDataStr);
          if (donorData?.location?.id)
            setLocationId(Number(donorData.location.id));
        } catch (e) {}
      }
    };
    fetchData();
  }, []);

  const isFormValid = () => {
    if (
      !donorId ||
      !donationType ||
      !donationDate ||
      !status ||
      !locationId ||
      !bloodType
    )
      return false;
    switch (donationType) {
      case "BLOOD":
        return !!quantity;
      case "ORGAN":
        return !!organType;
      case "TISSUE":
        return !!tissueType && !!quantity;
      case "STEM_CELL":
        return !!stemCellType && !!quantity;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      Alert.alert("Incomplete Form", "Please fill all required fields.");
      return;
    }
    setLoading(true);
    try {
      let payload: DonationRequest = {
        donorId,
        donationType,
        donationDate,
        status,
        locationId: Number(locationId),
        ...(donationType === "BLOOD" && { bloodType: bloodType as BloodType }),
      };

      switch (donationType) {
        case "BLOOD":
          payload.quantity = Number(quantity);
          break;
        case "ORGAN":
          payload.organType = organType || undefined;
          payload.isCompatible = isCompatible;
          break;
        case "TISSUE":
          payload.tissueType = tissueType || undefined;
          payload.quantity = Number(quantity);
          break;
        case "STEM_CELL":
          payload.stemCellType = stemCellType || undefined;
          payload.quantity = Number(quantity);
          break;
      }

      const response = await registerDonation(payload);
      Alert.alert("Success", "Donation recorded!");
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert("Donation Failed", error.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthProvider>
      <AppLayout title="Make a Donation">
        <ScrollView
          style={styles.bg}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.sectionTitle}>Make a Donation</Text>

          <Text style={styles.label}>Donation Type</Text>
          <View style={styles.input}>
            <Picker
              selectedValue={donationType}
              onValueChange={(
                value: "BLOOD" | "ORGAN" | "TISSUE" | "STEM_CELL"
              ) => {
                setDonationType(value);
                setQuantity("");
                setOrganType("");
                setTissueType("");
                setStemCellType("");
              }}
            >
              <Picker.Item label="Blood" value="BLOOD" />
              <Picker.Item label="Organ" value="ORGAN" />
              <Picker.Item label="Tissue" value="TISSUE" />
              <Picker.Item label="Stem Cell" value="STEM_CELL" />
            </Picker>
          </View>

          <Text style={styles.label}>Blood Type</Text>
          <View style={styles.input}>
            <Picker selectedValue={bloodType} onValueChange={setBloodType}>
              <Picker.Item label="Select Blood Type" value="" />
              {BLOOD_TYPES.map((bt) => (
                <Picker.Item
                  label={bt
                    .replace("_POSITIVE", "+")
                    .replace("_NEGATIVE", "-")
                    .replace("_", " ")}
                  value={bt}
                  key={bt}
                />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Donation Date</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: "#f1f2f6", color: "#636e72" },
            ]}
            value={donationDate}
            editable={false}
          />

          {donationType === "BLOOD" && (
            <>
              <Text style={styles.label}>Quantity (in liters, e.g., 0.5)</Text>
              <TextInput
                style={styles.input}
                placeholder="Quantity"
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
              />
            </>
          )}

          {donationType === "ORGAN" && (
            <>
              <Text style={styles.label}>Organ Type</Text>
              <View style={styles.input}>
                <Picker selectedValue={organType} onValueChange={setOrganType}>
                  <Picker.Item label="Select Organ" value="" />
                  {ORGAN_TYPES.map((ot) => (
                    <Picker.Item
                      label={ot.charAt(0) + ot.slice(1).toLowerCase()}
                      value={ot}
                      key={ot}
                    />
                  ))}
                </Picker>
              </View>
              <View style={styles.switchRow}>
                <Text style={styles.label}>Is Compatible?</Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: isCompatible ? "#00b894" : "#dfe6e9",
                    borderRadius: 16,
                    padding: 8,
                    marginLeft: 8,
                  }}
                  onPress={() => setIsCompatible(!isCompatible)}
                >
                  <Text style={{ color: isCompatible ? "#fff" : "#636e72" }}>
                    {isCompatible ? "Yes" : "No"}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {donationType === "TISSUE" && (
            <>
              <Text style={styles.label}>Tissue Type</Text>
              <View style={styles.input}>
                <Picker
                  selectedValue={tissueType}
                  onValueChange={setTissueType}
                >
                  <Picker.Item label="Select Tissue" value="" />
                  {TISSUE_TYPES.map((tt) => (
                    <Picker.Item
                      label={tt.charAt(0) + tt.slice(1).toLowerCase()}
                      value={tt}
                      key={tt}
                    />
                  ))}
                </Picker>
              </View>
              <Text style={styles.label}>Quantity (in grams or units)</Text>
              <TextInput
                style={styles.input}
                placeholder="Quantity"
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
              />
            </>
          )}

          {donationType === "STEM_CELL" && (
            <>
              <Text style={styles.label}>Stem Cell Type</Text>
              <View style={styles.input}>
                <Picker
                  selectedValue={stemCellType}
                  onValueChange={setStemCellType}
                >
                  <Picker.Item label="Select Stem Cell Type" value="" />
                  {STEM_CELL_TYPES.map((st) => (
                    <Picker.Item
                      label={st.replace("_", " ").toLowerCase()}
                      value={st}
                      key={st}
                    />
                  ))}
                </Picker>
              </View>
              <Text style={styles.label}>Quantity (in millions)</Text>
              <TextInput
                style={styles.input}
                placeholder="Quantity"
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
              />
            </>
          )}

          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor:
                  isFormValid() && !loading ? "#0984e3" : "#b2bec3",
              },
            ]}
            onPress={handleSubmit}
            disabled={!isFormValid() || loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Donate</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </AppLayout>
    </AuthProvider>
  );
};

export default DonationScreen;
