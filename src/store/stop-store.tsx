import React, { createContext, useContext, useMemo, useState } from 'react';

export type StopStatus = 'Active' | 'Inactive';

export type BusStop = {
  id: string;
  name: string;
  area: string;
  routes: string[];
  status: StopStatus;
};

type StopContextValue = {
  stops: BusStop[];
  addStop: (stop: Omit<BusStop, 'id'>) => void;
  updateStop: (id: string, updates: Partial<BusStop>) => void;
  deleteStop: (id: string) => void;
  getStopById: (id: string | undefined) => BusStop | undefined;
  isDuplicateName: (name: string, excludeId?: string) => boolean;
};

const initialStops: BusStop[] = [
  {
    id: 'stop-1',
    name: 'Nagercoil Bus Stand',
    area: 'Nagercoil',
    routes: ['KK-01', 'KK-02'],
    status: 'Active',
  },
  {
    id: 'stop-2',
    name: 'Suchindram',
    area: 'Suchindram',
    routes: ['KK-01', 'KK-02'],
    status: 'Active',
  },
  {
    id: 'stop-3',
    name: 'Kanyakumari',
    area: 'Kanyakumari',
    routes: ['KK-01', 'KK-02'],
    status: 'Active',
  },
];

const StopContext = createContext<StopContextValue | undefined>(undefined);

export function StopProvider({ children }: { children: React.ReactNode }) {
  const [stops, setStops] = useState<BusStop[]>(initialStops);

  const addStop = (stop: Omit<BusStop, 'id'>) => {
    const newStop: BusStop = {
      ...stop,
      id: `stop-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    };

    setStops((current) => [newStop, ...current]);
  };

  const updateStop = (id: string, updates: Partial<BusStop>) => {
    setStops((current) =>
      current.map((stop) => (stop.id === id ? { ...stop, ...updates } : stop))
    );
  };

  const deleteStop = (id: string) => {
    setStops((current) => current.filter((stop) => stop.id !== id));
  };

  const getStopById = (id: string | undefined) => {
    if (!id) return undefined;
    return stops.find((stop) => stop.id === id);
  };

  const isDuplicateName = (name: string, excludeId?: string) =>
    stops.some(
      (stop) =>
        stop.id !== excludeId &&
        stop.name.trim().toLowerCase() === name.trim().toLowerCase()
    );

  const value = useMemo<StopContextValue>(
    () => ({ stops, addStop, updateStop, deleteStop, getStopById, isDuplicateName }),
    [stops]
  );

  return <StopContext.Provider value={value}>{children}</StopContext.Provider>;
}

export function useStopContext(): StopContextValue {
  const context = useContext(StopContext);

  if (!context) {
    throw new Error('useStopContext must be used within a StopProvider');
  }

  return context;
}
