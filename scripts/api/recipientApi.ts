import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

const BASE_URL = Constants.expoConfig?.extra?.API_URL;

export interface Location {
  addressLine: string;
  landmark?: string;
  area?: string;
  city: string;
  district?: string;
  state: string;
  country: string;
  pincode: string;
  latitude: number;
  longitude: number;
}

export interface MedicalDetails {
  diagnosis: string;
  allergies?: string;
  currentMedications?: string;
  additionalNotes?: string;
}

export interface EligibilityCriteria {
  medicallyEligible: boolean;
  legalClearance: boolean;
  notes?: string;
  lastReviewed: string;
}

export interface ConsentForm {
  userId: string;
  isConsented: boolean;
  consentedAt: string;
}

export interface RecipientDTO {
  id: string;
  userId: string;
  availability: string;
  location: Location;
  medicalDetails: MedicalDetails;
  eligibilityCriteria: EligibilityCriteria;
  consentForm: ConsentForm;
}

export interface ReceiveRequestDTO {
  id?: number;
  recipientId: string;
  requestedBloodType: string;
  requestedOrgan: string;
  urgencyLevel: string;
  quantity: number;
  requestDate: string;
  status: string;
  notes?: string;
}

export interface RegisterRecipientDTO {
  availability: string;
  requiredBloodType: string;
  organNeeded: string;
  urgencyLevel: string;
  location: Location;
  medicalDetails: MedicalDetails;
  eligibilityCriteria: EligibilityCriteria;
  consentForm: ConsentForm;
}

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
  if (!response.ok) throw new Error("Failed to add recipient role");
  return await response.text();
};

export const registerRecipient = async (
  payload: RegisterRecipientDTO
): Promise<RecipientDTO> => {
  const token = await SecureStore.getItemAsync("jwt");
  const userId = await SecureStore.getItemAsync("userId");
  if (!token || !userId) throw new Error("Not authenticated");
  const response = await fetch(`${BASE_URL}/recipients/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      id: userId,
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Failed to register recipient");
  return await response.json();
};

export const createReceiveRequest = async (
  payload: Omit<ReceiveRequestDTO, "id" | "recipientId">
): Promise<ReceiveRequestDTO> => {
  const token = await SecureStore.getItemAsync("jwt");
  const userId = await SecureStore.getItemAsync("userId");
  if (!token || !userId) throw new Error("Not authenticated");
  const response = await fetch(`${BASE_URL}/recipients/request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      id: userId,
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Failed to create receive request");
  return await response.json();
};

export const getRecipientByUserId = async (): Promise<RecipientDTO> => {
  const token = await SecureStore.getItemAsync("jwt");
  const userId = await SecureStore.getItemAsync("userId");
  if (!token || !userId) throw new Error("Not authenticated");
  const response = await fetch(`${BASE_URL}/recipients/by-userId`, {
    headers: {
      Authorization: `Bearer ${token}`,
      id: userId,
    },
  });
  if (!response.ok) throw new Error("Recipient not found");
  return await response.json();
};

export const getRecipientById = async (id: string): Promise<RecipientDTO> => {
  const token = await SecureStore.getItemAsync("jwt");
  if (!token) throw new Error("Not authenticated");
  const response = await fetch(`${BASE_URL}/recipients/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Recipient not found");
  return await response.json();
};

export const getRecipientRequests = async (
  recipientId: string
): Promise<ReceiveRequestDTO[]> => {
  const token = await SecureStore.getItemAsync("jwt");
  if (!token) throw new Error("Not authenticated");
  const response = await fetch(`${BASE_URL}/recipients/${recipientId}/requests`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to get recipient requests");
  return await response.json();
};
