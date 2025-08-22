import {
  applyCurrencyMask,
  CURRENCY_CONSTRAINTS,
  formatCompactCurrency,
  formatCurrency,
  formatCurrencyDisplay,
  formatCurrencyValue,
  formatPercentage,
  getCurrencySymbol,
  isValidCurrency,
  parseCurrency,
  removeCurrencyMask,
  validateCurrencyAmount,
} from '../../utils/currency';

describe('Currency Utilities', () => {
  describe('formatCurrency', () => {
    it('formats positive numbers correctly', () => {
      expect(formatCurrency(1000)).toBe('R$ 1.000,00');
      expect(formatCurrency(1234.56)).toBe('R$ 1.234,56');
      expect(formatCurrency(0.01)).toBe('R$ 0,01');
    });

    it('formats zero correctly', () => {
      expect(formatCurrency(0)).toBe('R$ 0,00');
    });

    it('formats negative numbers correctly', () => {
      expect(formatCurrency(-1000)).toBe('-R$ 1.000,00');
      expect(formatCurrency(-1234.56)).toBe('-R$ 1.234,56');
    });

    it('handles string input correctly', () => {
      expect(formatCurrency('1000')).toBe('R$ 1.000,00');
      expect(formatCurrency('1234.56')).toBe('R$ 1.234,56');
    });

    it('handles invalid string input correctly', () => {
      expect(formatCurrency('invalid')).toBe('R$ 0,00');
      expect(formatCurrency('')).toBe('R$ 0,00');
    });
  });

  describe('formatCurrencyValue', () => {
    it('formats numbers without currency symbol', () => {
      expect(formatCurrencyValue(1000)).toBe('1.000,00');
      expect(formatCurrencyValue(1234.56)).toBe('1.234,56');
      expect(formatCurrencyValue(0.01)).toBe('0,01');
    });

    it('handles string input correctly', () => {
      expect(formatCurrencyValue('1000')).toBe('1.000,00');
      expect(formatCurrencyValue('1234.56')).toBe('1.234,56');
    });

    it('handles invalid string input correctly', () => {
      expect(formatCurrencyValue('invalid')).toBe('0,00');
      expect(formatCurrencyValue('')).toBe('0,00');
    });
  });

  describe('parseCurrency', () => {
    it('parses formatted currency strings correctly', () => {
      expect(parseCurrency('R$ 1.000,00')).toBe(1000);
      expect(parseCurrency('R$ 1.234,56')).toBe(1234.56);
      expect(parseCurrency('1.000,00')).toBe(1000);
    });

    it('handles different formats correctly', () => {
      expect(parseCurrency('1000,00')).toBe(1000);
      expect(parseCurrency('1.234,56')).toBe(1234.56);
      expect(parseCurrency('123456,78')).toBe(123456.78);
    });

    it('handles edge cases correctly', () => {
      expect(parseCurrency('')).toBe(0);
      expect(parseCurrency('0,00')).toBe(0);
      expect(parseCurrency('R$')).toBe(NaN);
    });

    it('handles negative values correctly', () => {
      expect(parseCurrency('-R$ 1.000,00')).toBe(-1000);
      expect(parseCurrency('-1.234,56')).toBe(-1234.56);
    });

    it('handles invalid input gracefully', () => {
      expect(parseCurrency('invalid')).toBe(NaN);
      expect(parseCurrency('abc123')).toBe(NaN);
    });
  });

  describe('applyCurrencyMask', () => {
    it('applies mask to numeric input correctly', () => {
      expect(applyCurrencyMask('1000')).toBe('10,00');
      expect(applyCurrencyMask('123456')).toBe('1.234,56');
      expect(applyCurrencyMask('1')).toBe('0,01');
    });

    it('handles empty and invalid input', () => {
      expect(applyCurrencyMask('')).toBe('');
      expect(applyCurrencyMask('abc')).toBe('');
      expect(applyCurrencyMask('!')).toBe('');
    });

    it('extracts only numbers from mixed input', () => {
      expect(applyCurrencyMask('R$1000')).toBe('10,00');
      expect(applyCurrencyMask('1.000,00')).toBe('1.000,00');
      expect(applyCurrencyMask('1a2b3c')).toBe('1,23');
    });

    it('handles large numbers correctly', () => {
      expect(applyCurrencyMask('123456789')).toBe('1.234.567,89');
      expect(applyCurrencyMask('100000000')).toBe('1.000.000,00');
    });
  });

  describe('removeCurrencyMask', () => {
    it('removes formatting correctly', () => {
      expect(removeCurrencyMask('R$ 1.000,00')).toBe('1000');
      expect(removeCurrencyMask('1.234,56')).toBe('1234.56');
    });

    it('handles edge cases', () => {
      expect(removeCurrencyMask('')).toBe('0');
      expect(removeCurrencyMask('0,00')).toBe('0');
    });
  });

  describe('isValidCurrency', () => {
    it('validates correct currency strings', () => {
      expect(isValidCurrency('R$ 1.000,00')).toBe(true);
      expect(isValidCurrency('1.234,56')).toBe(true);
      expect(isValidCurrency('0,01')).toBe(true);
    });

    it('rejects invalid currency strings', () => {
      expect(isValidCurrency('')).toBe(false);
      expect(isValidCurrency('invalid')).toBe(false);
      expect(isValidCurrency('abc')).toBe(false);
    });

    it('rejects negative values', () => {
      expect(isValidCurrency('-1.000,00')).toBe(false);
    });
  });

  describe('formatPercentage', () => {
    it('formats percentages correctly', () => {
      expect(formatPercentage(12.5)).toBe('12,50%');
      expect(formatPercentage(100)).toBe('100,00%');
      expect(formatPercentage(0.5)).toBe('0,50%');
    });

    it('handles different decimal places', () => {
      expect(formatPercentage(12.3456, 2)).toBe('12,35%');
      expect(formatPercentage(12.3456, 0)).toBe('12%');
      expect(formatPercentage(12.3456, 4)).toBe('12,3456%');
    });

    it('handles edge cases', () => {
      expect(formatPercentage(0)).toBe('0,00%');
      expect(formatPercentage(-5.5)).toBe('-5,50%');
    });
  });

  describe('validateCurrencyAmount', () => {
    it('validates amounts within constraints', () => {
      const result = validateCurrencyAmount('1.000,00');
      expect(result.isValid).toBe(true);
      expect(result.numericValue).toBe(1000);
      expect(result.error).toBeUndefined();
    });

    it('rejects amounts below minimum', () => {
      const result = validateCurrencyAmount('0,00');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Valor mínimo');
      expect(result.numericValue).toBe(0);
    });

    it('rejects amounts above maximum', () => {
      const result = validateCurrencyAmount('1.000.000.000,00');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Valor máximo');
    });

    it('handles invalid input', () => {
      const result = validateCurrencyAmount('invalid');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Valor inválido');
      expect(result.numericValue).toBe(0);
    });

    it('accepts minimum valid amount', () => {
      const result = validateCurrencyAmount('0,01');
      expect(result.isValid).toBe(true);
      expect(result.numericValue).toBe(0.01);
    });
  });

  describe('formatCurrencyDisplay', () => {
    it('formats numbers for display', () => {
      expect(formatCurrencyDisplay(1000)).toBe('R$ 1.000,00');
      expect(formatCurrencyDisplay(1234.56)).toBe('R$ 1.234,56');
    });

    it('formats currency strings for display', () => {
      expect(formatCurrencyDisplay('1.000,00')).toBe('R$ 1.000,00');
      expect(formatCurrencyDisplay('1.234,56')).toBe('R$ 1.234,56');
    });
  });

  describe('getCurrencySymbol', () => {
    it('returns correct currency symbol', () => {
      expect(getCurrencySymbol()).toBe('R$');
    });
  });

  describe('formatCompactCurrency', () => {
    it('formats large amounts with K suffix', () => {
      expect(formatCompactCurrency(1500)).toBe('R$ 1.5K');
      expect(formatCompactCurrency(25000)).toBe('R$ 25.0K');
      expect(formatCompactCurrency(999999)).toBe('R$ 1000.0K');
    });

    it('formats very large amounts with M suffix', () => {
      expect(formatCompactCurrency(1500000)).toBe('R$ 1.5M');
      expect(formatCompactCurrency(25000000)).toBe('R$ 25.0M');
    });

    it('formats small amounts normally', () => {
      expect(formatCompactCurrency(500)).toBe('R$ 500,00');
      expect(formatCompactCurrency(999)).toBe('R$ 999,00');
    });

    it('handles negative amounts correctly', () => {
      expect(formatCompactCurrency(-1500)).toBe('R$ -1.5K');
      expect(formatCompactCurrency(-1500000)).toBe('R$ -1.5M');
      expect(formatCompactCurrency(-500)).toBe('-R$ 500,00');
    });

    it('handles zero correctly', () => {
      expect(formatCompactCurrency(0)).toBe('R$ 0,00');
    });
  });

  describe('CURRENCY_CONSTRAINTS', () => {
    it('has correct constraint values', () => {
      expect(CURRENCY_CONSTRAINTS.MIN_VALUE).toBe(0.01);
      expect(CURRENCY_CONSTRAINTS.MAX_VALUE).toBe(999999999.99);
      expect(CURRENCY_CONSTRAINTS.MAX_INPUT_LENGTH).toBe(15);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('handles extremely large numbers', () => {
      expect(formatCurrency(Number.MAX_SAFE_INTEGER)).toMatch(/R\$/);
      expect(parseCurrency('999.999.999.999.999,99')).toBeGreaterThan(0);
    });

    it('handles very small numbers', () => {
      expect(formatCurrency(0.001)).toBe('R$ 0,00');
      expect(formatCurrency(0.009)).toBe('R$ 0,01');
    });

    it('handles floating point precision issues', () => {
      expect(formatCurrency(0.1 + 0.2)).toBe('R$ 0,30');
      expect(parseCurrency('0,30')).toBeCloseTo(0.3);
    });

    it('handles special characters in input', () => {
      expect(applyCurrencyMask('R$10.000,00')).toBe('10.000,00');
      expect(applyCurrencyMask('1@2#3$4%5')).toBe('123,45');
      expect(parseCurrency('R$ 1.000,00')).toBe(1000);
    });

    it('handles null and undefined inputs gracefully', () => {
      expect(parseCurrency(null as any)).toBe(0);
      expect(parseCurrency(undefined as any)).toBe(0);
      expect(applyCurrencyMask(null as any)).toBe('');
      expect(applyCurrencyMask(undefined as any)).toBe('');
    });
  });
});