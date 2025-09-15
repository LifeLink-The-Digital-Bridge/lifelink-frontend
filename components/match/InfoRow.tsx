import React from 'react';
import { View, Text } from 'react-native';
import { createUnifiedStyles } from '../../constants/styles/unifiedStyles';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';

interface InfoRowProps {
  label: string;
  value: string | React.ReactNode;
  valueColor?: string;
  isLast?: boolean;
}

export const InfoRow: React.FC<InfoRowProps> = ({ label, value, valueColor, isLast = false }) => {
  const { colorScheme } = useTheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  return (
    <View style={[styles.infoRow, isLast && styles.lastInfoRow]}>
      <Text style={styles.labelText}>{label}:</Text>
      <Text style={[styles.valueText, valueColor ? { color: valueColor } : null]}>
        {value}
      </Text>
    </View>
  );
};
