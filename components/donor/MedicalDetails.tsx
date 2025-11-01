import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Switch } from 'react-native';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';
import { createUnifiedStyles } from '../../constants/styles/unifiedStyles';
import { createDonorStyles } from '../../constants/styles/donorStyles';
import { Feather } from '@expo/vector-icons';
import { CustomDatePicker } from '../common/DatePicker';
import { getBloodPressureCategory, validateBloodPressure } from '../../utils/bloodPressureValidator';
import { validateHemoglobin, validateBloodGlucose, validateCreatinine, validatePulmonaryFunction } from '../../utils/medicalValidation';

interface MedicalDetailsProps {
  fieldRefs?: React.MutableRefObject<{ [key: string]: View | null }>;
  hemoglobinLevel: string;
  setHemoglobinLevel: (value: string) => void;
  bloodPressure: string;
  setBloodPressure: (value: string) => void;
  bloodGlucoseLevel: string;
  setBloodGlucoseLevel: (value: string) => void;
  hasDiabetes: boolean;
  setHasDiabetes: (value: boolean) => void;
  hasDiseases: boolean;
  setHasDiseases: (value: boolean) => void;
  diseaseDescription: string;
  setDiseaseDescription: (value: string) => void;
  takingMedication: boolean;
  setTakingMedication: (value: boolean) => void;
  currentMedications: string;
  setCurrentMedications: (value: string) => void;
  lastMedicalCheckup: string;
  setLastMedicalCheckup: (value: string) => void;
  medicalHistory: string;
  setMedicalHistory: (value: string) => void;
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
  gender: string;
}

export function MedicalDetails(props: MedicalDetailsProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);
  const donorStyles = createDonorStyles(theme);

  const bpValidation = validateBloodPressure(props.bloodPressure);
  const hbValidation = validateHemoglobin(props.hemoglobinLevel, props.gender);
  const glucoseValidation = validateBloodGlucose(props.bloodGlucoseLevel);
  const creatinineValidation = validateCreatinine(props.creatinineLevel);
  const pulmonaryValidation = validatePulmonaryFunction(props.pulmonaryFunction);

  const [touched, setTouched] = useState<{ [key: string]: boolean }>({
    lastMedicalCheckup: false,
    medicalHistory: false,
    liverFunctionTests: false,
    cardiacStatus: false,
    overallHealthStatus: false,
  });
  const requiredFieldsCount = 9;
  const filledFieldsCount = [
    props.bloodPressure,
    props.hemoglobinLevel,
    props.creatinineLevel,
    props.lastMedicalCheckup,
    props.medicalHistory,
    props.liverFunctionTests,
    props.cardiacStatus,
    props.pulmonaryFunction,
    props.overallHealthStatus
  ].filter(field => field && field.trim() !== '').length;

  const isSectionComplete = filledFieldsCount === requiredFieldsCount && bpValidation.isValid;
  const missingCount = requiredFieldsCount - filledFieldsCount;

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
        <Text style={styles.sectionTitle}>Medical Details</Text>
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

      <View style={styles.inputContainer} ref={(ref) => { if (props.fieldRefs && ref) props.fieldRefs.current['bloodPressure'] = ref; }}>
        <Text style={styles.label}>
          Blood Pressure (mmHg) <Text style={{ color: theme.error }}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            props.bloodPressure && !bpValidation.isValid && {
              borderColor: theme.error,
              borderWidth: 2
            }
          ]}
          placeholder="120/80"
          placeholderTextColor={theme.textSecondary}
          value={props.bloodPressure}
          onChangeText={props.setBloodPressure}
          keyboardType="numbers-and-punctuation"
        />
        {props.bloodPressure && !bpValidation.isValid && (
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

      <View style={styles.inputContainer} ref={(ref) => { if (props.fieldRefs && ref) props.fieldRefs.current['hemoglobinLevel'] = ref; }}>
        <Text style={styles.label}>
          Hemoglobin Level (g/dL) <Text style={{ color: theme.error }}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            props.hemoglobinLevel && !hbValidation.isValid && {
              borderColor: theme.error,
              borderWidth: 2
            }
          ]}
          placeholder="13.5"
          placeholderTextColor={theme.textSecondary}
          value={props.hemoglobinLevel}
          onChangeText={props.setHemoglobinLevel}
          keyboardType="decimal-pad"
        />
        {props.hemoglobinLevel && !hbValidation.isValid && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Feather name="alert-circle" size={12} color={theme.error} />
            <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
              {hbValidation.message}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.inputContainer} ref={(ref) => { if (props.fieldRefs && ref) props.fieldRefs.current['bloodGlucoseLevel'] = ref; }}>
        <Text style={styles.label}>Blood Glucose Level (mg/dL)</Text>
        <TextInput
          style={[
            styles.input,
            props.bloodGlucoseLevel && !glucoseValidation.isValid && {
              borderColor: theme.error,
              borderWidth: 2
            }
          ]}
          placeholder="100"
          placeholderTextColor={theme.textSecondary}
          value={props.bloodGlucoseLevel}
          onChangeText={props.setBloodGlucoseLevel}
          keyboardType="decimal-pad"
        />
        {props.bloodGlucoseLevel && !glucoseValidation.isValid && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Feather name="alert-circle" size={12} color={theme.error} />
            <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
              {glucoseValidation.message}
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

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Has Diseases?</Text>
        <Switch
          value={props.hasDiseases}
          onValueChange={props.setHasDiseases}
          thumbColor={theme.primary}
          trackColor={{ false: theme.border, true: theme.primary + '50' }}
        />
      </View>

      {props.hasDiseases && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Disease Description</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Describe any diseases..."
            placeholderTextColor={theme.textSecondary}
            value={props.diseaseDescription}
            onChangeText={props.setDiseaseDescription}
            multiline
            numberOfLines={3}
          />
        </View>
      )}

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Taking Medication?</Text>
        <Switch
          value={props.takingMedication}
          onValueChange={props.setTakingMedication}
          thumbColor={theme.primary}
          trackColor={{ false: theme.border, true: theme.primary + '50' }}
        />
      </View>

      {props.takingMedication && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Current Medications</Text>
          <TextInput
            style={styles.textArea}
            placeholder="List current medications..."
            placeholderTextColor={theme.textSecondary}
            value={props.currentMedications}
            onChangeText={props.setCurrentMedications}
            multiline
            numberOfLines={3}
          />
        </View>
      )}

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          Last Medical Checkup <Text style={{ color: theme.error }}>*</Text>
        </Text>
        <CustomDatePicker
          selectedDate={props.lastMedicalCheckup}
          onDateChange={props.setLastMedicalCheckup}
          hasError={!props.lastMedicalCheckup && touched.lastMedicalCheckup}
          placeholder="Select last checkup date"
        />
        {!props.lastMedicalCheckup && touched.lastMedicalCheckup && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Feather name="alert-circle" size={12} color={theme.error} />
            <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
              Last medical checkup date is required
            </Text>
          </View>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          Medical History <Text style={{ color: theme.error }}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.textArea,
            !props.medicalHistory && touched.medicalHistory && {
              borderColor: theme.error,
              borderWidth: 2
            }
          ]}
          placeholder="Detailed medical history..."
          placeholderTextColor={theme.textSecondary}
          value={props.medicalHistory}
          onChangeText={props.setMedicalHistory}
          onBlur={() => setTouched({ ...touched, medicalHistory: true })}
          multiline
          numberOfLines={4}
        />
        {!props.medicalHistory && touched.medicalHistory && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Feather name="alert-circle" size={12} color={theme.error} />
            <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
              Medical history is required
            </Text>
          </View>
        )}
      </View>

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
            placeholder="Describe infectious diseases..."
            placeholderTextColor={theme.textSecondary}
            value={props.infectiousDiseaseDetails}
            onChangeText={props.setInfectiousDiseaseDetails}
            multiline
            numberOfLines={3}
          />
        </View>
      )}

      <View style={styles.inputContainer} ref={(ref) => { if (props.fieldRefs && ref) props.fieldRefs.current['creatinineLevel'] = ref; }}>
        <Text style={styles.label}>
          Creatinine Level (mg/dL) <Text style={{ color: theme.error }}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            props.creatinineLevel && !creatinineValidation.isValid && {
              borderColor: theme.error,
              borderWidth: 2
            }
          ]}
          placeholder="1.0"
          placeholderTextColor={theme.textSecondary}
          value={props.creatinineLevel}
          onChangeText={props.setCreatinineLevel}
          keyboardType="decimal-pad"
        />
        {props.creatinineLevel && !creatinineValidation.isValid && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Feather name="alert-circle" size={12} color={theme.error} />
            <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
              {creatinineValidation.message}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          Liver Function Tests <Text style={{ color: theme.error }}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.textArea,
            !props.liverFunctionTests && touched.liverFunctionTests && {
              borderColor: theme.error,
              borderWidth: 2
            }
          ]}
          placeholder="ALT: 30 U/L, AST: 28 U/L..."
          placeholderTextColor={theme.textSecondary}
          value={props.liverFunctionTests}
          onChangeText={props.setLiverFunctionTests}
          onBlur={() => setTouched({ ...touched, liverFunctionTests: true })}
          multiline
          numberOfLines={3}
        />
        {!props.liverFunctionTests && touched.liverFunctionTests && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Feather name="alert-circle" size={12} color={theme.error} />
            <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
              Liver function tests results are required
            </Text>
          </View>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          Cardiac Status <Text style={{ color: theme.error }}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            !props.cardiacStatus && touched.cardiacStatus && {
              borderColor: theme.error,
              borderWidth: 2
            }
          ]}
          placeholder="Normal/Abnormal - details"
          placeholderTextColor={theme.textSecondary}
          value={props.cardiacStatus}
          onChangeText={props.setCardiacStatus}
          onBlur={() => setTouched({ ...touched, cardiacStatus: true })}
        />
        {!props.cardiacStatus && touched.cardiacStatus && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Feather name="alert-circle" size={12} color={theme.error} />
            <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
              Cardiac status is required
            </Text>
          </View>
        )}
      </View>

      <View style={styles.inputContainer} ref={(ref) => { if (props.fieldRefs && ref) props.fieldRefs.current['pulmonaryFunction'] = ref; }}>
        <Text style={styles.label}>
          Pulmonary Function (%) <Text style={{ color: theme.error }}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            props.pulmonaryFunction && !pulmonaryValidation.isValid && {
              borderColor: theme.error,
              borderWidth: 2
            }
          ]}
          placeholder="85.5"
          placeholderTextColor={theme.textSecondary}
          value={props.pulmonaryFunction}
          onChangeText={props.setPulmonaryFunction}
          keyboardType="decimal-pad"
        />
        {props.pulmonaryFunction && !pulmonaryValidation.isValid && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Feather name="alert-circle" size={12} color={theme.error} />
            <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
              {pulmonaryValidation.message}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          Overall Health Status <Text style={{ color: theme.error }}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            !props.overallHealthStatus && touched.overallHealthStatus && {
              borderColor: theme.error,
              borderWidth: 2
            }
          ]}
          placeholder="Excellent/Good/Fair/Poor"
          placeholderTextColor={theme.textSecondary}
          value={props.overallHealthStatus}
          onChangeText={props.setOverallHealthStatus}
          onBlur={() => setTouched({ ...touched, overallHealthStatus: true })}
        />
        {!props.overallHealthStatus && touched.overallHealthStatus && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Feather name="alert-circle" size={12} color={theme.error} />
            <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
              Overall health status is required
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
