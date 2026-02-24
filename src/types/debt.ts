export interface DebtEntry {
  id: string;
  name: string;
  balance: number;
  minPayment: number;
  interestRate: number;
}

export interface ExtraPayments {
  perMonth: number;
  perYear: number;
  oneTime: number;
  oneTimeMonth: number;
}

export type PayoffStrategy = 'avalanche' | 'snowball';

export interface CalculatorInputs {
  debts: DebtEntry[];
  extraPayments: ExtraPayments;
  fixedTotal: boolean;
  strategy: PayoffStrategy;
}

export interface MonthlySnapshot {
  month: number;
  date: string;
  debts: {
    name: string;
    payment: number;
    principal: number;
    interest: number;
    remainingBalance: number;
  }[];
  totalPayment: number;
  totalRemaining: number;
  totalInterest: number;
}

export interface PayoffResult {
  totalMonths: number;
  totalInterestPaid: number;
  payoffDate: string;
  payoffOrder: { name: string; month: number; date: string }[];
  schedule: MonthlySnapshot[];
  chartData: { month: number; remaining: number; interest: number }[];
}
