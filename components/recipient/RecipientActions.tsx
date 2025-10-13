import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../utils/theme-context";
import { lightTheme, darkTheme } from "../../constants/styles/authStyles";
import { createUnifiedStyles } from "../../constants/styles/unifiedStyles";

interface RecipientActionsProps {
  onUpdatePress: () => void;
  onCreateRequestPress: () => void;
}

export function RecipientActions({
  onUpdatePress,
  onCreateRequestPress,
}: RecipientActionsProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  return (
    <View style={styles.actionsContainer}>
      <TouchableOpacity
        style={[styles.actionButton, styles.updateButton]}
        onPress={onUpdatePress}
        activeOpacity={0.8}
      >
        <View style={styles.actionButtonContent}>
          <View
            style={[
              styles.actionIconContainer,
              { backgroundColor: theme.primary + "20" },
            ]}
          >
            <Feather name="edit-3" size={20} color={theme.primary} />
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>Update Profile</Text>
            <Text style={styles.actionSubtitle}>
              Modify your recipient details
            </Text>
          </View>
          <Feather name="chevron-right" size={16} color={theme.textSecondary} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, styles.requestButton]}
        onPress={onCreateRequestPress}
        activeOpacity={0.8}
      >
        <View style={styles.actionButtonContent}>
          <View
            style={[
              styles.actionIconContainer,
              { backgroundColor: theme.success + "20" },
            ]}
          >
            <Feather name="plus-circle" size={20} color={theme.success} />
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>Create Request</Text>
            <Text style={styles.actionSubtitle}>
              Request blood, organ, or tissue
            </Text>
          </View>
          <Feather name="chevron-right" size={16} color={theme.textSecondary} />
        </View>
      </TouchableOpacity>
    </View>
  );
}
