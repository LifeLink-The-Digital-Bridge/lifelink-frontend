import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { registerUser } from "../api/registerApi";
import type { RegisterRequest } from "../api/registerApi";
import AppLayout from "../../components/AppLayout";
import { LoadingButton } from "../../components/common/Button/LoadingButton";
import { PasswordInput } from "../../components/common/Input/PasswordInput";
import { ValidationMessage } from "../../components/common/validationMessage";
import { ImagePickerComponent } from "../../components/common/ImagePicker";
import { GenderPicker } from "../../components/common/GenderPicker";
import { CustomDatePicker } from "../../components/common/DatePicker";
import { useTheme } from "../../utils/theme-context";
import {
  lightTheme,
  darkTheme,
  createAuthStyles,
} from "../../constants/styles/authStyles";
import {
  validateField,
  validationRules,
} from "../../utils/validation";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const LANGUAGES = [
  "Hindi", "English", "Malayalam", "Tamil", "Telugu", "Kannada", 
  "Bengali", "Marathi", "Gujarati", "Punjabi", "Odia", "Urdu"
];

interface MigrantRegisterRequest extends RegisterRequest {
  roles: string[];
  migrantDetails: {
    aadhaarHash: string;
    latitude?: number;
    longitude?: number;
  };
}

export default function RegisterMigrantScreen() {
  const { isDark } = useTheme();
  const params = useLocalSearchParams<{ fromMap?: string; selectedLatitude?: string; selectedLongitude?: string }>();
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createAuthStyles(theme);
  const labelStyle = { color: theme.text, marginBottom: 6, fontWeight: "600" as const };

  const [formData, setFormData] = useState<MigrantRegisterRequest>({
    name: "",
    email: "",
    username: "",
    password: "",
    phone: "",
    dob: "",
    gender: "",
    profileImageUrl: "",
    roles: ["MIGRANT"],
    migrantDetails: {
      aadhaarHash: "",
      latitude: undefined,
      longitude: undefined,
    },
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState({
    title: "",
    message: "",
    type: "success" as "success" | "error",
  });

  const alertStyles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    container: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 24,
      width: "100%",
      maxWidth: 340,
      alignItems: "center",
    },
    iconContainer: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 8,
      textAlign: "center",
    },
    message: {
      fontSize: 15,
      color: theme.textSecondary,
      textAlign: "center",
      marginBottom: 24,
      lineHeight: 22,
    },
    button: {
      backgroundColor: theme.primary,
      paddingHorizontal: 32,
      paddingVertical: 12,
      borderRadius: 12,
      width: "100%",
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
      textAlign: "center",
    },
  });

  const showAlert = (
    title: string,
    message: string,
    type: "success" | "error"
  ) => {
    setAlertData({ title, message, type });
    setAlertVisible(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleMigrantDetailChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      migrantDetails: { ...prev.migrantDetails, [field]: value },
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  useEffect(() => {
    if (params.fromMap === "true" && params.selectedLatitude && params.selectedLongitude) {
      const lat = parseFloat(params.selectedLatitude);
      const lng = parseFloat(params.selectedLongitude);
      if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
        setFormData((prev) => ({
          ...prev,
          migrantDetails: {
            ...prev.migrantDetails,
            latitude: lat,
            longitude: lng,
          },
        }));
      }
    }
  }, [params.fromMap, params.selectedLatitude, params.selectedLongitude]);

  const handlePickLocation = () => {
    router.push({
      pathname: "/navigation/mapScreen",
      params: {
        returnScreen: "migrant-register",
        ...(formData.migrantDetails.latitude !== undefined
          ? { latitude: String(formData.migrantDetails.latitude) }
          : {}),
        ...(formData.migrantDetails.longitude !== undefined
          ? { longitude: String(formData.migrantDetails.longitude) }
          : {}),
      },
    });
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    const nameError = validateField(
      formData.name,
      { required: true, minLength: 2 },
      "Full Name"
    );
    if (nameError) newErrors.name = nameError;

    const emailError = validateField(formData.email, validationRules.email, "Email");
    if (emailError) newErrors.email = emailError;

    const usernameError = validateField(
      formData.username,
      { required: true, minLength: 3 },
      "Username"
    );
    if (usernameError) newErrors.username = usernameError;

    const passwordError = validateField(
      formData.password,
      validationRules.password,
      "Password"
    );
    if (passwordError) newErrors.password = passwordError;

    const phoneError = validateField(formData.phone, validationRules.phone, "Phone");
    if (phoneError) newErrors.phone = phoneError;
    
    if (!formData.dob) newErrors.dob = "Date of birth is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.profileImageUrl) newErrors.profileImageUrl = "Profile image is required";

    if (
      formData.migrantDetails.aadhaarHash &&
      !/^\d{4}$/.test(formData.migrantDetails.aadhaarHash)
    ) {
      newErrors.aadhaarHash = "Aadhaar last 4 digits must be exactly 4 numbers";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      showAlert("Validation Error", "Please check all required fields", "error");
      return;
    }

    setLoading(true);
    try {
      await registerUser(formData);
      showAlert(
        "Success!",
        "Your migrant account has been created successfully. Please login.",
        "success"
      );
      setTimeout(() => {
        setAlertVisible(false);
        router.replace("/(auth)/loginScreen");
      }, 2000);
    } catch (error: any) {
      showAlert(
        "Registration Failed",
        error.message || "An error occurred during registration",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const PickerModal = ({
    visible,
    onClose,
    items,
    onSelect,
    title,
  }: {
    visible: boolean;
    onClose: () => void;
    items: string[];
    onSelect: (item: string) => void;
    title: string;
  }) => (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={alertStyles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[alertStyles.container, { maxHeight: "70%" }]}>
              <Text style={alertStyles.title}>{title}</Text>
              <ScrollView style={{ width: "100%", marginBottom: 16 }}>
                {items.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={{
                      paddingVertical: 16,
                      borderBottomWidth: 1,
                      borderBottomColor: theme.border,
                    }}
                    onPress={() => {
                      onSelect(item);
                      onClose();
                    }}
                  >
                    <Text style={{ color: theme.text, fontSize: 16 }}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={[alertStyles.button, { backgroundColor: theme.textSecondary }]}
                onPress={onClose}
              >
                <Text style={alertStyles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  return (
    <AppLayout showBackButton backRoute="/(auth)/roleSelectionScreen">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ marginBottom: 24 }}>
              <MaterialIcons name="favorite" size={48} color="#8B5CF6" />
              <Text style={[styles.title, { color: theme.text, marginTop: 16 }]}>
                Migrant Worker Registration
              </Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                Get your portable Health ID
              </Text>
            </View>

            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Basic Information
            </Text>

                        <View style={styles.inputContainer}>
              <Text style={labelStyle}>Current Location</Text>
              <TouchableOpacity
                style={[
                  styles.input,
                  { borderColor: theme.border, justifyContent: "center" },
                ]}
                onPress={handlePickLocation}
              >
                <Text style={{ color: theme.text }}>
                  {formData.migrantDetails.latitude !== undefined && formData.migrantDetails.longitude !== undefined
                    ? `Location: ${formData.migrantDetails.latitude.toFixed(5)}, ${formData.migrantDetails.longitude.toFixed(5)}`
                    : "Pick Current Location on Map"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={labelStyle}>Full Name</Text>
              <TextInput
                style={[
                  styles.input,
                  { color: theme.text, borderColor: focusedInput === "name" ? theme.primary : theme.border },
                ]}
                placeholder="Full Name"
                placeholderTextColor={theme.textSecondary}
                value={formData.name}
                onChangeText={(val) => handleInputChange("name", val)}
                onFocus={() => setFocusedInput("name")}
                onBlur={() => setFocusedInput(null)}
              />
              <ValidationMessage error={errors.name} />
            </View>

            <View style={styles.inputContainer}>
              <Text style={labelStyle}>Email</Text>
              <TextInput
                style={[
                  styles.input,
                  { color: theme.text, borderColor: focusedInput === "email" ? theme.primary : theme.border },
                ]}
                placeholder="Email"
                placeholderTextColor={theme.textSecondary}
                value={formData.email}
                onChangeText={(val) => handleInputChange("email", val)}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setFocusedInput("email")}
                onBlur={() => setFocusedInput(null)}
              />
              <ValidationMessage error={errors.email} />
            </View>

            <View style={styles.inputContainer}>
              <Text style={labelStyle}>Username</Text>
              <TextInput
                style={[
                  styles.input,
                  { color: theme.text, borderColor: focusedInput === "username" ? theme.primary : theme.border },
                ]}
                placeholder="Username"
                placeholderTextColor={theme.textSecondary}
                value={formData.username}
                onChangeText={(val) => handleInputChange("username", val)}
                autoCapitalize="none"
                onFocus={() => setFocusedInput("username")}
                onBlur={() => setFocusedInput(null)}
              />
              <ValidationMessage error={errors.username} />
            </View>

            <View style={styles.inputContainer}>
              <Text style={labelStyle}>Password</Text>
              <PasswordInput
                value={formData.password}
                onChangeText={(val) => handleInputChange("password", val)}
                error={errors.password}
                placeholder="Password"
              />
              <ValidationMessage error={errors.aadhaarHash} />
            </View>

            <View style={styles.inputContainer}>
              <Text style={labelStyle}>Phone Number</Text>
              <TextInput
                style={[
                  styles.input,
                  { color: theme.text, borderColor: focusedInput === "phone" ? theme.primary : theme.border },
                ]}
                placeholder="Phone Number"
                placeholderTextColor={theme.textSecondary}
                value={formData.phone}
                onChangeText={(val) => handleInputChange("phone", val)}
                keyboardType="phone-pad"
                maxLength={10}
                onFocus={() => setFocusedInput("phone")}
                onBlur={() => setFocusedInput(null)}
              />
              <ValidationMessage error={errors.phone} />
            </View>

            <View style={styles.inputContainer}>
              <Text style={labelStyle}>Date of Birth</Text>
              <CustomDatePicker
                selectedDate={formData.dob}
                onDateChange={(val) => handleInputChange("dob", val)}
                hasError={!!errors.dob}
              />
              <ValidationMessage error={errors.dob} />
            </View>

            <View style={styles.inputContainer}>
              <Text style={labelStyle}>Gender</Text>
              <GenderPicker
                selectedValue={formData.gender}
                onValueChange={(val) => handleInputChange("gender", val)}
                hasError={!!errors.gender}
              />
              <ValidationMessage error={errors.gender} />
            </View>

            <View style={styles.inputContainer}>
              <Text style={labelStyle}>Profile Image</Text>
              <ImagePickerComponent
                imageUri={formData.profileImageUrl}
                onImageSelected={(val) => handleInputChange("profileImageUrl", val)}
              />
              <ValidationMessage error={errors.profileImageUrl} />
            </View>

            <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 24 }]}>
              Migrant Worker Details
            </Text>

            <View style={styles.inputContainer}>
              <Text style={labelStyle}>Aadhaar Number (Last 4 digits)</Text>
              <TextInput
                style={[
                  styles.input,
                  { color: theme.text, borderColor: focusedInput === "aadhaarHash" ? theme.primary : theme.border },
                ]}
                placeholder="Aadhaar Number (Last 4 digits)"
                placeholderTextColor={theme.textSecondary}
                value={formData.migrantDetails.aadhaarHash}
                onChangeText={(val) => handleMigrantDetailChange("aadhaarHash", val)}
                keyboardType="number-pad"
                maxLength={4}
                onFocus={() => setFocusedInput("aadhaarHash")}
                onBlur={() => setFocusedInput(null)}
              />
              <ValidationMessage error={errors.aadhaarHash} />
            </View>

            <LoadingButton
              onPress={handleRegister}
              loading={loading}
              title="Register as Migrant Worker"
              style={{ marginTop: 24 }}
            />

            <TouchableOpacity
              style={{ paddingVertical: 16, alignItems: "center" }}
              onPress={() => router.back()}
            >
              <Text style={{ color: theme.textSecondary, fontSize: 15 }}>
                Back to Role Selection
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <Modal visible={alertVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setAlertVisible(false)}>
          <View style={alertStyles.overlay}>
            <TouchableWithoutFeedback>
              <View style={alertStyles.container}>
                <View
                  style={[
                    alertStyles.iconContainer,
                    {
                      backgroundColor:
                        alertData.type === "success"
                          ? theme.success + "20"
                          : theme.error + "20",
                    },
                  ]}
                >
                  <Feather
                    name={alertData.type === "success" ? "check-circle" : "x-circle"}
                    size={32}
                    color={alertData.type === "success" ? theme.success : theme.error}
                  />
                </View>
                <Text style={alertStyles.title}>{alertData.title}</Text>
                <Text style={alertStyles.message}>{alertData.message}</Text>
                <TouchableOpacity
                  style={alertStyles.button}
                  onPress={() => setAlertVisible(false)}
                >
                  <Text style={alertStyles.buttonText}>OK</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </AppLayout>
  );
}
