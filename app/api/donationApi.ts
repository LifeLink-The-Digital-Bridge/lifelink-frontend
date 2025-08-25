import * as SecureStore from 'expo-secure-store';

export type DonationType = 'BLOOD' | 'ORGAN' | 'TISSUE' | 'STEM_CELL';
export type BloodType = 'A_POSITIVE' | 'A_NEGATIVE' | 'B_POSITIVE'| 'B_NEGATIVE'|'O_POSITIVE'| 'O_NEGATIVE'|
    'AB_POSITIVE'| 'AB_NEGATIVE';
export type OrganType = 'HEART' | 'LIVER' | 'KIDNEY' | 'LUNG' | 'PANCREAS' | 'INTESTINE';
export type TissueType =
  | 'BONE' | 'SKIN' | 'CORNEA' | 'VEIN' | 'TENDON' | 'LIGAMENT';
export type StemCellType =
  | 'PERIPHERAL_BLOOD' | 'BONE_MARROW' | 'CORD_BLOOD';
  
export interface DonationRequest {
  donorId: string;
  donationType: DonationType;
  donationDate: string;
  quantity?: number;
  status: string;
  locationId: number;
  bloodType?: BloodType;
  organType?: OrganType;
  isCompatible?: boolean;
  tissueType?: string;
  stemCellType?: string;
}

import Constants from 'expo-constants';
const BASE_URL = Constants.expoConfig?.extra?.API_URL;

export async function registerDonation(payload : DonationRequest) {
  const token = await SecureStore.getItemAsync('jwt');
  const userId = await SecureStore.getItemAsync('userId');
  const response = await fetch(`${BASE_URL}/donors/donate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'id': userId || '',
      'Content-Type': 'application/json'
    },    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(await response.text());
  return await response.json();
}
