import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Feather } from "@expo/vector-icons";
import AppLayout from "../../components/AppLayout";
import { LoadingButton } from "../../components/common/Button/LoadingButton";
import { PasswordInput } from "../../components/common/Input/PasswordInput";
import { ValidationMessage } from "../../components/common/validationMessage";
import { useAuth } from "../../utils/auth-context";
import { useTheme } from "../../utils/theme-context";
import {
  validateField,
  validationRules,
  getLoginType,
} from "../../utils/validation";
import { loginUser } from "../api/loginApi";
import {
  lightTheme,
  darkTheme,
  createAuthStyles,
} from "../../constants/styles/authStyles";

export default function LoginScreen() {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createAuthStyles(theme);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    identifier?: string;
    password?: string;
  }>({});
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const { setIsAuthenticated } = useAuth();
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

  const validateForm = (): boolean => {
    const newErrors: { identifier?: string; password?: string } = {};

    const identifierError = validateField(
      identifier,
      validationRules.identifier,
      "Username/Email"
    );
    if (identifierError) {
      newErrors.identifier = identifierError;
    }

    const passwordError = validateField(
      password,
      validationRules.password,
      "Password"
    );
    if (passwordError) {
      newErrors.password = passwordError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const loginType = getLoginType(identifier);
      const response = await loginUser({ loginType, identifier, password });

      await SecureStore.setItemAsync("jwt", response.accessToken);
      await SecureStore.setItemAsync("refreshToken", response.refreshToken);
      await SecureStore.setItemAsync("userId", response.id);
      await SecureStore.setItemAsync("email", response.email);
      await SecureStore.setItemAsync("username", response.username);
      await SecureStore.setItemAsync("roles", JSON.stringify(response.roles));
      await SecureStore.setItemAsync("gender", response.gender);
      await SecureStore.setItemAsync("dob", response.dob);

      setIsAuthenticated(true);
      showAlert(
        "Login Successful",
        `Welcome back, ${response.username}!`,
        "success"
      );
      setTimeout(() => {
        setAlertVisible(false);
        router.push("/(tabs)");
      }, 1500);
    } catch (error: any) {
      let message = "An unexpected error occurred.";
      if (error instanceof Error) {
        message = error.message;
      }
      showAlert("Login Failed", message, "error");
    } finally {
      setLoading(false);
    }
  };

  const clearError = (field: string) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <AppLayout>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your LifeLink account</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              focusedInput === "identifier" && styles.inputFocused,
              errors.identifier && styles.inputError,
            ]}
            placeholder="Username or Email"
            placeholderTextColor={theme.textSecondary}
            autoCapitalize="none"
            autoCorrect={false}
            value={identifier}
            onChangeText={(text) => {
              setIdentifier(text);
              clearError("identifier");
            }}
            onFocus={() => setFocusedInput("identifier")}
            onBlur={() => setFocusedInput(null)}
          />
          <ValidationMessage error={errors.identifier} />
        </View>

        <View style={styles.inputContainer}>
          <PasswordInput
            placeholder="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              clearError("password");
            }}
            hasError={!!errors.password}
            onFocus={() => setFocusedInput("password")}
            onBlur={() => setFocusedInput(null)}
          />
          <ValidationMessage error={errors.password} />
        </View>

        <LoadingButton
          title="Sign In"
          onPress={handleLogin}
          loading={loading}
          variant="primary"
        />

        <View style={styles.linkContainer}>
          <TouchableOpacity onPress={() => router.push("./registerScreen")}>
            <Text style={styles.linkText}>Don't have an account? Sign up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

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
                name={alertData.type === "success" ? "check-circle" : "x-circle"}
                size={28}
                color={alertData.type === "success" ? theme.success : theme.error}
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
