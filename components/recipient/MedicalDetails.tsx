import React from "react";
import { View, Text, TextInput, Switch } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../utils/theme-context";
import { lightTheme, darkTheme } from "../../constants/styles/authStyles";
import { createUnifiedStyles } from "../../constants/styles/unifiedStyles";

interface MedicalDetailsProps {
  diagnosis: string;
  setDiagnosis: (value: string) => void;
  allergies: string;
  setAllergies: (value: string) => void;
  currentMedications: string;
  setCurrentMedications: (value: string) => void;
  additionalNotes: string;
  setAdditionalNotes: (value: string) => void;
  hemoglobinLevel: string;
  setHemoglobinLevel: (value: string) => void;
  bloodPressure: string;
  setBloodPressure: (value: string) => void;
  creatinineLevel: string;
  setCreatinineLevel: (value: string) => void;
  overallHealthStatus: string;
  setOverallHealthStatus: (value: string) => void;
}

export function MedicalDetails(props: MedicalDetailsProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Feather name="heart" size={24} color={theme.primary} />
        <Text style={styles.sectionTitle}>Medical Information</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Diagnosis *</Text>
        <TextInput
          style={styles.textArea}
          placeholder="e.g., Chronic kidney disease requiring transplant"
          placeholderTextColor={theme.textSecondary}
          value={props.diagnosis}
          onChangeText={props.setDiagnosis}
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Allergies</Text>
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

      <View style={styles.row}>
        <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>Hemoglobin (g/dL)</Text>
          <TextInput
            style={styles.input}
            placeholder="12.5"
            placeholderTextColor={theme.textSecondary}
            value={props.hemoglobinLevel}
            onChangeText={props.setHemoglobinLevel}
            keyboardType="numeric"
          />
        </View>

        <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.label}>Blood Pressure</Text>
          <TextInput
            style={styles.input}
            placeholder="120/80"
            placeholderTextColor={theme.textSecondary}
            value={props.bloodPressure}
            onChangeText={props.setBloodPressure}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Creatinine Level (mg/dL)</Text>
        <TextInput
          style={styles.input}
          placeholder="2.8"
          placeholderTextColor={theme.textSecondary}
          value={props.creatinineLevel}
          onChangeText={props.setCreatinineLevel}
          keyboardType="numeric"
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

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Additional Notes</Text>
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
