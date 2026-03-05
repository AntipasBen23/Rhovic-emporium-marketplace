"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register", { email, password, role: "buyer" });
      const next = searchParams.get("next") || "/";
      router.push(`/login?next=${encodeURIComponent(next)}`);
    } catch (err: any) {
      setError(err.message || "Sign up failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6 pt-10">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Create account</h1>
        <p className="text-sm text-gray-600">Sign up, then continue your vendor application.</p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-black/10 bg-white p-6">
        <div className="space-y-1">
          <label className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">Email Address</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black/20 focus:shadow-[0_0_0_3px_rgba(18,77,52,0.12)]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black/20 focus:shadow-[0_0_0_3px_rgba(18,77,52,0.12)]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">Confirm Password</label>
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            required
            className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black/20 focus:shadow-[0_0_0_3px_rgba(18,77,52,0.12)]"
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-sm font-extrabold disabled:opacity-50">
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <div className="text-center text-xs text-gray-600">
          Already have an account?{" "}
          <Link href={`/login${searchParams.get("next") ? `?next=${encodeURIComponent(searchParams.get("next") || "")}` : ""}`} className="font-extrabold text-primary hover:underline">
            Log in
          </Link>
        </div>
      </form>
    </div>
  );
}
