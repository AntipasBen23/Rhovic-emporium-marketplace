"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { normalizeProduct, type CatalogProduct, type Category, normalizeCategories } from "@/lib/catalog";

function formatNGN(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ShopPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          api.get<unknown[]>("/products"),
          api.get<{ items: unknown[] }>("/categories"),
        ]);
        setProducts(Array.isArray(productsData) ? productsData.map(normalizeProduct).filter((p) => !!p.id) : []);
        setCategories(normalizeCategories(categoriesData?.items || []));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const catMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const c of categories) map[c.id] = c.name;
    return map;
  }, [categories]);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return products.filter((p) => {
      const categoryName = p.categoryId ? catMap[p.categoryId] || "" : "";
      const catOk = cat === "all" ? true : p.categoryId === cat;
      const qOk = !qq
        ? true
        : [p.name, p.description, categoryName].some((x) => x.toLowerCase().includes(qq));
      return catOk && qOk;
    });
  }, [q, cat, products, catMap]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">Shop</h1>
            <p className="mt-1 text-sm text-gray-600">Browse real products published by vendors.</p>
          </div>
          <Link href="/" className="text-sm font-semibold text-primary hover:underline">← Back to home</Link>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/20 focus:shadow-[0_0_0_3px_rgba(18,77,52,0.12)]"
          />

          <select
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition focus:border-black/20"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <div className="rounded-xl bg-black/5 p-3 text-sm text-gray-700">
            Showing <span className="font-extrabold text-gray-900">{filtered.length}</span> items
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-gray-600">Loading products...</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <Link
              key={p.id}
              href={`/product/${p.id}`}
              className="group overflow-hidden rounded-2xl border border-black/10 bg-white transition hover:shadow-md"
            >
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-extrabold text-gray-900">{p.name}</div>
                    <div className="mt-1 text-xs text-gray-600">
                      {p.categoryId ? (catMap[p.categoryId] || "Uncategorized") : "Uncategorized"}
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-black/5 p-3">
                  <div className="text-xs text-gray-600">Price</div>
                  <div className="mt-1 text-lg font-extrabold text-gray-900">{formatNGN(p.price)}</div>
                  {p.pricingUnit ? <div className="text-xs text-gray-500">{p.pricingUnit}</div> : null}
                </div>
              </div>

              <div className="h-[3px] bg-primary" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
