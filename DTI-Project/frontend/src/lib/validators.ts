// Form and input validation utilities

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * Requirements: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
 */
export const isValidPassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) errors.push('Password must be at least 8 characters');
  if (!/[A-Z]/.test(password)) errors.push('Password must contain an uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('Password must contain a lowercase letter');
  if (!/\d/.test(password)) errors.push('Password must contain a number');
  if (!/[!@#$%^&*]/.test(password)) errors.push('Password must contain a special character (!@#$%^&*)');

  return { valid: errors.length === 0, errors };
};

/**
 * Validate required field
 */
export const isRequired = (value: string | number | null | undefined): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
};

/**
 * Validate number is positive
 */
export const isPositive = (value: number): boolean => {
  return !isNaN(value) && value > 0;
};

/**
 * Validate number is between range
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return !isNaN(value) && value >= min && value <= max;
};

/**
 * Validate phone number (Philippine format)
 * Accepts: +63, 09, (09)
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^(\+63|0)?9\d{9}$/;
  return phoneRegex.test(phone.replace(/[() -]/g, ''));
};

/**
 * Validate SKU format
 */
export const isValidSKU = (sku: string): boolean => {
  // SKU should be alphanumeric, 3-20 chars, format: ABC-001
  const skuRegex = /^[A-Z]{2,}-\d{3,}$/;
  return skuRegex.test(sku);
};

/**
 * Validate currency amount
 */
export const isValidCurrency = (value: string | number): boolean => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(num) && num >= 0 && num <= 999999999.99;
};

/**
 * Validate date format (YYYY-MM-DD)
 */
export const isValidDate = (date: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
};

/**
 * Validate date is not in the past
 */
export const isFutureDate = (date: string): boolean => {
  if (!isValidDate(date)) return false;
  return new Date(date) > new Date();
};

/**
 * Validate string length
 */
export const isValidLength = (value: string, min: number, max: number): boolean => {
  return value.length >= min && value.length <= max;
};

/**
 * Form validation helper - returns all errors
 */
export interface ValidationErrors {
  [key: string]: string;
}

export const validateForm = (
  data: Record<string, unknown>,
  schema: Record<string, (value: unknown) => string | null>
): ValidationErrors => {
  const errors: ValidationErrors = {};

  for (const [field, validator] of Object.entries(schema)) {
    const error = validator(data[field]);
    if (error) errors[field] = error;
  }

  return errors;
};
