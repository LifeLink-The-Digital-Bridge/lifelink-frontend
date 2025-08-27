import React from "react";
import { View } from "react-native";
import RNPickerSelect from 'react-native-picker-select';
import { Feather } from '@expo/vector-icons';
import { useTheme } from "../../utils/theme-context";
import { lightTheme, darkTheme, createAuthStyles } from "../../constants/styles/authStyles";
import { GENDER_OPTIONS } from "../../utils/validation";

interface GenderPickerProps {
  selectedValue: string;
  onValueChange: (value: string) => void;
  hasError?: boolean;
}

export function GenderPicker({
  selectedValue,
  onValueChange,
  hasError,
}: GenderPickerProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createAuthStyles(theme);

  const pickerItems = GENDER_OPTIONS.filter(option => option.value !== "").map(option => ({
    label: option.label,
    value: option.value,
  }));

  const pickerSelectStyles = {
    inputIOS: {
      fontSize: 16,
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderWidth: 2,
      borderColor: hasError ? theme.error : theme.border,
      borderRadius: 12,
      color: theme.text,
      backgroundColor: theme.inputBackground,
      paddingRight: 50,
      minHeight: 50,
    },
    inputAndroid: {
      fontSize: 16,
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderWidth: 2,
      borderColor: hasError ? theme.error : theme.border,
      borderRadius: 12,
      color: theme.text,
      backgroundColor: theme.inputBackground,
      paddingRight: 50,
      minHeight: 50,
    },
    placeholder: {
      color: theme.textSecondary,
      fontSize: 16,
    },
    iconContainer: {
      top: 16,
      right: 16,
    },
  };

  return (
    <View style={styles.inputContainer}>
      <RNPickerSelect
        value={selectedValue}
        onValueChange={onValueChange}
        items={pickerItems}
        placeholder={{
          label: 'Select Gender',
          value: '',
          color: theme.textSecondary,
        }}
        style={pickerSelectStyles}
        useNativeAndroidPickerStyle={false}
        Icon={() => (
          <Feather 
            name="chevron-down" 
            size={20} 
            color={theme.textSecondary} 
          />
        )}
      />
    </View>
  );
}
