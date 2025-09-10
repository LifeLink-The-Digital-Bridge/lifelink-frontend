import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { createAuthStyles } from '../../constants/styles/authStyles';

interface ProfileActionsProps {
  isOwnProfile?: boolean;
  isFollowing: boolean;
  followLoading: boolean;
  theme: any;
  handleFollow: () => void;
  handleUnfollow: () => void;
  confirmLogout: () => void;
}

export const ProfileActions: React.FC<ProfileActionsProps> = ({
  isOwnProfile = false,
  isFollowing,
  followLoading,
  theme,
  handleFollow,
  handleUnfollow,
  confirmLogout
}) => {
  const router = useRouter();
  const styles = createAuthStyles(theme);

  return (
    <View style={{ paddingHorizontal: 24, paddingBottom: 40 }}>
      {isOwnProfile ? (
        <>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.success, marginBottom: 12 }]}
            onPress={() => router.push("/navigation/editProfile")}
          >
            <Feather name="edit" size={20} color="#fff" />
            <Text style={[styles.buttonText, { marginLeft: 8 }]}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary, marginBottom: 12 }]}
            onPress={() => router.push("/navigation/StatusScreen")}
          >
            <Feather name="clipboard" size={20} color="#fff" />
            <Text style={[styles.buttonText, { marginLeft: 8 }]}>My Status</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.error }]}
            onPress={confirmLogout}
          >
            <Feather name="log-out" size={20} color="#fff" />
            <Text style={[styles.buttonText, { marginLeft: 8 }]}>Logout</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isFollowing ? theme.textSecondary : theme.primary },
          ]}
          onPress={isFollowing ? handleUnfollow : handleFollow}
          disabled={followLoading}
        >
          <Feather
            name={isFollowing ? "user-minus" : "user-plus"}
            size={20}
            color="#fff"
          />
          <Text style={[styles.buttonText, { marginLeft: 8 }]}>
            {isFollowing ? "Unfollow" : "Follow"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};