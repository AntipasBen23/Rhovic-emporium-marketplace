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
    <section className="overflow-hidden rounded-[2.5rem] border border-black/5 bg-white dark:border-white/5 dark:bg-white/5 shadow-premium animate-fade-up">
      <div className="grid gap-12 p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-black dark:text-accent">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              Direct Intelligence
            </div>

            <h3 className="text-3xl font-black tracking-tight text-gray-950 font-heading dark:text-white sm:text-4xl leading-tight">
              Weekly curated offers <br />
              <span className="text-primary">straight to your inbox.</span>
            </h3>

            <p className="max-w-md text-base leading-relaxed font-medium text-gray-600 dark:text-gray-400">
              Zero noise. Just high-impact deals, emerging vendor highlights, and trending products
              across the RHOVIC ecosystem.
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[2rem] glass-panel p-6 sm:p-8 border border-black/[0.03] dark:border-white/[0.03] shadow-xl">
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
              <div className="relative group">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Enter your professional email"
                  className="w-full rounded-2xl border-2 border-black/5 bg-white px-6 py-4 text-sm font-bold shadow-inner outline-none transition-all focus:border-primary/30 focus:shadow-[0_0_0_4px_rgba(18,77,52,0.1)] dark:border-white/5 dark:bg-black/20"
                  aria-label="Email address"
                />
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 opacity-0 transition-opacity group-focus-within:opacity-100">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
                </div>
              </div>
              <button
                type="submit"
                className="inline-flex h-14 items-center justify-center rounded-2xl bg-primary px-8 text-base font-black text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30 active:scale-95"
              >
                Join the Network
              </button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-4">
              {status === "ok" ? (
                <div className="flex items-center gap-3 rounded-2xl bg-primary/10 p-4 text-sm font-bold text-primary animate-fade-in w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  Subscription Active. Welcome aboard.
                </div>
              ) : (
                <div className="text-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                  By joining, you agree to our marketplace protocols.
                </div>
              )}
            </div>
          </div>

          <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />
        </div>
      </div>

      <div className="h-1.5 w-full bg-primary opacity-10" />
    </section>
  );
}
