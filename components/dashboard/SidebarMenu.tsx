import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from "react-native-modal";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';

interface SidebarMenuProps {
  isVisible: boolean;
  onClose: () => void;
}

export function SidebarMenu({ isVisible, onClose }: SidebarMenuProps) {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  const styles = StyleSheet.create({
    sidebarContainer: {
      width: 280,
      height: '100%',
      backgroundColor: theme.card,
      paddingTop: 50,
      paddingHorizontal: 20,
      borderTopRightRadius: 16,
      borderBottomRightRadius: 16,
      elevation: 10,
      shadowColor: theme.shadow,
      shadowOpacity: 0.3,
      shadowOffset: { width: 4, height: 0 },
      shadowRadius: 10,
      zIndex: 1000,
      justifyContent: 'flex-start',
    },
    sidebarTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 32,
    },
    menuItemButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderRadius: 12,
      marginBottom: 12,
      backgroundColor: theme.background,
      borderWidth: 1,
      borderColor: theme.border,
    },
    menuItemText: {
      fontSize: 16,
      color: theme.text,
      marginLeft: 12,
      fontWeight: '500',
    },
    closeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderRadius: 12,
      marginTop: 40,
      backgroundColor: theme.primary + '15',
      borderWidth: 1,
      borderColor: theme.primary + '30',
    },
    closeButtonText: {
      fontSize: 16,
      color: theme.primary,
      marginLeft: 12,
      fontWeight: '600',
    },
  });

  const menuItems = [
    { 
      icon: 'dollar-sign', 
      label: 'Raise Fund',
      route: '/navigation/RaiseFund' as const
    },
    { 
      icon: 'heart', 
      label: 'My Donations',
      route: '/navigation/DonationStatusScreen' as const
    },
    { 
      icon: 'gift', 
      label: 'Receiver Requests',
      route: '/navigation/RecipientStatusScreen' as const
    },
  ];

  const handleMenuItemPress = (
    route: '/navigation/RaiseFund' | '/navigation/DonationStatusScreen' | '/navigation/RecipientStatusScreen'
  ) => {
    onClose();
    router.push(route);
  };

  return (
    <Modal
      isVisible={isVisible}
      animationIn="slideInLeft"
      animationOut="slideOutLeft"
      onBackdropPress={onClose}
      backdropOpacity={0.4}
      style={{
        margin: 0,
        justifyContent: "flex-start",
        alignItems: "flex-start",
      }}
    >
      <View style={styles.sidebarContainer}>
        <Text style={styles.sidebarTitle}>Menu</Text>
        
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItemButton}
            onPress={() => handleMenuItemPress(item.route)}
            activeOpacity={0.7}
          >
            <Feather name={item.icon as any} size={20} color={theme.text} />
            <Text style={styles.menuItemText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
        
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <Feather name="x" size={20} color={theme.primary} />
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
