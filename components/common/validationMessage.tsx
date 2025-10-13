import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';

interface ValidationMessageProps {
  error?: string;
  success?: string;
  style?: any;
}

export function ValidationMessage({ error, success, style }: ValidationMessageProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  if (!error && !success) return null;

  const styles = StyleSheet.create({
    container: {
      marginTop: 6,
      marginBottom: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      backgroundColor: error 
        ? theme.error + '15' 
        : theme.success + '15',
      borderWidth: 1,
      borderColor: error 
        ? theme.error + '30' 
        : theme.success + '30',
    },
    messageRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    messageText: {
      fontSize: 14,
      fontWeight: '500',
      color: error ? theme.error : theme.success,
      marginLeft: 8,
      flex: 1,
      lineHeight: 18,
    },
  });

  return (
    <View style={[styles.container, style]}>
      <View style={styles.messageRow}>
        <Feather 
          name={error ? "alert-circle" : "check-circle"} 
          size={16} 
          color={error ? theme.error : theme.success}
        />
        <Text style={styles.messageText}>
          {error || success}
        </Text>
      </View>
    </View>
  );
}
