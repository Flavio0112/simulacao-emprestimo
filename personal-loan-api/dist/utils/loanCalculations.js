"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAmortizationSchedule = exports.calculateMonthlyPayment = exports.calculateMonthlyInterestRate = void 0;
const calculateMonthlyInterestRate = (annualRate) => {
    return Math.pow(1 + annualRate / 100, 1 / 12) - 1;
};
exports.calculateMonthlyInterestRate = calculateMonthlyInterestRate;
const calculateMonthlyPayment = (principal, monthlyRate, months) => {
    if (monthlyRate === 0)
        return principal / months;
    const factor = Math.pow(1 + monthlyRate, months);
    return (principal * monthlyRate * factor) / (factor - 1);
};
exports.calculateMonthlyPayment = calculateMonthlyPayment;
const generateAmortizationSchedule = (principal, monthlyPayment, monthlyRate, months) => {
    const schedule = [];
    let balance = principal;
    for (let month = 1; month <= months; month++) {
        const interest = balance * monthlyRate;
        const amortization = monthlyPayment - interest;
        balance -= amortization;
        schedule.push({
            month,
            interest: Math.round(interest * 100) / 100,
            amortization: Math.round(amortization * 100) / 100,
            balance: Math.max(0, Math.round(balance * 100) / 100),
        });
    }
    return schedule;
};
exports.generateAmortizationSchedule = generateAmortizationSchedule;
//# sourceMappingURL=loanCalculations.js.map