"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { normalizeProduct, type CatalogProduct, type Category, normalizeCategories } from "@/lib/catalog";

type ProductGridProps = {
  title?: string;
};

export default function ProductGrid({ title = "Curated Products" }: ProductGridProps) {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [catMap, setCatMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        api.get<unknown[]>("/products"),
        api.get<{ items: unknown[] }>("/categories"),
      ]);

      const items = Array.isArray(productsData)
        ? productsData.map(normalizeProduct).filter((p) => !!p.id)
        : [];

      const categories: Category[] = normalizeCategories(categoriesData?.items || []);
      const map: Record<string, string> = {};
      for (const c of categories) map[c.id] = c.name;

      setCatMap(map);
      setProducts(items);
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
            {title}
          </h2>
          <p className="max-w-md text-base font-semibold text-gray-700 dark:text-gray-400">
            Selected items from verified vendors.
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
      ) : products.length === 0 ? (
        <div className="flex h-72 items-center justify-center rounded-[3rem] border-2 border-dashed border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01]">
          <div className="text-center space-y-3">
            <div className="text-xl font-black text-gray-300 dark:text-gray-700 font-heading">No products yet</div>
            <p className="text-sm font-medium text-gray-500">Vendors have not published items yet.</p>
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
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-1000 cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-gray-200 dark:text-gray-800 bg-gradient-to-br from-black/[0.02] to-black/[0.05]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Archive</span>
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col py-6 px-1">
                <div className="mb-1 text-[10px] font-black uppercase tracking-widest text-primary">
                  {p.categoryId ? (catMap[p.categoryId] || "RHOVIC SELECTION") : "RHOVIC SELECTION"}
                </div>
                <h3 className="text-lg font-black text-gray-950 dark:text-white font-heading group-hover:text-primary transition-colors line-clamp-1 leading-tight">
                  {p.name}
                </h3>
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-xl font-black text-gray-950 dark:text-white">
                    ₦{p.price?.toLocaleString()}
                  </div>
                  <div className="text-[10px] font-black text-primary uppercase tracking-widest">
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
