"use client";

import { useState } from "react";

export default function Home() {
  const [step, setStep] = useState(1);
  const [income, setIncome] = useState("");

  if (step === 1) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-xl w-full bg-white shadow-lg rounded-xl p-8 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Financial Copilot México
          </h1>

          <p className="text-gray-600 mb-8">
            Descubre cómo distribuir tu dinero entre tus gastos esenciales y tus
            deudas para avanzar hacia tu libertad financiera.
          </p>

          <button
            onClick={() => setStep(2)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg"
          >
            Comenzar
          </button>
        </div>
      </main>
    );
  }

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
          onChange={(e) => setIncome(e.target.value)}
          className="w-full border rounded-lg p-3 mb-6"
        />

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg"
        >
          Continuar
        </button>

      </div>
    </main>
  );
}