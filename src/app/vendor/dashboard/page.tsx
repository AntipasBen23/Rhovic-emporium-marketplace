"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import type { Category } from "@/lib/catalog";

type Tab = "Products" | "Orders" | "Payouts";

type Product = {
  id: string;
  category_id?: string | null;
  name: string;
  price: number;
  compare_at_price?: number | null;
  pricing_unit?: string;
  status: string;
  stock_quantity: number | string;
  image_url?: string | null;
  description?: string;
};

type VendorOrder = {
  id: string;
  order_id: string;
  vendor_order_number: string;
  subtotal_amount: number;
  commission_amount: number;
  vendor_net_amount: number;
  fulfillment_status: string;
  payout_status: string;
  payment_status: string;
  payment_reference: string;
  created_at: string;
};

function formatNGN(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function VendorDashboardPage() {
  const [tab, setTab] = useState<Tab>("Products");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [vendorOrders, setVendorOrders] = useState<VendorOrder[]>([]);

  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.role);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  // Form state
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [pricingUnit, setPricingUnit] = useState("unit");
  const [stock, setStock] = useState("");
  const [status, setStatus] = useState("published");
  const [desc, setDesc] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (token || role === "vendor") fetchData();
  }, [token, role]);

  async function fetchData() {
    try {
      setLoading(true);
      setOrdersLoading(true);
      const [prodData, categoriesRes, vendorOrdersRes] = await Promise.all([
        api.get<Product[]>("/vendor/products"),
        api.get<{ items: Category[] }>("/categories"),
        api.get<{ items: VendorOrder[] }>("/vendor/orders?limit=50"),
      ]);
      setProducts(Array.isArray(prodData) ? prodData : []);
      setCategories(Array.isArray(categoriesRes?.items) ? categoriesRes.items : []);
      setVendorOrders(Array.isArray(vendorOrdersRes?.items) ? vendorOrdersRes.items : []);
    } catch (err: unknown) {
      const msg = String((err as { message?: string })?.message || "").toLowerCase();
      if (msg.includes("status 401")) {
        logout();
        router.replace("/login?next=/vendor/dashboard");
        return;
      }
      if (msg.includes("forbidden")) {
        router.replace("/vendor");
      }
    } finally {
      setLoading(false);
      setOrdersLoading(false);
    }
  }

  const stats = useMemo(() => {
    const published = products.filter((p) => p.status === "published").length;
    const draft = products.filter((p) => p.status === "draft").length;
    const queuedPayouts = vendorOrders.filter((o) => o.payout_status === "queued").length;
    return { published, draft, queuedPayouts };
  }, [products, vendorOrders]);

  function resetForm() {
    setName("");
    setCategoryId("");
    setPrice("");
    setCompareAtPrice("");
    setPricingUnit("unit");
    setStock("");
    setStatus("published");
    setDesc("");
    setImageUrl("");
    setEditingId(null);
    setSubmitError("");
  }

  function openAdd() {
    resetForm();
    setShowModal(true);
  }

  function openEdit(p: Product) {
    setEditingId(p.id);
    setName(p.name || "");
    setCategoryId(p.category_id || "");
    setPrice(String(p.price || ""));
    setCompareAtPrice(p.compare_at_price ? String(p.compare_at_price) : "");
    setPricingUnit(p.pricing_unit || "unit");
    setStock(String(p.stock_quantity ?? ""));
    setStatus(p.status || "published");
    setDesc(p.description || "");
    setImageUrl(p.image_url || "");
    setSubmitError("");
    setShowModal(true);
  }

  async function handleUpload() {
    // @ts-expect-error cloudinary script global
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "rhovic-marketplace",
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default",
        sources: ["local", "url", "camera"],
        multiple: false,
        cropping: true,
      },
      (error: unknown, result: { event?: string; info?: { secure_url?: string } }) => {
        if (!error && result?.event === "success" && result.info?.secure_url) {
          setImageUrl(result.info.secure_url);
          widget.close();
        }
      }
    );
    widget.open();
  }

  async function submitProduct(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);
    try {
      const payload = {
        category_id: categoryId || null,
        name,
        price: parseInt(price, 10),
        compare_at_price: compareAtPrice ? parseInt(compareAtPrice, 10) : null,
        pricing_unit: pricingUnit || "unit",
        stock_quantity: stock,
        status,
        description: desc,
        image_url: imageUrl || null,
      };

      if (editingId) {
        await api.patch(`/vendor/products/${editingId}`, payload);
      } else {
        await api.post("/vendor/products", payload);
      }

      setShowModal(false);
      resetForm();
      await fetchData();
    } catch (err: unknown) {
      const msg = String((err as { message?: string })?.message || "");
      if (msg.toLowerCase().includes("status 401")) {
        logout();
        router.replace("/login?next=/vendor/dashboard");
        return;
      }
      setSubmitError(msg || "Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function deleteProduct(id: string) {
    if (!confirm("Delete this product permanently?")) return;
    try {
      await api.delete(`/vendor/products/${id}`);
      await fetchData();
    } catch (err: unknown) {
      alert(String((err as { message?: string })?.message || "Failed to delete product"));
    }
  }

  if (!token && role !== "vendor") {
    return (
      <div className="flex flex-col items-center justify-center pt-20 space-y-4">
        <h2 className="text-xl font-extrabold">Please log in as a vendor</h2>
        <Link href="/login" className="btn-primary px-8">Log In</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">Vendor Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Manage your products with full control.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/vendor" className="rounded-md border border-black/10 px-4 py-2 text-sm font-extrabold text-gray-900 transition hover:bg-black/5 dark:border-white/10 dark:text-gray-100 dark:hover:bg-white/5">
            Vendor home
          </Link>
          <Link href="/shop" className="rounded-md bg-primary px-4 py-2 text-sm font-extrabold text-white transition hover:brightness-105">
            View marketplace
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-white/5">
          <div className="text-xs text-gray-600 dark:text-gray-400">Published products</div>
          <div className="mt-2 text-2xl font-extrabold text-gray-900 dark:text-white">{stats.published}</div>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-white/5">
          <div className="text-xs text-gray-600 dark:text-gray-400">Draft products</div>
          <div className="mt-2 text-2xl font-extrabold text-gray-900 dark:text-white">{stats.draft}</div>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-white/5">
          <div className="text-xs text-gray-600 dark:text-gray-400">Total products</div>
          <div className="mt-2 text-2xl font-extrabold text-gray-900 dark:text-white">{products.length}</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["Products", "Orders", "Payouts"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={[
              "rounded-full px-4 py-2 text-sm font-extrabold transition border",
              tab === t
                ? "border-transparent bg-primary text-white"
                : "border-black/10 bg-white text-gray-900 hover:bg-black/5 dark:border-white/10 dark:bg-white/5 dark:text-gray-100 dark:hover:bg-white/10",
            ].join(" ")}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Products" ? (
        <section className="overflow-hidden rounded-2xl border border-black/10 bg-white dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center justify-between bg-black/5 px-5 py-4 dark:bg-white/5">
            <div className="text-sm font-extrabold text-gray-900 dark:text-white">Your products</div>
            <button onClick={openAdd} className="rounded-md bg-accent px-4 py-2 text-sm font-extrabold text-black transition hover:brightness-105">
              Add product
            </button>
          </div>

          <div className="divide-y divide-black/10 dark:divide-white/10">
            {loading ? (
              <div className="p-10 text-center text-sm text-gray-600 dark:text-gray-400">Loading catalog...</div>
            ) : products.length === 0 ? (
              <div className="p-10 text-center text-sm text-gray-600 dark:text-gray-400">No products found. Start listing!</div>
            ) : (
              products.map((p) => {
                const hasDiscount = !!p.compare_at_price && p.compare_at_price > p.price;
                const pct = hasDiscount ? Math.round((((p.compare_at_price || 0) - p.price) / (p.compare_at_price || 1)) * 100) : 0;
                return (
                  <div key={p.id} className="p-5">
                    <div className="flex gap-4 items-start">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name} className="w-16 h-16 rounded-xl object-cover border border-black/5" />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-black/5 flex items-center justify-center text-[10px] text-gray-400 font-extrabold uppercase">No Image</div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="truncate text-sm font-extrabold text-gray-900 dark:text-white">{p.name}</div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                          <span>{formatNGN(p.price)}</span>
                          {hasDiscount ? (
                            <>
                              <span className="line-through text-gray-400">{formatNGN(p.compare_at_price || 0)}</span>
                              <span className="rounded bg-accent/20 px-1.5 py-0.5 font-bold text-orange-700">-{pct}%</span>
                            </>
                          ) : null}
                          <span>• Stock: <span className="font-semibold text-gray-900 dark:text-gray-100">{p.stock_quantity}</span></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-tighter ${p.status === "published" ? "bg-primary text-white" : "bg-black text-white"}`}>
                          {p.status}
                        </span>
                        <button onClick={() => openEdit(p)} className="rounded-md border border-black/10 px-3 py-2 text-xs font-extrabold text-gray-900 transition hover:bg-black/5 dark:border-white/10 dark:text-white dark:hover:bg-white/5">
                          Edit
                        </button>
                        <button onClick={() => deleteProduct(p.id)} className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-extrabold text-red-700 transition hover:bg-red-100">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      ) : null}

      {tab === "Orders" ? (
        <section className="overflow-hidden rounded-2xl border border-black/10 bg-white dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center justify-between bg-black/5 px-5 py-4 dark:bg-white/5">
            <div className="text-sm font-extrabold text-gray-900 dark:text-white">Vendor orders</div>
          </div>
          <div className="divide-y divide-black/10 dark:divide-white/10">
            {ordersLoading ? (
              <div className="p-8 text-sm text-gray-600 dark:text-gray-400">Loading orders...</div>
            ) : vendorOrders.length === 0 ? (
              <div className="p-8 text-sm text-gray-600 dark:text-gray-400">No vendor orders yet.</div>
            ) : (
              vendorOrders.map((order) => (
                <div key={order.id} className="p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="text-sm font-extrabold text-gray-900 dark:text-white">{order.vendor_order_number}</div>
                      <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">Ref: {order.payment_reference}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-extrabold text-gray-900 dark:text-white">{formatNGN(order.vendor_net_amount)}</div>
                      <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">Net payable</div>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-black/10 px-3 py-1 text-[11px] font-bold text-gray-700 dark:bg-white/10 dark:text-gray-200">Fulfillment: {order.fulfillment_status}</span>
                    <span className="rounded-full bg-black/10 px-3 py-1 text-[11px] font-bold text-gray-700 dark:bg-white/10 dark:text-gray-200">Payout: {order.payout_status}</span>
                    <span className="rounded-full bg-black/10 px-3 py-1 text-[11px] font-bold text-gray-700 dark:bg-white/10 dark:text-gray-200">Payment: {order.payment_status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      ) : null}

      {tab === "Payouts" ? (
        <section className="rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
          <div className="text-sm font-extrabold text-gray-900 dark:text-white">Payout summary</div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-black/5 p-4 dark:bg-white/5">
              <div className="text-xs text-gray-600 dark:text-gray-400">Queued payouts</div>
              <div className="mt-1 text-xl font-extrabold text-gray-900 dark:text-white">{stats.queuedPayouts}</div>
            </div>
            <div className="rounded-xl bg-black/5 p-4 dark:bg-white/5">
              <div className="text-xs text-gray-600 dark:text-gray-400">Total net from orders</div>
              <div className="mt-1 text-xl font-extrabold text-gray-900 dark:text-white">
                {formatNGN(vendorOrders.reduce((acc, o) => acc + Number(o.vendor_net_amount || 0), 0))}
              </div>
            </div>
            <div className="rounded-xl bg-black/5 p-4 dark:bg-white/5">
              <div className="text-xs text-gray-600 dark:text-gray-400">Paid payouts</div>
              <div className="mt-1 text-xl font-extrabold text-gray-900 dark:text-white">{vendorOrders.filter((o) => o.payout_status === "paid").length}</div>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-600 dark:text-gray-400">
            Detailed payout disbursement is managed by admin after payment approval.
          </p>
        </section>
      ) : null}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 dark:bg-[#0c1612] dark:border dark:border-white/10 max-h-[88vh] flex flex-col">
            <div className="bg-primary p-6 text-white text-center">
              <h2 className="text-xl font-extrabold uppercase tracking-tight">{editingId ? "Edit Product" : "Add New Product"}</h2>
              <p className="text-xs text-white/70 mt-1 uppercase font-bold tracking-widest">Full product control</p>
            </div>

            <form onSubmit={submitProduct} className="p-6 space-y-4 overflow-y-auto">
              {submitError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{submitError}</div>
              ) : null}

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">Product Name</label>
                <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:border-primary outline-none dark:bg-black/20 dark:border-white/10 dark:text-white" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">Category</label>
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:border-primary outline-none dark:bg-black/20 dark:border-white/10 dark:text-white">
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">Price (NGN)</label>
                  <input required type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:border-primary outline-none dark:bg-black/20 dark:border-white/10 dark:text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">Old Price (NGN)</label>
                  <input type="number" value={compareAtPrice} onChange={(e) => setCompareAtPrice(e.target.value)} className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:border-primary outline-none dark:bg-black/20 dark:border-white/10 dark:text-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">Stock</label>
                  <input required value={stock} onChange={(e) => setStock(e.target.value)} className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:border-primary outline-none dark:bg-black/20 dark:border-white/10 dark:text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">Pricing Unit</label>
                  <input value={pricingUnit} onChange={(e) => setPricingUnit(e.target.value)} className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:border-primary outline-none dark:bg-black/20 dark:border-white/10 dark:text-white" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:border-primary outline-none dark:bg-black/20 dark:border-white/10 dark:text-white">
                  <option value="published">published</option>
                  <option value="draft">draft</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">Description</label>
                <textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:border-primary outline-none min-h-[90px] dark:bg-black/20 dark:border-white/10 dark:text-white" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 block">Product Image</label>
                {imageUrl ? (
                  <div className="relative group">
                    <img src={imageUrl} alt="product preview" className="w-full h-36 object-cover rounded-2xl border" />
                    <button type="button" onClick={() => setImageUrl("")} className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition">
                      ×
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={handleUpload} className="w-full border-2 border-dashed border-black/10 rounded-2xl py-8 flex flex-col items-center justify-center hover:bg-black/5 transition group dark:border-white/10 dark:hover:bg-white/5">
                    <div className="text-2xl group-hover:scale-110 transition">📷</div>
                    <div className="text-xs font-extrabold mt-1 text-gray-500 dark:text-gray-400">UPLOAD TO CLOUDINARY</div>
                  </button>
                )}
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 rounded-xl border border-black/10 py-3 text-sm font-extrabold uppercase hover:bg-black/5 transition dark:border-white/10 dark:text-white dark:hover:bg-white/5">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-1 rounded-xl bg-accent py-3 text-sm font-extrabold uppercase hover:brightness-105 transition disabled:opacity-50">
                  {isSubmitting ? "Saving..." : editingId ? "Update Product" : "List Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
