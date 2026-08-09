export interface EssentialExpense {
  name: string;
  amount: number;
}

export interface Debt {
  id: string;
  name: string;
  balance: number;
  minimumPayment: number;
  apr: number;
}

export interface FinancialInput {
  income: number;
  essentialExpenses: EssentialExpense[];
  safetyBuffer: number;
  debts: Debt[];
}

export interface PaymentRecommendation {
  debtId: string;
  debtName: string;
  currentBalance: number;
  minimumPayment: number;
  extraPayment: number;
  recommendedPayment: number;
  remainingBalance: number;
}

export type PlanStatus =
  | "NO_MONEY_FOR_DEBT"
  | "MINIMUMS_NOT_COVERED"
  | "PAYMENT_PLAN_AVAILABLE";

export interface FinancialResult {
  status: PlanStatus;

  income: number;

  essentialExpensesTotal: number;
  safetyBuffer: number;
  protectedAmount: number;

  availableForDebt: number;
  minimumPaymentsTotal: number;
  deficit: number;
  extraAvailable: number;

  priorityDebtId: string | null;

  recommendations: PaymentRecommendation[];
}