import { useState, useCallback } from 'react';
import { User, UserRole } from '@/types';
import { useLocalStorage } from './useLocalStorage';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

/**
 * Custom hook for authentication state management
 * @example
 * const { user, login, logout, isAuthenticated } = useAuth();
 */
export const useAuth = () => {
  const [auth, setAuth] = useLocalStorage<AuthState>('auth', {
    user: null,
    token: null,
    isAuthenticated: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (email: string, password: string, role: UserRole) => {
      setIsLoading(true);
      setError(null);

      try {
        // Mock authentication - replace with actual API call
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, role }),
        });

        if (!response.ok) throw new Error('Login failed');

        const { user, token } = await response.json();

        setAuth({
          user,
          token,
          isAuthenticated: true,
        });

        return user;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [setAuth]
  );

  const logout = useCallback(() => {
    setAuth({ user: null, token: null, isAuthenticated: false });
    setError(null);
  }, [setAuth]);

  const updateUser = useCallback(
    (updatedUser: Partial<User>) => {
      if (auth.user) {
        setAuth({
          ...auth,
          user: { ...auth.user, ...updatedUser },
        });
      }
    },
    [auth, setAuth]
  );

  const hasRole = useCallback((role: UserRole): boolean => {
    return auth.user?.role === role;
  }, [auth.user]);

  const hasAnyRole = useCallback(
    (roles: UserRole[]): boolean => {
      return auth.user ? roles.includes(auth.user.role) : false;
    },
    [auth.user]
  );

  return {
    ...auth,
    isLoading,
    error,
    login,
    logout,
    updateUser,
    hasRole,
    hasAnyRole,
  };
};
