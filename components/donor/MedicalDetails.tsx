import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Switch } from 'react-native';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';
import { createUnifiedStyles } from '../../constants/styles/unifiedStyles';
import { createDonorStyles } from '../../constants/styles/donorStyles';
import { Feather } from '@expo/vector-icons';
import { CustomDatePicker } from '../common/DatePicker';
import { CustomPicker } from '../common/CustomPicker';
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

  const healthStatusOptions = [
    { label: 'EXCELLENT', value: 'EXCELLENT' },
    { label: 'GOOD', value: 'GOOD' },
    { label: 'FAIR', value: 'FAIR' },
    { label: 'POOR', value: 'POOR' }
  ];

  const [touched, setTouched] = useState<{ [key: string]: boolean }>({
    bloodPressure: false,
    hemoglobinLevel: false,
    bloodGlucoseLevel: false,
    creatinineLevel: false,
    pulmonaryFunction: false,
    lastMedicalCheckup: false,
    medicalHistory: false,
    liverFunctionTests: false,
    cardiacStatus: false,
    overallHealthStatus: false,
  });

  useEffect(() => {
    if (props.bloodGlucoseLevel && glucoseValidation.isValid) {
      const glucose = parseFloat(props.bloodGlucoseLevel);
      if (!isNaN(glucose)) {
        if (glucose >= 126) {
          props.setHasDiabetes(true);
        } else if (glucose < 100) {
          props.setHasDiabetes(false);
        }
      }
    }
  }, [props.bloodGlucoseLevel]);

  const requiredFieldsCount = 10;
  const filledFieldsCount = [
    props.bloodPressure,
    props.hemoglobinLevel,
    props.bloodGlucoseLevel,
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
            (touched.bloodPressure && !props.bloodPressure) || (props.bloodPressure && !bpValidation.isValid)
              ? { borderColor: theme.error, borderWidth: 2 }
              : {}
          ]}
          placeholder="120/80"
          placeholderTextColor={theme.textSecondary}
          value={props.bloodPressure}
          onChangeText={props.setBloodPressure}
          onBlur={() => setTouched({ ...touched, bloodPressure: true })}
          keyboardType="numbers-and-punctuation"
        />
        {touched.bloodPressure && !props.bloodPressure && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Feather name="alert-circle" size={12} color={theme.error} />
            <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
              Blood pressure is required
            </Text>
          </View>
        )}
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
            (touched.hemoglobinLevel && !props.hemoglobinLevel) || (props.hemoglobinLevel && !hbValidation.isValid)
              ? { borderColor: theme.error, borderWidth: 2 }
              : {}
          ]}
          placeholder="13.5"
          placeholderTextColor={theme.textSecondary}
          value={props.hemoglobinLevel}
          onChangeText={props.setHemoglobinLevel}
          onBlur={() => setTouched({ ...touched, hemoglobinLevel: true })}
          keyboardType="decimal-pad"
        />
        {touched.hemoglobinLevel && !props.hemoglobinLevel && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Feather name="alert-circle" size={12} color={theme.error} />
            <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
              Hemoglobin level is required
            </Text>
          </View>
        )}
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
        <Text style={styles.label}>
          Blood Glucose Level (mg/dL) <Text style={{ color: theme.error }}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            (touched.bloodGlucoseLevel && !props.bloodGlucoseLevel) || (props.bloodGlucoseLevel && !glucoseValidation.isValid)
              ? { borderColor: theme.error, borderWidth: 2 }
              : {}
          ]}
          placeholder="100"
          placeholderTextColor={theme.textSecondary}
          value={props.bloodGlucoseLevel}
          onChangeText={props.setBloodGlucoseLevel}
          onBlur={() => setTouched({ ...touched, bloodGlucoseLevel: true })}
          keyboardType="decimal-pad"
        />
        {touched.bloodGlucoseLevel && !props.bloodGlucoseLevel && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Feather name="alert-circle" size={12} color={theme.error} />
            <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
              Blood glucose level is required
            </Text>
          </View>
        )}
        {props.bloodGlucoseLevel && !glucoseValidation.isValid && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Feather name="alert-circle" size={12} color={theme.error} />
            <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
              {glucoseValidation.message}
            </Text>
          </View>
        )}
        {props.bloodGlucoseLevel && glucoseValidation.isValid && (
          <View style={{
            backgroundColor: props.hasDiabetes ? theme.error + '15' : theme.success + '15',
            padding: 8,
            borderRadius: 6,
            marginTop: 8,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <Feather 
              name={props.hasDiabetes ? "alert-circle" : "check-circle"} 
              size={14} 
              color={props.hasDiabetes ? theme.error : theme.success} 
            />
            <Text style={{
              marginLeft: 6,
              fontSize: 12,
              color: props.hasDiabetes ? theme.error : theme.success,
              fontWeight: '600',
            }}>
              {props.hasDiabetes 
                ? `Diabetes detected (≥126 mg/dL)` 
                : parseFloat(props.bloodGlucoseLevel) >= 100 && parseFloat(props.bloodGlucoseLevel) < 126
                  ? `Prediabetes range (100-125 mg/dL)`
                  : `Normal glucose level (<100 mg/dL)`
              }
            </Text>
          </View>
        )}
      </View>

      <View style={styles.switchRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.switchLabel}>Has Diabetes?</Text>
          <Text style={{
            fontSize: 11,
            color: theme.textSecondary,
            marginTop: 2,
            lineHeight: 14,
          }}>
            Auto-detected based on glucose level (≥126 mg/dL)
          </Text>
        </View>
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
            touched.medicalHistory && !props.medicalHistory
              ? { borderColor: theme.error, borderWidth: 2 }
              : {}
          ]}
          placeholder="Detailed medical history..."
          placeholderTextColor={theme.textSecondary}
          value={props.medicalHistory}
          onChangeText={props.setMedicalHistory}
          onBlur={() => setTouched({ ...touched, medicalHistory: true })}
          multiline
          numberOfLines={4}
        />
        {touched.medicalHistory && !props.medicalHistory && (
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
            (touched.creatinineLevel && !props.creatinineLevel) || (props.creatinineLevel && !creatinineValidation.isValid)
              ? { borderColor: theme.error, borderWidth: 2 }
              : {}
          ]}
          placeholder="1.0"
          placeholderTextColor={theme.textSecondary}
          value={props.creatinineLevel}
          onChangeText={props.setCreatinineLevel}
          onBlur={() => setTouched({ ...touched, creatinineLevel: true })}
          keyboardType="decimal-pad"
        />
        {touched.creatinineLevel && !props.creatinineLevel && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Feather name="alert-circle" size={12} color={theme.error} />
            <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
              Creatinine level is required
            </Text>
          </View>
        )}
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
            touched.liverFunctionTests && !props.liverFunctionTests
              ? { borderColor: theme.error, borderWidth: 2 }
              : {}
          ]}
          placeholder="ALT: 30 U/L, AST: 28 U/L..."
          placeholderTextColor={theme.textSecondary}
          value={props.liverFunctionTests}
          onChangeText={props.setLiverFunctionTests}
          onBlur={() => setTouched({ ...touched, liverFunctionTests: true })}
          multiline
          numberOfLines={3}
        />
        {touched.liverFunctionTests && !props.liverFunctionTests && (
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
            touched.cardiacStatus && !props.cardiacStatus
              ? { borderColor: theme.error, borderWidth: 2 }
              : {}
          ]}
          placeholder="Normal/Abnormal - details"
          placeholderTextColor={theme.textSecondary}
          value={props.cardiacStatus}
          onChangeText={props.setCardiacStatus}
          onBlur={() => setTouched({ ...touched, cardiacStatus: true })}
        />
        {touched.cardiacStatus && !props.cardiacStatus && (
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
            (touched.pulmonaryFunction && !props.pulmonaryFunction) || (props.pulmonaryFunction && !pulmonaryValidation.isValid)
              ? { borderColor: theme.error, borderWidth: 2 }
              : {}
          ]}
          placeholder="85.5"
          placeholderTextColor={theme.textSecondary}
          value={props.pulmonaryFunction}
          onChangeText={props.setPulmonaryFunction}
          onBlur={() => setTouched({ ...touched, pulmonaryFunction: true })}
          keyboardType="decimal-pad"
        />
        {touched.pulmonaryFunction && !props.pulmonaryFunction && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Feather name="alert-circle" size={12} color={theme.error} />
            <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
              Pulmonary function is required
            </Text>
          </View>
        )}
        {props.pulmonaryFunction && !pulmonaryValidation.isValid && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Feather name="alert-circle" size={12} color={theme.error} />
            <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
              {pulmonaryValidation.message}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.inputContainer} ref={(ref) => { if (props.fieldRefs && ref) props.fieldRefs.current['overallHealthStatus'] = ref; }}>
        <Text style={styles.label}>
          Overall Health Status <Text style={{ color: theme.error }}>*</Text>
        </Text>
        <CustomPicker
          selectedValue={props.overallHealthStatus}
          onValueChange={props.setOverallHealthStatus}
          items={healthStatusOptions}
          placeholder="Select Health Status"
        />
      </View>
    </View>
  );
}
