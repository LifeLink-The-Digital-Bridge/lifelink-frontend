import React, { useState } from "react";
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
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
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
  VALIDATION_MESSAGES,
} from "../../utils/validation";

export default function RegisterScreen() {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createAuthStyles(theme);

  const [formData, setFormData] = useState<RegisterRequest>({
    name: "",
    email: "",
    username: "",
    password: "",
    phone: "",
    dob: "",
    gender: "",
    profileImageUrl: "",
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
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 10,
      width: "100%",
    },
    buttonText: {
      color: "#fff",
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

  const handleChange = (key: keyof RegisterRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    clearError(key);
  };

  const clearError = (field: string) => {
    setErrors((prev) => {
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    const fieldValidations = [
      {
        key: "name",
        rules: { required: true, minLength: 2 },
        name: "Full Name",
      },
      { key: "email", rules: validationRules.email, name: "Email" },
      {
        key: "username",
        rules: { required: true, minLength: 3 },
        name: "Username",
      },
      { key: "password", rules: validationRules.password, name: "Password" },
      { key: "phone", rules: validationRules.phone, name: "Phone" },
      { key: "dob", rules: validationRules.date, name: "Date of Birth" },
    ];

    fieldValidations.forEach(({ key, rules, name }) => {
      const error = validateField(
        formData[key as keyof RegisterRequest],
        rules,
        name
      );
      if (error) {
        newErrors[key] = error;
      }
    });

    if (!formData.gender) {
      newErrors.gender = VALIDATION_MESSAGES.REQUIRED("Gender");
    }

    if (!formData.profileImageUrl) {
      newErrors.profileImageUrl = VALIDATION_MESSAGES.REQUIRED("Profile Image");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const data = await registerUser(formData);
      showAlert(
        "Registration Successful",
        `Welcome to LifeLink, ${data.username}! Please login to continue.`,
        "success"
      );
      setTimeout(() => {
        setAlertVisible(false);
        router.push("./loginScreen");
      }, 2000);
    } catch (error: any) {
      showAlert("Registration Failed", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.headerContainer}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>
                Join LifeLink and connect with others
              </Text>
            </View>

            <View style={styles.formSection}>
              <ImagePickerComponent
                imageUri={formData.profileImageUrl}
                onImageSelected={(uri) => handleChange("profileImageUrl", uri)}
                placeholder="Choose Profile Picture"
              />
              <ValidationMessage error={errors.profileImageUrl} />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Personal Information</Text>

              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    focusedInput === "name" && styles.inputFocused,
                    errors.name && styles.inputError,
                  ]}
                  placeholder="Full Name"
                  placeholderTextColor={theme.textSecondary}
                  value={formData.name}
                  onChangeText={(text) => handleChange("name", text)}
                  onFocus={() => setFocusedInput("name")}
                  onBlur={() => setFocusedInput(null)}
                />
                <ValidationMessage error={errors.name} />
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    focusedInput === "email" && styles.inputFocused,
                    errors.email && styles.inputError,
                  ]}
                  placeholder="Email Address"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={formData.email}
                  onChangeText={(text) => handleChange("email", text)}
                  onFocus={() => setFocusedInput("email")}
                  onBlur={() => setFocusedInput(null)}
                />
                <ValidationMessage error={errors.email} />
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    focusedInput === "phone" && styles.inputFocused,
                    errors.phone && styles.inputError,
                  ]}
                  placeholder="Phone Number (10 digits)"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="phone-pad"
                  value={formData.phone}
                  onChangeText={(text) => handleChange("phone", text)}
                  onFocus={() => setFocusedInput("phone")}
                  onBlur={() => setFocusedInput(null)}
                />
                <ValidationMessage error={errors.phone} />
              </View>

              <View style={styles.inputContainer}>
                <CustomDatePicker
                  selectedDate={formData.dob}
                  onDateChange={(date) => handleChange("dob", date)}
                  hasError={!!errors.dob}
                  placeholder="Select Date of Birth"
                />
                <ValidationMessage error={errors.dob} />
              </View>

              <View style={styles.inputContainer}>
                <GenderPicker
                  selectedValue={formData.gender}
                  onValueChange={(value) => handleChange("gender", value)}
                  hasError={!!errors.gender}
                />
                <ValidationMessage error={errors.gender} />
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Account Information</Text>

              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    focusedInput === "username" && styles.inputFocused,
                    errors.username && styles.inputError,
                  ]}
                  placeholder="Username"
                  placeholderTextColor={theme.textSecondary}
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={formData.username}
                  onChangeText={(text) => handleChange("username", text)}
                  onFocus={() => setFocusedInput("username")}
                  onBlur={() => setFocusedInput(null)}
                />
                <ValidationMessage error={errors.username} />
              </View>

              <View style={styles.inputContainer}>
                <PasswordInput
                  placeholder="Password (minimum 6 characters)"
                  value={formData.password}
                  onChangeText={(text) => handleChange("password", text)}
                  hasError={!!errors.password}
                  onFocus={() => setFocusedInput("password")}
                  onBlur={() => setFocusedInput(null)}
                />
                <ValidationMessage error={errors.password} />
              </View>
            </View>

            <LoadingButton
              title="Create Account"
              onPress={handleRegister}
              loading={loading}
              variant="primary"
            />

            <View style={styles.linkContainer}>
              <TouchableOpacity onPress={() => router.push("./loginScreen")}>
                <Text style={styles.linkText}>
                  Already have an account? Sign in
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <Modal
        visible={alertVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAlertVisible(false)}
      >
        <View style={alertStyles.overlay}>
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
                name={
                  alertData.type === "success" ? "check-circle" : "x-circle"
                }
                size={28}
                color={
                  alertData.type === "success" ? theme.success : theme.error
                }
              />
            </View>
            <Text style={alertStyles.title}>{alertData.title}</Text>
            <Text style={alertStyles.message}>{alertData.message}</Text>
            <TouchableOpacity
              style={[
                alertStyles.button,
                {
                  backgroundColor:
                    alertData.type === "success" ? theme.success : theme.error,
                },
              ]}
              onPress={() => setAlertVisible(false)}
            >
              <Text style={alertStyles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </AppLayout>
  );
}
