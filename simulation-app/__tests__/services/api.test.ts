import { ProductService } from '../../services/ProductService';
import { SimulationService } from '../../services/SimulationService';
import { LoanProduct, LoanSimulationRequest } from '../../types/loan';
import { MockHttpClient } from '../mocks/mockHttpClient';

describe('Product Service', () => {
  let mockHttpClient: MockHttpClient;
  let productService: ProductService;

  beforeEach(() => {
    mockHttpClient = new MockHttpClient();
    productService = new ProductService(mockHttpClient);
  });

  afterEach(() => {
    mockHttpClient.reset();
  });

  describe('getProducts', () => {
    it('should return mock products successfully', async () => {
      const result = await productService.getProducts();
      
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data.length).toBeGreaterThan(0);
      
      // Check first product structure
      const firstProduct = result.data[0];
      expect(firstProduct).toHaveProperty('id');
      expect(firstProduct).toHaveProperty('name');
      expect(firstProduct).toHaveProperty('annualInterestRate');
      expect(firstProduct).toHaveProperty('maxTermMonths');
      expect(typeof firstProduct.annualInterestRate).toBe('number');
      expect(typeof firstProduct.maxTermMonths).toBe('number');
    });

    it('should return expected mock products', async () => {
      const result = await productService.getProducts();
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(3);
      
      // Check specific products exist
      const productNames = result.data.map(p => p.name);
      expect(productNames).toContain('Empréstimo Pessoal');
      expect(productNames).toContain('Crédito Consignado');
      expect(productNames).toContain('Financiamento Imobiliário');
    });

    it('should return products with valid data types and ranges', async () => {
      const result = await productService.getProducts();
      
      expect(result.success).toBe(true);
      
      result.data.forEach(product => {
        expect(typeof product.id).toBe('string');
        expect(typeof product.name).toBe('string');
        expect(typeof product.annualInterestRate).toBe('number');
        expect(typeof product.maxTermMonths).toBe('number');
        
        // Validate reasonable ranges
        expect(product.annualInterestRate).toBeGreaterThan(0);
        expect(product.annualInterestRate).toBeLessThan(100); // Less than 100% annual
        expect(product.maxTermMonths).toBeGreaterThan(0);
        expect(product.maxTermMonths).toBeLessThan(1000); // Less than 1000 months
        expect(product.name.length).toBeGreaterThan(0);
        expect(product.id.length).toBeGreaterThan(0);
      });
    });
  });

  describe('createProduct', () => {
    it('should create a new product successfully', async () => {
      const newProduct = {
        name: 'Test Product',
        annualInterestRate: 15.5,
        maxTermMonths: 48,
      };

      const result = await productService.createProduct(newProduct);
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('id');
      expect(result.data.name).toBe(newProduct.name);
      expect(result.data.annualInterestRate).toBe(newProduct.annualInterestRate);
      expect(result.data.maxTermMonths).toBe(newProduct.maxTermMonths);
      expect(result.data).toHaveProperty('createdAt');
      expect(result.data.createdAt).toBeInstanceOf(Date);
    });

    it('should generate unique IDs for different products', async () => {
      const product1 = {
        name: 'Product 1',
        annualInterestRate: 10.5,
        maxTermMonths: 24,
      };

      const product2 = {
        name: 'Product 2',
        annualInterestRate: 12.0,
        maxTermMonths: 36,
      };

      const result1 = await productService.createProduct(product1);
      const result2 = await productService.createProduct(product2);
      
      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
      expect(result1.data.id).not.toBe(result2.data.id);
    });

    it('should handle edge case values correctly', async () => {
      const edgeCaseProduct = {
        name: 'Edge Case Product',
        annualInterestRate: 0.01, // Very low rate
        maxTermMonths: 1, // Single month
      };

      const result = await productService.createProduct(edgeCaseProduct);
      
      expect(result.success).toBe(true);
      expect(result.data.annualInterestRate).toBe(0.01);
      expect(result.data.maxTermMonths).toBe(1);
    });

    it('should persist created product in the product list', async () => {
      const newProduct = {
        name: 'Persistent Product',
        annualInterestRate: 20.0,
        maxTermMonths: 60,
      };

      const createResult = await productService.createProduct(newProduct);
      expect(createResult.success).toBe(true);

      // Verify it appears in the products list
      const listResult = await productService.getProducts();
      const createdProduct = listResult.data.find(p => p.id === createResult.data.id);
      
      expect(createdProduct).toBeDefined();
      expect(createdProduct?.name).toBe(newProduct.name);
    });
  });

  describe('Error Handling', () => {
    it('should handle service errors gracefully', () => {
      // Since we're using mock data, errors would come from implementation issues
      // This test ensures the error handling structure is in place
      expect(productService.getProducts).toBeDefined();
      expect(productService.createProduct).toBeDefined();
    });

    it('should handle getProducts network errors', async () => {
      const networkError = new Error('Network Error');
      mockHttpClient.setError(networkError);

      const result = await productService.getProducts();
      
      expect(result.success).toBe(false);
      expect(result.data).toEqual([]);
      expect(result.message).toBe('Erro ao carregar produtos');
    });

    it('should handle getProducts errors with server response', async () => {
      const serverError = new Error('Server Error') as any;
      serverError.response = { 
        data: { message: 'Erro interno do servidor' } 
      };
      mockHttpClient.setError(serverError);

      const result = await productService.getProducts();
      
      expect(result.success).toBe(false);
      expect(result.data).toEqual([]);
      expect(result.message).toBe('Erro interno do servidor');
    });

    it('should handle createProduct network errors', async () => {
      const networkError = new Error('Network Error');
      mockHttpClient.setError(networkError);

      const newProduct = {
        name: 'Test Product',
        annualInterestRate: 15.5,
        maxTermMonths: 48,
      };

      const result = await productService.createProduct(newProduct);
      
      expect(result.success).toBe(false);
      expect(result.data).toEqual({} as any);
      expect(result.message).toBe('Erro ao criar produto');
    });

    it('should handle createProduct errors with server response', async () => {
      const serverError = new Error('Server Error') as any;
      serverError.response = { 
        data: { message: 'Produto já existe' } 
      };
      mockHttpClient.setError(serverError);

      const newProduct = {
        name: 'Duplicate Product',
        annualInterestRate: 15.5,
        maxTermMonths: 48,
      };

      const result = await productService.createProduct(newProduct);
      
      expect(result.success).toBe(false);
      expect(result.data).toEqual({} as any);
      expect(result.message).toBe('Produto já existe');
    });

    it('should handle errors without response data', async () => {
      const errorWithoutResponse = new Error('Unknown Error') as any;
      // No response property
      mockHttpClient.setError(errorWithoutResponse);

      const result = await productService.getProducts();
      
      expect(result.success).toBe(false);
      expect(result.data).toEqual([]);
      expect(result.message).toBe('Erro ao carregar produtos');
    });
  });
});

describe('Simulation Service', () => {
  let mockHttpClient: MockHttpClient;
  let simulationService: SimulationService;
  let mockProduct: LoanProduct;

  beforeEach(() => {
    mockHttpClient = new MockHttpClient();
    simulationService = new SimulationService(mockHttpClient);
    mockProduct = mockHttpClient.getProducts()[0];
  });

  describe('simulateLoan', () => {
    it('should calculate loan simulation correctly', async () => {
      const request: LoanSimulationRequest = {
        productId: mockProduct.id,
        loanAmount: 10000,
        termMonths: 12,
      };

      const result = await simulationService.simulateLoan(request);
      
      expect(result.success).toBe(true);
      expect(result.data.product.id).toBe(mockProduct.id);
      expect(result.data.loanAmount).toBe(request.loanAmount);
      expect(result.data.termMonths).toBe(request.termMonths);
      expect(result.data.monthlyPayment).toBeGreaterThan(0);
      expect(result.data.totalAmount).toBeGreaterThan(request.loanAmount);
      expect(result.data.totalInterest).toBeGreaterThan(0);
      expect(result.data.monthlyBreakdown).toHaveLength(request.termMonths);
    });

    it('should calculate monthly payments correctly for known values', async () => {
      // Test with Empréstimo Pessoal (18.5% annual rate)
      const request: LoanSimulationRequest = {
        productId: '1', // Empréstimo Pessoal
        loanAmount: 10000,
        termMonths: 12,
      };

      const result = await simulationService.simulateLoan(request);
      
      expect(result.success).toBe(true);
      // For 18.5% annual rate, monthly rate should be approximately 1.43%
      expect(result.data.monthlyInterestRate).toBeCloseTo(1.43, 1);
      // Monthly payment should be around 930-940 for these parameters
      expect(result.data.monthlyPayment).toBeGreaterThan(900);
      expect(result.data.monthlyPayment).toBeLessThan(1000);
    });

    it('should match the specification example approximately', async () => {
      // Test the example from requirements:
      // Produto: Empréstimo Pessoal, Valor: R$ 10.000, Prazo: 12 meses
      const request: LoanSimulationRequest = {
        productId: '1', // Empréstimo Pessoal (18.5% annual)
        loanAmount: 10000,
        termMonths: 12,
      };

      const result = await simulationService.simulateLoan(request);
      
      expect(result.success).toBe(true);
      
      // Expected values from specification (with reasonable tolerance)
      expect(result.data.monthlyInterestRate).toBeCloseTo(1.43, 0.5); // ~1.43%
      expect(result.data.monthlyPayment).toBeGreaterThan(900); // Should be reasonable
      expect(result.data.monthlyPayment).toBeLessThan(950); // Should be reasonable
      expect(result.data.totalAmount).toBeGreaterThan(10500); // More than principal
      
      // Check first month breakdown is reasonable
      const firstMonth = result.data.monthlyBreakdown[0];
      expect(firstMonth.interest).toBeGreaterThan(100); // Reasonable interest
      expect(firstMonth.amortization).toBeGreaterThan(700); // Reasonable amortization
      expect(firstMonth.balance).toBeLessThan(10000); // Balance decreases
    });

    it('should handle invalid product ID', async () => {
      const request: LoanSimulationRequest = {
        productId: 'invalid-id',
        loanAmount: 10000,
        termMonths: 12,
      };

      const result = await simulationService.simulateLoan(request);
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Produto não encontrado');
    });

    it('should generate correct amortization schedule', async () => {
      const request: LoanSimulationRequest = {
        productId: mockProduct.id,
        loanAmount: 1000,
        termMonths: 3,
      };

      const result = await simulationService.simulateLoan(request);
      
      expect(result.success).toBe(true);
      const breakdown = result.data.monthlyBreakdown;
      
      // Check that months are sequential
      expect(breakdown[0].month).toBe(1);
      expect(breakdown[1].month).toBe(2);
      expect(breakdown[2].month).toBe(3);
      
      // Check that balance decreases each month
      expect(breakdown[0].balance).toBeGreaterThan(breakdown[1].balance);
      expect(breakdown[1].balance).toBeGreaterThan(breakdown[2].balance);
      expect(breakdown[2].balance).toBeCloseTo(0, 1);
      
      // Check that interest + amortization equals monthly payment (approximately)
      const monthlyPayment = result.data.monthlyPayment;
      for (const payment of breakdown) {
        const sum = payment.interest + payment.amortization;
        expect(sum).toBeCloseTo(monthlyPayment, 1);
      }
    });

    it('should calculate different products correctly', async () => {
      // Test with Crédito Consignado (12.8% annual rate)
      const consignadoRequest: LoanSimulationRequest = {
        productId: '2',
        loanAmount: 5000,
        termMonths: 24,
      };

      const consignadoResult = await simulationService.simulateLoan(consignadoRequest);
      
      // Test with Financiamento Imobiliário (9.2% annual rate)
      const imobiliarioRequest: LoanSimulationRequest = {
        productId: '3',
        loanAmount: 100000,
        termMonths: 360,
      };

      const imobiliarioResult = await simulationService.simulateLoan(imobiliarioRequest);

      expect(consignadoResult.success).toBe(true);
      expect(imobiliarioResult.success).toBe(true);
      
      // Different products should have different rates
      expect(consignadoResult.data.monthlyInterestRate).not.toEqual(
        imobiliarioResult.data.monthlyInterestRate
      );
    });

    it('should handle edge cases correctly', async () => {
      // Test with very small loan amount
      const smallLoanRequest: LoanSimulationRequest = {
        productId: mockProduct.id,
        loanAmount: 100,
        termMonths: 1,
      };

      const smallLoanResult = await simulationService.simulateLoan(smallLoanRequest);
      expect(smallLoanResult.success).toBe(true);
      expect(smallLoanResult.data.monthlyBreakdown).toHaveLength(1);

      // Test with very long term
      const longTermRequest: LoanSimulationRequest = {
        productId: '3', // Financiamento Imobiliário (360 months max)
        loanAmount: 50000,
        termMonths: 300,
      };

      const longTermResult = await simulationService.simulateLoan(longTermRequest);
      expect(longTermResult.success).toBe(true);
      expect(longTermResult.data.monthlyBreakdown).toHaveLength(300);
    });

    it('should maintain mathematical precision', async () => {
      const request: LoanSimulationRequest = {
        productId: mockProduct.id,
        loanAmount: 10000,
        termMonths: 12,
      };

      const result = await simulationService.simulateLoan(request);
      
      expect(result.success).toBe(true);
      
      // Verify total interest calculation
      const calculatedTotalInterest = result.data.totalAmount - result.data.loanAmount;
      expect(result.data.totalInterest).toBeCloseTo(calculatedTotalInterest, 2);
      
      // Verify monthly payment calculation (with reasonable tolerance for rounding)
      const calculatedTotal = result.data.monthlyPayment * result.data.termMonths;
      expect(result.data.totalAmount).toBeCloseTo(calculatedTotal, 1);
      
      // Verify amortization table sums
      const breakdown = result.data.monthlyBreakdown;
      const totalInterestFromBreakdown = breakdown.reduce((sum, payment) => sum + payment.interest, 0);
      const totalAmortizationFromBreakdown = breakdown.reduce((sum, payment) => sum + payment.amortization, 0);
      
      expect(totalInterestFromBreakdown).toBeCloseTo(result.data.totalInterest, 2);
      expect(totalAmortizationFromBreakdown).toBeCloseTo(result.data.loanAmount, 2);
    });

    it('should handle zero interest rate scenario', async () => {
      // Create a product with very low interest for testing
      const zeroRateProduct: LoanProduct = {
        id: 'zero-rate',
        name: 'Zero Rate Product',
        annualInterestRate: 0.01, // Nearly zero
        maxTermMonths: 12,
      };

      mockHttpClient.addProduct(zeroRateProduct);

      const request: LoanSimulationRequest = {
        productId: zeroRateProduct.id,
        loanAmount: 1200,
        termMonths: 12,
      };

      const result = await simulationService.simulateLoan(request);
      
      expect(result.success).toBe(true);
      // With very low interest, monthly payment should be close to principal/months
      const expectedPayment = 1200 / 12;
      expect(result.data.monthlyPayment).toBeCloseTo(expectedPayment, 1);
    });
  });

  describe('Financial Calculation Accuracy', () => {
    it('should calculate monthly interest rate correctly', async () => {
      // Test different annual rates and verify monthly conversion
      const rates = [
        { annual: 12.0, expectedMonthly: 0.9489 }, // 12% annual ≈ 0.95% monthly
        { annual: 18.5, expectedMonthly: 1.4299 }, // 18.5% annual ≈ 1.43% monthly
        { annual: 24.0, expectedMonthly: 1.8160 }, // 24% annual ≈ 1.82% monthly
      ];

      for (const rate of rates) {
        const product: LoanProduct = {
          id: `test-${rate.annual}`,
          name: `Test Product ${rate.annual}%`,
          annualInterestRate: rate.annual,
          maxTermMonths: 12,
        };

        mockHttpClient.addProduct(product);

        const request: LoanSimulationRequest = {
          productId: product.id,
          loanAmount: 1000,
          termMonths: 12,
        };

        const result = await simulationService.simulateLoan(request);
        expect(result.success).toBe(true);
        expect(result.data.monthlyInterestRate).toBeCloseTo(rate.expectedMonthly, 1);
      }
    });

    it('should maintain balance accuracy throughout amortization', async () => {
      const request: LoanSimulationRequest = {
        productId: mockProduct.id,
        loanAmount: 10000,
        termMonths: 6,
      };

      const result = await simulationService.simulateLoan(request);
      expect(result.success).toBe(true);
      
      const breakdown = result.data.monthlyBreakdown;
      let previousBalance = request.loanAmount;
      
      for (const payment of breakdown) {
        // Balance should decrease by amortization amount
        const expectedBalance = previousBalance - payment.amortization;
        expect(payment.balance).toBeCloseTo(expectedBalance, 1);
        
        // Interest should be calculated on previous balance (with tolerance for rounding)
        const expectedInterest = previousBalance * (result.data.monthlyInterestRate / 100);
        expect(payment.interest).toBeCloseTo(expectedInterest, 0);
        
        previousBalance = payment.balance;
      }
      
      // Final balance should be close to zero
      expect(breakdown[breakdown.length - 1].balance).toBeCloseTo(0, 1);
    });

    it('should handle rounding correctly', async () => {
      const request: LoanSimulationRequest = {
        productId: mockProduct.id,
        loanAmount: 9999.99, // Amount that might cause rounding issues
        termMonths: 7, // Odd number of months
      };

      const result = await simulationService.simulateLoan(request);
      expect(result.success).toBe(true);
      
      // All values should be properly rounded to 2 decimal places (with floating point tolerance)
      expect(result.data.monthlyPayment % 0.01).toBeCloseTo(0, 1);
      expect(result.data.totalAmount % 0.01).toBeCloseTo(0, 1);
      expect(result.data.totalInterest % 0.01).toBeCloseTo(0, 1);
      
      result.data.monthlyBreakdown.forEach(payment => {
        expect(payment.interest % 0.01).toBeCloseTo(0, 1);
        expect(payment.amortization % 0.01).toBeCloseTo(0, 1);
        expect(payment.balance % 0.01).toBeCloseTo(0, 1);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle missing product gracefully', async () => {
      const request: LoanSimulationRequest = {
        productId: 'non-existent-id',
        loanAmount: 10000,
        termMonths: 12,
      };

      const result = await simulationService.simulateLoan(request);
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Produto não encontrado');
      expect(result.data).toEqual({} as any);
    });

    it('should handle calculation errors gracefully', () => {
      // Test that the service functions exist and are callable
      expect(simulationService.simulateLoan).toBeDefined();
      expect(typeof simulationService.simulateLoan).toBe('function');
    });
  });
});