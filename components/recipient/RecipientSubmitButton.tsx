import React from "react";
import { View, TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { useTheme } from "../../utils/theme-context";
import { lightTheme, darkTheme } from "../../constants/styles/authStyles";
import { createUnifiedStyles } from "../../constants/styles/unifiedStyles";

interface RecipientSubmitButtonProps {
  isFormValid: boolean;
  loading: boolean;
  onSubmit: () => void;
  buttonText?: string;
}

export function RecipientSubmitButton({
  isFormValid,
  loading,
  onSubmit,
  buttonText = "Save Recipient Details",
}: RecipientSubmitButtonProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  return (
    <View style={styles.submitButtonContainer}>
      <TouchableOpacity
        style={[
          styles.submitButton,
          !isFormValid || loading ? styles.submitButtonDisabled : {},
        ]}
        onPress={onSubmit}
        disabled={!isFormValid || loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.submitButtonText}>{buttonText}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
