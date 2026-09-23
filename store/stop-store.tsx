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
  addStop: (newStop: Omit<BusStop, 'id'>) => void;
  updateStop: (id: string, updates: Partial<BusStop>) => void;
  deleteStop: (id: string) => void;
  getStopById: (id: string | undefined) => BusStop | undefined;
  isDuplicateName: (name: string, ignoreId?: string) => boolean;
};

const initialStops: BusStop[] = [
  {
    id: 'stop-1',
    name: 'Nagercoil',
    area: 'Town Center',
    routes: ['R-12', 'R-09'],
    status: 'Active',
  },
  {
    id: 'stop-2',
    name: 'Suchindram',
    area: 'Temple Road',
    routes: ['R-12'],
    status: 'Active',
  },
  {
    id: 'stop-3',
    name: 'Kanyakumari',
    area: 'Beach Road',
    routes: ['R-12', 'R-22'],
    status: 'Inactive',
  },
];

const StopContext = createContext<StopContextValue | undefined>(undefined);

export function StopProvider({ children }: { children: React.ReactNode }) {
  const [stops, setStops] = useState<BusStop[]>(initialStops);

  const addStop = (newStop: Omit<BusStop, 'id'>) => {
    setStops((current) => [{ ...newStop, id: `stop-${Date.now()}-${Math.random().toString(16).slice(2)}` }, ...current]);
  };

  const updateStop = (id: string, updates: Partial<BusStop>) => {
    setStops((current) => current.map((stop) => (stop.id === id ? { ...stop, ...updates } : stop)));
  };

  const deleteStop = (id: string) => {
    setStops((current) => current.filter((stop) => stop.id !== id));
  };

  const getStopById = (id: string | undefined) => {
    if (!id) {
      return undefined;
    }

    return stops.find((stop) => stop.id === id);
  };

  const isDuplicateName = (name: string, ignoreId?: string) => {
    const normalizedName = name.trim().toLowerCase();

    return stops.some((stop) => {
      if (ignoreId && stop.id === ignoreId) {
        return false;
      }

      return stop.name.trim().toLowerCase() === normalizedName;
    });
  };

  const value = useMemo<StopContextValue>(() => ({ stops, addStop, updateStop, deleteStop, getStopById, isDuplicateName }), [stops]);

  return <StopContext.Provider value={value}>{children}</StopContext.Provider>;
}

export function useStopContext(): StopContextValue {
  const context = useContext(StopContext);

  if (!context) {
    throw new Error('useStopContext must be used within a StopProvider');
  }

  return context;
}
