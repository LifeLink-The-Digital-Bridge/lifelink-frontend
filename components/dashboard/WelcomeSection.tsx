import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';

interface WelcomeSectionProps {
  username: string;
}

export function WelcomeSection({ username }: WelcomeSectionProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  const styles = StyleSheet.create({
    container: {
      paddingVertical: 24,
      paddingHorizontal: 20,
      backgroundColor: theme.card,
      borderRadius: 16,
      marginTop: 20,
      marginBottom: 20,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
      borderWidth: 1,
      borderColor: theme.border,
    },
    welcomeText: {
      fontSize: 24,
      color: theme.text,
      marginBottom: 8,
      fontWeight: '600',
    },
    highlightedText: {
      color: theme.primary,
      fontWeight: 'bold',
    },
    subText: {
      fontSize: 16,
      color: theme.textSecondary,
      lineHeight: 22,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>
        Welcome,{" "}
        <Text style={styles.highlightedText}>{username || 'User'}</Text>!
      </Text>
      <Text style={styles.subText}>
        We're glad to have you here!
      </Text>
    </View>
  );
}
