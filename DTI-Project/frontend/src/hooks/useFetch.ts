import { useState, useEffect, useCallback } from 'react';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Custom hook for data fetching with loading and error states
 * @example
 * const { data, loading, error } = useFetch('/api/products');
 */
export const useFetch = <T,>(url: string, options?: RequestInit): FetchState<T> & { refetch: () => void } => {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const result = await response.json();
      setState({ data: result, loading: false, error: null });
    } catch (err) {
      setState({ data: null, loading: false, error: err instanceof Error ? err : new Error('Unknown error') });
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
};
