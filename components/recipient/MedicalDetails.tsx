import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Switch } from 'react-native';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';
import { createUnifiedStyles } from '../../constants/styles/unifiedStyles';
import { createDonorStyles } from '../../constants/styles/donorStyles';
import { Feather } from '@expo/vector-icons';
import { CustomDatePicker } from '../common/DatePicker';
import { validateBloodPressure, getBloodPressureCategory } from '../../utils/bloodPressureValidator';

interface MedicalDetailsProps {
  hemoglobinLevel: string;
  setHemoglobinLevel: (value: string) => void;
  bloodPressure: string;
  setBloodPressure: (value: string) => void;
  bloodGlucoseLevel: string;
  setBloodGlucoseLevel: (value: string) => void;
  hasDiabetes: boolean;
  setHasDiabetes: (value: boolean) => void;
  diagnosis: string;
  setDiagnosis: (value: string) => void;
  allergies: string;
  setAllergies: (value: string) => void;
  currentMedications: string;
  setCurrentMedications: (value: string) => void;
  additionalNotes: string;
  setAdditionalNotes: (value: string) => void;
  hasInfectiousDiseases: boolean;
  setHasInfectiousDiseases: (value: boolean) => void;
  infectiousDiseaseDetails: string;
  setInfectiousDiseaseDetails: (value: string) => void;
  creatinineLevel: string;
  setCreatinineLevel: (value: string) => void;
  liverFunctionTests: string;
  setLiverFunctionTests: (value: string) => void;
  cardiacStatus: string;
  setCardiacStatus: (value: string) => void;
  pulmonaryFunction: string;
  setPulmonaryFunction: (value: string) => void;
  overallHealthStatus: string;
  setOverallHealthStatus: (value: string) => void;
}

export function MedicalDetails(props: MedicalDetailsProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);
  const donorStyles = createDonorStyles(theme);

  const [touched, setTouched] = useState({
    hemoglobinLevel: false,
    bloodPressure: false,
    bloodGlucoseLevel: false,
    creatinineLevel: false,
    diagnosis: false,
  });

  const [bpValidation, setBpValidation] = useState(validateBloodPressure(props.bloodPressure));

  useEffect(() => {
    const validation = validateBloodPressure(props.bloodPressure);
    setBpValidation(validation);
  }, [props.bloodPressure]);

  const requiredFieldsCount = 5;
  const filledFieldsCount = [
    props.hemoglobinLevel,
    props.bloodPressure,
    props.bloodGlucoseLevel,
    props.creatinineLevel,
    props.diagnosis,
  ].filter(field => field && field.trim() !== '').length;

  const isSectionComplete = filledFieldsCount === requiredFieldsCount && bpValidation.isValid;
  const missingCount = requiredFieldsCount - filledFieldsCount;

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconContainer}>
          <Feather 
            name={isSectionComplete ? "check-circle" : "heart"} 
            size={18} 
            color={isSectionComplete ? theme.success : theme.primary} 
          />
        </View>
        <Text style={styles.sectionTitle}>Medical Information</Text>
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

      <View style={{
        backgroundColor: theme.primary + '15',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.primary + '30',
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
        <Feather name="info" size={16} color={theme.primary} />
        <Text style={{
          marginLeft: 8,
          fontSize: 12,
          color: theme.textSecondary,
          flex: 1,
        }}>
          Fields marked with <Text style={{ color: theme.error }}>*</Text> are required
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          Medical Diagnosis <Text style={{ color: theme.error }}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.textArea,
            !props.diagnosis && touched.diagnosis && { borderColor: theme.error, borderWidth: 2 }
          ]}
          placeholder="e.g., Chronic kidney disease requiring transplant"
          placeholderTextColor={theme.textSecondary}
          value={props.diagnosis}
          onChangeText={props.setDiagnosis}
          onBlur={() => setTouched({ ...touched, diagnosis: true })}
          multiline
          numberOfLines={3}
        />
        {!props.diagnosis && touched.diagnosis && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Feather name="alert-circle" size={12} color={theme.error} />
            <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
              Medical diagnosis is required
            </Text>
          </View>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Known Allergies</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Penicillin, Shellfish"
          placeholderTextColor={theme.textSecondary}
          value={props.allergies}
          onChangeText={props.setAllergies}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Current Medications</Text>
        <TextInput
          style={styles.textArea}
          placeholder="List all current medications..."
          placeholderTextColor={theme.textSecondary}
          value={props.currentMedications}
          onChangeText={props.setCurrentMedications}
          multiline
          numberOfLines={3}
        />
      </View>

      <Text style={styles.subSectionTitle}>Vital Signs & Lab Results</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          Hemoglobin Level (g/dL) <Text style={{ color: theme.error }}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            !props.hemoglobinLevel && touched.hemoglobinLevel && { borderColor: theme.error, borderWidth: 2 }
          ]}
          placeholder="12.5"
          placeholderTextColor={theme.textSecondary}
          value={props.hemoglobinLevel}
          onChangeText={props.setHemoglobinLevel}
          onBlur={() => setTouched({ ...touched, hemoglobinLevel: true })}
          keyboardType="decimal-pad"
        />
        {!props.hemoglobinLevel && touched.hemoglobinLevel && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Feather name="alert-circle" size={12} color={theme.error} />
            <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
              Hemoglobin level is required
            </Text>
          </View>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          Blood Pressure (mmHg) <Text style={{ color: theme.error }}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            touched.bloodPressure && !bpValidation.isValid && { 
              borderColor: theme.error, 
              borderWidth: 2 
            }
          ]}
          placeholder="120/80"
          placeholderTextColor={theme.textSecondary}
          value={props.bloodPressure}
          onChangeText={props.setBloodPressure}
          onBlur={() => setTouched({ ...touched, bloodPressure: true })}
          keyboardType="numbers-and-punctuation"
        />
        {touched.bloodPressure && !bpValidation.isValid && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Feather name="alert-circle" size={12} color={theme.error} />
            <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
              {bpValidation.message}
            </Text>
          </View>
        )}
        {bpValidation.isValid && bpValidation.systolic && bpValidation.diastolic && (
          <Text style={[
            donorStyles.eligibilityText,
            getBloodPressureCategory(bpValidation.systolic, bpValidation.diastolic) === 'Normal' 
              ? donorStyles.eligibleText 
              : donorStyles.ineligibleText
          ]}>
            ✓ {getBloodPressureCategory(bpValidation.systolic, bpValidation.diastolic)} Blood Pressure
          </Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          Blood Glucose Level (mg/dL) <Text style={{ color: theme.error }}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            !props.bloodGlucoseLevel && touched.bloodGlucoseLevel && { borderColor: theme.error, borderWidth: 2 }
          ]}
          placeholder="100"
          placeholderTextColor={theme.textSecondary}
          value={props.bloodGlucoseLevel}
          onChangeText={props.setBloodGlucoseLevel}
          onBlur={() => setTouched({ ...touched, bloodGlucoseLevel: true })}
          keyboardType="decimal-pad"
        />
        {!props.bloodGlucoseLevel && touched.bloodGlucoseLevel && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Feather name="alert-circle" size={12} color={theme.error} />
            <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
              Blood glucose level is required
            </Text>
          </View>
        )}
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Has Diabetes?</Text>
        <Switch
          value={props.hasDiabetes}
          onValueChange={props.setHasDiabetes}
          thumbColor={theme.primary}
          trackColor={{ false: theme.border, true: theme.primary + '50' }}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          Creatinine Level (mg/dL) <Text style={{ color: theme.error }}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            !props.creatinineLevel && touched.creatinineLevel && { borderColor: theme.error, borderWidth: 2 }
          ]}
          placeholder="2.8"
          placeholderTextColor={theme.textSecondary}
          value={props.creatinineLevel}
          onChangeText={props.setCreatinineLevel}
          onBlur={() => setTouched({ ...touched, creatinineLevel: true })}
          keyboardType="decimal-pad"
        />
        {!props.creatinineLevel && touched.creatinineLevel && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Feather name="alert-circle" size={12} color={theme.error} />
            <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
              Creatinine level is required
            </Text>
          </View>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Pulmonary Function (%)</Text>
        <TextInput
          style={styles.input}
          placeholder="85"
          placeholderTextColor={theme.textSecondary}
          value={props.pulmonaryFunction}
          onChangeText={props.setPulmonaryFunction}
          keyboardType="decimal-pad"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Liver Function Tests</Text>
        <TextInput
          style={styles.input}
          placeholder="Normal"
          placeholderTextColor={theme.textSecondary}
          value={props.liverFunctionTests}
          onChangeText={props.setLiverFunctionTests}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Cardiac Status</Text>
        <TextInput
          style={styles.input}
          placeholder="Normal"
          placeholderTextColor={theme.textSecondary}
          value={props.cardiacStatus}
          onChangeText={props.setCardiacStatus}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Overall Health Status</Text>
        <TextInput
          style={styles.input}
          placeholder="Fair - requires transplant"
          placeholderTextColor={theme.textSecondary}
          value={props.overallHealthStatus}
          onChangeText={props.setOverallHealthStatus}
        />
      </View>

      <Text style={styles.subSectionTitle}>Infectious Disease Information</Text>

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Has Infectious Diseases?</Text>
        <Switch
          value={props.hasInfectiousDiseases}
          onValueChange={props.setHasInfectiousDiseases}
          thumbColor={theme.primary}
          trackColor={{ false: theme.border, true: theme.primary + '50' }}
        />
      </View>

      {props.hasInfectiousDiseases && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Infectious Disease Details</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Describe infectious diseases"
            placeholderTextColor={theme.textSecondary}
            value={props.infectiousDiseaseDetails}
            onChangeText={props.setInfectiousDiseaseDetails}
            multiline
            numberOfLines={3}
          />
        </View>
      )}

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Additional Medical Notes</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Any additional medical information..."
          placeholderTextColor={theme.textSecondary}
          value={props.additionalNotes}
          onChangeText={props.setAdditionalNotes}
          multiline
          numberOfLines={4}
        />
      </View>
    </View>
  );
}
