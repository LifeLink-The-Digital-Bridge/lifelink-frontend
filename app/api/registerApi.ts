export interface MigrantDetailsPayload {
  aadhaarHash?: string;
  latitude?: number;
  longitude?: number;
}

export interface DoctorDetailsPayload {
  medicalRegistrationNumber: string;
  specialization?: string;
  qualification?: string;
  hospitalName?: string;
  clinicAddress?: string;
  yearsOfExperience?: number;
  consultationFee?: number;
  latitude?: number;
  longitude?: number;
}

export interface NGODetailsPayload {
  organizationName: string;
  registrationNumber: string;
  registrationYear?: number;
  organizationType?: string;
  serviceAreas?: string;
  headOfficeAddress?: string;
  website?: string;
  totalVolunteers?: number;
  latitude?: number;
  longitude?: number;
}

export interface RegisterRequest {
  name: string;
  email: string;
  username: string;
  password: string;
  phone: string;
  dob: string;
  gender: string;
  profileImageUrl: string;
  roles?: string[];
  migrantDetails?: MigrantDetailsPayload;
  doctorDetails?: DoctorDetailsPayload;
  ngoDetails?: NGODetailsPayload;
}

export interface RegisterResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  profileImageUrl: string;
  roles: string[];
  username: string;
}
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
export const registerUser = async (
  payload: RegisterRequest,
): Promise<RegisterResponse> => {
  const response = await fetch(`${BASE_URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorMessage = `Error ${response.status}`;

    try {
      const errorData = await response.json();
      if (typeof errorData.message === "string") {
        errorMessage = errorData.message;
      } else if (typeof errorData === "object") {
        errorMessage = Object.values(errorData).join("\n");
      }
    } catch {
      switch (response.status) {
        case 400:
          errorMessage = "Bad Request: Invalid input.";
          break;
        case 409:
          errorMessage = "Conflict: Username or email already exists.";
          break;
        case 500:
          errorMessage = "Server Error: Please try again later.";
          break;
      }
    }

    throw new Error(errorMessage);
  }

  return response.json();
};
