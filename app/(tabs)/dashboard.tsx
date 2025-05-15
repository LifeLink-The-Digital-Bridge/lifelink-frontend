import React, { useEffect, useState } from 'react';
import { Alert, Button, Text, View } from 'react-native';
import styles from '../../constants/styles/loginStyles';
import { callSampleEndpoint } from '../../scripts/api/sampleApi';
import { getJwt } from '../utils/JWT';
import { useAuth } from '../utils/auth-context'; 
import { router } from 'expo-router'; 
import * as SecureStore from 'expo-secure-store';

const username = SecureStore.getItemAsync("username");
const token = SecureStore.getItemAsync("jwt");
const email = SecureStore.getItemAsync("email");
const roles = SecureStore.getItemAsync("roles");
const userId = SecureStore.getItemAsync("userId");
const Dashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { logout } = useAuth(); 

  useEffect(() => {
    getJwt().then(token => setIsLoggedIn(!!token));
  }, []); 

  const handleSample = async () => {
    try {
      const result = await callSampleEndpoint();
      Alert.alert('Sample Response', result);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

const handleLogout = async () => {
  await logout();
  router.replace('/');
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Dashboard {username}</Text>
      <Text style={styles.title}>Token</Text>
      <Text style={styles.title}>{userId}</Text>
      {isLoggedIn && (
        <>
          <Button title="Call Sample Endpoint" onPress={handleSample} />
          <View style={{ marginTop: 20 }}>
            <Button title="Logout" color="#d63031" onPress={handleLogout} />
          </View>
        </>
      )}
      {!isLoggedIn && (
        <Text style={{ color: 'red', marginTop: 20 }}>You must log in to access this feature.</Text>
      )}
    </View>
  );
};

export default Dashboard;
