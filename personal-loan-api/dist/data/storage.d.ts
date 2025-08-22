import { LoanProduct } from '../types/loan';
export declare class Storage {
    private static products;
    static getAllProducts(): LoanProduct[];
    static getProductById(id: string): LoanProduct | undefined;
    static addProduct(product: Omit<LoanProduct, 'id' | 'createdAt'>): LoanProduct;
    static getProductCount(): number;
    static reset(): void;
}
//# sourceMappingURL=storage.d.ts.map