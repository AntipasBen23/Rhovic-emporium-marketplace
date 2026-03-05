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
  const [catMap, setCatMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState<string>("1");
  const [toast, setToast] = useState<string>("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [productRaw, categoriesData] = await Promise.all([
          api.get<unknown>(`/products/${params.id}`),
          api.get<{ items: unknown[] }>("/categories"),
        ]);
        setProduct(normalizeProduct(productRaw));
        const categories: Category[] = normalizeCategories(categoriesData?.items || []);
        const map: Record<string, string> = {};
        for (const c of categories) map[c.id] = c.name;
        setCatMap(map);
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

  function onAddToCart() {
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

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 overflow-hidden rounded-2xl border border-black/10 bg-white">
          <div className="p-6 sm:p-8">
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">{product.name}</h1>
            <div className="mt-2 text-sm text-gray-600">
              {product.categoryId ? (catMap[product.categoryId] || "Uncategorized") : "Uncategorized"}
            </div>

            <div className="mt-6 rounded-2xl bg-black/5 p-5">
              <div className="text-xs text-gray-600">Price</div>
              <div className="mt-1 text-3xl font-extrabold text-gray-900">{formatNGN(product.price)}</div>
              {product.pricingUnit ? <div className="text-sm text-gray-500">{product.pricingUnit}</div> : null}
            </div>

            <div className="mt-6 space-y-2">
              <h2 className="text-sm font-extrabold text-gray-900">Description</h2>
              <p className="text-sm leading-6 text-gray-600">{product.description || "No description."}</p>
            </div>

            <div className="mt-6 h-0.5 w-full bg-primary/15" />

            <div className="mt-6 flex items-center gap-3">
              <input
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                onBlur={() => setQty(clampQty(qty))}
                inputMode="decimal"
                className="w-28 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition focus:border-black/20 focus:shadow-[0_0_0_3px_rgba(18,77,52,0.12)]"
                aria-label="Quantity"
              />
              <button type="button" className="btn-accent" onClick={onAddToCart}>Add to cart</button>
            </div>
          </div>
          <div className="h-[3px] bg-primary" />
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <div className="text-xs text-gray-600">Order summary</div>
            <div className="mt-2 text-lg font-extrabold text-gray-900">{formatNGN(lineTotal)}</div>
            <div className="mt-1 text-sm text-gray-600">
              Qty: <span className="font-semibold text-gray-900">{qty || "-"}</span>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              <Link href="/cart" className="btn-primary">Go to cart</Link>
              <Link href="/shop" className="rounded-md border border-black/10 px-5 py-3 text-center text-sm font-extrabold text-gray-900 transition hover:bg-black/5">
                Continue shopping
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
