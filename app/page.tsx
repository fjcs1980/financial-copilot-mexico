'use client';

import React, { useState } from 'react';
import WelcomeScreen from '@/components/WelcomeScreen';
import IncomeScreen from '@/components/IncomeScreen';
import { DebtsScreen } from '@/components/DebtsScreen';
import { Debt } from '@/types/financial';

export default function Home() {
  const [step, setStep] = useState<number>(1);
  const [income, setIncome] = useState<string>('');
  const [rent, setRent] = useState<string>('');
  const [food, setFood] = useState<string>('');
  const [utilities, setUtilities] = useState<string>('');
  const [debts, setDebts] = useState<Debt[]>([]);

  const handleAddDebt = (debt: Debt) => {
    setDebts((prev) => [...prev, debt]);
  };

  const handleRemoveDebt = (id: string) => {
    setDebts((prev) => prev.filter((d) => d.id !== id));
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
        <div className="max-w-md w-full bg-white rounded-xl shadow-md p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Gastos Esenciales</h2>
          <p className="text-sm text-gray-600">
            Protege lo indispensable antes de pagar deudas.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Renta / Vivienda ($)</label>
              <input
                type="number"
                placeholder="0"
                value={rent}
                onChange={(e) => setRent(e.target.value)}
                className="w-full p-2 border rounded-md text-sm text-gray-900 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Comida ($)</label>
              <input
                type="number"
                placeholder="0"
                value={food}
                onChange={(e) => setFood(e.target.value)}
                className="w-full p-2 border rounded-md text-sm text-gray-900 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Servicios ($)</label>
              <input
                type="number"
                placeholder="0"
                value={utilities}
                onChange={(e) => setUtilities(e.target.value)}
                className="w-full p-2 border rounded-md text-sm text-gray-900 bg-white"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300 transition"
            >
              Atrás
            </button>
            <button
              type="button"
              onClick={() => setStep(4)}
              className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition"
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <DebtsScreen
          debts={debts}
          onAddDebt={handleAddDebt}
          onRemoveDebt={handleRemoveDebt}
          onNext={() => alert('¡Captura de deudas lista! Siguiente paso: ResultsScreen')}
          onBack={() => setStep(3)}
        />
      )}
    </main>
  );
}