import { ILoanCalculator } from '../interfaces';

export class LoanCalculator implements ILoanCalculator {

  /**
   * Generates amortization schedule for a loan.
   * All values rounded to 2 decimals to match example.
   */
  generateAmortizationSchedule(
    principal: number,
    monthlyPayment: number,
    monthlyRate: number,
    months: number
  ): Array<{ month: number; interest: number; amortization: number; balance: number }> {
    const schedule = [];
    let remainingBalance = principal;

    // Convert the incoming percentage rate (e.g., 1.77) to its decimal form (e.g., 0.0177) for calculation.
    const monthlyRateDecimal = monthlyRate / 100;

    for (let month = 1; month <= months; month++) {
      // 1. Calculate the interest for the current month (truncate to 2 decimals)
      let interestPaymentRaw = remainingBalance * monthlyRateDecimal;
  let interestPayment = bankersRound(interestPaymentRaw, 2);

      // 2. Calculate the principal portion of the payment (truncate to 2 decimals)
      let principalPaymentRaw = (month === months)
        ? remainingBalance
        : monthlyPayment - interestPayment;
  let principalPayment = bankersRound(principalPaymentRaw, 2);

      // 3. Update the remaining balance (truncate to 2 decimals)
      remainingBalance -= principalPayment;
  let truncatedBalance = bankersRound(remainingBalance, 2);

      schedule.push({
        month: month,
        interest: interestPayment,
        amortization: principalPayment,
        balance: truncatedBalance,
      });
      remainingBalance = truncatedBalance;
}

// Bankers rounding: round half to even
function bankersRound(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  const n = value * factor;
  const f = Math.floor(n);
  const r = n - f;
  if (r > 0.5) return (Math.ceil(n) / factor);
  if (r < 0.5) return (f / factor);
  // r === 0.5
  // If f is even, round down; if odd, round up
  if (f % 2 === 0) return (f / factor);
  return (Math.ceil(n) / factor);
    }

    return schedule;
  }
}