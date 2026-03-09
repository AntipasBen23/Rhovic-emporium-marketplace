"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";
import { api } from "@/lib/api";

function formatNGN(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const router = useRouter();

  const total = useMemo(
    () => items.reduce((acc, i) => acc + i.price * i.quantity, 0),
    [items]
  );

  const vendors = useMemo(() => {
    const set = new Set(items.map((i) => i.vendor));
    return Array.from(set);
  }, [items]);

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canCheckout = items.length > 0 && !isSubmitting;

  async function onCheckout() {
    if (items.length === 0) {
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      const payload = {
        items: items.map((item) => ({
          product_id: item.id,
          quantity: String(item.quantity),
        })),
      };
      const res = await api.post<{ orderId: string }>("/checkout", payload);
      clear();
      router.push(`/orders/${res.orderId}`);
    } catch (err) {
      const message = (err as Error).message || "Checkout failed";
      if (message.toLowerCase().includes("401")) {
        router.push("/login?next=/checkout");
        return;
      }
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
          <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">Checkout</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Your cart is empty. Add items first.
          </p>
          <div className="mt-4 flex gap-3">
            <Link href="/shop" className="btn-primary">
              Go to shop
            </Link>
            <Link
              href="/"
              className="rounded-md border border-black/10 px-5 py-3 text-sm font-extrabold text-gray-900 transition hover:bg-black/5 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Checkout
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Single payment and multi-vendor allocation by the marketplace.
          </p>
        </div>
        <Link href="/cart" className="text-sm font-semibold text-primary hover:underline">
          Back to cart
        </Link>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
            <h2 className="text-sm font-extrabold text-gray-900 dark:text-white">Manual bank transfer</h2>
            <div className="mt-3 text-sm leading-6 text-gray-700 dark:text-gray-300">
              This checkout creates one master order and splits it into vendor orders automatically.
              You will receive a unique payment reference on the next screen. Upload proof after transfer so admin can approve payment.
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
            <h2 className="text-sm font-extrabold text-gray-900 dark:text-white">Order items</h2>
            <div className="mt-4 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-xl bg-black/5 px-4 py-3 dark:bg-white/5">
                  <div className="min-w-0 pr-3">
                    <div className="truncate text-sm font-extrabold text-gray-900 dark:text-white">{item.name}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Qty: {item.quantity}</div>
                  </div>
                  <div className="text-sm font-extrabold text-gray-900 dark:text-white">
                    {formatNGN(item.quantity * item.price)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-white/5">
            <div className="text-xs text-gray-600 dark:text-gray-400">Order total</div>
            <div className="mt-2 text-2xl font-extrabold text-gray-900 dark:text-white">{formatNGN(total)}</div>

            <div className="mt-3 rounded-xl bg-black/5 p-3 text-xs text-gray-700 dark:bg-white/5 dark:text-gray-300">
              Vendors in this order: <span className="font-extrabold text-gray-900 dark:text-white">{vendors.length}</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {vendors.map((v) => (
                  <span key={v} className="rounded-full border border-black/10 bg-white px-3 py-1 font-semibold dark:border-white/10 dark:bg-black/20 dark:text-white">
                    {v}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={onCheckout}
              disabled={!canCheckout}
              className={`mt-4 inline-flex w-full items-center justify-center rounded-md px-5 py-3 text-sm font-extrabold transition ${
                canCheckout ? "bg-accent text-black hover:brightness-105" : "cursor-not-allowed bg-black/10 text-gray-500 dark:bg-white/10 dark:text-gray-400"
              }`}
            >
              {isSubmitting ? "Creating order..." : "Place order"}
            </button>

            <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              Payment is completed by bank transfer after order creation.
            </div>
          </div>

          <div className="rounded-2xl bg-black/5 p-5 text-sm text-gray-700 dark:bg-white/5 dark:text-gray-300">
            <div className="font-extrabold text-gray-900 dark:text-white">Important</div>
            <div className="mt-2 leading-6">
              Shipping fees are vendor-configured. Real checkout will compute shipping per vendor before payment.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
