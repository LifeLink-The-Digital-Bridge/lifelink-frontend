import * as SecureStore from "expo-secure-store";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export type DonationType = "BLOOD" | "ORGAN" | "TISSUE" | "STEM_CELL";
export type BloodType =
  | "A_POSITIVE"
  | "A_NEGATIVE"
  | "B_POSITIVE"
  | "B_NEGATIVE"
  | "O_POSITIVE"
  | "O_NEGATIVE"
  | "AB_POSITIVE"
  | "AB_NEGATIVE";
export type OrganType =
  | "HEART"
  | "LIVER"
  | "KIDNEY"
  | "LUNG"
  | "PANCREAS"
  | "INTESTINE";
export type TissueType =
  | "BONE"
  | "SKIN"
  | "CORNEA"
  | "VEIN"
  | "TENDON"
  | "LIGAMENT";
export type StemCellType = "PERIPHERAL_BLOOD" | "BONE_MARROW" | "CORD_BLOOD";

export interface DonationRequest {
  donorId: string;
  donationType: DonationType;
  donationDate: string;
  locationId: string;
  bloodType: BloodType;
  quantity?: number;

  organType?: OrganType;
  isCompatible?: boolean;
  organQuality?: string;
  organViabilityExpiry?: string;
  coldIschemiaTime?: number;
  organPerfused?: boolean;
  organWeight?: number;
  organSize?: string;
  functionalAssessment?: string;
  hasAbnormalities?: boolean;
  abnormalityDescription?: string;

  tissueType?: TissueType;

  stemCellType?: StemCellType;
}

export interface CancellationRequestDTO {
  reason: string;
  additionalNotes?: string;
}

export interface CancellationResponseDTO {
  success: boolean;
  message: string;
  donationId: string;
  cancelledAt: string;
  cancellationReason: string;
  expiredMatchesCount: number;
  profileUnlocked: boolean;
}

export async function registerDonation(payload: DonationRequest) {
  const token = await SecureStore.getItemAsync("jwt");
  const userId = await SecureStore.getItemAsync("userId");

  const response = await fetch(`${BASE_URL}/donors/donate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      id: userId || "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to register donation");
  }

  return await response.json();
}

export const getMyDonations = async (): Promise<any[]> => {
  const token = await SecureStore.getItemAsync("jwt");
  const userId = await SecureStore.getItemAsync("userId");
  if (!token || !userId) return [];

  const response = await fetch(`${BASE_URL}/donors/my-donations`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      id: userId,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return [];
    }
    throw new Error("Failed to fetch my donations");
  }

  return await response.json();
};

export const fetchDonationsByUserId = async (
  userId: string,
): Promise<any[]> => {
  try {
    const jwt = await SecureStore.getItemAsync("jwt");
    const currentUserId = await SecureStore.getItemAsync("userId");

    const response = await fetch(
      `${BASE_URL}/donors/by-userId/${userId}/donations`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
          id: currentUserId || "",
        },
      },
    );

    if (response.status === 403) {
      const error = await response.json();
      console.log("Access denied to donations:", error);
      return [];
    }

    if (!response.ok) {
      throw new Error("Failed to fetch donations by user ID");
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error loading donations:", error);
    return [];
  }
};

export const fetchDonationsByDonorId = async (
  donorId: string,
): Promise<any[]> => {
  const token = await SecureStore.getItemAsync("jwt");
  const userId = await SecureStore.getItemAsync("userId");
  if (!token || !userId) return [];

  const response = await fetch(`${BASE_URL}/donors/${donorId}/donations`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      id: userId,
    },
  });

  if (!response.ok) {
    if (response.status === 404 || response.status === 403) {
      return [];
    }
    throw new Error("Failed to fetch donations");
  }
  return await response.json();
};

export async function fetchDonorAddresses(donorId: string): Promise<any[]> {
  const token = await SecureStore.getItemAsync("jwt");
  const userId = await SecureStore.getItemAsync("userId");

  if (!token || !donorId) {
    throw new Error("Missing authentication or donor ID");
  }

  const response = await fetch(`${BASE_URL}/donors/${donorId}/addresses`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      id: userId || "",
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return [];
    }
    const errorText = await response.text();
    throw new Error(`Failed to fetch addresses: ${errorText}`);
  }

  return await response.json();
}

export async function addDonorAddress(
  donorId: string,
  locationData: any,
): Promise<any> {
  const token = await SecureStore.getItemAsync("jwt");
  const userId = await SecureStore.getItemAsync("userId");

  const response = await fetch(`${BASE_URL}/donors/${donorId}/addresses`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      id: userId || "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(locationData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to add address: ${errorText}`);
  }

  return await response.json();
}
export const cancelDonation = async (
  donationId: string,
  cancellationData: CancellationRequestDTO,
): Promise<CancellationResponseDTO> => {
  const token = await SecureStore.getItemAsync("jwt");
  const userId = await SecureStore.getItemAsync("userId");
  if (!token || !userId) throw new Error("Not authenticated");

  console.log("Cancelling donation:", donationId, cancellationData);

  const response = await fetch(
    `${BASE_URL}/donors/donations/${donationId}/cancel`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        id: userId,
      },
      body: JSON.stringify(cancellationData),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Cancel donation error:", response.status, errorText);
    throw new Error(errorText || "Failed to cancel donation");
  }

  return await response.json();
};

export const canCancelDonation = async (
  donationId: string,
): Promise<boolean> => {
  const token = await SecureStore.getItemAsync("jwt");
  const userId = await SecureStore.getItemAsync("userId");
  if (!token || !userId) throw new Error("Not authenticated");

  const response = await fetch(
    `${BASE_URL}/donors/donations/${donationId}/can-cancel`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        id: userId,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to check cancellation status");
  }

  const data = await response.json();
  return data.canCancel;
};

export const getDonationStatus = async (
  donationId: string,
): Promise<string> => {
  const token = await SecureStore.getItemAsync("jwt");
  const userId = await SecureStore.getItemAsync("userId");
  if (!token || !userId) throw new Error("Not authenticated");

  const response = await fetch(
    `${BASE_URL}/donors/donations/${donationId}/status`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        id: userId,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to get donation status");
  }

  return await response.text();
};
