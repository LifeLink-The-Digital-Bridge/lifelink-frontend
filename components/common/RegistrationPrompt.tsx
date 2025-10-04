import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';
import { useRouter } from 'expo-router';

export interface RegistrationPromptProps {
  iconName: keyof typeof Feather.glyphMap;
  title: string;
  subtitle: string;
  benefits: string[];
  buttonText: string;
  buttonIcon: keyof typeof Feather.glyphMap;
  navigationRoute: string;
}

export function RegistrationPrompt({
  iconName,
  title,
  subtitle,
  benefits,
  buttonText,
  buttonIcon,
  navigationRoute,
}: RegistrationPromptProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const router = useRouter();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 20,
      paddingTop: 100,
    },
    card: {
      backgroundColor: theme.card,
      borderRadius: 20,
      padding: 32,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
      borderWidth: 1,
      borderColor: theme.border,
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24,
      alignSelf: 'center',
    },
    title: {
      fontSize: 22,
      fontWeight: '700',
      color: theme.text,
      textAlign: 'center',
      marginBottom: 16,
    },
    subtitle: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: 'center',
      marginBottom: 32,
      lineHeight: 24,
    },
    benefitsList: {
      marginBottom: 32,
    },
    benefitItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    benefitText: {
      fontSize: 15,
      color: theme.text,
      marginLeft: 12,
      flex: 1,
      lineHeight: 22,
    },
    registerButton: {
      backgroundColor: '#0984e3',
      paddingVertical: 16,
      paddingHorizontal: 32,
      borderRadius: 12,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      shadowColor: '#0984e3',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: '700',
      letterSpacing: 0.5,
      marginLeft: 8,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Feather name={iconName} size={40} color="#0984e3" />
        </View>
        
        <Text style={styles.title}>{title}</Text>
        
        <Text style={styles.subtitle}>{subtitle}</Text>
        
        <View style={styles.benefitsList}>
          {benefits.map((benefit, index) => (
            <View key={index} style={styles.benefitItem}>
              <Feather name="check-circle" size={16} color="#27ae60" />
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </View>
        
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => router.push(navigationRoute as any)}
          activeOpacity={0.8}
        >
          <Feather name={buttonIcon} size={20} color="#fff" />
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
