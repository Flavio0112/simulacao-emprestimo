import { IValidationService } from '../interfaces';
import { LoanProduct, LoanSimulationRequest } from '../../types/loan';
import { validateCurrencyAmount } from '../../utils/currency';

export class ValidationService implements IValidationService {
  validateProduct(product: Partial<LoanProduct>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!product.name || product.name.trim().length === 0) {
      errors.push('Nome do produto é obrigatório');
    }

    if (!product.annualInterestRate || product.annualInterestRate <= 0) {
      errors.push('Taxa de juros anual deve ser maior que zero');
    } else if (product.annualInterestRate > 100) {
      errors.push('Taxa de juros anual não pode ser maior que 100%');
    }

    if (!product.maxTermMonths || product.maxTermMonths <= 0) {
      errors.push('Prazo máximo deve ser maior que zero');
    } else if (product.maxTermMonths > 600) {
      errors.push('Prazo máximo não pode ser maior que 600 meses');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validateSimulationRequest(request: Partial<LoanSimulationRequest>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!request.productId || request.productId.trim().length === 0) {
      errors.push('Produto deve ser selecionado');
    }

    if (!request.loanAmount || request.loanAmount <= 0) {
      errors.push('Valor do empréstimo deve ser maior que zero');
    } else if (request.loanAmount > 10000000) {
      errors.push('Valor do empréstimo não pode ser maior que R$ 10.000.000,00');
    }

    if (!request.termMonths || request.termMonths <= 0) {
      errors.push('Prazo deve ser maior que zero');
    } else if (request.termMonths > 600) {
      errors.push('Prazo não pode ser maior que 600 meses');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validateCurrency(value: string): { isValid: boolean; error?: string; numericValue: number } {
    return validateCurrencyAmount(value);
  }
}