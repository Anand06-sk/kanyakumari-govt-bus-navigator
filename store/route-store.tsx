import React, { createContext, useContext, useMemo, useState } from 'react';

export type RouteStatus = 'Active' | 'Inactive';

export type Route = {
  id: string;
  routeNumber: string;
  routeName: string;
  startPoint: string;
  destination: string;
  buses: number;
  stops: string[];
  status: RouteStatus;
};

type RouteContextValue = {
  routes: Route[];
  addRoute: (newRoute: Omit<Route, 'id'>) => void;
  updateRoute: (id: string, updates: Partial<Route>) => void;
  deleteRoute: (id: string) => void;
  getRouteById: (id: string | undefined) => Route | undefined;
};

const initialRoutes: Route[] = [
  {
    id: 'route-1',
    routeNumber: 'R-12',
    routeName: 'Nagercoil to Kanyakumari',
    startPoint: 'Nagercoil',
    destination: 'Kanyakumari',
    buses: 5,
    stops: ['Nagercoil', 'Suchindram', 'Kanyakumari'],
    status: 'Active',
  },
  {
    id: 'route-2',
    routeNumber: 'R-09',
    routeName: 'Suchindram to Nagercoil',
    startPoint: 'Suchindram',
    destination: 'Nagercoil',
    buses: 3,
    stops: ['Suchindram', 'Tiruvattar', 'Nagercoil'],
    status: 'Active',
  },
  {
    id: 'route-3',
    routeNumber: 'R-22',
    routeName: 'Kanyakumari to Nagercoil',
    startPoint: 'Kanyakumari',
    destination: 'Nagercoil',
    buses: 2,
    stops: ['Kanyakumari', 'Nagercoil'],
    status: 'Inactive',
  },
];

const RouteContext = createContext<RouteContextValue | undefined>(undefined);

export function RouteProvider({ children }: { children: React.ReactNode }) {
  const [routes, setRoutes] = useState<Route[]>(initialRoutes);

  const addRoute = (newRoute: Omit<Route, 'id'>) => {
    setRoutes((current) => [{ ...newRoute, id: `route-${Date.now()}-${Math.random().toString(16).slice(2)}` }, ...current]);
  };

  const updateRoute = (id: string, updates: Partial<Route>) => {
    setRoutes((current) => current.map((route) => (route.id === id ? { ...route, ...updates } : route)));
  };

  const deleteRoute = (id: string) => {
    setRoutes((current) => current.filter((route) => route.id !== id));
  };

  const getRouteById = (id: string | undefined) => {
    if (!id) {
      return undefined;
    }

    return routes.find((route) => route.id === id);
  };

  const value = useMemo<RouteContextValue>(() => ({ routes, addRoute, updateRoute, deleteRoute, getRouteById }), [routes]);

  return <RouteContext.Provider value={value}>{children}</RouteContext.Provider>;
}

export function useRouteContext(): RouteContextValue {
  const context = useContext(RouteContext);

  if (!context) {
    throw new Error('useRouteContext must be used within a RouteProvider');
  }

  return context;
}
