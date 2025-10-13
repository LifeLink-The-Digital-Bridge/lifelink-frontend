import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

const BASE_URL = Constants.expoConfig?.extra?.API_URL;

export type UserDTO = {
  id: string;
  name: string;
  username: string;
  email: string;
  phone?: string;
  dob?: string;
  gender?: string;
  profileImageUrl?: string;
  roles?: string[];
  profileVisibility?: string;
  bloodGroup?: string;
  lastDonation?: string;
  location?: string;
  donations?: number;
  followers?: number;
  following?: number;
  score?: number;
  reviews?: number;
};

export interface UpdateProfileRequest {
  name: string;
  phone: string;
  dob: string;
  gender: string;
  profileImageUrl: string;
  profileVisibility: string;
}

export const fetchUserProfile = async (
  username: string,
  token: string
): Promise<UserDTO> => {
  const response = await fetch(
    `${BASE_URL}/users/profile/${encodeURIComponent(username)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        id: (await SecureStore.getItemAsync("userId")) || "",
      },
    }
  );
  if (!response.ok) throw new Error("User not found");
  return await response.json();
};

export const fetchIsFollowing = async (
  profileId: string,
  token: string
): Promise<boolean> => {
  try {
    const userId = await SecureStore.getItemAsync("userId");
    const response = await fetch(
      `${BASE_URL}/users/follow/${userId}/following`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!response.ok) return false;
    const followingList: UserDTO[] = await response.json();
    return followingList.some((u) => u.id === profileId);
  } catch {
    return false;
  }
};

export const updateUserProfile = async (
  userId: string,
  payload: UpdateProfileRequest
): Promise<UserDTO> => {
  const token = await SecureStore.getItemAsync("jwt");
  if (!token) throw new Error("No token found");

  const response = await fetch(`${BASE_URL}/users/update/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text().catch(() => "Failed to update profile");
    throw new Error(error);
  }
  return await response.json();
};
