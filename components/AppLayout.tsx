import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  hideHeader?: boolean;
}

const AppLayout = ({ children, title = "", hideHeader = false }: AppLayoutProps) => (
  <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
    <StatusBar barStyle="dark-content" backgroundColor="#f6f8fa" />
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f6f8fa',
  },
  container: { flex: 1 },
  header: {
    height: 60,
    backgroundColor: '#0984e3',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
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
  content: { flex: 1 },
  footer: {
    height: 50,
    backgroundColor: '#f1f2f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#dfe4ea',
  },
  footerText: {
    color: '#636e72',
    fontSize: 14,
  },
});

export default AppLayout;
