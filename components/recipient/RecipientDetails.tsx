import React from "react";
import { View, Text, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../utils/theme-context";
import { lightTheme, darkTheme } from "../../constants/styles/authStyles";
import { createUnifiedStyles } from "../../constants/styles/unifiedStyles";
import { CustomPicker } from "../common/CustomPicker";

interface RecipientDetailsProps {
  availability: string;
  setAvailability: (value: string) => void;
}

const AVAILABILITY_OPTIONS = [
  { label: "Available", value: "AVAILABLE" },
  { label: "Temporarily Unavailable", value: "TEMPORARILY_UNAVAILABLE" },
  { label: "Unavailable", value: "UNAVAILABLE" },
];

export function RecipientDetails({
  availability,
  setAvailability,
}: RecipientDetailsProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Feather name="user" size={24} color={theme.primary} />
        <Text style={styles.sectionTitle}>Recipient Details</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Availability Status</Text>
        <CustomPicker
          selectedValue={availability}
          onValueChange={setAvailability}
          items={AVAILABILITY_OPTIONS}
          placeholder="Select availability status"
        />
      </View>
    </View>
  );
}
