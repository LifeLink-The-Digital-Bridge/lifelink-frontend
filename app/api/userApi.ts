import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig?.extra?.API_URL;

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = await SecureStore.getItemAsync('jwt');
  const userId = await SecureStore.getItemAsync('userId');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(userId && { id: userId }),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  profileImageUrl: string | null;
  roles: string[];
  profileVisibility: 'PUBLIC' | 'PRIVATE' | 'FOLLOWERS_ONLY';
  followersCount?: number;
  followingCount?: number;
}

export interface UserDTO {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  profileImageUrl: string | null;
  roles: string[];
  profileVisibility: 'PUBLIC' | 'PRIVATE' | 'FOLLOWERS_ONLY';
  followersCount?: number;
  followingCount?: number;
}

export const getUserProfile = async (username: string): Promise<UserProfile> => {
  try {
    return await fetchWithAuth(`/users/profile/${username}`);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch user profile');
  }
};

export const searchUsers = async (query: string): Promise<UserProfile[]> => {
  try {
    return await fetchWithAuth(`/users/search?query=${encodeURIComponent(query)}`);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to search users');
  }
};

export const checkFollowStatus = async (username: string): Promise<boolean> => {
  try {
    return await fetchWithAuth(`/users/profile/${username}/follow-status`);
  } catch (error) {
    console.error('Follow status check error:', error);
    return false;
  }
};

export const getFollowersCount = async (userId: string): Promise<number> => {
  const token = await SecureStore.getItemAsync("jwt");
  if (!token) return 0;

  try {
    const response = await fetch(`${BASE_URL}/users/follow/${userId}/followers/count`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) return 0;
    return await response.json();
  } catch (error) {
    console.error('Error fetching followers count:', error);
    return 0;
  }
};

export const getFollowingCount = async (userId: string): Promise<number> => {
  const token = await SecureStore.getItemAsync("jwt");
  if (!token) return 0;

  try {
    const response = await fetch(`${BASE_URL}/users/follow/${userId}/following/count`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) return 0;
    return await response.json();
  } catch (error) {
    console.error('Error fetching following count:', error);
    return 0;
  }
};
