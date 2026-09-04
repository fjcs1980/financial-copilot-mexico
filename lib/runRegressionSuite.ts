import { calculatePaymentPlan } from './calculatePaymentPlan';
import { loadSession, saveSession, clearSession, STORAGE_KEY } from './sessionStorage';
import { FinancialInput, Debt } from '../types/financial';

let totalTests = 0;
let passedTests = 0;

function assert(condition: boolean, testName: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`✓ PASS: ${testName}`);
  } else {
    console.error(`✗ FAIL: ${testName}`);
    process.exitCode = 1;
  }
}

console.log('====================================================');
console.log('  FINANCIAL COPILOT MÉXICO — FULL REGRESSION SUITE  ');
console.log('====================================================\n');

// 1. ENGINE CONTRACTS
console.log('--- 1. Testing Financial Engine Contracts ---');
{
  const input: FinancialInput = {
    income: 20000,
    essentialExpenses: [
      { name: 'Renta', amount: 5000 },
      { name: 'Comida', amount: 3000 },
    ],
    safetyBuffer: 2000,
    debts: [
      { id: '1', name: 'Tarjeta A', balance: 10000, minimumPayment: 1000, apr: 50 },
      { id: '2', name: 'Tarjeta B', balance: 8000, minimumPayment: 800, apr: 30 },
    ],
  };

  const res = calculatePaymentPlan(input);
  assert(res.status === 'PAYMENT_PLAN_AVAILABLE', 'Engine generates PAYMENT_PLAN_AVAILABLE when surplus exists');
  assert(res.protectedAmount === 10000, 'Protects essentials and safety buffer accurately ($10,000)');
  assert(res.availableForDebt === 10000, 'Calculates available for debt accurately ($10,000)');
  assert(res.recommendations[0].debtId === '1' && res.recommendations[0].extraPayment > 0, 'Applies extra payment to highest APR (Tarjeta A)');
}

{
  const deficitInput: FinancialInput = {
    income: 5000,
    essentialExpenses: [{ name: 'Renta', amount: 4000 }],
    safetyBuffer: 0,
    debts: [{ id: '1', name: 'Tarjeta A', balance: 5000, minimumPayment: 1500, apr: 40 }],
  };

  const res = calculatePaymentPlan(deficitInput);
  assert(res.status === 'MINIMUMS_NOT_COVERED', 'Engine identifies MINIMUMS_NOT_COVERED correctly');
  assert(res.deficit === 500, 'Calculates exact deficit amount ($500)');
}

// 2. PERSISTENCE CONTRACTS
console.log('\n--- 2. Testing Persistence Contracts ---');
{
  const mockStore: Record<string, string> = {};
  const mockStorage = {
    getItem: (key: string) => mockStore[key] ?? null,
    setItem: (key: string, val: string) => { mockStore[key] = val; },
    removeItem: (key: string) => { delete mockStore[key]; },
  };

  const emptyLoad = loadSession(mockStorage);
  assert(emptyLoad.step === 1 && emptyLoad.income === '', 'Restores default session cleanly');

  mockStorage.setItem(STORAGE_KEY, '{invalid-json');
  const corruptLoad = loadSession(mockStorage);
  assert(corruptLoad.step === 1, 'Corrupted JSON handled defensively without crashing');

  mockStorage.setItem(STORAGE_KEY, '{"step":3,"income":"15000"}');
  clearSession(mockStorage);
  assert(mockStorage.getItem(STORAGE_KEY) === null, 'Clear session purges storage completely');
}

console.log('\n====================================================');
console.log(`SUMMARY: ${passedTests}/${totalTests} TESTS PASSED`);
console.log('====================================================');

if (passedTests !== totalTests) {
  process.exit(1);
}