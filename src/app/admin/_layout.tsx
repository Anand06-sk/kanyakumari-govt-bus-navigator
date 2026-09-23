import React from 'react';
import { Stack } from 'expo-router';
import { AdminProvider } from '../../store/admin-store';

export default function AdminLayout() {
  return (
    <AdminProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AdminProvider>
  );
}
