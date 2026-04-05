import React from "react";
import { CustomPicker } from "./CustomPicker";
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
  const pickerItems = GENDER_OPTIONS.filter(option => option.value !== "").map(option => ({
    label: option.label,
    value: option.value,
  }));

  return (
    <CustomPicker
      selectedValue={selectedValue}
      onValueChange={onValueChange}
      items={pickerItems}
      placeholder="Select Gender"
      style={hasError ? { borderColor: '#ef4444', borderWidth: 2 } : undefined}
    />
  );
}
