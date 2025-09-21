import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';
import { createUnifiedStyles } from '../../constants/styles/unifiedStyles';
import { CustomPicker } from '../common/CustomPicker';
import { RequestType, BloodType, OrganType, TissueType, StemCellType, UrgencyLevel } from '../../app/api/recipientApi';

interface RequestDetailsFormProps {
  requestType: RequestType;
  requestedBloodType: BloodType | "";
  setRequestedBloodType: (type: BloodType | "") => void;
  requestedOrgan: OrganType | "";
  setRequestedOrgan: (organ: OrganType | "") => void;
  requestedTissue: TissueType | "";
  setRequestedTissue: (tissue: TissueType | "") => void;
  requestedStemCellType: StemCellType | "";
  setRequestedStemCellType: (type: StemCellType | "") => void;
  urgencyLevel: UrgencyLevel;
  setUrgencyLevel: (level: UrgencyLevel) => void;
  quantity: string;
  setQuantity: (quantity: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
}

const BLOOD_TYPES: BloodType[] = ['A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE'];
const ORGAN_TYPES: OrganType[] = ['HEART', 'LIVER', 'KIDNEY', 'LUNG', 'PANCREAS', 'INTESTINE'];
const TISSUE_TYPES: TissueType[] = ['BONE', 'SKIN', 'CORNEA', 'VEIN', 'TENDON', 'LIGAMENT'];
const STEM_CELL_TYPES: StemCellType[] = ['PERIPHERAL_BLOOD', 'BONE_MARROW', 'CORD_BLOOD'];
const URGENCY_LEVELS: UrgencyLevel[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export function RequestDetailsForm(props: RequestDetailsFormProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  const formatLabel = (value: string) => {
    return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconContainer}>
          <Feather name="edit-3" size={18} color={theme.primary} />
        </View>
        <Text style={styles.sectionTitle}>Request Details</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Blood Type *</Text>
        <CustomPicker
          selectedValue={props.requestedBloodType}
          onValueChange={props.setRequestedBloodType as (value: string) => void}
          items={[
            { label: 'Select Blood Type', value: '' },
            ...BLOOD_TYPES.map(type => ({ label: formatLabel(type), value: type }))
          ]}
          placeholder="Select Blood Type"
        />
      </View>

      {props.requestType === 'ORGAN' && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Organ Type *</Text>
          <CustomPicker
            selectedValue={props.requestedOrgan}
            onValueChange={props.setRequestedOrgan as (value: string) => void}
            items={[
              { label: 'Select Organ', value: '' },
              ...ORGAN_TYPES.map(organ => ({ label: formatLabel(organ), value: organ }))
            ]}
            placeholder="Select Organ"
          />
        </View>
      )}

      {props.requestType === 'TISSUE' && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tissue Type *</Text>
          <CustomPicker
            selectedValue={props.requestedTissue}
            onValueChange={props.setRequestedTissue as (value: string) => void}
            items={[
              { label: 'Select Tissue', value: '' },
              ...TISSUE_TYPES.map(tissue => ({ label: formatLabel(tissue), value: tissue }))
            ]}
            placeholder="Select Tissue"
          />
        </View>
      )}

      {props.requestType === 'STEM_CELL' && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Stem Cell Type *</Text>
          <CustomPicker
            selectedValue={props.requestedStemCellType}
            onValueChange={props.setRequestedStemCellType as (value: string) => void}
            items={[
              { label: 'Select Stem Cell Type', value: '' },
              ...STEM_CELL_TYPES.map(type => ({ label: formatLabel(type), value: type }))
            ]}
            placeholder="Select Stem Cell Type"
          />
        </View>
      )}

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Urgency Level *</Text>
        <CustomPicker
          selectedValue={props.urgencyLevel}
          onValueChange={props.setUrgencyLevel as (value: string) => void}
          items={URGENCY_LEVELS.map(level => ({ label: formatLabel(level), value: level }))}
          placeholder="Select Urgency Level"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Quantity *</Text>
        <TextInput
          style={styles.input}
          placeholder="1.0"
          placeholderTextColor={theme.textSecondary}
          keyboardType="numeric"
          value={props.quantity}
          onChangeText={props.setQuantity}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Additional information about your request..."
          placeholderTextColor={theme.textSecondary}
          value={props.notes}
          onChangeText={props.setNotes}
          multiline
          numberOfLines={4}
        />
      </View>
    </View>
  );
}
