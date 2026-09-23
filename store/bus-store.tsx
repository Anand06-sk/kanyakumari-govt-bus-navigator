import React, { createContext, useContext, useMemo, useState } from 'react';

export type BusType = 'Ordinary' | 'Low-Floor Bus' | 'Deluxe';
export type FareCategory = 'women_free' | 'regular_paid';
export type BusStatus = 'Active' | 'Inactive';

export type Bus = {
  id: string;
  busNumber: string;
  busType: BusType;
  fareCategory: FareCategory;
  regularFare: number;
  womenFare: number;
  startPoint: string;
  destination: string;
  routeNumber: string;
  status: BusStatus;
  stops: string[];
};

type BusContextValue = {
  buses: Bus[];
  addBus: (newBus: Omit<Bus, 'id'>) => void;
  updateBus: (id: string, updates: Partial<Bus>) => void;
  deleteBus: (id: string) => void;
  getBusById: (id: string | undefined) => Bus | undefined;
};

const initialBuses: Bus[] = [
  {
    id: 'bus-1',
    busNumber: 'TN-74-1001',
    busType: 'Ordinary',
    fareCategory: 'regular_paid',
    regularFare: 18,
    womenFare: 18,
    startPoint: 'Nagercoil',
    destination: 'Kanyakumari',
    routeNumber: 'R-12',
    status: 'Active',
    stops: ['Nagercoil', 'Suchindram', 'Kanyakumari'],
  },
  {
    id: 'bus-2',
    busNumber: 'TN-74-2002',
    busType: 'Low-Floor Bus',
    fareCategory: 'women_free',
    regularFare: 22,
    womenFare: 0,
    startPoint: 'Suchindram',
    destination: 'Nagercoil',
    routeNumber: 'R-09',
    status: 'Active',
    stops: ['Suchindram', 'Tiruvattar', 'Nagercoil'],
  },
  {
    id: 'bus-3',
    busNumber: 'TN-74-3003',
    busType: 'Deluxe',
    fareCategory: 'regular_paid',
    regularFare: 30,
    womenFare: 30,
    startPoint: 'Kanyakumari',
    destination: 'Nagercoil',
    routeNumber: 'R-22',
    status: 'Inactive',
    stops: ['Kanyakumari', 'Nagercoil'],
  },
];

const BusContext = createContext<BusContextValue | undefined>(undefined);

export function BusProvider({ children }: { children: React.ReactNode }) {
  const [buses, setBuses] = useState<Bus[]>(initialBuses);

  const addBus = (newBus: Omit<Bus, 'id'>) => {
    setBuses((current) => [{ ...newBus, id: `bus-${Date.now()}-${Math.random().toString(16).slice(2)}` }, ...current]);
  };

  const updateBus = (id: string, updates: Partial<Bus>) => {
    setBuses((current) => current.map((bus) => (bus.id === id ? { ...bus, ...updates } : bus)));
  };

  const deleteBus = (id: string) => {
    setBuses((current) => current.filter((bus) => bus.id !== id));
  };

  const getBusById = (id: string | undefined) => {
    if (!id) {
      return undefined;
    }

    return buses.find((bus) => bus.id === id);
  };

  const value = useMemo<BusContextValue>(() => ({ buses, addBus, updateBus, deleteBus, getBusById }), [buses]);

  return <BusContext.Provider value={value}>{children}</BusContext.Provider>;
}

export function useBusContext(): BusContextValue {
  const context = useContext(BusContext);

  if (!context) {
    throw new Error('useBusContext must be used within a BusProvider');
  }

  return context;
}
