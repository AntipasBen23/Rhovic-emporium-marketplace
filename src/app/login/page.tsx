"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post<{ access_token: string; refresh_token: string }>(
        "/auth/login",
        { email, password }
      );

      const payload = JSON.parse(atob(res.access_token.split(".")[1]));
      setAuth(res.access_token, payload.role);

      const next = new URLSearchParams(window.location.search).get("next");
      if (next) {
        router.push(next);
      } else if (payload.role === "vendor") {
        router.push("/vendor");
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      setError((err as { message?: string })?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6 pt-10">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Welcome back
        </h1>
        <p className="text-sm text-gray-600">
          Log in to your RHOVIC account
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-black/10 bg-white p-6">
        <div className="space-y-1">
          <label className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
            Email Address
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            type="email"
            required
            className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black/20 focus:shadow-[0_0_0_3px_rgba(18,77,52,0.12)]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
            Password
          </label>
          <div className="relative">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              type={showPassword ? "text" : "password"}
              required
              className="w-full rounded-xl border border-black/10 px-4 py-3 pr-20 text-sm outline-none transition focus:border-black/20 focus:shadow-[0_0_0_3px_rgba(18,77,52,0.12)]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg border border-black/10 px-3 py-1.5 text-xs font-bold text-gray-700"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div className="pt-1 text-right">
            <Link href="/forgot-password" className="text-xs font-bold text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-4 text-sm font-extrabold disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

        <div className="text-center text-xs text-gray-600">
          Don't have an account?{" "}
          <Link href="/signup" className="font-extrabold text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
}
