export interface RegisterDonorRequest {
  registrationDate: string;
  status: string;
  medicalDetails: {
    hemoglobinLevel: number;
    bloodPressure: string;
    hasDiseases: boolean;
    takingMedication: boolean;
    diseaseDescription: string;
    recentlyIll: boolean;
    isPregnant?: boolean;
  };
  eligibilityCriteria: {
    ageEligible: boolean;
    age: number;
    dob: string;
    weightEligible: boolean;
    weight: number;
    medicalClearance: boolean;
    recentTattooOrPiercing: boolean;
    recentTravel: boolean;
    recentTravelDetails: string;
    recentVaccination: boolean;
    recentSurgery: boolean;
    chronicDiseases: string;
    allergies: string;
    lastDonationDate: string | null;
  };
  consentForm: {
    userId: string;
    isConsented: boolean;
    consentedAt: string;
    consentType: string;
  };
  location: {
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
}

export async function registerDonation(payload : RegisterDonorRequest) {
  const response = await fetch('http:///donors/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(await response.text());
  return await response.json();
}
