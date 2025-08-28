import React from 'react';
import { View, Text, TextInput, Switch } from 'react-native';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';
import { createDonorStyles } from '../../constants/styles/donorStyles';

interface EligibilityCriteriaProps {
  dob: string;
  age: number | null;
  weight: string;
  setWeight: (value: string) => void;
  weightEligible: boolean;
  height: string;
  setHeight: (value: string) => void;
  bodyMassIndex: string;
  bodySize: string;
  setBodySize: (value: string) => void;
  isLivingDonor: boolean;
  setIsLivingDonor: (value: boolean) => void;
  medicalClearance: boolean;
  setMedicalClearance: (value: boolean) => void;
  recentTattooOrPiercing: boolean;
  setRecentTattooOrPiercing: (value: boolean) => void;
  recentTravelDetails: string;
  setRecentTravelDetails: (value: string) => void;
  recentVaccination: boolean;
  setRecentVaccination: (value: boolean) => void;
  recentSurgery: boolean;
  setRecentSurgery: (value: boolean) => void;
  chronicDiseases: string;
  setChronicDiseases: (value: string) => void;
  allergies: string;
  setAllergies: (value: string) => void;
  lastDonationDate: string;
  setLastDonationDate: (value: string) => void;
}

export function EligibilityCriteria({
  dob,
  age,
  weight,
  setWeight,
  weightEligible,
  height,
  setHeight,
  bodyMassIndex,
  bodySize,
  setBodySize,
  isLivingDonor,
  setIsLivingDonor,
  medicalClearance,
  setMedicalClearance,
  recentTattooOrPiercing,
  setRecentTattooOrPiercing,
  recentTravelDetails,
  setRecentTravelDetails,
  recentVaccination,
  setRecentVaccination,
  recentSurgery,
  setRecentSurgery,
  chronicDiseases,
  setChronicDiseases,
  allergies,
  setAllergies,
  lastDonationDate,
  setLastDonationDate,
}: EligibilityCriteriaProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createDonorStyles(theme);

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Eligibility Criteria</Text>
      
      <TextInput
        value={dob}
        editable={false}
        style={[styles.input, styles.inputDisabled]}
        placeholder="Date of Birth"
      />
      
      {age !== null && (
        <Text style={[
          styles.eligibilityText,
          age >= 18 ? styles.eligibleText : styles.ineligibleText
        ]}>
          Age: {age} ({age >= 18 ? "Eligible" : "Not eligible"})
        </Text>
      )}
      
      <TextInput
        style={styles.input}
        placeholder="Weight (kg)"
        placeholderTextColor={theme.textSecondary}
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />

      <TextInput
        style={styles.input}
        placeholder="Height (cm)"
        placeholderTextColor={theme.textSecondary}
        keyboardType="numeric"
        value={height}
        onChangeText={setHeight}
      />

      {bodyMassIndex && (
        <Text style={[styles.eligibilityText, styles.eligibleText]}>
          BMI: {bodyMassIndex}
        </Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Body Size (SMALL/MEDIUM/LARGE)"
        placeholderTextColor={theme.textSecondary}
        value={bodySize}
        onChangeText={setBodySize}
      />
      
      {weight && (
        <Text style={[
          styles.eligibilityText,
          weightEligible ? styles.eligibleText : styles.ineligibleText
        ]}>
          {weightEligible
            ? "Eligible for donation (weight ≥ 50kg)"
            : "Not eligible (weight < 50kg)"}
        </Text>
      )}

      <View style={styles.switchRow}>
        <Text style={styles.label}>Living Donor?</Text>
        <Switch
          value={isLivingDonor}
          onValueChange={setIsLivingDonor}
          thumbColor={theme.primary}
          trackColor={{ false: theme.border, true: theme.primary + '50' }}
        />
      </View>
      
      <View style={styles.switchRow}>
        <Text style={styles.label}>Medical Clearance?</Text>
        <Switch
          value={medicalClearance}
          onValueChange={setMedicalClearance}
          thumbColor={theme.primary}
          trackColor={{ false: theme.border, true: theme.primary + '50' }}
        />
      </View>
      
      <View style={styles.switchRow}>
        <Text style={styles.label}>Recent Tattoo or Piercing?</Text>
        <Switch
          value={recentTattooOrPiercing}
          onValueChange={setRecentTattooOrPiercing}
          thumbColor={theme.primary}
          trackColor={{ false: theme.border, true: theme.primary + '50' }}
        />
      </View>
      
      <TextInput
        style={styles.input}
        placeholder="Recent Travel Details"
        placeholderTextColor={theme.textSecondary}
        value={recentTravelDetails}
        onChangeText={setRecentTravelDetails}
        multiline
      />
      
      <View style={styles.switchRow}>
        <Text style={styles.label}>Recent Vaccination?</Text>
        <Switch
          value={recentVaccination}
          onValueChange={setRecentVaccination}
          thumbColor={theme.primary}
          trackColor={{ false: theme.border, true: theme.primary + '50' }}
        />
      </View>
      
      <View style={styles.switchRow}>
        <Text style={styles.label}>Recent Surgery?</Text>
        <Switch 
          value={recentSurgery} 
          onValueChange={setRecentSurgery}
          thumbColor={theme.primary}
          trackColor={{ false: theme.border, true: theme.primary + '50' }}
        />
      </View>
      
      <TextInput
        style={styles.input}
        placeholder="Chronic Diseases (if any)"
        placeholderTextColor={theme.textSecondary}
        value={chronicDiseases}
        onChangeText={setChronicDiseases}
        multiline
      />
      
      <TextInput
        style={styles.input}
        placeholder="Allergies (if any)"
        placeholderTextColor={theme.textSecondary}
        value={allergies}
        onChangeText={setAllergies}
        multiline
      />
      
      <TextInput
        style={styles.input}
        placeholder="Last Donation Date (YYYY-MM-DD, optional)"
        placeholderTextColor={theme.textSecondary}
        value={lastDonationDate}
        onChangeText={setLastDonationDate}
      />
    </View>
  );
}
