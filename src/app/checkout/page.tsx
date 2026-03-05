"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCartStore } from "@/store/cart";

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

  const total = useMemo(
    () => items.reduce((acc, i) => acc + i.price * i.quantity, 0),
    [items]
  );

  const vendors = useMemo(() => {
    const set = new Set(items.map((i) => i.vendor));
    return Array.from(set);
  }, [items]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [toast, setToast] = useState("");

  const canPay =
    items.length > 0 &&
    name.trim() &&
    phone.trim() &&
    email.trim() &&
    address.trim();

  function onPay() {
    if (!canPay) {
      setToast("Fill your details before paying.");
      return;
    }
    setToast("Redirecting to Paystack (demo)...");
    setTimeout(() => {
      setToast("Payment success (demo). Order created. Cart cleared.");
      clear();
    }, 1200);
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

      {toast ? (
        <div className="rounded-2xl border border-black/10 bg-black/5 p-4 text-sm text-gray-800 dark:border-white/10 dark:bg-white/5 dark:text-gray-200">
          <span className="font-extrabold text-primary">RHOVIC:</span> {toast}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
            <h2 className="text-sm font-extrabold text-gray-900 dark:text-white">Buyer details</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition focus:border-black/20 focus:shadow-[0_0_0_3px_rgba(18,77,52,0.12)] dark:border-white/10 dark:bg-black/20 dark:text-white dark:placeholder:text-gray-500" />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition focus:border-black/20 focus:shadow-[0_0_0_3px_rgba(18,77,52,0.12)] dark:border-white/10 dark:bg-black/20 dark:text-white dark:placeholder:text-gray-500" />
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" type="email" className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition focus:border-black/20 focus:shadow-[0_0_0_3px_rgba(18,77,52,0.12)] sm:col-span-2 dark:border-white/10 dark:bg-black/20 dark:text-white dark:placeholder:text-gray-500" />
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
            <h2 className="text-sm font-extrabold text-gray-900 dark:text-white">Delivery address</h2>
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street, city, state, landmark..." className="mt-4 min-h-[110px] w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition focus:border-black/20 focus:shadow-[0_0_0_3px_rgba(18,77,52,0.12)] dark:border-white/10 dark:bg-black/20 dark:text-white dark:placeholder:text-gray-500" />
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
            <h2 className="text-sm font-extrabold text-gray-900 dark:text-white">Order note (optional)</h2>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Anything the vendor should know?" className="mt-4 min-h-[90px] w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition focus:border-black/20 focus:shadow-[0_0_0_3px_rgba(18,77,52,0.12)] dark:border-white/10 dark:bg-black/20 dark:text-white dark:placeholder:text-gray-500" />
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
              onClick={onPay}
              disabled={!canPay}
              className={`mt-4 inline-flex w-full items-center justify-center rounded-md px-5 py-3 text-sm font-extrabold transition ${
                canPay ? "bg-accent text-black hover:brightness-105" : "cursor-not-allowed bg-black/10 text-gray-500 dark:bg-white/10 dark:text-gray-400"
              }`}
            >
              Pay with Paystack
            </button>

            <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              This is a demo checkout. Next step: backend-generated Paystack transaction and split allocation.
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
