import React from 'react';
import { FinancialResult } from '@/types/financial';

interface ResultsScreenProps {
  result: FinancialResult;
  onReset: () => void;
  onBack: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  result,
  onReset,
  onBack,
}) => {
  const {
    status,
    income,
    essentialExpensesTotal,
    safetyBuffer,
    protectedAmount,
    availableForDebt,
    minimumPaymentsTotal,
    deficit,
    recommendations,
  } = result;

  return (
    <div className="max-w-2xl w-full mx-auto p-6 bg-white rounded-xl shadow-md space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Tu Plan de Distribución</h2>
        <p className="text-sm text-gray-600">
          Recomendación clara y sin juicios para el ingreso actual.
        </p>
      </div>

      {/* Resumen del dinero protegido y disponible */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
        <div>
          <span className="block text-xs text-gray-500">Ingreso</span>
          <span className="text-base font-bold text-gray-800">${income.toLocaleString()}</span>
        </div>
        <div>
          <span className="block text-xs text-gray-500">Gastos Básicos</span>
          <span className="text-base font-bold text-gray-800">${essentialExpensesTotal.toLocaleString()}</span>
        </div>
        <div>
          <span className="block text-xs text-gray-500">Protegido Total</span>
          <span className="text-base font-bold text-blue-600">${protectedAmount.toLocaleString()}</span>
        </div>
        <div>
          <span className="block text-xs text-gray-500">Para Deuda</span>
          <span className="text-base font-bold text-emerald-600">${availableForDebt.toLocaleString()}</span>
        </div>
      </div>

      {/* Estado: No hay dinero para deuda */}
      {status === 'NO_MONEY_FOR_DEBT' && (
        <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-md">
          <h3 className="font-semibold text-amber-800 text-sm">Prioridad: Proteger tus necesidades esenciales</h3>
          <p className="text-xs text-amber-700 mt-1">
            Tus gastos básicos cubren la totalidad de tu ingreso en este ciclo. Protege primero tu sustento antes de realizar pagos de deuda.
          </p>
        </div>
      )}

      {/* Estado: No alcanza para mínimos */}
      {status === 'MINIMUMS_NOT_COVERED' && (
        <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-md">
          <h3 className="font-semibold text-amber-800 text-sm">Mínimos requeridos no cubiertos</h3>
          <p className="text-xs text-amber-700 mt-1">
            Los mínimos suman ${minimumPaymentsTotal.toLocaleString()}, dejando una diferencia de ${deficit.toLocaleString()}. Te sugerimos proteger primero tus gastos indispensables.
          </p>
        </div>
      )}

      {/* Estado: Plan disponible */}
      {status === 'PAYMENT_PLAN_AVAILABLE' && (
        <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-md">
          <h3 className="font-semibold text-emerald-800 text-sm">Plan de pago optimizado</h3>
          <p className="text-xs text-emerald-700 mt-1">
            Tus pagos mínimos están cubiertos y el excedente se dirige estratégicamente a la deuda con mayor tasa de interés.
          </p>
        </div>
      )}

      {/* Tabla de recomendaciones */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-700 text-sm">Distribución por Deuda</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700 border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-600 uppercase font-semibold">
              <tr>
                <th className="p-3">Deuda</th>
                <th className="p-3">Saldo Actual</th>
                <th className="p-3">Pago Mínimo</th>
                <th className="p-3">Pago Extra</th>
                <th className="p-3 text-emerald-700">Pago Sugerido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recommendations.map((rec) => (
                <tr key={rec.debtId} className="hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-900">{rec.debtName}</td>
                  <td className="p-3">${rec.currentBalance.toLocaleString()}</td>
                  <td className="p-3">${rec.minimumPayment.toLocaleString()}</td>
                  <td className="p-3 font-semibold text-emerald-600">
                    {rec.extraPayment > 0 ? `+$${rec.extraPayment.toLocaleString()}` : '$0'}
                  </td>
                  <td className="p-3 font-bold text-gray-900 bg-emerald-50/50">
                    ${rec.recommendedPayment.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex justify-between pt-4 border-t">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300 transition"
        >
          Modificar Deudas
        </button>
        <button
          type="button"
          onClick={onReset}
          className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition"
        >
          Nuevo Cálculo
        </button>
      </div>
    </div>
  );
};