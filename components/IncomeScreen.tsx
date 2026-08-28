import React from 'react';

interface IncomeScreenProps {
  income: string;
  onIncomeChange: (value: string) => void;
  onContinue: () => void;
}

export default function IncomeScreen({
  income,
  onIncomeChange,
  onContinue,
}: IncomeScreenProps) {
  const numericIncome = parseFloat(income) || 0;
  const isValid = numericIncome > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onContinue();
    }
  };

  return (
    <div className="max-w-md w-full bg-white rounded-xl shadow-md p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Tus Ingresos</h2>
        <p className="text-sm text-gray-600 mt-1">
          Indica el dinero neto disponible que recibes para este ciclo.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Ingreso Neto ($)
          </label>
          <input
            type="number"
            min="1"
            step="any"
            placeholder="Ej. 15000"
            value={income}
            onChange={(e) => onIncomeChange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md text-base text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className={`w-full py-3 rounded-md text-sm font-semibold text-white transition ${
            isValid
              ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
              : 'bg-blue-300 cursor-not-allowed'
          }`}
        >
          Continuar
        </button>
      </form>
    </div>
  );
}