import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { createProfileStyles } from '../../constants/styles/profileStyles';

interface ThemeModalProps {
  visible: boolean;
  onClose: () => void;
  theme: any;
  currentTheme: string;
  onThemeChange: (theme: "light" | "dark" | "system") => void;
  isDark: boolean;
  onLogout: () => void;
}

export const ThemeModal: React.FC<ThemeModalProps> = ({
  visible,
  onClose,
  theme,
  currentTheme,
  onThemeChange,
  isDark,
  onLogout,
}) => {
  const styles = createProfileStyles(theme);

  const themeOptions: Array<{ value: "light" | "dark" | "system"; label: string; icon: string }> = [
    { value: "light", label: "Light Mode", icon: "sun" },
    { value: "dark", label: "Dark Mode", icon: "moon" },
    { value: "system", label: "System Default", icon: "smartphone" },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalContent}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>Settings</Text>

          <View style={styles.modalSection}>
            <Text style={styles.modalSectionTitle}>Theme</Text>
            {themeOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.themeOption}
                onPress={() => onThemeChange(option.value)}
              >
                <View style={styles.themeOptionLeft}>
                  <View style={styles.themeOptionIcon}>
                    <Feather
                      name={option.icon as any}
                      size={20}
                      color={currentTheme === option.value ? theme.primary : theme.text}
                    />
                  </View>
                  <Text style={styles.themeOptionText}>{option.label}</Text>
                </View>
                {currentTheme === option.value && (
                  <Feather name="check" size={20} color={theme.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.modalSection}>
            <Text style={styles.modalSectionTitle}>Account</Text>
            <TouchableOpacity
              style={[styles.themeOption, styles.logoutOption]}
              onPress={onLogout}
            >
              <View style={styles.themeOptionLeft}>
                <View style={[styles.themeOptionIcon, { backgroundColor: theme.error + '20' }]}>
                  <Feather name="log-out" size={20} color={theme.error} />
                </View>
                <Text style={[styles.themeOptionText, { color: theme.error }]}>Logout</Text>
              </View>
              <Feather name="chevron-right" size={20} color={theme.error} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};
