import React, { createContext, useContext, useState } from 'react';

export type RouteStatus = 'Active' | 'Inactive';

export interface Route {
  id: string;
  routeNumber: string;
  routeName: string;
  startPoint: string;
  destination: string;
  buses: number;
  stops: string[];
  status: RouteStatus;
}

interface RouteContextValue {
  routes: Route[];
  addRoute: (route: Omit<Route, 'id'>) => void;
  updateRoute: (id: string, updates: Partial<Omit<Route, 'id'>>) => void;
  deleteRoute: (id: string) => void;
  getRouteById: (id: string | undefined) => Route | undefined;
}

const RouteContext = createContext<RouteContextValue | undefined>(undefined);

export function RouteProvider({ children }: { children: React.ReactNode }) {
  const [routes, setRoutes] = useState<Route[]>([]);

  const addRoute = (route: Omit<Route, 'id'>) => {
    setRoutes((current) => [...current, { ...route, id: `${Date.now()}-${current.length}` }]);
  };

  const updateRoute = (id: string, updates: Partial<Omit<Route, 'id'>>) => {
    setRoutes((current) => current.map((route) => (route.id === id ? { ...route, ...updates } : route)));
  };

  const deleteRoute = (id: string) => {
    setRoutes((current) => current.filter((route) => route.id !== id));
  };

  const getRouteById = (id: string | undefined) => routes.find((route) => route.id === id);

  return (
    <RouteContext.Provider value={{ routes, addRoute, updateRoute, deleteRoute, getRouteById }}>
      {children}
    </RouteContext.Provider>
  );
}

export function useRouteContext() {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error('useRouteContext must be used inside RouteProvider');
  }
  return context;
}
