import * as SecureStore from 'expo-secure-store';
export type Donation = {
  donationType: string;
  donationDate: string;
  quantity?: number;
  status: string;
  locationId: number;
  bloodType?: string;
  organType?: string;
  tissueType?: string;
  stemCellType?: string;
};

import Constants from 'expo-constants';
const BASE_URL = Constants.expoConfig?.extra?.API_URL;

export async function fetchDonationsByDonorId(donorId: string): Promise<Donation[]> {
  const token = await SecureStore.getItemAsync('jwt');
  const response = await fetch(`${BASE_URL}/donors/${donorId}/donations`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  console.log('In fetchDonationsByDonorId:', donorId);
  console.log('Response:', response);
  if (!response.ok) throw new Error(await response.text());
  return await response.json();
}

