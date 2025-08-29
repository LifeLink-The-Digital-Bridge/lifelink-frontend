import React from "react";
import { View, Text, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../utils/theme-context";
import { lightTheme, darkTheme } from "../../constants/styles/authStyles";
import { createDonationStyles } from "../../constants/styles/donationStyles";
import { CustomPicker } from "../common/CustomPicker";

interface StemCellDetailsFormProps {
  stemCellType: string;
  setStemCellType: (value: string) => void;
  quantity: string;
  setQuantity: (value: string) => void;
}

const STEM_CELL_TYPES = [
  { label: "Peripheral Blood", value: "PERIPHERAL_BLOOD" },
  { label: "Bone Marrow", value: "BONE_MARROW" },
  { label: "Cord Blood", value: "CORD_BLOOD" },
];

export function StemCellDetailsForm({
  stemCellType,
  setStemCellType,
  quantity,
  setQuantity,
}: StemCellDetailsFormProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createDonationStyles(theme);

  return (
    <View style={styles.formSection}>
      <View style={styles.sectionHeader}>
        <Feather name="zap" size={24} color={theme.primary} />
        <Text style={styles.sectionTitle}>Stem Cell Details</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Stem Cell Type</Text>
        <View style={styles.pickerContainer}>
          <CustomPicker
            selectedValue={stemCellType}
            onValueChange={setStemCellType}
            items={STEM_CELL_TYPES}
            placeholder="Select Stem Cell Type"
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Quantity (millions of cells)</Text>
        <TextInput
          style={styles.input}
          placeholder="2.0"
          keyboardType="numeric"
          value={quantity}
          onChangeText={setQuantity}
        />
      </View>
    </View>
  );
}
