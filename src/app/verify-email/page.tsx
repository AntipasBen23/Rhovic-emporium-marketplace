"use client";

import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import TurnstileWidget from "@/components/auth/TurnstileWidget";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = useMemo(() => searchParams.get("email") || "", [searchParams]);
  const next = useMemo(() => searchParams.get("next") || "/", [searchParams]);
  const [code, setCode] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  async function onVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await api.post("/auth/verify-email", { email, code });
      setSuccess("Email verified successfully. Redirecting to login...");
      setTimeout(() => {
        router.push(`/login?next=${encodeURIComponent(next)}`);
      }, 1200);
    } catch (err: unknown) {
      setError((err as { message?: string })?.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  }

  async function onResend() {
    setError("");
    setSuccess("");
    setResending(true);
    try {
      await api.post("/auth/resend-verification", { email, captcha_token: captchaToken });
      setSuccess("A new verification code has been sent. It expires in 10 minutes.");
    } catch (err: unknown) {
      setError((err as { message?: string })?.message || "Could not resend verification code.");
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6 pt-10">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Verify your email</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          We sent a 6-digit code to <span className="font-bold text-gray-900 dark:text-white">{email || "your email"}</span>. It expires in 10 minutes.
        </p>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-500">
          Your verification code may take a few moments to arrive. If you do not see it soon, use the resend button below.
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {success}
        </div>
      ) : null}

      <form onSubmit={onVerify} className="space-y-4 rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-[#0f1814]">
        <div className="space-y-1">
          <label className="text-xs font-extrabold uppercase tracking-wider text-gray-900 dark:text-gray-100">Verification code</label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="Enter 6-digit code"
            required
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-center text-lg font-bold tracking-[0.35em] text-gray-900 outline-none transition placeholder:tracking-normal placeholder:text-gray-400 focus:border-black/20 focus:shadow-[0_0_0_3px_rgba(18,77,52,0.12)] dark:bg-black/20 dark:text-white dark:placeholder:text-gray-500"
          />
        </div>

        <TurnstileWidget onToken={setCaptchaToken} />

        <button type="submit" disabled={loading || !email || code.length !== 6} className="btn-primary w-full py-4 text-sm font-extrabold disabled:opacity-50">
          {loading ? "Verifying..." : "Verify Email"}
        </button>

        <button
          type="button"
          onClick={onResend}
          disabled={resending || !email}
          className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm font-extrabold text-gray-900 transition hover:bg-black/5 disabled:opacity-50 dark:border-white/10 dark:text-white dark:hover:bg-white/10"
        >
          {resending ? "Sending new code..." : "Resend code"}
        </button>

        <div className="text-center text-xs text-gray-600 dark:text-gray-400">
          Wrong email?{" "}
          <Link href="/signup" className="font-extrabold text-primary hover:underline">
            Sign up again
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md pt-10 text-sm text-gray-600 dark:text-gray-400">Loading verification...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
