import React from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { useTheme } from "../../utils/theme-context";
import { lightTheme, darkTheme } from "../../constants/styles/authStyles";
import { createUnifiedStyles } from "../../constants/styles/unifiedStyles";

interface RecipientLoadingScreenProps {
  message?: string;
}

export function RecipientLoadingScreen({
  message = "Setting up recipient role...",
}: RecipientLoadingScreenProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={theme.primary} />
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  );
}
