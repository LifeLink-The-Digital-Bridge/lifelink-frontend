import { Slot } from 'expo-router';
import { AuthProvider } from '../utils/auth-context';
import { ThemeProvider } from '../utils/theme-context';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StatusBar style="auto" />
        <Slot />
      </AuthProvider>
    </ThemeProvider>
  );
}
