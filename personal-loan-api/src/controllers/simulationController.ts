import { Request, Response } from 'express';
import { Storage } from '../data/storage';
import { LoanSimulationRequest, LoanSimulationResult, ApiResponse } from '../types/loan';
import { 
  calculateMonthlyInterestRate, 
  calculateMonthlyPayment, 
  generateAmortizationSchedule 
} from '../utils/loanCalculations';

export class SimulationController {
  // POST /api/simulacoes - Perform loan simulation
  static simulateLoan(req: Request, res: Response): void {
    try {
      const { productId, loanAmount, termMonths }: LoanSimulationRequest = req.body;

      // Basic validation
      if (!productId || typeof productId !== 'string') {
        const errorResponse: ApiResponse<LoanSimulationResult> = {
          success: false,
          data: {} as LoanSimulationResult,
          message: 'ID do produto é obrigatório',
        };
        res.status(400).json(errorResponse);
        return;
      }

      if (!loanAmount || typeof loanAmount !== 'number' || loanAmount <= 0) {
        const errorResponse: ApiResponse<LoanSimulationResult> = {
          success: false,
          data: {} as LoanSimulationResult,
          message: 'Valor do empréstimo deve ser um número positivo',
        };
        res.status(400).json(errorResponse);
        return;
      }

      if (!termMonths || typeof termMonths !== 'number' || termMonths <= 0) {
        const errorResponse: ApiResponse<LoanSimulationResult> = {
          success: false,
          data: {} as LoanSimulationResult,
          message: 'Prazo deve ser um número positivo',
        };
        res.status(400).json(errorResponse);
        return;
      }

      // Find the product
      const product = Storage.getProductById(productId);
      if (!product) {
        const errorResponse: ApiResponse<LoanSimulationResult> = {
          success: false,
          data: {} as LoanSimulationResult,
          message: 'Produto não encontrado',
        };
        res.status(404).json(errorResponse);
        return;
      }

      // Validate term doesn't exceed product's maximum
      if (termMonths > product.maxTermMonths) {
        const errorResponse: ApiResponse<LoanSimulationResult> = {
          success: false,
          data: {} as LoanSimulationResult,
          message: `Prazo máximo para este produto é ${product.maxTermMonths} meses`,
        };
        res.status(400).json(errorResponse);
        return;
      }

      // Perform loan calculations
      const monthlyInterestRate = calculateMonthlyInterestRate(product.annualInterestRate);
      const monthlyPayment = calculateMonthlyPayment(
        loanAmount,
        monthlyInterestRate,
        termMonths
      );
      
      const totalAmount = monthlyPayment * termMonths;
      const totalInterest = totalAmount - loanAmount;
      
      const monthlyBreakdown = generateAmortizationSchedule(
        loanAmount,
        monthlyPayment,
        monthlyInterestRate,
        termMonths
      );

      const result: LoanSimulationResult = {
        product,
        loanAmount,
        termMonths,
        monthlyInterestRate: Math.round(monthlyInterestRate * 10000) / 100, // Convert to percentage
        monthlyPayment: Math.round(monthlyPayment * 100) / 100,
        totalAmount: Math.round(totalAmount * 100) / 100,
        totalInterest: Math.round(totalInterest * 100) / 100,
        monthlyBreakdown,
      };

      const response: ApiResponse<LoanSimulationResult> = {
        success: true,
        data: result,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error simulating loan:', error);
      
      const errorResponse: ApiResponse<LoanSimulationResult> = {
        success: false,
        data: {} as LoanSimulationResult,
        message: 'Erro ao realizar simulação',
      };
      
      res.status(500).json(errorResponse);
    }
  }
}