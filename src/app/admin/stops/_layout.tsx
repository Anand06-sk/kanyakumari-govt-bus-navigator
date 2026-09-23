// src/app/admin/stops/_layout.tsx
// Nested layout — scoped only to /admin/stops/*, does not touch the root layout.

import React from 'react';
import { Stack } from 'expo-router';
import { StopProvider } from '../../../store/stop-store';
import { RouteProvider } from '../../../store/route-store';

export default function StopsLayout() {
  return (
    <RouteProvider>
      <StopProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </StopProvider>
    </RouteProvider>
  );
}