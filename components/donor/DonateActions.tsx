import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';
import { createDonateHubStyles } from '../../constants/styles/donateHubStyles';

interface DonateActionsProps {
  onUpdatePress: () => void;
  onContinuePress: () => void;
}

export function DonateActions({ onUpdatePress, onContinuePress }: DonateActionsProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createDonateHubStyles(theme);

  return (
    <>
      <TouchableOpacity
        style={[styles.button, styles.updateButton]}
        onPress={onUpdatePress}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Update Donor Details</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.primaryButton]}
        onPress={onContinuePress}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Continue to Donate</Text>
      </TouchableOpacity>
    </>
  );
}
