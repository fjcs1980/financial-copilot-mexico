import React from 'react';

interface ExpensesScreenProps {
  rent: string;
  food: string;
  utilities: string;
  safetyBuffer: string;
  onRentChange: (value: string) => void;
  onFoodChange: (value: string) => void;
  onUtilitiesChange: (value: string) => void;
  onSafetyBufferChange: (value: string) => void;
  onContinue: () => void;
  onBack: () => void;
}

export const ExpensesScreen: React.FC<ExpensesScreenProps> = ({
  rent,
  food,
  utilities,
  safetyBuffer,
  onRentChange,
  onFoodChange,
  onUtilitiesChange,
  onSafetyBufferChange,
  onContinue,
  onBack,
}) => {
  return (
    <div className="max-w-md w-full bg-white rounded-xl shadow-md p-6 space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Gastos Esenciales y Protección</h2>
        <p className="text-sm text-gray-600">
          Protege lo indispensable y tu colchón de emergencia antes de pagar deudas.
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Renta / Vivienda ($)
          </label>
          <input
            type="number"
            min="0"
            placeholder="0"
            value={rent}
            onChange={(e) => onRentChange(e.target.value)}
            className="w-full p-2 border rounded-md text-sm text-gray-900 bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Comida ($)
          </label>
          <input
            type="number"
            min="0"
            placeholder="0"
            value={food}
            onChange={(e) => onFoodChange(e.target.value)}
            className="w-full p-2 border rounded-md text-sm text-gray-900 bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Servicios ($)
          </label>
          <input
            type="number"
            min="0"
            placeholder="0"
            value={utilities}
            onChange={(e) => onUtilitiesChange(e.target.value)}
            className="w-full p-2 border rounded-md text-sm text-gray-900 bg-white"
          />
        </div>

        <div className="pt-2 border-t border-gray-100">
          <label className="block text-xs font-medium text-blue-700 mb-1">
            Colchón de Emergencia / Imprevistos ($)
          </label>
          <input
            type="number"
            min="0"
            placeholder="0"
            value={safetyBuffer}
            onChange={(e) => onSafetyBufferChange(e.target.value)}
            className="w-full p-2 border border-blue-200 rounded-md text-sm text-gray-900 bg-blue-50/30"
          />
          <span className="text-[11px] text-gray-500">Opcional. Dinero retenido antes de abonar a deudas.</span>
        </div>
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
          onClick={onContinue}
          className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};