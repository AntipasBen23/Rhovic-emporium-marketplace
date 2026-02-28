"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Product = {
  id: string;
  name: string;
  price: number;
  unit?: string;
  vendor: string;
  category: string;
  badge?: "Top Rated" | "New" | "Best Deal";
};

const categories = [
  "All",
  "Fashion",
  "Electronics",
  "Beauty",
  "Home",
  "Industrial",
  "Fabrics",
];

const products: Product[] = [
  {
    id: "p1",
    name: "Premium Cotton Fabric (Ankara)",
    price: 8500,
    unit: "per yard",
    vendor: "Rhovic Textiles",
    category: "Fabrics",
    badge: "Top Rated",
  },
  {
    id: "p2",
    name: "Wireless Earbuds Pro",
    price: 32000,
    unit: "per item",
    vendor: "GadgetHub",
    category: "Electronics",
    badge: "Best Deal",
  },
  {
    id: "p3",
    name: "Luxury Body Oil – 250ml",
    price: 12000,
    unit: "per bottle",
    vendor: "Glow & Co",
    category: "Beauty",
    badge: "New",
  },
  {
    id: "p4",
    name: "Minimalist Sneakers (Unisex)",
    price: 28000,
    unit: "per pair",
    vendor: "Urban Kicks",
    category: "Fashion",
  },
  {
    id: "p5",
    name: "Modern Table Lamp",
    price: 18000,
    unit: "per item",
    vendor: "HomeLine",
    category: "Home",
  },
  {
    id: "p6",
    name: "Industrial Safety Gloves",
    price: 9500,
    unit: "per pair",
    vendor: "WorkSupply",
    category: "Industrial",
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

export default function ShopPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return products.filter((p) => {
      const catOk = cat === "All" ? true : p.category === cat;
      const qOk = !qq
        ? true
        : [p.name, p.vendor, p.category].some((x) =>
            x.toLowerCase().includes(qq)
          );
      return catOk && qOk;
    });
  }, [q, cat]);

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
              Shop
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Browse products across vendors — curated, clean, and mobile-first.
            </p>
          </div>

          <Link href="/" className="text-sm font-semibold text-primary hover:underline">
            ← Back to home
          </Link>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products, vendors, categories…"
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/20 focus:shadow-[0_0_0_3px_rgba(18,77,52,0.12)]"
          />

          <select
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition focus:border-black/20"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <div className="rounded-xl bg-black/5 p-3 text-sm text-gray-700">
            Showing{" "}
            <span className="font-extrabold text-gray-900">{filtered.length}</span>{" "}
            items
          </div>
        </div>
      </div>

      {/* Grid */}
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
                  <div className="truncate text-sm font-extrabold text-gray-900">
                    {p.name}
                  </div>
                  <div className="mt-1 text-xs text-gray-600">
                    by <span className="font-semibold">{p.vendor}</span> •{" "}
                    {p.category}
                  </div>
                </div>
                {p.badge ? <Badge text={p.badge} /> : null}
              </div>

              <div className="mt-4 rounded-xl bg-black/5 p-3">
                <div className="text-xs text-gray-600">Price</div>
                <div className="mt-1 text-lg font-extrabold text-gray-900">
                  {formatNGN(p.price)}
                </div>
                {p.unit ? <div className="text-xs text-gray-500">{p.unit}</div> : null}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-primary">
                  View details
                </span>
                <span className="rounded-full bg-accent px-3 py-1 text-xs font-extrabold text-black transition group-hover:brightness-105">
                  Add
                </span>
              </div>
            </div>

            <div className="h-[3px] bg-primary" />
          </Link>
        ))}
      </div>
    </div>
  );
}