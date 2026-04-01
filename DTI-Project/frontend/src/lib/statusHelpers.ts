// Helpers for determining status colors and labels

import { StockStatus, PaymentStatus, AlertSeverity } from '@/types';

/**
 * Get color for stock status
 */
export const getStockStatusColor = (status: StockStatus): string => {
  const colors: Record<StockStatus, string> = {
    sufficient: '#2D7A4F', // success green
    low: '#C17A00', // warning orange
    critical: '#B92020', // danger red
    out: '#7A8FA6', // muted gray
  };
  return colors[status] || '#7A8FA6';
};

/**
 * Get background color for stock status
 */
export const getStockStatusBg = (status: StockStatus): string => {
  const bgs: Record<StockStatus, string> = {
    sufficient: '#EBF5EF',
    low: '#FEF3DC',
    critical: '#FDEAEA',
    out: '#F1F3F6',
  };
  return bgs[status] || '#F1F3F6';
};

/**
 * Get label for stock status
 */
export const getStockStatusLabel = (status: StockStatus): string => {
  const labels: Record<StockStatus, string> = {
    sufficient: '✓ OK',
    low: '⚠ Low',
    critical: '🚨 Critical',
    out: '⊘ Out of Stock',
  };
  return labels[status] || 'Unknown';
};

/**
 * Determine stock status based on remaining vs minimum
 */
export const determineStockStatus = (remaining: number, minimum: number): StockStatus => {
  if (remaining === 0) return 'out';
  const percentage = (remaining / minimum) * 100;
  if (percentage >= 100) return 'sufficient';
  if (percentage >= 30) return 'low';
  return 'critical';
};

/**
 * Get color for payment status
 */
export const getPaymentStatusColor = (status: PaymentStatus): string => {
  const colors: Record<PaymentStatus, string> = {
    paid: '#2D7A4F',
    pending: '#C17A00',
    overdue: '#B92020',
  };
  return colors[status] || '#7A8FA6';
};

/**
 * Get background color for payment status
 */
export const getPaymentStatusBg = (status: PaymentStatus): string => {
  const bgs: Record<PaymentStatus, string> = {
    paid: '#EBF5EF',
    pending: '#FEF3DC',
    overdue: '#FDEAEA',
  };
  return bgs[status] || '#F1F3F6';
};

/**
 * Get label for payment status
 */
export const getPaymentStatusLabel = (status: PaymentStatus): string => {
  const labels: Record<PaymentStatus, string> = {
    paid: '✓ Paid',
    pending: '⏳ Pending',
    overdue: '⚠ Overdue',
  };
  return labels[status] || 'Unknown';
};

/**
 * Determine payment status based on due date
 */
export const determinePaymentStatus = (dueDate: string, paidDate?: string): PaymentStatus => {
  if (paidDate) return 'paid';
  const today = new Date();
  const due = new Date(dueDate);
  return due < today ? 'overdue' : 'pending';
};

/**
 * Get color for alert severity
 */
export const getAlertColor = (severity: AlertSeverity): string => {
  const colors: Record<AlertSeverity, string> = {
    info: '#1A5FA8',
    warning: '#C17A00',
    danger: '#B92020',
  };
  return colors[severity] || '#1A5FA8';
};

/**
 * Get background color for alert severity
 */
export const getAlertBg = (severity: AlertSeverity): string => {
  const bgs: Record<AlertSeverity, string> = {
    info: '#EBF2FB',
    warning: '#FEF3DC',
    danger: '#FDEAEA',
  };
  return bgs[severity] || '#EBF2FB';
};

/**
 * Get icon for alert severity
 */
export const getAlertIcon = (severity: AlertSeverity): string => {
  const icons: Record<AlertSeverity, string> = {
    info: 'ℹ️',
    warning: '⚠️',
    danger: '🚨',
  };
  return icons[severity] || 'ℹ️';
};
