import React from "react";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { createProfileStyles } from "../../constants/styles/profileStyles";
import {
  AppLanguage,
  LANGUAGE_OPTIONS,
  useLanguage,
} from "../../utils/language-context";

interface LanguageSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  theme: any;
}

export const LanguageSelectionModal: React.FC<LanguageSelectionModalProps> = ({
  visible,
  onClose,
  theme,
}) => {
  const styles = createProfileStyles(theme);
  const { language, setLanguage, t } = useLanguage();

  const configuredOptions: { value: AppLanguage; label: string; icon: string }[] =
    LANGUAGE_OPTIONS.map((option) => ({
      value: option.value,
      label: t(option.labelKey),
      icon: "globe",
    }));
  const englishOption =
    configuredOptions.find((option) => option.value === "en") ?? {
      value: "en" as AppLanguage,
      label: "English",
      icon: "globe",
    };
  const languageOptions: { value: AppLanguage; label: string; icon: string }[] = [
    englishOption,
    ...configuredOptions.filter((option) => option.value !== "en"),
  ];

  const handleLanguageSelect = async (selectedLanguage: AppLanguage) => {
    await setLanguage(selectedLanguage);
    onClose();
  };

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
          style={[styles.modalContent, { maxHeight: "85%" }]}
          onPress={(event) => event.stopPropagation()}
        >
          <View style={styles.modalHandle} />
          <View
            style={{
              paddingHorizontal: 20,
              paddingBottom: 12,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={[styles.modalTitle, { marginBottom: 0, paddingHorizontal: 0 }]}>
              {t("settings.language")}
            </Text>
            <TouchableOpacity onPress={onClose} style={{ padding: 6 }}>
              <Feather name="x" size={22} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={languageOptions}
            keyExtractor={(item) => item.value}
            showsVerticalScrollIndicator
            contentContainerStyle={{ paddingBottom: 12 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.themeOption}
                onPress={() => void handleLanguageSelect(item.value)}
              >
                <View style={styles.themeOptionLeft}>
                  <View style={styles.themeOptionIcon}>
                    <Feather
                      name={item.icon as any}
                      size={20}
                      color={language === item.value ? theme.primary : theme.text}
                    />
                  </View>
                  <Text style={styles.themeOptionText}>{item.label}</Text>
                </View>
                {language === item.value && (
                  <Feather name="check" size={20} color={theme.primary} />
                )}
              </TouchableOpacity>
            )}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};
