"use client";

import { useState } from "react";

// Mock data — ersätts med riktig DB-data när auth är på plats
const mockGroup = {
  name: "Hammarby P09",
  slug: "hammarby-p09",
  campaign: {
    name: "Sommarkampanjen 2026",
    endsAt: "2026-07-15",
    goal: 10000,
  },
};

const mockStats = {
  totalSold: 47,
  totalEarnings: 2256,
  totalOrders: 14,
  uniqueBuyers: 11,
};

const mockOrders = [
  { id: "1", buyer: "Anna Svensson", items: 4, total: 396, date: "2026-06-01", status: "CONFIRMED" },
  { id: "2", buyer: "Peter Lindqvist", items: 2, total: 198, date: "2026-06-01", status: "CONFIRMED" },
  { id: "3", buyer: "Maria Johansson", items: 6, total: 594, date: "2026-05-31", status: "CONFIRMED" },
  { id: "4", buyer: "Erik Bergström", items: 3, total: 297, date: "2026-05-30", status: "PENDING" },
  { id: "5", buyer: "Karin Nilsson", items: 5, total: 495, date: "2026-05-29", status: "CONFIRMED" },
  { id: "6", buyer: "Jonas Karlsson", items: 2, total: 198, date: "2026-05-28", status: "CONFIRMED" },
];

const mockTopProducts = [
  { name: "Bluetooth-högtalare", sold: 9, revenue: 1341 },
  { name: "Powerbank", sold: 8, revenue: 1192 },
  { name: "Termosmugg", sold: 7, revenue: 833 },
  { name: "Hamburgerpress", sold: 6, revenue: 594 },
  { name: "Gympåse", sold: 5, revenue: 645 },
];

const statusLabel: Record<string, { label: string; className: string }> = {
  CONFIRMED: { label: "Bekräftad", className: "bg-green-100 text-green-700" },
  PENDING: { label: "Väntande", className: "bg-yellow-100 text-yellow-700" },
  DELIVERED: { label: "Levererad", className: "bg-blue-100 text-blue-700" },
  CANCELLED: { label: "Avbruten", className: "bg-red-100 text-red-700" },
};

export default function DashboardPage() {
  const [copied, setCopied] = useState(false);

  const sellUrl = `https://vobilo.se/salj/${mockGroup.slug}`;
  const progressPct = Math.min(
    Math.round((mockStats.totalEarnings / mockGroup.campaign.goal) * 100),
    100
  );
  const daysLeft = Math.ceil(
    (new Date(mockGroup.campaign.endsAt).getTime() - Date.now()) /
      (1000 * 60 * 60 * 24)
  );

  function copyLink() {
    navigator.clipboard.writeText(sellUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <nav className="bg-blue-800 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/" className="text-xl font-black tracking-tight text-yellow-400">
            Vobilo
          </a>
          <span className="text-blue-400">/</span>
          <span className="font-semibold">{mockGroup.name}</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-blue-300">{mockGroup.campaign.name}</span>
          <button className="border border-blue-500 hover:border-white px-3 py-1 rounded-full transition-colors text-xs">
            Logga ut
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-blue-900">Din säljdashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Kampanjen avslutas {mockGroup.campaign.endsAt} — {daysLeft} dagar kvar
          </p>
        </div>

        {/* Sell link */}
        <div className="bg-white rounded-2xl border border-yellow-200 p-5 mb-6 flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Din säljlänk</p>
            <p className="font-mono text-blue-800 font-bold truncate">{sellUrl}</p>
          </div>
          <button
            onClick={copyLink}
            className={`shrink-0 font-bold py-2 px-5 rounded-full text-sm transition-colors ${
              copied
                ? "bg-green-500 text-white"
                : "bg-yellow-400 hover:bg-yellow-300 text-blue-900"
            }`}
          >
            {copied ? "✓ Kopierad!" : "Kopiera"}
          </button>
          <a
            href={`https://wa.me/?text=Stöd%20oss%20och%20köp%20via%20vår%20länk%3A%20${encodeURIComponent(sellUrl)}`}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full text-sm transition-colors"
          >
            WhatsApp
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Sålda produkter", value: mockStats.totalSold, suffix: "st", color: "text-blue-800" },
            { label: "Intjänat", value: mockStats.totalEarnings.toLocaleString("sv-SE"), suffix: "kr", color: "text-green-700" },
            { label: "Beställningar", value: mockStats.totalOrders, suffix: "st", color: "text-blue-800" },
            { label: "Unika köpare", value: mockStats.uniqueBuyers, suffix: "st", color: "text-blue-800" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-xs text-gray-500 font-medium mb-1">{s.label}</p>
              <p className={`text-3xl font-black ${s.color}`}>
                {s.value}
                <span className="text-base font-semibold ml-1">{s.suffix}</span>
              </p>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-gray-700">Framsteg mot målet</p>
              <p className="text-xs text-gray-400">{mockStats.totalEarnings.toLocaleString("sv-SE")} / {mockGroup.campaign.goal.toLocaleString("sv-SE")} kr</p>
            </div>
            <span className="text-2xl font-black text-blue-800">{progressPct}%</span>
          </div>
          <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-yellow-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Behöver sälja {Math.ceil((mockGroup.campaign.goal - mockStats.totalEarnings) / 50)} produkter till för att nå målet
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Top products */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-black text-blue-900 mb-4">Mest sålda produkter</h2>
            <div className="space-y-3">
              {mockTopProducts.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="text-lg font-black text-gray-200 w-5 text-center">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-blue-900 truncate">{p.name}</p>
                    <div className="h-1.5 bg-gray-100 rounded-full mt-1">
                      <div
                        className="h-full bg-yellow-400 rounded-full"
                        style={{ width: `${(p.sold / mockTopProducts[0].sold) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-600 shrink-0">{p.sold} st</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-800 text-white rounded-2xl p-6">
            <h2 className="font-black mb-4 text-yellow-400">Tips för att sälja mer 🚀</h2>
            <ul className="space-y-3 text-sm text-blue-100">
              <li className="flex gap-2">
                <span>📱</span>
                <span>Dela länken i föräldragruppen på WhatsApp — det ger snabbast resultat.</span>
              </li>
              <li className="flex gap-2">
                <span>👋</span>
                <span>Be varje spelare fråga minst 5 vuxna i sin omgivning.</span>
              </li>
              <li className="flex gap-2">
                <span>📸</span>
                <span>Lägg ut ett inlägg på lagets Instagram med säljlänken.</span>
              </li>
              <li className="flex gap-2">
                <span>🎯</span>
                <span>Sätt ett delmål — t.ex. 20 produkter den första veckan.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-black text-blue-900">Senaste beställningar</h2>
            <span className="text-xs text-gray-400">{mockOrders.length} beställningar</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                  <th className="px-6 py-3 text-left font-semibold">Köpare</th>
                  <th className="px-6 py-3 text-left font-semibold">Datum</th>
                  <th className="px-6 py-3 text-right font-semibold">Produkter</th>
                  <th className="px-6 py-3 text-right font-semibold">Summa</th>
                  <th className="px-6 py-3 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {mockOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-blue-900">{o.buyer}</td>
                    <td className="px-6 py-4 text-gray-500">{o.date}</td>
                    <td className="px-6 py-4 text-right text-gray-700">{o.items} st</td>
                    <td className="px-6 py-4 text-right font-semibold text-blue-900">{o.total} kr</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusLabel[o.status].className}`}>
                        {statusLabel[o.status].label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
