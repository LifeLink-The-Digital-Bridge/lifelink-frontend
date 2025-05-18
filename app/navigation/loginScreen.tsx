import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { loginUser } from '../../scripts/api/loginApi';
import styles from '../../constants/styles/loginStyles';
import * as SecureStore from 'expo-secure-store';

function getLoginType(identifier: string): 'username' | 'email' {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(identifier) ? 'email' : 'username';
}

export default function LoginScreen() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert('Validation Error', 'Please enter username/email and password.');
      return;
    }

    setLoading(true);
    try {
      const loginType = getLoginType(identifier);
      const response = await loginUser({ loginType, identifier, password });

      await SecureStore.setItemAsync('jwt', response.accessToken);
      await SecureStore.setItemAsync('refreshToken', response.refreshToken);
      await SecureStore.setItemAsync('userId', response.id);
      await SecureStore.setItemAsync('email', response.email);
      await SecureStore.setItemAsync('username', response.username);
      await SecureStore.setItemAsync('roles', JSON.stringify(response.roles));
      await SecureStore.setItemAsync('gender', response.gender)
      await SecureStore.setItemAsync('dob', response.dob);

      Alert.alert('Login Successful', `Welcome, ${response.username}`);
      router.push("../dashboard");
    } catch (error: any) {
      let message = 'An unexpected error occurred.';
      if (error instanceof Error) {
        message = error.message;
      }
      Alert.alert('Login Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to LifeLink</Text>
      <TextInput
        style={styles.input}
        placeholder="Username or Email"
        autoCapitalize="none"
        value={identifier}
        onChangeText={setIdentifier}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/navigation/registerScreen')}>
        <Text style={styles.linkText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}
