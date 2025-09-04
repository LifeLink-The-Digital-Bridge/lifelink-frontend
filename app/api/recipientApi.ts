import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

const BASE_URL = Constants.expoConfig?.extra?.API_URL;

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
  landmark: string;
  area: string;
  city: string;
  district: string;
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
  medicalDetails: MedicalDetails;
  eligibilityCriteria: EligibilityCriteria;
  consentForm: ConsentForm;
  hlaProfile?: HlaProfile;
}


export interface ConsentForm {
  isConsented: boolean;
  consentedAt: string;
}


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
  id?: string;
  recipientId: string;
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
  
  console.log('Sending payload:', JSON.stringify(payload, null, 2));
  
  const response = await fetch(`${BASE_URL}/recipients/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      id: userId,
    },
    body: JSON.stringify(payload),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Registration error:', response.status, errorText);
    throw new Error(errorText || `Registration failed with status ${response.status}`);
  }
  
  return await response.json();
};

export const createReceiveRequest = async (
  payload: CreateReceiveRequestDTO
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
