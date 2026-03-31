export type CookieConsent = {
  essential: true;
  analytics: boolean;
  updatedAt: string;
};

const STORAGE_KEY = "rhovic-cookie-consent";
const EVENT_NAME = "rhovic-cookie-consent-changed";

export function getCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CookieConsent>;
    if (typeof parsed.analytics !== "boolean") return null;
    return {
      essential: true,
      analytics: parsed.analytics,
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function saveCookieConsent(consent: CookieConsent) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: consent }));
}

export function onCookieConsentChange(callback: (consent: CookieConsent | null) => void) {
  if (typeof window === "undefined") return () => {};
  const handler = (event: Event) => {
    const detail = (event as CustomEvent<CookieConsent>).detail;
    callback(detail || getCookieConsent());
  };
  window.addEventListener(EVENT_NAME, handler as EventListener);
  return () => window.removeEventListener(EVENT_NAME, handler as EventListener);
}

export function cookieConsentLabel(consent: CookieConsent | null) {
  if (!consent) return "Not set";
  return consent.analytics ? "Essential + analytics" : "Essential only";
}

export function buildConsent(analytics: boolean): CookieConsent {
  return {
    essential: true,
    analytics,
    updatedAt: new Date().toISOString(),
  };
}

