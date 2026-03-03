"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Product = {
  id: string;
  name: string;
  price: number;
  pricing_unit?: string;
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
      setProducts(data || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-lg font-extrabold tracking-tight text-gray-900">
          {title}
        </h2>
        <Link href="/shop" className="text-sm font-semibold text-primary hover:underline">
          Shop
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-2xl bg-black/5" />
          ))
        ) : products.length === 0 ? (
          <div className="col-span-full py-10 text-center text-sm text-gray-500">
            No products available yet.
          </div>
        ) : (
          products.map((p) => (
            <Link
              key={p.id}
              href={`/shop/product/${p.id}`}
              className="group overflow-hidden rounded-2xl border border-black/10 bg-white transition hover:shadow-md"
            >
              <div className="p-4">
                <div className="flex gap-3 mb-4">
                  {p.image_url ? (
                    <img src={p.image_url} className="w-20 h-20 rounded-xl object-cover border border-black/5" />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-black/5 flex items-center justify-center text-[10px] text-gray-400 font-extrabold uppercase">No Image</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-sm font-extrabold text-gray-900 group-hover:text-primary transition">
                      {p.name}
                    </div>
                    <div className="mt-1 text-xs text-gray-600">
                      RHOVIC Verified
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-black/5 p-3">
                  <div className="text-xs text-gray-600">Price</div>
                  <div className="mt-1 text-lg font-extrabold text-gray-900">
                    {formatNGN(p.price)}
                  </div>
                  {p.pricing_unit ? (
                    <div className="text-xs text-gray-500">{p.pricing_unit}</div>
                  ) : null}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-extrabold text-primary">
                    View details
                  </span>
                  <span className="rounded-full bg-accent px-3 py-1 text-xs font-extrabold text-black transition group-hover:brightness-105">
                    Add to cart
                  </span>
                </div>
              </div>

              <div className="h-[3px] bg-primary" />
            </Link>
          ))
        )}
      </div>
    </section>
  );
}