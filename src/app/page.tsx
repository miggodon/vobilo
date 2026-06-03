const products = [
  { name: "Hamburgerpress", price: 99, emoji: "🍔", category: "Kök" },
  { name: "Bagagevåg", price: 99, emoji: "🧳", category: "Resor" },
  { name: "Gympåse", price: 129, emoji: "🎒", category: "Sport" },
  { name: "Kryddkvarnar", price: 99, emoji: "🧂", category: "Kök" },
  { name: "Magnetlist knivar", price: 99, emoji: "🔪", category: "Kök" },
  { name: "Silikonspatlar 3-pack", price: 79, emoji: "🥄", category: "Kök" },
  { name: "Powerbank", price: 149, emoji: "🔋", category: "Tech" },
  { name: "Bluetooth-högtalare", price: 149, emoji: "🔊", category: "Tech" },
  { name: "LED-pannlampa", price: 79, emoji: "🔦", category: "Outdoor" },
  { name: "Digital köksvåg", price: 99, emoji: "⚖️", category: "Kök" },
  { name: "Termosmugg", price: 119, emoji: "☕", category: "Resor" },
  { name: "Knivslip", price: 69, emoji: "🗡️", category: "Kök" },
  { name: "Kabelorganiserare", price: 69, emoji: "🔌", category: "Tech" },
  { name: "Hopfällbar mugg", price: 99, emoji: "🥤", category: "Resor" },
  {
    name: "Shoppingpåsar 3-pack",
    price: 79,
    emoji: "🛍️",
    category: "Hem",
  },
];

const steps = [
  {
    step: "1",
    title: "Anmäl er grupp",
    desc: "Fyll i ett enkelt formulär — ni får er unika säljlänk inom 24 timmar.",
  },
  {
    step: "2",
    title: "Sälj till familj & vänner",
    desc: "Dela länken eller gå runt med broschyren. Kunderna beställer direkt online.",
  },
  {
    step: "3",
    title: "Pengarna in på kontot",
    desc: "När kampanjen stänger levereras varorna och vinsten betalas ut till laget.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-yellow-50 font-[family-name:var(--font-geist-sans)]">
      {/* Nav */}
      <nav className="bg-blue-800 text-white px-6 py-4 flex items-center justify-between">
        <span className="text-2xl font-black tracking-tight">Vobilo</span>
        <div className="flex items-center gap-6 text-sm font-medium">
          <a href="#produkter" className="hover:text-yellow-300 transition-colors">
            Produkter
          </a>
          <a href="#hur-det-funkar" className="hover:text-yellow-300 transition-colors">
            Hur det funkar
          </a>
          <a
            href="/starta"
            className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold px-4 py-2 rounded-full transition-colors"
          >
            Starta nu
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-blue-800 text-white pt-20 pb-28 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block bg-yellow-400 text-blue-900 text-sm font-bold px-4 py-1 rounded-full mb-6">
            🏆 Tjäna upp till 50 kr per produkt till kassan
          </div>
          <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6">
            Sälj för laget.{" "}
            <span className="text-yellow-400">Tjäna på riktigt.</span>
          </h1>
          <p className="text-xl text-blue-200 mb-10 max-w-xl mx-auto">
            Vobilo hjälper klasser och lag att samla in pengar — genom att sälja
            produkter folk faktiskt vill ha.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/starta"
              className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold py-4 px-8 rounded-full text-lg transition-colors"
            >
              Starta er försäljning →
            </a>
            <a
              href="#hur-det-funkar"
              className="border-2 border-blue-400 hover:border-white text-white font-semibold py-4 px-8 rounded-full text-lg transition-colors"
            >
              Se hur det funkar
            </a>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <div className="bg-yellow-400 py-6 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4 text-center text-blue-900">
          <div>
            <div className="text-3xl font-black">50 kr</div>
            <div className="text-sm font-medium">vinst per produkt</div>
          </div>
          <div>
            <div className="text-3xl font-black">15+</div>
            <div className="text-sm font-medium">populära produkter</div>
          </div>
          <div>
            <div className="text-3xl font-black">24h</div>
            <div className="text-sm font-medium">till er säljlänk</div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <section id="hur-det-funkar" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-blue-800 text-center mb-12">
            Hur det funkar
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 bg-blue-800 text-yellow-400 rounded-full flex items-center justify-center text-xl font-black mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="text-lg font-bold text-blue-800 mb-2">
                  {s.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="produkter" className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-blue-800 text-center mb-4">
            Produkterna
          </h2>
          <p className="text-center text-gray-500 mb-12">
            Praktiska produkter med riktigt bra marginal — enkla att sälja.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {products.map((p) => (
              <div
                key={p.name}
                className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-center hover:border-yellow-400 transition-colors"
              >
                <div className="text-4xl mb-2">{p.emoji}</div>
                <div className="text-xs text-blue-600 font-medium mb-1">
                  {p.category}
                </div>
                <div className="text-sm font-bold text-blue-900 leading-tight mb-2">
                  {p.name}
                </div>
                <div className="text-lg font-black text-blue-800">
                  {p.price} kr
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA bottom */}
      <section className="bg-blue-800 text-white py-20 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-black mb-4">
            Redo att fylla lagkassan?
          </h2>
          <p className="text-blue-200 mb-8">
            Anmäl er grupp idag — det tar 2 minuter och ni är igång inom 24
            timmar.
          </p>
          <a
            href="/starta"
            className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold py-4 px-10 rounded-full text-lg transition-colors inline-block"
          >
            Starta er försäljning →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-blue-300 py-6 px-6 text-center text-sm">
        © 2026 Vobilo · vobilo.se
      </footer>
    </div>
  );
}
