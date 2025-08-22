/**
 * Currency utility functions for formatting and parsing
 * Brazilian Real (BRL) specific implementations
 */

// Format number to Brazilian currency string
export const formatCurrency = (value: number | string): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
  let result = numValue.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  // Replace non-breaking space (U+00A0) with regular space and trim
  result = result.replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim();
  return result;
};

// Format number to currency string without R$ symbol
export const formatCurrencyValue = (value: number | string): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
  
  return numValue.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Parse currency string to number
export const parseCurrency = (value: string): number => {
  if (!value) return 0;
  
  // Remove currency symbols and spaces
  const cleanValue = value
    .replace(/R\$\s?/g, '') // Remove R$ symbol
    .replace(/\./g, '') // Remove thousand separators
    .replace(/,/g, '.'); // Replace decimal comma with dot
  
  const parsed = parseFloat(cleanValue);
  return parsed;
};

// Apply currency mask to input string
export const applyCurrencyMask = (value: string): string => {
  if (!value) return '';
  
  // Remove all non-numeric characters
  const numbers = value.replace(/\D/g, '');
  
  if (!numbers) return '';
  
  // Convert to cents (divide by 100 to get currency value)
  const cents = parseInt(numbers, 10);
  const currency = cents / 100;
  
  // Format as currency without symbol
  return formatCurrencyValue(currency);
};

// Remove currency formatting and return clean number string
export const removeCurrencyMask = (value: string): string => {
  return parseCurrency(value).toString();
};

// Validate if string is a valid currency amount
export const isValidCurrency = (value: string): boolean => {
  if (!value || typeof value !== 'string') return false;
  // Must match currency pattern: optional 'R$', digits, optional thousands, comma, two decimals
  const currencyRegex = /^-?R?\$?\s?\d{1,3}(\.\d{3})*,\d{2}$|^-?\d+(,\d{2})?$/;
  if (!currencyRegex.test(value.trim())) return false;
  const parsed = parseCurrency(value);
  return !isNaN(parsed) && parsed >= 0;
};

// Format percentage value
export const formatPercentage = (value: number, decimals: number = 2): string => {
  return `${value.toFixed(decimals).replace('.', ',')}%`;
};

// Currency input constraints
export const CURRENCY_CONSTRAINTS = {
  MIN_VALUE: 0.01, // Minimum R$ 0,01
  MAX_VALUE: 999999999.99, // Maximum R$ 999.999.999,99
  MAX_INPUT_LENGTH: 15, // Maximum input length including formatting
};

// Validate currency amount within constraints
export const validateCurrencyAmount = (value: string): {
  isValid: boolean;
  error?: string;
  numericValue: number;
} => {
  const numericValue = parseCurrency(value);
  
  if (isNaN(numericValue)) {
    return {
      isValid: false,
      error: 'Valor inválido',
      numericValue: 0,
    };
  }
  
  if (numericValue < CURRENCY_CONSTRAINTS.MIN_VALUE) {
    return {
      isValid: false,
      error: `Valor mínimo: ${formatCurrency(CURRENCY_CONSTRAINTS.MIN_VALUE)}`,
      numericValue,
    };
  }
  
  if (numericValue > CURRENCY_CONSTRAINTS.MAX_VALUE) {
    return {
      isValid: false,
      error: `Valor máximo: ${formatCurrency(CURRENCY_CONSTRAINTS.MAX_VALUE)}`,
      numericValue,
    };
  }
  
  return {
    isValid: true,
    numericValue,
  };
};

// Format currency for display in components
export const formatCurrencyDisplay = (value: number | string): string => {
  const numValue = typeof value === 'string' ? parseCurrency(value) : value;
  return formatCurrency(numValue);
};

// Get currency symbol
export const getCurrencySymbol = (): string => 'R$';

// Format compact currency (e.g., R$ 1,2K, R$ 1,5M)
export const formatCompactCurrency = (value: number): string => {
  const absValue = Math.abs(value);
  
  if (absValue >= 1000000) {
    return `${getCurrencySymbol()} ${(value / 1000000).toFixed(1)}M`;
  }
  
  if (absValue >= 1000) {
    return `${getCurrencySymbol()} ${(value / 1000).toFixed(1)}K`;
  }
  
  return formatCurrency(value);
};