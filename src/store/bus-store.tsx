import React, { createContext, useContext, useState } from 'react';

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
  // Optional only for compatibility with bus records created before these fields existed.
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

const BusContext = createContext<BusContextValue | undefined>(undefined);

export function BusProvider({ children }: { children: React.ReactNode }) {
  const [buses, setBuses] = useState<Bus[]>([]);

  const addBus = (bus: Omit<Bus, 'id'>) => {
    setBuses((current) => [
      ...current,
      {
        ...bus,
        schemeEligibility: bus.schemeEligibility ?? 'pending_verification',
        id: `${Date.now()}-${current.length}`,
      },
    ]);
  };

  const updateBus = (id: string, updates: Partial<Omit<Bus, 'id'>>) => {
    setBuses((current) => current.map((bus) => (bus.id === id ? { ...bus, ...updates } : bus)));
  };

  const deleteBus = (id: string) => {
    setBuses((current) => current.filter((bus) => bus.id !== id));
  };

  const getBusById = (id: string | undefined) => buses.find((bus) => bus.id === id);

  return (
    <BusContext.Provider value={{ buses, addBus, updateBus, deleteBus, getBusById }}>
      {children}
    </BusContext.Provider>
  );
}

export function useBusContext() {
  const context = useContext(BusContext);
  if (!context) {
    throw new Error('useBusContext must be used inside BusProvider');
  }
  return context;
}

export function getSchemeEligibility(bus: Pick<Bus, 'schemeEligibility'>): SchemeEligibility {
  return bus.schemeEligibility ?? 'pending_verification';
}
