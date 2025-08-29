import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';
import { createDonationStyles } from '../../constants/styles/donationStyles';
import { CustomPicker } from '../common/CustomPicker';

interface BloodTypeSelectorProps {
  bloodType: string;
  setBloodType: (value: string) => void;
}

const BLOOD_TYPES = [
  { label: "A+", value: "A_POSITIVE" },
  { label: "A-", value: "A_NEGATIVE" },
  { label: "B+", value: "B_POSITIVE" },
  { label: "B-", value: "B_NEGATIVE" },
  { label: "O+", value: "O_POSITIVE" },
  { label: "O-", value: "O_NEGATIVE" },
  { label: "AB+", value: "AB_POSITIVE" },
  { label: "AB-", value: "AB_NEGATIVE" }
];

export function BloodTypeSelector({ bloodType, setBloodType }: BloodTypeSelectorProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createDonationStyles(theme);

  return (
    <View style={styles.formSection}>
      <View style={styles.sectionHeader}>
        <Feather name="droplet" size={20} color={theme.primary} />
        <Text style={styles.sectionTitle}>Blood Type</Text>
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Select Your Blood Type</Text>
        <CustomPicker
          selectedValue={bloodType}
          onValueChange={setBloodType}
          items={BLOOD_TYPES}
          placeholder="Select Blood Type"
        />
      </View>
    </View>
  );
}
