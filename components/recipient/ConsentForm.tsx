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

export function ConsentForm({ isConsented, setIsConsented }: ConsentFormProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  const [termsModalVisible, setTermsModalVisible] = useState(false);

  const isSectionComplete = isConsented;

  const handleTermsPress = () => {
    setTermsModalVisible(true);
  };

  const handleAcceptTerms = () => {
    setIsConsented(true);
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
          <Feather 
            name={isSectionComplete ? "check-circle" : "file-text"} 
            size={18} 
            color={isSectionComplete ? theme.success : theme.primary} 
          />
        </View>
        <Text style={styles.sectionTitle}>Final Agreement</Text>
        {!isSectionComplete && (
          <View style={{
            backgroundColor: theme.error + '20',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
            marginLeft: 'auto',
          }}>
            <Text style={{
              color: theme.error,
              fontSize: 11,
              fontWeight: '600',
            }}>
              Required
            </Text>
          </View>
        )}
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
                ? "You have agreed to all terms"
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
            I have read and agree to all terms and conditions
          </Text>
          <Switch
            value={isConsented}
            onValueChange={setIsConsented}
            thumbColor={theme.primary}
            trackColor={{ false: theme.border, true: theme.primary + "50" }}
          />
        </View>

        {!isConsented && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
            <Feather name="alert-circle" size={12} color={theme.error} />
            <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
              You must consent to proceed with registration
            </Text>
          </View>
        )}
      </View>

      {isConsented && (
        <View style={styles.successMessage}>
          <Feather name="check-circle" size={24} color={theme.success} />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.successTitle}>Thank you for your consent!</Text>
            <Text style={styles.successSubtitle}>
              You're now ready to complete your recipient registration. Our team will contact you to schedule medical evaluations and HLA testing for matching.
            </Text>
          </View>
        </View>
      )}

      <TermsConditionsModal
        visible={termsModalVisible}
        onClose={handleDeclineTerms}
        onAccept={handleAcceptTerms}
      />
    </View>
  );
}
