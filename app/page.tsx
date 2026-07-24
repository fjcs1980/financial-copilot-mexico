export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
      <h1 className="text-5xl font-bold text-slate-900">
        Financial Copilot México
      </h1>

      <p className="mt-6 max-w-2xl text-lg text-slate-600">
        Decide cómo distribuir el ingreso que acabas de recibir sin poner en
        riesgo tus gastos esenciales.
      </p>

      <button className="mt-10 rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white hover:bg-blue-700">
        Comenzar mi plan
      </button>
    </main>
  );
}