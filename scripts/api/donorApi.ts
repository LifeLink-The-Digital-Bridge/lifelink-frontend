import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

const BASE_URL = Constants.expoConfig?.extra?.API_URL;

export interface MedicalDetailsDTO {
  hemoglobinLevel: number;
  bloodPressure: string;
  hasDiseases: boolean;
  takingMedication: boolean;
  diseaseDescription: string;
}

export interface EligibilityCriteriaDTO {
  ageEligible: boolean;
  weightEligible: boolean;
  medicalClearance: boolean;
  recentTattooOrPiercing: boolean;
  recentTravel: boolean;
}

export interface ConsentFormDTO {
  isConsented: boolean;
}

export interface RegisterDonorRequest {
  registrationDate: string;
  status: string;
  medicalDetails: MedicalDetailsDTO;
  eligibilityCriteria: EligibilityCriteriaDTO;
  consentForm: ConsentFormDTO;
}

export const registerDonor = async (payload: RegisterDonorRequest) => {
  const token = await SecureStore.getItemAsync("jwt");
  const userId = await SecureStore.getItemAsync("userId");
  const response = await fetch(`${BASE_URL}/donors/register`, {
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
    } catch {}
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
  if (!token) return null;

  const response = await fetch(`${BASE_URL}/donors/by-userId`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
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
