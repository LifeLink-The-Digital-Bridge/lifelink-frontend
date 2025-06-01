import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

const BASE_URL = Constants.expoConfig?.extra?.API_URL;

export const addDonorRole = async (): Promise<string> => {
  const token = await SecureStore.getItemAsync("jwt");
  const userId = await SecureStore.getItemAsync("userId");
  if (!token || !userId) throw new Error("Not authenticated");
  const response = await fetch(`${BASE_URL}/donors/addRole`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      id: userId,
    },
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to add donor role");
  }
  return await response.text();
};

export const addRecipientRole = async (): Promise<string> => {
  const token = await SecureStore.getItemAsync("jwt");
  const userId = await SecureStore.getItemAsync("userId");
  if (!token || !userId) throw new Error("Not authenticated");
  const response = await fetch(`${BASE_URL}/recipients/addRole`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      id: userId,
    },
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to add recipient role");
  }
  return await response.text();
};

export const refreshAuthTokens = async () => {
  const refreshToken = await SecureStore.getItemAsync("refreshToken");
  if (!refreshToken) throw new Error("No refresh token found");
  const response = await fetch(
    `${BASE_URL}/auth/refresh?refreshToken=${refreshToken}`,
    {
      method: "POST",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to refresh tokens");
  }
  return await response.json();
};
