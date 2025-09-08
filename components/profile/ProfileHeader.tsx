import React from 'react';
import { View, Text, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { createAuthStyles } from '../../constants/styles/authStyles';

interface ProfileHeaderProps {
  profile: {
    username: string;
    email: string;
    dob?: string;
    profileImageUrl?: string;
    followers?: number;
    following?: number;
  };
  theme: any;
  formatDate: (dateStr: string) => string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, theme, formatDate }) => {
  const styles = createAuthStyles(theme);

  return (
    <View style={[styles.headerContainer, { flexDirection: "row" }]}>
      <View style={{ alignItems: "center", marginRight: 20 }}>
        {profile.profileImageUrl ? (
          <Image source={{ uri: profile.profileImageUrl }} style={styles.profileImage} />
        ) : (
          <FontAwesome name="user-circle" size={100} color={theme.primary} />
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>@{profile.username}</Text>
        <Text style={styles.subtitle}>{profile.email}</Text>
        <Text style={styles.subtitle}>{formatDate(profile.dob ?? "")}</Text>

        <View style={{ flexDirection: "row", marginTop: 16 }}>
          <View style={{ marginRight: 24 }}>
            <Text style={[styles.subtitle, { fontSize: 12 }]}>Followers</Text>
            <Text style={{ color: theme.text, fontWeight: "600" }}>
              {profile.followers ?? 0}
            </Text>
          </View>
          <View>
            <Text style={[styles.subtitle, { fontSize: 12 }]}>Following</Text>
            <Text style={{ color: theme.text, fontWeight: "600" }}>
              {profile.following ?? 0}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};