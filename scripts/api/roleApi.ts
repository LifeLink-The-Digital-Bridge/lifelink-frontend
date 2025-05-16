import * as SecureStore from 'expo-secure-store';

export const addUserRole = async () => {
  const token = await SecureStore.getItemAsync('jwt');
  
  const response = await fetch('http:///donors/addRole', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to add role');
  }

  return response.json();
};

export const refreshAuthTokens = async () => {
  const refreshToken = await SecureStore.getItemAsync('refreshToken');
  
  const response = await fetch(`http:///auth/refresh?refreshToken=${refreshToken}`, {
    method: 'POST'
  });

  if (!response.ok) {
    throw new Error('Failed to refresh tokens');
  }

  return response.json();
};
