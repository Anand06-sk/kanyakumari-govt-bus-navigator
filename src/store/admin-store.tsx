import React, { createContext, useContext, useState } from 'react';

interface AdminProfile {
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
}

interface AdminContextValue {
  profile: AdminProfile;
  updateProfile: (updates: Partial<Pick<AdminProfile, 'name' | 'email' | 'phone'>>) => void;
}

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<AdminProfile>({
    name: 'Administrator',
    email: 'admin@kanyakumari.gov.in',
    phone: '',
    role: 'Administrator',
    status: 'Active',
  });

  const updateProfile = (updates: Partial<Pick<AdminProfile, 'name' | 'email' | 'phone'>>) => {
    setProfile((current) => ({ ...current, ...updates }));
  };

  return <AdminContext.Provider value={{ profile, updateProfile }}>{children}</AdminContext.Provider>;
}

export function useAdminContext() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdminContext must be used inside AdminProvider');
  }
  return context;
}
