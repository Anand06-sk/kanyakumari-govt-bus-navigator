import React, { createContext, useContext, useMemo, useState } from 'react';

export type BusType = 'Ordinary' | 'Low-Floor Bus' | 'Deluxe';
export type FareCategory = 'women_free' | 'regular_paid';
export type BusStatus = 'Active' | 'Inactive';
export type BusServiceType =
  | 'Ordinary Town'
  | 'Express'
  | 'LSS'
  | 'Deluxe'
  | 'Mofussil Ordinary'
  | 'Ghat Ordinary'
  | 'SETC Long Distance'
  | 'Other';
export type SchemeEligibility = 'eligible' | 'not_eligible' | 'pending_verification';

export const BUS_SERVICE_TYPES: BusServiceType[] = [
  'Ordinary Town',
  'Express',
  'LSS',
  'Deluxe',
  'Mofussil Ordinary',
  'Ghat Ordinary',
  'SETC Long Distance',
  'Other',
];

export interface Bus {
  id: string;
  busNumber: string;
  busType: BusType;
  // Optional for compatibility with records created before these fields existed.
  serviceType?: BusServiceType;
  schemeEligibility?: SchemeEligibility;
  fareCategory: FareCategory;
  regularFare: number;
  womenFare: number;
  startPoint: string;
  destination: string;
  routeNumber: string;
  status: BusStatus;
  stops: string[];
}

interface BusContextValue {
  buses: Bus[];
  addBus: (bus: Omit<Bus, 'id'>) => void;
  updateBus: (id: string, updates: Partial<Omit<Bus, 'id'>>) => void;
  deleteBus: (id: string) => void;
  getBusById: (id: string | undefined) => Bus | undefined;
}

// Sample records are illustrative only and are not an official government bus list.
const initialBuses: Bus[] = [
  {
    id: 'bus-1',
    busNumber: 'TN-74-1001',
    busType: 'Ordinary',
    schemeEligibility: 'pending_verification',
    fareCategory: 'regular_paid',
    regularFare: 25,
    womenFare: 25,
    startPoint: 'Nagercoil',
    destination: 'Kanyakumari',
    routeNumber: 'KK-01',
    status: 'Active',
    stops: ['Nagercoil Bus Stand', 'Suchindram', 'Kanyakumari'],
  },
  {
    id: 'bus-2',
    busNumber: 'TN-74-2002',
    busType: 'Low-Floor Bus',
    schemeEligibility: 'pending_verification',
    fareCategory: 'women_free',
    regularFare: 18,
    womenFare: 0,
    startPoint: 'Kanyakumari',
    destination: 'Nagercoil',
    routeNumber: 'KK-02',
    status: 'Active',
    stops: ['Kanyakumari', 'Suchindram', 'Nagercoil'],
  },
];

const BusContext = createContext<BusContextValue | undefined>(undefined);

export function BusProvider({ children }: { children: React.ReactNode }) {
  const [buses, setBuses] = useState<Bus[]>(initialBuses);

  const addBus = (bus: Omit<Bus, 'id'>) => {
    const newBus: Bus = {
      ...bus,
      schemeEligibility: bus.schemeEligibility ?? 'pending_verification',
      id: `bus-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    };

    setBuses((current) => [newBus, ...current]);
  };

  const updateBus = (id: string, updates: Partial<Omit<Bus, 'id'>>) => {
    setBuses((current) =>
      current.map((bus) => (bus.id === id ? { ...bus, ...updates } : bus))
    );
  };

  const deleteBus = (id: string) => {
    setBuses((current) => current.filter((bus) => bus.id !== id));
  };

  const getBusById = (id: string | undefined) => {
    if (!id) return undefined;
    return buses.find((bus) => bus.id === id);
  };

  const value = useMemo<BusContextValue>(
    () => ({ buses, addBus, updateBus, deleteBus, getBusById }),
    [buses]
  );

  return <BusContext.Provider value={value}>{children}</BusContext.Provider>;
}

export function useBusContext(): BusContextValue {
  const context = useContext(BusContext);

  if (!context) {
    throw new Error('useBusContext must be used within a BusProvider');
  }

  return context;
}

export function getSchemeEligibility(bus: Pick<Bus, 'schemeEligibility'>): SchemeEligibility {
  return bus.schemeEligibility ?? 'pending_verification';
}
