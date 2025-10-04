import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SearchBar } from './SearchBar';

interface TopBarProps {
  theme: any;
  onMenuPress: () => void;
  onBellPress: () => void;
  showBackButton?: boolean;
  showSettingsButton?: boolean;
  onSettingsPress?: () => void;
  onBack?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  theme,
  onMenuPress,
  onBellPress,
  showBackButton = false,
  showSettingsButton = false,
  onSettingsPress,
  onBack,
}) => {
  const router = useRouter();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 18,
      paddingTop: 18,
      paddingBottom: 14,
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },

    iconButton: {
      backgroundColor: theme.primary + '20',
      borderRadius: 24,
      padding: 8,
    },

    leftButton: {
      marginRight: 14,
    },

    rightButton: {
      marginLeft: 14,
    },
  });

  return (
    <View style={styles.container}>
      {showBackButton ? (
        <TouchableOpacity
          style={[styles.iconButton, styles.leftButton]}
          onPress={onBack ? onBack : () => router.back()}
        >
          <Feather name="arrow-left" size={24} color={theme.primary} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.iconButton, styles.leftButton]}
          onPress={onMenuPress}
        >
          <Feather name="menu" size={24} color={theme.primary} />
        </TouchableOpacity>
      )}

      <SearchBar theme={theme} placeholder="Search users..." />

      <TouchableOpacity
        style={[styles.iconButton, styles.rightButton]}
        onPress={onBellPress}
      >
        <Feather name="bell" size={24} color={theme.primary} />
      </TouchableOpacity>

      {showSettingsButton && onSettingsPress && (
        <TouchableOpacity
          style={[styles.iconButton, styles.rightButton]}
          onPress={onSettingsPress}
        >
          <Feather name="settings" size={24} color={theme.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
};
