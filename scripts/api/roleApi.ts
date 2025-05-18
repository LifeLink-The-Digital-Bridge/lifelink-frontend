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

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || 'Failed to add role');
  }

  return text;
};

export const refreshAuthTokens = async () => {
  const refreshToken = await SecureStore.getItemAsync('refreshToken');
  
  const response = await fetch(`http://192.168.1.26:8080/auth/refresh?refreshToken=${refreshToken}`, {
    method: 'POST'
  });

  if (!response.ok) {
    throw new Error('Failed to refresh tokens');
  }

  return response.json();
};
