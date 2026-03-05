"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

type ForgotPasswordResponse = {
  ok: boolean;
  reset_token?: string;
};

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await api.post<ForgotPasswordResponse>("/auth/forgot-password", { email });
      if (res?.reset_token) {
        router.push(`/reset-password?token=${encodeURIComponent(res.reset_token)}`);
        return;
      }
      setMessage("If the account exists, a reset link has been prepared.");
    } catch (err: unknown) {
      setError((err as { message?: string })?.message || "Request failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6 pt-10">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Forgot Password</h1>
        <p className="text-sm text-gray-600">Enter your email to reset your password.</p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>
      ) : null}
      {message ? (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-primary">{message}</div>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-black/10 bg-white p-6">
        <div className="space-y-1">
          <label className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">Email Address</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black/20 focus:shadow-[0_0_0_3px_rgba(18,77,52,0.12)] dark:bg-black/20 dark:text-white dark:placeholder:text-gray-500"
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-sm font-extrabold disabled:opacity-50">
          {loading ? "Preparing reset..." : "Continue"}
        </button>

        <div className="text-center text-xs text-gray-600">
          Remembered your password?{" "}
          <Link href="/login" className="font-extrabold text-primary hover:underline">
            Log in
          </Link>
        </div>
      </form>
    </div>
  );
}
