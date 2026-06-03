"use client";

import { useState, useEffect } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  sellPrice: number;
  category: string;
}

interface CartItem extends Product {
  qty: number;
  emoji: string;
}

interface CheckoutForm {
  name: string;
  email: string;
  phone: string;
}

// Emoji map — utökas vid behov
const emojiMap: Record<string, string> = {
  "Hamburgerpress": "🍔", "Bagagevåg": "🧳", "Gympåse": "🎒",
  "Kryddkvarnar (set)": "🧂", "Magnetlist för knivar": "🔪",
  "Silikonspatlar 3-pack": "🥄", "Powerbank": "🔋",
  "Bluetooth-högtalare": "🔊", "LED-pannlampa": "🔦",
  "Digital köksvåg": "⚖️", "Termosmugg med lock": "☕",
  "Knivslip": "🗡️", "Kabelorganiserare": "🔌",
  "Hopfällbar mugg": "🥤", "Shoppingpåsar 3-pack": "🛍️",
};

type View = "shop" | "cart" | "checkout" | "done";

export default function StorePage({ slug, groupName }: { slug: string; groupName: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [view, setView] = useState<View>("shop");
  const [activeCategory, setActiveCategory] = useState("Alla");
  const [form, setForm] = useState<CheckoutForm>({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then(setProducts)
      .catch(() => setError("Kunde inte ladda produkter"));
  }, []);

  const categories = ["Alla", ...Array.from(new Set(products.map((p) => p.category)))];
  const filtered = activeCategory === "Alla" ? products : products.filter((p) => p.category === activeCategory);
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.qty * i.sellPrice, 0);

  function addToCart(product: Product) {
    const emoji = emojiMap[product.name] ?? "📦";
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1, emoji }];
    });
  }

  function updateQty(id: string, delta: number) {
    setCart((prev) =>
      prev.flatMap((i) => {
        if (i.id !== id) return [i];
        const newQty = i.qty + delta;
        return newQty <= 0 ? [] : [{ ...i, qty: newQty }];
      })
    );
  }

  async function placeOrder() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          buyerName: form.name,
          buyerEmail: form.email,
          buyerPhone: form.phone,
          items: cart.map((i) => ({ id: i.id, qty: i.qty })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Något gick fel");
      setView("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Något gick fel");
    } finally {
      setLoading(false);
    }
  }

  // Done
  if (view === "done") {
    return (
      <div className="min-h-screen bg-yellow-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-3xl font-black text-blue-800 mb-3">Tack för din beställning!</h1>
          <p className="text-gray-600 mb-2">En bekräftelse skickas till</p>
          <p className="font-bold text-blue-800 mb-6">{form.email}</p>
          <p className="text-sm text-gray-500 mb-8">
            Du stöder <strong>{groupName}</strong> — tack för att du hjälper till!
          </p>
          <button
            onClick={() => { setCart([]); setForm({ name: "", email: "", phone: "" }); setView("shop"); }}
            className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-colors"
          >
            Handla mer
          </button>
        </div>
      </div>
    );
  }

  // Checkout
  if (view === "checkout") {
    return (
      <div className="min-h-screen bg-yellow-50">
        <nav className="bg-blue-800 text-white px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-black text-yellow-400">Vobilo</span>
          <span className="text-blue-200 text-sm">Kassa</span>
        </nav>
        <div className="max-w-lg mx-auto px-4 py-10">
          <button onClick={() => setView("cart")} className="text-blue-700 text-sm mb-6 hover:underline">
            ← Tillbaka till varukorgen
          </button>
          <h1 className="text-2xl font-black text-blue-800 mb-6">Dina uppgifter</h1>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-blue-900 block mb-1">Namn *</span>
              <input type="text" placeholder="För- och efternamn" value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-800" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-blue-900 block mb-1">E-post *</span>
              <input type="email" placeholder="din@email.se" value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-800" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-blue-900 block mb-1">Telefon</span>
              <input type="tel" placeholder="070-000 00 00" value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-800" />
            </label>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <h2 className="font-bold text-blue-900 mb-3 text-sm">Din beställning</h2>
            <div className="space-y-2 mb-4">
              {cart.map((i) => (
                <div key={i.id} className="flex justify-between text-sm">
                  <span className="text-gray-700">{i.emoji} {i.name} × {i.qty}</span>
                  <span className="font-semibold text-blue-900">{i.qty * i.sellPrice} kr</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between font-black text-blue-900">
              <span>Totalt</span>
              <span>{totalPrice} kr</span>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4 text-sm text-blue-800">
            🤝 Du stöder <strong>{groupName}</strong> med din beställning!
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-sm text-red-700">{error}</div>
          )}

          <button
            onClick={placeOrder}
            disabled={!form.name || !form.email || loading}
            className="w-full bg-blue-800 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 rounded-full text-lg transition-colors"
          >
            {loading ? "Beställer..." : `Lägg beställning — ${totalPrice} kr`}
          </button>
          <p className="text-center text-xs text-gray-400 mt-3">Betalning sker vid leverans</p>
        </div>
      </div>
    );
  }

  // Cart
  if (view === "cart") {
    return (
      <div className="min-h-screen bg-yellow-50">
        <nav className="bg-blue-800 text-white px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-black text-yellow-400">Vobilo</span>
          <span className="text-blue-200 text-sm">Varukorg</span>
        </nav>
        <div className="max-w-lg mx-auto px-4 py-10">
          <button onClick={() => setView("shop")} className="text-blue-700 text-sm mb-6 hover:underline">
            ← Fortsätt handla
          </button>
          <h1 className="text-2xl font-black text-blue-800 mb-6">Din varukorg</h1>

          {cart.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-4">🛒</div>
              <p>Varukorgen är tom</p>
              <button onClick={() => setView("shop")} className="mt-4 text-blue-700 underline text-sm">
                Gå till butiken
              </button>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
                {cart.map((item, idx) => (
                  <div key={item.id} className={`flex items-center gap-4 px-5 py-4 ${idx > 0 ? "border-t border-gray-50" : ""}`}>
                    <span className="text-3xl">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-blue-900 text-sm">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.sellPrice} kr / st</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQty(item.id, -1)}
                        className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition-colors">−</button>
                      <span className="w-5 text-center font-bold text-blue-900 text-sm">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)}
                        className="w-7 h-7 rounded-full bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold text-sm transition-colors">+</button>
                    </div>
                    <span className="font-black text-blue-900 text-sm w-16 text-right">{item.qty * item.sellPrice} kr</span>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 flex justify-between items-center">
                <span className="font-semibold text-gray-700">{totalItems} produkter</span>
                <span className="text-2xl font-black text-blue-900">{totalPrice} kr</span>
              </div>

              <button onClick={() => setView("checkout")}
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold py-4 rounded-full text-lg transition-colors">
                Till kassan →
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // Shop
  return (
    <div className="min-h-screen bg-yellow-50">
      <nav className="bg-blue-800 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <span className="text-xl font-black text-yellow-400">Vobilo</span>
        <button onClick={() => setView("cart")}
          className="relative flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold px-4 py-2 rounded-full text-sm transition-colors">
          🛒 Varukorg
          {totalItems > 0 && (
            <span className="bg-blue-800 text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">{totalItems}</span>
          )}
        </button>
      </nav>

      <div className="bg-gradient-to-b from-blue-800 to-blue-700 text-white px-6 py-10 text-center">
        <p className="text-blue-300 text-sm mb-1">Du handlar hos</p>
        <h1 className="text-3xl font-black mb-2">{groupName}</h1>
        <p className="text-blue-200 text-sm max-w-sm mx-auto">
          Varje köp går direkt till lagets kassa. Tack för att du stöder oss! 🙏
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-sm text-red-700">{error}</div>
        )}

        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                activeCategory === cat ? "bg-blue-800 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-yellow-400"
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {products.length === 0 && !error && (
          <div className="text-center py-20 text-gray-400">Laddar produkter...</div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filtered.map((product) => {
            const inCart = cart.find((i) => i.id === product.id);
            const emoji = emojiMap[product.name] ?? "📦";
            return (
              <div key={product.id}
                className="bg-white rounded-2xl border border-gray-100 hover:border-yellow-300 transition-all overflow-hidden group">
                <div className="bg-yellow-50 h-28 flex items-center justify-center text-5xl group-hover:scale-105 transition-transform">
                  {emoji}
                </div>
                <div className="p-4">
                  <p className="text-xs text-blue-500 font-medium mb-1">{product.category}</p>
                  <p className="font-bold text-blue-900 text-sm leading-tight mb-1">{product.name}</p>
                  <p className="text-xs text-gray-400 leading-relaxed mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-blue-800">{product.sellPrice} kr</span>
                    {inCart ? (
                      <div className="flex items-center gap-1">
                        <button onClick={() => updateQty(product.id, -1)}
                          className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors">−</button>
                        <span className="w-4 text-center text-sm font-bold text-blue-900">{inCart.qty}</span>
                        <button onClick={() => updateQty(product.id, 1)}
                          className="w-6 h-6 rounded-full bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold text-xs transition-colors">+</button>
                      </div>
                    ) : (
                      <button onClick={() => addToCart(product)}
                        className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold text-xs px-3 py-1.5 rounded-full transition-colors">
                        Lägg till
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-blue-800 text-white px-6 py-4 flex items-center justify-between shadow-2xl">
          <span className="text-sm text-blue-200">
            <strong className="text-white">{totalItems} produkter</strong> i varukorgen
          </span>
          <button onClick={() => setView("cart")}
            className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold px-6 py-2 rounded-full transition-colors">
            Se varukorg — {totalPrice} kr →
          </button>
        </div>
      )}
    </div>
  );
}
