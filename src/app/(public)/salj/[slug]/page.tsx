export default async function GroupStorePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <main className="min-h-screen bg-yellow-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-blue-800">
          Välkommen till vår butik
        </h1>
        <p className="text-gray-600 mt-2">Grupp: {slug}</p>
      </div>
    </main>
  );
}
