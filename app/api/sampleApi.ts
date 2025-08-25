import { getJwt } from '../../utils/JWT';
import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig?.extra?.API_URL;

export const callSampleEndpoint = async () => {
  const jwt = await getJwt();
  if (!jwt) throw new Error('Not authenticated!');

  const response = await fetch(`${BASE_URL}/users/sample`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${jwt}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    let errorMessage = `Error ${response.status}`;
    
    try {
      const errorData = await response.json();
      if (typeof errorData.message === 'string') {
        errorMessage = errorData.message;
      } else if (typeof errorData === 'object') {
        errorMessage = Object.values(errorData).join('\n');
      }
    } catch {
      switch (response.status) {
        case 400:
          errorMessage = 'Bad Request: Invalid input.';
          break;
        case 409:
          errorMessage = 'Conflict: Username or email already exists.';
          break;
        case 500:
          errorMessage = 'Server Error: Please try again later.';
          break;
      }
    }

    throw new Error(errorMessage);
  }

  return response.text();
};
