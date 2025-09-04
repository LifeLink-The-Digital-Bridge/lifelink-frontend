import React from 'react';
import { View, Text, TextInput, Switch } from 'react-native';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';
import { createUnifiedStyles } from '../../constants/styles/unifiedStyles';
import { createDonorStyles } from '../../constants/styles/donorStyles';
import { Feather } from '@expo/vector-icons';

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
  const styles = createUnifiedStyles(theme);
  const donorStyles = createDonorStyles(theme);

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconContainer}>
          <Feather name="check-circle" size={18} color={theme.primary} />
        </View>
        <Text style={styles.sectionTitle}>Eligibility Criteria</Text>
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Date of Birth</Text>
        <TextInput
          value={dob}
          editable={false}
          style={[styles.input, styles.inputDisabled]}
          placeholder="Date of Birth"
        />
      </View>
      
      {age !== null && (
        <Text style={[
          donorStyles.eligibilityText,
          age >= 18 ? donorStyles.eligibleText : donorStyles.ineligibleText
        ]}>
          Age: {age} ({age >= 18 ? "Eligible" : "Not eligible"})
        </Text>
      )}
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Weight (kg)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter weight in kg"
          placeholderTextColor={theme.textSecondary}
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Height (cm)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter height in cm"
          placeholderTextColor={theme.textSecondary}
          keyboardType="numeric"
          value={height}
          onChangeText={setHeight}
        />
      </View>

      {bodyMassIndex && (
        <Text style={[donorStyles.eligibilityText, donorStyles.eligibleText]}>
          BMI: {bodyMassIndex}
        </Text>
      )}

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Body Size</Text>
        <TextInput
          style={styles.input}
          placeholder="SMALL/MEDIUM/LARGE"
          placeholderTextColor={theme.textSecondary}
          value={bodySize}
          onChangeText={setBodySize}
        />
      </View>
      
      {weight && (
        <Text style={[
          donorStyles.eligibilityText,
          weightEligible ? donorStyles.eligibleText : donorStyles.ineligibleText
        ]}>
          {weightEligible
            ? "Eligible for donation (weight ≥ 50kg)"
            : "Not eligible (weight < 50kg)"}
        </Text>
      )}

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Living Donor?</Text>
        <Switch
          value={isLivingDonor}
          onValueChange={setIsLivingDonor}
          thumbColor={theme.primary}
          trackColor={{ false: theme.border, true: theme.primary + '50' }}
        />
      </View>
      
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Medical Clearance?</Text>
        <Switch
          value={medicalClearance}
          onValueChange={setMedicalClearance}
          thumbColor={theme.primary}
          trackColor={{ false: theme.border, true: theme.primary + '50' }}
        />
      </View>
      
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Recent Tattoo or Piercing?</Text>
        <Switch
          value={recentTattooOrPiercing}
          onValueChange={setRecentTattooOrPiercing}
          thumbColor={theme.primary}
          trackColor={{ false: theme.border, true: theme.primary + '50' }}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Recent Travel Details</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Describe recent travel"
          placeholderTextColor={theme.textSecondary}
          value={recentTravelDetails}
          onChangeText={setRecentTravelDetails}
          multiline
          numberOfLines={3}
        />
      </View>
      
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Recent Vaccination?</Text>
        <Switch
          value={recentVaccination}
          onValueChange={setRecentVaccination}
          thumbColor={theme.primary}
          trackColor={{ false: theme.border, true: theme.primary + '50' }}
        />
      </View>
      
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Recent Surgery?</Text>
        <Switch 
          value={recentSurgery} 
          onValueChange={setRecentSurgery}
          thumbColor={theme.primary}
          trackColor={{ false: theme.border, true: theme.primary + '50' }}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Chronic Diseases</Text>
        <TextInput
          style={styles.textArea}
          placeholder="List any chronic diseases"
          placeholderTextColor={theme.textSecondary}
          value={chronicDiseases}
          onChangeText={setChronicDiseases}
          multiline
          numberOfLines={3}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Allergies</Text>
        <TextInput
          style={styles.textArea}
          placeholder="List any allergies"
          placeholderTextColor={theme.textSecondary}
          value={allergies}
          onChangeText={setAllergies}
          multiline
          numberOfLines={3}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Last Donation Date (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={theme.textSecondary}
          value={lastDonationDate}
          onChangeText={setLastDonationDate}
        />
      </View>
    </View>
  );
}
