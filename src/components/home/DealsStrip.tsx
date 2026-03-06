"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { normalizeProduct, type CatalogProduct } from "@/lib/catalog";
import { useCartStore } from "@/store/cart";

function formatNGN(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function DealsStrip() {
  const addItem = useCartStore((s) => s.addItem);
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
          <div
            key={d.id}
            className="group relative flex flex-col rounded-[2rem] border border-black/[0.03] bg-black/[0.01] p-6 pb-20 transition-all duration-300 hover-lift dark:border-white/[0.03] dark:bg-white/[0.01]"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <Link href={`/product/${d.id}`} className="block">
              <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-black/5 bg-black/5 dark:border-white/10 dark:bg-white/5">
                {d.imageUrl ? (
                  <img src={d.imageUrl} alt={d.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : null}
              </div>
              <div className="mt-4 min-h-[3rem] line-clamp-2 text-base font-black leading-tight text-gray-950 transition-colors group-hover:text-primary dark:text-white font-heading">
                {d.name}
              </div>
              <div className="mt-4 rounded-3xl border border-black/[0.03] p-5 glass-panel dark:border-white/[0.03]">
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Price</div>
                <div className="mt-1 text-2xl font-black leading-none text-gray-950 dark:text-white">{formatNGN(d.price)}</div>
                {d.compareAtPrice && d.compareAtPrice > d.price ? (
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <span className="line-through text-gray-400">{formatNGN(d.compareAtPrice)}</span>
                    <span className="rounded bg-accent/20 px-1.5 py-0.5 font-bold text-orange-700">
                      -{Math.round(((d.compareAtPrice - d.price) / d.compareAtPrice) * 100)}%
                    </span>
                  </div>
                ) : null}
              </div>
            </Link>
            <button
              type="button"
              onClick={() => addItem({ id: d.id, name: d.name, price: d.price, unit: d.pricingUnit, vendor: "Vendor", quantity: 1 })}
              className="absolute bottom-3 left-2 right-2 rounded-xl bg-accent px-5 py-3.5 text-sm font-black text-black opacity-0 translate-y-2 transition-all group-hover:translate-y-0 group-hover:opacity-100"
            >
              Add to cart
            </button>
          </div>
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
