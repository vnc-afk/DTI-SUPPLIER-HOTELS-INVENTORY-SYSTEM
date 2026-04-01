// Formatting utilities for common data types

/**
 * Format number as Philippine peso currency
 * @example formatCurrency(1500) → "₱1,500.00"
 */
export const formatCurrency = (value: number | string): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  }).format(num);
};

/**
 * Format date to readable format
 * @example formatDate("2026-03-31") → "Mar 31, 2026"
 */
export const formatDate = (date: string | Date, format: 'short' | 'long' = 'short'): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return 'Invalid date';

  const options: Intl.DateTimeFormatOptions =
    format === 'long'
      ? { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
      : { year: 'numeric', month: 'short', day: 'numeric' };

  return d.toLocaleDateString('en-US', options);
};

/**
 * Format time to HH:MM format
 */
export const formatTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
};

/**
 * Format datetime to "Mar 31, 2026 - 09:14"
 */
export const formatDateTime = (date: string | Date): string => {
  return `${formatDate(date, 'short')} - ${formatTime(date)}`;
};

/**
 * Format number with thousands separator
 * @example formatNumber(1500) → "1,500"
 */
export const formatNumber = (value: number | string): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return num.toLocaleString('en-US', { maximumFractionDigits: 0 });
};

/**
 * Truncate string to max length with ellipsis
 * @example truncate("Hello World", 8) → "Hello..."
 */
export const truncate = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
};

/**
 * Format text to title case
 * @example toTitleCase("hello_world") → "Hello World"
 */
export const toTitleCase = (str: string): string => {
  return str
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

/**
 * Calculate percentage
 * @example percentage(30, 100) → "30%"
 */
export const percentage = (value: number, total: number, decimals = 0): string => {
  if (total === 0) return '0%';
  const percent = (value / total) * 100;
  return `${percent.toFixed(decimals)}%`;
};
