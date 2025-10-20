import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

const BASE_URL = Constants.expoConfig?.extra?.API_URL;

export type RequestType = 'BLOOD' | 'ORGAN' | 'TISSUE' | 'STEM_CELL';
export type BloodType = 'A_POSITIVE' | 'A_NEGATIVE' | 'B_POSITIVE' | 'B_NEGATIVE' | 'O_POSITIVE' | 'O_NEGATIVE' | 'AB_POSITIVE' | 'AB_NEGATIVE';
export type OrganType = 'HEART' | 'LIVER' | 'KIDNEY' | 'LUNG' | 'PANCREAS' | 'INTESTINE';
export type TissueType = 'BONE' | 'SKIN' | 'CORNEA' | 'VEIN' | 'TENDON' | 'LIGAMENT';
export type StemCellType = 'PERIPHERAL_BLOOD' | 'BONE_MARROW' | 'CORD_BLOOD';
export type UrgencyLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface CreateReceiveRequestDTO {
  recipientId: string;
  locationId: string;
  requestType: RequestType;
  requestedBloodType?: BloodType;
  requestedOrgan?: OrganType;
  requestedTissue?: TissueType;
  requestedStemCellType?: StemCellType;
  urgencyLevel: UrgencyLevel;
  quantity: number;
  requestDate: string;
  notes?: string;
}

export interface ReceiveRequestDTO {
  id: string;
  recipientId: string;
  locationId?: string;
  requestType: RequestType;
  requestedBloodType?: BloodType;
  requestedOrgan?: OrganType;
  requestedTissue?: TissueType;
  requestedStemCellType?: StemCellType;
  urgencyLevel: UrgencyLevel;
  quantity: number;
  requestDate: string;
  status: string;
  notes?: string;
}

export interface CancellationRequestDTO {
  reason: string;
  additionalNotes?: string;
}

export interface CancellationResponseDTO {
  success: boolean;
  message: string;
  requestId: string;
  cancelledAt: string;
  cancellationReason: string;
  expiredMatchesCount: number;
  profileUnlocked: boolean;
}

const getAuthHeaders = async () => {
  const token = await SecureStore.getItemAsync("jwt");
  const userId = await SecureStore.getItemAsync("userId");
  if (!token || !userId) throw new Error("Not authenticated");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    id: userId,
  };
};

export const createReceiveRequest = async (
  payload: CreateReceiveRequestDTO
): Promise<ReceiveRequestDTO> => {
  const headers = await getAuthHeaders();

  console.log("Creating receive request:", JSON.stringify(payload, null, 2));

  const response = await fetch(`${BASE_URL}/recipients/request`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Create request error:", response.status, errorText);
    throw new Error(
      errorText ||
        `Failed to create receive request with status ${response.status}`
    );
  }

  return await response.json();
};

export const getMyRequests = async (): Promise<ReceiveRequestDTO[]> => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${BASE_URL}/recipients/my-requests`, {
    headers,
  });

  if (!response.ok) {
    throw new Error(
      `Failed to get my requests with status ${response.status}`
    );
  }

  return await response.json();
};

export const fetchRequestsByUserId = async (
  userId: string
): Promise<ReceiveRequestDTO[]> => {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${BASE_URL}/recipients/by-userId/${userId}/requests`,
    {
      method: "GET",
      headers,
    }
  );

  if (!response.ok) {
    if (response.status === 404 || response.status === 403) {
      return [];
    }
    throw new Error("Failed to fetch requests");
  }
  return await response.json();
};

export const getRequestById = async (
  requestId: string
): Promise<ReceiveRequestDTO> => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${BASE_URL}/recipients/requests/${requestId}`, {
    headers,
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Request not found");
    }
    throw new Error(
      `Failed to fetch request with status ${response.status}`
    );
  }

  return await response.json();
};

export const getRecipientRequests = async (
  recipientId: string
): Promise<ReceiveRequestDTO[]> => {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${BASE_URL}/recipients/${recipientId}/requests`,
    {
      headers,
    }
  );

  if (!response.ok) {
    if (response.status === 403) {
      return [];
    }
    throw new Error(
      `Failed to get recipient requests with status ${response.status}`
    );
  }

  return await response.json();
};

export const cancelRequest = async (
  requestId: string,
  cancellationData: CancellationRequestDTO
): Promise<CancellationResponseDTO> => {
  const headers = await getAuthHeaders();

  console.log("Cancelling request:", requestId, cancellationData);

  const response = await fetch(
    `${BASE_URL}/recipients/requests/${requestId}/cancel`,
    {
      method: "POST",
      headers,
      body: JSON.stringify(cancellationData),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Cancel request error:", response.status, errorText);
    throw new Error(errorText || "Failed to cancel request");
  }

  return await response.json();
};

export const canCancelRequest = async (
  requestId: string
): Promise<boolean> => {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${BASE_URL}/recipients/requests/${requestId}/can-cancel`,
    {
      headers,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to check cancellation status");
  }

  const data = await response.json();
  return data.canCancel;
};

export const getRequestStatus = async (requestId: string): Promise<string> => {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${BASE_URL}/recipients/requests/${requestId}/status`,
    {
      headers,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to get request status");
  }

  return await response.text();
};

export async function fetchRecipientAddresses(
  recipientId: string
): Promise<any[]> {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${BASE_URL}/recipients/${recipientId}/addresses`,
    {
      method: "GET",
      headers,
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      return [];
    }
    const errorText = await response.text();
    throw new Error(`Failed to fetch addresses: ${errorText}`);
  }

  return await response.json();
}

export async function addRecipientAddress(
  recipientId: string,
  locationData: any
): Promise<any> {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${BASE_URL}/recipients/${recipientId}/addresses`,
    {
      method: "POST",
      headers,
      body: JSON.stringify(locationData),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to add address: ${errorText}`);
  }

  return await response.json();
}
