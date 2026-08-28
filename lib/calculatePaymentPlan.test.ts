import { calculatePaymentPlan } from './calculatePaymentPlan';
import { Debt, EssentialExpense } from '../types/financial';

// Arnés de testing tipado y autocontenido (sin dependencias externas)
function describe(suiteName: string, fn: () => void) {
  console.log(`\n--- Test Suite: ${suiteName} ---`);
  fn();
}

function it(testName: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ ${testName}`);
  } catch (error) {
    console.error(`  ✗ ${testName}`);
    console.error(error);
  }
}

function expect<T>(actual: T) {
  return {
    toBe(expected: T) {
      if (actual !== expected) {
        throw new Error(`Expected ${String(expected)} but received ${String(actual)}`);
      }
    },
  };
}

describe('calculatePaymentPlan - Financial Engine Tests', () => {
  const baseExpenses: EssentialExpense[] = [
    { name: 'Renta', amount: 5000 },
    { name: 'Comida', amount: 3000 },
    { name: 'Servicios', amount: 1000 },
  ]; // Total: 9000

  it('Case 1: Should return NO_MONEY_FOR_DEBT when protected expenses cover entire income', () => {
    const debts: Debt[] = [
      { id: '1', name: 'Tarjeta A', balance: 5000, minimumPayment: 500, apr: 40 },
    ];

    const result = calculatePaymentPlan({
      income: 9000,
      essentialExpenses: baseExpenses,
      safetyBuffer: 1000, // Protegido total = 10000 > 9000
      debts,
    });

    expect(result.status).toBe('NO_MONEY_FOR_DEBT');
    expect(result.availableForDebt).toBe(0);
    expect(result.deficit).toBe(500);
    expect(result.recommendations[0].recommendedPayment).toBe(0);
  });

  it('Case 2: Should return MINIMUMS_NOT_COVERED when available amount is less than total minimums', () => {
    const debts: Debt[] = [
      { id: '1', name: 'Tarjeta A', balance: 5000, minimumPayment: 1000, apr: 40 },
      { id: '2', name: 'Tarjeta B', balance: 4000, minimumPayment: 800, apr: 30 },
    ]; // Total mínimos: 1800

    const result = calculatePaymentPlan({
      income: 10000,
      essentialExpenses: baseExpenses, // 9000
      safetyBuffer: 0, // Disponible = 1000
      debts,
    });

    expect(result.status).toBe('MINIMUMS_NOT_COVERED');
    expect(result.availableForDebt).toBe(1000);
    expect(result.minimumPaymentsTotal).toBe(1800);
    expect(result.deficit).toBe(800);
    expect(result.recommendations[0].recommendedPayment).toBe(0);
    expect(result.recommendations[1].recommendedPayment).toBe(0);
  });

  it('Case 3: Should allocate surplus to highest APR debt first', () => {
    const debts: Debt[] = [
      { id: '1', name: 'Tarjeta Low APR', balance: 10000, minimumPayment: 1000, apr: 25 },
      { id: '2', name: 'Tarjeta High APR', balance: 10000, minimumPayment: 1000, apr: 60 },
    ]; // Mínimos = 2000

    const result = calculatePaymentPlan({
      income: 14000,
      essentialExpenses: baseExpenses, // 9000
      safetyBuffer: 0, // Disponible = 5000 -> Excedente = 3000
      debts,
    });

    expect(result.status).toBe('PAYMENT_PLAN_AVAILABLE');
    expect(result.priorityDebtId).toBe('2');

    const recLow = result.recommendations.find((r) => r.debtId === '1');
    const recHigh = result.recommendations.find((r) => r.debtId === '2');

    expect(recLow?.recommendedPayment).toBe(1000); // Solo mínimo
    expect(recHigh?.recommendedPayment).toBe(4000); // Mínimo 1000 + 3000 extra
  });

  it('Case 4: Should break ties in APR by selecting lowest balance first', () => {
    const debts: Debt[] = [
      { id: '1', name: 'Deuda Grande', balance: 15000, minimumPayment: 1000, apr: 50 },
      { id: '2', name: 'Deuda Chica', balance: 3000, minimumPayment: 500, apr: 50 },
    ];

    const result = calculatePaymentPlan({
      income: 12000,
      essentialExpenses: baseExpenses, // 9000
      safetyBuffer: 0, // Disponible = 3000 -> Excedente = 1500
      debts,
    });

    expect(result.priorityDebtId).toBe('2');
    const recChica = result.recommendations.find((r) => r.debtId === '2');
    expect(recChica?.recommendedPayment).toBe(2000); // 500 mínimo + 1500 extra
  });

  it('Case 5: Should cap payment at remaining debt balance and cascade surplus to next debt', () => {
    const debts: Debt[] = [
      { id: '1', name: 'Tarjeta Primaria', balance: 2000, minimumPayment: 500, apr: 60 },
      { id: '2', name: 'Tarjeta Secundaria', balance: 10000, minimumPayment: 1000, apr: 30 },
    ]; // Mínimos = 1500

    const result = calculatePaymentPlan({
      income: 15000,
      essentialExpenses: baseExpenses, // 9000
      safetyBuffer: 0, // Disponible = 6000 -> Excedente = 4500
      debts,
    });

    const recPrimaria = result.recommendations.find((r) => r.debtId === '1');
    const recSecundaria = result.recommendations.find((r) => r.debtId === '2');

    expect(recPrimaria?.recommendedPayment).toBe(2000);
    expect(recPrimaria?.remainingBalance).toBe(0);

    expect(recSecundaria?.recommendedPayment).toBe(4000);
    expect(recSecundaria?.remainingBalance).toBe(6000);
  });
});