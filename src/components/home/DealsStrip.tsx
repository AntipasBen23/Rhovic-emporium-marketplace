"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { normalizeProduct, type CatalogProduct } from "@/lib/catalog";

function formatNGN(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function DealsStrip() {
  const [items, setItems] = useState<CatalogProduct[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get<unknown[]>("/products?limit=4");
        const normalized = Array.isArray(data) ? data.map(normalizeProduct).filter((p) => !!p.id) : [];
        setItems(normalized.slice(0, 4));
      } catch {
        setItems([]);
      }
    }
    load();
  }, []);

  return (
    <section className="overflow-hidden rounded-[2.5rem] border border-black/8 bg-white shadow-premium animate-fade-up dark:border-white/5 dark:bg-white/5">
      <div className="flex flex-col gap-6 bg-primary p-8 text-white sm:flex-row sm:items-center sm:justify-between sm:p-10">
        <div className="space-y-1">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Featured Picks</div>
          <div className="text-2xl font-black tracking-tight font-heading sm:text-3xl">Live Product Highlights</div>
        </div>
        <Link href="/shop" className="group inline-flex items-center justify-center rounded-xl bg-accent px-8 py-3 text-sm font-black text-black transition-all hover:scale-105">
          See all inventory
        </Link>
      </div>

      <div className="grid gap-6 p-8 sm:grid-cols-2 lg:grid-cols-4 lg:p-10">
        {items.map((d, i) => (
          <Link
            key={d.id}
            href={`/product/${d.id}`}
            className="group flex flex-col hover-lift rounded-[2rem] border border-black/[0.03] bg-black/[0.01] p-6 dark:border-white/[0.03] dark:bg-white/[0.01] transition-all duration-300"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="text-base font-black text-gray-950 font-heading dark:text-white group-hover:text-primary transition-colors leading-tight">
              {d.name}
            </div>
            <div className="mt-8 rounded-3xl glass-panel p-5 border border-black/[0.03] dark:border-white/[0.03]">
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Price</div>
              <div className="mt-1 text-2xl font-black text-gray-950 dark:text-white leading-none">{formatNGN(d.price)}</div>
            </div>
          </Link>
        ))}
        {items.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-black/10 p-6 text-sm text-gray-500">
            No featured products yet.
          </div>
        )}
      </div>

      <div className="h-1.5 w-full bg-accent opacity-20" />
    </section>
  );
}
