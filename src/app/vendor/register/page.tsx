"use client";

import Link from "next/link";
import { useState } from "react";

export default function VendorRegisterPage() {
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [description, setDescription] = useState("");
  const [toast, setToast] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (
      !businessName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !bankName.trim() ||
      !accountNumber.trim()
    ) {
      setToast("Please complete all required fields.");
      return;
    }

    // MVP placeholder
    setToast(
      "Registration submitted. Awaiting admin approval (demo mode)."
    );

    setBusinessName("");
    setEmail("");
    setPhone("");
    setBankName("");
    setAccountNumber("");
    setDescription("");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
            Vendor Registration
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Submit your details. Admin approval is required before listing products.
          </p>
        </div>
        <Link
          href="/vendor"
          className="text-sm font-semibold text-primary hover:underline"
        >
          ← Back
        </Link>
      </div>

      {toast && (
        <div className="rounded-2xl border border-black/10 bg-black/5 p-4 text-sm text-gray-800">
          <span className="font-extrabold text-primary">RHOVIC:</span> {toast}
        </div>
      )}

      <form
        onSubmit={onSubmit}
        className="space-y-6 rounded-2xl border border-black/10 bg-white p-6"
      >
        {/* Business Info */}
        <div className="space-y-3">
          <h2 className="text-sm font-extrabold text-gray-900">
            Business Information
          </h2>

          <div className="grid gap-3 sm:grid-cols-2">
            <input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Business name *"
              className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black/20 focus:shadow-[0_0_0_3px_rgba(18,77,52,0.12)]"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Business email *"
              type="email"
              className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black/20 focus:shadow-[0_0_0_3px_rgba(18,77,52,0.12)]"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number *"
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

        {/* Bank Details */}
        <div className="space-y-3">
          <h2 className="text-sm font-extrabold text-gray-900">
            Payout Information
          </h2>

          <div className="grid gap-3 sm:grid-cols-2">
            <input
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="Bank name *"
              className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black/20 focus:shadow-[0_0_0_3px_rgba(18,77,52,0.12)]"
            />
            <input
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Account number *"
              className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black/20 focus:shadow-[0_0_0_3px_rgba(18,77,52,0.12)]"
            />
          </div>
        </div>

        <div className="rounded-xl bg-black/5 p-4 text-xs text-gray-700">
          Vendor accounts are subject to admin review. You cannot publish products
          until approval.
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="submit" className="btn-accent w-full sm:w-auto">
            Submit registration
          </button>
          <Link
            href="/pricing"
            className="w-full rounded-md border border-black/10 px-6 py-3 text-center text-sm font-extrabold text-gray-900 transition hover:bg-black/5 sm:w-auto"
          >
            View pricing plans
          </Link>
        </div>
      </form>
    </div>
  );
}