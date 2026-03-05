"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

function checkPasswordRules(value: string) {
  return {
    uppercase: /[A-Z]/.test(value),
    lowercase: /[a-z]/.test(value),
    number: /[0-9]/.test(value),
    special: /[^A-Za-z0-9\s]/.test(value),
    length: value.length >= 8,
  };
}

function RuleItem({ ok, text }: { ok: boolean; text: string }) {
  return (
    <li className={`flex items-center gap-2 text-sm ${ok ? "text-primary" : "text-gray-600"}`}>
      <span className={`h-4 w-4 rounded-full border ${ok ? "border-primary bg-primary/10" : "border-gray-400"}`} />
      <span>{text}</span>
    </li>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const rules = checkPasswordRules(password);
  const passwordValid = Object.values(rules).every(Boolean);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!passwordValid) {
      setError("Password does not meet the required rules.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register", { email, password, role: "buyer" });
      const next = new URLSearchParams(window.location.search).get("next") || "/";
      router.push(`/login?next=${encodeURIComponent(next)}`);
    } catch (err: unknown) {
      setError((err as { message?: string })?.message || "Sign up failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6 pt-10">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Create account</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">Sign up, then continue your vendor application.</p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-[#0f1814]">
        <div className="space-y-1">
          <label className="text-xs font-extrabold text-gray-900 uppercase tracking-wider dark:text-gray-100">Email Address</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black/20 focus:shadow-[0_0_0_3px_rgba(18,77,52,0.12)] dark:bg-black/20 dark:text-white dark:placeholder:text-gray-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-extrabold text-gray-900 uppercase tracking-wider dark:text-gray-100">Password</label>
          <div className="relative">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              required
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 pr-20 text-sm font-semibold text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black/20 focus:shadow-[0_0_0_3px_rgba(18,77,52,0.12)] dark:bg-black/20 dark:text-white dark:placeholder:text-gray-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg border border-black/10 px-3 py-1.5 text-xs font-bold text-gray-700 dark:border-white/10 dark:text-gray-100"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <ul className="space-y-1">
            <RuleItem ok={rules.uppercase} text="Uppercase letter" />
            <RuleItem ok={rules.lowercase} text="Lowercase letter" />
            <RuleItem ok={rules.number} text="Number" />
            <RuleItem ok={rules.special} text="Special character (e.g. !?<>@#$%)" />
            <RuleItem ok={rules.length} text="8 characters or more" />
          </ul>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-extrabold text-gray-900 uppercase tracking-wider dark:text-gray-100">Confirm Password</label>
          <div className="relative">
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type={showConfirmPassword ? "text" : "password"}
              required
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 pr-20 text-sm font-semibold text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black/20 focus:shadow-[0_0_0_3px_rgba(18,77,52,0.12)] dark:bg-black/20 dark:text-white dark:placeholder:text-gray-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg border border-black/10 px-3 py-1.5 text-xs font-bold text-gray-700 dark:border-white/10 dark:text-gray-100"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-sm font-extrabold disabled:opacity-50">
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <div className="text-center text-xs text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="font-extrabold text-primary hover:underline">
            Log in
          </Link>
        </div>
      </form>
    </div>
  );
}
