export declare const calculateMonthlyInterestRate: (annualRate: number) => number;
export declare const calculateMonthlyPayment: (principal: number, monthlyRate: number, months: number) => number;
export declare const generateAmortizationSchedule: (principal: number, monthlyPayment: number, monthlyRate: number, months: number) => {
    month: number;
    interest: number;
    amortization: number;
    balance: number;
}[];
//# sourceMappingURL=loanCalculations.d.ts.map