import React from 'react';
import { useRole } from '../../utils/role-context';
import AppLayout from '../../components/AppLayout';
import Dashboard from '../navigation/dashboard';
import MigrantDashboardScreen from '../navigation/healthscreens/MigrantDashboardScreen';
import DoctorDashboardScreen from '../navigation/healthscreens/DoctorDashboardScreen';
import NGODashboardScreen from '../navigation/healthscreens/NGODashboardScreen';
import AdminDashboardScreen from '../navigation/healthscreens/AdminDashboardScreen';

export default function HomeScreen() {
  const { isMigrant, isDoctor, isNGO, isAdmin } = useRole();

  if (isAdmin) {
    return (
      <AppLayout>
        <AdminDashboardScreen />
      </AppLayout>
    );
  }

  if (isDoctor) {
    return (
      <AppLayout>
        <DoctorDashboardScreen />
      </AppLayout>
    );
  }

  if (isNGO) {
    return (
      <AppLayout>
        <NGODashboardScreen />
      </AppLayout>
    );
  }

  if (isMigrant) {
    return (
      <AppLayout>
        <MigrantDashboardScreen />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Dashboard />
    </AppLayout>
  );
}
