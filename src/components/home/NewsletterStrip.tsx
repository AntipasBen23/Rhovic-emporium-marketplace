"use client";

import { useState } from "react";

export default function NewsletterStrip() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "ok">("idle");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    // MVP: fake success (wire to backend later)
    setStatus("ok");
    setEmail("");
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-black/10 bg-white">
      <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-2 lg:items-center">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-black/5 px-3 py-1 text-xs font-semibold text-gray-700">
            <span className="h-2 w-2 rounded-full bg-accent" />
            Deals & updates
          </div>

          <h3 className="text-xl font-extrabold tracking-tight text-gray-900">
            Get weekly offers and new vendor drops.
          </h3>

          <p className="text-sm leading-6 text-gray-600">
            No spam. Just curated deals, trending products, and vendor highlights.
          </p>
        </div>

        <div className="space-y-3">
          <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/20 focus:shadow-[0_0_0_3px_rgba(18,77,52,0.12)]"
              aria-label="Email address"
            />
            <button type="submit" className="btn-accent w-full sm:w-auto">
              Subscribe
            </button>
          </form>

          {status === "ok" ? (
            <div className="rounded-xl bg-black/5 p-3 text-sm text-gray-700">
              <span className="font-semibold text-primary">Subscribed.</span>{" "}
              You’ll start getting weekly picks.
            </div>
          ) : (
            <div className="text-xs text-gray-500">
              By subscribing, you agree to receive marketplace updates.
            </div>
          )}
        </div>
      </div>

      <div className="h-[3px] bg-primary" />
    </section>
  );
}