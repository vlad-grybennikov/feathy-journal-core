'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  googleLogin as googleLoginApi,
  getMe,
  clearTokens,
  getAccessToken,
  hydrateTokens,
  AuthUser,
} from '../api/auth';
import { getConfig } from '../config';

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, load persisted tokens into memory, then restore the session.
  // Hydration must finish before any request goes out, or it goes unauthenticated.
  useEffect(() => {
    const restore = async () => {
      try {
        await hydrateTokens();
        if (!getAccessToken()) return;
        setUser(await getMe());
      } catch {
        await clearTokens();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    restore();
  }, []);

  const loginWithGoogle = useCallback(async (idToken: string) => {
    const loggedIn = await googleLoginApi(idToken);
    setUser(loggedIn);
  }, []);

  const logout = useCallback(async () => {
    await clearTokens();
    setUser(null);
    getConfig().onAuthFailure?.();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
