import React from 'react';
import { View, Text, TextInput, Switch } from 'react-native';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';
import { createDonorStyles } from '../../constants/styles/donorStyles';

interface MedicalDetailsProps {
  hemoglobinLevel: string;
  setHemoglobinLevel: (value: string) => void;
  bloodPressure: string;
  setBloodPressure: (value: string) => void;
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

export function MedicalDetails({
  hemoglobinLevel,
  setHemoglobinLevel,
  bloodPressure,
  setBloodPressure,
  hasDiseases,
  setHasDiseases,
  diseaseDescription,
  setDiseaseDescription,
  takingMedication,
  setTakingMedication,
  currentMedications,
  setCurrentMedications,
  lastMedicalCheckup,
  setLastMedicalCheckup,
  medicalHistory,
  setMedicalHistory,
  hasInfectiousDiseases,
  setHasInfectiousDiseases,
  infectiousDiseaseDetails,
  setInfectiousDiseaseDetails,
  creatinineLevel,
  setCreatinineLevel,
  liverFunctionTests,
  setLiverFunctionTests,
  cardiacStatus,
  setCardiacStatus,
  pulmonaryFunction,
  setPulmonaryFunction,
  overallHealthStatus,
  setOverallHealthStatus,
  gender,
}: MedicalDetailsProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createDonorStyles(theme);

  return (
    
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Medical Details</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Hemoglobin Level (g/dL)"
        placeholderTextColor={theme.textSecondary}
        keyboardType="numeric"
        value={hemoglobinLevel}
        onChangeText={setHemoglobinLevel}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Blood Pressure (e.g., 120/80)"
        placeholderTextColor={theme.textSecondary}
        value={bloodPressure}
        onChangeText={setBloodPressure}
      />

      <TextInput
        style={styles.input}
        placeholder="Creatinine Level (mg/dL)"
        placeholderTextColor={theme.textSecondary}
        keyboardType="numeric"
        value={creatinineLevel}
        onChangeText={setCreatinineLevel}
      />

      <TextInput
        style={styles.input}
        placeholder="Liver Function Tests Result"
        placeholderTextColor={theme.textSecondary}
        value={liverFunctionTests}
        onChangeText={setLiverFunctionTests}
      />

      <TextInput
        style={styles.input}
        placeholder="Cardiac Status"
        placeholderTextColor={theme.textSecondary}
        value={cardiacStatus}
        onChangeText={setCardiacStatus}
      />

      <TextInput
        style={styles.input}
        placeholder="Pulmonary Function (%)"
        placeholderTextColor={theme.textSecondary}
        keyboardType="numeric"
        value={pulmonaryFunction}
        onChangeText={setPulmonaryFunction}
      />

      <TextInput
        style={styles.input}
        placeholder="Overall Health Status"
        placeholderTextColor={theme.textSecondary}
        value={overallHealthStatus}
        onChangeText={setOverallHealthStatus}
      />

      <TextInput
        style={styles.input}
        placeholder="Last Medical Checkup (YYYY-MM-DD)"
        placeholderTextColor={theme.textSecondary}
        value={lastMedicalCheckup}
        onChangeText={setLastMedicalCheckup}
      />

      <TextInput
        style={styles.input}
        placeholder="Medical History"
        placeholderTextColor={theme.textSecondary}
        value={medicalHistory}
        onChangeText={setMedicalHistory}
        multiline
        numberOfLines={3}
      />
      
      <View style={styles.switchRow}>
        <Text style={styles.label}>Any diseases?</Text>
        <Switch
          value={hasDiseases}
          onValueChange={setHasDiseases}
          thumbColor={theme.primary}
          trackColor={{ false: theme.border, true: theme.primary + '50' }}
        />
      </View>
      
      {hasDiseases && (
        <TextInput
          style={styles.input}
          placeholder="Describe diseases"
          placeholderTextColor={theme.textSecondary}
          value={diseaseDescription}
          onChangeText={setDiseaseDescription}
          multiline
          numberOfLines={3}
        />
      )}

      <View style={styles.switchRow}>
        <Text style={styles.label}>Has Infectious Diseases?</Text>
        <Switch
          value={hasInfectiousDiseases}
          onValueChange={setHasInfectiousDiseases}
          thumbColor={theme.primary}
          trackColor={{ false: theme.border, true: theme.primary + '50' }}
        />
      </View>

      {hasInfectiousDiseases && (
        <TextInput
          style={styles.input}
          placeholder="Infectious Disease Details"
          placeholderTextColor={theme.textSecondary}
          value={infectiousDiseaseDetails}
          onChangeText={setInfectiousDiseaseDetails}
          multiline
          numberOfLines={3}
        />
      )}
      
      <View style={styles.switchRow}>
        <Text style={styles.label}>Taking Medication?</Text>
        <Switch
          value={takingMedication}
          onValueChange={setTakingMedication}
          thumbColor={theme.primary}
          trackColor={{ false: theme.border, true: theme.primary + '50' }}
        />
      </View>

      {takingMedication && (
        <TextInput
          style={styles.input}
          placeholder="Current Medications"
          placeholderTextColor={theme.textSecondary}
          value={currentMedications}
          onChangeText={setCurrentMedications}
          multiline
          numberOfLines={3}
        />
      )}
    </View>
  );
}
