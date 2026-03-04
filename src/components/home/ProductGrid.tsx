"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Product = {
  id: string;
  name: string;
  price: number;
  pricing_unit?: string;
  category?: string;
  image_url?: string;
  status: string;
};

type ProductGridProps = {
  title?: string;
};

function formatNGN(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ProductGrid({
  title = "Popular right now",
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      const data = await api.get<Product[]>("/products");
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-12 animate-fade-up delay-300">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h2 className="text-3xl font-black tracking-tight text-gray-950 font-heading dark:text-white sm:text-4xl">
            Curated Products
          </h2>
          <p className="max-w-md text-base font-medium text-gray-600 dark:text-gray-400">
            Selected items from our most trusted and verified vendors, vetted for quality and performance.
          </p>
        </div>
        <Link
          href="/shop"
          className="group inline-flex items-center text-sm font-bold text-primary hover:underline underline-offset-8 decoration-2"
        >
          View all inventory
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="ml-2 transition-transform group-hover:translate-x-1"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:gap-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-4 animate-pulse">
              <div className="aspect-[4/5] rounded-[2rem] bg-black/5 dark:bg-white/5" />
              <div className="h-4 w-2/3 rounded-full bg-black/5 dark:bg-white/5" />
              <div className="h-4 w-1/2 rounded-full bg-black/5 dark:bg-white/5" />
            </div>
          ))}
        </div>
      ) : !products || products.length === 0 ? (
        <div className="flex h-72 items-center justify-center rounded-[3rem] border-2 border-dashed border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01]">
          <div className="text-center space-y-3">
            <div className="text-xl font-black text-gray-300 dark:text-gray-700 font-heading">The catalog is quiet...</div>
            <p className="text-sm font-medium text-gray-500">New arrivals are expected shortly. Check back soon.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:gap-10">
          {products.map((p, i) => (
            <Link
              key={p.id}
              href={`/product/${p.id}`}
              className="group flex flex-col hover-lift"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-black/[0.02] dark:bg-white/[0.01] shadow-sm border border-black/5 dark:border-white/5">
                {p.image_url ? (
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-1000 cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-gray-200 dark:text-gray-800 bg-gradient-to-br from-black/[0.02] to-black/[0.05]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Archive</span>
                  </div>
                )}

                <div className="absolute top-5 left-5">
                  <span className="inline-flex rounded-full glass-panel px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-gray-950 dark:text-white shadow-premium border border-white/20">
                    New Era
                  </span>
                </div>

                <div className="absolute bottom-4 right-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="rounded-2xl bg-white p-3 text-primary shadow-2xl dark:bg-black">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                  </div>
                </div>
              </div>

              <div className="flex flex-1 flex-col py-6 px-1">
                <div className="mb-1 text-[10px] font-black uppercase tracking-widest text-primary/60">
                  {p.category || "RHOVIC SELECTION"}
                </div>
                <h3 className="text-lg font-black text-gray-950 dark:text-white font-heading group-hover:text-primary transition-colors line-clamp-1 leading-tight">
                  {p.name}
                </h3>
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-xl font-black text-gray-950 dark:text-white">
                    ₦{p.price?.toLocaleString()}
                  </div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Verified
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
