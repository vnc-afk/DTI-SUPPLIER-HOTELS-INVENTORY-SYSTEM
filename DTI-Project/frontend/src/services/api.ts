import { trpcClient } from '@/lib/trpc';

interface RequestOptions {
  body?: Record<string, unknown>;
}

/**
 * API Service - centralized API communication
 */
class ApiService {
  // ── Auth ──────────────────────────────────────────────────────────────────
  auth = {
    login: (email: string, password: string, role: string) =>
      trpcClient.auth.login.mutate({ email, password }),

    logout: (token: string) =>
      trpcClient.auth.logout.mutate({ token }),

    me: (token: string) =>
      trpcClient.auth.me.query({ token }),
  };

  // ── Products ──────────────────────────────────────────────────────────────
  products = {
    list: (token: string, query?: string) =>
      trpcClient.products.list.query(undefined),

    create: (data: Record<string, unknown>, token: string) => {
      // Strip out token parameter for tRPC call
      const { token: _, ...input } = data;
      return trpcClient.products.create.mutate(input as unknown as { name: string; price: number; description?: string });
    },
  };

  // ── Sales ─────────────────────────────────────────────────────────────────
  sales = {
    list: (token: string, query?: string) =>
      trpcClient.sales.recent.query(undefined),

    recent: (token: string) =>
      trpcClient.sales.recent.query(undefined),

    create: (data: Record<string, unknown>, token: string) => {
      // Strip out token parameter for tRPC call
      const { token: _, ...input } = data;
      return trpcClient.sales.create.mutate(input as unknown as { productId: string; quantity: number; hotelId?: string });
    },

    getReports: (token: string, query?: string) =>
      trpcClient.reports.sales.query(undefined),
  };

  // ── Payments ──────────────────────────────────────────────────────────────
  payments = {
    list: (token: string, query?: string) =>
      trpcClient.payments.list.query(undefined),

    get: (id: string, token: string) =>
      trpcClient.payments.list.query(undefined),

    submit: (data: Record<string, unknown>, token: string) => {
      // Strip out token parameter for tRPC call
      const { token: _, ...input } = data;
      return trpcClient.payments.submit.mutate(input as unknown as { amount: number; supplierName: string; hotelName: string; referenceNumber?: string; paymentDate?: string });
    },
  };

  // ── Consignments ──────────────────────────────────────────────────────────
  consignments = {
    list: (token: string, query?: string) =>
      trpcClient.consignments.list.query(undefined),

    get: (id: string, token: string) =>
      trpcClient.consignments.list.query(undefined),
  };

  dashboard = {
    get: (token: string, role: string) =>
      trpcClient.dashboard.get.query({ role: (role?.toLowerCase() as 'supplier' | 'hotel' | 'admin') || 'hotel' }),
  };

  users = {
    list: (token: string, query?: string) =>
      trpcClient.users.list.query({ search: query }),

    create: (data: Record<string, unknown>, token: string) => {
      // Strip out token parameter for tRPC call
      const { token: _, ...input } = data;
      return trpcClient.users.create.mutate(input as unknown as { email: string; name: string; role: 'supplier' | 'hotel' | 'admin'; company: string; password?: string });
    },

    toggleStatus: (id: string, token: string) =>
      trpcClient.users.toggleStatus.mutate({ id }),
  };

  alerts = {
    list: (token: string) => trpcClient.alerts.list.query(undefined),
  };

  auditLogs = {
    list: (token: string, query?: string) =>
      trpcClient.auditLogs.list.query({ search: query }),
  };

  reports = {
    sales: (token: string) => trpcClient.reports.sales.query(undefined),
    performance: (token: string) => trpcClient.reports.performance.query(undefined),
    monitoring: (token: string) => trpcClient.reports.monitoring.query(undefined),
    compliance: (token: string) => trpcClient.reports.compliance.query(undefined),
  };
}

export const api = new ApiService();
