import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../utils/theme-context';
import { lightTheme, darkTheme } from '../constants/styles/authStyles';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;
  
  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },
    container: { 
      flex: 1 
    },
    content: { 
      flex: 1 
    },
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={styles.container}>
        {/* Main Content */}
        <View style={styles.content}>
          {children}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AppLayout;
