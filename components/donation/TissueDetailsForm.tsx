import React from "react";
import { View, Text, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../utils/theme-context";
import { lightTheme, darkTheme } from "../../constants/styles/authStyles";
import { createDonationStyles } from "../../constants/styles/donationStyles";
import { CustomPicker } from '../common/CustomPicker';
import { TissueType } from '../../app/api/donationApi';
import { validateTissueQuantity } from '../../utils/quantityValidation';

interface TissueDetailsFormProps {
  tissueType: TissueType | "";
  setTissueType: (value: TissueType | "") => void;
  quantity: string;
  setQuantity: (value: string) => void;
}

const TISSUE_TYPES = [
  { label: "Bone", value: "BONE" },
  { label: "Skin", value: "SKIN" },
  { label: "Cornea", value: "CORNEA" },
  { label: "Vein", value: "VEIN" },
  { label: "Tendon", value: "TENDON" },
  { label: "Ligament", value: "LIGAMENT" },
];

export function TissueDetailsForm({
  tissueType,
  setTissueType,
  quantity,
  setQuantity,
}: TissueDetailsFormProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createDonationStyles(theme);

  const validation = tissueType && quantity ? validateTissueQuantity(quantity, tissueType) : { isValid: true, message: '' };

  return (
    <View style={styles.formSection}>
      <View style={styles.sectionHeader}>
        <Feather name="layers" size={24} color={theme.primary} />
        <Text style={styles.sectionTitle}>Tissue Details</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Tissue Type</Text>
        <View style={styles.pickerContainer}>
          <CustomPicker
            selectedValue={tissueType}
            onValueChange={(value: string) => setTissueType(value as TissueType | "")}
            items={TISSUE_TYPES}
            placeholder="Select Tissue"
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Quantity (grams or units)</Text>
        <TextInput
          style={[styles.input, !validation.isValid && quantity ? { borderColor: '#ef4444', borderWidth: 1 } : {}]}
          placeholder="0.8"
          keyboardType="numeric"
          value={quantity}
          onChangeText={setQuantity}
        />
        {!validation.isValid && quantity && (
          <Text style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{validation.message}</Text>
        )}
      </View>
    </View>
  );
}
