"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";

type Tab = "Products" | "Orders" | "Payouts";

type Product = {
  id: string;
  name: string;
  price: number;
  status: string;
  stock_quantity: number | string;
  image_url?: string;
  description?: string;
};

type Order = {
  id: string;
  buyer: string;
  total: number;
  status: string;
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
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  const [submitError, setSubmitError] = useState("");

  // Form State
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  async function fetchData() {
    try {
      setLoading(true);
      const prodData = await api.get<Product[]>("/vendor/products");
      setProducts(Array.isArray(prodData) ? prodData : []);

      // Orders placeholder for now as backend might need more wiring
      setOrders([]);
    } catch (err: any) {
      const msg = String(err?.message || "").toLowerCase();
      if (msg.includes("status 401")) {
        logout();
        router.replace("/login?next=/vendor/dashboard");
        return;
      }
      if (msg.includes("forbidden")) {
        router.replace("/vendor");
        return;
      }
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  const stats = useMemo(() => {
    const published = products.filter((p) => p.status === "published").length;
    const draft = products.filter((p) => p.status === "draft").length;
    return { published, draft, pendingOrders: 0 };
  }, [products]);

  const handleUpload = () => {
    // @ts-ignore
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "rhovic-marketplace",
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default",
        sources: ["local", "url", "camera"],
        multiple: false,
        cropping: true,
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          setNewImageUrl(result.info.secure_url);
          widget.close();
        }
      }
    );
    widget.open();
  };

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);
    try {
      await api.post("/vendor/products", {
        name: newName,
        price: parseInt(newPrice),
        stock_quantity: newStock,
        description: newDesc,
        image_url: newImageUrl || null,
        status: "published",
        pricing_unit: "unit"
      });
      setShowAddModal(false);
      resetForm();
      fetchData();
    } catch (err: any) {
      const msg = String(err?.message || "");
      if (msg.toLowerCase().includes("status 401")) {
        logout();
        router.replace("/login?next=/vendor/dashboard");
        return;
      }
      setSubmitError(msg || "Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  }

  function resetForm() {
    setNewName("");
    setNewPrice("");
    setNewStock("");
    setNewDesc("");
    setNewImageUrl("");
  }

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center pt-20 space-y-4">
        <h2 className="text-xl font-extrabold">Please log in as a vendor</h2>
        <Link href="/login" className="btn-primary px-8">Log In</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Vendor Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Real-time multi-vendor infrastructure.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/vendor"
            className="rounded-md border border-black/10 px-4 py-2 text-sm font-extrabold text-gray-900 transition hover:bg-black/5 dark:border-white/10 dark:text-gray-100 dark:hover:bg-white/5"
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
        <div className="rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-white/5">
          <div className="text-xs text-gray-600 dark:text-gray-400">Published products</div>
          <div className="mt-2 text-2xl font-extrabold text-gray-900 dark:text-white">
            {stats.published}
          </div>
          <div className="mt-3 h-1 rounded-full bg-primary/20">
            <div className="h-1 w-2/3 rounded-full bg-primary" />
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-white/5">
          <div className="text-xs text-gray-600 dark:text-gray-400">Draft products</div>
          <div className="mt-2 text-2xl font-extrabold text-gray-900 dark:text-white">
            {stats.draft}
          </div>
          <div className="mt-3 h-1 rounded-full bg-primary/20">
            <div className="h-1 w-1/3 rounded-full bg-primary" />
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-white/5">
          <div className="text-xs text-gray-600 dark:text-gray-400">Sales Balance</div>
          <div className="mt-2 text-2xl font-extrabold text-gray-900 dark:text-white">
            {formatNGN(0)}
          </div>
          <div className="mt-3 h-1 rounded-full bg-primary/20">
            <div className="h-1 w-0 rounded-full bg-primary" />
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
                  : "border-black/10 bg-white text-gray-900 hover:bg-black/5 dark:border-white/10 dark:bg-white/5 dark:text-gray-100 dark:hover:bg-white/10",
              ].join(" ")}
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {tab === "Products" ? (
        <section className="overflow-hidden rounded-2xl border border-black/10 bg-white dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center justify-between bg-black/5 px-5 py-4 dark:bg-white/5">
            <div className="text-sm font-extrabold text-gray-900 dark:text-white">Your products</div>
            <button
              onClick={() => setShowAddModal(true)}
              className="rounded-md bg-accent px-4 py-2 text-sm font-extrabold text-black transition hover:brightness-105"
            >
              Add product
            </button>
          </div>

          <div className="divide-y divide-black/10 dark:divide-white/10">
            {loading ? (
              <div className="p-10 text-center text-sm text-gray-600 dark:text-gray-400">Loading catalog...</div>
            ) : products.length === 0 ? (
              <div className="p-10 text-center text-sm text-gray-600 dark:text-gray-400">No products found. Start listing!</div>
            ) : (
              products.map((p) => (
                <div key={p.id} className="p-5">
                  <div className="flex gap-4 items-start">
                    {p.image_url ? (
                      <img src={p.image_url} className="w-16 h-16 rounded-xl object-cover border border-black/5" />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-black/5 flex items-center justify-center text-[10px] text-gray-400 font-extrabold uppercase">No Image</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="truncate text-sm font-extrabold text-gray-900 dark:text-white">
                        {p.name}
                      </div>
                      <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                        {formatNGN(p.price)} • Stock:{" "}
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{p.stock_quantity}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-tighter ${p.status === "published"
                          ? "bg-primary text-white"
                          : "bg-black text-white"
                          }`}
                      >
                        {p.status}
                      </span>
                      <button className="rounded-md border border-black/10 px-3 py-2 text-xs font-extrabold text-gray-900 transition hover:bg-black/5 dark:border-white/10 dark:text-white dark:hover:bg-white/5">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="h-[3px] bg-primary" />
        </section>
      ) : null}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 dark:bg-[#0c1612] dark:border dark:border-white/10 max-h-[88vh] flex flex-col">
            <div className="bg-primary p-6 text-white text-center">
              <h2 className="text-xl font-extrabold uppercase tracking-tight">Add New Product</h2>
              <p className="text-xs text-white/70 mt-1 uppercase font-bold tracking-widest">Photographed & Curated</p>
            </div>

            <form onSubmit={handleAddProduct} className="p-6 space-y-4 overflow-y-auto">
              {submitError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
                  {submitError}
                </div>
              )}
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">Product Name</label>
                <input
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:border-primary outline-none dark:bg-black/20 dark:border-white/10 dark:text-white dark:placeholder-gray-500"
                  placeholder="e.g. Ankara Fabric"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">Price (NGN)</label>
                  <input
                    required
                    type="number"
                    value={newPrice}
                    onChange={e => setNewPrice(e.target.value)}
                    className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:border-primary outline-none dark:bg-black/20 dark:border-white/10 dark:text-white dark:placeholder-gray-500"
                    placeholder="8500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">Stock Count</label>
                  <input
                    required
                    value={newStock}
                    onChange={e => setNewStock(e.target.value)}
                    className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:border-primary outline-none dark:bg-black/20 dark:border-white/10 dark:text-white dark:placeholder-gray-500"
                    placeholder="100"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">Description</label>
                <textarea
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:border-primary outline-none min-h-[80px] dark:bg-black/20 dark:border-white/10 dark:text-white dark:placeholder-gray-500"
                  placeholder="Tell buyers about your item..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 block">Product Image</label>
                {newImageUrl ? (
                  <div className="relative group">
                    <img src={newImageUrl} className="w-full h-32 object-cover rounded-2xl border" />
                    <button
                      type="button"
                      onClick={() => setNewImageUrl("")}
                      className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleUpload}
                    className="w-full border-2 border-dashed border-black/10 rounded-2xl py-8 flex flex-col items-center justify-center hover:bg-black/5 transition group dark:border-white/10 dark:hover:bg-white/5"
                  >
                    <div className="text-2xl group-hover:scale-110 transition">📷</div>
                    <div className="text-xs font-extrabold mt-1 text-gray-500 dark:text-gray-400">UPLOAD TO CLOUDINARY</div>
                  </button>
                )}
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 rounded-xl border border-black/10 py-3 text-sm font-extrabold uppercase hover:bg-black/5 transition dark:border-white/10 dark:text-white dark:hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl bg-accent py-3 text-sm font-extrabold uppercase hover:brightness-105 transition disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "List Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
