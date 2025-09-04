import React from 'react';
import { View, Text, TextInput, Switch } from 'react-native';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';
import { createUnifiedStyles } from '../../constants/styles/unifiedStyles';
import { Feather } from '@expo/vector-icons';

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
  const styles = createUnifiedStyles(theme);

  return (
    
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconContainer}>
          <Feather name="heart" size={18} color={theme.primary} />
        </View>
        <Text style={styles.sectionTitle}>Medical Details</Text>
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Hemoglobin Level (g/dL)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter hemoglobin level"
          placeholderTextColor={theme.textSecondary}
          keyboardType="numeric"
          value={hemoglobinLevel}
          onChangeText={setHemoglobinLevel}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Blood Pressure</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 120/80"
          placeholderTextColor={theme.textSecondary}
          value={bloodPressure}
          onChangeText={setBloodPressure}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Creatinine Level (mg/dL)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter creatinine level"
          placeholderTextColor={theme.textSecondary}
          keyboardType="numeric"
          value={creatinineLevel}
          onChangeText={setCreatinineLevel}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Liver Function Tests</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter test results"
          placeholderTextColor={theme.textSecondary}
          value={liverFunctionTests}
          onChangeText={setLiverFunctionTests}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Cardiac Status</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter cardiac status"
          placeholderTextColor={theme.textSecondary}
          value={cardiacStatus}
          onChangeText={setCardiacStatus}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Pulmonary Function (%)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter percentage"
          placeholderTextColor={theme.textSecondary}
          keyboardType="numeric"
          value={pulmonaryFunction}
          onChangeText={setPulmonaryFunction}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Overall Health Status</Text>
        <TextInput
          style={styles.input}
          placeholder="Describe overall health"
          placeholderTextColor={theme.textSecondary}
          value={overallHealthStatus}
          onChangeText={setOverallHealthStatus}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Last Medical Checkup</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={theme.textSecondary}
          value={lastMedicalCheckup}
          onChangeText={setLastMedicalCheckup}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Medical History</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Describe your medical history"
          placeholderTextColor={theme.textSecondary}
          value={medicalHistory}
          onChangeText={setMedicalHistory}
          multiline
          numberOfLines={3}
        />
      </View>
      
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Any diseases?</Text>
        <Switch
          value={hasDiseases}
          onValueChange={setHasDiseases}
          thumbColor={theme.primary}
          trackColor={{ false: theme.border, true: theme.primary + '50' }}
        />
      </View>
      
      {hasDiseases && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Disease Description</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Describe your diseases"
            placeholderTextColor={theme.textSecondary}
            value={diseaseDescription}
            onChangeText={setDiseaseDescription}
            multiline
            numberOfLines={3}
          />
        </View>
      )}

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Has Infectious Diseases?</Text>
        <Switch
          value={hasInfectiousDiseases}
          onValueChange={setHasInfectiousDiseases}
          thumbColor={theme.primary}
          trackColor={{ false: theme.border, true: theme.primary + '50' }}
        />
      </View>

      {hasInfectiousDiseases && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Infectious Disease Details</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Describe infectious diseases"
            placeholderTextColor={theme.textSecondary}
            value={infectiousDiseaseDetails}
            onChangeText={setInfectiousDiseaseDetails}
            multiline
            numberOfLines={3}
          />
        </View>
      )}
      
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Taking Medication?</Text>
        <Switch
          value={takingMedication}
          onValueChange={setTakingMedication}
          thumbColor={theme.primary}
          trackColor={{ false: theme.border, true: theme.primary + '50' }}
        />
      </View>

      {takingMedication && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Current Medications</Text>
          <TextInput
            style={styles.textArea}
            placeholder="List your current medications"
            placeholderTextColor={theme.textSecondary}
            value={currentMedications}
            onChangeText={setCurrentMedications}
            multiline
            numberOfLines={3}
          />
        </View>
      )}
    </View>
  );
}
