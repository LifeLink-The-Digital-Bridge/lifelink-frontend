import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';

interface TopBarProps {
  onMenuPress: () => void;
  onBellPress?: () => void;
}

export function TopBar({ onMenuPress, onBellPress }: TopBarProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  const styles = StyleSheet.create({
    topBar: { 
      flexDirection: "row", 
      alignItems: "center", 
      marginBottom: 18 
    },
    menuButton: {
      marginRight: 14,
      backgroundColor: theme.primary + '20',
      borderRadius: 24,
      padding: 8,
    },
    searchContainer: {
      flex: 1,
      flexDirection: "row",
      backgroundColor: theme.card,
      borderRadius: 10,
      alignItems: "center",
      paddingHorizontal: 12,
      height: 42,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    searchInput: {
      flex: 1,
      marginLeft: 8,
      fontSize: 16,
      color: theme.text,
    },
    bellButton: {
      marginLeft: 16,
      backgroundColor: theme.primary + '20',
      borderRadius: 24,
      padding: 8,
    },
  });

  return (
    <View style={styles.topBar}>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={onMenuPress}
      >
        <Feather name="menu" size={24} color={theme.primary} />
      </TouchableOpacity>
      
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={22} color={theme.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor={theme.textSecondary}
        />
      </View>
      
      <TouchableOpacity 
        style={styles.bellButton}
        onPress={onBellPress || (() => console.log('Bell pressed'))}
      >
        <Feather name="bell" size={24} color={theme.primary} />
      </TouchableOpacity>
    </View>
  );
}
