import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';
import { createUnifiedStyles } from '../../constants/styles/unifiedStyles';

interface HlaProfileProps {
  hlaA1: string;
  setHlaA1: (value: string) => void;
  hlaA2: string;
  setHlaA2: (value: string) => void;
  hlaB1: string;
  setHlaB1: (value: string) => void;
  hlaB2: string;
  setHlaB2: (value: string) => void;
  hlaC1: string;
  setHlaC1: (value: string) => void;
  hlaC2: string;
  setHlaC2: (value: string) => void;
  hlaDR1: string;
  setHlaDR1: (value: string) => void;
  hlaDR2: string;
  setHlaDR2: (value: string) => void;
  hlaDQ1: string;
  setHlaDQ1: (value: string) => void;
  hlaDQ2: string;
  setHlaDQ2: (value: string) => void;
  hlaDP1: string;
  setHlaDP1: (value: string) => void;
  hlaDP2: string;
  setHlaDP2: (value: string) => void;
  testingDate: string;
  setTestingDate: (value: string) => void;
  testingMethod: string;
  setTestingMethod: (value: string) => void;
  laboratoryName: string;
  setLaboratoryName: (value: string) => void;
  certificationNumber: string;
  setCertificationNumber: (value: string) => void;
}

export function HlaProfile({
  hlaA1, setHlaA1, hlaA2, setHlaA2,
  hlaB1, setHlaB1, hlaB2, setHlaB2,
  hlaC1, setHlaC1, hlaC2, setHlaC2,
  hlaDR1, setHlaDR1, hlaDR2, setHlaDR2,
  hlaDQ1, setHlaDQ1, hlaDQ2, setHlaDQ2,
  hlaDP1, setHlaDP1, hlaDP2, setHlaDP2,
  testingDate, setTestingDate,
  testingMethod, setTestingMethod,
  laboratoryName, setLaboratoryName,
  certificationNumber, setCertificationNumber,
}: HlaProfileProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconContainer}>
          <Feather name="shield" size={18} color={theme.primary} />
        </View>
        <Text style={styles.sectionTitle}>HLA Profile</Text>
      </View>

      <Text style={styles.subSectionTitle}>HLA Class I Alleles</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>HLA-A Alleles</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1, marginRight: 12 }]}
            placeholder="A*02:01"
            placeholderTextColor={theme.textSecondary}
            value={hlaA1}
            onChangeText={setHlaA1}
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="A*24:02"
            placeholderTextColor={theme.textSecondary}
            value={hlaA2}
            onChangeText={setHlaA2}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>HLA-B Alleles</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1, marginRight: 12 }]}
            placeholder="B*15:01"
            placeholderTextColor={theme.textSecondary}
            value={hlaB1}
            onChangeText={setHlaB1}
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="B*44:03"
            placeholderTextColor={theme.textSecondary}
            value={hlaB2}
            onChangeText={setHlaB2}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>HLA-C Alleles</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1, marginRight: 12 }]}
            placeholder="C*03:04"
            placeholderTextColor={theme.textSecondary}
            value={hlaC1}
            onChangeText={setHlaC1}
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="C*16:01"
            placeholderTextColor={theme.textSecondary}
            value={hlaC2}
            onChangeText={setHlaC2}
          />
        </View>
      </View>

      <Text style={styles.subSectionTitle}>HLA Class II Alleles</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>HLA-DR Alleles</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1, marginRight: 12 }]}
            placeholder="DRB1*07:01"
            placeholderTextColor={theme.textSecondary}
            value={hlaDR1}
            onChangeText={setHlaDR1}
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="DRB1*15:01"
            placeholderTextColor={theme.textSecondary}
            value={hlaDR2}
            onChangeText={setHlaDR2}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>HLA-DQ Alleles</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1, marginRight: 12 }]}
            placeholder="DQB1*02:02"
            placeholderTextColor={theme.textSecondary}
            value={hlaDQ1}
            onChangeText={setHlaDQ1}
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="DQB1*06:02"
            placeholderTextColor={theme.textSecondary}
            value={hlaDQ2}
            onChangeText={setHlaDQ2}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>HLA-DP Alleles</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1, marginRight: 12 }]}
            placeholder="DPB1*04:01"
            placeholderTextColor={theme.textSecondary}
            value={hlaDP1}
            onChangeText={setHlaDP1}
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="DPB1*14:01"
            placeholderTextColor={theme.textSecondary}
            value={hlaDP2}
            onChangeText={setHlaDP2}
          />
        </View>
      </View>

      <Text style={styles.subSectionTitle}>Laboratory Information</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Testing Date</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={theme.textSecondary}
          value={testingDate}
          onChangeText={setTestingDate}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Testing Method</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., NGS_SEQUENCING"
          placeholderTextColor={theme.textSecondary}
          value={testingMethod}
          onChangeText={setTestingMethod}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Laboratory Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter laboratory name"
          placeholderTextColor={theme.textSecondary}
          value={laboratoryName}
          onChangeText={setLaboratoryName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Certification Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter certification number"
          placeholderTextColor={theme.textSecondary}
          value={certificationNumber}
          onChangeText={setCertificationNumber}
        />
      </View>
    </View>
  );
}
