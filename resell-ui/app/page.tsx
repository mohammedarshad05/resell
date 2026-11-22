"use client";

import { useEffect, useState } from "react";

interface PhoneModel {
  id: number;
  brand: string;
  modelName: string;
  basePrice: number;
}

interface QuoteResponse {
  id: number;
  phone: string;
  basePrice: number;
  hasDamage: boolean;
  hasReplacedParts: boolean;
  estimatedPrice: number;
}

export default function Home() {
  const [phones, setPhones] = useState<PhoneModel[]>([]);
  const [selectedPhoneId, setSelectedPhoneId] = useState<number | "">("");
  const [hasDamage, setHasDamage] = useState(false);
  const [hasReplacedParts, setHasReplacedParts] = useState(false);
  const [customerEmail, setCustomerEmail] = useState("");

  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [loadingPhones, setLoadingPhones] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  // 1. Fetch phone models from Symfony on page load
  useEffect(() => {
    async function fetchPhones() {
      try {
        const res = await fetch(`${apiUrl}/api/phones`);
        if (!res.ok) throw new Error("Failed to load phone models");
        const data: PhoneModel[] = await res.json();
        setPhones(data);
        if (data.length > 0) {
          setSelectedPhoneId(data[0].id);
        }
      } catch (err) {
        setError("Could not connect to the backend API. Is Symfony running?");
      } finally {
        setLoadingPhones(false);
      }
    }
    fetchPhones();
  }, [apiUrl]);

  // 2. Submit quote request to Symfony
  async function handleGetQuote(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedPhoneId) return;

    setSubmitting(true);
    setError("");
    setQuote(null);

    try {
      const res = await fetch(`${apiUrl}/api/quotes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneModelId: Number(selectedPhoneId),
          customerEmail,
          hasDamage,
          hasReplacedParts,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to calculate quote");
      }

      setQuote(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl">
        <h1 className="text-2xl font-bold tracking-tight">Resell Price Estimator</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Select your device and condition to get an instant resale quote.
        </p>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleGetQuote} className="mt-6 space-y-5">
          {/* Phone Selector */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Select Phone Model
            </label>
            {loadingPhones ? (
              <div className="h-11 rounded-lg bg-zinc-800 animate-pulse" />
            ) : (
              <select
                value={selectedPhoneId}
                onChange={(e) => setSelectedPhoneId(Number(e.target.value))}
                className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:border-emerald-500"
              >
                {phones.map((phone) => (
                  <option key={phone.id} value={phone.id}>
                    {phone.brand} {phone.modelName} (Up to ₹{phone.basePrice.toLocaleString("en-IN")})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Condition Checkboxes */}
          <div className="space-y-3 pt-1">
            <span className="block text-sm font-medium text-zinc-300">
              Device Condition
            </span>

            <label className="flex items-start gap-3 p-3 rounded-lg bg-zinc-800/60 border border-zinc-800 cursor-pointer hover:border-zinc-700">
              <input
                type="checkbox"
                checked={hasDamage}
                onChange={(e) => setHasDamage(e.target.checked)}
                className="mt-1 h-4 w-4 accent-emerald-500"
              />
              <div>
                <p className="text-sm font-medium">Screen or Body Damage</p>
                <p className="text-xs text-zinc-400">
                  Cracks, deep scratches, or dents (-30% deduction)
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-lg bg-zinc-800/60 border border-zinc-800 cursor-pointer hover:border-zinc-700">
              <input
                type="checkbox"
                checked={hasReplacedParts}
                onChange={(e) => setHasReplacedParts(e.target.checked)}
                className="mt-1 h-4 w-4 accent-emerald-500"
              />
              <div>
                <p className="text-sm font-medium">Replaced Parts / Previous Repairs</p>
                <p className="text-xs text-zinc-400">
                  Non-original battery, display, or camera (-15% deduction)
                </p>
              </div>
            </label>
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Your Email
            </label>
            <input
              type="email"
              required
              placeholder="arshad@example.com"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3.5 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || loadingPhones}
            className="w-full rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-zinc-950 font-semibold py-2.5 transition cursor-pointer"
          >
            {submitting ? "Calculating..." : "Get Instant Quote"}
          </button>
        </form>

        {/* Estimated Quote Result Card */}
        {quote && (
          <div className="mt-6 p-5 rounded-xl bg-emerald-950/40 border border-emerald-700/60">
            <p className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
              Estimated Resale Value (Quote #{quote.id})
            </p>
            <p className="text-3xl font-bold text-white mt-1">
              ₹{quote.estimatedPrice.toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-zinc-400 mt-2">
              {quote.phone} • Base Price: ₹{quote.basePrice.toLocaleString("en-IN")}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}