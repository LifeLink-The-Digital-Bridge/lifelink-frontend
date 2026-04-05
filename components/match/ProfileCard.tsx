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
  matchingServiceData?: any;
  isHistorical?: boolean;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ 
  user, 
  title, 
  iconName, 
  onViewProfile,
  matchingServiceData,
  isHistorical = false
}) => {
  const { colorScheme } = useTheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  return (
    <TouchableOpacity
      style={styles.sectionContainer}
      onPress={() => onViewProfile(user.id, user.name)}
      activeOpacity={0.7}
    >
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconContainer}>
          <Feather name={iconName as any} size={18} color={theme.primary} />
        </View>
        <Text style={styles.sectionTitle}>{title} Profile</Text>
        <View style={{ marginLeft: 'auto' }}>
          <Feather name="chevron-right" size={20} color={theme.primary} />
        </View>
      </View>
      
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        {user.profileImageUrl ? (
          <Image 
            source={{ uri: user.profileImageUrl }} 
            style={{ 
              width: 60, 
              height: 60, 
              borderRadius: 30, 
              marginRight: 16,
              borderWidth: 2,
              borderColor: theme.primary + '40'
            }}
          />
        ) : (
          <View style={{ 
            width: 60, 
            height: 60, 
            borderRadius: 30, 
            backgroundColor: theme.primary + '20', 
            justifyContent: 'center', 
            alignItems: 'center',
            marginRight: 16,
            borderWidth: 2,
            borderColor: theme.primary + '40'
          }}>
            <FontAwesome name="user" size={24} color={theme.primary} />
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { fontSize: 18, marginBottom: 4 }]}>
            {user.name}
          </Text>
          <Text style={[styles.headerSubtitle, { fontSize: 14 }]}>
            @{user.username}
          </Text>
        </View>
      </View>

      <InfoRow label="Email" value={user.email} />
      {user.phone && <InfoRow label="Phone" value={user.phone} />}
      {user.gender && <InfoRow label="Gender" value={user.gender} />}

      {matchingServiceData && (
        <>
          {title === "Donor" && matchingServiceData.status && (
            <InfoRow 
              label="Status" 
              value={matchingServiceData.status}
              valueColor={matchingServiceData.status === 'ACTIVE' ? theme.success : theme.text}
            />
          )}
          {title === "Recipient" && matchingServiceData.availability && (
            <InfoRow 
              label="Availability" 
              value={matchingServiceData.availability}
              valueColor={matchingServiceData.availability === 'AVAILABLE' ? theme.success : theme.text}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};
