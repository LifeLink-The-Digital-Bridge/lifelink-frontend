import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';
import { createDonationStyles } from '../../constants/styles/donationStyles';
import { CustomPicker } from '../common/CustomPicker';

interface DonationTypeSelectorProps {
  donationType: string;
  setDonationType: (value: string) => void;
  onTypeChange: () => void;
}

const DONATION_TYPES = [
  { label: "Blood", value: "BLOOD" },
  { label: "Organ", value: "ORGAN" },
  { label: "Tissue", value: "TISSUE" },
  { label: "Stem Cell", value: "STEM_CELL" }
];

export function DonationTypeSelector({ donationType, setDonationType, onTypeChange }: DonationTypeSelectorProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createDonationStyles(theme);

  const handleChange = (value: string) => {
    setDonationType(value);
    onTypeChange();
  };

  return (
    <View style={styles.formSection}>
      <View style={styles.sectionHeader}>
        <Feather name="gift" size={20} color={theme.primary} />
        <Text style={styles.sectionTitle}>Donation Type</Text>
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>What would you like to donate?</Text>
        <CustomPicker
          selectedValue={donationType}
          onValueChange={handleChange}
          items={DONATION_TYPES}
          placeholder="Select Donation Type"
        />
      </View>
    </View>
  );
}
