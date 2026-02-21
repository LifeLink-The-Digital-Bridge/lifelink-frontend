import * as SecureStore from "expo-secure-store";
import {
    NearbyDonationActivityDTO,
    NearbyRequestActivityDTO,
} from "./nearbyTypes";
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const getNearbyDonations = async (
  latitude: number,
  longitude: number,
  radius: number = 10000,
): Promise<NearbyDonationActivityDTO[]> => {
  const token = await SecureStore.getItemAsync("jwt");
  const userId = await SecureStore.getItemAsync("userId");

  if (!token || !userId) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(
    `${BASE_URL}/donors/nearby?latitude=${latitude}&longitude=${longitude}&radius=${radius}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        id: userId,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("403");
    }
    const errorText = await response.text();
    console.error("Nearby donations API error:", {
      status: response.status,
      statusText: response.statusText,
      body: errorText,
    });
    throw new Error(
      `Failed to fetch nearby donations: ${response.status} ${response.statusText}`,
    );
  }

  return await response.json();
};

export const getNearbyRequests = async (
  latitude: number,
  longitude: number,
  radius: number = 10000,
): Promise<NearbyRequestActivityDTO[]> => {
  const token = await SecureStore.getItemAsync("jwt");
  const userId = await SecureStore.getItemAsync("userId");

  if (!token || !userId) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(
    `${BASE_URL}/recipients/nearby?latitude=${latitude}&longitude=${longitude}&radius=${radius}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        id: userId,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("403");
    }
    const errorText = await response.text();
    console.error("Nearby requests API error:", {
      status: response.status,
      statusText: response.statusText,
      body: errorText,
    });
    throw new Error(
      `Failed to fetch nearby requests: ${response.status} ${response.statusText}`,
    );
  }

  return await response.json();
};
