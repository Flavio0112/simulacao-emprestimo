import { Request, Response } from 'express';
import { Storage } from '../data/storage';
import { LoanProduct, ApiResponse } from '../types/loan';

export class ProductController {
  // GET /api/produtos - List all products
  static getProducts(req: Request, res: Response): void {
    try {
      const products = Storage.getAllProducts();
      
      const response: ApiResponse<LoanProduct[]> = {
        success: true,
        data: products,
      };
      
      res.status(200).json(response);
    } catch (error) {
      console.error('Error getting products:', error);
      
      const errorResponse: ApiResponse<LoanProduct[]> = {
        success: false,
        data: [],
        message: 'Erro ao carregar produtos',
      };
      
      res.status(500).json(errorResponse);
    }
  }

  // POST /api/produtos - Create a new product
  static createProduct(req: Request, res: Response): void {
    try {
      const { name, annualInterestRate, maxTermMonths } = req.body;

      // Basic validation
      if (!name || typeof name !== 'string') {
        const errorResponse: ApiResponse<LoanProduct> = {
          success: false,
          data: {} as LoanProduct,
          message: 'Nome do produto é obrigatório',
        };
        res.status(400).json(errorResponse);
        return;
      }

      if (!annualInterestRate || typeof annualInterestRate !== 'number' || annualInterestRate <= 0) {
        const errorResponse: ApiResponse<LoanProduct> = {
          success: false,
          data: {} as LoanProduct,
          message: 'Taxa de juros anual deve ser um número positivo',
        };
        res.status(400).json(errorResponse);
        return;
      }

      if (!maxTermMonths || typeof maxTermMonths !== 'number' || maxTermMonths <= 0) {
        const errorResponse: ApiResponse<LoanProduct> = {
          success: false,
          data: {} as LoanProduct,
          message: 'Prazo máximo deve ser um número positivo',
        };
        res.status(400).json(errorResponse);
        return;
      }

      // Create the product
      const newProduct = Storage.addProduct({
        name: name.trim(),
        annualInterestRate,
        maxTermMonths,
      });

      const response: ApiResponse<LoanProduct> = {
        success: true,
        data: newProduct,
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Error creating product:', error);
      
      const errorResponse: ApiResponse<LoanProduct> = {
        success: false,
        data: {} as LoanProduct,
        message: 'Erro ao criar produto',
      };
      
      res.status(500).json(errorResponse);
    }
  }
}