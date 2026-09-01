import React from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="max-w-md w-full bg-white rounded-xl shadow-md p-6 space-y-6 text-center">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-800">
          Financial Copilot México
        </h1>
        <p className="text-sm text-gray-600">
          Toma el control del dinero que recibes: protege tus gastos indispensables y acelera la liquidación de tus deudas.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-left space-y-2">
        <h3 className="text-xs font-semibold text-blue-900 uppercase tracking-wider">
          Privacidad y Seguridad
        </h3>
        <p className="text-xs text-blue-800 leading-relaxed">
          Tus datos financieros se procesan exclusivamente en este dispositivo. No requerimos registro, no nos conectamos a tus cuentas bancarias ni almacenamos tu información en servidores externos.
        </p>
      </div>

      <button
        type="button"
        onClick={onStart}
        className="w-full py-3 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700 transition cursor-pointer"
      >
        Comenzar
      </button>

      <p className="text-[11px] text-gray-400">
        Herramienta de acompañamiento y optimización financiera de uso personal.
      </p>
    </div>
  );
}