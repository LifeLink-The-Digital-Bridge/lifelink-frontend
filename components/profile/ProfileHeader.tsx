import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../utils/responsive';

interface ProfileHeaderProps {
  profile: {
    name?: string;
    username: string;
    email: string;
    dob?: string;
    profileImageUrl?: string | null;
    followersCount?: number;
    followingCount?: number;
    id: string;
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
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const router = useRouter();

  const handleFollowersPress = () => {
    if (profile?.id && profile?.username) {
      router.push(
        `/navigation/profilescreens/FollowListScreen?userId=${profile.id}&type=followers&username=${profile.username}` as any
      );
    }
  };

  const handleFollowingPress = () => {
    if (profile?.id && profile?.username) {
      router.push(
        `/navigation/profilescreens/FollowListScreen?userId=${profile.id}&type=following&username=${profile.username}` as any
      );
    }
  };

  return (
    <>
      <View style={[styles.profileSection, { backgroundColor: theme.card }]}>
        <View style={styles.profileTopRow}>
          <TouchableOpacity
            style={styles.profileImageWrapper}
            onPress={() => profile.profileImageUrl && setImageViewerVisible(true)}
            activeOpacity={profile.profileImageUrl ? 0.7 : 1}
          >
            {profile.profileImageUrl ? (
              <Image
                source={{ uri: profile.profileImageUrl }}
                style={[styles.profileImage, { borderColor: theme.primary }]}
              />
            ) : (
              <View style={[styles.profileImagePlaceholder, { backgroundColor: theme.primary + '20' }]}>
                <Feather name="user" size={44} color={theme.textSecondary} />
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.profileInfo}>
            <Text style={[styles.username, { color: theme.text }]} numberOfLines={1}>
              {profile.name || profile.username}
            </Text>
            <Text style={[styles.handle, { color: theme.textSecondary }]} numberOfLines={1}>
              @{profile.username}
            </Text>
            <View style={styles.infoItem}>
              <Feather name="mail" size={13} color={theme.textSecondary} />
              <Text style={[styles.infoText, { color: theme.textSecondary }]} numberOfLines={1}>
                {profile.email}
              </Text>
            </View>
            {profile.dob && (
              <View style={styles.infoItem}>
                <Feather name="calendar" size={13} color={theme.textSecondary} />
                <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                  Date Of Birth {formatDate(profile.dob)}
                </Text>
              </View>
            )}
          </View>

          {isOwnProfile && (
            <TouchableOpacity style={styles.settingsButton} onPress={onSettingsPress}>
              <Feather name="settings" size={20} color={theme.text} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.statsRow}>
          <TouchableOpacity
            style={styles.statItem}
            onPress={handleFollowersPress}
            activeOpacity={0.7}
          >
            <Text style={[styles.statValue, { color: theme.text }]}>
              {profile.followersCount ?? 0}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Followers
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statItem}
            onPress={handleFollowingPress}
            activeOpacity={0.7}
          >
            <Text style={[styles.statValue, { color: theme.text }]}>
              {profile.followingCount ?? 0}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Following
            </Text>
          </TouchableOpacity>

          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.text }]}>0</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Lives Saved
            </Text>
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
            {profile.profileImageUrl && (
              <Image
                source={{ uri: profile.profileImageUrl }}
                style={styles.fullscreenImage}
                resizeMode="contain"
              />
            )}
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  profileSection: {
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),
    marginHorizontal: wp('3%'),
    marginTop: hp('2%'),
  },
  profileTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: hp('2%'),
  },
  profileImageWrapper: {
    marginRight: wp('3%'),
  },
  profileImage: {
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: wp('10%'),
    borderWidth: 2,
  },
  profileImagePlaceholder: {
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: wp('10%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  username: {
    fontSize: wp('4.5%'),
    fontWeight: '700',
    marginBottom: hp('0.3%'),
  },
  handle: {
    fontSize: wp('3.5%'),
    fontWeight: '500',
    marginBottom: hp('1%'),
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('0.5%'),
  },
  infoText: {
    fontSize: wp('3.2%'),
    marginLeft: wp('1.5%'),
  },
  settingsButton: {
    padding: wp('2%'),
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: hp('1.5%'),
    borderTopWidth: 1,
    borderTopColor: 'rgba(128, 128, 128, 0.2)',
  },
  statItem: {
    alignItems: 'center',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('3%'),
  },
  statValue: {
    fontSize: wp('4.5%'),
    fontWeight: '700',
  },
  statLabel: {
    fontSize: wp('3%'),
    marginTop: hp('0.3%'),
  },
  imageViewerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageViewerCloseButton: {
    position: 'absolute',
    top: hp('6%'),
    right: wp('5%'),
    zIndex: 10,
    padding: wp('2%'),
  },
  imageViewerContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: wp('90%'),
    height: hp('70%'),
  },
});
