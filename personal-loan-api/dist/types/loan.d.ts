export interface LoanProduct {
    id: string;
    name: string;
    annualInterestRate: number;
    maxTermMonths: number;
    createdAt?: Date;
}
export interface LoanSimulationRequest {
    productId: string;
    loanAmount: number;
    termMonths: number;
}
export interface MonthlyPayment {
    month: number;
    interest: number;
    amortization: number;
    balance: number;
}
export interface LoanSimulationResult {
    product: LoanProduct;
    loanAmount: number;
    termMonths: number;
    monthlyInterestRate: number;
    monthlyPayment: number;
    totalAmount: number;
    totalInterest: number;
    monthlyBreakdown: MonthlyPayment[];
}
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}
export interface ApiError {
    success: false;
    message: string;
    errors?: Record<string, string[]>;
}
//# sourceMappingURL=loan.d.ts.map