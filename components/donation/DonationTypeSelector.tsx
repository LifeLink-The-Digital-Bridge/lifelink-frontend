import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';
import { createUnifiedStyles } from '../../constants/styles/unifiedStyles';
import { DonationType } from '../../app/api/donationApi';

interface DonationTypeSelectorProps {
  donationType: DonationType;
  setDonationType: (type: DonationType) => void;
  onTypeChange: (type: DonationType) => void;
  hlaProfile: any;
}

const DONATION_TYPES: { type: DonationType; label: string; icon: string }[] = [
  { type: 'BLOOD', label: 'Blood', icon: 'droplet' },
  { type: 'ORGAN', label: 'Organ', icon: 'heart' },
  { type: 'TISSUE', label: 'Tissue', icon: 'layers' },
  { type: 'STEM_CELL', label: 'Stem Cell', icon: 'circle' },
];

export function DonationTypeSelector({ donationType, setDonationType, onTypeChange, hlaProfile }: DonationTypeSelectorProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  const handleTypeChange = (type: DonationType) => {
    onTypeChange(type);
  };

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconContainer}>
          <Feather name="gift" size={18} color={theme.primary} />
        </View>
        <Text style={styles.sectionTitle}>Donation Type</Text>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {DONATION_TYPES.map((type) => {
          const isDisabled = type.type !== 'BLOOD' && !hlaProfile;
          
          return (
            <TouchableOpacity
              key={type.type}
              style={[
                {
                  flex: 1,
                  minWidth: '45%',
                  backgroundColor: donationType === type.type ? theme.primary : theme.card,
                  borderRadius: 12,
                  padding: 16,
                  alignItems: 'center',
                  borderWidth: 2,
                  borderColor: donationType === type.type ? theme.primary : theme.border,
                  opacity: isDisabled ? 0.5 : 1,
                }
              ]}
              onPress={() => handleTypeChange(type.type)}
              disabled={isDisabled}
            >
              <Feather
                name={type.icon as any}
                size={24}
                color={donationType === type.type ? '#fff' : theme.primary}
              />
              <Text
                style={{
                  marginTop: 8,
                  fontSize: 14,
                  fontWeight: '600',
                  color: donationType === type.type ? '#fff' : theme.text,
                }}
              >
                {type.label}
              </Text>
              {isDisabled && (
                <Text style={{ fontSize: 10, color: theme.textSecondary, marginTop: 4 }}>
                  HLA Required
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
