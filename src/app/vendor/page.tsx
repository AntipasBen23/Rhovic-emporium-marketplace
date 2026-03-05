"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";

type VendorApplication = {
  has_application: boolean;
  status?: "pending" | "approved" | "rejected" | "suspended";
  business_name?: string;
};

export default function VendorEntryPage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [application, setApplication] = useState<VendorApplication | null>(null);

  useEffect(() => {
    if (!token) {
      router.replace("/signup?next=/vendor/register");
      return;
    }

    async function loadApplication() {
      try {
        setLoading(true);
        const data = await api.get<VendorApplication>("/vendor/application");
        if (data?.has_application && data.status === "approved") {
          router.replace("/vendor/dashboard");
          return;
        }
        setApplication(data);
      } catch (err: any) {
        setError(err.message || "Failed to load vendor status.");
      } finally {
        setLoading(false);
      }
    }

    loadApplication();
  }, [token, router]);

  if (loading) {
    return <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-gray-600 dark:border-white/10 dark:bg-white/5 dark:text-gray-400">Checking vendor status...</div>;
  }

  if (error) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>;
  }

  if (application?.has_application && application.status === "pending") {
    return (
      <div className="space-y-6">
      <section className="rounded-2xl border border-yellow-200 bg-yellow-50 p-6">
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-900">Application Submitted</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-800">
            Your vendor application is successful and currently awaiting admin approval.
          </p>
          <p className="mt-1 text-sm text-gray-700 dark:text-gray-800">
            Shop name: <span className="font-bold">{application.business_name || "N/A"}</span>
          </p>
          <div className="mt-4">
            <span className="inline-flex rounded-full bg-yellow-200 px-3 py-1 text-xs font-bold text-yellow-800">Status: pending</span>
          </div>
        </section>
      </div>
    );
  }

  if (application?.has_application && application.status === "rejected") {
    return (
      <div className="space-y-6">
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h1 className="text-2xl font-extrabold text-gray-900">Application Rejected</h1>
          <p className="mt-2 text-sm text-gray-700">Your previous vendor application was rejected. You can re-apply below.</p>
          <div className="mt-4">
            <Link href="/vendor/register" className="btn-primary">Re-apply as Vendor</Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-2xl border border-black/10 bg-white p-8 dark:border-white/10 dark:bg-white/5">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Sell on RHOVIC Marketplace</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Complete your vendor application to list products, manage stock, and receive payouts.
        </p>
        <div className="mt-6">
          <Link href="/vendor/register" className="btn-primary">Start Vendor Application</Link>
        </div>
      </section>
    </div>
  );
}
