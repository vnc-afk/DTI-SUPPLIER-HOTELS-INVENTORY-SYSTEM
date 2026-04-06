import { useState, useEffect, useCallback } from 'react';
import { api } from '@/services/api';

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
      const result = await requestData<T>(url, options);
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

async function requestData<T>(url: string, options?: RequestInit): Promise<T> {
  if (typeof window !== 'undefined' && url.startsWith('/api/')) {
    const parsedUrl = new URL(url, window.location.origin);
    const endpoint = parsedUrl.pathname.replace(/^\/api/, '');

    if ((options?.method || 'GET') !== 'GET') {
      throw new Error('useFetch currently supports GET requests only for tRPC-backed endpoints');
    }

    switch (endpoint) {
      case '/dashboard':
        return api.dashboard.get('', parsedUrl.searchParams.get('role') || 'supplier') as Promise<T>;
      case '/alerts':
        return api.alerts.list('') as Promise<T>;
      case '/audit-logs':
        return api.auditLogs.list('', parsedUrl.searchParams.get('search') || undefined) as Promise<T>;
      case '/users':
        return api.users.list('', parsedUrl.searchParams.get('search') || undefined) as Promise<T>;
      case '/products':
        return api.products.list('', parsedUrl.searchParams.get('query') || undefined) as Promise<T>;
      case '/consignments':
        return api.consignments.list('') as Promise<T>;
      case '/sales/recent':
        return api.sales.recent('') as Promise<T>;
      case '/payments':
        return api.payments.list('', parsedUrl.searchParams.get('query') || undefined) as Promise<T>;
      case '/reports/sales':
        return api.reports.sales('') as Promise<T>;
      case '/reports/performance':
        return api.reports.performance('') as Promise<T>;
      case '/reports/monitoring':
        return api.reports.monitoring('') as Promise<T>;
      case '/reports/compliance':
        return api.reports.compliance('') as Promise<T>;
      default:
        break;
    }
  }

  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
}
