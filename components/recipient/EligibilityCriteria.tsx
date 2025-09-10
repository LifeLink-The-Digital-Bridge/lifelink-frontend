import React from 'react';
import { View, Text, TextInput, Switch } from 'react-native';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';
import { createUnifiedStyles } from '../../constants/styles/unifiedStyles';
import { createDonorStyles } from '../../constants/styles/donorStyles';
import { Feather } from '@expo/vector-icons';

interface EligibilityCriteriaProps {
  age: string;
  setAge: (value: string) => void;
  weight: string;
  setWeight: (value: string) => void;
  height: string;
  setHeight: (value: string) => void;
  bodyMassIndex: string;
  bodySize: string;
  setBodySize: (value: string) => void;
  weightEligible: boolean;
  medicallyEligible: boolean;
  setMedicallyEligible: (value: boolean) => void;
  legalClearance: boolean;
  setLegalClearance: (value: boolean) => void;
  eligibilityNotes: string;
  setEligibilityNotes: (value: string) => void;
  lastReviewed: string;
  setLastReviewed: (value: string) => void;
}

export function EligibilityCriteria(props: EligibilityCriteriaProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);
  const donorStyles = createDonorStyles(theme);

  const ageEligible = props.age ? parseInt(props.age) >= 18 : false;
  const isEligible = props.medicallyEligible && props.legalClearance && ageEligible && props.weightEligible;

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconContainer}>
          <Feather name="check-circle" size={18} color={theme.primary} />
        </View>
        <Text style={styles.sectionTitle}>Eligibility Criteria</Text>
      </View>

      <View style={styles.row}>
        <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            placeholder="45"
            placeholderTextColor={theme.textSecondary}
            value={props.age}
            onChangeText={props.setAge}
            keyboardType="numeric"
          />
          {props.age && (
            <Text style={[
              donorStyles.eligibilityText,
              ageEligible ? donorStyles.eligibleText : donorStyles.ineligibleText
            ]}>
              {ageEligible ? "✓ Age Eligible (≥18)" : "⚠ Must be 18 or older"}
            </Text>
          )}
        </View>
        <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.label}>Weight (kg)</Text>
          <TextInput
            style={styles.input}
            placeholder="75.5"
            placeholderTextColor={theme.textSecondary}
            value={props.weight}
            onChangeText={props.setWeight}
            keyboardType="numeric"
          />
          {props.weight && (
            <Text style={[
              donorStyles.eligibilityText,
              props.weightEligible ? donorStyles.eligibleText : donorStyles.ineligibleText
            ]}>
              {props.weightEligible ? "✓ Weight Eligible (≥45kg)" : "⚠ Minimum 45kg required"}
            </Text>
          )}
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

      {props.bodyMassIndex && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Body Mass Index (BMI)</Text>
          <Text style={[
            donorStyles.eligibilityText,
            parseFloat(props.bodyMassIndex) >= 18.5 && parseFloat(props.bodyMassIndex) <= 30
              ? donorStyles.eligibleText : donorStyles.ineligibleText
          ]}>
            {props.bodyMassIndex} - {
              parseFloat(props.bodyMassIndex) >= 18.5 && parseFloat(props.bodyMassIndex) <= 30
                ? "Normal Range" : "Outside Normal Range"
            }
          </Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Body Size</Text>
        <TextInput
          style={styles.input}
          placeholder="SMALL/MEDIUM/LARGE"
          placeholderTextColor={theme.textSecondary}
          value={props.bodySize}
          onChangeText={props.setBodySize}
        />
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Medically Eligible?</Text>
        <Switch
          value={props.medicallyEligible}
          onValueChange={props.setMedicallyEligible}
          thumbColor={theme.primary}
          trackColor={{ false: theme.border, true: theme.primary + '50' }}
        />
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Legal Clearance?</Text>
        <Switch
          value={props.legalClearance}
          onValueChange={props.setLegalClearance}
          thumbColor={theme.primary}
          trackColor={{ false: theme.border, true: theme.primary + '50' }}
        />
      </View>

      <Text style={[
        donorStyles.eligibilityText,
        isEligible ? donorStyles.eligibleText : donorStyles.ineligibleText
      ]}>
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
