import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { createUnifiedStyles } from '../../constants/styles/unifiedStyles';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';
import { InfoRow } from './InfoRow';

interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  profileImageUrl?: string;
  phone?: string;
  gender?: string;
}

interface ProfileCardProps {
  user: UserProfile;
  title: string;
  iconName: string;
  onViewProfile: (userId: string, userName: string) => void;
  historicalData?: any;
  isHistorical?: boolean;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ 
  user, 
  title, 
  iconName, 
  onViewProfile,
  historicalData,
  isHistorical = false
}) => {
  const { colorScheme } = useTheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  return (
    <View style={[styles.sectionContainer, { paddingHorizontal: 24 }]}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconContainer}>
          <Feather name={iconName as any} size={18} color={theme.primary} />
        </View>
        <Text style={styles.sectionTitle}>{title} Profile</Text>
      </View>
      
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        {user.profileImageUrl ? (
          <Image 
            source={{ uri: user.profileImageUrl }} 
            style={{ width: 60, height: 60, borderRadius: 30, marginRight: 16 }}
          />
        ) : (
          <View style={{ 
            width: 60, 
            height: 60, 
            borderRadius: 30, 
            backgroundColor: theme.primary + '20', 
            justifyContent: 'center', 
            alignItems: 'center',
            marginRight: 16
          }}>
            <FontAwesome name="user" size={24} color={theme.primary} />
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { fontSize: 18 }]}>{user.name}</Text>
          <Text style={styles.headerSubtitle}>@{user.username}</Text>
        </View>
        <TouchableOpacity
          style={[styles.locationButton, { paddingHorizontal: 12, paddingVertical: 8 }]}
          onPress={() => onViewProfile(user.id, user.name)}
        >
          <Feather name="eye" size={14} color="#fff" />
          <Text style={[styles.locationButtonText, { fontSize: 12, marginLeft: 4 }]}>
            View Profile
          </Text>
        </TouchableOpacity>
      </View>

      <InfoRow label="Email" value={user.email} />
      {user.phone && <InfoRow label="Phone" value={user.phone} />}
      {user.gender && <InfoRow label="Gender" value={user.gender} isLast />}
    </View>
  );
};
