import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

const BASE_URL = Constants.expoConfig?.extra?.API_URL;

export interface MedicalDetails {
  hemoglobinLevel?: number;
  bloodGlucoseLevel?: number | null;
  hasDiabetes?: boolean;
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
  height?: number;
  bodyMassIndex?: number;
  bodySize?: string;
  medicallyEligible: boolean;
  legalClearance: boolean;
  notes?: string;
  lastReviewed: string;
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
  id?: string;
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
  medicalDetails: MedicalDetails;
  eligibilityCriteria: EligibilityCriteria;
  hlaProfile?: HlaProfile;
}
export interface ConsentForm {
  isConsented: boolean;
  consentedAt: string;
}
export interface RegisterRecipientDTO {
  availability: string;
  addresses: Address[];
  medicalDetails: MedicalDetails;
  eligibilityCriteria: EligibilityCriteria;
  consentForm: ConsentForm;
  hlaProfile?: HlaProfile;
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

export const registerRecipient = async (
  payload: RegisterRecipientDTO
): Promise<RecipientDTO> => {
  const token = await SecureStore.getItemAsync("jwt");
  const userId = await SecureStore.getItemAsync("userId");
  if (!token || !userId) throw new Error("Not authenticated");

  console.log('Sending recipient payload:', JSON.stringify(payload, null, 2));

  const response = await fetch(`${BASE_URL}/recipients/profile`, {
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
    console.error('Recipient registration error:', response.status, errorText);
    throw new Error(errorText || `Registration failed with status ${response.status}`);
  }

  return await response.json();
};

export const updateRecipient = async (
  payload: RegisterRecipientDTO
): Promise<RecipientDTO> => {
  const token = await SecureStore.getItemAsync("jwt");
  const userId = await SecureStore.getItemAsync("userId");
  if (!token || !userId) throw new Error("Not authenticated");

  console.log('Updating recipient payload:', JSON.stringify(payload, null, 2));

  const response = await fetch(`${BASE_URL}/recipients/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      id: userId,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Recipient update error:', response.status, errorText);
    throw new Error(errorText || `Update failed with status ${response.status}`);
  }

  return await response.json();
};

export const createReceiveRequest = async (
  payload: CreateReceiveRequestDTO
): Promise<ReceiveRequestDTO> => {
  const token = await SecureStore.getItemAsync("jwt");
  const userId = await SecureStore.getItemAsync("userId");
  if (!token || !userId) throw new Error("Not authenticated");

  console.log('Creating receive request:', JSON.stringify(payload, null, 2));

  const response = await fetch(`${BASE_URL}/recipients/request`, {
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
    console.error('Create request error:', response.status, errorText);
    throw new Error(errorText || `Failed to create receive request with status ${response.status}`);
  }

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

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Recipient not found");
    }
    throw new Error(`Failed to fetch recipient data with status ${response.status}`);
  }

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

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Recipient not found");
    }
    throw new Error(`Failed to fetch recipient with status ${response.status}`);
  }

  return await response.json();
};

export const getRecipientRequests = async (
  recipientId: string
): Promise<ReceiveRequestDTO[]> => {
  const token = await SecureStore.getItemAsync("jwt");
  const userId = await SecureStore.getItemAsync("userId");
  if (!token || !userId) throw new Error("Not authenticated");

  const response = await fetch(`${BASE_URL}/recipients/${recipientId}/requests`, {
    headers: {
      Authorization: `Bearer ${token}`,
      id: userId,
    },
  });

  if (!response.ok) {
    if (response.status === 403) {
      return [];
    }
    throw new Error(`Failed to get recipient requests with status ${response.status}`);
  }

  return await response.json();
};


export const getMyRequests = async (): Promise<ReceiveRequestDTO[]> => {
  const token = await SecureStore.getItemAsync("jwt");
  const userId = await SecureStore.getItemAsync("userId");
  if (!token || !userId) throw new Error("Not authenticated");

  const response = await fetch(`${BASE_URL}/recipients/my-requests`, {
    headers: {
      Authorization: `Bearer ${token}`,
      id: userId,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get my requests with status ${response.status}`);
  }

  return await response.json();
};

export const fetchRequestsByUserId = async (userId: string): Promise<ReceiveRequestDTO[]> => {
  const token = await SecureStore.getItemAsync("jwt");
  const myUserId = await SecureStore.getItemAsync("userId");
  if (!token || !myUserId) return [];

  const response = await fetch(`${BASE_URL}/recipients/by-userId/${userId}/requests`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      id: myUserId,
    },
  });

  if (!response.ok) {
    if (response.status === 404 || response.status === 403) {
      return [];
    }
    throw new Error("Failed to fetch requests");
  }
  return await response.json();
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
    const errorText = await response.text();
    throw new Error(errorText || `Failed to add recipient role with status ${response.status}`);
  }

  return await response.text();
};

export const updateRequestStatus = async (
  requestId: string,
  status: string
): Promise<void> => {
  const token = await SecureStore.getItemAsync("jwt");
  const userId = await SecureStore.getItemAsync("userId");
  if (!token || !userId) throw new Error("Not authenticated");

  const response = await fetch(`${BASE_URL}/recipients/requests/${requestId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      id: userId,
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update request status with status ${response.status}`);
  }
};

export const getRequestById = async (requestId: string): Promise<ReceiveRequestDTO> => {
  const token = await SecureStore.getItemAsync("jwt");
  const userId = await SecureStore.getItemAsync("userId");
  if (!token || !userId) throw new Error("Not authenticated");

  const response = await fetch(`${BASE_URL}/recipients/requests/${requestId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      id: userId,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Request not found");
    }
    throw new Error(`Failed to fetch request with status ${response.status}`);
  }

  return await response.json();
};



export async function fetchRecipientAddresses(recipientId: string): Promise<any[]> {
  const token = await SecureStore.getItemAsync('jwt');
  const userId = await SecureStore.getItemAsync('userId');

  if (!token || !recipientId) {
    throw new Error('Missing authentication or recipient ID');
  }

  const response = await fetch(`${BASE_URL}/recipients/${recipientId}/addresses`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'id': userId || '',
      'Content-Type': 'application/json'
    }
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

export async function addRecipientAddress(recipientId: string, locationData: any): Promise<any> {
  const token = await SecureStore.getItemAsync('jwt');
  const userId = await SecureStore.getItemAsync('userId');

  const response = await fetch(`${BASE_URL}/recipients/${recipientId}/addresses`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'id': userId || '',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(locationData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to add address: ${errorText}`);
  }

  return await response.json();
}
