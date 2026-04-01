// App-wide constants and enumerations

export const ROLES = {
  SUPPLIER: 'supplier',
  HOTEL: 'hotel',
  ADMIN: 'admin',
} as const;

export const ROLE_LABELS = {
  supplier: 'Supplier Portal',
  hotel: 'Hotel Portal',
  admin: 'DTI Admin Portal',
} as const;

export const ROLE_COLORS = {
  supplier: '#0E7C7B', // teal
  hotel: '#E8890C', // amber
  admin: '#1A2B4A', // navy
} as const;

export const STOCK_STATUS = {
  SUFFICIENT: 'sufficient',
  LOW: 'low',
  CRITICAL: 'critical',
  OUT: 'out',
} as const;

export const PAYMENT_STATUS = {
  PAID: 'paid',
  PENDING: 'pending',
  OVERDUE: 'overdue',
} as const;

export const PRODUCT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
} as const;

export const ALERT_SEVERITY = {
  INFO: 'info',
  WARNING: 'warning',
  DANGER: 'danger',
} as const;

export const MIN_STOCK_THRESHOLDS = {
  low: 0.3, // 30% of minimum
  critical: 0.1, // 10% of minimum
} as const;

export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  USERS: '/api/users',
  PRODUCTS: '/api/products',
  SALES: '/api/sales',
  PAYMENTS: '/api/payments',
  CONSIGNMENTS: '/api/consignments',
  REPORTS: '/api/reports',
} as const;

export const TOAST_DURATION = 3000; // milliseconds
export const API_TIMEOUT = 10000; // milliseconds
