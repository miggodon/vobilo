"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoggaInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Fel e-post eller lösenord");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen bg-yellow-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <a href="/" className="text-3xl font-black text-blue-800">Vobilo</a>
          <p className="text-gray-500 text-sm mt-2">Logga in på er säljardashboard</p>
        </div>

        <form onSubmit={submit} className="bg-white rounded-2xl border border-yellow-100 p-8 shadow-sm space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-blue-900 block mb-1">E-post</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-800"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-blue-900 block mb-1">Lösenord</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-800"
            />
          </label>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-800 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3 rounded-full transition-colors"
          >
            {loading ? "Loggar in..." : "Logga in"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Inget konto?{" "}
          <a href="/starta" className="text-blue-700 font-semibold hover:underline">
            Starta er försäljning →
          </a>
        </p>
      </div>
    </div>
  );
}
