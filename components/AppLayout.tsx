import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../utils/theme-context';
import { lightTheme, darkTheme } from '../constants/styles/authStyles';

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  hideHeader?: boolean;
}

const AppLayout = ({ children, title = "", hideHeader = false }: AppLayoutProps) => {
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
    header: {
      height: 60,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 4,
      shadowColor: theme.shadow,
      shadowOpacity: 0.08,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
    },
    headerTitle: {
      color: '#fff',
      fontSize: 22,
      fontWeight: 'bold',
      letterSpacing: 1,
    },
    content: { 
      flex: 1 
    },
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={styles.container}>
        {/* Header */}
        {!hideHeader && (
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{title}</Text>
          </View>
        )}
        {/* Main Content */}
        <View style={styles.content}>
          {children}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AppLayout;
