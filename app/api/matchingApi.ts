import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig?.extra?.API_URL;
const DONOR_SERVICE_URL = `${BASE_URL}`;
const RECIPIENT_SERVICE_URL = `${BASE_URL}`;

export interface ManualMatchRequest {
  donationId: string;
  receiveRequestId: string;
  donorLocationId: string;
  recipientLocationId: string;
}

export interface ManualMatchResponse {
  success: boolean;
  message: string;
  matchResultId?: string;
  matchDetails?: {
    donationId: string;
    receiveRequestId: string;
    donorUserId: string;
    recipientUserId: string;
    donationType: string;
    requestType: string;
    bloodType: string;
    matchType: string;
  };
}

export interface MatchResponse {
  matchResultId: string;
  donationId: string;
  receiveRequestId: string;
  donorUserId: string;
  recipientUserId: string;
  donationType?: string;
  requestType?: string;
  bloodType?: string;
  matchType: string;
  isConfirmed: boolean;
  donorConfirmed: boolean;
  recipientConfirmed: boolean;
  donorConfirmedAt?: string;
  recipientConfirmedAt?: string;
  matchedAt: string;
  distance?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  profileImageUrl?: string;
  phone?: string;
  gender?: string;
}

const getAuthHeaders = async (includeUserId: boolean = true) => {
  const token = await SecureStore.getItemAsync('jwt');
  const userId = await SecureStore.getItemAsync('userId');
  
  if (!token) throw new Error('Not authenticated');
  
  const headers: Record<string, string> = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
  
  if (includeUserId && userId) {
    headers['id'] = userId;
  }
  
  return headers;
};

const handleResponse = async (response: Response, errorMessage: string) => {
  if (!response.ok) {
    let errorText: string;
    try {
      errorText = await response.text();
    } catch {
      errorText = errorMessage;
    }
    
    switch (response.status) {
      case 401:
        throw new Error('Authentication required. Please login again.');
      case 403:
        throw new Error(errorText || 'Access denied');
      case 404:
        throw new Error(errorText || 'Resource not found');
      case 500:
        throw new Error('Server error. Please try again later.');
      default:
        throw new Error(errorText || `${errorMessage} (Status: ${response.status})`);
    }
  }
  return response;
};

export const manualMatch = async (payload: ManualMatchRequest): Promise<ManualMatchResponse> => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${BASE_URL}/matching/manual-match`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  await handleResponse(response, 'Failed to create manual match');
  return await response.json();
};

export const getMyMatchesAsDonor = async (): Promise<MatchResponse[]> => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${BASE_URL}/matching/my-matches/as-donor`, {
    method: 'GET',
    headers,
  });

  if (response.status === 403) {
    throw new Error('NOT_REGISTERED_AS_DONOR');
  }
  
  await handleResponse(response, 'Failed to fetch donor matches');
  return await response.json();
};

export const getMyMatchesAsRecipient = async (): Promise<MatchResponse[]> => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${BASE_URL}/matching/my-matches/as-recipient`, {
    method: 'GET',
    headers,
  });

  if (response.status === 403) {
    throw new Error('NOT_REGISTERED_AS_RECIPIENT');
  }
  
  await handleResponse(response, 'Failed to fetch recipient matches');
  return await response.json();
};

export const getActiveMatches = async (): Promise<MatchResponse[]> => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${BASE_URL}/matching/my-matches/active`, {
    method: 'GET',
    headers,
  });

  await handleResponse(response, 'Failed to fetch active matches');
  return await response.json();
};

export const getPendingMatches = async (): Promise<MatchResponse[]> => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${BASE_URL}/matching/my-matches/pending`, {
    method: 'GET',
    headers,
  });

  await handleResponse(response, 'Failed to fetch pending matches');
  return await response.json();
};

export const getConfirmedMatches = async (): Promise<MatchResponse[]> => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${BASE_URL}/matching/my-matches/confirmed`, {
    method: 'GET',
    headers,
  });

  await handleResponse(response, 'Failed to fetch confirmed matches');
  return await response.json();
};

export const donorConfirmMatch = async (matchId: string): Promise<string> => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${BASE_URL}/matching/donor/confirm/${matchId}`, {
    method: 'POST',
    headers,
  });

  await handleResponse(response, 'Failed to confirm match as donor');
  return await response.text();
};

export const recipientConfirmMatch = async (matchId: string): Promise<string> => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${BASE_URL}/matching/recipient/confirm/${matchId}`, {
    method: 'POST',
    headers,
  });

  await handleResponse(response, 'Failed to confirm match as recipient');
  return await response.text();
};

export const getDonorDetailsByUserId = async (userId: string): Promise<any> => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${BASE_URL}/matching/donor-details/${userId}`, {
    method: 'GET',
    headers,
  });

  if (response.status === 404) {
    return null;
  }
  
  await handleResponse(response, 'Failed to fetch donor details');
  return await response.json();
};

export const getRecipientDetailsByUserId = async (userId: string): Promise<any> => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${BASE_URL}/matching/recipient-details/${userId}`, {
    method: 'GET',
    headers,
  });

  if (response.status === 404) {
    return null;
  }
  
  await handleResponse(response, 'Failed to fetch recipient details');
  return await response.json();
};

export const fetchDonationByIdWithAccess = async (donationId: string): Promise<any> => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${BASE_URL}/matching/donations/${donationId}`, {
    headers,
  });
  
  if (response.status === 403) {
    throw new Error("Access denied - you are not authorized to view this donation");
  }
  
  await handleResponse(response, "Failed to fetch donation details");
  return await response.json();
};

export const fetchRequestByIdWithAccess = async (requestId: string): Promise<any> => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${BASE_URL}/matching/requests/${requestId}`, {
    headers,
  });
  
  if (response.status === 403) {
    throw new Error("Access denied - you are not authorized to view this request");
  }
  
  await handleResponse(response, "Failed to fetch request details");
  return await response.json();
};

export const getMyDonationDetails = async (donorId: string, donationId: string): Promise<any> => {
  const headers = await getAuthHeaders();
  
  console.log('Fetching donations for donorId:', donorId);
  
  const response = await fetch(`${BASE_URL}/donors/${donorId}/donations`, {
    method: 'GET',
    headers,
  });

  await handleResponse(response, 'Failed to fetch donations');
  const donations = await response.json();
  
  console.log('All donations:', donations);
  console.log('Looking for donationId:', donationId);
  
  const found = donations.find((d: any) => d.id === donationId);
  console.log('Found donation:', found);
  
  return found || null;
};

export const getMyRequestDetails = async (recipientId: string, requestId: string): Promise<any> => {
  const headers = await getAuthHeaders();
  
  console.log('Fetching requests for recipientId:', recipientId);
  
  const response = await fetch(`${BASE_URL}/recipients/${recipientId}/requests`, {
    method: 'GET',
    headers,
  });

  await handleResponse(response, 'Failed to fetch requests');
  const requests = await response.json();
  
  console.log('All requests:', requests);
  console.log('Looking for requestId:', requestId);
  
  const found = requests.find((r: any) => r.id === requestId);
  console.log('Found request:', found);
  
  return found || null;
};


export const getMatchConfirmationStatus = async (matchId: string): Promise<boolean> => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${BASE_URL}/matching/match/${matchId}/status`, {
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch match confirmation status');
  }
  
  return await response.json();
};

export const fetchUserById = async (userId: string): Promise<UserProfile> => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${BASE_URL}/users/profile/id/${userId}`, {
    method: 'GET',
    headers,
  });

  await handleResponse(response, 'Failed to fetch user profile');
  return await response.json();
};
