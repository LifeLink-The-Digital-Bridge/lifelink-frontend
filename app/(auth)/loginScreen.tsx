import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
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
import { CustomAlert } from "@/components/common/CustomAlert";

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
  const [alertData, setAlertData] = useState({ title: "", message: "" });

  const showAlert = (title: string, message: string) => {
    setAlertData({ title, message });
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
      showAlert("Login Successful", `Welcome back, ${response.username}!`);
      router.push("/(tabs)");
    } catch (error: any) {
      let message = "An unexpected error occurred.";
      if (error instanceof Error) {
        message = error.message;
      }
      showAlert("Login Failed", message);
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
      <CustomAlert
        visible={alertVisible}
        title={alertData.title}
        message={alertData.message}
        onClose={() => setAlertVisible(false)}
      />
    </AppLayout>
  );
}
