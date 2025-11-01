import React, { useState } from 'react';
import { View, Text, TextInput, Switch } from 'react-native';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';
import { createUnifiedStyles } from '../../constants/styles/unifiedStyles';
import { createDonorStyles } from '../../constants/styles/donorStyles';
import { Feather } from '@expo/vector-icons';
import { CustomDatePicker } from '../common/DatePicker';
import { validateWeight, validateHeight, validateAge } from '../../utils/medicalValidation';

interface EligibilityCriteriaProps {
  fieldRefs?: React.MutableRefObject<{ [key: string]: View | null }>;
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
  const { fieldRefs } = props;
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);
  const donorStyles = createDonorStyles(theme);

  const ageValidation = validateAge(props.age);
  const weightValidation = validateWeight(props.weight);
  const heightValidation = validateHeight(props.height);

  const requiredFieldsCount = 3;
  const filledFieldsCount = [props.age, props.weight, props.height].filter(field => field && field.trim() !== '').length;
  const isSectionComplete = filledFieldsCount === requiredFieldsCount;
  const missingCount = requiredFieldsCount - filledFieldsCount;

  const ageEligible = props.age ? parseInt(props.age) >= 18 : false;
  const isEligible = props.medicallyEligible && props.legalClearance && ageEligible && props.weightEligible;

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

      <View style={styles.inputContainer} ref={(ref) => { if (fieldRefs && ref) fieldRefs.current['age'] = ref; }}>
        <Text style={styles.label}>
          Age <Text style={{ color: theme.error }}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            props.age && !ageValidation.isValid && { borderColor: theme.error, borderWidth: 2 }
          ]}
          placeholder="45"
          placeholderTextColor={theme.textSecondary}
          value={props.age}
          onChangeText={props.setAge}
          keyboardType="numeric"
        />
        {props.age && !ageValidation.isValid && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Feather name="alert-circle" size={12} color={theme.error} />
            <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
              {ageValidation.message}
            </Text>
          </View>
        )}
        {props.age && ageValidation.isValid && (
          <Text style={[
            donorStyles.eligibilityText,
            ageEligible ? donorStyles.eligibleText : donorStyles.ineligibleText
          ]}>
            {ageEligible ? "✓ Age Eligible (≥18)" : "⚠ Must be 18 or older"}
          </Text>
        )}
      </View>

      <View style={styles.inputContainer} ref={(ref) => { if (fieldRefs && ref) fieldRefs.current['weight'] = ref; }}>
        <Text style={styles.label}>
          Weight (kg) <Text style={{ color: theme.error }}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            props.weight && !weightValidation.isValid && { borderColor: theme.error, borderWidth: 2 }
          ]}
          placeholder="75.5"
          placeholderTextColor={theme.textSecondary}
          value={props.weight}
          onChangeText={props.setWeight}
          keyboardType="numeric"
        />
        {props.weight && !weightValidation.isValid && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Feather name="alert-circle" size={12} color={theme.error} />
            <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
              {weightValidation.message}
            </Text>
          </View>
        )}
        {props.weight && weightValidation.isValid && (
          <Text style={[
            donorStyles.eligibilityText,
            props.weightEligible ? donorStyles.eligibleText : donorStyles.ineligibleText
          ]}>
            {props.weightEligible ? "✓ Weight Eligible (≥45kg)" : "⚠ Minimum 45kg required"}
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
            props.height && !heightValidation.isValid && { borderColor: theme.error, borderWidth: 2 }
          ]}
          placeholder="175"
          placeholderTextColor={theme.textSecondary}
          value={props.height}
          onChangeText={props.setHeight}
          keyboardType="numeric"
        />
        {props.height && !heightValidation.isValid && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Feather name="alert-circle" size={12} color={theme.error} />
            <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
              {heightValidation.message}
            </Text>
          </View>
        )}
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
        <View style={{ flex: 1 }}>
          <Text style={styles.switchLabel}>Medically Eligible?</Text>
          <Text style={{
            fontSize: 11,
            color: theme.textSecondary,
            marginTop: 2,
            lineHeight: 14,
          }}>
            Toggle ON if medical evaluation confirms eligibility for transplant
          </Text>
        </View>
        <Switch
          value={props.medicallyEligible}
          onValueChange={props.setMedicallyEligible}
          thumbColor={theme.primary}
          trackColor={{ false: theme.border, true: theme.primary + '50' }}
        />
      </View>

      <View style={styles.switchRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.switchLabel}>Legal Clearance?</Text>
          <Text style={{
            fontSize: 11,
            color: theme.textSecondary,
            marginTop: 2,
            lineHeight: 14,
          }}>
            Toggle ON if all legal documentation and approvals are obtained
          </Text>
        </View>
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
        <Text style={styles.label}>Last Reviewed (Optional)</Text>
        <CustomDatePicker
          selectedDate={props.lastReviewed}
          onDateChange={props.setLastReviewed}
          hasError={false}
          placeholder="Select last reviewed date"
        />
      </View>
    </View>
  );
}
