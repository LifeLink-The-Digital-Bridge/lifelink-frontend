import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';
import { createDonationStyles } from '../../constants/styles/donationStyles';
import { CustomPicker } from '../common/CustomPicker';
import { OrganType } from '../../app/api/donationApi';
import { parseLocalDateTime } from '../../utils/dateTimeUtils';

interface OrganDetailsFormProps {
  organType: OrganType | "";
  setOrganType: (value: OrganType | "") => void;
  isCompatible: boolean;
  setIsCompatible: (value: boolean) => void;
  organQuality: string;
  setOrganQuality: (value: string) => void;
  organViabilityExpiry: string;
  setOrganViabilityExpiry: (value: string) => void;
  coldIschemiaTime: string;
  setColdIschemiaTime: (value: string) => void;
  organPerfused: boolean;
  setOrganPerfused: (value: boolean) => void;
  organWeight: string;
  setOrganWeight: (value: string) => void;
  organSize: string;
  setOrganSize: (value: string) => void;
  functionalAssessment: string;
  setFunctionalAssessment: (value: string) => void;
  hasAbnormalities: boolean;
  setHasAbnormalities: (value: boolean) => void;
  abnormalityDescription: string;
  setAbnormalityDescription: (value: string) => void;
}
const ORGAN_TYPES = [
  { label: "Heart", value: "HEART" },
  { label: "Liver", value: "LIVER" },
  { label: "Kidney", value: "KIDNEY" },
  { label: "Lung", value: "LUNG" },
  { label: "Pancreas", value: "PANCREAS" },
  { label: "Intestine", value: "INTESTINE" }
];

const ORGAN_QUALITIES = [
  { label: "Excellent", value: "Excellent" },
  { label: "Good", value: "Good" },
  { label: "Fair", value: "Fair" },
  { label: "Marginal", value: "Marginal" }
];

const ORGAN_SIZES = [
  { label: "Small", value: "Small" },
  { label: "Medium", value: "Medium" },
  { label: "Large", value: "Large" }
];

export function OrganDetailsForm(props: OrganDetailsFormProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createDonationStyles(theme);

  const { date: expiryDate, time: expiryTime } = parseLocalDateTime(props.organViabilityExpiry);

  const handleDateChange = (newDate: string) => {
    const currentTime = expiryTime || '14:30';
    props.setOrganViabilityExpiry(`${newDate}T${currentTime}:00`);
  };

  const handleTimeChange = (newTime: string) => {
    const currentDate = expiryDate || new Date().toISOString().slice(0, 10);
    props.setOrganViabilityExpiry(`${currentDate}T${newTime}:00`);
  };

  return (
    <View style={styles.formSection}>
      <View style={styles.sectionHeader}>
        <Feather name="heart" size={24} color={theme.primary} />
        <Text style={styles.sectionTitle}>Organ Details</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Organ Type</Text>
        <CustomPicker
          selectedValue={props.organType}
          onValueChange={(value: string) => props.setOrganType(value as OrganType | "")}
          items={ORGAN_TYPES}
          placeholder="Select Organ"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Organ Quality</Text>
        <CustomPicker
          selectedValue={props.organQuality}
          onValueChange={props.setOrganQuality}
          items={ORGAN_QUALITIES}
          placeholder="Select Quality"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Organ Size</Text>
        <CustomPicker
          selectedValue={props.organSize}
          onValueChange={props.setOrganSize}
          items={ORGAN_SIZES}
          placeholder="Select Size"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Organ Weight (grams)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 1500.5"
          placeholderTextColor={theme.textSecondary}
          keyboardType="numeric"
          value={props.organWeight}
          onChangeText={props.setOrganWeight}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Viability Expiry Date</Text>
        <TextInput
          style={styles.input}
          placeholder="2025-10-31"
          placeholderTextColor={theme.textSecondary}
          value={expiryDate}
          onChangeText={handleDateChange}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Viability Expiry Time</Text>
        <TextInput
          style={styles.input}
          placeholder="09:30"
          placeholderTextColor={theme.textSecondary}
          value={expiryTime}
          onChangeText={handleTimeChange}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Cold Ischemia Time (minutes)</Text>
        <TextInput
          style={styles.input}
          placeholder="240"
          placeholderTextColor={theme.textSecondary}
          keyboardType="numeric"
          value={props.coldIschemiaTime}
          onChangeText={props.setColdIschemiaTime}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Functional Assessment</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Normal function, no abnormalities detected..."
          placeholderTextColor={theme.textSecondary}
          multiline
          numberOfLines={3}
          value={props.functionalAssessment}
          onChangeText={props.setFunctionalAssessment}
        />
      </View>
    </View>
  );
}
