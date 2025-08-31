import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "../../utils/theme-context";
import { lightTheme, darkTheme } from "../../constants/styles/authStyles";
import { createUnifiedStyles } from "../../constants/styles/unifiedStyles";

export function RecipientRegistrationPrompt() {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  return (
    <View style={styles.promptContainer}>
      <View style={styles.promptIconContainer}>
        <Feather name="user-plus" size={48} color={theme.primary} />
      </View>

      <Text style={styles.promptTitle}>Become a Recipient</Text>
      <Text style={styles.promptSubtitle}>
        Register as a recipient to receive blood, organs, or tissue donations
        when you need them most.
      </Text>

      <View style={styles.benefitsList}>
        <View style={styles.benefitItem}>
          <Feather name="check-circle" size={16} color={theme.success} />
          <Text style={styles.benefitText}>
            Priority matching with compatible donors
          </Text>
        </View>
        <View style={styles.benefitItem}>
          <Feather name="check-circle" size={16} color={theme.success} />
          <Text style={styles.benefitText}>
            Real-time notifications for available matches
          </Text>
        </View>
        <View style={styles.benefitItem}>
          <Feather name="check-circle" size={16} color={theme.success} />
          <Text style={styles.benefitText}>
            Secure medical profile management
          </Text>
        </View>
        <View style={styles.benefitItem}>
          <Feather name="check-circle" size={16} color={theme.success} />
          <Text style={styles.benefitText}>
            Access to specialized healthcare networks
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => router.push("/navigation/RecipientScreen")}
        activeOpacity={0.8}
      >
        <Feather name="user-plus" size={20} color="#fff" />
        <Text style={styles.registerButtonText}>Register as Recipient</Text>
      </TouchableOpacity>
    </View>
  );
}
