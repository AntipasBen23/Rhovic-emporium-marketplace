"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

type OrderListItem = {
  id: string;
  order_number: string;
  payment_reference: string;
  total_amount: number;
  currency: string;
  payment_status: string;
  order_status: string;
  created_at: string;
};

function formatMoney(amount: number, currency = "NGN") {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function MyOrdersPage() {
  const router = useRouter();
  const [items, setItems] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        const res = await api.get<{ items: OrderListItem[] }>("/my-orders?limit=50");
        if (!active) return;
        setItems(Array.isArray(res?.items) ? res.items : []);
      } catch (err) {
        if (!active) return;
        const message = (err as Error).message || "Failed to load orders";
        if (message.toLowerCase().includes("401")) {
          router.replace("/login?next=/my-orders");
          return;
        }
        setError(message);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [router]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">My orders</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Track payment status and upload transfer proof.</p>
        </div>
        <Link href="/shop" className="text-sm font-semibold text-primary hover:underline">Continue shopping</Link>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>
      ) : null}

      <div className="rounded-2xl border border-black/10 bg-white dark:border-white/10 dark:bg-white/5">
        {loading ? (
          <div className="p-6 text-sm text-gray-600 dark:text-gray-400">Loading orders...</div>
        ) : items.length === 0 ? (
          <div className="p-6 text-sm text-gray-600 dark:text-gray-400">No orders yet.</div>
        ) : (
          <div className="divide-y divide-black/10 dark:divide-white/10">
            {items.map((order) => (
              <Link key={order.id} href={`/orders/${order.id}`} className="block p-5 transition hover:bg-black/5 dark:hover:bg-white/5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-extrabold text-gray-900 dark:text-white">{order.order_number}</div>
                    <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">Ref: {order.payment_reference}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-extrabold text-gray-900 dark:text-white">{formatMoney(order.total_amount, order.currency)}</div>
                    <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">{order.payment_status} / {order.order_status}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
