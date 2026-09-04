'use client';

import React, { useState, useEffect } from 'react';
import WelcomeScreen from '@/components/WelcomeScreen';
import IncomeScreen from '@/components/IncomeScreen';
import { ExpensesScreen } from '@/components/ExpensesScreen';
import { DebtsScreen } from '@/components/DebtsScreen';
import { ResultsScreen } from '@/components/ResultsScreen';
import { ProgressStepper } from '@/components/ProgressStepper';
import { calculatePaymentPlan } from '@/lib/calculatePaymentPlan';
import {
  loadSession,
  saveSession,
  clearSession,
} from '@/lib/sessionStorage';
import { Debt, EssentialExpense, FinancialResult } from '@/types/financial';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const [income, setIncome] = useState<string>('');
  const [rent, setRent] = useState<string>('');
  const [food, setFood] = useState<string>('');
  const [utilities, setUtilities] = useState<string>('');
  const [safetyBuffer, setSafetyBuffer] = useState<string>('');
  const [debts, setDebts] = useState<Debt[]>([]);
  const [result, setResult] = useState<FinancialResult | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const restored = loadSession(window.localStorage);
      setStep(restored.step);
      setIncome(restored.income);
      setRent(restored.rent);
      setFood(restored.food);
      setUtilities(restored.utilities);
      setSafetyBuffer(restored.safetyBuffer);
      setDebts(restored.debts);
      setResult(restored.result);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded || typeof window === 'undefined') return;

    saveSession(window.localStorage, {
      step,
      income,
      rent,
      food,
      utilities,
      safetyBuffer,
      debts,
      result,
    });
  }, [step, income, rent, food, utilities, safetyBuffer, debts, result, isLoaded]);

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

    if (typeof window !== 'undefined') {
      clearSession(window.localStorage);
    }
  };

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-gray-500 text-sm">Cargando sesión...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {step > 1 && <ProgressStepper currentStep={step} />}

      {step === 1 && (
        <WelcomeScreen onStart={() => setStep(2)} />
      )}

      {step === 2 && (
        <IncomeScreen
          income={income}
          onIncomeChange={(val: string) => setIncome(val)}
          onContinue={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <ExpensesScreen
          rent={rent}
          food={food}
          utilities={utilities}
          safetyBuffer={safetyBuffer}
          onRentChange={(val: string) => setRent(val)}
          onFoodChange={(val: string) => setFood(val)}
          onUtilitiesChange={(val: string) => setUtilities(val)}
          onSafetyBufferChange={(val: string) => setSafetyBuffer(val)}
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