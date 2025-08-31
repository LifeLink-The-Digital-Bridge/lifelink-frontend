import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

const BASE_URL = Constants.expoConfig?.extra?.API_URL;

// api/recipientApi.ts (Updated)
export interface MedicalDetails {
  hemoglobinLevel?: number;
  bloodPressure?: string;
  diagnosis: string;
  allergies?: string;
  currentMedications?: string;
  additionalNotes?: string;
  hasInfectiousDiseases?: boolean;
  infectiousDiseaseDetails?: string;
  creatinineLevel?: number;
  liverFunctionTests?: string;
  cardiacStatus?: string;
  pulmonaryFunction?: number;
  overallHealthStatus?: string;
}

export interface EligibilityCriteria {
  ageEligible?: boolean;
  age?: number;
  dob?: string;
  weightEligible?: boolean;
  weight?: number;
  medicallyEligible: boolean;
  legalClearance: boolean;
  notes?: string;
  lastReviewed: string;
  height?: number;
  bodyMassIndex?: number;
  bodySize?: string;
  isLivingDonor?: boolean;
}

export interface HlaProfile {
  hlaA1?: string;
  hlaA2?: string;
  hlaB1?: string;
  hlaB2?: string;
  hlaC1?: string;
  hlaC2?: string;
  hlaDR1?: string;
  hlaDR2?: string;
  hlaDQ1?: string;
  hlaDQ2?: string;
  hlaDP1?: string;
  hlaDP2?: string;
  testingDate?: string;
  testingMethod?: string;
  laboratoryName?: string;
  certificationNumber?: string;
  hlaString?: string;
  isHighResolution?: boolean;
}
export interface Address {
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

export interface RecipientDTO {
  id: string;
  userId: string;
  availability: string;
  addresses: Address[];
  eligibilityCriteria: EligibilityCriteria;
  consentForm: ConsentForm;
  hlaProfile?: HlaProfile;
}

export interface RegisterRecipientDTO {
  availability: string;
  addresses: Address[];
  eligibilityCriteria: EligibilityCriteria;
  consentForm: ConsentForm;
  hlaProfile?: HlaProfile;
}


export interface ConsentForm {
  userId: string;
  isConsented: boolean;
  consentedAt: string;
}


export interface ReceiveRequestDTO {
  bloodType: string;
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
