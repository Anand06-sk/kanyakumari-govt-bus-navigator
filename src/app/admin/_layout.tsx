import React from 'react';
import { Stack } from 'expo-router';
import { AdminProvider } from '../../store/admin-store';
import { BusProvider } from '../../store/bus-store';

export default function AdminLayout() {
  return (
    <AdminProvider>
      <BusProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </BusProvider>
    </AdminProvider>
  );
}
