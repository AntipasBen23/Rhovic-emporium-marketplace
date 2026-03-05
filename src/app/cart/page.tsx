"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useCartStore } from "@/store/cart";

function formatNGN(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

function clampQtyInput(value: string) {
  const v = value.replace(",", ".").trim();
  if (!v) return "";
  const n = Number(v);
  if (Number.isNaN(n)) return "";
  if (n <= 0) return "0";
  const fixed = Math.round(n * 100) / 100;
  return String(fixed);
}

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const setQty = useCartStore((s) => s.setQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const clear = useCartStore((s) => s.clear);

  const total = useMemo(
    () => items.reduce((acc, i) => acc + i.price * i.quantity, 0),
    [items]
  );

  const grouped = useMemo(() => {
    const map = new Map<string, typeof items>();
    for (const item of items) {
      const list = map.get(item.vendor) ?? [];
      list.push(item);
      map.set(item.vendor, list);
    }
    return Array.from(map.entries());
  }, [items]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Your cart
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Multi-vendor cart supported. Checkout will handle split logic later.
          </p>
        </div>
        <Link href="/shop" className="text-sm font-semibold text-primary hover:underline">
          Back to shop
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
          <div className="text-lg font-extrabold text-gray-900 dark:text-white">Cart is empty</div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Add items from the shop, then come back here to checkout.
          </p>
          <div className="mt-4">
            <Link href="/shop" className="btn-primary">
              Browse products
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <section className="space-y-4 lg:col-span-2">
            {grouped.map(([vendor, vItems]) => (
              <div key={vendor} className="overflow-hidden rounded-2xl border border-black/10 bg-white dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center justify-between bg-black/5 px-5 py-4 dark:bg-white/5">
                  <div className="text-sm font-extrabold text-gray-900 dark:text-white">{vendor}</div>
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-extrabold text-white">
                    Vendor items: {vItems.length}
                  </span>
                </div>

                <div className="divide-y divide-black/10 dark:divide-white/10">
                  {vItems.map((item) => {
                    const line = item.price * item.quantity;
                    return (
                      <div key={item.id} className="p-5">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <div className="truncate text-sm font-extrabold text-gray-900 dark:text-white">
                              {item.name}
                            </div>
                            <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                              {formatNGN(item.price)}{" "}
                              {item.unit ? <span className="text-gray-500 dark:text-gray-400">| {item.unit}</span> : null}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <input
                              defaultValue={String(item.quantity)}
                              onBlur={(e) => {
                                const cleaned = clampQtyInput(e.target.value);
                                const n = Number(cleaned);
                                if (!cleaned || Number.isNaN(n)) {
                                  e.currentTarget.value = String(item.quantity);
                                  return;
                                }
                                setQty(item.id, n);
                                e.currentTarget.value = cleaned;
                              }}
                              inputMode="decimal"
                              className="w-28 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 outline-none transition focus:border-black/20 focus:shadow-[0_0_0_3px_rgba(18,77,52,0.12)] dark:border-white/10 dark:bg-black/20 dark:text-white"
                              aria-label="Quantity"
                            />

                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="rounded-md border border-black/10 px-3 py-2 text-sm font-extrabold text-gray-900 transition hover:bg-black/5 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-xs text-gray-600 dark:text-gray-400">Line total</span>
                          <span className="text-sm font-extrabold text-gray-900 dark:text-white">{formatNGN(line)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="h-[3px] bg-primary" />
              </div>
            ))}
          </section>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-white/5">
              <div className="text-xs text-gray-600 dark:text-gray-400">Cart total</div>
              <div className="mt-2 text-2xl font-extrabold text-gray-900 dark:text-white">
                {formatNGN(total)}
              </div>

              <div className="mt-4 flex flex-col gap-3">
                <Link href="/checkout" className="btn-accent">
                  Proceed to checkout
                </Link>
                <button type="button" className="btn-primary" onClick={clear}>
                  Clear cart
                </button>
              </div>

              <div className="mt-4 rounded-xl bg-black/5 p-3 text-xs text-gray-700 dark:bg-white/5 dark:text-gray-300">
                Shipping is vendor-configured and will be shown at checkout.
              </div>
            </div>

            <div className="rounded-2xl bg-black/5 p-5 text-sm text-gray-700 dark:bg-white/5 dark:text-gray-300">
              <div className="font-extrabold text-gray-900 dark:text-white">Marketplace note</div>
              <div className="mt-2 leading-6">
                Items can come from multiple vendors. RHOVIC handles the transaction
                flow and commission tracking behind the scenes.
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
