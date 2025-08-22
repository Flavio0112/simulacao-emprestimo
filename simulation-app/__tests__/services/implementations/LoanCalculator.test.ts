import { LoanCalculator } from '../../../services/implementations/LoanCalculator';

describe('LoanCalculator - CSV Amortization Table Reference', () => {
  let calculator: LoanCalculator;

  beforeEach(() => {
    calculator = new LoanCalculator();
  });

  describe('Integration Tests', () => {
    it('matches CSV amortization table values', () => {
      // R$ 10.000, 12 meses, 1.39% mensal, parcela R$ 910,53
      const principal = 10000;
      const monthlyRate = 1.39;
      const months = 12;
      const expectedMonthlyPayment = 910.53;
      const expectedSchedule = [
        { month: 1, interest: 139.00, amortization: 771.53, balance: 9228.47 },
        { month: 2, interest: 128.28, amortization: 782.25, balance: 8446.22 },
        { month: 3, interest: 117.40, amortization: 793.13, balance: 7653.09 },
        { month: 4, interest: 106.38, amortization: 804.15, balance: 6848.94 },
        { month: 5, interest: 95.20, amortization: 815.33, balance: 6033.61 },
        { month: 6, interest: 83.87, amortization: 826.66, balance: 5206.95 },
        { month: 7, interest: 72.38, amortization: 838.15, balance: 4368.80 },
        { month: 8, interest: 60.73, amortization: 849.80, balance: 3519.00 },
        { month: 9, interest: 48.91, amortization: 861.62, balance: 2657.38 },
        { month: 10, interest: 36.94, amortization: 873.59, balance: 1783.79 },
        { month: 11, interest: 24.79, amortization: 885.74, balance: 898.05 },
        { month: 12, interest: 12.48, amortization: 898.05, balance: 0.00 }
      ];
      const schedule = calculator.generateAmortizationSchedule(principal, expectedMonthlyPayment, monthlyRate, months);
      expect(schedule).toHaveLength(months);
      expectedSchedule.forEach((expected, i) => {
        expect(schedule[i].month).toBe(expected.month);
        expect(schedule[i].interest).toBe(expected.interest);
        expect(schedule[i].amortization).toBe(expected.amortization);
        expect(schedule[i].balance).toBe(expected.balance);
      });
    });
  });
});