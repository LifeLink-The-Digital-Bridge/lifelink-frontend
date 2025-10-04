import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { createProfileStyles } from '../../constants/styles/profileStyles';

interface ProfileHeaderProps {
  profile: {
    username: string;
    email: string;
    dob?: string;
    profileImageUrl?: string | null;
    followersCount?: number;
    followingCount?: number;
  };
  theme: any;
  formatDate: (dateStr: string) => string;
  isOwnProfile: boolean;
  onSettingsPress: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  theme,
  formatDate,
  isOwnProfile,
  onSettingsPress,
}) => {
  const styles = createProfileStyles(theme);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);

  return (
    <>
      <View style={styles.profileSection}>
        <View style={styles.profileTopRow}>
          <TouchableOpacity 
            style={styles.profileImageWrapper}
            onPress={() => profile.profileImageUrl && setImageViewerVisible(true)}
            activeOpacity={profile.profileImageUrl ? 0.7 : 1}
          >
            {profile.profileImageUrl ? (
              <Image source={{ uri: profile.profileImageUrl }} style={styles.profileImage} />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Feather name="user" size={44} color={theme.textSecondary} />
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.profileInfo}>
            <Text style={styles.username} numberOfLines={1}>{profile.username}</Text>
            <Text style={styles.handle} numberOfLines={1}>@{profile.username.toLowerCase()}</Text>
            <View style={styles.infoItem}>
              <Feather name="mail" size={13} color={theme.textSecondary} />
              <Text style={styles.infoText} numberOfLines={1}>{profile.email}</Text>
            </View>
            <View style={styles.infoItem}>
              <Feather name="calendar" size={13} color={theme.textSecondary} />
              <Text style={styles.infoText}>Joined {formatDate(profile.dob ?? "")}</Text>
            </View>
          </View>

          {isOwnProfile && (
            <TouchableOpacity style={styles.settingsButton} onPress={onSettingsPress}>
              <Feather name="settings" size={20} color={theme.text} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile.followersCount ?? 0}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile.followingCount ?? 0}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Lives Saved</Text>
          </View>
        </View>
      </View>

      <Modal
        visible={imageViewerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setImageViewerVisible(false)}
      >
        <View style={styles.imageViewerOverlay}>
          <TouchableOpacity
            style={styles.imageViewerCloseButton}
            onPress={() => setImageViewerVisible(false)}
          >
            <Feather name="x" size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.imageViewerContainer}
            activeOpacity={1}
            onPress={() => setImageViewerVisible(false)}
          >
            <Image
              source={{ uri: profile.profileImageUrl! }}
              style={styles.fullscreenImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};
