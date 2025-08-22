import { ValidationService } from '../../../services/implementations/ValidationService';
import { LoanProduct, LoanSimulationRequest } from '../../../types/loan';

describe('ValidationService', () => {
  let service: ValidationService;

  beforeEach(() => {
    service = new ValidationService();
  });

  describe('validateProduct', () => {
    it('validates correct product successfully', () => {
      const product: Partial<LoanProduct> = {
        name: 'Empréstimo Pessoal',
        annualInterestRate: 18.5,
        maxTermMonths: 60,
      };

      const result = service.validateProduct(product);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('rejects product with empty name', () => {
      const product: Partial<LoanProduct> = {
        name: '',
        annualInterestRate: 18.5,
        maxTermMonths: 60,
      };

      const result = service.validateProduct(product);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Nome do produto é obrigatório');
    });

    it('rejects product with whitespace-only name', () => {
      const product: Partial<LoanProduct> = {
        name: '   ',
        annualInterestRate: 18.5,
        maxTermMonths: 60,
      };

      const result = service.validateProduct(product);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Nome do produto é obrigatório');
    });

    it('rejects product with missing name', () => {
      const product: Partial<LoanProduct> = {
        annualInterestRate: 18.5,
        maxTermMonths: 60,
      };

      const result = service.validateProduct(product);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Nome do produto é obrigatório');
    });

    it('rejects product with zero interest rate', () => {
      const product: Partial<LoanProduct> = {
        name: 'Test Product',
        annualInterestRate: 0,
        maxTermMonths: 60,
      };

      const result = service.validateProduct(product);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Taxa de juros anual deve ser maior que zero');
    });

    it('rejects product with negative interest rate', () => {
      const product: Partial<LoanProduct> = {
        name: 'Test Product',
        annualInterestRate: -5,
        maxTermMonths: 60,
      };

      const result = service.validateProduct(product);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Taxa de juros anual deve ser maior que zero');
    });

    it('rejects product with interest rate over 100%', () => {
      const product: Partial<LoanProduct> = {
        name: 'Test Product',
        annualInterestRate: 150,
        maxTermMonths: 60,
      };

      const result = service.validateProduct(product);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Taxa de juros anual não pode ser maior que 100%');
    });

    it('accepts product with 100% interest rate', () => {
      const product: Partial<LoanProduct> = {
        name: 'Test Product',
        annualInterestRate: 100,
        maxTermMonths: 60,
      };

      const result = service.validateProduct(product);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('rejects product with missing interest rate', () => {
      const product: Partial<LoanProduct> = {
        name: 'Test Product',
        maxTermMonths: 60,
      };

      const result = service.validateProduct(product);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Taxa de juros anual deve ser maior que zero');
    });

    it('rejects product with zero max term', () => {
      const product: Partial<LoanProduct> = {
        name: 'Test Product',
        annualInterestRate: 18.5,
        maxTermMonths: 0,
      };

      const result = service.validateProduct(product);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Prazo máximo deve ser maior que zero');
    });

    it('rejects product with negative max term', () => {
      const product: Partial<LoanProduct> = {
        name: 'Test Product',
        annualInterestRate: 18.5,
        maxTermMonths: -12,
      };

      const result = service.validateProduct(product);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Prazo máximo deve ser maior que zero');
    });

    it('rejects product with max term over 600 months', () => {
      const product: Partial<LoanProduct> = {
        name: 'Test Product',
        annualInterestRate: 18.5,
        maxTermMonths: 700,
      };

      const result = service.validateProduct(product);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Prazo máximo não pode ser maior que 600 meses');
    });

    it('accepts product with 600 months max term', () => {
      const product: Partial<LoanProduct> = {
        name: 'Test Product',
        annualInterestRate: 18.5,
        maxTermMonths: 600,
      };

      const result = service.validateProduct(product);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('returns multiple errors for invalid product', () => {
      const product: Partial<LoanProduct> = {
        name: '',
        annualInterestRate: -5,
        maxTermMonths: 700,
      };

      const result = service.validateProduct(product);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(3);
      expect(result.errors).toContain('Nome do produto é obrigatório');
      expect(result.errors).toContain('Taxa de juros anual deve ser maior que zero');
      expect(result.errors).toContain('Prazo máximo não pode ser maior que 600 meses');
    });

    it('handles decimal values correctly', () => {
      const product: Partial<LoanProduct> = {
        name: 'Test Product',
        annualInterestRate: 18.75,
        maxTermMonths: 36.5, // Fractional months should still be valid
      };

      const result = service.validateProduct(product);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('validateSimulationRequest', () => {
    it('validates correct simulation request successfully', () => {
      const request: Partial<LoanSimulationRequest> = {
        productId: 'product-1',
        loanAmount: 10000,
        termMonths: 12,
      };

      const result = service.validateSimulationRequest(request);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('rejects request with empty product ID', () => {
      const request: Partial<LoanSimulationRequest> = {
        productId: '',
        loanAmount: 10000,
        termMonths: 12,
      };

      const result = service.validateSimulationRequest(request);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Produto deve ser selecionado');
    });

    it('rejects request with whitespace-only product ID', () => {
      const request: Partial<LoanSimulationRequest> = {
        productId: '   ',
        loanAmount: 10000,
        termMonths: 12,
      };

      const result = service.validateSimulationRequest(request);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Produto deve ser selecionado');
    });

    it('rejects request with missing product ID', () => {
      const request: Partial<LoanSimulationRequest> = {
        loanAmount: 10000,
        termMonths: 12,
      };

      const result = service.validateSimulationRequest(request);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Produto deve ser selecionado');
    });

    it('rejects request with zero loan amount', () => {
      const request: Partial<LoanSimulationRequest> = {
        productId: 'product-1',
        loanAmount: 0,
        termMonths: 12,
      };

      const result = service.validateSimulationRequest(request);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Valor do empréstimo deve ser maior que zero');
    });

    it('rejects request with negative loan amount', () => {
      const request: Partial<LoanSimulationRequest> = {
        productId: 'product-1',
        loanAmount: -1000,
        termMonths: 12,
      };

      const result = service.validateSimulationRequest(request);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Valor do empréstimo deve ser maior que zero');
    });

    it('rejects request with loan amount over 10 million', () => {
      const request: Partial<LoanSimulationRequest> = {
        productId: 'product-1',
        loanAmount: 15000000,
        termMonths: 12,
      };

      const result = service.validateSimulationRequest(request);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Valor do empréstimo não pode ser maior que R$ 10.000.000,00');
    });

    it('accepts request with exactly 10 million loan amount', () => {
      const request: Partial<LoanSimulationRequest> = {
        productId: 'product-1',
        loanAmount: 10000000,
        termMonths: 12,
      };

      const result = service.validateSimulationRequest(request);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('rejects request with missing loan amount', () => {
      const request: Partial<LoanSimulationRequest> = {
        productId: 'product-1',
        termMonths: 12,
      };

      const result = service.validateSimulationRequest(request);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Valor do empréstimo deve ser maior que zero');
    });

    it('rejects request with zero term months', () => {
      const request: Partial<LoanSimulationRequest> = {
        productId: 'product-1',
        loanAmount: 10000,
        termMonths: 0,
      };

      const result = service.validateSimulationRequest(request);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Prazo deve ser maior que zero');
    });

    it('rejects request with negative term months', () => {
      const request: Partial<LoanSimulationRequest> = {
        productId: 'product-1',
        loanAmount: 10000,
        termMonths: -6,
      };

      const result = service.validateSimulationRequest(request);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Prazo deve ser maior que zero');
    });

    it('rejects request with term over 600 months', () => {
      const request: Partial<LoanSimulationRequest> = {
        productId: 'product-1',
        loanAmount: 10000,
        termMonths: 700,
      };

      const result = service.validateSimulationRequest(request);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Prazo não pode ser maior que 600 meses');
    });

    it('accepts request with exactly 600 months term', () => {
      const request: Partial<LoanSimulationRequest> = {
        productId: 'product-1',
        loanAmount: 10000,
        termMonths: 600,
      };

      const result = service.validateSimulationRequest(request);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('returns multiple errors for completely invalid request', () => {
      const request: Partial<LoanSimulationRequest> = {
        productId: '',
        loanAmount: -1000,
        termMonths: 700,
      };

      const result = service.validateSimulationRequest(request);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(3);
      expect(result.errors).toContain('Produto deve ser selecionado');
      expect(result.errors).toContain('Valor do empréstimo deve ser maior que zero');
      expect(result.errors).toContain('Prazo não pode ser maior que 600 meses');
    });

    it('handles decimal values correctly', () => {
      const request: Partial<LoanSimulationRequest> = {
        productId: 'product-1',
        loanAmount: 10000.50,
        termMonths: 12.5, // Fractional months should still be valid
      };

      const result = service.validateSimulationRequest(request);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('validateCurrency', () => {
    it('delegates to currency utility function', () => {
      // Test that it calls the utility function
      const result1 = service.validateCurrency('1.000,00');
      expect(result1.isValid).toBe(true);

      const result2 = service.validateCurrency('invalid');
      expect(result2.isValid).toBe(false);

      const result3 = service.validateCurrency('0,00');
      expect(result3.isValid).toBe(false);
    });

    it('returns correct validation results', () => {
      const validResult = service.validateCurrency('1.500,00');
      expect(validResult.isValid).toBe(true);
      expect(validResult.numericValue).toBe(1500);

      const invalidResult = service.validateCurrency('abc');
      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.error).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('handles null and undefined values gracefully', () => {
      const productResult = service.validateProduct({});
      expect(productResult.isValid).toBe(false);
      expect(productResult.errors.length).toBeGreaterThan(0);

      const requestResult = service.validateSimulationRequest({});
      expect(requestResult.isValid).toBe(false);
      expect(requestResult.errors.length).toBeGreaterThan(0);
    });

    it('handles very small positive values', () => {
      const product: Partial<LoanProduct> = {
        name: 'Micro Product',
        annualInterestRate: 0.01,
        maxTermMonths: 1,
      };

      const result = service.validateProduct(product);
      expect(result.isValid).toBe(true);
    });

    it('handles boundary values correctly', () => {
      // Test boundary values for interest rate
      const product100 = service.validateProduct({
        name: 'Test',
        annualInterestRate: 100,
        maxTermMonths: 12,
      });
      expect(product100.isValid).toBe(true);

      const product101 = service.validateProduct({
        name: 'Test',
        annualInterestRate: 100.01,
        maxTermMonths: 12,
      });
      expect(product101.isValid).toBe(false);

      // Test boundary values for max term
      const term600 = service.validateProduct({
        name: 'Test',
        annualInterestRate: 12,
        maxTermMonths: 600,
      });
      expect(term600.isValid).toBe(true);

      const term601 = service.validateProduct({
        name: 'Test',
        annualInterestRate: 12,
        maxTermMonths: 601,
      });
      expect(term601.isValid).toBe(false);
    });
  });
});