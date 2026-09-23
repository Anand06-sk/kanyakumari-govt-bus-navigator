// src/app/admin/reports/_layout.tsx
// Nested layout — scoped only to /admin/reports/*, does not touch the root layout.
// Wraps Bus, Route, and Stop providers so Reports can read all three data sources.

import React from 'react';
import { Stack } from 'expo-router';
import { BusProvider } from '../../../store/bus-store';
import { RouteProvider } from '../../../store/route-store';
import { StopProvider } from '../../../store/stop-store';

export default function ReportsLayout() {
  return (
    <BusProvider>
      <RouteProvider>
        <StopProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </StopProvider>
      </RouteProvider>
    </BusProvider>
  );
}