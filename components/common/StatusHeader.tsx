import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { createUnifiedStyles } from '../../constants/styles/unifiedStyles';

interface StatusHeaderProps {
  title: string;
  subtitle: string;
  iconName: keyof typeof Feather.glyphMap;
  statusText?: string;
  statusColor?: string;
  onStatusPress?: () => void;
  showBackButton?: boolean;
  onBackPress?: () => void;
  theme: any;
  translateY?: Animated.Value;
}

export const StatusHeader: React.FC<StatusHeaderProps> = ({
  title,
  subtitle,
  iconName,
  statusText,
  statusColor,
  onStatusPress,
  showBackButton = false,
  onBackPress,
  theme,
  translateY,
}) => {
  const router = useRouter();
  const styles = createUnifiedStyles(theme);

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const animatedStyle = translateY
    ? {
        transform: [{ translateY }],
      }
    : {};

  return (
    <Animated.View
      style={[
        styles.headerContainer,
        { width: "100%" },
        animatedStyle,
      ]}
    >
      {showBackButton && (
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Feather name="arrow-left" size={20} color={theme.text} />
        </TouchableOpacity>
      )}

      <View style={styles.headerIconContainer}>
        <Feather name={iconName} size={28} color={theme.primary} />
      </View>

      <View style={styles.headerTextContainer}>
        <Text style={styles.headerTitle}>{title}</Text>
        <Text style={styles.headerSubtitle}>{subtitle}</Text>
      </View>

      {statusText && (
        <TouchableOpacity
          style={[
            styles.statusBadge,
            statusColor && {
              backgroundColor: `${statusColor}20`,
              borderColor: `${statusColor}40`,
            },
          ]}
          onPress={onStatusPress}
          disabled={!onStatusPress}
          activeOpacity={onStatusPress ? 0.7 : 1}
        >
          <Text style={[styles.statusText, statusColor && { color: statusColor }]}>
            {statusText}
          </Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};
