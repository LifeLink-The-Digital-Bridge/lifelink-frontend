import * as SecureStore from 'expo-secure-store';

export const getJwt = async () => {
  return await SecureStore.getItemAsync('jwt');
};
