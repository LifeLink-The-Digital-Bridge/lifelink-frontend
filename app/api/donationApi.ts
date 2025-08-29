import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig?.extra?.API_URL;

export type DonationType = 'BLOOD' | 'ORGAN' | 'TISSUE' | 'STEM_CELL';
export type BloodType = 'A_POSITIVE' | 'A_NEGATIVE' | 'B_POSITIVE' | 'B_NEGATIVE' | 'O_POSITIVE' | 'O_NEGATIVE' | 'AB_POSITIVE' | 'AB_NEGATIVE';
export type OrganType = 'HEART' | 'LIVER' | 'KIDNEY' | 'LUNG' | 'PANCREAS' | 'INTESTINE';
export type TissueType = 'BONE' | 'SKIN' | 'CORNEA' | 'VEIN' | 'TENDON' | 'LIGAMENT';
export type StemCellType = 'PERIPHERAL_BLOOD' | 'BONE_MARROW' | 'CORD_BLOOD';

export interface DonationRequest {
  donorId: string;
  donationType: DonationType;
  donationDate: string;
  locationId: string;
  bloodType: BloodType;
  quantity?: number;
  
  // Organ-specific fields
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
  
  // Tissue-specific fields
  tissueType?: TissueType;
  
  // Stem cell-specific fields
  stemCellType?: StemCellType;
}

// ADD THIS MISSING EXPORT
export async function registerDonation(payload: DonationRequest) {
  const token = await SecureStore.getItemAsync('jwt');
  const userId = await SecureStore.getItemAsync('userId');
  
  const response = await fetch(`${BASE_URL}/donors/donate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'id': userId || '',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to register donation');
  }
  
  return await response.json();
}

export const fetchDonationsByDonorId = async (donorId: string): Promise<any> => {
  const token = await SecureStore.getItemAsync("jwt");
  if (!token) return null;

  const response = await fetch(`${BASE_URL}/donors/${donorId}/donations`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return [];
    }
    throw new Error("Failed to fetch donations");
  }
  return await response.json();
};
