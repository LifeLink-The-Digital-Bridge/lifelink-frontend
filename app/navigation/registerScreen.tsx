import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import styles from '../../constants/styles/loginStyles';
import { router } from 'expo-router';
import { registerUser } from '../../scripts/api/registerApi'; 
import type { RegisterRequest } from '../../scripts/api/registerApi'; 

export default function RegisterScreen() {
  const [formData, setFormData] = useState<RegisterRequest>({
    name: '',
    email: '',
    username: '',
    password: '',
    phone: '',
    dob: '',
    gender: '',
    profileImageUrl: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (key: keyof RegisterRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleRegister = async () => {
    const requiredFields: (keyof RegisterRequest)[] = [
      'name', 'email', 'username', 'password', 'phone', 'dob', 'gender', 'profileImageUrl'
    ];
    const emptyField = requiredFields.find((field) => !formData[field]);

    if (emptyField) {
      Alert.alert('Validation Error', `Please fill in the ${emptyField} field.`);
      return;
    }

    setLoading(true);

    try {
      const data = await registerUser(formData);
      Alert.alert('Registration Successful', `Welcome, ${data.username}`);
      router.push('/navigation/loginScreen');
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register for LifeLink</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={formData.name}
        onChangeText={(text) => handleChange('name', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={formData.email}
        onChangeText={(text) => handleChange('email', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Username"
        autoCapitalize="none"
        value={formData.username}
        onChangeText={(text) => handleChange('username', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={formData.password}
        onChangeText={(text) => handleChange('password', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone"
        keyboardType="phone-pad"
        value={formData.phone}
        onChangeText={(text) => handleChange('phone', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Date of Birth (YYYY-MM-DD)"
        value={formData.dob}
        onChangeText={(text) => handleChange('dob', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Gender"
        value={formData.gender}
        onChangeText={(text) => handleChange('gender', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Profile Image URL"
        value={formData.profileImageUrl}
        onChangeText={(text) => handleChange('profileImageUrl', text)}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Register</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/navigation/loginScreen')}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
