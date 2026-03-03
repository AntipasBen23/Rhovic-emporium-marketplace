"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function VendorRegisterPage() {
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setToast("");
    setLoading(true);

    if (!email.trim() || !password.trim() || !businessName.trim()) {
      setToast("Business name, email, and password are required.");
      setLoading(false);
      return;
    }

    try {
      await api.post("/auth/register", {
        email,
        password,
        role: "vendor",
        businessName,
        phone,
        bankName,
        accountNumber,
        description,
      });

      setToast("Registration successful! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setToast(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 lg:max-w-4xl lg:mx-auto">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
            Vendor Registration
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Submit your details. Real-time listing after registration.
          </p>
        </div>
        <Link
          href="/login"
          className="text-sm font-semibold text-primary hover:underline"
        >
          ← Back
        </Link>
      </div>

      {toast && (
        <div className={`rounded-2xl border p-4 text-sm ${toast.includes("successful") ? "border-green-200 bg-green-50 text-green-800" : "border-black/10 bg-black/5 text-gray-800"}`}>
          <span className="font-extrabold text-primary">RHOVIC:</span> {toast}
        </div>
      )}

      <form
        onSubmit={onSubmit}
        className="space-y-6 rounded-2xl border border-black/10 bg-white p-6"
      >
        <div className="space-y-3">
          <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
            Account Credentials
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address *"
              type="email"
              required
              className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black/20 focus:shadow-[0_0_0_3px_rgba(18,77,52,0.12)]"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password *"
              type="password"
              required
              className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black/20 focus:shadow-[0_0_0_3px_rgba(18,77,52,0.12)]"
            />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
            Business Information
          </h2>

          <div className="grid gap-3 sm:grid-cols-2">
            <input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Business Name *"
              required
              className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black/20 focus:shadow-[0_0_0_3px_rgba(18,77,52,0.12)]"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
              className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black/20 focus:shadow-[0_0_0_3px_rgba(18,77,52,0.12)]"
            />
          </div>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short business description (optional)"
            className="mt-2 min-h-[100px] w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black/20 focus:shadow-[0_0_0_3px_rgba(18,77,52,0.12)]"
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
            Payout Information
          </h2>

          <div className="grid gap-3 sm:grid-cols-2">
            <input
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="Bank name"
              className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black/20 focus:shadow-[0_0_0_3px_rgba(18,77,52,0.12)]"
            />
            <input
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Account number"
              className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black/20 focus:shadow-[0_0_0_3px_rgba(18,77,52,0.12)]"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={loading}
            className="btn-accent w-full sm:w-auto disabled:opacity-50"
          >
            {loading ? "Registering..." : "Submit registration"}
          </button>
          <Link
            href="/login"
            className="w-full rounded-md border border-black/10 px-6 py-3 text-center text-sm font-extrabold text-gray-900 transition hover:bg-black/5 sm:w-auto"
          >
            Already have an account? Log in
          </Link>
        </div>
      </form>
    </div>
  );
}