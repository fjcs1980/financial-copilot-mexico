import {
  FinancialInput,
  FinancialResult,
  PaymentRecommendation,
  PlanStatus,
} from '@/types/financial';

export function calculatePaymentPlan(input: FinancialInput): FinancialResult {
  const { income, essentialExpenses, safetyBuffer, debts } = input;

  // 1. Calcular totales esenciales y protegidos
  const essentialExpensesTotal = essentialExpenses.reduce(
    (sum, exp) => sum + exp.amount,
    0
  );
  const protectedAmount = essentialExpensesTotal + safetyBuffer;
  const availableForDebt = Math.max(0, income - protectedAmount);

  // 2. Calcular total de pagos mínimos
  const minimumPaymentsTotal = debts.reduce(
    (sum, debt) => sum + debt.minimumPayment,
    0
  );

  // Caso A: No hay dinero disponible para deudas
  if (availableForDebt === 0) {
    const recommendations: PaymentRecommendation[] = debts.map((debt) => ({
      debtId: debt.id,
      debtName: debt.name,
      currentBalance: debt.balance,
      minimumPayment: debt.minimumPayment,
      extraPayment: 0,
      recommendedPayment: 0,
      remainingBalance: debt.balance,
    }));

    return {
      status: 'NO_MONEY_FOR_DEBT',
      income,
      essentialExpensesTotal,
      safetyBuffer,
      protectedAmount,
      availableForDebt: 0,
      minimumPaymentsTotal,
      deficit: minimumPaymentsTotal,
      extraAvailable: 0,
      priorityDebtId: null,
      recommendations,
    };
  }

  // Caso B: El dinero no alcanza para cubrir todos los pagos mínimos
  if (availableForDebt < minimumPaymentsTotal) {
    const deficit = minimumPaymentsTotal - availableForDebt;
    const recommendations: PaymentRecommendation[] = debts.map((debt) => ({
      debtId: debt.id,
      debtName: debt.name,
      currentBalance: debt.balance,
      minimumPayment: debt.minimumPayment,
      extraPayment: 0,
      recommendedPayment: 0,
      remainingBalance: debt.balance,
    }));

    return {
      status: 'MINIMUMS_NOT_COVERED',
      income,
      essentialExpensesTotal,
      safetyBuffer,
      protectedAmount,
      availableForDebt,
      minimumPaymentsTotal,
      deficit,
      extraAvailable: 0,
      priorityDebtId: null,
      recommendations,
    };
  }

  // Caso C: Se cubren los mínimos y puede haber excedente
  let extraAvailable = availableForDebt - minimumPaymentsTotal;

  // Ordenar deudas: Mayor APR descendente; desempate por menor saldo
  const sortedDebts = [...debts].sort((a, b) => {
    if (b.apr !== a.apr) {
      return b.apr - a.apr;
    }
    return a.balance - b.balance;
  });

  const priorityDebtId = sortedDebts.length > 0 ? sortedDebts[0].id : null;

  // Mapa temporal para almacenar pagos adicionales calculados
  const extraAllocations = new Map<string, number>();
  sortedDebts.forEach((debt) => extraAllocations.set(debt.id, 0));

  // Asignar excedente a la deuda prioritaria respetando el saldo total
  for (const debt of sortedDebts) {
    if (extraAvailable <= 0) break;

    const remainingDebtAfterMinimum = Math.max(0, debt.balance - debt.minimumPayment);
    const extraToApply = Math.min(extraAvailable, remainingDebtAfterMinimum);

    extraAllocations.set(debt.id, extraToApply);
    extraAvailable -= extraToApply;
  }

  // Construir recomendaciones finales manteniendo el orden original de entrada
  const recommendations: PaymentRecommendation[] = debts.map((debt) => {
    const extraPayment = extraAllocations.get(debt.id) || 0;
    const recommendedPayment = Math.min(debt.balance, debt.minimumPayment + extraPayment);
    const remainingBalance = Math.max(0, debt.balance - recommendedPayment);

    return {
      debtId: debt.id,
      debtName: debt.name,
      currentBalance: debt.balance,
      minimumPayment: debt.minimumPayment,
      extraPayment,
      recommendedPayment,
      remainingBalance,
    };
  });

  return {
    status: 'PAYMENT_PLAN_AVAILABLE',
    income,
    essentialExpensesTotal,
    safetyBuffer,
    protectedAmount,
    availableForDebt,
    minimumPaymentsTotal,
    deficit: 0,
    extraAvailable: availableForDebt - minimumPaymentsTotal,
    priorityDebtId,
    recommendations,
  };
}