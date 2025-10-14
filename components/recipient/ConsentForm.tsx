import React, { useState } from "react";
import { View, Text, Switch, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../utils/theme-context";
import { lightTheme, darkTheme } from "../../constants/styles/authStyles";
import { TermsConditionsModal } from "../common/TermsConditionsModal";
import { createUnifiedStyles } from "@/constants/styles/unifiedStyles";

interface ConsentFormProps {
  isConsented: boolean;
  setIsConsented: (value: boolean) => void;
  consentedAt: string;
  setConsentedAt: (consentedAt: string) => void;
}

export function ConsentForm({
  isConsented,
  setIsConsented,
  consentedAt,
  setConsentedAt
}: ConsentFormProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  const [termsModalVisible, setTermsModalVisible] = useState(false);

  const handleTermsPress = () => {
    setTermsModalVisible(true);
  };

  const handleAcceptTerms = () => {
    setIsConsented(true);
    if (!consentedAt) {
      setConsentedAt(new Date().toISOString());
    }
    setTermsModalVisible(false);
  };

  const handleDeclineTerms = () => {
    setIsConsented(false);
    setTermsModalVisible(false);
  };

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconContainer}>
          <Feather name="file-text" size={18} color={theme.primary} />
        </View>
        <Text style={styles.sectionTitle}>Final Agreement</Text>
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
              {isConsented ? "Agreement Accepted" : "Consent Required"}
            </Text>
            <Text style={styles.agreementSubtitle}>
              {isConsented
                ? "You have agreed to receive medical donations"
                : "Please review and accept terms"}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.termsButton}
          onPress={handleTermsPress}
          activeOpacity={0.7}
        >
          <Feather name="eye" size={18} color={theme.primary} />
          <Text style={styles.termsButtonText}>Read Terms & Conditions</Text>
        </TouchableOpacity>

        <View style={styles.consentToggle}>
          <Text style={styles.consentText}>
            I consent to be a medical recipient and understand the process
          </Text>
          <Switch
            value={isConsented}
            onValueChange={(value) => {
              setIsConsented(value);
              if (value && !consentedAt) {
                setConsentedAt(new Date().toISOString());
              }
            }}
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
            {consentedAt && (
              <Text style={[styles.agreementSubtitle, { marginTop: 4 }]}>
                Consented on: {new Date(consentedAt).toLocaleDateString()}
              </Text>
            )}
          </View>
        </View>
      )}

      <TermsConditionsModal
        visible={termsModalVisible}
        onClose={handleDeclineTerms}
        onAccept={handleAcceptTerms}
        recipientMode={true}
      />
    </View>
  );
}
