import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';
import { createDonorStyles } from '../../constants/styles/donorStyles';

interface SubmitButtonProps {
  isFormValid: boolean;
  loading: boolean;
  onSubmit: () => void;
  buttonText?: string;
}

export function SubmitButton({ 
  isFormValid, 
  loading, 
  onSubmit, 
  buttonText = "Save Donor Details" 
}: SubmitButtonProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createDonorStyles(theme);

  return (
    <View style={styles.submitButtonContainer}>
      <TouchableOpacity
        style={[
          styles.submitButton,
          isFormValid && !loading ? styles.submitButtonEnabled : styles.submitButtonDisabled,
        ]}
        onPress={onSubmit}
        disabled={!isFormValid || loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.submitButtonText}>
            {buttonText}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
