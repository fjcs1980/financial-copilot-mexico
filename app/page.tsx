export default function Home() {
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
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition"
        >
          Comenzar
        </button>
      </div>
    </main>
  );
}