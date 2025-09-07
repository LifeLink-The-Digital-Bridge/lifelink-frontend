import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig?.extra?.API_URL;

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

export const manualMatch = async (payload: ManualMatchRequest): Promise<ManualMatchResponse> => {
  const token = await SecureStore.getItemAsync('jwt');
  const userId = await SecureStore.getItemAsync('userId');
  
  const response = await fetch(`${BASE_URL}/matching/manual-match`, {
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
    throw new Error(errorText || 'Failed to create manual match');
  }
  
  return await response.json();
};

export const fetchUserById = async (userId: string) => {
  const token = await SecureStore.getItemAsync('jwt');
  const currentUserId = await SecureStore.getItemAsync('userId');
  
  const response = await fetch(`${BASE_URL}/users/profile/id/${userId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'id': currentUserId || '',
      'Content-Type': 'application/json'
    },
  });

  if (!response.ok) {
    console.log('Failed to fetch user profile, status:', response.status);
    throw new Error('Failed to fetch user profile');
  }
  
  return await response.json();
};

export const fetchAllMatches = async (): Promise<MatchResponse[]> => {
  const token = await SecureStore.getItemAsync('jwt');
  
  const response = await fetch(`${BASE_URL}/matching/admin/all-matches`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch matches');
  }
  
  return await response.json();
};



export const getMyMatchesAsDonor = async (): Promise<MatchResponse[]> => {
  const token = await SecureStore.getItemAsync('jwt');
  const userId = await SecureStore.getItemAsync('userId');
  
  const response = await fetch(`${BASE_URL}/matching/my-matches/as-donor`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'id': userId || '',
      'Content-Type': 'application/json'
    },
  });

  if (response.status === 403) {
    throw new Error('NOT_REGISTERED_AS_DONOR');
  }
  
  if (!response.ok) {
    throw new Error('Failed to fetch donor matches');
  }
  
  return await response.json();
};

export const getMyMatchesAsRecipient = async (): Promise<MatchResponse[]> => {
  const token = await SecureStore.getItemAsync('jwt');
  const userId = await SecureStore.getItemAsync('userId');
  
  const response = await fetch(`${BASE_URL}/matching/my-matches/as-recipient`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'id': userId || '',
      'Content-Type': 'application/json'
    },
  });

  if (response.status === 403) {
    throw new Error('NOT_REGISTERED_AS_RECIPIENT');
  }
  
  if (!response.ok) {
    throw new Error('Failed to fetch recipient matches');
  }
  
  return await response.json();
};

export const donorConfirmMatch = async (matchId: string): Promise<string> => {
  const token = await SecureStore.getItemAsync('jwt');
  const userId = await SecureStore.getItemAsync('userId');
  
  const response = await fetch(`${BASE_URL}/matching/donor/confirm/${matchId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'id': userId || '',
      'Content-Type': 'application/json'
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to confirm match as donor');
  }
  
  return await response.text();
};

export const recipientConfirmMatch = async (matchId: string): Promise<string> => {
  const token = await SecureStore.getItemAsync('jwt');
  const userId = await SecureStore.getItemAsync('userId');
  
  const response = await fetch(`${BASE_URL}/matching/recipient/confirm/${matchId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'id': userId || '',
      'Content-Type': 'application/json'
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to confirm match as recipient');
  }
  
  return await response.text();
};

export const fetchDonationById = async (donationId: string) => {
  const token = await SecureStore.getItemAsync('jwt');
  const userId = await SecureStore.getItemAsync('userId');
  
  const response = await fetch(`${BASE_URL}/donors/donations/${donationId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'id': userId || '',
      'Content-Type': 'application/json'
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch donation details');
  }
  
  return await response.json();
};

export const fetchRequestById = async (requestId: string) => {
  const token = await SecureStore.getItemAsync('jwt');
  const userId = await SecureStore.getItemAsync('userId');
  
  const response = await fetch(`${BASE_URL}/recipients/requests/${requestId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'id': userId || '',
      'Content-Type': 'application/json'
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch request details');
  }
  
  return await response.json();
};

export const fetchDonationStatus = async (donationId: string) => {
  const token = await SecureStore.getItemAsync('jwt');
  const userId = await SecureStore.getItemAsync('userId');
  
  const response = await fetch(`${BASE_URL}/donors/donations/${donationId}/status`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'id': userId || '',
      'Content-Type': 'application/json'
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch donation status');
  }
  
  return await response.text();
};

export const fetchRequestStatus = async (requestId: string) => {
  const token = await SecureStore.getItemAsync('jwt');
  const userId = await SecureStore.getItemAsync('userId');
  
  const response = await fetch(`${BASE_URL}/recipients/requests/${requestId}/status`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'id': userId || '',
      'Content-Type': 'application/json'
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch request status');
  }
  
  return await response.text();
};

export const fetchDonorHistory = async (userId: string) => {
  const token = await SecureStore.getItemAsync('jwt');
  const currentUserId = await SecureStore.getItemAsync('userId');
  
  const response = await fetch(`${BASE_URL}/donors/user/${userId}/history`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'id': currentUserId || '',
      'Content-Type': 'application/json'
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch donor history');
  }
  
  return await response.json();
};

export const fetchRecipientHistory = async (userId: string) => {
  const token = await SecureStore.getItemAsync('jwt');
  const currentUserId = await SecureStore.getItemAsync('userId');
  
  const response = await fetch(`${BASE_URL}/recipients/user/${userId}/history`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'id': currentUserId || '',
      'Content-Type': 'application/json'
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch recipient history');
  }
  
  return await response.json();
};

export const fetchUserProfileByUsername = async (username: string) => {
  const token = await SecureStore.getItemAsync('jwt');
  const userId = await SecureStore.getItemAsync('userId');
  
  const response = await fetch(`${BASE_URL}/users/profile/${username}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'id': userId || '',
      'Content-Type': 'application/json'
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }
  
  return await response.json();
};

export const getDonorByUserId = async (userId: string) => {
  const token = await SecureStore.getItemAsync('jwt');
  const currentUserId = await SecureStore.getItemAsync('userId');
  
  const response = await fetch(`${BASE_URL}/donors/by-userId/${userId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'id': currentUserId || '',
      'Content-Type': 'application/json'
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch donor data');
  }
  
  return await response.json();
};

export const getRecipientByUserId = async (userId: string) => {
  const token = await SecureStore.getItemAsync('jwt');
  const currentUserId = await SecureStore.getItemAsync('userId');
  
  const response = await fetch(`${BASE_URL}/recipients/by-userId/${userId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'id': currentUserId || '',
      'Content-Type': 'application/json'
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch recipient data');
  }
  
  return await response.json();
};

export const getMyDonations = async () => {
  const token = await SecureStore.getItemAsync('jwt');
  const userId = await SecureStore.getItemAsync('userId');
  
  const response = await fetch(`${BASE_URL}/donors/my-donations`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'id': userId || '',
      'Content-Type': 'application/json'
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch my donations');
  }
  
  return await response.json();
};

export const getMyRequests = async () => {
  const token = await SecureStore.getItemAsync('jwt');
  const userId = await SecureStore.getItemAsync('userId');
  
  const response = await fetch(`${BASE_URL}/recipients/my-requests`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'id': userId || '',
      'Content-Type': 'application/json'
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch my requests');
  }
  
  return await response.json();
};
