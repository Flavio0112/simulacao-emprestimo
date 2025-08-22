import { LoanProduct, LoanSimulationRequest, LoanSimulationResult } from '../types/loan';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface IProductService {
  getProducts(): Promise<ApiResponse<LoanProduct[]>>;
  createProduct(product: Omit<LoanProduct, 'id' | 'createdAt'>): Promise<ApiResponse<LoanProduct>>;
}

export interface ISimulationService {
  simulateLoan(request: LoanSimulationRequest): Promise<ApiResponse<LoanSimulationResult>>;
}

export interface IHttpClient {
  get<T>(url: string): Promise<T>;
  post<T>(url: string, data: any): Promise<T>;
}

export interface ICurrencyFormatter {
  format(value: number): string;
  parse(value: string): number;
  applyMask(value: string): string;
  validate(value: string): { isValid: boolean; error?: string; numericValue: number };
}

export interface ILoanCalculator {
  generateAmortizationSchedule(
    principal: number,
    monthlyPayment: number,
    monthlyRate: number,
    months: number
  ): Array<{
    month: number;
    interest: number;
    amortization: number;
    balance: number;
  }>;
}

export interface IStorageService {
  getItem<T>(key: string): Promise<T | null>;
  setItem<T>(key: string, value: T): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}

export interface IValidationService {
  validateProduct(product: Partial<LoanProduct>): { isValid: boolean; errors: string[] };
  validateSimulationRequest(request: Partial<LoanSimulationRequest>): { isValid: boolean; errors: string[] };
  validateCurrency(value: string): { isValid: boolean; error?: string; numericValue: number };
}

export interface INotificationService {
  showSuccess(message: string): void;
  showError(message: string): void;
  showWarning(message: string): void;
  showInfo(message: string): void;
}

export interface INavigationService {
  navigate(screen: string, params?: any): void;
  goBack(): void;
  canGoBack(): boolean;
  reset(screen: string, params?: any): void;
}