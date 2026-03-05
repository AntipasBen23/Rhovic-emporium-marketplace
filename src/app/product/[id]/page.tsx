"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCartStore } from "@/store/cart";
import { api } from "@/lib/api";
import { normalizeProduct, type CatalogProduct, type Category, normalizeCategories } from "@/lib/catalog";

function formatNGN(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

function clampQty(value: string) {
  const v = value.replace(",", ".").trim();
  if (!v) return "";
  const n = Number(v);
  if (Number.isNaN(n)) return "";
  if (n <= 0) return "1";
  const fixed = Math.round(n * 100) / 100;
  return String(fixed);
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const addItem = useCartStore((s) => s.addItem);
  const [product, setProduct] = useState<CatalogProduct | null>(null);
  const [related, setRelated] = useState<CatalogProduct[]>([]);
  const [catMap, setCatMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState<string>("1");
  const [toast, setToast] = useState<string>("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [productRaw, categoriesData, relatedRaw] = await Promise.all([
          api.get<unknown>(`/products/${params.id}`),
          api.get<{ items: unknown[] }>("/categories"),
          api.get<unknown[]>("/products?limit=8"),
        ]);
        const p = normalizeProduct(productRaw);
        setProduct(p);
        const categories: Category[] = normalizeCategories(categoriesData?.items || []);
        const map: Record<string, string> = {};
        for (const c of categories) map[c.id] = c.name;
        setCatMap(map);
        const rel = Array.isArray(relatedRaw) ? relatedRaw.map(normalizeProduct).filter((x) => x.id && x.id !== p.id) : [];
        setRelated(rel.slice(0, 6));
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  const qtyNum = useMemo(() => Number(qty || "0"), [qty]);
  const lineTotal = qtyNum > 0 ? qtyNum * (product?.price || 0) : 0;

  const discountPct = useMemo(() => {
    if (!product?.compareAtPrice || product.compareAtPrice <= product.price) return null;
    return Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100);
  }, [product]);

  function addCurrentToCart() {
    if (!product) return;
    const cleaned = clampQty(qty);
    const n = Number(cleaned);
    if (!cleaned || Number.isNaN(n) || n <= 0) {
      setToast("Enter a valid quantity.");
      return;
    }
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      unit: product.pricingUnit,
      vendor: "Vendor",
      quantity: n,
    });
    setToast("Added to cart.");
    setTimeout(() => setToast(""), 1400);
  }

  if (loading) {
    return <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-gray-600">Loading product...</div>;
  }

  if (!product || !product.id) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-black/10 bg-white p-6">
          <h1 className="text-xl font-extrabold text-gray-900">Product not found</h1>
          <div className="mt-4">
            <Link href="/shop" className="btn-primary">Back to shop</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
        <Link href="/" className="font-semibold text-primary hover:underline">Home</Link>
        <span>›</span>
        <Link href="/shop" className="font-semibold text-primary hover:underline">Shop</Link>
        <span>›</span>
        <span className="text-gray-800">{product.name}</span>
      </div>

      {toast ? (
        <div className="rounded-2xl border border-black/10 bg-black/5 p-4 text-sm text-gray-800">
          <span className="font-extrabold text-primary">RHOVIC:</span> {toast}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1.4fr_0.9fr]">
        <section className="rounded-2xl border border-black/10 bg-white p-5">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="h-[380px] w-full rounded-xl object-cover border border-black/10" />
          ) : (
            <div className="h-[380px] w-full rounded-xl border border-dashed border-black/10 bg-black/5" />
          )}
        </section>

        <section className="rounded-2xl border border-black/10 bg-white p-6 space-y-4">
          <h1 className="text-3xl font-black tracking-tight text-gray-900">{product.name}</h1>
          <div className="text-sm text-gray-600">
            Category: <span className="font-semibold text-gray-900">{product.categoryId ? (catMap[product.categoryId] || "Uncategorized") : "Uncategorized"}</span>
          </div>
          <div className="flex items-end gap-3">
            <div className="text-4xl font-black text-gray-900">{formatNGN(product.price)}</div>
            {product.compareAtPrice && product.compareAtPrice > product.price ? (
              <>
                <div className="text-xl text-gray-400 line-through">{formatNGN(product.compareAtPrice)}</div>
                {discountPct ? <span className="rounded bg-accent/20 px-2 py-1 text-sm font-bold text-orange-700">-{discountPct}%</span> : null}
              </>
            ) : null}
          </div>
          <div className="text-sm text-gray-600">
            Unit: <span className="font-semibold text-gray-900">{product.pricingUnit || "unit"}</span>
          </div>
          <div className="pt-2 border-t border-black/10">
            <h2 className="text-sm font-extrabold text-gray-900 mb-2">Product details</h2>
            <p className="text-sm leading-7 text-gray-700 whitespace-pre-wrap">{product.description || "No description available."}</p>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <div className="text-xs text-gray-600">Order summary</div>
            <div className="mt-2 text-lg font-extrabold text-gray-900">{formatNGN(lineTotal)}</div>
            <div className="mt-3 flex items-center gap-3">
              <input
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                onBlur={() => setQty(clampQty(qty))}
                inputMode="decimal"
                className="w-24 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-gray-900 outline-none transition focus:border-black/20"
                aria-label="Quantity"
              />
              <button type="button" className="btn-accent flex-1" onClick={addCurrentToCart}>Add to cart</button>
            </div>
            <div className="mt-3 text-xs text-gray-500">Secure checkout and transparent delivery updates.</div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <h3 className="text-sm font-extrabold text-gray-900">Specifications</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              <li>• Pricing unit: {product.pricingUnit || "unit"}</li>
              <li>• Product status: {product.status || "published"}</li>
              <li>• Category: {product.categoryId ? (catMap[product.categoryId] || "Uncategorized") : "Uncategorized"}</li>
            </ul>
          </div>
        </aside>
      </div>

      <section className="rounded-2xl border border-black/10 bg-white p-6">
        <h2 className="text-2xl font-black text-gray-900">Customers also viewed</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {related.map((p) => (
            <Link key={p.id} href={`/product/${p.id}`} className="rounded-xl border border-black/10 p-3 hover:shadow-md transition">
              <div className="h-28 w-full rounded-lg bg-black/5 overflow-hidden">
                {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" /> : null}
              </div>
              <div className="mt-2 text-xs font-bold text-gray-900 line-clamp-2">{p.name}</div>
              <div className="mt-1 text-sm font-black text-gray-900">{formatNGN(p.price)}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
