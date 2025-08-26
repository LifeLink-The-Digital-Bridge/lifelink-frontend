import React from 'react';
import { Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import authStyles from '../../constants/styles/authStyles';

interface ValidationMessageProps {
  error?: string;
  success?: string;
  style?: any;
}

export function ValidationMessage({ error, success, style }: ValidationMessageProps) {
  if (!error && !success) return null;

  return (
    <View style={[error ? authStyles.errorContainer : authStyles.successContainer, style]}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Feather 
          name={error ? "alert-circle" : "check-circle"} 
          size={14} 
          color={error ? "#ef4444" : "#10b981"} 
          style={{ marginRight: 6 }}
        />
        <Text style={error ? authStyles.errorText : authStyles.successText}>
          {error || success}
        </Text>
      </View>
    </View>
  );
}
