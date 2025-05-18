import * as SecureStore from 'expo-secure-store';

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
  const token = await SecureStore.getItemAsync('jwt');
  const userId = await SecureStore.getItemAsync('userId');
  const response = await fetch('http:///donors/register', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'id': userId || '',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorMessage = 'Failed to register as donor';
    try {
      const errorData = await response.text();
      errorMessage = errorData || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }

  return response.json();
};
