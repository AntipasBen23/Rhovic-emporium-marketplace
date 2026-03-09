"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { api } from "@/lib/api";

type OrderItem = {
  product_id: string;
  name: string;
  quantity: string;
  unit_price: number;
  line_total: number;
  image_url?: string;
};

type PaymentProof = {
  id: string;
  file_url: string;
  file_type: string;
  review_status: string;
  admin_note: string;
  created_at: string;
};

type OrderDetails = {
  id: string;
  order_number: string;
  payment_reference: string;
  currency: string;
  total_amount: number;
  payment_status: string;
  order_status: string;
  bank_details: {
    bank_name: string;
    account_name: string;
    account_number: string;
  };
  items: OrderItem[];
  payment_proofs: PaymentProof[];
};

function formatMoney(amount: number, currency = "NGN") {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function OrderDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const orderID = params?.id;

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  async function loadOrder() {
    if (!orderID) return;
    setError("");
    try {
      setLoading(true);
      const data = await api.get<OrderDetails>(`/orders/${orderID}`);
      setOrder(data);
    } catch (err) {
      const message = (err as Error).message || "Failed to load order";
      if (message.toLowerCase().includes("401")) {
        router.replace(`/login?next=/orders/${orderID}`);
        return;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderID]);

  async function onUpload(e: FormEvent) {
    e.preventDefault();
    if (!orderID || !selectedFile) return;
    setUploadError("");
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", selectedFile);
      await api.post(`/orders/${orderID}/payment-proof`, form);
      setSelectedFile(null);
      await loadOrder();
    } catch (err) {
      setUploadError((err as Error).message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-gray-600 dark:border-white/10 dark:bg-white/5 dark:text-gray-400">Loading order...</div>;
  }

  if (error || !order) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <div className="text-sm font-semibold text-red-700">{error || "Order not found"}</div>
        <Link href="/my-orders" className="mt-3 inline-block text-sm font-bold text-primary hover:underline">Back to my orders</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">{order.order_number}</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Reference: {order.payment_reference}</p>
        </div>
        <Link href="/my-orders" className="text-sm font-semibold text-primary hover:underline">Back to my orders</Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
            <div className="text-sm font-extrabold text-gray-900 dark:text-white">Order items</div>
            <div className="mt-4 space-y-3">
              {order.items.map((item) => (
                <div key={`${item.product_id}-${item.name}`} className="flex items-center justify-between rounded-xl bg-black/5 px-4 py-3 dark:bg-white/5">
                  <div className="min-w-0 pr-3">
                    <div className="truncate text-sm font-extrabold text-gray-900 dark:text-white">{item.name}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Qty: {item.quantity} · Unit: {formatMoney(item.unit_price, order.currency)}</div>
                  </div>
                  <div className="text-sm font-extrabold text-gray-900 dark:text-white">{formatMoney(item.line_total, order.currency)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
            <div className="text-sm font-extrabold text-gray-900 dark:text-white">Upload payment proof</div>
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">Accepted file types: JPG, PNG, PDF (max 8MB).</p>
            <form onSubmit={onUpload} className="mt-4 space-y-3">
              <input
                type="file"
                accept="image/jpeg,image/png,application/pdf"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-gray-900 dark:border-white/10 dark:bg-black/20 dark:text-white"
              />
              {uploadError ? <div className="text-xs font-semibold text-red-700">{uploadError}</div> : null}
              <button
                type="submit"
                disabled={!selectedFile || uploading}
                className={`rounded-md px-4 py-2.5 text-sm font-extrabold transition ${selectedFile && !uploading ? "bg-accent text-black hover:brightness-105" : "cursor-not-allowed bg-black/10 text-gray-500 dark:bg-white/10 dark:text-gray-400"}`}
              >
                {uploading ? "Uploading..." : "Upload proof"}
              </button>
            </form>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-white/5">
            <div className="text-xs text-gray-600 dark:text-gray-400">Total amount</div>
            <div className="mt-1 text-xl font-extrabold text-gray-900 dark:text-white">{formatMoney(order.total_amount, order.currency)}</div>
            <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">Payment status: <span className="font-bold text-gray-900 dark:text-white">{order.payment_status}</span></div>
            <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">Order status: <span className="font-bold text-gray-900 dark:text-white">{order.order_status}</span></div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-white/5">
            <div className="text-sm font-extrabold text-gray-900 dark:text-white">Bank details</div>
            <div className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <div><span className="font-bold">Bank:</span> {order.bank_details.bank_name}</div>
              <div><span className="font-bold">Account Name:</span> {order.bank_details.account_name}</div>
              <div><span className="font-bold">Account Number:</span> {order.bank_details.account_number}</div>
              <div><span className="font-bold">Reference:</span> {order.payment_reference}</div>
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-white/5">
            <div className="text-sm font-extrabold text-gray-900 dark:text-white">Uploaded proofs</div>
            <div className="mt-3 space-y-2">
              {order.payment_proofs.length === 0 ? (
                <div className="text-xs text-gray-600 dark:text-gray-400">No proof uploaded yet.</div>
              ) : (
                order.payment_proofs.map((proof) => (
                  <a key={proof.id} href={`${process.env.NEXT_PUBLIC_API_URL || "https://rhovic-emporium-backend-production.up.railway.app"}/orders/${order.id}/payment-proofs/${proof.id}`} target="_blank" rel="noreferrer" className="block rounded-xl border border-black/10 px-3 py-2 text-xs transition hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5">
                    <div className="font-bold text-gray-900 dark:text-white">{proof.review_status}</div>
                    <div className="mt-1 text-gray-600 dark:text-gray-400">{proof.file_type}</div>
                  </a>
                ))
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
