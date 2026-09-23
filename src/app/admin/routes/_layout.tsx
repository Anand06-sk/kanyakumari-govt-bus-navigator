// src/app/admin/routes/_layout.tsx
// Nested layout — scoped only to /admin/routes/*, does not touch the root layout.

import React from 'react';
import { Stack } from 'expo-router';
import { RouteProvider } from '../../../store/route-store';

export default function RoutesLayout() {
  return (
    <RouteProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </RouteProvider>
  );
}