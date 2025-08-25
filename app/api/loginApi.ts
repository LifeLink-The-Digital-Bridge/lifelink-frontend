export interface LoginRequest {
  loginType: 'username' | 'email';
  identifier: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  id: string;
  email: string;
  username: string;
  roles: string[];
  gender: string;
  dob: string;
}

import Constants from 'expo-constants';
const BASE_URL = Constants.expoConfig?.extra?.API_URL;
console.log('All env:', process.env);
console.log('BASE_URL:', process.env.EXPO_PUBLIC_API_URL);

export const loginUser = async (payload: LoginRequest): Promise<LoginResponse> => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorMessage = `Error ${response.status}`;

    try {
      const errorData = await response.json();
      console.log('Error data:', errorData);

      if (typeof errorData.message === 'string') {
        errorMessage = errorData.message;
      } 
      else if (typeof errorData === 'object' && errorData !== null) {
        errorMessage = Object.values(errorData).join('\n');
      }
    } catch {
      switch (response.status) {
        case 401:
          errorMessage = 'Unauthorized: Invalid username or password.';
          break;
        case 403:
          errorMessage = 'Forbidden: You do not have access.';
          break;
        case 404:
          errorMessage = 'Not Found: The requested resource was not found.';
          break;
        case 500:
          errorMessage = 'Server Error: Please try again later.';
          break;
      }
    }

    throw new Error(errorMessage);
  }

  return response.json();
};
