import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';

interface ValidationAlertProps {
  visible: boolean;
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

export function ValidationAlert({ 
  visible, 
  title, 
  message, 
  type = 'info', 
  onClose 
}: ValidationAlertProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  const getIconAndColor = () => {
    switch (type) {
      case 'success':
        return { icon: 'check-circle', color: theme.success };
      case 'error':
        return { icon: 'alert-circle', color: theme.error };
      case 'warning':
        return { icon: 'alert-triangle', color: '#f59e0b' };
      default:
        return { icon: 'info', color: theme.primary };
    }
  };

  const { icon, color } = getIconAndColor();

  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    backdrop: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    modalView: {
      margin: 20,
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 24,
      alignItems: 'center',
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
      borderWidth: 1,
      borderColor: theme.border,
      minWidth: 280,
      maxWidth: 320,
    },
    iconContainer: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: color + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    titleText: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    messageText: {
      fontSize: 16,
      color: theme.textSecondary,
      marginBottom: 24,
      textAlign: 'center',
      lineHeight: 22,
    },
    button: {
      backgroundColor: theme.primary,
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 32,
      minWidth: 80,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    buttonText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 16,
      textAlign: 'center',
    },
  });

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <TouchableOpacity 
          style={styles.backdrop} 
          onPress={onClose}
          activeOpacity={1}
        />
        <View style={styles.modalView}>
          <View style={styles.iconContainer}>
            <Feather name={icon as any} size={28} color={color} />
          </View>
          
          {title && (
            <Text style={styles.titleText}>{title}</Text>
          )}
          
          <Text style={styles.messageText}>{message}</Text>
          
          <TouchableOpacity
            style={styles.button}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
