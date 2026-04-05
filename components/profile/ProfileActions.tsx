import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { createProfileStyles } from '../../constants/styles/profileStyles';
import { useLanguage } from '../../utils/language-context';

interface ProfileActionsProps {
  isOwnProfile: boolean;
  isFollowing: boolean;
  followLoading: boolean;
  theme: any;
  handleFollow: () => void;
  handleUnfollow: () => void;
  confirmLogout: () => void;
}

export const ProfileActions: React.FC<ProfileActionsProps> = ({
  isOwnProfile,
  isFollowing,
  followLoading,
  theme,
  handleFollow,
  handleUnfollow,
  confirmLogout,
}) => {
  const router = useRouter();
  const styles = createProfileStyles(theme);
  const { t } = useLanguage();

  if (!isOwnProfile) {
    return (
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            isFollowing ? styles.secondaryButton : styles.primaryButton,
          ]}
          onPress={isFollowing ? handleUnfollow : handleFollow}
          disabled={followLoading}
        >
          <Feather
            name={isFollowing ? "user-check" : "user-plus"}
            size={16}
            color={isFollowing ? theme.text : "#fff"}
          />
          <Text
            style={[
              styles.buttonText,
              isFollowing ? styles.secondaryButtonText : styles.primaryButtonText,
            ]}
          >
            {isFollowing ? t("profile.actions.following") : t("profile.actions.follow")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.actionsContainer}>
      <TouchableOpacity
        style={[styles.actionButton, styles.secondaryButton]}
        onPress={() => router.push("/navigation/profilescreens/editProfile")}
      >
        <Feather name="edit-2" size={16} color={theme.text} />
        <Text style={[styles.buttonText, styles.secondaryButtonText]}>
          {t("profile.actions.editProfile")}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionButton, styles.primaryButton]}
        onPress={() => router.push("/navigation/statusscreens/StatusScreen")}
      >
        <Feather name="activity" size={16} color="#fff" />
        <Text style={[styles.buttonText, styles.primaryButtonText]}>
          {t("profile.actions.myStatus")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
