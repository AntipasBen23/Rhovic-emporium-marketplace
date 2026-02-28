"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Tab = "Products" | "Orders" | "Payouts";

type MockProduct = {
  id: string;
  name: string;
  price: number;
  status: "Draft" | "Published";
  stock: number;
};

type MockOrder = {
  id: string;
  buyer: string;
  total: number;
  status: "Pending" | "Processing" | "Completed";
};

function formatNGN(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

const mockProducts: MockProduct[] = [
  { id: "vp1", name: "Premium Cotton Fabric (Ankara)", price: 8500, status: "Published", stock: 128.5 },
  { id: "vp2", name: "Luxury Body Oil – 250ml", price: 12000, status: "Draft", stock: 67 },
];

const mockOrders: MockOrder[] = [
  { id: "o-10021", buyer: "Ada O.", total: 28500, status: "Pending" },
  { id: "o-10022", buyer: "Kemi A.", total: 12000, status: "Processing" },
];

export default function VendorDashboardPage() {
  const [tab, setTab] = useState<Tab>("Products");

  const stats = useMemo(() => {
    const published = mockProducts.filter((p) => p.status === "Published").length;
    const draft = mockProducts.filter((p) => p.status === "Draft").length;
    const pendingOrders = mockOrders.filter((o) => o.status !== "Completed").length;
    return { published, draft, pendingOrders };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
            Vendor Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage products, orders, and payouts (demo UI).
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/vendor"
            className="rounded-md border border-black/10 px-4 py-2 text-sm font-extrabold text-gray-900 transition hover:bg-black/5"
          >
            Vendor home
          </Link>
          <Link href="/shop" className="rounded-md bg-primary px-4 py-2 text-sm font-extrabold text-white transition hover:brightness-105">
            View marketplace
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-black/10 bg-white p-5">
          <div className="text-xs text-gray-600">Published products</div>
          <div className="mt-2 text-2xl font-extrabold text-gray-900">
            {stats.published}
          </div>
          <div className="mt-3 h-1 rounded-full bg-primary/20">
            <div className="h-1 w-2/3 rounded-full bg-primary" />
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-5">
          <div className="text-xs text-gray-600">Draft products</div>
          <div className="mt-2 text-2xl font-extrabold text-gray-900">
            {stats.draft}
          </div>
          <div className="mt-3 h-1 rounded-full bg-primary/20">
            <div className="h-1 w-1/3 rounded-full bg-primary" />
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-5">
          <div className="text-xs text-gray-600">Open orders</div>
          <div className="mt-2 text-2xl font-extrabold text-gray-900">
            {stats.pendingOrders}
          </div>
          <div className="mt-3 h-1 rounded-full bg-primary/20">
            <div className="h-1 w-1/2 rounded-full bg-primary" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {(["Products", "Orders", "Payouts"] as Tab[]).map((t) => {
          const active = t === tab;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={[
                "rounded-full px-4 py-2 text-sm font-extrabold transition border",
                active
                  ? "border-transparent bg-primary text-white"
                  : "border-black/10 bg-white text-gray-900 hover:bg-black/5",
              ].join(" ")}
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {tab === "Products" ? (
        <section className="overflow-hidden rounded-2xl border border-black/10 bg-white">
          <div className="flex items-center justify-between bg-black/5 px-5 py-4">
            <div className="text-sm font-extrabold text-gray-900">Your products</div>
            <button className="rounded-md bg-accent px-4 py-2 text-sm font-extrabold text-black transition hover:brightness-105">
              Add product
            </button>
          </div>

          <div className="divide-y divide-black/10">
            {mockProducts.map((p) => (
              <div key={p.id} className="p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-extrabold text-gray-900">
                      {p.name}
                    </div>
                    <div className="mt-1 text-xs text-gray-600">
                      {formatNGN(p.price)} • Stock:{" "}
                      <span className="font-semibold text-gray-900">{p.stock}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                        p.status === "Published"
                          ? "bg-primary text-white"
                          : "bg-black text-white"
                      }`}
                    >
                      {p.status}
                    </span>
                    <button className="rounded-md border border-black/10 px-3 py-2 text-sm font-extrabold text-gray-900 transition hover:bg-black/5">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="h-[3px] bg-primary" />
        </section>
      ) : null}

      {tab === "Orders" ? (
        <section className="overflow-hidden rounded-2xl border border-black/10 bg-white">
          <div className="bg-black/5 px-5 py-4">
            <div className="text-sm font-extrabold text-gray-900">Orders</div>
          </div>

          <div className="divide-y divide-black/10">
            {mockOrders.map((o) => (
              <div key={o.id} className="p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm font-extrabold text-gray-900">{o.id}</div>
                    <div className="mt-1 text-xs text-gray-600">
                      Buyer: <span className="font-semibold">{o.buyer}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-sm font-extrabold text-gray-900">
                      {formatNGN(o.total)}
                    </div>
                    <span className="rounded-full bg-accent px-3 py-1 text-xs font-extrabold text-black">
                      {o.status}
                    </span>
                    <button className="rounded-md border border-black/10 px-3 py-2 text-sm font-extrabold text-gray-900 transition hover:bg-black/5">
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="h-[3px] bg-primary" />
        </section>
      ) : null}

      {tab === "Payouts" ? (
        <section className="overflow-hidden rounded-2xl border border-black/10 bg-white">
          <div className="bg-black/5 px-5 py-4">
            <div className="text-sm font-extrabold text-gray-900">Payouts</div>
          </div>

          <div className="p-5 space-y-3">
            <div className="rounded-2xl bg-black/5 p-4">
              <div className="text-xs text-gray-600">Available balance</div>
              <div className="mt-2 text-2xl font-extrabold text-gray-900">
                {formatNGN(54000)}
              </div>
              <div className="mt-2 text-xs text-gray-600">
                Commission and payout tracking will be driven by backend reconciliation.
              </div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-4">
              <div className="text-sm font-extrabold text-gray-900">Recent payouts</div>
              <div className="mt-2 text-sm text-gray-600">
                No payouts yet (demo).
              </div>
            </div>
          </div>

          <div className="h-[3px] bg-primary" />
        </section>
      ) : null}
    </div>
  );
}