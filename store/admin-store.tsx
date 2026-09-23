import React, { createContext, useContext, useMemo, useState } from 'react';

export type AdminProfile = {
  name: string;
  role: string;
  email: string;
  phone: string;
  status: string;
};

type AdminContextValue = {
  profile: AdminProfile;
  updateProfile: (updates: Partial<AdminProfile>) => void;
};

const defaultProfile: AdminProfile = {
  name: 'Admin User',
  role: 'Administrator',
  email: 'admin@kanyakumari.gov.in',
  phone: '+91 98765 43210',
  status: 'Active',
};

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<AdminProfile>(defaultProfile);

  const updateProfile = (updates: Partial<AdminProfile>) => {
    setProfile((current) => ({ ...current, ...updates }));
  };

  const value = useMemo<AdminContextValue>(() => ({ profile, updateProfile }), [profile]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdminContext(): AdminContextValue {
  const context = useContext(AdminContext);

  if (!context) {
    throw new Error('useAdminContext must be used within an AdminProvider');
  }

  return context;
}
