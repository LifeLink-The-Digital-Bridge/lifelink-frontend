import React from "react";
import { View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import authStyles from "../../constants/styles/authStyles";
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
  return (
    <View
      style={[
        authStyles.genderPickerContainer,
        hasError && authStyles.genderPickerError,
      ]}
    >
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={[
          authStyles.genderPicker,
          { color: selectedValue ? "#1e293b" : "#818181ff" },
        ]}
        dropdownIconColor="#64748b"
      >
        {GENDER_OPTIONS.map((option) => (
          <Picker.Item
            label={option.label}
            value={option.value}
            key={option.value}
            color={option.value ? "#1e293b" : "#9ca3af"}
          />
        ))}
      </Picker>
    </View>
  );
}
