import React from 'react';

interface ProgressStepperProps {
  currentStep: number;
}

const STEPS = [
  { step: 2, label: 'Ingresos' },
  { step: 3, label: 'Gastos' },
  { step: 4, label: 'Deudas' },
  { step: 5, label: 'Resultados' },
];

export const ProgressStepper: React.FC<ProgressStepperProps> = ({ currentStep }) => {
  return (
    <div className="w-full max-w-xl mx-auto mb-6 px-4">
      <div className="flex items-center justify-between relative">
        {STEPS.map((s, index) => {
          const isCompleted = currentStep > s.step;
          const isCurrent = currentStep === s.step;

          return (
            <React.Fragment key={s.step}>
              <div className="flex flex-col items-center z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isCompleted ? '✓' : index + 1}
                </div>
                <span
                  className={`text-[11px] mt-1 font-medium ${
                    isCurrent ? 'text-blue-700 font-semibold' : 'text-gray-500'
                  }`}
                >
                  {s.label}
                </span>
              </div>

              {index < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 -mt-4 transition-colors ${
                    currentStep > s.step ? 'bg-emerald-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};