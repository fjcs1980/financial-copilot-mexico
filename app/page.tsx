'use client';

import React, { useState, useEffect } from 'react';
import WelcomeScreen from '@/components/WelcomeScreen';
import IncomeScreen from '@/components/IncomeScreen';
import { ExpensesScreen } from '@/components/ExpensesScreen';
import { DebtsScreen } from '@/components/DebtsScreen';
import { ResultsScreen } from '@/components/ResultsScreen';
import { ProgressStepper } from '@/components/ProgressStepper';
import { calculatePaymentPlan } from '@/lib/calculatePaymentPlan';
import { Debt, EssentialExpense, FinancialResult } from '@/types/financial';

const STORAGE_KEY = 'financial_copilot_session_v1';

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
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.step) setStep(parsed.step);
        if (parsed.income) setIncome(parsed.income);
        if (parsed.rent) setRent(parsed.rent);
        if (parsed.food) setFood(parsed.food);
        if (parsed.utilities) setUtilities(parsed.utilities);
        if (parsed.safetyBuffer) setSafetyBuffer(parsed.safetyBuffer);
        if (parsed.debts) setDebts(parsed.debts);
        if (parsed.result) setResult(parsed.result);
      }
    } catch (e) {
      console.error('Error cargando sesión previa de localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      const sessionData = {
        step,
        income,
        rent,
        food,
        utilities,
        safetyBuffer,
        debts,
        result,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
    } catch (e) {
      console.error('Error guardando sesión en localStorage', e);
    }
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
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Error limpiando sesión en localStorage', e);
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