import React from "react";
import { View, Text, TextInput, Switch } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../utils/theme-context";
import { lightTheme, darkTheme } from "../../constants/styles/authStyles";
import { createUnifiedStyles } from "../../constants/styles/unifiedStyles";

interface EligibilityCriteriaProps {
  medicallyEligible: boolean;
  setMedicallyEligible: (value: boolean) => void;
  legalClearance: boolean;
  setLegalClearance: (value: boolean) => void;
  eligibilityNotes: string;
  setEligibilityNotes: (value: string) => void;
  lastReviewed: string;
  setLastReviewed: (value: string) => void;
  age: string;
  setAge: (value: string) => void;
  weight: string;
  setWeight: (value: string) => void;
  height: string;
  setHeight: (value: string) => void;
}

export function EligibilityCriteria(props: EligibilityCriteriaProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  const bmi =
    props.height && props.weight
      ? (
          parseFloat(props.weight) / Math.pow(parseFloat(props.height) / 100, 2)
        ).toFixed(1)
      : "N/A";

  const isEligible =
    props.medicallyEligible &&
    props.legalClearance &&
    parseFloat(props.age) >= 18 &&
    parseFloat(props.weight) >= 45;

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Feather name="check-circle" size={24} color={theme.primary} />
        <Text style={styles.sectionTitle}>Eligibility Criteria</Text>
      </View>

      <View style={styles.row}>
        <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>Age *</Text>
          <TextInput
            style={styles.input}
            placeholder="45"
            placeholderTextColor={theme.textSecondary}
            value={props.age}
            onChangeText={props.setAge}
            keyboardType="numeric"
          />
        </View>

        <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.label}>Weight (kg) *</Text>
          <TextInput
            style={styles.input}
            placeholder="75.5"
            placeholderTextColor={theme.textSecondary}
            value={props.weight}
            onChangeText={props.setWeight}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Height (cm)</Text>
        <TextInput
          style={styles.input}
          placeholder="175"
          placeholderTextColor={theme.textSecondary}
          value={props.height}
          onChangeText={props.setHeight}
          keyboardType="numeric"
        />
      </View>

      {bmi !== "N/A" && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Body Mass Index (BMI)</Text>
          <Text
            style={[
              styles.eligibilityText,
              parseFloat(bmi) >= 18.5 && parseFloat(bmi) <= 30
                ? styles.eligibleText
                : styles.ineligibleText,
            ]}
          >
            {bmi} -{" "}
            {parseFloat(bmi) >= 18.5 && parseFloat(bmi) <= 30
              ? "Normal Range"
              : "Outside Normal Range"}
          </Text>
        </View>
      )}

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Medically Eligible?</Text>
        <Switch
          value={props.medicallyEligible}
          onValueChange={props.setMedicallyEligible}
          thumbColor={theme.primary}
          trackColor={{ false: theme.border, true: theme.primary + "50" }}
        />
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Legal Clearance?</Text>
        <Switch
          value={props.legalClearance}
          onValueChange={props.setLegalClearance}
          thumbColor={theme.primary}
          trackColor={{ false: theme.border, true: theme.primary + "50" }}
        />
      </View>

      <Text
        style={[
          styles.eligibilityText,
          isEligible ? styles.eligibleText : styles.ineligibleText,
        ]}
      >
        {isEligible
          ? "✓ Eligible for Receiving Donations"
          : "⚠ Additional Requirements Needed"}
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Eligibility Notes</Text>
        <TextInput
          style={styles.textArea}
          placeholder="All eligibility criteria met for organ transplant..."
          placeholderTextColor={theme.textSecondary}
          value={props.eligibilityNotes}
          onChangeText={props.setEligibilityNotes}
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Last Reviewed (YYYY-MM-DD)</Text>
        <TextInput
          style={styles.input}
          placeholder="2025-01-15"
          placeholderTextColor={theme.textSecondary}
          value={props.lastReviewed}
          onChangeText={props.setLastReviewed}
        />
      </View>
    </View>
  );
}
