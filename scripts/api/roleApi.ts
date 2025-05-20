import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig?.extra?.API_URL;

export const addUserRole = async () => {
  const token = await SecureStore.getItemAsync('jwt');
  const response = await fetch(`${BASE_URL}/donors/addRole`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || 'Failed to add role');
  }

  return text;
};

export const refreshAuthTokens = async () => {
  const refreshToken = await SecureStore.getItemAsync('refreshToken');
  
  const response = await fetch(`${BASE_URL}/auth/refresh?refreshToken=${refreshToken}`, {
    method: 'POST'
  });

  if (!response.ok) {
    throw new Error('Failed to refresh tokens');
  }

  return response.json();
};
