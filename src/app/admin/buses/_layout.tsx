// src/app/admin/buses/_layout.tsx
// Nested layout — scoped only to /admin/buses/*, does not touch the root layout.

import React from 'react';
import { Stack } from 'expo-router';
import { RouteProvider } from '../../../store/route-store';

export default function BusesLayout() {
  return (
    <RouteProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </RouteProvider>
  );
}