export default function HomePage() {
  return (
    <main className="min-h-screen bg-yellow-50 flex flex-col items-center justify-center">
      <div className="max-w-2xl text-center px-4">
        <h1 className="text-5xl font-black text-blue-800 mb-4">Vobilo</h1>
        <p className="text-xl text-gray-700 mb-8">
          Hjälp ert lag eller er klass att samla in pengar — sälj riktigt bra
          produkter till familj och vänner.
        </p>
        <a
          href="/starta"
          className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-3 px-8 rounded-full text-lg transition-colors"
        >
          Starta er försäljning →
        </a>
      </div>
    </main>
  );
}
