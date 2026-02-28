"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCartStore } from "@/store/cart";

type Product = {
  id: string;
  name: string;
  price: number;
  unit?: string;
  vendor: string;
  category: string;
  description: string;
  stock: number;
  badge?: "Top Rated" | "New" | "Best Deal";
};

const products: Product[] = [
  {
    id: "p1",
    name: "Premium Cotton Fabric (Ankara)",
    price: 8500,
    unit: "per yard",
    vendor: "Rhovic Textiles",
    category: "Fabrics",
    description:
      "High-quality cotton fabric with vibrant patterns. Ideal for tailoring, events, and premium finishing.",
    stock: 128.5,
    badge: "Top Rated",
  },
  {
    id: "p2",
    name: "Wireless Earbuds Pro",
    price: 32000,
    unit: "per item",
    vendor: "GadgetHub",
    category: "Electronics",
    description:
      "Clear sound, stable connection, and long battery life. Built for daily use and clean bass response.",
    stock: 42,
    badge: "Best Deal",
  },
  {
    id: "p3",
    name: "Luxury Body Oil – 250ml",
    price: 12000,
    unit: "per bottle",
    vendor: "Glow & Co",
    category: "Beauty",
    description:
      "Lightweight, non-greasy body oil with a premium scent profile. Great for daily glow and skin softness.",
    stock: 67,
    badge: "New",
  },
];

function formatNGN(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

function Badge({ text }: { text: NonNullable<Product["badge"]> }) {
  const cls =
    text === "Top Rated"
      ? "bg-primary text-white"
      : text === "Best Deal"
      ? "bg-accent text-black"
      : "bg-black text-white";
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-extrabold ${cls}`}>
      {text}
    </span>
  );
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

  const product = useMemo(
    () => products.find((p) => p.id === params.id),
    [params.id]
  );

  const [qty, setQty] = useState<string>("1");
  const [toast, setToast] = useState<string>("");

  if (!product) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-black/10 bg-white p-6">
          <h1 className="text-xl font-extrabold text-gray-900">Product not found</h1>
          <p className="mt-2 text-sm text-gray-600">
            This product ID doesn’t exist in the demo catalog yet.
          </p>
          <div className="mt-4">
            <Link href="/shop" className="btn-primary">
              Back to shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const qtyNum = Number(qty || "0");
  const lineTotal = qtyNum > 0 ? qtyNum * product.price : 0;

  function onAddToCart() {
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
      unit: product.unit,
      vendor: product.vendor,
      quantity: n,
    });

    setToast("Added to cart.");
    setTimeout(() => setToast(""), 1400);
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
        <Link href="/" className="font-semibold text-primary hover:underline">
          Home
        </Link>
        <span>›</span>
        <Link href="/shop" className="font-semibold text-primary hover:underline">
          Shop
        </Link>
        <span>›</span>
        <span className="text-gray-800">{product.name}</span>
      </div>

      {toast ? (
        <div className="rounded-2xl border border-black/10 bg-black/5 p-4 text-sm text-gray-800">
          <span className="font-extrabold text-primary">RHOVIC:</span> {toast}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main */}
        <section className="lg:col-span-2 overflow-hidden rounded-2xl border border-black/10 bg-white">
          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
                  {product.name}
                </h1>
                <div className="mt-2 text-sm text-gray-600">
                  by <span className="font-semibold">{product.vendor}</span> •{" "}
                  {product.category}
                </div>
              </div>
              {product.badge ? <Badge text={product.badge} /> : null}
            </div>

            <div className="mt-6 rounded-2xl bg-black/5 p-5">
              <div className="text-xs text-gray-600">Price</div>
              <div className="mt-1 flex flex-wrap items-end gap-2">
                <div className="text-3xl font-extrabold text-gray-900">
                  {formatNGN(product.price)}
                </div>
                {product.unit ? (
                  <div className="pb-1 text-sm text-gray-500">{product.unit}</div>
                ) : null}
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Stock:{" "}
                <span className="font-semibold text-gray-900">{product.stock}</span>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <h2 className="text-sm font-extrabold text-gray-900">Description</h2>
              <p className="text-sm leading-6 text-gray-600">{product.description}</p>
            </div>

            <div className="mt-6 h-[2px] w-full bg-primary/15" />

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-1">
                <label className="text-sm font-extrabold text-gray-900">
                  Quantity
                </label>
                <div className="text-xs text-gray-500">
                  Supports decimals where applicable (e.g., fabric).
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  onBlur={() => setQty(clampQty(qty))}
                  inputMode="decimal"
                  className="w-28 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition focus:border-black/20 focus:shadow-[0_0_0_3px_rgba(18,77,52,0.12)]"
                  aria-label="Quantity"
                />
                <button type="button" className="btn-accent" onClick={onAddToCart}>
                  Add to cart
                </button>
              </div>
            </div>
          </div>

          <div className="h-[3px] bg-primary" />
        </section>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <div className="text-xs text-gray-600">Order summary</div>
            <div className="mt-2 text-lg font-extrabold text-gray-900">
              {formatNGN(lineTotal)}
            </div>
            <div className="mt-1 text-sm text-gray-600">
              Qty:{" "}
              <span className="font-semibold text-gray-900">{qty || "-"}</span>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              <Link href="/cart" className="btn-primary">
                Go to cart
              </Link>
              <Link
                href="/shop"
                className="rounded-md border border-black/10 px-5 py-3 text-center text-sm font-extrabold text-gray-900 transition hover:bg-black/5"
              >
                Continue shopping
              </Link>
            </div>
          </div>

          <div className="rounded-2xl bg-black/5 p-5 text-sm text-gray-700">
            <div className="font-extrabold text-gray-900">Vendor note</div>
            <div className="mt-2 leading-6">
              Delivery options and shipping prices are configured by each vendor.
              You’ll see final delivery costs at checkout.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}