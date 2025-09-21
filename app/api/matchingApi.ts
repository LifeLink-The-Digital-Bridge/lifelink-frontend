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

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  profileImageUrl?: string;
  phone?: string;
  gender?: string;
}

export interface DonationDetails {
  id: string;
  donationType: string;
  bloodType?: string;
  quantity: number;
  donationDate: string;
  status: string;
  notes?: string;
}

export interface RequestDetails {
  id: string;
  requestType: string;
  requestedBloodType?: string;
  requestedOrgan?: string;
  requestedTissue?: string;
  requestedStemCellType?: string;
  urgencyLevel: string;
  quantity: number;
  requestDate: string;
  status: string;
  notes?: string;
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

export const fetchAllMatches = async (): Promise<MatchResponse[]> => {
  const headers = await getAuthHeaders(false);
  
  const response = await fetch(`${BASE_URL}/matching/admin/all-matches`, {
    method: 'GET',
    headers,
  });

  await handleResponse(response, 'Failed to fetch all matches');
  return await response.json();
};

export const getMatchesByDonation = async (donationId: string): Promise<MatchResponse[]> => {
  const headers = await getAuthHeaders(false);
  
  const response = await fetch(`${BASE_URL}/matching/donation/${donationId}/matches`, {
    method: 'GET',
    headers,
  });

  await handleResponse(response, 'Failed to fetch matches by donation');
  return await response.json();
};

export const getMatchesByRequest = async (requestId: string): Promise<MatchResponse[]> => {
  const headers = await getAuthHeaders(false);
  
  const response = await fetch(`${BASE_URL}/matching/request/${requestId}/matches`, {
    method: 'GET',
    headers,
  });

  await handleResponse(response, 'Failed to fetch matches by request');
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

export const fetchRequestByIdWithAccess = async (requestId: string): Promise<RequestDetails> => {
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

export const fetchDonationByIdWithAccess = async (donationId: string): Promise<DonationDetails> => {
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

export const fetchUserById = async (userId: string): Promise<UserProfile> => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${BASE_URL}/users/profile/id/${userId}`, {
    method: 'GET',
    headers,
  });

  await handleResponse(response, 'Failed to fetch user profile');
  return await response.json();
};

export const fetchUserProfileByUsername = async (username: string): Promise<UserProfile> => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${BASE_URL}/users/profile/${username}`, {
    method: 'GET',
    headers,
  });

  await handleResponse(response, 'Failed to fetch user profile');
  return await response.json();
};

export const getDonorByUserId = async (userId: string) => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${BASE_URL}/donors/by-userId/${userId}`, {
    method: 'GET',
    headers,
  });

  if (response.status === 404) {
    return null;
  }
  
  await handleResponse(response, 'Failed to fetch donor data');
  return await response.json();
};

export const fetchDonationById = async (donationId: string): Promise<DonationDetails> => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${BASE_URL}/donors/donations/${donationId}`, {
    method: 'GET',
    headers,
  });

  await handleResponse(response, 'Failed to fetch donation details');
  return await response.json();
};

export const fetchDonationStatus = async (donationId: string): Promise<string> => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${BASE_URL}/donors/donations/${donationId}/status`, {
    method: 'GET',
    headers,
  });

  await handleResponse(response, 'Failed to fetch donation status');
  return await response.text();
};

export const getMyDonations = async () => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${BASE_URL}/donors/my-donations`, {
    method: 'GET',
    headers,
  });

  if (response.status === 403) {
    throw new Error('NOT_REGISTERED_AS_DONOR');
  }
  
  await handleResponse(response, 'Failed to fetch my donations');
  return await response.json();
};

export const fetchDonorHistory = async (userId: string) => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${BASE_URL}/donors/user/${userId}/history`, {
    method: 'GET',
    headers,
  });

  await handleResponse(response, 'Failed to fetch donor history');
  return await response.json();
};

export const getRecipientByUserId = async (userId: string) => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${BASE_URL}/recipients/by-userId/${userId}`, {
    method: 'GET',
    headers,
  });

  if (response.status === 404) {
    return null;
  }
  
  await handleResponse(response, 'Failed to fetch recipient data');
  return await response.json();
};

export const fetchRequestById = async (requestId: string): Promise<RequestDetails> => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${BASE_URL}/recipients/requests/${requestId}`, {
    method: 'GET',
    headers,
  });

  await handleResponse(response, 'Failed to fetch request details');
  return await response.json();
};

export const fetchRequestStatus = async (requestId: string): Promise<string> => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${BASE_URL}/recipients/requests/${requestId}/status`, {
    method: 'GET',
    headers,
  });

  await handleResponse(response, 'Failed to fetch request status');
  return await response.text();
};

export const getMyRequests = async () => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${BASE_URL}/recipients/my-requests`, {
    method: 'GET',
    headers,
  });

  if (response.status === 403) {
    throw new Error('NOT_REGISTERED_AS_RECIPIENT');
  }
  
  await handleResponse(response, 'Failed to fetch my requests');
  return await response.json();
};

export const fetchRecipientHistory = async (userId: string) => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${BASE_URL}/recipients/user/${userId}/history`, {
    method: 'GET',
    headers,
  });

  await handleResponse(response, 'Failed to fetch recipient history');
  return await response.json();
};

export const getMatchById = async (matchId: string): Promise<MatchResponse> => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${BASE_URL}/matching/match/${matchId}`, {
    method: 'GET',
    headers,
  });

  await handleResponse(response, 'Failed to fetch match details');
  return await response.json();
};

export const cancelMatch = async (matchId: string): Promise<string> => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${BASE_URL}/matching/cancel/${matchId}`, {
    method: 'DELETE',
    headers,
  });

  await handleResponse(response, 'Failed to cancel match');
  return await response.text();
};

export const updateDonationStatus = async (donationId: string, status: string): Promise<void> => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${BASE_URL}/donors/donations/${donationId}/status`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ status }),
  });
  
  await handleResponse(response, 'Failed to update donation status');
};

export const updateRequestStatus = async (requestId: string, status: string): Promise<void> => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${BASE_URL}/recipients/requests/${requestId}/status`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ status }),
  });
  
  await handleResponse(response, 'Failed to update request status');
};

export const fetchMatchHistory = async (matchId: string): Promise<any> => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${BASE_URL}/matching/history/match/${matchId}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch match history');
  }
  
  return await response.json();
};

export const fetchDonorHistoryByUser = async (donorUserId: string): Promise<any[]> => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${BASE_URL}/matching/history/donor/${donorUserId}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error('Access denied to donor history');
  }
  
  return await response.json();
};

export const fetchRecipientHistoryByUser = async (recipientUserId: string): Promise<any[]> => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${BASE_URL}/matching/history/recipient/${recipientUserId}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error('Access denied to recipient history');
  }
  
  return await response.json();
};

export const fetchHistoryByMatch = async (matchId: string, type: 'donor' | 'recipient'): Promise<any[]> => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${BASE_URL}/matching/history/match/${matchId}/${type}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error(`Access denied to ${type} history`);
  }
  
  return await response.json();
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

export const fetchDonorHistoryForRecipient = async (donorUserId: string): Promise<any[]> => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${BASE_URL}/donors/history/for-recipient/${donorUserId}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error('Access denied to donor history');
  }
  
  return await response.json();
};

export const fetchRecipientHistoryForDonor = async (recipientUserId: string): Promise<any[]> => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${BASE_URL}/recipients/history/for-donor/${recipientUserId}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error('Access denied to recipient history');
  }
  
  return await response.json();
};

export const fetchDonorHistoryByMatchId = async (matchResultId: string): Promise<any> => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${BASE_URL}/donors/history/match/${matchResultId}`, {
    method: "GET",
    headers,
  });

  await handleResponse(response, "Failed to fetch donor history by match");
  return response.json();
};

export const fetchRecipientHistoryByMatchId = async (matchResultId: string): Promise<any> => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${BASE_URL}/recipients/history/match/${matchResultId}`, {
    method: "GET",
    headers,
  });

  await handleResponse(response, "Failed to fetch recipient history by match");
  return response.json();
};
