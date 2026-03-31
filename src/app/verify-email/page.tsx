"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import TurnstileWidget from "@/components/auth/TurnstileWidget";

type VerificationStatusResponse = {
  email?: string;
  verified?: boolean;
  otp_sent_at?: string | null;
  expires_at?: string | null;
};

const RESEND_DELAY_SECONDS = 30;
const SUGGESTION_DELAY_SECONDS = 25;

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
  const [otpSentAt, setOtpSentAt] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [secondsUntilResend, setSecondsUntilResend] = useState(0);
  const [showResendHint, setShowResendHint] = useState(false);
  const formattedExpiryTime = useMemo(
    () => (expiresAt ? new Date(expiresAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""),
    [expiresAt]
  );

  useEffect(() => {
    let mounted = true;
    async function loadStatus() {
      if (!email) return;
      try {
        const res = await api.get<VerificationStatusResponse>(`/auth/verification-status?email=${encodeURIComponent(email)}`);
        if (!mounted) return;
        setOtpSentAt(res.otp_sent_at || null);
        setExpiresAt(res.expires_at || null);
      } catch {
        // Keep the verify flow usable even if status lookup fails.
      }
    }
    loadStatus();
    return () => {
      mounted = false;
    };
  }, [email]);

  useEffect(() => {
    if (!otpSentAt) {
      setSecondsUntilResend(0);
      setShowResendHint(false);
      return;
    }
    const sentAt = otpSentAt;

    function updateTimers() {
      const sentAtMs = new Date(sentAt).getTime();
      const now = Date.now();
      const resendAtMs = sentAtMs + RESEND_DELAY_SECONDS * 1000;
      const hintAtMs = sentAtMs + SUGGESTION_DELAY_SECONDS * 1000;
      setSecondsUntilResend(Math.max(0, Math.ceil((resendAtMs - now) / 1000)));
      setShowResendHint(now >= hintAtMs);
    }

    updateTimers();
    const interval = window.setInterval(updateTimers, 1000);
    return () => window.clearInterval(interval);
  }, [otpSentAt]);

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
      const res = await api.post<VerificationStatusResponse>("/auth/resend-verification", { email, captcha_token: captchaToken });
      setOtpSentAt(res.otp_sent_at || new Date().toISOString());
      setExpiresAt(res.expires_at || null);
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
        {otpSentAt ? (
          <p className="text-xs font-medium text-gray-500 dark:text-gray-500">
            Last code issued at {new Date(otpSentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}.
            {formattedExpiryTime ? ` It stays valid until ${formattedExpiryTime}.` : ""}
          </p>
        ) : null}
        {showResendHint && secondsUntilResend === 0 ? (
          <p className="text-xs font-semibold text-primary">
            Still no code? You can request a fresh one now.
          </p>
        ) : null}
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
          disabled={resending || !email || secondsUntilResend > 0}
          className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm font-extrabold text-gray-900 transition hover:bg-black/5 disabled:opacity-50 dark:border-white/10 dark:text-white dark:hover:bg-white/10"
        >
          {resending ? "Sending new code..." : secondsUntilResend > 0 ? `Resend code in ${secondsUntilResend}s` : "Resend code"}
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
