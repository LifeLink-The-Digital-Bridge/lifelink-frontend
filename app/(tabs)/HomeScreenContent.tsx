import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function HomeScreenContent() {
  return (
    <View style={homeStyles.container}>
      <Image
        source={require('../../assets/images/lifelink_logo.jpg')}
        style={homeStyles.logo}
      />
      <Text style={homeStyles.title}>LifeLink</Text>
      <Text style={homeStyles.subtitle}>
        <FontAwesome name="heartbeat" size={18} color="#e17055" /> Connecting donors and recipients across India.
      </Text>
      <Link href="/navigation/loginScreen" asChild>
        <TouchableOpacity style={homeStyles.button}>
          <Text style={homeStyles.buttonText}>Login</Text>
        </TouchableOpacity>
      </Link>
      <Link href="/navigation/registerScreen" asChild>
        <TouchableOpacity style={homeStyles.buttonSecondary}>
          <Text style={homeStyles.buttonText}>Register</Text>
        </TouchableOpacity>
      </Link>
      <Text style={homeStyles.footer}>© {new Date().getFullYear()} LifeLink</Text>
    </View>
  );
}

const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fa',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 18,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#0984e3',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0984e3',
    marginBottom: 6,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#636e72',
    textAlign: 'center',
    marginBottom: 32,
    marginHorizontal: 10,
  },
  button: {
    backgroundColor: '#0984e3',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 10,
    marginBottom: 16,
    width: '80%',
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: '#6c5ce7',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    marginBottom: 32,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 17,
  },
  footer: {
    color: '#b2bec3',
    fontSize: 13,
    marginTop: 16,
  },
});
