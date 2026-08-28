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
      { name: 'Renta / Vivienda', amount: parseFloat(rent) || 0 },
      { name: 'Comida', amount: parseFloat(food) || 0 },
      { name: 'Servicios', amount: parseFloat(utilities) || 0 },
    ].filter((exp) => exp.amount > 0);

    const calcResult = calculatePaymentPlan({
      income: parseFloat(income) || 0,
      essentialExpenses,
      safetyBuffer: 0,
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
          onIncomeChange={(val) => setIncome(val)}
          onContinue={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <ExpensesScreen
          rent={rent}
          food={food}
          utilities={utilities}
          onRentChange={(val) => setRent(val)}
          onFoodChange={(val) => setFood(val)}
          onUtilitiesChange={(val) => setUtilities(val)}
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