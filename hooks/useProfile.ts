import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { useLocalSearchParams } from "expo-router";
import { UserDTO, fetchUserProfile, fetchIsFollowing } from "../scripts/api/profile";
import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig?.extra?.API_URL;

export const useProfile = () => {
  const { username: paramUsername } = useLocalSearchParams<{ username: string }>();
  const [profile, setProfile] = useState<UserDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [followLoading, setFollowLoading] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);

  useEffect(() => {
    SecureStore.getItemAsync("userId").then(setCurrentUserId);
    SecureStore.getItemAsync("username").then(setCurrentUsername);
  }, []);

  const profileUsername = paramUsername || currentUsername;

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        if (!profileUsername) return;
        const token = (await SecureStore.getItemAsync("jwt")) || "";
        const data = await fetchUserProfile(profileUsername, token);
        setProfile(data);

        if (data.id && currentUserId && data.id !== currentUserId) {
          const following = await fetchIsFollowing(data.id, token);
          setIsFollowing(following);
        } else {
          setIsFollowing(false);
        }
      } catch (error: any) {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [profileUsername, currentUserId]);

  const handleFollow = async () => {
    setFollowLoading(true);
    try {
      const token = (await SecureStore.getItemAsync("jwt")) || "";
      const userId = await SecureStore.getItemAsync("userId");
      const response = await fetch(
        `${BASE_URL}/users/follow/${profile?.id}/follow`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            id: userId || "",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to follow user");
      setIsFollowing(true);
    } catch (error: any) {
      throw error;
    } finally {
      setFollowLoading(false);
    }
  };

  const handleUnfollow = async () => {
    setFollowLoading(true);
    try {
      const token = (await SecureStore.getItemAsync("jwt")) || "";
      const userId = await SecureStore.getItemAsync("userId");
      const response = await fetch(
        `${BASE_URL}/users/follow/${profile?.id}/unfollow`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            id: userId || "",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to unfollow user");
      setIsFollowing(false);
    } catch (error: any) {
      throw error;
    } finally {
      setFollowLoading(false);
    }
  };

  return {
    profile,
    loading,
    followLoading,
    isFollowing,
    isOwnProfile: profile && currentUserId === profile.id,
    handleFollow,
    handleUnfollow,
  };
};
