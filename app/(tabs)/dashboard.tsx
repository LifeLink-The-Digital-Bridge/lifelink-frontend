import React, { useEffect, useState } from 'react';
import { Alert, Button, Text, View, ActivityIndicator, ScrollView } from 'react-native';
import styles from '../../constants/styles/loginStyles';
import { callSampleEndpoint } from '../../scripts/api/sampleApi';
import { useAuth } from '../utils/auth-context';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

const addUserRole = async () => {
  const token = await SecureStore.getItemAsync('jwt');
  const response = await fetch('http://192.168.1.26:8080/donors/addRole', {
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

const refreshAuthTokens = async () => {
  const refreshToken = await SecureStore.getItemAsync('refreshToken');
  const response = await fetch(`http://192.168.1.26:8080/auth/refresh?refreshToken=${refreshToken}`, {
    method: 'POST'
  });

  if (!response.ok) {
    let errorMsg = 'Failed to refresh tokens';
    try {
      const errorData = await response.text();
      errorMsg = errorData || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }

  return response.json();
};

const Dashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [userData, setUserData] = useState({
    username: '',
    email: '',
    roles: '',
    userId: '',
    token: '',
    refreshToken: ''
  });

  const { logout } = useAuth();

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      const [
        username,
        email,
        roles,
        userId,
        token,
        refreshToken
      ] = await Promise.all([
        SecureStore.getItemAsync("username"),
        SecureStore.getItemAsync("email"),
        SecureStore.getItemAsync("roles"),
        SecureStore.getItemAsync("userId"),
        SecureStore.getItemAsync("jwt"),
        SecureStore.getItemAsync("refreshToken")
      ]);
      setUserData({
        username: username || '',
        email: email || '',
        roles: roles || '',
        userId: userId || '',
        token: token || '',
        refreshToken: refreshToken || ''
      });
      setIsLoggedIn(!!token);
      setLoading(false);
    };
    loadUserData();
  }, []);

  const handleSample = async () => {
    try {
      const result = await callSampleEndpoint();
      Alert.alert('Sample Response', result);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleAddRoleAndRefresh = async () => {
    setActionLoading(true);
    try {
      const addRoleResult = await addUserRole();

      const newTokens = await refreshAuthTokens();

      await Promise.all([
        SecureStore.setItemAsync('jwt', newTokens.accessToken),
        SecureStore.setItemAsync('refreshToken', newTokens.refreshToken),
        SecureStore.setItemAsync('email', newTokens.email),
        SecureStore.setItemAsync('username', newTokens.username),
        SecureStore.setItemAsync('roles', JSON.stringify(newTokens.roles)),
        SecureStore.setItemAsync('userId', newTokens.id)
      ]);

      setUserData({
        username: newTokens.username,
        email: newTokens.email,
        roles: JSON.stringify(newTokens.roles),
        userId: newTokens.id,
        token: newTokens.accessToken,
        refreshToken: newTokens.refreshToken
      });

      Alert.alert('Success', `${addRoleResult} and tokens refreshed!`);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0984e3" />
        <Text style={{ marginTop: 10 }}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome to the Dashboard {userData.username}</Text>
      <Text style={styles.title}>Email: {userData.email}</Text>
      <Text style={styles.title}>UserId: {userData.userId}</Text>
      <Text style={styles.title}>Roles: {userData.roles}</Text>

      {isLoggedIn && (
        <>
          <Button title="Call Sample Endpoint" onPress={handleSample} />
          <View style={{ marginTop: 20 }}>
            <Button
              title={actionLoading ? "Processing..." : "Add Role & Refresh Token"}
              onPress={handleAddRoleAndRefresh}
              color="#00b894"
              disabled={actionLoading}
            />
          </View>
          <View style={{ marginTop: 20 }}>
            <Button title="Logout" color="#d63031" onPress={handleLogout} />
          </View>
        </>
      )}
      {!isLoggedIn && (
        <Text style={{ color: 'red', marginTop: 20 }}>
          You must log in to access this feature.
        </Text>
      )}
    </ScrollView>
  );
};

export default Dashboard;
