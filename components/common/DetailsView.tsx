import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';
import { createUnifiedStyles } from '../../constants/styles/unifiedStyles';

interface DetailItem {
  label: string;
  value: string;
  isLast?: boolean;
}

interface DetailSection {
  icon: string;
  title: string;
  items: DetailItem[];
}

interface DetailsViewProps {
  sections: DetailSection[];
}

export function DetailsView({ sections }: DetailsViewProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  const InfoRow = ({ label, value, isLast = false }: DetailItem) => (
    <View style={[styles.infoRow, isLast && styles.lastInfoRow]}>
      <Text style={styles.labelText}>{label}</Text>
      <Text style={styles.valueText}>{value}</Text>
    </View>
  );

  const SectionCard = ({ icon, title, items }: DetailSection) => (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconContainer}>
          <Feather name={icon as any} size={18} color={theme.primary} />
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {items.map((item, index) => (
        <InfoRow 
          key={index}
          label={item.label}
          value={item.value}
          isLast={index === items.length - 1}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.card}>
      {sections.map((section, index) => (
        <SectionCard key={index} {...section} />
      ))}
    </View>
  );
}