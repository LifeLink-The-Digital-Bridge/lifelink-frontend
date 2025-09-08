import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { createAuthStyles } from '../../constants/styles/authStyles';

interface ThemeSettingsProps {
  theme: any;
  currentTheme: string;
  showThemeSettings: boolean;
  setShowThemeSettings: (show: boolean) => void;
  handleThemeChange: (theme: "light" | "dark" | "system") => void;
  getThemeDisplayName: (theme: string) => string;
  isDark: boolean;
}

export const ThemeSettings: React.FC<ThemeSettingsProps> = ({
  theme,
  currentTheme,
  showThemeSettings,
  setShowThemeSettings,
  handleThemeChange,
  getThemeDisplayName,
  isDark
}) => {
  const styles = createAuthStyles(theme);

  return (
    <View style={styles.formSection}>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowThemeSettings(!showThemeSettings)}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Feather
              name={isDark ? "moon" : "sun"}
              size={20}
              color={theme.text}
              style={{ marginRight: 12 }}
            />
            <View>
              <Text style={{ color: theme.text, fontSize: 16, fontWeight: "500" }}>
                Theme Settings
              </Text>
              <Text style={{ color: theme.textSecondary, fontSize: 14 }}>
                Current: {getThemeDisplayName(currentTheme)}
              </Text>
            </View>
          </View>
          <Feather
            name={showThemeSettings ? "chevron-up" : "chevron-down"}
            size={20}
            color={theme.textSecondary}
          />
        </View>
      </TouchableOpacity>

      {showThemeSettings && (
        <View style={{ marginTop: 8 }}>
          {(["light", "dark", "system"] as const).map((themeOption) => (
            <TouchableOpacity
              key={themeOption}
              style={[
                styles.input,
                { marginBottom: 8 },
                currentTheme === themeOption && { borderColor: theme.primary, borderWidth: 3 },
              ]}
              onPress={() => handleThemeChange(themeOption)}
            >
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Feather
                    name={
                      themeOption === "light"
                        ? "sun"
                        : themeOption === "dark"
                        ? "moon"
                        : "smartphone"
                    }
                    size={18}
                    color={theme.text}
                    style={{ marginRight: 12 }}
                  />
                  <Text style={{ color: theme.text, fontSize: 15 }}>
                    {getThemeDisplayName(themeOption)}
                  </Text>
                </View>
                {currentTheme === themeOption && (
                  <Feather name="check" size={18} color={theme.primary} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};