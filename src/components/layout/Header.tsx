"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCartStore } from "@/store/cart";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuthStore } from "@/store/auth";

export default function Header() {
  const [query, setQuery] = useState("");
  const [showAccount, setShowAccount] = useState(false);
  const accountRef = useRef<HTMLDivElement | null>(null);
  const token = useAuthStore((s) => s.token);
  const role = useAuthStore((s) => s.role);
  const logout = useAuthStore((s) => s.logout);

  // Zustand selectors
  const itemCount = useCartStore((s) => s.count());

  const cartLabel = useMemo(() => {
    if (!itemCount || itemCount <= 0) return "Cart";
    // show decimals only if needed
    const pretty =
      Math.round(itemCount) === itemCount ? String(itemCount) : itemCount.toFixed(2);
    return `Cart (${pretty})`;
  }, [itemCount]);

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      const target = e.target as Node;
      if (accountRef.current && !accountRef.current.contains(target)) {
        setShowAccount(false);
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setShowAccount(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 glass-panel shadow-premium animate-fade-up border-b border-black/5 dark:border-white/5 transition-all duration-300">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 group transition-transform hover:scale-[1.02]">
          <span className="text-2xl font-black tracking-tighter text-primary font-heading">
            RHOVIC
          </span>
          <span className="hidden text-sm font-black text-gray-900 dark:text-gray-400 sm:inline group-hover:text-primary transition-colors uppercase tracking-widest">
            Marketplace
          </span>
        </Link>

        {/* Search */}
        <div className="flex flex-1 items-center">
          <div className="relative w-full max-w-md mx-auto">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search anything..."
              className="w-full rounded-2xl border border-black/10 bg-black/5 px-5 py-3 text-sm font-medium outline-none transition-all placeholder:text-gray-500 focus:bg-white focus:ring-4 focus:ring-primary/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:bg-black/40"
              aria-label="Search marketplace"
            />
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-40">
              <span className="text-[10px] font-bold border rounded px-1.5 py-0.5">⌘</span>
              <span className="text-[10px] font-bold border rounded px-1.5 py-0.5">K</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <nav className="flex items-center gap-4">
          <div className="relative" ref={accountRef}>
            <button
              type="button"
              onClick={() => setShowAccount((s) => !s)}
              className="inline-flex items-center gap-2 rounded-xl border border-black/10 px-4 py-2.5 text-sm font-black text-gray-900 hover:bg-black/5 dark:border-white/10 dark:text-white"
            >
              Account
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
            </button>
            <div
              className={`absolute left-1/2 z-40 mt-2 w-40 -translate-x-1/2 rounded-xl border border-black/10 bg-white p-1.5 shadow-xl transition-all duration-200 dark:border-white/10 dark:bg-black ${showAccount ? "pointer-events-auto translate-y-0 opacity-100 scale-100" : "pointer-events-none -translate-y-1 opacity-0 scale-95"}`}
            >
                {!token ? (
                  <>
                    <Link onClick={() => setShowAccount(false)} href="/login" className="block rounded-lg px-3 py-2 text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/10">Login</Link>
                    <Link onClick={() => setShowAccount(false)} href="/signup" className="block rounded-lg px-3 py-2 text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/10">Sign up</Link>
                  </>
                ) : (
                  <>
                    {role === "vendor" ? (
                      <Link onClick={() => setShowAccount(false)} href="/vendor/dashboard" className="block rounded-lg px-3 py-2 text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/10">Vendor dashboard</Link>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setShowAccount(false);
                      }}
                      className="block w-full text-left rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      Logout
                    </button>
                  </>
                )}
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle />

            <Link
              href="/vendor"
              className="hidden rounded-xl bg-primary/5 px-4 py-2.5 text-sm font-black text-primary transition hover:bg-primary/10 dark:bg-primary/10 dark:text-accent dark:hover:bg-primary/20 sm:inline-flex uppercase tracking-tight"
            >
              Sell
            </Link>
          </div>

          <Link
            href="/cart"
            className="relative inline-flex items-center justify-center rounded-xl bg-accent px-5 py-2.5 text-sm font-black text-black transition-all hover:scale-[1.05] hover:shadow-lg hover:shadow-accent/20 active:scale-95"
            aria-label={cartLabel}
          >
            <span className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
              <span className="hidden sm:inline">{cartLabel}</span>
            </span>
            {itemCount > 0 ? (
              <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-black text-white ring-2 ring-white dark:ring-black">
                {Math.round(itemCount) === itemCount ? itemCount : "•"}
              </span>
            ) : null}
          </Link>
        </nav>
      </div>

      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </header>
  );
}
