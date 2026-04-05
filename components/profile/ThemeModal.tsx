import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { createProfileStyles } from '../../constants/styles/profileStyles';
import {
  LANGUAGE_OPTIONS,
  useLanguage,
} from '../../utils/language-context';
import { LanguageSelectionModal } from './LanguageSelectionModal';

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
  const { language, t } = useLanguage();
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const themeOptions: { value: "light" | "dark" | "system"; label: string; icon: string }[] = [
    { value: "light", label: t("settings.theme.light"), icon: "sun" },
    { value: "dark", label: t("settings.theme.dark"), icon: "moon" },
    { value: "system", label: t("settings.theme.system"), icon: "smartphone" },
  ];

  const selectedLanguageLabel =
    t(
      LANGUAGE_OPTIONS.find((option) => option.value === language)?.labelKey ??
        "settings.language.english"
    );

  useEffect(() => {
    if (!visible) {
      setShowLanguageModal(false);
    }
  }, [visible]);

  return (
    <>
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
            style={[styles.modalContent, { maxHeight: "85%" }]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>{t("settings.title")}</Text>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 8 }}
            >
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>{t("settings.theme")}</Text>
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
                <Text style={styles.modalSectionTitle}>{t("settings.language")}</Text>
                <TouchableOpacity
                  style={styles.themeOption}
                  onPress={() => setShowLanguageModal(true)}
                >
                  <View style={styles.themeOptionLeft}>
                    <View style={styles.themeOptionIcon}>
                      <Feather name="globe" size={20} color={theme.primary} />
                    </View>
                    <Text style={styles.themeOptionText}>{selectedLanguageLabel}</Text>
                  </View>
                  <Feather name="chevron-right" size={20} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>{t("settings.account")}</Text>
                <TouchableOpacity
                  style={[styles.themeOption, styles.logoutOption]}
                  onPress={onLogout}
                >
                  <View style={styles.themeOptionLeft}>
                    <View style={[styles.themeOptionIcon, { backgroundColor: theme.error + '20' }]}>
                      <Feather name="log-out" size={20} color={theme.error} />
                    </View>
                    <Text style={[styles.themeOptionText, { color: theme.error }]}>
                      {t("settings.account.logout")}
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={20} color={theme.error} />
                </TouchableOpacity>
              </View>
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <LanguageSelectionModal
        visible={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        theme={theme}
      />
    </>
  );
};
