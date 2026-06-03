"use client";

import { useState, useEffect, useCallback } from "react";
import { signOut, useSession } from "next-auth/react";

interface DashboardData {
  group: { name: string; slug: string };
  campaign: { name: string; endsAt: string; goal?: number } | null;
  stats: { totalSold: number; totalEarnings: number; totalOrders: number; uniqueBuyers: number };
  orders: { id: string; buyer: string; items: number; total: number; date: string; status: string }[];
}

const statusLabel: Record<string, { label: string; className: string }> = {
  CONFIRMED: { label: "Bekräftad", className: "bg-green-100 text-green-700" },
  PENDING: { label: "Väntande", className: "bg-yellow-100 text-yellow-700" },
  DELIVERED: { label: "Levererad", className: "bg-blue-100 text-blue-700" },
  CANCELLED: { label: "Avbruten", className: "bg-red-100 text-red-700" },
};

const CAMPAIGN_GOAL = 10000;

export default function DashboardPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const res = await fetch("/api/dashboard");
    if (res.ok) setData(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  function copyLink() {
    if (!data) return;
    navigator.clipboard.writeText(`https://vobilo.se/salj/${data.group.slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400">Laddar...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">Kunde inte ladda data</div>
      </div>
    );
  }

  const sellUrl = `https://vobilo.se/salj/${data.group.slug}`;
  const progressPct = Math.min(Math.round((data.stats.totalEarnings / CAMPAIGN_GOAL) * 100), 100);
  const daysLeft = data.campaign
    ? Math.max(0, Math.ceil((new Date(data.campaign.endsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-blue-800 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/" className="text-xl font-black tracking-tight text-yellow-400">Vobilo</a>
          <span className="text-blue-400">/</span>
          <span className="font-semibold">{data.group.name}</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          {session?.user?.name && (
            <span className="text-blue-300 hidden sm:block">{session.user.name}</span>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/logga-in" })}
            className="border border-blue-500 hover:border-white px-3 py-1 rounded-full transition-colors text-xs"
          >
            Logga ut
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-blue-900">Din säljdashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            {data.campaign
              ? `${data.campaign.name} — ${daysLeft} dagar kvar`
              : "Ingen aktiv kampanj"}
          </p>
        </div>

        {/* Sell link */}
        <div className="bg-white rounded-2xl border border-yellow-200 p-5 mb-6 flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Din säljlänk</p>
            <p className="font-mono text-blue-800 font-bold truncate text-sm">{sellUrl}</p>
          </div>
          <button onClick={copyLink}
            className={`shrink-0 font-bold py-2 px-5 rounded-full text-sm transition-colors ${
              copied ? "bg-green-500 text-white" : "bg-yellow-400 hover:bg-yellow-300 text-blue-900"
            }`}>
            {copied ? "✓ Kopierad!" : "Kopiera"}
          </button>
          <a href={`https://wa.me/?text=${encodeURIComponent(`Stöd oss och köp via vår länk: ${sellUrl}`)}`}
            target="_blank" rel="noreferrer"
            className="shrink-0 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full text-sm transition-colors">
            WhatsApp
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Sålda produkter", value: data.stats.totalSold, suffix: "st", color: "text-blue-800" },
            { label: "Intjänat", value: data.stats.totalEarnings.toLocaleString("sv-SE"), suffix: "kr", color: "text-green-700" },
            { label: "Beställningar", value: data.stats.totalOrders, suffix: "st", color: "text-blue-800" },
            { label: "Unika köpare", value: data.stats.uniqueBuyers, suffix: "st", color: "text-blue-800" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-xs text-gray-500 font-medium mb-1">{s.label}</p>
              <p className={`text-3xl font-black ${s.color}`}>
                {s.value}<span className="text-base font-semibold ml-1">{s.suffix}</span>
              </p>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-gray-700">Framsteg mot målet</p>
              <p className="text-xs text-gray-400">
                {data.stats.totalEarnings.toLocaleString("sv-SE")} / {CAMPAIGN_GOAL.toLocaleString("sv-SE")} kr
              </p>
            </div>
            <span className="text-2xl font-black text-blue-800">{progressPct}%</span>
          </div>
          <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-yellow-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          {data.stats.totalEarnings < CAMPAIGN_GOAL && (
            <p className="text-xs text-gray-400 mt-2">
              Behöver sälja ca {Math.ceil((CAMPAIGN_GOAL - data.stats.totalEarnings) / 50)} produkter till för att nå målet
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Quick actions */}
          <div className="bg-blue-800 text-white rounded-2xl p-6">
            <h2 className="font-black mb-4 text-yellow-400">Tips för att sälja mer 🚀</h2>
            <ul className="space-y-3 text-sm text-blue-100">
              <li className="flex gap-2"><span>📱</span><span>Dela länken i föräldragruppen på WhatsApp.</span></li>
              <li className="flex gap-2"><span>👋</span><span>Be varje spelare fråga minst 5 vuxna.</span></li>
              <li className="flex gap-2"><span>📸</span><span>Lägg ut på lagets Instagram med säljlänken.</span></li>
              <li className="flex gap-2"><span>🎯</span><span>Sätt ett delmål — t.ex. 20 produkter första veckan.</span></li>
            </ul>
          </div>

          {/* Local sell link */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-between">
            <div>
              <h2 className="font-black text-blue-900 mb-2">Testa er butik</h2>
              <p className="text-sm text-gray-500 mb-4">
                Öppna er säljsida och se hur det ser ut för köparna.
              </p>
            </div>
            <a href={`/salj/${data.group.slug}`} target="_blank"
              className="w-full text-center bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold py-3 rounded-full transition-colors">
              Öppna butiken →
            </a>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-black text-blue-900">Beställningar</h2>
            <span className="text-xs text-gray-400">{data.stats.totalOrders} totalt</span>
          </div>
          {data.orders.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-sm">Inga beställningar än — dela er länk!</p>
            </div>
          ) : (
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
                  {data.orders.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-blue-900">{o.buyer}</td>
                      <td className="px-6 py-4 text-gray-500">{o.date}</td>
                      <td className="px-6 py-4 text-right text-gray-700">{o.items} st</td>
                      <td className="px-6 py-4 text-right font-semibold text-blue-900">{o.total} kr</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${(statusLabel[o.status] ?? statusLabel.PENDING).className}`}>
                          {(statusLabel[o.status] ?? statusLabel.PENDING).label}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
