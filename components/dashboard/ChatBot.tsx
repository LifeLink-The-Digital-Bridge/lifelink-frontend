import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from "@expo/vector-icons";
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';

interface ChatBotProps {
  visible: boolean;
  onPress: () => void;
}

export function ChatBot({ visible, onPress }: ChatBotProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  const styles = StyleSheet.create({
    chatBotIcon: {
      position: "absolute",
      bottom: 105,
      right: 20,
      zIndex: 999,
    },
    chatBotButton: {
      backgroundColor: theme.primary,
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: "center",
      alignItems: "center",
      elevation: 8,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
  });

  if (!visible) return null;

  return (
    <View style={styles.chatBotIcon}>
      <TouchableOpacity
        style={styles.chatBotButton}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Feather name="message-circle" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
