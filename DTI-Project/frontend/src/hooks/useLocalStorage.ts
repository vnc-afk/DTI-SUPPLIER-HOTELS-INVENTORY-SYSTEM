import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for managing localStorage with JSON serialization
 * @example
 * const [user, setUser] = useLocalStorage('user', null);
 */
export const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void, boolean] => {
  const initialValueRef = useRef(initialValue);
  const [storedValue, setStoredValue] = useState<T>(initialValueRef.current);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      setStoredValue(item ? JSON.parse(item) : initialValueRef.current);
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      setStoredValue(initialValueRef.current);
    } finally {
      setIsHydrated(true);
    }
  }, [key]);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue, isHydrated];
};

/**
 * Clear a specific localStorage item
 */
export const useClearLocalStorage = (key: string) => {
  return useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error clearing localStorage key "${key}":`, error);
    }
  }, [key]);
};
