"use client";

import { useState } from "react";

type Step = 1 | 2 | 3;

interface FormData {
  groupName: string;
  groupType: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  memberCount: string;
  message: string;
  password: string;
}

const initialForm: FormData = {
  groupName: "",
  groupType: "fotbollslag",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  memberCount: "",
  message: "",
  password: "",
};

export default function StartaPage() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");

  function update(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function submit() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Något gick fel");
      setSlug(data.slug);
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Något gick fel");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    const sellUrl = `${window.location.origin}/salj/${slug}`;
    return (
      <div className="min-h-screen bg-yellow-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-3xl font-black text-blue-800 mb-4">Ni är igång!</h1>
          <p className="text-gray-600 mb-6">Er unika säljlänk är redo att dela:</p>
          <div className="bg-white border border-yellow-300 rounded-xl px-5 py-4 font-mono text-blue-800 font-bold text-sm mb-6 break-all">
            {sellUrl}
          </div>
          <div className="flex gap-3 justify-center mb-8">
            <button
              onClick={() => navigator.clipboard.writeText(sellUrl)}
              className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold py-2 px-5 rounded-full text-sm transition-colors"
            >
              Kopiera länk
            </button>
            <a
              href={`/salj/${slug}`}
              className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-full text-sm transition-colors"
            >
              Öppna butiken →
            </a>
          </div>
          <p className="text-xs text-gray-400">Bekräftelse skickad till {form.contactEmail}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-50">
      {/* Nav */}
      <nav className="bg-blue-800 text-white px-6 py-4 flex items-center justify-between">
        <a href="/" className="text-2xl font-black tracking-tight hover:text-yellow-300 transition-colors">
          Vobilo
        </a>
        <span className="text-blue-300 text-sm">Starta er försäljning</span>
      </nav>

      <div className="max-w-xl mx-auto px-4 py-12">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-10">
          {([1, 2, 3] as Step[]).map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  step >= s
                    ? "bg-blue-800 text-yellow-400"
                    : "bg-blue-100 text-blue-400"
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`h-1 w-16 rounded transition-colors ${
                    step > s ? "bg-blue-800" : "bg-blue-100"
                  }`}
                />
              )}
            </div>
          ))}
          <span className="ml-4 text-sm text-gray-500">
            {step === 1 && "Om gruppen"}
            {step === 2 && "Kontaktperson"}
            {step === 3 && "Bekräfta"}
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-yellow-100 p-8">
          {/* Step 1 */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-black text-blue-800 mb-1">
                Berätta om er grupp
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Lag, klass eller förening — alla är välkomna.
              </p>

              <label className="block mb-4">
                <span className="text-sm font-semibold text-blue-900 block mb-1">
                  Gruppens namn *
                </span>
                <input
                  type="text"
                  placeholder="T.ex. Hammarby P09 eller Klass 6B"
                  value={form.groupName}
                  onChange={(e) => update("groupName", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-800"
                />
              </label>

              <label className="block mb-4">
                <span className="text-sm font-semibold text-blue-900 block mb-1">
                  Typ av grupp *
                </span>
                <select
                  value={form.groupType}
                  onChange={(e) => update("groupType", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-800 bg-white"
                >
                  <option value="fotbollslag">Fotbollslag</option>
                  <option value="annat-idrottslag">Annat idrottslag</option>
                  <option value="skolklass">Skolklass</option>
                  <option value="forening">Förening</option>
                  <option value="annat">Annat</option>
                </select>
              </label>

              <label className="block mb-6">
                <span className="text-sm font-semibold text-blue-900 block mb-1">
                  Antal säljare (ungefär)
                </span>
                <input
                  type="number"
                  placeholder="T.ex. 15"
                  value={form.memberCount}
                  onChange={(e) => update("memberCount", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-800"
                />
              </label>

              <button
                onClick={() => setStep(2)}
                disabled={!form.groupName}
                className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed text-blue-900 font-bold py-3 rounded-full transition-colors"
              >
                Nästa →
              </button>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-black text-blue-800 mb-1">
                Kontaktperson
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Måste vara minst 18 år. Vi skickar säljlänken hit.
              </p>

              <label className="block mb-4">
                <span className="text-sm font-semibold text-blue-900 block mb-1">
                  Namn *
                </span>
                <input
                  type="text"
                  placeholder="För- och efternamn"
                  value={form.contactName}
                  onChange={(e) => update("contactName", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-800"
                />
              </label>

              <label className="block mb-4">
                <span className="text-sm font-semibold text-blue-900 block mb-1">
                  E-post *
                </span>
                <input
                  type="email"
                  placeholder="din@email.se"
                  value={form.contactEmail}
                  onChange={(e) => update("contactEmail", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-800"
                />
              </label>

              <div className="mb-4">
                <span className="text-sm font-semibold text-blue-900 block mb-1">
                  Lösenord till er dashboard *
                </span>
                <input
                  type="password"
                  placeholder="Minst 8 tecken"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-800"
                />
                {form.password.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {[
                      { ok: form.password.length >= 8, label: "Minst 8 tecken" },
                      { ok: /[A-Z]/.test(form.password), label: "Minst en stor bokstav" },
                      { ok: /[0-9]/.test(form.password), label: "Minst en siffra" },
                    ].map(({ ok, label }) => (
                      <div key={label} className={`flex items-center gap-2 text-xs ${ok ? "text-green-600" : "text-gray-400"}`}>
                        <span>{ok ? "✓" : "○"}</span>
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <label className="block mb-4">
                <span className="text-sm font-semibold text-blue-900 block mb-1">
                  Telefon
                </span>
                <input
                  type="tel"
                  placeholder="070-000 00 00"
                  value={form.contactPhone}
                  onChange={(e) => update("contactPhone", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-800"
                />
              </label>

              <label className="block mb-6">
                <span className="text-sm font-semibold text-blue-900 block mb-1">
                  Något vi bör veta?
                </span>
                <textarea
                  placeholder="Valfritt — t.ex. önskat startdatum eller speciella önskemål"
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-800 resize-none"
                />
              </label>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border-2 border-blue-800 text-blue-800 font-bold py-3 rounded-full hover:bg-blue-50 transition-colors"
                >
                  ← Tillbaka
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!form.contactName || !form.contactEmail || form.password.length < 8 || !/[A-Z]/.test(form.password) || !/[0-9]/.test(form.password)}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed text-blue-900 font-bold py-3 rounded-full transition-colors"
                >
                  Nästa →
                </button>
              </div>
            </div>
          )}



          {/* Step 3 — Confirm */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-black text-blue-800 mb-1">
                Stämmer det här?
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Kolla igenom och skicka in.
              </p>

              <div className="bg-yellow-50 rounded-xl p-5 mb-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Grupp</span>
                  <span className="font-semibold text-blue-900">{form.groupName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Typ</span>
                  <span className="font-semibold text-blue-900 capitalize">{form.groupType.replace("-", " ")}</span>
                </div>
                {form.memberCount && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Säljare</span>
                    <span className="font-semibold text-blue-900">{form.memberCount} st</span>
                  </div>
                )}
                <div className="border-t border-yellow-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Kontakt</span>
                    <span className="font-semibold text-blue-900">{form.contactName}</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-gray-500">E-post</span>
                    <span className="font-semibold text-blue-900">{form.contactEmail}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 mb-4 text-sm text-blue-700">
                🔗 Er unika säljlänk skapas direkt — ni kan börja sälja omedelbart.
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 border-2 border-blue-800 text-blue-800 font-bold py-3 rounded-full hover:bg-blue-50 transition-colors"
                >
                  ← Ändra
                </button>
                <button
                  onClick={submit}
                  disabled={loading}
                  className="flex-1 bg-blue-800 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3 rounded-full transition-colors"
                >
                  {loading ? "Skapar er butik..." : "Starta nu ✓"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Trust signals */}
        <div className="mt-8 flex justify-center gap-8 text-sm text-gray-500">
          <span>✓ Gratis att anmäla sig</span>
          <span>✓ Ingen bindningstid</span>
          <span>✓ Svar inom 24h</span>
        </div>
      </div>
    </div>
  );
}
