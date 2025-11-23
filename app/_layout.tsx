import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import AnimatedSplash from '../components/AnimatedSplash';
import { AuthProvider } from '../utils/auth-context';
import { NotificationProvider } from '../utils/notification-context';
import '../utils/polyfills';
import { ThemeProvider } from '../utils/theme-context';

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <AnimatedSplash onFinish={() => setShowSplash(false)} />;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <StatusBar style="auto" />
          <Slot />
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
