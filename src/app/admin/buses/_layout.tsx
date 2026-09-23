// src/app/admin/buses/_layout.tsx
// Nested layout — scoped only to /admin/buses/*, does not touch the root layout.

import React from 'react';
import { Stack } from 'expo-router';
import { BusProvider } from '../../../store/bus-store';
import { RouteProvider } from '../../../store/route-store';

export default function BusesLayout() {
  return (
    <RouteProvider>
      <BusProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </BusProvider>
    </RouteProvider>
  );
}