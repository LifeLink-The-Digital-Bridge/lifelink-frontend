import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';
import { createUnifiedStyles } from '../../constants/styles/unifiedStyles';
import { CustomPicker } from '../common/CustomPicker';
import { BloodType } from '../../app/api/donationApi';

interface BloodTypeSelectorProps {
  bloodType: BloodType;
  setBloodType: (type: BloodType) => void;
}

const BLOOD_TYPES: BloodType[] = ['A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE'];

export function BloodTypeSelector({ bloodType, setBloodType }: BloodTypeSelectorProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  const formatLabel = (value: string) => {
    return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconContainer}>
          <Feather name="droplet" size={18} color={theme.primary} />
        </View>
        <Text style={styles.sectionTitle}>Blood Type</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Your Blood Type *</Text>
        <CustomPicker
          selectedValue={bloodType}
          onValueChange={(value) => setBloodType(value as BloodType)}
          items={[
            { label: 'Select Blood Type', value: '' },
            ...BLOOD_TYPES.map(type => ({ label: formatLabel(type), value: type }))
          ]}
          placeholder="Select Blood Type"
        />
      </View>
    </View>
  );
}