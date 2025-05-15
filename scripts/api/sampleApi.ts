import { getJwt } from '../../app/utils/JWT';

export const callSampleEndpoint = async () => {
  const jwt = await getJwt();
  if (!jwt) throw new Error('Not authenticated!');

  const response = await fetch('http://:8080/users/sample', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${jwt}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    // ...error handling as before...
  }

  return response.text();
};
