import React from "react";
import { View, Text, Switch, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../utils/theme-context";
import { lightTheme, darkTheme } from "../../constants/styles/authStyles";
import { createUnifiedStyles } from "../../constants/styles/unifiedStyles";

interface ConsentFormProps {
  isConsented: boolean;
  setIsConsented: (value: boolean) => void;
}

export function ConsentForm({ isConsented, setIsConsented }: ConsentFormProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconContainer}>
          <Feather name="file-text" size={18} color={theme.primary} />
        </View>
        <Text style={styles.sectionTitle}>Consent Agreement</Text>
      </View>

      <View style={styles.agreementCard}>
        <View style={styles.agreementHeader}>
          <View
            style={[
              styles.agreementIcon,
              {
                backgroundColor: isConsented
                  ? theme.success + "20"
                  : theme.primary + "20",
              },
            ]}
          >
            <Feather
              name={isConsented ? "check-circle" : "file-text"}
              size={20}
              color={isConsented ? theme.success : theme.primary}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.agreementTitle}>
              {isConsented ? "Consent Provided" : "Consent Required"}
            </Text>
            <Text style={styles.agreementSubtitle}>
              {isConsented
                ? "You have agreed to receive medical donations"
                : "Please confirm your consent to be a recipient"}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.termsButton}>
          <Feather name="info" size={16} color={theme.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.termsButtonText}>Read Terms & Conditions</Text>
            <Text style={styles.termsSubText}>
              Understand your rights and responsibilities
            </Text>
          </View>
          <Feather name="external-link" size={14} color={theme.primary} />
        </TouchableOpacity>

        <View style={styles.consentToggle}>
          <Text style={styles.consentText}>
            I consent to be a medical recipient and understand the process
          </Text>
          <Switch
            value={isConsented}
            onValueChange={setIsConsented}
            thumbColor={theme.primary}
            trackColor={{ false: theme.border, true: theme.primary + "50" }}
          />
        </View>
      </View>

      {isConsented && (
        <View style={styles.successMessage}>
          <Feather name="check-circle" size={24} color={theme.success} />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.successTitle}>Thank you for your consent!</Text>
            <Text style={styles.successSubtitle}>
              You're now ready to complete your recipient registration.
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
