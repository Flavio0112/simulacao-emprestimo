// Loan calculation utilities copied from mobile app

export const calculateMonthlyInterestRate = (annualRate: number): number => {
  return Math.pow(1 + annualRate / 100, 1/12) - 1;
};

export const calculateMonthlyPayment = (
  principal: number,
  monthlyRate: number,
  months: number
): number => {
  if (monthlyRate === 0) return principal / months;
  
  const factor = Math.pow(1 + monthlyRate, months);
  return (principal * monthlyRate * factor) / (factor - 1);
};

export const generateAmortizationSchedule = (
  principal: number,
  monthlyPayment: number,
  monthlyRate: number,
  months: number
) => {
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