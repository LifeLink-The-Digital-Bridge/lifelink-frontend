import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import AnimatedSplash from '../components/AnimatedSplash';
import { AuthProvider } from '../utils/auth-context';
import { RoleProvider } from '../utils/role-context';
import { NotificationProvider } from '../utils/notification-context';
import '../utils/polyfills';
import { ThemeProvider } from '../utils/theme-context';
import { LanguageProvider } from '../utils/language-context';

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <AnimatedSplash onFinish={() => setShowSplash(false)} />;
  }

  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <RoleProvider>
            <NotificationProvider>
              <StatusBar style="auto" />
              <Slot />
            </NotificationProvider>
          </RoleProvider>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
