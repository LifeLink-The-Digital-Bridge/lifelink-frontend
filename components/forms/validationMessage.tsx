import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './styles';

interface ValidationMessageProps {
  error?: string;
  style?: any;
}

export function ValidationMessage({ error, style }: ValidationMessageProps) {
  if (!error) return null;

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.errorText}>{error}</Text>
    </View>
  );
}
