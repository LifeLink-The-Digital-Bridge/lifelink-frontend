import React from "react";
import { View, Text, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../utils/theme-context";
import { lightTheme, darkTheme } from "../../constants/styles/authStyles";
import { createUnifiedStyles } from "../../constants/styles/unifiedStyles";

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

export function HlaProfile(props: HlaProfileProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Feather name="shield" size={24} color={theme.primary} />
        <Text style={styles.sectionTitle}>HLA Profile</Text>
      </View>

      <Text style={styles.subSectionTitle}>HLA Class I Alleles</Text>

      <View style={styles.row}>
        <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>HLA-A1</Text>
          <TextInput
            style={styles.input}
            placeholder="A*01:01"
            placeholderTextColor={theme.textSecondary}
            value={props.hlaA1}
            onChangeText={props.setHlaA1}
          />
        </View>
        <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.label}>HLA-A2</Text>
          <TextInput
            style={styles.input}
            placeholder="A*02:01"
            placeholderTextColor={theme.textSecondary}
            value={props.hlaA2}
            onChangeText={props.setHlaA2}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>HLA-B1</Text>
          <TextInput
            style={styles.input}
            placeholder="B*07:02"
            placeholderTextColor={theme.textSecondary}
            value={props.hlaB1}
            onChangeText={props.setHlaB1}
          />
        </View>
        <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.label}>HLA-B2</Text>
          <TextInput
            style={styles.input}
            placeholder="B*08:01"
            placeholderTextColor={theme.textSecondary}
            value={props.hlaB2}
            onChangeText={props.setHlaB2}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>HLA-C1</Text>
          <TextInput
            style={styles.input}
            placeholder="C*07:02"
            placeholderTextColor={theme.textSecondary}
            value={props.hlaC1}
            onChangeText={props.setHlaC1}
          />
        </View>
        <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.label}>HLA-C2</Text>
          <TextInput
            style={styles.input}
            placeholder="C*07:01"
            placeholderTextColor={theme.textSecondary}
            value={props.hlaC2}
            onChangeText={props.setHlaC2}
          />
        </View>
      </View>

      <Text style={styles.subSectionTitle}>HLA Class II Alleles</Text>

      <View style={styles.row}>
        <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>HLA-DR1</Text>
          <TextInput
            style={styles.input}
            placeholder="DRB1*15:01"
            placeholderTextColor={theme.textSecondary}
            value={props.hlaDR1}
            onChangeText={props.setHlaDR1}
          />
        </View>
        <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.label}>HLA-DR2</Text>
          <TextInput
            style={styles.input}
            placeholder="DRB1*03:01"
            placeholderTextColor={theme.textSecondary}
            value={props.hlaDR2}
            onChangeText={props.setHlaDR2}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>HLA-DQ1</Text>
          <TextInput
            style={styles.input}
            placeholder="DQB1*06:02"
            placeholderTextColor={theme.textSecondary}
            value={props.hlaDQ1}
            onChangeText={props.setHlaDQ1}
          />
        </View>
        <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.label}>HLA-DQ2</Text>
          <TextInput
            style={styles.input}
            placeholder="DQB1*02:01"
            placeholderTextColor={theme.textSecondary}
            value={props.hlaDQ2}
            onChangeText={props.setHlaDQ2}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>HLA-DP1</Text>
          <TextInput
            style={styles.input}
            placeholder="DPB1*04:01"
            placeholderTextColor={theme.textSecondary}
            value={props.hlaDP1}
            onChangeText={props.setHlaDP1}
          />
        </View>
        <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.label}>HLA-DP2</Text>
          <TextInput
            style={styles.input}
            placeholder="DPB1*02:01"
            placeholderTextColor={theme.textSecondary}
            value={props.hlaDP2}
            onChangeText={props.setHlaDP2}
          />
        </View>
      </View>

      <Text style={styles.subSectionTitle}>Laboratory Information</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Testing Date</Text>
        <TextInput
          style={styles.input}
          placeholder="2025-01-10"
          placeholderTextColor={theme.textSecondary}
          value={props.testingDate}
          onChangeText={props.setTestingDate}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Testing Method</Text>
        <TextInput
          style={styles.input}
          placeholder="PCR-SSP"
          placeholderTextColor={theme.textSecondary}
          value={props.testingMethod}
          onChangeText={props.setTestingMethod}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Laboratory Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Sun Diagnostics"
          placeholderTextColor={theme.textSecondary}
          value={props.laboratoryName}
          onChangeText={props.setLaboratoryName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Certification Number</Text>
        <TextInput
          style={styles.input}
          placeholder="LAB123456"
          placeholderTextColor={theme.textSecondary}
          value={props.certificationNumber}
          onChangeText={props.setCertificationNumber}
        />
      </View>
    </View>
  );
}
