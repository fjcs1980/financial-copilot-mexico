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
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-xl w-full bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-3xl font-bold mb-6">
          ¿Cuánto dinero recibiste?
        </h2>

        <input
          type="number"
          placeholder="Ejemplo: 18000"
          value={income}
          onChange={(e) => onIncomeChange(e.target.value)}
          className="w-full border rounded-lg p-3 mb-6"
        />

        <button
          onClick={onContinue}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg"
        >
          Continuar
        </button>
      </div>
    </main>
  );
}