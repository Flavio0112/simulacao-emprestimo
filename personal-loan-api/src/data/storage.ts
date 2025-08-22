import { LoanProduct } from '../types/loan';

// In-memory storage using arrays as requested
export class Storage {
  private static products: LoanProduct[] = [
    {
      id: '1',
      name: 'Empréstimo Pessoal',
      annualInterestRate: 18.5,
      maxTermMonths: 60,
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      name: 'Crédito Consignado',
      annualInterestRate: 12.8,
      maxTermMonths: 84,
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '3',
      name: 'Financiamento Imobiliário',
      annualInterestRate: 9.2,
      maxTermMonths: 360,
      createdAt: new Date('2024-01-01'),
    },
  ];

  static getAllProducts(): LoanProduct[] {
    return [...this.products]; // Return copy to prevent external modifications
  }

  static getProductById(id: string): LoanProduct | undefined {
    return this.products.find(product => product.id === id);
  }

  static addProduct(product: Omit<LoanProduct, 'id' | 'createdAt'>): LoanProduct {
    const newProduct: LoanProduct = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    
    this.products.push(newProduct);
    return newProduct;
  }

  static getProductCount(): number {
    return this.products.length;
  }

  // Reset storage for testing purposes
  static reset(): void {
    this.products = [
      {
        id: '1',
        name: 'Empréstimo Pessoal',
        annualInterestRate: 18.5,
        maxTermMonths: 60,
        createdAt: new Date('2024-01-01'),
      },
      {
        id: '2',
        name: 'Crédito Consignado',
        annualInterestRate: 12.8,
        maxTermMonths: 84,
        createdAt: new Date('2024-01-01'),
      },
      {
        id: '3',
        name: 'Financiamento Imobiliário',
        annualInterestRate: 9.2,
        maxTermMonths: 360,
        createdAt: new Date('2024-01-01'),
      },
    ];
  }
}