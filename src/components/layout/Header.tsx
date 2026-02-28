"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type HeaderProps = {
  cartCount?: number;
};

export default function Header({ cartCount = 0 }: HeaderProps) {
  const [query, setQuery] = useState("");

  const cartLabel = useMemo(() => {
    if (cartCount <= 0) return "Cart";
    return `Cart (${cartCount})`;
  }, [cartCount]);

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        {/* Brand */}
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-lg font800 font-extrabold tracking-tight text-primary">
            RHOVIC
          </span>
          <span className="hidden text-sm font-medium text-gray-600 sm:inline">
            Marketplace
          </span>
        </Link>

        {/* Search */}
        <div className="flex flex-1 items-center">
          <div className="relative w-full">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, vendors, categories…"
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none ring-0 transition focus:border-black/20 focus:shadow-[0_0_0_3px_rgba(18,77,52,0.12)]"
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
            href="/vendor"
            className="hidden rounded-lg border border-black/10 px-3 py-2 text-sm font-semibold text-gray-800 transition hover:bg-black/5 sm:inline-flex"
          >
            Sell on RHOVIC
          </Link>

          <Link
            href="/cart"
            className="btn-accent rounded-lg px-4 py-2 text-sm font-semibold"
            aria-label={cartLabel}
          >
            {cartLabel}
          </Link>
        </nav>
      </div>

      {/* subtle brand underline */}
      <div className="h-[2px] w-full bg-primary" />
    </header>
  );
}