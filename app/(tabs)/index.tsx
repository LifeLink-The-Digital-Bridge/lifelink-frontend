import React from 'react';
import AppLayout from '../../components/AppLayout';
import Dashboard from '../navigation/dashboard';

export default function HomeScreen() {
  return (
    <AppLayout title="Home" hideHeader>
      <Dashboard />
    </AppLayout>
  );
}
