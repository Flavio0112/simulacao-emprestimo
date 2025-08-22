import { IHttpClient } from '../../services/interfaces';
import { LoanProduct, LoanSimulationRequest, LoanSimulationResult } from '../../types/loan';
import { 
  calculateMonthlyInterestRate, 
  calculateMonthlyPayment, 
  generateAmortizationSchedule 
} from '../../utils/loanCalculations';

// Mock data for testing
const mockProducts: LoanProduct[] = [
  {
    id: '1',
    name: 'Empréstimo Pessoal',
    annualInterestRate: 18.5,
    maxTermMonths: 60,
  },
  {
    id: '2',
    name: 'Crédito Consignado',
    annualInterestRate: 12.8,
    maxTermMonths: 84,
  },
  {
    id: '3',
    name: 'Financiamento Imobiliário',
    annualInterestRate: 9.2,
    maxTermMonths: 360,
  },
];

export class MockHttpClient implements IHttpClient {
  private products: LoanProduct[] = [...mockProducts];
  private shouldThrowError = false;
  private errorToThrow: any = null;

  async get<T>(url: string): Promise<T> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    if (this.shouldThrowError) {
      throw this.errorToThrow;
    }

    if (url.includes('/produtos')) {
      return [...this.products] as T;
    }

    throw new Error(`Mock endpoint not implemented: ${url}`);
  }

  async post<T>(url: string, data: any): Promise<T> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (this.shouldThrowError) {
      throw this.errorToThrow;
    }

    if (url.includes('/produtos')) {
      const newProduct: LoanProduct = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date(),
      };
      this.products.push(newProduct);
      return newProduct as T;
    }

    if (url.includes('/simulacoes')) {
      const request = data as LoanSimulationRequest;
      const product = this.products.find(p => p.id === request.productId);
      
      if (!product) {
        const error = new Error('Produto não encontrado') as any;
        error.response = { data: { message: 'Produto não encontrado' } };
        throw error;
      }

      const monthlyInterestRate = calculateMonthlyInterestRate(product.annualInterestRate);
      const monthlyPayment = calculateMonthlyPayment(
        request.loanAmount,
        monthlyInterestRate,
        request.termMonths
      );
      
      const totalAmount = monthlyPayment * request.termMonths;
      const totalInterest = totalAmount - request.loanAmount;
      
      const monthlyBreakdown = generateAmortizationSchedule(
        request.loanAmount,
        monthlyPayment,
        monthlyInterestRate,
        request.termMonths
      );

      const result: LoanSimulationResult = {
        product,
        loanAmount: request.loanAmount,
        termMonths: request.termMonths,
        monthlyInterestRate: Math.round(monthlyInterestRate * 10000) / 100,
        monthlyPayment: Math.round(monthlyPayment * 100) / 100,
        totalAmount: Math.round(totalAmount * 100) / 100,
        totalInterest: Math.round(totalInterest * 100) / 100,
        monthlyBreakdown,
      };

      return { data: result } as T;
    }

    throw new Error(`Mock endpoint not implemented: ${url}`);
  }


  // Test utility methods
  reset(): void {
    this.products = [...mockProducts];
    this.shouldThrowError = false;
    this.errorToThrow = null;
  }

  addProduct(product: LoanProduct): void {
    this.products.push(product);
  }

  getProducts(): LoanProduct[] {
    return [...this.products];
  }

  // Error simulation methods
  setError(error: any): void {
    this.shouldThrowError = true;
    this.errorToThrow = error;
  }

  clearError(): void {
    this.shouldThrowError = false;
    this.errorToThrow = null;
  }
}