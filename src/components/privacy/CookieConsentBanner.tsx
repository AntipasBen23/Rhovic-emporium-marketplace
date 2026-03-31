"use client";

import { useEffect, useMemo, useState } from "react";
import { buildConsent, cookieConsentLabel, getCookieConsent, saveCookieConsent } from "@/lib/cookie-consent";

export default function CookieConsentBanner() {
  const [mounted, setMounted] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const consent = useMemo(() => (mounted ? getCookieConsent() : null), [mounted, showBanner, showPreferences]);

  useEffect(() => {
    setMounted(true);
    const saved = getCookieConsent();
    setShowBanner(!saved);
    setAnalyticsEnabled(saved?.analytics ?? true);
  }, []);

  function acceptAll() {
    saveCookieConsent(buildConsent(true));
    setShowBanner(false);
    setShowPreferences(false);
  }

  function acceptEssentialOnly() {
    saveCookieConsent(buildConsent(false));
    setShowBanner(false);
    setShowPreferences(false);
  }

  function savePreferences() {
    saveCookieConsent(buildConsent(analyticsEnabled));
    setShowBanner(false);
    setShowPreferences(false);
  }

  if (!mounted) return null;

  return (
    <>
      {showBanner ? (
        <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 md:px-6 md:pb-6">
          <div className="mx-auto max-w-4xl rounded-3xl border border-black/10 bg-white/95 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.15)] backdrop-blur dark:border-white/10 dark:bg-[rgba(12,20,16,0.96)]">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="space-y-2">
                <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-primary">Cookie Preferences</p>
                <h2 className="text-xl font-extrabold text-gray-950 dark:text-white">We use cookies to keep RHOVIC secure and improve your experience.</h2>
                <p className="max-w-2xl text-sm text-gray-600 dark:text-gray-400">
                  Essential cookies keep login, cart, and session features working. Analytics cookies help us understand visits and improve the storefront.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={() => setShowPreferences(true)} className="rounded-xl border border-black/10 px-5 py-3 text-sm font-extrabold text-gray-900 transition hover:bg-black/5 dark:border-white/10 dark:text-white dark:hover:bg-white/10">
                  Manage preferences
                </button>
                <button type="button" onClick={acceptEssentialOnly} className="rounded-xl border border-black/10 px-5 py-3 text-sm font-extrabold text-gray-900 transition hover:bg-black/5 dark:border-white/10 dark:text-white dark:hover:bg-white/10">
                  Essential only
                </button>
                <button type="button" onClick={acceptAll} className="btn-primary rounded-xl px-5 py-3 text-sm">
                  Accept all
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {(showPreferences || consent) && !showBanner ? (
        <button
          type="button"
          onClick={() => setShowPreferences(true)}
          className="fixed bottom-4 left-4 z-40 rounded-full border border-black/10 bg-white/95 px-4 py-2 text-xs font-extrabold text-gray-900 shadow-lg backdrop-blur dark:border-white/10 dark:bg-[rgba(12,20,16,0.96)] dark:text-white"
        >
          Cookies: {cookieConsentLabel(consent)}
        </button>
      ) : null}

      {showPreferences ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-3xl border border-black/10 bg-white p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)] dark:border-white/10 dark:bg-[rgb(12,20,16)]">
            <div className="space-y-2">
              <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-primary">Cookie Settings</p>
              <h3 className="text-2xl font-extrabold text-gray-950 dark:text-white">Choose how RHOVIC uses cookies</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Essential cookies are always on because they keep your account, cart, and secure sessions working properly.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-black/10 p-4 dark:border-white/10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-extrabold text-gray-950 dark:text-white">Essential cookies</p>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Required for login, security, cart state, and core site performance.</p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-extrabold text-primary">Always active</span>
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 p-4 dark:border-white/10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-extrabold text-gray-950 dark:text-white">Analytics cookies</p>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Help us understand visits, top pages, and site usage so we can improve the marketplace.</p>
                  </div>
                  <label className="inline-flex cursor-pointer items-center gap-3">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{analyticsEnabled ? "On" : "Off"}</span>
                    <input
                      type="checkbox"
                      checked={analyticsEnabled}
                      onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                      className="h-5 w-5 rounded border-black/20 text-primary focus:ring-primary"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setShowPreferences(false)} className="rounded-xl border border-black/10 px-5 py-3 text-sm font-extrabold text-gray-900 transition hover:bg-black/5 dark:border-white/10 dark:text-white dark:hover:bg-white/10">
                Cancel
              </button>
              <button type="button" onClick={savePreferences} className="btn-primary rounded-xl px-5 py-3 text-sm">
                Save preferences
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

