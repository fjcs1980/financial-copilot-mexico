"use client";

import { useState } from "react";
import WelcomeScreen from "@/components/WelcomeScreen";
import IncomeScreen from "@/components/IncomeScreen";

export default function Home() {
  const [step, setStep] = useState(1);
  const [income, setIncome] = useState("");
  const [rent, setRent] = useState("");
  const [food, setFood] = useState("");
  const [utilities, setUtilities] = useState("");

  if (step === 1) {
  return <WelcomeScreen onStart={() => setStep(2)} />;
  }
  if (step === 3) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-xl w-full bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-6">
            Gastos esenciales
          </h2>

          <input
            type="number"
            placeholder="Renta"
            value={rent}
            onChange={(e) => setRent(e.target.value)}
            className="w-full border rounded-lg p-3 mb-4"
          />

          <input
            type="number"
            placeholder="Comida"
            value={food}
            onChange={(e) => setFood(e.target.value)}
            className="w-full border rounded-lg p-3 mb-4"
          />

          <input
            type="number"
            placeholder="Servicios"
            value={utilities}
            onChange={(e) => setUtilities(e.target.value)}
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
  return (
  <IncomeScreen
    income={income}
    onIncomeChange={setIncome}
    onContinue={() => setStep(3)}
  />
);
}