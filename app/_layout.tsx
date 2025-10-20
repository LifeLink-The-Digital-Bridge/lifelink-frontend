import React, { useState } from 'react';
import { Slot } from 'expo-router';
import { AuthProvider } from '../utils/auth-context';
import { ThemeProvider } from '../utils/theme-context';
import { StatusBar } from 'expo-status-bar';
import AnimatedSplash from '../components/AnimatedSplash';

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <AnimatedSplash onFinish={() => setShowSplash(false)} />;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <StatusBar style="auto" />
        <Slot />
      </AuthProvider>
    </ThemeProvider>
  );
}
