import React, { useState } from 'react';
import { View, Text, TextInput, Switch } from 'react-native';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';
import { createUnifiedStyles } from '../../constants/styles/unifiedStyles';
import { createDonorStyles } from '../../constants/styles/donorStyles';
import { Feather } from '@expo/vector-icons';
import { CustomDatePicker } from '../common/DatePicker';
import { validateWeight, validateHeight } from '../../utils/medicalValidation';

interface EligibilityCriteriaProps {
  fieldRefs?: React.MutableRefObject<{ [key: string]: View | null }>;
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
  fieldRefs,
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

  const weightValidation = validateWeight(weight);
  const heightValidation = validateHeight(height);

  const requiredFieldsCount = 2;
  const filledFieldsCount = [weight, height].filter(field => field && field.trim() !== '').length;
  const isSectionComplete = filledFieldsCount === requiredFieldsCount;
  const missingCount = requiredFieldsCount - filledFieldsCount;

  const ageEligible = age !== null && age >= 18;

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconContainer}>
          <Feather
            name="check-circle"
            size={18}
            color={isSectionComplete ? theme.success : theme.primary}
          />
        </View>
        <Text style={styles.sectionTitle}>Eligibility Criteria</Text>
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
              {missingCount} required
            </Text>
          </View>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Date of Birth</Text>
        <TextInput
          value={dob}
          editable={false}
          style={[styles.input, styles.inputDisabled]}
          placeholder="Date of Birth"
          placeholderTextColor={theme.textSecondary}
        />
      </View>

      {age !== null && (
        <Text style={[
          donorStyles.eligibilityText,
          ageEligible ? donorStyles.eligibleText : donorStyles.ineligibleText
        ]}>
          {ageEligible ? `✓ Age Eligible (${age} years)` : `⚠ Must be 18 or older (${age} years)`}
        </Text>
      )}

      <View style={styles.inputContainer} ref={(ref) => { if (fieldRefs && ref) fieldRefs.current['weight'] = ref; }}>
        <Text style={styles.label}>
          Weight (kg) <Text style={{ color: theme.error }}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            weight && !weightValidation.isValid && { borderColor: theme.error, borderWidth: 2 }
          ]}
          placeholder="Enter weight in kg"
          placeholderTextColor={theme.textSecondary}
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
        />
        {weight && !weightValidation.isValid && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Feather name="alert-circle" size={12} color={theme.error} />
            <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
              {weightValidation.message}
            </Text>
          </View>
        )}
        {weight && weightValidation.isValid && (
          <Text style={[
            donorStyles.eligibilityText,
            weightEligible ? donorStyles.eligibleText : donorStyles.ineligibleText
          ]}>
            {weightEligible ? "✓ Weight Eligible (≥50kg)" : "⚠ Minimum 50kg required"}
          </Text>
        )}
      </View>

      <View style={styles.inputContainer} ref={(ref) => { if (fieldRefs && ref) fieldRefs.current['height'] = ref; }}>
        <Text style={styles.label}>
          Height (cm) <Text style={{ color: theme.error }}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            height && !heightValidation.isValid && { borderColor: theme.error, borderWidth: 2 }
          ]}
          placeholder="Enter height in cm"
          placeholderTextColor={theme.textSecondary}
          keyboardType="numeric"
          value={height}
          onChangeText={setHeight}
        />
        {height && !heightValidation.isValid && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Feather name="alert-circle" size={12} color={theme.error} />
            <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
              {heightValidation.message}
            </Text>
          </View>
        )}
      </View>

      {bodyMassIndex && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Body Mass Index (BMI)</Text>
          <Text style={[
            donorStyles.eligibilityText,
            parseFloat(bodyMassIndex) >= 18.5 && parseFloat(bodyMassIndex) <= 30
              ? donorStyles.eligibleText : donorStyles.ineligibleText
          ]}>
            {bodyMassIndex} - {
              parseFloat(bodyMassIndex) >= 18.5 && parseFloat(bodyMassIndex) <= 30
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
          value={bodySize}
          onChangeText={setBodySize}
        />
      </View>

      <View style={styles.switchRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.switchLabel}>Living Donor?</Text>
          <Text style={{
            fontSize: 11,
            color: theme.textSecondary,
            marginTop: 2,
            lineHeight: 14,
          }}>
            Toggle ON if this is a living donor donation
          </Text>
        </View>
        <Switch
          value={isLivingDonor}
          onValueChange={setIsLivingDonor}
          thumbColor={theme.primary}
          trackColor={{ false: theme.border, true: theme.primary + '50' }}
        />
      </View>

      <View style={styles.switchRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.switchLabel}>Medical Clearance Obtained?</Text>
          <Text style={{
            fontSize: 11,
            color: theme.textSecondary,
            marginTop: 2,
            lineHeight: 14,
          }}>
            Toggle ON if you have obtained medical clearance from a physician certifying fitness to donate
          </Text>
        </View>
        <Switch
          value={medicalClearance}
          onValueChange={setMedicalClearance}
          thumbColor={theme.primary}
          trackColor={{ false: theme.border, true: theme.primary + '50' }}
        />
      </View>

      <View style={styles.switchRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.switchLabel}>Recent Tattoo or Piercing?</Text>
          <Text style={{
            fontSize: 11,
            color: theme.textSecondary,
            marginTop: 2,
            lineHeight: 14,
          }}>
            Toggle ON if you have had a tattoo or piercing within the last 6 months
          </Text>
        </View>
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
          placeholder="Describe recent travel to areas with disease outbreaks..."
          placeholderTextColor={theme.textSecondary}
          value={recentTravelDetails}
          onChangeText={setRecentTravelDetails}
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.switchRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.switchLabel}>Recent Vaccination?</Text>
          <Text style={{
            fontSize: 11,
            color: theme.textSecondary,
            marginTop: 2,
            lineHeight: 14,
          }}>
            Toggle ON if you have received vaccinations in the past 4 weeks
          </Text>
        </View>
        <Switch
          value={recentVaccination}
          onValueChange={setRecentVaccination}
          thumbColor={theme.primary}
          trackColor={{ false: theme.border, true: theme.primary + '50' }}
        />
      </View>

      <View style={styles.switchRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.switchLabel}>Recent Surgery?</Text>
          <Text style={{
            fontSize: 11,
            color: theme.textSecondary,
            marginTop: 2,
            lineHeight: 14,
          }}>
            Toggle ON if you have had surgery within the past 6 months
          </Text>
        </View>
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
          placeholder="List any chronic diseases or conditions..."
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
          placeholder="List any known allergies..."
          placeholderTextColor={theme.textSecondary}
          value={allergies}
          onChangeText={setAllergies}
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Last Donation Date (Optional)</Text>
        <CustomDatePicker
          selectedDate={lastDonationDate}
          onDateChange={setLastDonationDate}
          hasError={false}
          placeholder="Select last donation date (if applicable)"
        />
      </View>
    </View>
  );
}
