import React from 'react';
import { View, Text, Switch } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';
import { createDonorStyles } from '../../constants/styles/donorStyles';

interface ConsentFormProps {
  isConsented: boolean;
  setIsConsented: (value: boolean) => void;
}

export function ConsentForm({ isConsented, setIsConsented }: ConsentFormProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createDonorStyles(theme);

  return (
    <View style={styles.sectionContainer}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <Feather name="file-text" size={24} color={theme.primary} />
        <Text style={[styles.sectionTitle, { marginTop: 0, marginLeft: 12 }]}>Consent</Text>
      </View>
      
      <View style={styles.switchRow}>
        <Text style={[styles.label, { fontWeight: '600' }]}>
          I consent to donate blood and understand the risks involved
        </Text>
        <Switch 
          value={isConsented} 
          onValueChange={setIsConsented}
          thumbColor={theme.primary}
          trackColor={{ false: theme.border, true: theme.primary + '50' }}
        />
      </View>
      
      {isConsented && (
        <View style={{
          backgroundColor: theme.success + '15',
          padding: 12,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: theme.success + '30',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <Feather name="check-circle" size={20} color={theme.success} />
          <Text style={{
            marginLeft: 8,
            color: theme.success,
            fontWeight: '600',
            fontSize: 14,
          }}>
            Thank you for your consent to help save lives!
          </Text>
        </View>
      )}
    </View>
  );
}
