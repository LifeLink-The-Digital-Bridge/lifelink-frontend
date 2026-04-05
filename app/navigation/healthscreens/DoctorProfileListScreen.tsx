import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useTheme } from "../../../utils/theme-context";
import { lightTheme, darkTheme, createHealthStyles } from "../../../constants/styles/healthStyles";
import { searchDoctors, UserProfile } from "../../api/userApi";
import { healthApi } from "../../api/healthApi";
import * as SecureStore from "expo-secure-store";
import { useRole } from "../../../utils/role-context";
import { router } from "expo-router";
import { ValidationAlert } from "../../../components/common/ValidationAlert";

export default function DoctorProfileListScreen() {
  const { colorScheme } = useTheme();
  const { primaryRole } = useRole();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  const styles = createHealthStyles(theme);

  const [doctors, setDoctors] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedDoctorId, setExpandedDoctorId] = useState<string | null>(null);
  const [popup, setPopup] = useState<{ visible: boolean; title: string; message: string; type: "success" | "error" | "warning" | "info" }>({
    visible: false,
    title: "",
    message: "",
    type: "info",
  });

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const data = await searchDoctors();
      setDoctors(data);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDoctors();
    setRefreshing(false);
  };

  const handleConnect = async (doctor: UserProfile) => {
    try {
      const currentUserId = await SecureStore.getItemAsync("userId");
      if (!currentUserId) throw new Error("Not logged in");

      const currentRole = primaryRole || "MIGRANT";
      if (currentRole !== "MIGRANT") {
        throw new Error("Only migrants can send doctor connection requests from this screen");
      }

      await healthApi.sendConnectionRequest(
        doctor.id,
        "DOCTOR",
        "DOCTOR_PATIENT",
        undefined,
        "MIGRANT"
      );
      setPopup({
        visible: true,
        title: "Request Sent",
        message: `Connection request sent to Dr. ${doctor.name || doctor.username}.`,
        type: "success",
      });
    } catch (error: any) {
      setPopup({
        visible: true,
        title: "Request Failed",
        message: error.message || "Failed to send request",
        type: "error",
      });
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: 44, paddingBottom: 10 }]}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
            <MaterialIcons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <View>
            <Text style={[styles.headerTitle, { fontSize: 20 }]}>Find Doctors</Text>
          </View>
        </View>
      </View>
      <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 2 }}>
        <Text style={[styles.headerSubtitle, { fontSize: 12 }]}>Discover verified doctors</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {doctors.length === 0 ? (
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <MaterialIcons name="search-off" size={64} color={theme.textSecondary} />
            <Text style={{ color: theme.textSecondary, marginTop: 16, fontSize: 16 }}>
              No doctors found.
            </Text>
          </View>
        ) : (
          doctors.map((doctor) => (
            <View key={doctor.id} style={styles.card}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{
                  width: 50, height: 50, borderRadius: 25, 
                  backgroundColor: theme.primary + "20", 
                  justifyContent: "center", alignItems: "center",
                  marginRight: 16
                }}>
                  {doctor.profileImageUrl ? (
                    <Image 
                      source={{ uri: doctor.profileImageUrl }} 
                      style={{ width: 50, height: 50, borderRadius: 25 }} 
                    />
                  ) : (
                    <FontAwesome5 name="user-md" size={24} color={theme.primary} />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>Dr. {doctor.name || doctor.username}</Text>
                  <Text style={{ color: theme.textSecondary, marginTop: 4 }}>
                    <MaterialIcons name="verified" size={14} color={theme.success} /> Verified Professional
                  </Text>
                  {!!doctor.doctorDetails?.specialization && (
                    <Text style={{ color: theme.textSecondary, marginTop: 4 }}>
                      Specialization: {doctor.doctorDetails.specialization}
                    </Text>
                  )}
                </View>
              </View>

              <View style={{ flexDirection: "row", marginTop: 10 }}>
                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton, { flex: 1, minHeight: 36, marginVertical: 0, marginRight: 8, paddingVertical: 8, paddingHorizontal: 8 }]}
                  onPress={() =>
                    setExpandedDoctorId((prev) => (prev === doctor.id ? null : doctor.id))
                  }
                  activeOpacity={0.85}
                >
                  <Text style={[styles.buttonText, styles.secondaryButtonText, { fontSize: 13 }]}>
                    {expandedDoctorId === doctor.id ? "Hide Details" : "View Details"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, { flex: 1, minHeight: 36, marginVertical: 0, marginLeft: 8, paddingVertical: 8, paddingHorizontal: 8 }]}
                  onPress={() => handleConnect(doctor)}
                  activeOpacity={0.85}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <MaterialIcons name="person-add" size={16} color="#fff" style={{ marginRight: 6 }} />
                    <Text style={[styles.buttonText, { fontSize: 13 }]}>Connect</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {expandedDoctorId === doctor.id && (
                <View style={{ marginTop: 12 }}>
                  {!!doctor.doctorDetails?.medicalRegistrationNumber && (
                    <Text style={styles.cardSubtitle}>
                      Registration: {doctor.doctorDetails.medicalRegistrationNumber}
                    </Text>
                  )}
                  {!!doctor.doctorDetails?.qualification && (
                    <Text style={styles.cardSubtitle}>
                      Qualification: {doctor.doctorDetails.qualification}
                    </Text>
                  )}
                  {!!doctor.doctorDetails?.hospitalName && (
                    <Text style={styles.cardSubtitle}>
                      Hospital: {doctor.doctorDetails.hospitalName}
                    </Text>
                  )}
                  {!!doctor.doctorDetails?.clinicAddress && (
                    <Text style={styles.cardSubtitle}>
                      Clinic Address: {doctor.doctorDetails.clinicAddress}
                    </Text>
                  )}
                  {doctor.doctorDetails?.yearsOfExperience !== undefined &&
                    doctor.doctorDetails?.yearsOfExperience !== null && (
                    <Text style={styles.cardSubtitle}>
                      Experience: {doctor.doctorDetails.yearsOfExperience} years
                    </Text>
                  )}
                  {doctor.doctorDetails?.consultationFee !== undefined &&
                    doctor.doctorDetails?.consultationFee !== null && (
                    <Text style={styles.cardSubtitle}>
                      Consultation Fee: ₹{doctor.doctorDetails.consultationFee}
                    </Text>
                  )}
                  {!!doctor.phone && (
                    <Text style={styles.cardSubtitle}>Phone: {doctor.phone}</Text>
                  )}
                  {!!doctor.email && (
                    <Text style={styles.cardSubtitle}>Email: {doctor.email}</Text>
                  )}
                </View>
              )}

            </View>
          ))
        )}
      </ScrollView>
      <ValidationAlert
        visible={popup.visible}
        title={popup.title}
        message={popup.message}
        type={popup.type}
        onClose={() => setPopup((prev) => ({ ...prev, visible: false }))}
      />
    </View>
  );
}
