import React, { useState } from 'react';
import { Debt } from '@/types/financial';

interface DebtsScreenProps {
  debts: Debt[];
  onAddDebt: (debt: Debt) => void;
  onRemoveDebt: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const DebtsScreen: React.FC<DebtsScreenProps> = ({
  debts,
  onAddDebt,
  onRemoveDebt,
  onNext,
  onBack,
}) => {
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [minimumPayment, setMinimumPayment] = useState('');
  const [apr, setApr] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numBalance = parseFloat(balance) || 0;
    const numMin = parseFloat(minimumPayment) || 0;
    const numApr = parseFloat(apr) || 0;

    if (!name.trim()) {
      setError('Por favor indica un nombre para la deuda.');
      return;
    }
    if (numBalance <= 0) {
      setError('El saldo total debe ser mayor a $0.');
      return;
    }
    if (numMin <= 0) {
      setError('El pago mínimo debe ser mayor a $0.');
      return;
    }
    if (numMin > numBalance) {
      setError('El pago mínimo no puede ser mayor que el saldo total.');
      return;
    }
    if (numApr < 0) {
      setError('La tasa APR no puede ser negativa.');
      return;
    }

    const newDebt: Debt = {
      id: Date.now().toString(),
      name: name.trim(),
      balance: numBalance,
      minimumPayment: numMin,
      apr: numApr,
    };

    onAddDebt(newDebt);
    setName('');
    setBalance('');
    setMinimumPayment('');
    setApr('');
  };

  return (
    <div className="max-w-xl w-full mx-auto p-6 bg-white rounded-xl shadow-md space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Tus Deudas</h2>
        <p className="text-sm text-gray-600">
          Registra tus deudas activas para calcular la distribución óptima de pagos.
        </p>
      </div>

      <form onSubmit={handleAdd} className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-700 text-sm">Agregar Deuda</h3>
        
        {error && (
          <div className="p-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Nombre / Tarjeta / Crédito</label>
          <input
            type="text"
            placeholder="Ej. Tarjeta Banamex"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded-md text-sm text-gray-900 bg-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Saldo Total ($)</label>
            <input
              type="number"
              min="1"
              step="any"
              placeholder="15000"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="w-full p-2 border rounded-md text-sm text-gray-900 bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Pago Mínimo ($)</label>
            <input
              type="number"
              min="1"
              step="any"
              placeholder="1200"
              value={minimumPayment}
              onChange={(e) => setMinimumPayment(e.target.value)}
              className="w-full p-2 border rounded-md text-sm text-gray-900 bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Tasa APR (%)</label>
            <input
              type="number"
              min="0"
              step="any"
              placeholder="45"
              value={apr}
              onChange={(e) => setApr(e.target.value)}
              className="w-full p-2 border rounded-md text-sm text-gray-900 bg-white"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-gray-800 text-white rounded-md text-sm font-medium hover:bg-gray-700 transition"
        >
          + Agregar Deuda
        </button>
      </form>

      <div className="space-y-3">
        <h3 className="font-semibold text-gray-700 text-sm">Deudas Registradas ({debts.length})</h3>
        {debts.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No has agregado ninguna deuda todavía.</p>
        ) : (
          <ul className="space-y-2">
            {debts.map((debt) => (
              <li
                key={debt.id}
                className="flex justify-between items-center p-3 bg-gray-50 border rounded-md text-sm"
              >
                <div>
                  <span className="font-medium text-gray-900">{debt.name}</span>
                  <div className="text-xs text-gray-500">
                    Saldo: ${debt.balance.toLocaleString()} | Mínimo: ${debt.minimumPayment.toLocaleString()} | APR: {debt.apr}%
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveDebt(debt.id)}
                  className="text-red-500 hover:text-red-700 text-xs font-semibold"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex justify-between pt-4 border-t">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300 transition"
        >
          Atrás
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={debts.length === 0}
          className={`px-6 py-2 rounded-md text-sm font-medium text-white transition ${
            debts.length === 0
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
          }`}
        >
          Continuar
        </button>
      </div>
    </div>
  );
};