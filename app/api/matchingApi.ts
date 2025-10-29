import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = Constants.expoConfig?.extra?.API_URL;

export interface ManualMatchRequest {
  donationId: string;
  receiveRequestId: string;
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
    matchedAt: string;
    status: string;
    distance?: number;
  };
  error?: {
    errorType: string;
    errorMessage: string;
    timestamp: string;
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

  status: string;
  isConfirmed: boolean;
  donorConfirmed: boolean;
  recipientConfirmed: boolean;
  donorConfirmedAt?: string;
  recipientConfirmedAt?: string;

  firstConfirmer?: 'DONOR' | 'RECIPIENT';
  firstConfirmedAt?: string;
  confirmationExpiresAt?: string;

  withdrawnBy?: 'DONOR' | 'RECIPIENT';
  withdrawnAt?: string;
  withdrawalReason?: string;

  matchedAt: string;
  expiredAt?: string;
  expiryReason?: string;

  completedAt?: string;
  completionConfirmedBy?: string;
  receivedDate?: string;
  canConfirmCompletion?: boolean;
  completionNotes?: string;
  recipientRating?: number;
  hospitalName?: string;

  distance?: number;
  compatibilityScore?: number;
  bloodCompatibilityScore?: number;
  locationCompatibilityScore?: number;
  medicalCompatibilityScore?: number;
  urgencyPriorityScore?: number;
  matchReason?: string;
  priorityRank?: number;

  withdrawalGracePeriodExpiresAt?: string;
  reconfirmationWindowExpiresAt?: string;
}

export enum MatchStatus {
  PENDING = 'PENDING',
  DONOR_CONFIRMED = 'DONOR_CONFIRMED',
  RECIPIENT_CONFIRMED = 'RECIPIENT_CONFIRMED',
  CONFIRMED = 'CONFIRMED',
  WITHDRAWN = 'WITHDRAWN',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
  COMPLETED = 'COMPLETED',
  CANCELLED_BY_DONOR = 'CANCELLED_BY_DONOR',
  CANCELLED_BY_RECIPIENT = 'CANCELLED_BY_RECIPIENT'
}

export enum DonationStatus {
  PENDING = 'PENDING',
  MATCHED = 'MATCHED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED'
}

export enum RequestStatus {
  PENDING = 'PENDING',
  MATCHED = 'MATCHED',
  IN_PROGRESS = 'IN_PROGRESS',
  FULFILLED = 'FULFILLED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED'
}

export interface CompletionConfirmationDTO {
  receivedDate?: string;
  notes?: string;
  rating?: number;
  hospitalName?: string;
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

export interface LocationDTO {
  locationId: string;
  addressLine?: string;
  landmark?: string;
  area?: string;
  city?: string;
  district?: string;
  state?: string;
  country?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
}

export interface HLAProfileDTO {
  id: string;
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

export interface DonorMedicalDetailsDTO {
  medicalDetailsId: number;
  hemoglobinLevel?: number;
  bloodGlucoseLevel?: number | null;
  hasDiabetes?: boolean;
  bloodPressure?: string;
  hasDiseases?: boolean;
  takingMedication?: boolean;
  diseaseDescription?: string;
  currentMedications?: string;
  lastMedicalCheckup?: string;
  medicalHistory?: string;
  hasInfectiousDiseases?: boolean;
  infectiousDiseaseDetails?: string;
  creatinineLevel?: number;
  liverFunctionTests?: string;
  cardiacStatus?: string;
  pulmonaryFunction?: number;
  overallHealthStatus?: string;
}

export interface DonorEligibilityCriteriaDTO {
  eligibilityCriteriaId: number;
  weight?: number;
  age?: number;
  dob?: string;
  medicalClearance?: boolean;
  recentTattooOrPiercing?: boolean;
  recentTravelDetails?: string;
  recentVaccination?: boolean;
  recentSurgery?: boolean;
  chronicDiseases?: string;
  allergies?: string;
  lastDonationDate?: string;
  height?: number;
  bodyMassIndex?: number;
  bodySize?: string;
  isLivingDonor?: boolean;
  smokingStatus?: string;
  packYears?: number;
  quitSmokingDate?: string;
  alcoholStatus?: string;
  drinksPerWeek?: number;
  quitAlcoholDate?: string;
  alcoholAbstinenceMonths?: number;
}

export interface DonorDTO {
  donorId: string;
  userId: string;
  registrationDate?: string;
  status: string;
  medicalDetails?: DonorMedicalDetailsDTO;
  eligibilityCriteria?: DonorEligibilityCriteriaDTO;
  hlaProfile?: HLAProfileDTO;
  locations?: LocationDTO[];
}

export interface RecipientMedicalDetailsDTO {
  medicalDetailsId: number;
  hemoglobinLevel?: number;
  bloodGlucoseLevel?: number | null;
  hasDiabetes?: boolean;
  bloodPressure?: string;
  diagnosis?: string;
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

export interface RecipientEligibilityCriteriaDTO {
  eligibilityCriteriaId: number;
  ageEligible?: boolean;
  age?: number;
  dob?: string;
  weightEligible?: boolean;
  weight?: number;
  medicallyEligible?: boolean;
  legalClearance?: boolean;
  notes?: string;
  lastReviewed?: string;
  height?: number;
  bodyMassIndex?: number;
  bodySize?: string;
  isLivingDonor?: boolean;
  smokingStatus?: string;
  packYears?: number;
  quitSmokingDate?: string;
  alcoholStatus?: string;
  drinksPerWeek?: number;
  quitAlcoholDate?: string;
  alcoholAbstinenceMonths?: number;
}

export interface RecipientDTO {
  recipientId: string;
  userId: string;
  availability: string;
  medicalDetails?: RecipientMedicalDetailsDTO;
  eligibilityCriteria?: RecipientEligibilityCriteriaDTO;
  hlaProfile?: HLAProfileDTO;
  locations?: LocationDTO[];
}

export interface DonationDTO {
  id: string;
  donorId: string;
  donationType: string;
  donationDate: string;
  status: string;
  bloodType?: string;
  quantity?: number;
  organType?: string;
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
  tissueType?: string;
  stemCellType?: string;
  location?: LocationDTO;
}

export interface ReceiveRequestDTO {
  id: string;
  recipientId: string;
  requestType: string;
  requestedBloodType?: string;
  requestedOrgan?: string;
  requestedTissue?: string;
  requestedStemCellType?: string;
  urgencyLevel: string;
  quantity?: number;
  requestDate: string;
  status: string;
  notes?: string;
  location?: LocationDTO;
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
    let errorDetails: string;
    try {
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const errorJson = await response.json();
        errorDetails = errorJson.message || errorJson.error || errorMessage;
      } else {
        errorDetails = await response.text();
      }
    } catch {
      errorDetails = errorMessage;
    }

    switch (response.status) {
      case 400:
        if (errorDetails.includes('grace period')) {
          throw new Error(`GRACE_PERIOD_EXPIRED: ${errorDetails}`);
        }
        if (errorDetails.includes('already confirmed')) {
          throw new Error(`ALREADY_CONFIRMED: ${errorDetails}`);
        }
        if (errorDetails.includes('Re-confirmation window')) {
          throw new Error(`RECONFIRMATION_EXPIRED: ${errorDetails}`);
        }
        throw new Error(errorDetails);
      case 401:
        throw new Error('Authentication required. Please login again.');
      case 403:
        throw new Error(errorDetails || 'Access denied');
      case 404:
        throw new Error(errorDetails || 'Resource not found');
      case 500:
        throw new Error('Server error. Please try again later.');
      default:
        throw new Error(errorDetails || `${errorMessage} (Status: ${response.status})`);
    }
  }
  return response;
};

export const getMatchById = async (matchId: string): Promise<MatchResponse> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}/matching/matches/${matchId}`, {
    method: 'GET',
    headers,
  });
  await handleResponse(response, 'Failed to fetch match details');
  return await response.json();
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

export const getAllMatches = async (): Promise<MatchResponse[]> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}/matching/admin/all-matches`, {
    method: 'GET',
    headers,
  });
  await handleResponse(response, 'Failed to fetch all matches');
  return await response.json();
};

export const getMatchesByDonation = async (donationId: string): Promise<MatchResponse[]> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}/matching/donation/${donationId}/matches`, {
    method: 'GET',
    headers,
  });
  await handleResponse(response, 'Failed to fetch matches for donation');
  return await response.json();
};

export const getMatchesByRequest = async (requestId: string): Promise<MatchResponse[]> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}/matching/request/${requestId}/matches`, {
    method: 'GET',
    headers,
  });
  await handleResponse(response, 'Failed to fetch matches for request');
  return await response.json();
};

export const donorRejectMatch = async (matchId: string, reason: string = 'Not specified'): Promise<string> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}/matching/donor/reject/${matchId}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ reason }),
  });
  await handleResponse(response, 'Failed to reject match as donor');
  return await response.text();
};

export const recipientRejectMatch = async (matchId: string, reason: string = 'Not specified'): Promise<string> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}/matching/recipient/reject/${matchId}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ reason }),
  });
  await handleResponse(response, 'Failed to reject match as recipient');
  return await response.text();
};

export const donorWithdrawConfirmation = async (matchId: string, reason: string = 'Not specified'): Promise<string> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}/matching/donor/withdraw/${matchId}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ reason }),
  });
  
  await handleResponse(response, 'Failed to withdraw confirmation as donor');
  return await response.text();
};


export const recipientWithdrawConfirmation = async (matchId: string, reason: string = 'Not specified'): Promise<string> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}/matching/recipient/withdraw/${matchId}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ reason }),
  });
  await handleResponse(response, 'Failed to withdraw confirmation as recipient');
  return await response.text();
};

export const recipientConfirmCompletion = async (matchId: string, details: CompletionConfirmationDTO): Promise<string> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}/matching/recipient/confirm-completion/${matchId}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(details),
  });
  await handleResponse(response, 'Failed to confirm completion as recipient');
  return await response.text();
};

export const canConfirmCompletion = async (matchId: string): Promise<Record<string, any>> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}/matching/recipient/can-confirm-completion/${matchId}`, {
    method: 'GET',
    headers,
  });
  if (response.status === 404) {
    throw new Error('MATCH_NOT_FOUND');
  }
  await handleResponse(response, 'Failed to check completion eligibility');
  return await response.json();
};

export const getDonorDetailsByUserId = async (userId: string): Promise<DonorDTO | null> => {
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

export const getRecipientDetailsByUserId = async (userId: string): Promise<RecipientDTO | null> => {
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

export const fetchDonationByIdWithAccess = async (donationId: string): Promise<DonationDTO> => {
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

export const fetchRequestByIdWithAccess = async (requestId: string): Promise<ReceiveRequestDTO> => {
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

export const getMyDonations = async (): Promise<DonationDTO[]> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}/donors/my-donations`, {
    method: 'GET',
    headers,
  });
  if (response.status === 403) {
    throw new Error('NOT_REGISTERED_AS_DONOR');
  }
  await handleResponse(response, 'Failed to fetch donations');
  return await response.json();
};

export const getMyRequests = async (): Promise<ReceiveRequestDTO[]> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}/recipients/my-requests`, {
    method: 'GET',
    headers,
  });
  if (response.status === 403) {
    throw new Error('NOT_REGISTERED_AS_RECIPIENT');
  }
  await handleResponse(response, 'Failed to fetch requests');
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

export const fetchUserById = async (userId: string): Promise<UserProfile> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}/users/profile/id/${userId}`, {
    method: 'GET',
    headers,
  });
  await handleResponse(response, 'Failed to fetch user profile');
  return await response.json();
};

export const getDonorSnapshotByDonation = async (donationId: string): Promise<DonorDTO> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}/matching/donations/${donationId}/donor-snapshot`, {
    method: 'GET',
    headers,
  });
  if (response.status === 403) {
    throw new Error('Access denied');
  }
  await handleResponse(response, 'Failed to fetch donor snapshot');
  return await response.json();
};

export const getRecipientSnapshotByRequest = async (requestId: string): Promise<RecipientDTO> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}/matching/requests/${requestId}/recipient-snapshot`, {
    method: 'GET',
    headers,
  });
  if (response.status === 403) {
    throw new Error('Access denied');
  }
  await handleResponse(response, 'Failed to fetch recipient snapshot');
  return await response.json();
};
