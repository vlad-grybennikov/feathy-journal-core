'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getProviders, type IProvider } from '../api';
import { useAuth } from './AuthContext';

interface ProvidersContextValue {
  providers: IProvider[];
  byType: Record<string, IProvider>;
  isLoading: boolean;
}

const ProvidersContext = createContext<ProvidersContextValue | undefined>(undefined);

/** Loads the provider catalog (brand colors, groups) once, shared app-wide. */
export const ProvidersProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [providers, setProviders] = useState<IProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProviders([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    getProviders()
      .then(setProviders)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [user]);

  const byType = useMemo(
    () => Object.fromEntries(providers.map((p) => [p.type, p])) as Record<string, IProvider>,
    [providers],
  );
  const value = useMemo(() => ({ providers, byType, isLoading }), [providers, byType, isLoading]);

  return <ProvidersContext.Provider value={value}>{children}</ProvidersContext.Provider>;
};

export const useProviders = (): ProvidersContextValue => {
  const ctx = useContext(ProvidersContext);
  if (!ctx) throw new Error('useProviders must be used within a ProvidersProvider');
  return ctx;
};
