"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCartStore } from "@/store/cart";

export default function Header() {
  const [query, setQuery] = useState("");

  // Zustand selectors
  const itemCount = useCartStore((s) => s.count());

  const cartLabel = useMemo(() => {
    if (!itemCount || itemCount <= 0) return "Cart";
    // show decimals only if needed
    const pretty =
      Math.round(itemCount) === itemCount ? String(itemCount) : itemCount.toFixed(2);
    return `Cart (${pretty})`;
  }, [itemCount]);

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        {/* Brand */}
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-lg font-extrabold tracking-tight text-primary">
            RHOVIC
          </span>
          <span className="hidden text-sm font-medium text-gray-600 sm:inline">
            Marketplace
          </span>
        </Link>

        {/* Search (UI only for now; wire later to /shop query params) */}
        <div className="flex flex-1 items-center">
          <div className="relative w-full">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, vendors, categories…"
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-black/20 focus:shadow-[0_0_0_3px_rgba(18,77,52,0.12)]"
              aria-label="Search marketplace"
            />
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
              ⌘K
            </div>
          </div>
        </div>

        {/* Actions */}
        <nav className="flex items-center gap-2">
          <Link
            href="/pricing"
            className="hidden rounded-lg border border-black/10 px-3 py-2 text-sm font-semibold text-gray-800 transition hover:bg-black/5 sm:inline-flex"
          >
            Pricing
          </Link>

          <Link
            href="/vendor"
            className="hidden rounded-lg border border-black/10 px-3 py-2 text-sm font-semibold text-gray-800 transition hover:bg-black/5 sm:inline-flex"
          >
            Sell on RHOVIC
          </Link>

          <Link
            href="/cart"
            className="relative inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-extrabold text-black transition hover:brightness-105"
            aria-label={cartLabel}
          >
            {cartLabel}
            {itemCount > 0 ? (
              <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-extrabold text-white">
                {Math.round(itemCount) === itemCount ? itemCount : "•"}
              </span>
            ) : null}
          </Link>
        </nav>
      </div>

      <div className="h-[2px] w-full bg-primary" />
    </header>
  );
}