import React, { createContext, useContext, useState } from 'react';

export type BusType = 'Ordinary' | 'Low-Floor Bus' | 'Deluxe';
export type FareCategory = 'women_free' | 'regular_paid';
export type BusStatus = 'Active' | 'Inactive';

export interface Bus {
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
    setBuses((current) => [...current, { ...bus, id: `${Date.now()}-${current.length}` }]);
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
