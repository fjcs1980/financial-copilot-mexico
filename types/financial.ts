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
  debts: Debt[];
}

export interface PaymentRecommendation {
  debtId: string;
  debtName: string;
  recommendedPayment: number;
}

export interface FinancialResult {
  income: number;
  essentialExpensesTotal: number;
  availableForDebt: number;
  recommendations: PaymentRecommendation[];
}