import React, { createContext, useContext, useMemo, useState } from 'react';

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

const initialRoutes: Route[] = [
  {
    id: 'route-1',
    routeNumber: 'KK-01',
    routeName: 'Nagercoil to Kanyakumari',
    startPoint: 'Nagercoil',
    destination: 'Kanyakumari',
    buses: 5,
    stops: ['Nagercoil Bus Stand', 'Suchindram', 'Kanyakumari'],
    status: 'Active',
  },
  {
    id: 'route-2',
    routeNumber: 'KK-02',
    routeName: 'Kanyakumari to Nagercoil',
    startPoint: 'Kanyakumari',
    destination: 'Nagercoil',
    buses: 4,
    stops: ['Kanyakumari', 'Suchindram', 'Nagercoil Bus Stand'],
    status: 'Active',
  },
];

const RouteContext = createContext<RouteContextValue | undefined>(undefined);

export function RouteProvider({ children }: { children: React.ReactNode }) {
  const [routes, setRoutes] = useState<Route[]>(initialRoutes);

  const addRoute = (route: Omit<Route, 'id'>) => {
    const newRoute: Route = {
      ...route,
      id: `route-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    };

    setRoutes((current) => [newRoute, ...current]);
  };

  const updateRoute = (id: string, updates: Partial<Omit<Route, 'id'>>) => {
    setRoutes((current) =>
      current.map((route) => (route.id === id ? { ...route, ...updates } : route))
    );
  };

  const deleteRoute = (id: string) => {
    setRoutes((current) => current.filter((route) => route.id !== id));
  };

  const getRouteById = (id: string | undefined) => {
    if (!id) return undefined;
    return routes.find((route) => route.id === id);
  };

  const value = useMemo<RouteContextValue>(
    () => ({ routes, addRoute, updateRoute, deleteRoute, getRouteById }),
    [routes]
  );

  return <RouteContext.Provider value={value}>{children}</RouteContext.Provider>;
}

export function useRouteContext(): RouteContextValue {
  const context = useContext(RouteContext);

  if (!context) {
    throw new Error('useRouteContext must be used within a RouteProvider');
  }

  return context;
}
