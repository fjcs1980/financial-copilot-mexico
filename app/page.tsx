'use client';

import React, { useState } from 'react';
import WelcomeScreen from '@/components/WelcomeScreen';
import IncomeScreen from '@/components/IncomeScreen';
import { ExpensesScreen } from '@/components/ExpensesScreen';
import { DebtsScreen } from '@/components/DebtsScreen';
import { ResultsScreen } from '@/components/ResultsScreen';
import { calculatePaymentPlan } from '@/lib/calculatePaymentPlan';
import { Debt, EssentialExpense, FinancialResult } from '@/types/financial';

export default function Home() {
  const [step, setStep] = useState<number>(1);
  const [income, setIncome] = useState<string>('');
  const [rent, setRent] = useState<string>('');
  const [food, setFood] = useState<string>('');
  const [utilities, setUtilities] = useState<string>('');
  const [safetyBuffer, setSafetyBuffer] = useState<string>('');
  const [debts, setDebts] = useState<Debt[]>([]);
  const [result, setResult] = useState<FinancialResult | null>(null);

  const handleAddDebt = (debt: Debt) => {
    setDebts((prev) => [...prev, debt]);
  };

  const handleRemoveDebt = (id: string) => {
    setDebts((prev) => prev.filter((d) => d.id !== id));
  };

  const handleCalculate = () => {
    const essentialExpenses: EssentialExpense[] = [
      { name: 'Renta / Vivienda', amount: Math.max(0, parseFloat(rent) || 0) },
      { name: 'Comida', amount: Math.max(0, parseFloat(food) || 0) },
      { name: 'Servicios', amount: Math.max(0, parseFloat(utilities) || 0) },
    ].filter((exp) => exp.amount > 0);

    const calcResult = calculatePaymentPlan({
      income: Math.max(0, parseFloat(income) || 0),
      essentialExpenses,
      safetyBuffer: Math.max(0, parseFloat(safetyBuffer) || 0),
      debts,
    });

    setResult(calcResult);
    setStep(5);
  };

  const handleReset = () => {
    setIncome('');
    setRent('');
    setFood('');
    setUtilities('');
    setSafetyBuffer('');
    setDebts([]);
    setResult(null);
    setStep(1);
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {step === 1 && (
        <WelcomeScreen onStart={() => setStep(2)} />
      )}

      {step === 2 && (
        <IncomeScreen
          income={income}
          onIncomeChange={setIncome}
          onContinue={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <ExpensesScreen
          rent={rent}
          food={food}
          utilities={utilities}
          safetyBuffer={safetyBuffer}
          onRentChange={setRent}
          onFoodChange={setFood}
          onUtilitiesChange={setUtilities}
          onSafetyBufferChange={setSafetyBuffer}
          onContinue={() => setStep(4)}
          onBack={() => setStep(2)}
        />
      )}

      {step === 4 && (
        <DebtsScreen
          debts={debts}
          onAddDebt={handleAddDebt}
          onRemoveDebt={handleRemoveDebt}
          onNext={handleCalculate}
          onBack={() => setStep(3)}
        />
      )}

      {step === 5 && result && (
        <ResultsScreen
          result={result}
          onReset={handleReset}
          onBack={() => setStep(4)}
        />
      )}
    </main>
  );
}