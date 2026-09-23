import React, { createContext, useContext, useState } from 'react';

export type StopStatus = 'Active' | 'Inactive';

export interface BusStop {
  id: string;
  name: string;
  area: string;
  routes: string[];
  status: StopStatus;
}

interface StopContextValue {
  stops: BusStop[];
  addStop: (stop: Omit<BusStop, 'id'>) => void;
  updateStop: (id: string, updates: Partial<Omit<BusStop, 'id'>>) => void;
  deleteStop: (id: string) => void;
  getStopById: (id: string | undefined) => BusStop | undefined;
  isDuplicateName: (name: string, excludeId?: string) => boolean;
}

const StopContext = createContext<StopContextValue | undefined>(undefined);

export function StopProvider({ children }: { children: React.ReactNode }) {
  const [stops, setStops] = useState<BusStop[]>([]);

  const addStop = (stop: Omit<BusStop, 'id'>) => {
    setStops((current) => [...current, { ...stop, id: `${Date.now()}-${current.length}` }]);
  };

  const updateStop = (id: string, updates: Partial<Omit<BusStop, 'id'>>) => {
    setStops((current) => current.map((stop) => (stop.id === id ? { ...stop, ...updates } : stop)));
  };

  const deleteStop = (id: string) => {
    setStops((current) => current.filter((stop) => stop.id !== id));
  };

  const getStopById = (id: string | undefined) => stops.find((stop) => stop.id === id);

  const isDuplicateName = (name: string, excludeId?: string) =>
    stops.some(
      (stop) => stop.id !== excludeId && stop.name.trim().toLowerCase() === name.trim().toLowerCase(),
    );

  return (
    <StopContext.Provider value={{ stops, addStop, updateStop, deleteStop, getStopById, isDuplicateName }}>
      {children}
    </StopContext.Provider>
  );
}

export function useStopContext() {
  const context = useContext(StopContext);
  if (!context) {
    throw new Error('useStopContext must be used inside StopProvider');
  }
  return context;
}
