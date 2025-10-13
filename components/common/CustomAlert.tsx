import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../../utils/theme-context";
import { lightTheme, darkTheme, createAuthStyles } from "../../constants/styles/authStyles";

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function CustomAlert({
  visible,
  title,
  message,
  onClose,
  onConfirm,
  confirmText = "OK",
  cancelText,
}: CustomAlertProps) {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createAuthStyles(theme);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: theme.card,
            padding: 20,
            borderRadius: 12,
            width: "80%",
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 10,
              color: theme.text,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontSize: 14,
              marginBottom: 20,
              color: theme.textSecondary,
            }}
          >
            {message}
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              gap: 12,
            }}
          >
            {cancelText && (
              <TouchableOpacity onPress={onClose}>
                <Text style={{ color: theme.textSecondary, fontSize: 14 }}>
                  {cancelText}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => {
                onConfirm?.();
                onClose();
              }}
            >
              <Text style={{ color: theme.primary, fontWeight: "600", fontSize: 14 }}>
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
