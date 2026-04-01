import { API_ENDPOINTS, API_TIMEOUT } from '@/lib/constants';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  token?: string;
}

/**
 * API Service - centralized API communication
 */
class ApiService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', headers = {}, body, token } = options;

    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    if (body && method !== 'GET') {
      config.body = JSON.stringify(body);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'API Error' }));
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error instanceof Error ? error : new Error('Network error');
    }
  }

  // ── Auth ──────────────────────────────────────────────────────────────────
  auth = {
    login: (email: string, password: string, role: string) =>
      this.request('/auth/login', {
        method: 'POST',
        body: { email, password, role },
      }),

    logout: (token: string) =>
      this.request('/auth/logout', {
        method: 'POST',
        token,
      }),

    me: (token: string) =>
      this.request('/auth/me', {
        token,
      }),
  };

  // ── Products ──────────────────────────────────────────────────────────────
  products = {
    list: (token: string, query?: string) =>
      this.request(`${API_ENDPOINTS.PRODUCTS}${query || ''}`, { token }),

    get: (id: string, token: string) =>
      this.request(`${API_ENDPOINTS.PRODUCTS}/${id}`, { token }),

    create: (data: any, token: string) =>
      this.request(API_ENDPOINTS.PRODUCTS, {
        method: 'POST',
        body: data,
        token,
      }),

    update: (id: string, data: any, token: string) =>
      this.request(`${API_ENDPOINTS.PRODUCTS}/${id}`, {
        method: 'PUT',
        body: data,
        token,
      }),

    delete: (id: string, token: string) =>
      this.request(`${API_ENDPOINTS.PRODUCTS}/${id}`, {
        method: 'DELETE',
        token,
      }),
  };

  // ── Sales ─────────────────────────────────────────────────────────────────
  sales = {
    list: (token: string, query?: string) =>
      this.request(`${API_ENDPOINTS.SALES}${query || ''}`, { token }),

    create: (data: any, token: string) =>
      this.request(API_ENDPOINTS.SALES, {
        method: 'POST',
        body: data,
        token,
      }),

    getReports: (token: string, query?: string) =>
      this.request(`${API_ENDPOINTS.REPORTS}${query || ''}`, { token }),
  };

  // ── Payments ──────────────────────────────────────────────────────────────
  payments = {
    list: (token: string, query?: string) =>
      this.request(`${API_ENDPOINTS.PAYMENTS}${query || ''}`, { token }),

    get: (id: string, token: string) =>
      this.request(`${API_ENDPOINTS.PAYMENTS}/${id}`, { token }),

    submit: (data: any, token: string) =>
      this.request(API_ENDPOINTS.PAYMENTS, {
        method: 'POST',
        body: data,
        token,
      }),
  };

  // ── Consignments ──────────────────────────────────────────────────────────
  consignments = {
    list: (token: string, query?: string) =>
      this.request(`${API_ENDPOINTS.CONSIGNMENTS}${query || ''}`, { token }),

    get: (id: string, token: string) =>
      this.request(`${API_ENDPOINTS.CONSIGNMENTS}/${id}`, { token }),
  };
}

export const api = new ApiService();
