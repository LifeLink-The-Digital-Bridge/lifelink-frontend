import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';
import { createDonorStyles } from '../../constants/styles/donorStyles';
import AppLayout from '@/components/AppLayout';

interface LoadingScreenProps {
  title?: string;
  message?: string;
}

export function LoadingScreen({ 
  title = "Become a Donor", 
  message = "Setting up donor registration..." 
}: LoadingScreenProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createDonorStyles(theme);

  return (
    <AppLayout hideHeader>
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ 
          color: theme.text, 
          textAlign: "center", 
          marginTop: 20, 
          fontSize: 16,
          fontWeight: '500'
        }}>
          {message}
        </Text>
      </View>
    </AppLayout>
  );
}
