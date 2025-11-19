import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

const BASE_URL = Constants.expoConfig?.extra?.API_URL;

export interface MedicalDetailsDTO {
  hemoglobinLevel: number;
  bloodPressure: string;
  bloodGlucoseLevel?: number | null;
  hasDiabetes?: boolean;
  hasDiseases: boolean;
  takingMedication: boolean;
  diseaseDescription: string | null;
  currentMedications: string | null;
  lastMedicalCheckup: string;
  medicalHistory: string;
  hasInfectiousDiseases: boolean;
  infectiousDiseaseDetails: string | null;
  creatinineLevel: number;
  liverFunctionTests: string;
  cardiacStatus: string;
  pulmonaryFunction: number;
  overallHealthStatus: string;
}

export interface EligibilityCriteriaDTO {
  ageEligible: boolean;
  age: number;
  dob: string;
  weightEligible: boolean;
  weight: number;
  medicalClearance: boolean;
  recentTattooOrPiercing: boolean;
  recentTravelDetails: string;
  recentVaccination: boolean;
  recentSurgery: boolean;
  chronicDiseases: string;
  allergies: string;
  lastDonationDate: string | null;
  height: number;
  bodyMassIndex: number;
  bodySize: string;
  isLivingDonor: boolean;
  smokingStatus?: string;
  packYears?: number | null;
  quitSmokingDate?: string | null;
  alcoholStatus?: string;
  drinksPerWeek?: number | null;
  quitAlcoholDate?: string | null;
  alcoholAbstinenceMonths?: number | null;
}

export interface ConsentFormDTO {
  userId: string;
  isConsented: boolean;
  consentedAt: string;
}

export interface AddressDTO {
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

export interface HlaProfileDTO {
  hlaA1: string;
  hlaA2: string;
  hlaB1: string;
  hlaB2: string;
  hlaC1?: string | undefined;
  hlaC2?: string | undefined;
  hlaDR1?: string | undefined;
  hlaDR2?: string | undefined;
  hlaDQ1?: string | undefined;
  hlaDQ2?: string | undefined;
  hlaDP1?: string | undefined;
  hlaDP2?: string | undefined;
  testingDate: string;
  testingMethod: string;
  laboratoryName: string;
  certificationNumber?: string | undefined;
  hlaString: string;
  isHighResolution: boolean;
}

export interface RegisterDonorRequest {
  registrationDate: string;
  status: string;
  medicalDetails: MedicalDetailsDTO;
  eligibilityCriteria: EligibilityCriteriaDTO;
  consentForm: ConsentFormDTO;
  addresses: AddressDTO[];
  hlaProfile?: HlaProfileDTO;
}

export const registerDonor = async (payload: RegisterDonorRequest) => {
  const token = await SecureStore.getItemAsync("jwt");
  const userId = await SecureStore.getItemAsync("userId");
  const response = await fetch(`${BASE_URL}/donors/profile`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      id: userId || "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorMessage = "Failed to register as donor";
    try {
      const errorData = await response.text();
      errorMessage = errorData || errorMessage;
    } catch { }
    throw new Error(errorMessage);
  }

  return response.json();
};

export const fetchDonorData = async (): Promise<any> => {
  const token = await SecureStore.getItemAsync("jwt");
  const donorId = await SecureStore.getItemAsync("donorId");
  if (!token || !donorId) return null;

  const response = await fetch(`${BASE_URL}/donors/${donorId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      await SecureStore.deleteItemAsync("donorData");
      await SecureStore.deleteItemAsync("donorId");
    }
    return null;
  }
  return await response.json();
};

export const fetchDonorByUserId = async (): Promise<any> => {
  const token = await SecureStore.getItemAsync("jwt");
  const userId = await SecureStore.getItemAsync("userId");
  if (!token || !userId) return null;

  const response = await fetch(`${BASE_URL}/donors/by-userId`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      id: userId,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error("Failed to fetch donor by userId");
  }
  return await response.json();
};

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
  if (!response.ok) throw new Error("Failed to add donor role");
  return await response.text();
};
