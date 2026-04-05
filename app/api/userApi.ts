import * as SecureStore from "expo-secure-store";
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = await SecureStore.getItemAsync("jwt");
  const userId = await SecureStore.getItemAsync("userId");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(userId && { id: userId }),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Request failed" }));
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
  profileVisibility: "PUBLIC" | "PRIVATE" | "FOLLOWERS_ONLY";
  followersCount?: number;
  followingCount?: number;
  doctorDetails?: {
    medicalRegistrationNumber?: string;
    specialization?: string;
    qualification?: string;
    hospitalName?: string;
    clinicAddress?: string;
    yearsOfExperience?: number;
    consultationFee?: number;
    latitude?: number;
    longitude?: number;
  } | null;
  ngoDetails?: {
    organizationName?: string;
    registrationNumber?: string;
    registrationYear?: number;
    organizationType?: string;
    serviceAreas?: string;
    headOfficeAddress?: string;
    website?: string;
    totalVolunteers?: number;
    latitude?: number;
    longitude?: number;
  } | null;
  migrantDetails?: {
    aadhaarHash?: string;
    latitude?: number;
    longitude?: number;
  } | null;
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
  profileVisibility: "PUBLIC" | "PRIVATE" | "FOLLOWERS_ONLY";
  followersCount?: number;
  followingCount?: number;
  doctorDetails?: {
    medicalRegistrationNumber?: string;
    specialization?: string;
    qualification?: string;
    hospitalName?: string;
    clinicAddress?: string;
    yearsOfExperience?: number;
    consultationFee?: number;
    latitude?: number;
    longitude?: number;
  } | null;
  ngoDetails?: {
    organizationName?: string;
    registrationNumber?: string;
    registrationYear?: number;
    organizationType?: string;
    serviceAreas?: string;
    headOfficeAddress?: string;
    website?: string;
    totalVolunteers?: number;
    latitude?: number;
    longitude?: number;
  } | null;
  migrantDetails?: {
    aadhaarHash?: string;
    latitude?: number;
    longitude?: number;
  } | null;
}

export interface NearbyUser {
  id: string;
  name: string;
  username: string;
  role: "DOCTOR" | "MIGRANT" | "NGO" | string;
  roles: string[];
  latitude: number;
  longitude: number;
  distanceKm: number;
  profileImageUrl?: string | null;
  detail?: string | null;
}

export const getUserProfile = async (
  username: string,
): Promise<UserProfile> => {
  try {
    return await fetchWithAuth(`/users/profile/${username}`);
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch user profile");
  }
};

export const searchUsers = async (query: string): Promise<UserProfile[]> => {
  try {
    return await fetchWithAuth(
      `/users/search?query=${encodeURIComponent(query)}`,
    );
  } catch (error: any) {
    throw new Error(error.message || "Failed to search users");
  }
};

export const searchDoctors = async (): Promise<UserProfile[]> => {
  try {
    return await fetchWithAuth(`/users/doctors/search`);
  } catch (error: any) {
    throw new Error(error.message || "Failed to search doctors");
  }
};

export const searchNgos = async (): Promise<UserProfile[]> => {
  try {
    return await fetchWithAuth(`/users/ngos/search`);
  } catch (error: any) {
    throw new Error(error.message || "Failed to search NGOs");
  }
};

export const getNearbyUsers = async (
  latitude: number,
  longitude: number,
  radiusKm: number = 10,
  roles: string[] = ["DOCTOR", "MIGRANT", "NGO"],
): Promise<NearbyUser[]> => {
  try {
    const roleQuery = roles.map((role) => `roles=${encodeURIComponent(role)}`).join("&");
    return await fetchWithAuth(
      `/users/nearby?latitude=${latitude}&longitude=${longitude}&radiusKm=${radiusKm}${roleQuery ? `&${roleQuery}` : ""}`,
    );
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch nearby users");
  }
};

export const checkFollowStatus = async (username: string): Promise<boolean> => {
  try {
    return await fetchWithAuth(`/users/profile/${username}/follow-status`);
  } catch (error) {
    console.error("Follow status check error:", error);
    return false;
  }
};

export const getFollowersCount = async (userId: string): Promise<number> => {
  const token = await SecureStore.getItemAsync("jwt");
  if (!token) return 0;

  try {
    const response = await fetch(
      `${BASE_URL}/users/follow/${userId}/followers/count`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) return 0;
    return await response.json();
  } catch (error) {
    console.error("Error fetching followers count:", error);
    return 0;
  }
};

export const getFollowingCount = async (userId: string): Promise<number> => {
  const token = await SecureStore.getItemAsync("jwt");
  if (!token) return 0;

  try {
    const response = await fetch(
      `${BASE_URL}/users/follow/${userId}/following/count`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) return 0;
    return await response.json();
  } catch (error) {
    console.error("Error fetching following count:", error);
    return 0;
  }
};
export const getFollowers = async (userId: string): Promise<UserProfile[]> => {
  try {
    return await fetchWithAuth(`/users/follow/${userId}/followers`);
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch followers");
  }
};

export const getFollowing = async (userId: string): Promise<UserProfile[]> => {
  try {
    return await fetchWithAuth(`/users/follow/${userId}/following`);
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch following");
  }
};

export const getUsersByIds = async (userIds: string[]): Promise<UserProfile[]> => {
  try {
    return await fetchWithAuth(`/users/batch`, {
      method: "POST",
      body: JSON.stringify(userIds),
    });
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch users implicitly");
  }
};
